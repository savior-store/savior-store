// ==========================================
// Savior Store Bot - v1.0
// ==========================================

(function() {
  // ===== إعدادات =====
  const CONFIG = {
    whatsapp: "964XXXXXXXXX", // ← بدّل رقمك هون
    storeName: "Savior Store"
  };

  // ===== الحالة =====
  let botState = {
    open: false,
    step: "home",     // الشاشة الحالية
    data: {           // بيانات الزبون
      game: null,
      category: null,
      pack: null,
      price: null,
      payment: null,
      playerId: null
    }
  };

  // ===== بناء واجهة البوت =====
  function buildUI() {
    const html = `
      <!-- الزر العائم -->
      <div id="sv-bot-button" onclick="svBot.open()">
        💬
      </div>

      <!-- نافذة البوت -->
      <div id="sv-bot-window">
        <div id="sv-bot-header">
          <div class="sv-title">🛡️ ${CONFIG.storeName}</div>
          <div class="sv-close" onclick="svBot.close()">✕</div>
        </div>
        <div id="sv-bot-content"></div>
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', html);
  }

  // ===== بناء الستايل =====
  function buildCSS() {
    const css = `
      /* الزر العائم */
      #sv-bot-button {
        position: fixed;
        bottom: 20px;
        left: 20px;
        width: 60px;
        height: 60px;
        border-radius: 50%;
        background: linear-gradient(135deg, #8b5cf6, #ec4899);
        color: white;
        font-size: 28px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        box-shadow: 0 4px 20px rgba(139,92,246,0.5);
        z-index: 9998;
        transition: transform 0.3s;
      }
      #sv-bot-button:hover { transform: scale(1.1); }

      /* النافذة */
      #sv-bot-window {
        position: fixed;
        bottom: 90px;
        left: 20px;
        width: 340px;
        max-width: calc(100vw - 40px);
        height: 500px;
        max-height: calc(100vh - 120px);
        background: #12122a;
        border-radius: 16px;
        box-shadow: 0 10px 40px rgba(0,0,0,0.6);
        border: 1px solid #2a2a4a;
        display: none;
        flex-direction: column;
        overflow: hidden;
        z-index: 9999;
      }
      #sv-bot-window.open { display: flex; }

      /* الهيدر */
      #sv-bot-header {
        background: linear-gradient(135deg, #8b5cf6, #ec4899);
        padding: 14px 18px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        color: white;
      }
      .sv-title { font-weight: bold; font-size: 16px; }
      .sv-close {
        cursor: pointer;
        font-size: 20px;
        opacity: 0.8;
        padding: 0 5px;
      }
      .sv-close:hover { opacity: 1; }

      /* المحتوى */
      #sv-bot-content {
        flex: 1;
        overflow-y: auto;
        padding: 18px;
        color: #fff;
        font-family: 'Segoe UI', Arial, sans-serif;
      }

      /* الرسائل */
      .sv-msg {
        background: #1a1a3a;
        padding: 12px 15px;
        border-radius: 12px;
        margin-bottom: 12px;
        font-size: 14px;
        line-height: 1.5;
      }

      /* الأزرار */
      .sv-btn {
        display: block;
        width: 100%;
        padding: 12px 15px;
        margin-bottom: 8px;
        background: #1e1e42;
        border: 1px solid #3a3a5a;
        border-radius: 10px;
        color: #fff;
        font-size: 14px;
        cursor: pointer;
        text-align: right;
        transition: all 0.2s;
        font-family: inherit;
      }
      .sv-btn:hover {
        background: #2a2a52;
        border-color: #8b5cf6;
        transform: translateX(-3px);
      }
      .sv-btn.primary {
        background: linear-gradient(135deg, #8b5cf6, #ec4899);
        border: none;
      }
      .sv-btn.primary:hover {
        filter: brightness(1.15);
      }
      .sv-btn.back {
        background: transparent;
        border: 1px dashed #3a3a5a;
        color: #9090b0;
        font-size: 13px;
        margin-top: 10px;
      }

      /* شريط التقدم */
      .sv-progress {
        font-size: 11px;
        color: #6060a0;
        margin-bottom: 12px;
        text-align: center;
      }

      /* الموبايل */
      @media (max-width: 500px) {
        #sv-bot-window {
          width: calc(100vw - 20px);
          left: 10px;
          bottom: 90px;
          height: calc(100vh - 120px);
        }
      }
    `;
    const style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);
  }

  // ===== الشاشات =====
  const SCREENS = {
    // 1. الشاشة الرئيسية
    home: () => `
      <div class="sv-msg">👋 هلا وسهلا! شو بدك تطلب اليوم؟</div>
      <button class="sv-btn primary" onclick="svBot.go('games')">🎮 اختر لعبتك</button>
      <button class="sv-btn" onclick="svBot.go('contact')">📞 تواصل معنا</button>
    `,

    // 2. اختيار اللعبة
    games: () => `
      <div class="sv-progress">1 / 4</div>
      <div class="sv-msg">🎮 اختار اللعبة:</div>
      <button class="sv-btn" onclick="svBot.choose('game','pubg')">🔫 ببجي موبايل</button>
      <button class="sv-btn" onclick="svBot.choose('game','freefire')">🔥 فري فاير</button>
      <button class="sv-btn" onclick="svBot.choose('game','jawaker')">🃏 جواكر</button>
      <button class="sv-btn" onclick="svBot.choose('game','coc')">🛡️ كلاش أوف كلانس</button>
      <button class="sv-btn" onclick="svBot.choose('game','royale')">👑 كلاش رويال</button>
      <button class="sv-btn" onclick="svBot.choose('game','fortnite')">🎯 فورتنايت</button>
      <button class="sv-btn back" onclick="svBot.go('home')">← رجوع</button>
    `,

    // 3. اختيار الفئة
    category: () => {
      const game = botState.data.game;
      const names = {
        pubg: "ببجي", freefire: "فري فاير", jawaker: "جواكر",
        coc: "كلاش أوف كلانس", royale: "كلاش رويال", fortnite: "فورتنايت"
      };
      return `
        <div class="sv-progress">2 / 4</div>
        <div class="sv-msg">اخترت: <b>${names[game]}</b><br>شو بدك؟</div>
        <button class="sv-btn primary" onclick="svBot.choose('category','accounts')">🎮 حسابات</button>
        <button class="sv-btn primary" onclick="svBot.choose('category','currency')">💎 شدات / جواهر</button>
        <button class="sv-btn back" onclick="svBot.go('games')">← رجوع</button>
      `;
    },

    // 4. اختيار الباقة (نموذج مبدئي)
    packs: () => {
      const { game, category } = botState.data;
      const names = {
        pubg: "ببجي", freefire: "فري فاير", jawaker: "جواكر",
        coc: "كلاش أوف كلانس", royale: "كلاش رويال", fortnite: "فورتنايت"
      };
      const label = category === "currency" ? "شدات/جواهر" : "حسابات";
      return `
        <div class="sv-progress">3 / 4</div>
        <div class="sv-msg">${names[game]} - ${label}<br>اختار الباقة:</div>
        <button class="sv-btn" onclick="svBot.choosePack('باقة 1', 5)">باقة 1 - 5$</button>
        <button class="sv-btn" onclick="svBot.choosePack('باقة 2', 25)">باقة 2 - 25$</button>
        <button class="sv-btn" onclick="svBot.choosePack('باقة 3', 50)">باقة 3 - 50$</button>
        <button class="sv-btn" onclick="svBot.choosePack('باقة 4', 120)">باقة 4 - 120$</button>
        <button class="sv-btn back" onclick="svBot.go('category')">← رجوع</button>
      `;
    },

    // 5. طريقة الدفع
    payment: () => `
      <div class="sv-progress">4 / 4</div>
      <div class="sv-msg">✅ اخترت: <b>${botState.data.pack}</b><br>السعر: <b>${botState.data.price}$</b><br><br>اختار طريقة الدفع:</div>
      <button class="sv-btn primary" onclick="svBot.choose('payment','شام كاش')">💵 شام كاش</button>
      <button class="sv-btn primary" onclick="svBot.choose('payment','سيرياتيل كاش')">📱 سيرياتيل كاش</button>
      <button class="sv-btn back" onclick="svBot.go('packs')">← رجوع</button>
    `,

    // 6. تأكيد الطلب
    confirm: () => `
      <div class="sv-msg">
        ✅ <b>ملخص الطلب:</b><br><br>
        🎮 اللعبة: ${botState.data.game}<br>
        📦 الباقة: ${botState.data.pack}<br>
        💰 السعر: ${botState.data.price}$<br>
        💳 الدفع: ${botState.data.payment}<br><br>
        للاتمام، اضغط الزر تحت.
      </div>
      <button class="sv-btn primary" onclick="svBot.sendWhatsApp()">
        📲 اتمام الطلب عبر واتساب
      </button>
      <button class="sv-btn back" onclick="svBot.go('payment')">← رجوع</button>
    `,

    // 7. تواصل
    contact: () => `
      <div class="sv-msg">📞 كيف بدك تتواصل معنا؟</div>
      <button class="sv-btn primary" onclick="svBot.sendWhatsApp()">📲 واتساب</button>
      <button class="sv-btn back" onclick="svBot.go('home')">← رجوع</button>
    `
  };

  // ===== دوال البوت =====
  window.svBot = {
    open: () => {
      botState.open = true;
      document.getElementById('sv-bot-window').classList.add('open');
      svBot.go('home');
    },

    close: () => {
      botState.open = false;
      document.getElementById('sv-bot-window').classList.remove('open');
    },

    go: (screen) => {
      botState.step = screen;
      const content = document.getElementById('sv-bot-content');
      content.innerHTML = SCREENS[screen]();
      content.scrollTop = 0;
    },

    choose: (key, value) => {
      botState.data[key] = value;
      // الانتقال للشاشة التالية
      if (key === 'game') svBot.go('category');
      if (key === 'category') svBot.go('packs');
      if (key === 'payment') svBot.go('confirm');
    },

    choosePack: (pack, price) => {
      botState.data.pack = pack;
      botState.data.price = price;
      svBot.go('payment');
    },

    sendWhatsApp: () => {
      const d = botState.data;
      let msg = `السلام عليكم، بدي أطلب من Savior Store:%0A%0A`;
      if (d.game) msg += `🎮 اللعبة: ${d.game}%0A`;
      if (d.category) msg += `📂 الفئة: ${d.category}%0A`;
      if (d.pack) msg += `📦 الباقة: ${d.pack}%0A`;
      if (d.price) msg += `💰 السعر: ${d.price}$%0A`;
      if (d.payment) msg += `💳 الدفع: ${d.payment}%0A`;
      window.open(`https://wa.me/${CONFIG.whatsapp}?text=${msg}`, '_blank');
    }
  };

  // ===== التشغيل =====
  function init() {
    buildCSS();
    buildUI();
    console.log('🛡️ Savior Bot loaded');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
