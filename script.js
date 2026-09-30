/**
 * LOVEGAME I ｜ 戀愛別裝忙
 * Interactive Engine & Gamification Controller
 */

document.addEventListener('DOMContentLoaded', () => {
  // --- 1. CRT Scanlines Toggle ---
  const crtToggleBtn = document.getElementById('crt-toggle-btn');
  const body = document.body;

  if (crtToggleBtn) {
    crtToggleBtn.addEventListener('click', () => {
      const isEnabled = body.classList.toggle('crt-enabled');
      const textSpan = crtToggleBtn.querySelector('.btn-text');
      if (textSpan) {
        textSpan.textContent = isEnabled ? '[CRT: ON]' : '[CRT: OFF]';
      }
    });
  }

  // --- 2. Mobile Navigation Drawer ---
  const menuToggleBtn = document.getElementById('menu-toggle-btn');
  const mobileDrawer = document.getElementById('mobile-nav-drawer');

  if (menuToggleBtn && mobileDrawer) {
    menuToggleBtn.addEventListener('click', () => {
      mobileDrawer.classList.toggle('open');
    });

    // Close drawer when clicking a link
    mobileDrawer.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileDrawer.classList.remove('open');
      });
    });
  }

  // --- 3. Hero Arcade Mode Switcher (Partner vs Single/Crush) ---
  const tabPartner = document.getElementById('tab-partner');
  const tabSingle = document.getElementById('tab-single');
  const viewPartner = document.getElementById('view-partner');
  const viewSingle = document.getElementById('view-single');
  const screenModeTitle = document.getElementById('screen-mode-title');

  function switchMode(mode) {
    if (mode === 'partner') {
      tabPartner.classList.add('active');
      tabSingle.classList.remove('active');
      viewPartner.classList.add('active');
      viewSingle.classList.remove('active');
      screenModeTitle.textContent = 'ACTIVE MODE: PARTNER FILE';
    } else {
      tabSingle.classList.add('active');
      tabPartner.classList.remove('active');
      viewSingle.classList.add('active');
      viewPartner.classList.remove('active');
      screenModeTitle.textContent = 'ACTIVE MODE: CRUSH FILE [SLOT 1/3]';
    }
  }

  if (tabPartner && tabSingle) {
    tabPartner.addEventListener('click', () => switchMode('partner'));
    tabSingle.addEventListener('click', () => switchMode('single'));
  }

  // --- 4. Interactive EXP Simulation in Hero Terminal ---
  const simulateBtn = document.getElementById('simulate-action-btn');
  const hudRank = document.getElementById('hud-rank');
  const hudCombo = document.getElementById('hud-combo');
  let currentCombo = 7;

  if (simulateBtn) {
    simulateBtn.addEventListener('click', () => {
      currentCombo++;
      hudCombo.textContent = `x${currentCombo}`;
      hudRank.textContent = 'S';
      
      simulateBtn.textContent = '✓ 任務模擬完成！+150 EXP [Rank UP -> S]';
      simulateBtn.style.backgroundColor = 'var(--accent-green)';
      simulateBtn.style.borderColor = 'var(--accent-green)';
      simulateBtn.style.color = '#000';

      // Also trigger a small boost in the gamification card
      addGlobalExp(150);

      setTimeout(() => {
        simulateBtn.textContent = '[再次模擬打勾 +150 EXP]';
        simulateBtn.style.backgroundColor = '';
        simulateBtn.style.borderColor = '';
        simulateBtn.style.color = '';
      }, 2500);
    });
  }

  // Crush slot switcher in terminal
  const slotBtns = document.querySelectorAll('.slot-btn');
  slotBtns.forEach((btn, idx) => {
    btn.addEventListener('click', () => {
      slotBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      if (idx === 2) {
        alert('【系統提示】單身模式最多可同時鎖定 3 位心動曖昧對象，點擊輸入代號即可開啟新攻略槽位。');
      }
    });
  });

  // --- 5. Interactive Journey Task Checklist ---
  const taskRows = document.querySelectorAll('.task-row');
  taskRows.forEach(row => {
    row.addEventListener('click', (e) => {
      // Don't trigger if it's the draft demo trigger
      if (e.target.closest('#btn-toggle-draft-demo')) return;

      const checkbox = row.querySelector('.pixel-checkbox');
      const isDone = row.classList.contains('done');

      if (row.classList.contains('locked') && !row.classList.contains('draft-ready')) {
        // Locked task notification
        alert('【系統鎖定】該任務依倒數時程開放，請先完成前置階段或在草稿箱寫好預備文字。');
        return;
      }

      if (row.classList.contains('draft-ready')) {
        openDraftModal();
        return;
      }

      if (isDone) {
        row.classList.remove('done');
        row.classList.add('in-action');
        if (checkbox) checkbox.textContent = '☐';
      } else {
        row.classList.add('done');
        row.classList.remove('in-action');
        if (checkbox) checkbox.textContent = '✓';
        addGlobalExp(80);
      }
    });
  });

  // --- 6. Daily & Weekend Quest Board Clicking ---
  const questItems = document.querySelectorAll('.quest-item');
  questItems.forEach(item => {
    const btn = item.querySelector('.quest-done-btn');
    const toggleDone = () => {
      const isCompleted = item.classList.toggle('completed');
      if (btn) {
        btn.textContent = isCompleted ? '✓' : '☐';
      }
      if (isCompleted) {
        addGlobalExp(30);
      }
    };

    if (btn) btn.addEventListener('click', toggleDone);
    item.addEventListener('click', (e) => {
      if (e.target !== btn) toggleDone();
    });
  });

  // Global EXP Helper
  let globalExp = 2850;
  const maxExp = 3500;
  const expText = document.getElementById('exp-text');
  const expBarFill = document.getElementById('exp-bar-fill');

  function addGlobalExp(amount) {
    globalExp = Math.min(globalExp + amount, maxExp);
    if (expText) expText.textContent = `${globalExp.toLocaleString()} / ${maxExp.toLocaleString()}`;
    if (expBarFill) {
      const percentage = Math.round((globalExp / maxExp) * 100);
      expBarFill.style.width = `${percentage}%`;
    }
  }

  // --- 7. Chapter Archive Cassette Switcher ---
  const cassetteTabs = document.querySelectorAll('.cassette-tab');
  const archiveDetailCard = document.getElementById('archive-content');

  const chaptersData = {
    '2025': {
      title: '2025.10.14 交往兩週年・九份山城雨中約會',
      exp: '+1,100',
      rating: 'PERFECT CLEAR',
      letter: '「這一年我們搬了新家、換了工作，雖然常常忙到很晚，但謝謝你每次在我低潮時給我的溫暖擁抱。下山吃的那碗芋圓是我吃過最好吃的。第三年也請多多指教。」',
      sign: '— 寫於 2025.10.14 旅程圓滿日',
      notes: [
        '<strong>[NOTE] 經驗記錄：</strong>九份週末容易下雨且塞車，下次重要日若出遊，一定要提前 3 週確認包車或飯店停車位。',
        '<strong>[ITEM] 禮物反饋：</strong>手沖咖啡濾杯她非常喜歡，每天早上都有用。',
        '<strong>[TIP] 下一次提醒：</strong>下一次週年紀念日，提早 45 天開始在 App FILE 設定，不踩雷。'
      ]
    },
    '2024': {
      title: '2024.08.20 晴晴 25 歲生日・初次手作皮革相機背帶',
      exp: '+920',
      rating: 'GREAT SUCCESS',
      letter: '「第一次在工坊敲字敲到手酸，雖然邊角縫線有一點點歪，但希望它能陪你記錄我們以後看見的所有風景。生日快樂，我的專屬攝影師。」',
      sign: '— 寫於 2024.08.20 生日夜',
      notes: [
        '<strong>[NOTE] 手作體驗：</strong>皮革敲字需預留至少 14 天工期，不能抓太緊。',
        '<strong>[ITEM] 禮物反饋：</strong>她拿到當場紅了眼眶，直接換到富士相機上。',
        '<strong>[TIP] 下一次提醒：</strong>餐廳訂位要避開吵鬧的開放吧台區。'
      ]
    },
    'future': {
      title: '2026.10.14 交往三週年準備篇章 [進行中旅程]',
      exp: '預估 +1,400',
      rating: 'IN PROGRESS',
      letter: '「（目前在草稿箱保存中）……今年我們經歷了許多挑戰，下個月就是三週年了，這次要一起去那座我們說好很久的南方海島。」',
      sign: '— 自動快照保存中',
      notes: [
        '<strong>[NOTE] 當前階段：</strong>行程已初步確認，目前進入禮物挑選階段。',
        '<strong>[TIP] 倒數狀態：</strong>還有 47 天，進度符合預期，Combo 維持中。'
      ]
    }
  };

  cassetteTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      cassetteTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const chapterKey = tab.dataset.chapter;
      const data = chaptersData[chapterKey];
      if (data && archiveDetailCard) {
        archiveDetailCard.querySelector('.archive-title').textContent = data.title;
        archiveDetailCard.querySelector('.pill-item strong.color-gold').textContent = data.exp;
        archiveDetailCard.querySelector('.pill-item strong.color-green').textContent = data.rating;
        archiveDetailCard.querySelector('.card-letter-box p').textContent = data.letter;
        archiveDetailCard.querySelector('.letter-sign').textContent = data.sign;

        const notesList = archiveDetailCard.querySelector('.notes-list');
        if (notesList) {
          notesList.innerHTML = data.notes.map(note => `<li>${note}</li>`).join('');
        }
      }
    });
  });

  // --- 8. Draft Modal Previews ---
  const draftModal = document.getElementById('draft-modal');
  const btnToggleDraft = document.getElementById('btn-toggle-draft-demo');
  const draftCloseBtn = document.getElementById('draft-modal-close-btn');
  const draftOkBtn = document.getElementById('draft-modal-ok-btn');

  function openDraftModal() {
    if (draftModal) {
      draftModal.classList.add('open');
      draftModal.setAttribute('aria-hidden', 'false');
    }
  }

  function closeDraftModal() {
    if (draftModal) {
      draftModal.classList.remove('open');
      draftModal.setAttribute('aria-hidden', 'true');
    }
  }

  if (btnToggleDraft) btnToggleDraft.addEventListener('click', openDraftModal);
  if (draftCloseBtn) draftCloseBtn.addEventListener('click', closeDraftModal);
  if (draftOkBtn) draftOkBtn.addEventListener('click', closeDraftModal);

  // --- 9. Early Access Form & Success Modal ---
  const form = document.getElementById('early-access-form');
  const successModal = document.getElementById('success-modal');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const modalOkBtn = document.getElementById('modal-ok-btn');
  const emailInput = document.getElementById('user-email');
  const modalEmailDisplay = document.getElementById('modal-email-display');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = emailInput.value.trim();
      if (!email) return;

      if (modalEmailDisplay) {
        modalEmailDisplay.textContent = email;
      }

      if (successModal) {
        successModal.classList.add('open');
        successModal.setAttribute('aria-hidden', 'false');
      }

      emailInput.value = '';
    });
  }

  function closeSuccessModal() {
    if (successModal) {
      successModal.classList.remove('open');
      successModal.setAttribute('aria-hidden', 'true');
    }
  }

  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeSuccessModal);
  if (modalOkBtn) modalOkBtn.addEventListener('click', closeSuccessModal);

  // Close modals on backdrop click
  window.addEventListener('click', (e) => {
    if (e.target === successModal) closeSuccessModal();
    if (e.target === draftModal) closeDraftModal();
  });
});
