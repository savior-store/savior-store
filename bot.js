// ==========================================
// Savior Store Bot - v2.0
// ==========================================

(function() {
  const CONFIG = {
    whatsapp: "964XXXXXXXXX" // ← بدّل رقمك هون
  };

  // ===== الباقات =====
  const PACKS = {
    pubg: {
      accounts: [
        { name: "حساب مستوى 30", price: 15 },
        { name: "حساب مستوى 45", price: 35 },
        { name: "حساب مستوى 60", price: 70 },
        { name: "حساب كونكر", price: 150 }
      ],
      currency: [
        { name: "60 UC", price: 5 },
        { name: "325 UC", price: 25 },
        { name: "660 UC", price: 50 },
        { name: "1800 UC", price: 120 }
      ]
    },
    freefire: {
      accounts: [
        { name: "حساب عادي", price: 15 },
        { name: "حساب هيرو", price: 40 },
        { name: "حساب أسطوري", price: 90 },
        { name: "حساب نادر", price: 200 }
      ],
      currency: [
        { name: "100 جواهر", price: 5 },
        { name: "520 جواهر", price: 25 },
        { name: "1060 جواهر", price: 50 },
        { name: "2180 جواهر", price: 100 }
      ]
    },
    jawaker: {
      accounts: [
        { name: "حساب مبتدئ", price: 10 },
        { name: "حساب متوسط", price: 25 },
        { name: "حساب متقدم", price: 50 },
        { name: "حساب VIP", price: 100 }
      ],
      currency: [
        { name: "1000 شدة", price: 5 },
        { name: "5000 شدة", price: 25 },
        { name: "10000 شدة", price: 50 },
        { name: "25000 شدة", price: 120 }
      ]
    },
    coc: {
      accounts: [
        { name: "TH 8", price: 15 },
        { name: "TH 11", price: 40 },
        { name: "TH 13", price: 80 },
        { name: "TH 15", price: 150 }
      ],
      currency: [
        { name: "500 جواهر", price: 5 },
        { name: "2500 جواهر", price: 25 },
        { name: "6500 جواهر", price: 50 },
        { name: "14000 جواهر", price: 100 }
      ]
    },
    royale: {
      accounts: [
        { name: "حساب أرينا 5", price: 10 },
        { name: "حساب أرينا 8", price: 25 },
        { name: "حساب أرينا 11", price: 50 },
        { name: "حساب أرينا 14", price: 100 }
      ],
      currency: [
        { name: "500 جواهر", price: 5 },
        { name: "2500 جواهر", price: 25 },
        { name: "6500 جواهر", price: 50 },
        { name: "14000 جواهر", price: 100 }
      ]
    },
    fortnite: {
      accounts: [
        { name: "حساب عادي", price: 15 },
        { name: "حساب OG", price: 40 },
        { name: "حساب نادر", price: 90 },
        { name: "حساب رينيجيد", price: 250 }
      ],
      currency: [
        { name: "1000 V-Bucks", price: 8 },
        { name: "2800 V-Bucks", price: 20 },
        { name: "5000 V-Bucks", price: 35 },
        { name: "13500 V-Bucks", price: 90 }
      ]
    }
  };

  const GAME_NAMES = {
    pubg: "🔫 ببجي موبايل",
    freefire: "🔥 فري فاير",
    jawaker: "🃏 جواكر",
    coc: "🛡️ كلاش أوف كلانس",
    royale: "👑 كلاش رويال",
    fortnite: "🎯 فورتنايت"
  };

  const CURRENCY_LABELS = {
    pubg: "شدات UC",
    freefire: "جواهر",
    jawaker: "شدات",
    coc: "جواهر",
    royale: "جواهر",
    fortnite: "V-Bucks"
  };

  // ===== الحالة =====
  let botState = {
    open: false,
    data: { game: null, category: null, pack: null, price: null }
  };

  // ===== UI =====
  function buildUI() {
    const html = `
      <div id="sv-bot-window">
        <div id="sv-bot-header">
          <div class="sv-title">🛡️ Savior Store</div>
          <div class="sv-close" onclick="svBot.close()">✕</div>
        </div>
        <div id="sv-bot-content"></div>
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', html);
  }

  function buildCSS() {
    const css = `
      #sv-bot-window {
        position: fixed;
        bottom: 20px;
        left: 20px;
        width: 360px;
        max-width: calc(100vw - 40px);
        height: 520px;
        max-height: calc(100vh - 40px);
        background: #12122a;
        border-radius: 16px;
        box-shadow: 0 10px 40px rgba(0,0,0,0.7);
        border: 1px solid #2a2a4a;
        display: none;
        flex-direction: column;
        overflow: hidden;
        z-index: 9999;
      }
      #sv-bot-window.open { display: flex; }

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

      #sv-bot-content {
        flex: 1;
        overflow-y: auto;
        padding: 18px;
        color: #fff;
        font-family: 'Segoe UI', Arial, sans-serif;
      }

      .sv-msg {
        background: #1a1a3a;
        padding: 12px 15px;
        border-radius: 12px;
        margin-bottom: 12px;
        font-size: 14px;
        line-height: 1.5;
      }

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
      .sv-btn.primary:hover { filter: brightness(1.15); }
      .sv-btn.back {
        background: transparent;
        border: 1px dashed #3a3a5a;
        color: #9090b0;
        font-size: 13px;
        margin-top: 10px;
      }

      @media (max-width: 500px) {
        #sv-bot-window {
          width: calc(100vw - 20px);
          left: 10px;
          bottom: 10px;
          height: calc(100vh - 20px);
        }
      }
    `;
    const style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);
  }

  // ===== دوال البوت =====
  window.svBot = {
    open: () => {
      botState.open = true;
      document.getElementById('sv-bot-window').classList.add('open');
    },

    close: () => {
      botState.open = false;
      document.getElementById('sv-bot-window').classList.remove('open');
    },

    openFromGame: (game, category) => {
      botState.data = { game, category, pack: null, price: null };
      svBot.open();
      svBot.showPacks();
    },

    showPacks: () => {
      const { game, category } = botState.data;
      const packs = PACKS[game][category];
      const categoryLabel = category === 'currency' ? CURRENCY_LABELS[game] : 'حسابات';

      let html = `
        <div class="sv-msg">
          ${GAME_NAMES[game]}<br>
          <b>${categoryLabel}</b><br><br>
          اختار الباقة:
        </div>
      `;

      packs.forEach((p, i) => {
        html += `<button class="sv-btn primary" onclick="svBot.choosePack(${i})">${p.name} — ${p.price}$</button>`;
      });

      html += `<button class="sv-btn back" onclick="svBot.close()">✕ إغلاق</button>`;

      document.getElementById('sv-bot-content').innerHTML = html;
    },

    choosePack: (index) => {
      const { game, category } = botState.data;
      const pack = PACKS[game][category][index];
      botState.data.pack = pack.name;
      botState.data.price = pack.price;
      svBot.showPayment();
    },

    showPayment: () => {
      const d = botState.data;
      const html = `
        <div class="sv-msg">
          ✅ اخترت: <b>${d.pack}</b><br>
          💰 السعر: <b>${d.price}$</b><br><br>
          اختار طريقة الدفع:
        </div>
        <button class="sv-btn primary" onclick="svBot.choosePayment('شام كاش')">💵 شام كاش</button>
        <button class="sv-btn primary" onclick="svBot.choosePayment('سيرياتيل كاش')">📱 سيرياتيل كاش</button>
        <button class="sv-btn back" onclick="svBot.showPacks()">← رجوع</button>
      `;
      document.getElementById('sv-bot-content').innerHTML = html;
    },

    choosePayment: (method) => {
      botState.data.payment = method;
      svBot.showConfirm();
    },

    showConfirm: () => {
      const d = botState.data;
      const html = `
        <div class="sv-msg">
          📋 <b>ملخص الطلب:</b><br><br>
          🎮 اللعبة: ${GAME_NAMES[d.game]}<br>
          📦 الباقة: ${d.pack}<br>
          💰 السعر: ${d.price}$<br>
          💳 الدفع: ${d.payment}<br><br>
          للاتمام، اضغط الزر تحت:
        </div>
        <button class="sv-btn primary" onclick="svBot.sendWhatsApp()">📲 إتمام الطلب</button>
        <button class="sv-btn back" onclick="svBot.showPayment()">← رجوع</button>
      `;
      document.getElementById('sv-bot-content').innerHTML = html;
    },

    sendWhatsApp: () => {
      const d = botState.data;
      let msg = `السلام عليكم، بدي أطلب من Savior Store:%0A%0A`;
      msg += `🎮 اللعبة: ${GAME_NAMES[d.game]}%0A`;
      msg += `📦 الباقة: ${d.pack}%0A`;
      msg += `💰 السعر: ${d.price}$%0A`;
      msg += `💳 الدفع: ${d.payment}%0A`;
      window.open(`https://wa.me/${CONFIG.whatsapp}?text=${msg}`, '_blank');
    }
  };

  // ===== التشغيل =====
  function init() {
    buildCSS();
    buildUI();
    console.log('🛡️ Savior Bot v2 loaded');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
