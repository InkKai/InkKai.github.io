/* =====================================================
   在這裡改成你們自己的內容 ↓↓↓
   ===================================================== */
const CONFIG = {
  herName: '阿米',                           // 開場標題：Hi, 阿米
  nicknames: ['阿米', '大米', '悠咪', '小夏🐽', '古靈精怪小姐'], // 點名字會輪流換
  timerLabel: '我們認識已經',
  startDate: '2024-12-16T00:42:00',          // 認識的時間
  question: '下次休假，要不要一起吃飯？',    // 也可以改成「今晚要不要雙排？」
  yesMessage: '收到，我來訂位 ✓<br>這次不准已讀亂回',

  // 找齊全部彩蛋才看得到的話（\n 換行）
  secretEnding: '你真的很古靈精怪欸，連這個都找得到。\n謝謝你那天說「那就不要變成無聊大人阿」。\n所以我還在努力，不變成無聊的大人。',

  terminal: [
    '$ whoami',
    '悠米（自稱）',
    '一個話越來越少的工程師（你說不信）',
    '$ cat 已讀亂回.log',
    'Q：你喜歡男生還是女生',
    'A：女生',
    '……我會記起來的',
    '$ ./plan --next-day-off',
    '想跟你一起看劇，不會偷看的那種 ✓'
  ],

  memories: [
    { date: '2024-12-16', type: 'init', msg: 'Initial commit：認識你', desc: '凌晨 00:42，第一句話' },
    { date: '2026-09-17', type: 'feat', msg: '說好要多打字聊天', desc: '你說「那就不要變成無聊大人阿」' },
    { date: '2026-09-24', type: 'bug',  msg: '已讀亂回事件',     desc: '已記錄，永久保存' },
    { date: '2026-09-24', type: 'fix',  msg: '被抓到偷偷看劇',   desc: '補藥補藥，好尷尬' },
    { date: '2026-09-25', type: 'todo', msg: '一起吃一頓飯',     desc: '等你回答最下面那題' }
  ]
};

// 終端機隱藏指令（輸入的字轉小寫後比對）。回傳字串或函式
const SECRET_COMMANDS = {
  '悠米': '（黏到你身上了，甩不掉）🐱',
  '我是悠米': '我知道，你說過三次了',
  '阿妮': '噓——不可以說出去的 🤫',
  '補藥': '補藥補藥補藥補藥補藥補藥',
  '已讀亂回': 'Q：你喜歡男生還是女生\nA：女生\n→ 已截圖，永久保存 📸',
  '歪踢': '被抓到在偷偷看劇了吧 📺',
  '吃飯': '權限已授予 ✓ 時間地點你挑',
  'sudo 吃飯': '[sudo] 不用密碼，直接同意 ✓',
  '雙排': '已送出邀請，等你按接受 🎮',
  '早安': '大米早 ☀️',
  '大米': '大米早（不管現在幾點）',
  '小夏': () => { pigRain(); return '🐽🐽🐽'; },
  '🐽': () => { pigRain(); return '🐽🐽🐽'; },
  'exit': 'exit 失敗：你走不掉的 :P',
  'rm -rf /': '拒絕：回憶不能刪',
  'rm -rf': '拒絕：回憶不能刪',
  'sudo': '你要 sudo 什麼？'
};
/* ===================================================== */

const $ = (id) => document.getElementById(id);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const DPR = Math.min(window.devicePixelRatio || 1, 2);
const daysSince = () => Math.floor((Date.now() - new Date(CONFIG.startDate).getTime()) / 86400000);

/* 連點偵測：n 次、在 windowMs 內 */
function multiTap(el, n, windowMs, fn) {
  let count = 0, timer = null;
  el.addEventListener('click', (e) => {
    count++;
    clearTimeout(timer);
    timer = setTimeout(() => { count = 0; }, windowMs);
    if (count >= n) { count = 0; fn(e); }
  });
}

/* ---------- 提示訊息 ---------- */
let toastTimer = null;
function toast(msg, ms = 2600) {
  const t = $('toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), ms);
}

/* ---------- 彩蛋系統 ---------- */
const EGGS = {
  nickname: { name: '換個稱呼',   hint: '開場的名字點點看' },
  mochi:    { name: '戳麻糬',     hint: '麻糬好像很怕癢，多戳幾下' },
  terminal: { name: '隱藏指令',   hint: '終端機可以打字，試試你們聊過的詞' },
  monitor:  { name: '亂戳監視器', hint: '心電圖一直戳會怎樣？' },
  pig:      { name: '小豬雨',     hint: '畫好的愛心連點三下' },
  no:       { name: '不放棄',     hint: '「下次好了」真的按不到嗎？多試幾次' },
  dev:      { name: '開發者模式', hint: '最底下那行小字，像 Android 一樣點七下' },
  lucky:    { name: '幸運小豬',   hint: '在空白的地方亂點，運氣好會遇到' }
};
const EGG_KEYS = Object.keys(EGGS);
let found = new Set();
try { found = new Set(JSON.parse(localStorage.getItem('eggs') || '[]').filter((k) => EGGS[k])); } catch (e) {}

function renderEggs() {
  $('egg-count').textContent = found.size;
  $('egg-total').textContent = EGG_KEYS.length;
  if (found.size === EGG_KEYS.length) showSecret(false);
}

function unlock(key) {
  if (found.has(key)) return;
  found.add(key);
  try { localStorage.setItem('eggs', JSON.stringify([...found])); } catch (e) {}
  const badge = $('egg-badge');
  badge.classList.remove('pop'); void badge.offsetWidth; badge.classList.add('pop');
  $('egg-count').textContent = found.size;
  if (navigator.vibrate) navigator.vibrate(25);
  if (found.size === EGG_KEYS.length) {
    toast(`🥚 找到彩蛋：${EGGS[key].name}（全部找齊了！往最下面看）`, 4000);
    setTimeout(() => showSecret(true), 1200);
  } else {
    toast(`🥚 找到彩蛋：${EGGS[key].name}（${found.size}/${EGG_KEYS.length}）`);
  }
}

function showSecret(scroll) {
  const s = $('secret');
  $('secret-text').textContent = CONFIG.secretEnding;
  s.hidden = false;
  if (scroll) {
    s.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' });
    const r = s.getBoundingClientRect();
    setTimeout(() => burst(innerWidth / 2, innerHeight / 2, 50), 600);
  }
}

$('egg-badge').addEventListener('click', () => {
  const left = EGG_KEYS.filter((k) => !found.has(k));
  if (!left.length) { toast('全部找到了，你真的很古靈精怪 🥚✨'); return; }
  const k = left[Math.floor(Math.random() * left.length)];
  toast(`提示：${EGGS[k].hint}`, 3200);
});

renderEggs();

/* ---------- 開場打字 ---------- */
async function typeText(el, text, speed) {
  for (const ch of text) {
    el.textContent += ch;
    await sleep(reduceMotion ? 0 : speed);
  }
}

const term = $('term');
function termPrint(text, cls = 'out') {
  const span = document.createElement('span');
  span.className = cls;
  span.textContent = text + '\n';
  term.insertBefore(span, term.querySelector('.term-input-line'));
  term.scrollTop = term.scrollHeight;
}

let introDone = false;
(async function intro() {
  const title = $('hero-title');
  await sleep(400);
  await typeText(title, `Hi, ${CONFIG.herName}`, 120);
  await sleep(500);
  title.classList.remove('cursor');

  for (const line of CONFIG.terminal) {
    const isCmd = line.startsWith('$');
    const span = document.createElement('span');
    span.className = isCmd ? 'cmd' : 'out';
    term.appendChild(span);
    await typeText(span, line, isCmd ? 55 : 30);
    term.appendChild(document.createTextNode('\n'));
    await sleep(reduceMotion ? 0 : (isCmd ? 300 : 550));
  }

  const hint = document.createElement('span');
  hint.className = 'hint';
  hint.textContent = '（這裡可以打字，輸入 help 看看）\n';
  term.appendChild(hint);
  setupTermInput();
  introDone = true;
  timeEggs();
})();

/* ---------- 可以打字的終端機 ---------- */
function setupTermInput() {
  const line = document.createElement('div');
  line.className = 'term-input-line';
  line.innerHTML = '<span class="cmd">$&nbsp;</span>';
  const input = document.createElement('input');
  input.className = 'term-input';
  input.type = 'text';
  input.autocomplete = 'off';
  input.autocapitalize = 'off';
  input.spellcheck = false;
  input.setAttribute('enterkeyhint', 'send');
  input.setAttribute('aria-label', '輸入指令');
  line.appendChild(input);
  term.appendChild(line);

  $('term').parentElement.addEventListener('click', () => input.focus({ preventScroll: true }));

  input.addEventListener('keydown', (e) => {
    if (e.isComposing || e.keyCode === 229) return; // 注音選字中
    if (e.key !== 'Enter') return;
    const raw = input.value.trim();
    input.value = '';
    if (!raw) return;
    termPrint('$ ' + raw, 'cmd');
    runCommand(raw);
  });
}

function runCommand(raw) {
  const cmd = raw.toLowerCase().replace(/\s+/g, ' ');
  const n = daysSince();

  if (cmd === 'help') {
    termPrint('可用指令：whoami、date、ping、clear\n還有一些隱藏指令，自己找找看 👀');
  } else if (cmd === 'whoami') {
    termPrint('悠米（自稱）');
  } else if (cmd === 'date') {
    termPrint(`今天是我們認識的第 ${n} 天`);
  } else if (cmd.startsWith('ping')) {
    const target = raw.slice(4).trim() || '阿米';
    termPrint(`64 bytes from ${target}: time=已讀亂回 ms\n64 bytes from ${target}: time=秒回 ms`);
  } else if (cmd === 'clear') {
    term.querySelectorAll(':scope > span, :scope > br').forEach((el) => el.remove());
    [...term.childNodes].forEach((node) => { if (node.nodeType === 3) node.remove(); });
  } else if (SECRET_COMMANDS[cmd] !== undefined) {
    const r = SECRET_COMMANDS[cmd];
    termPrint(typeof r === 'function' ? r() : r);
    unlock('terminal');
  } else {
    termPrint(`command not found: ${raw}（試試 help）`, 'hint');
  }
}

/* ---------- 名字點一下就換 ---------- */
let nickIdx = 0, nickTaps = 0;
$('hero-title').addEventListener('click', () => {
  if (!introDone) return;
  nickIdx = (nickIdx + 1) % CONFIG.nicknames.length;
  $('hero-title').textContent = `Hi, ${CONFIG.nicknames[nickIdx]}`;
  if (++nickTaps >= 2) unlock('nickname');
});

/* ---------- 戳麻糬 ---------- */
const mochi = $('mochi');
const speech = $('speech');
const mochiLines = ['好癢！', '不要戳啦', '再戳我要黏你了', '我是悠米！'];
let mochiTaps = 0, speechTimer = null;
function say(text, ms = 1800) {
  speech.textContent = text;
  speech.hidden = false;
  clearTimeout(speechTimer);
  speechTimer = setTimeout(() => { speech.hidden = true; }, ms);
}
mochi.addEventListener('click', () => {
  mochiTaps++;
  mochi.classList.remove('squish', 'spin'); void mochi.offsetWidth;
  if (mochiTaps >= 5) {
    mochiTaps = 0;
    mochi.classList.add('spin');
    say('我是悠米！黏上你了 🐱', 2400);
    const r = mochi.getBoundingClientRect();
    burst(r.left + r.width / 2, r.top + r.height / 2, 20);
    unlock('mochi');
  } else {
    mochi.classList.add('squish');
    say(mochiLines[Math.min(mochiTaps - 1, mochiLines.length - 2)]);
  }
});

/* ---------- 時間彩蛋（不算在收集裡，打開的時間剛好才會看到） ---------- */
function timeEggs() {
  const now = new Date();
  const start = new Date(CONFIG.startDate);
  const h = now.getHours(), m = now.getMinutes();
  let msg = '';
  if (now.getMonth() === start.getMonth() && now.getDate() === start.getDate()) {
    msg = `🎉 今天是我們認識 ${now.getFullYear() - start.getFullYear()} 週年`;
  } else if (h === start.getHours() && m === start.getMinutes()) {
    msg = `${pad(h)}:${pad(m)}，是我們第一次說話的時間`;
  } else if (h >= 0 && h < 5) {
    msg = '這麼晚還沒睡？如果是大夜班，辛苦了 🌙';
  } else if (h >= 5 && h < 9) {
    msg = '大米早 ☀️';
  }
  if (msg) setTimeout(() => toast(msg, 3600), 800);
}

/* ---------- 心電圖 ---------- */
const ec = $('ecg');
const ex = ec.getContext('2d');
let EW = 0, EH = 0, ys = [], ecX = 0, phase = 0, acc = 0;
let bpm = 72, targetBpm = 72, ecgRunning = false, lastT = 0;

function ecgResize() {
  EW = ec.clientWidth;
  EH = ec.clientHeight;
  ec.width = EW * DPR;
  ec.height = EH * DPR;
  ex.setTransform(DPR, 0, 0, DPR, 0, 0);
  ys = new Array(Math.max(1, Math.ceil(EW))).fill(null);
  ecX = 0;
}

function ecgVal(p) {
  const g = (c, w, a) => a * Math.exp(-(((p - c) / w) ** 2));
  return g(.18, .025, .12) + g(.36, .01, -.12) + g(.39, .012, 1) + g(.42, .012, -.22) + g(.62, .045, .28);
}

function onBeat() {
  $('bpm').textContent = Math.round(bpm);
  const b = $('beat');
  b.classList.add('on');
  setTimeout(() => b.classList.remove('on'), 120);
}

function drawEcgPaper() {
  ex.clearRect(0, 0, EW, EH);
  ex.lineWidth = 1;
  for (let x = 0; x <= EW; x += 8) {
    ex.strokeStyle = x % 40 === 0 ? 'rgba(255,122,168,.28)' : 'rgba(255,122,168,.1)';
    ex.beginPath(); ex.moveTo(x + .5, 0); ex.lineTo(x + .5, EH); ex.stroke();
  }
  for (let y = 0; y <= EH; y += 8) {
    ex.strokeStyle = y % 40 === 0 ? 'rgba(255,122,168,.28)' : 'rgba(255,122,168,.1)';
    ex.beginPath(); ex.moveTo(0, y + .5); ex.lineTo(EW, y + .5); ex.stroke();
  }
}

function ecgLoop(now) {
  if (!ecgRunning) return;
  const dt = Math.min(0.05, (now - lastT) / 1000 || 0);
  lastT = now;
  bpm += (targetBpm - bpm) * Math.min(1, dt * 1.5);

  const speed = 110;
  acc += speed * dt;
  while (acc >= 1) {
    acc -= 1;
    phase += (bpm / 60) / speed;
    if (phase >= 1) { phase -= 1; onBeat(); }
    ecX = (ecX + 1) % ys.length;
    ys[ecX] = EH * 0.64 - ecgVal(phase) * EH * 0.52;
    for (let g = 1; g <= 16; g++) ys[(ecX + g) % ys.length] = null;
  }

  drawEcgPaper();
  ex.strokeStyle = '#ff4f8b';
  ex.lineWidth = 2.4;
  ex.lineJoin = 'round';
  ex.beginPath();
  let pen = false;
  for (let x = 0; x < ys.length; x++) {
    const y = ys[x];
    if (y === null) { pen = false; continue; }
    pen ? ex.lineTo(x, y) : ex.moveTo(x, y);
    pen = true;
  }
  ex.stroke();
  if (ys[ecX] !== null) {
    ex.fillStyle = '#ff4f8b';
    ex.beginPath();
    ex.arc(ecX, ys[ecX], 3.5, 0, Math.PI * 2);
    ex.fill();
  }
  requestAnimationFrame(ecgLoop);
}

ecgResize();
addEventListener('resize', ecgResize);

new IntersectionObserver((entries) => {
  const vis = entries[0].isIntersecting;
  if (vis && !ecgRunning) {
    ecgRunning = true;
    lastT = performance.now();
    requestAnimationFrame(ecgLoop);
  } else if (!vis) {
    ecgRunning = false;
  }
}).observe(ec);

const thinkBtn = $('think');
const dx = $('dx');
let dxBusy = false;
function setDx(text, alert) {
  dx.textContent = text;
  dx.classList.toggle('alert', !!alert);
}

thinkBtn.addEventListener('click', () => {
  dxBusy = true;
  targetBpm = 128;
  thinkBtn.disabled = true;
  setDx('判讀：竇性心搏過速（原因：想到你）', true);
  if (navigator.vibrate) navigator.vibrate([20, 80, 20]);
  setTimeout(() => {
    targetBpm = 72;
    setTimeout(() => {
      setDx('判讀：恢復正常竇性心律（但隨時會再發作）');
      thinkBtn.disabled = false;
      thinkBtn.textContent = '再看一次';
      dxBusy = false;
    }, 2500);
  }, 6000);
});

multiTap(ec, 5, 1500, () => {
  if (dxBusy) return;
  dxBusy = true;
  setDx('偵測到病人一直戳監視器，已通知護理站 🚨', true);
  unlock('monitor');
  setTimeout(() => { setDx('判讀：正常竇性心律（病人請不要亂動）'); dxBusy = false; }, 3500);
});

/* ---------- 計時 ---------- */
$('timer-label').textContent = CONFIG.timerLabel;
const pad = (n) => String(n).padStart(2, '0');
function tick() {
  const diff = Math.max(0, Date.now() - new Date(CONFIG.startDate).getTime());
  const s = Math.floor(diff / 1000);
  $('t-d').textContent = Math.floor(s / 86400).toLocaleString();
  $('t-h').textContent = pad(Math.floor((s % 86400) / 3600));
  $('t-m').textContent = pad(Math.floor((s % 3600) / 60));
  $('t-s').textContent = pad(s % 60);
}
tick();
setInterval(tick, 1000);

/* ---------- 心形方程式 ---------- */
const hc = $('heart');
const hx = hc.getContext('2d');
const HW = 400, HH = 360, CX = 200, CY = 168, S = 10;
hc.width = HW * DPR;
hc.height = HH * DPR;
hx.setTransform(DPR, 0, 0, DPR, 0, 0);

const heartPt = (t) => ({
  x: 16 * Math.sin(t) ** 3,
  y: 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)
});

function drawGrid() {
  hx.clearRect(0, 0, HW, HH);
  hx.lineWidth = 1;
  hx.strokeStyle = 'rgba(255,122,168,.13)';
  for (let x = CX % 20; x <= HW; x += 20) { hx.beginPath(); hx.moveTo(x, 0); hx.lineTo(x, HH); hx.stroke(); }
  for (let y = CY % 20; y <= HH; y += 20) { hx.beginPath(); hx.moveTo(0, y); hx.lineTo(HW, y); hx.stroke(); }
  hx.strokeStyle = 'rgba(255,122,168,.35)';
  hx.beginPath(); hx.moveTo(CX, 0); hx.lineTo(CX, HH); hx.stroke();
  hx.beginPath(); hx.moveTo(0, CY); hx.lineTo(HW, CY); hx.stroke();
}

function heartPath(upTo) {
  hx.beginPath();
  for (let u = 0; u <= upTo; u += 0.01) {
    const p = heartPt(u);
    const X = CX + p.x * S, Y = CY - p.y * S;
    u === 0 ? hx.moveTo(X, Y) : hx.lineTo(X, Y);
  }
  const p = heartPt(upTo);
  hx.lineTo(CX + p.x * S, CY - p.y * S);
}

function strokeHeart(upTo) {
  heartPath(upTo);
  hx.strokeStyle = '#ff5c93';
  hx.lineWidth = 3.5;
  hx.lineCap = 'round';
  hx.lineJoin = 'round';
  hx.stroke();
}

let heartLabel = 'for you';
function animateHeart() {
  const TAU = Math.PI * 2;
  let t = reduceMotion ? TAU : 0;
  (function draw() {
    t = Math.min(TAU, t + 0.035);
    drawGrid();
    strokeHeart(t);
    if (t < TAU) {
      const p = heartPt(t);
      hx.fillStyle = '#ff5c93';
      hx.beginPath();
      hx.arc(CX + p.x * S, CY - p.y * S, 6, 0, TAU);
      hx.fill();
      requestAnimationFrame(draw);
    } else {
      fillHeart(reduceMotion ? 1 : 0);
    }
  })();
}

function fillHeart(a) {
  drawGrid();
  heartPath(Math.PI * 2);
  hx.fillStyle = `rgba(255,143,184,${0.4 * a})`;
  hx.fill();
  strokeHeart(Math.PI * 2);
  hx.globalAlpha = a;
  hx.fillStyle = '#e8558a';
  hx.font = '600 28px Fredoka, "Noto Sans TC", sans-serif';
  hx.textAlign = 'center';
  hx.textBaseline = 'middle';
  hx.fillText(heartLabel, CX, CY - 10);
  hx.globalAlpha = 1;
  if (a < 1) requestAnimationFrame(() => fillHeart(Math.min(1, a + 0.03)));
}

drawGrid();
let heartStarted = false, heartDone = false;
new IntersectionObserver((entries, obs) => {
  if (entries[0].isIntersecting && !heartStarted) {
    heartStarted = true;
    setTimeout(animateHeart, 300);
    setTimeout(() => { heartDone = true; }, 3500);
    obs.disconnect();
  }
}, { threshold: 0.4 }).observe(hc);

multiTap(hc, 3, 900, () => {
  if (!heartDone) return;
  heartLabel = heartLabel === 'for you' ? '🐽' : 'for you';
  fillHeart(1);
  pigRain();
  unlock('pig');
});

/* ---------- git log ---------- */
function fakeHash(str) {
  let h = 2166136261;
  for (const c of str) h = Math.imul(h ^ c.codePointAt(0), 16777619) >>> 0;
  return h.toString(16).padStart(8, '0').slice(0, 7);
}
const log = $('gitlog');
CONFIG.memories.slice().reverse().forEach((m) => {
  const li = document.createElement('li');
  li.innerHTML =
    `<span class="hash">${fakeHash(m.date + m.msg)}</span>` +
    `<span class="date">${esc(m.date)}</span>` +
    `<span class="msg"><em>${esc(m.type)}:</em>${esc(m.msg)}</span>` +
    `<span class="desc">${esc(m.desc)}</span>`;
  log.appendChild(li);
});

/* ---------- 最後的問題 ---------- */
$('question').textContent = CONFIG.question;

const yesBtn = $('yes');
const noBtn = $('no');
const noTexts = ['下次好了', '確定？', '再想想嘛', '已讀亂回？', '按不到吧', '404 Not Found', '你很堅持欸', ':P'];
let tries = 0, gaveUp = false, answered = false;

function sayYes() {
  if (answered) return;
  answered = true;
  const r = yesBtn.getBoundingClientRect();
  burst(r.left + r.width / 2, r.top + r.height / 2, 50);
  $('btns').hidden = true;
  const ans = $('answer');
  ans.hidden = false;
  ans.innerHTML = CONFIG.yesMessage;
  if (navigator.vibrate) navigator.vibrate([30, 60, 30]);
  let n = 0;
  const timer = setInterval(() => {
    burst(Math.random() * innerWidth, Math.random() * innerHeight * 0.7, 14);
    if (++n > 6) clearInterval(timer);
  }, 280);
}

function dodge(e) {
  if (gaveUp) {
    if (e.type === 'mouseenter') return;
    e.preventDefault();
    sayYes();
    return;
  }
  e.preventDefault();
  tries++;
  if (tries >= 10) {
    gaveUp = true;
    noBtn.style.transform = 'none';
    noBtn.textContent = '好啦 ♡';
    noBtn.classList.remove('no');
    noBtn.classList.add('yes');
    unlock('no');
    toast('「下次好了」放棄逃跑了');
    return;
  }
  const area = $('btns').getBoundingClientRect();
  const maxX = Math.max(50, area.width / 2 - 70);
  const x = (Math.random() * 2 - 1) * maxX;
  const y = (Math.random() * 2 - 1) * 50;
  noBtn.style.transform = `translate(${x}px, ${y}px)`;
  noBtn.textContent = noTexts[Math.min(tries, noTexts.length - 1)];
  yesBtn.style.transform = `scale(${Math.min(1 + tries * 0.1, 1.7)})`;
}
noBtn.addEventListener('mouseenter', dodge);
noBtn.addEventListener('touchstart', dodge, { passive: false });
noBtn.addEventListener('click', dodge);
yesBtn.addEventListener('click', sayYes);

/* ---------- 開發者模式：點七下 ---------- */
multiTap($('footer'), 7, 2500, () => {
  $('footer').textContent = 'made by 悠米 · 共同開發者：阿米 🛠️';
  toast('你現在是開發者了（跟 Android 一樣點七下）');
  unlock('dev');
});

/* ---------- 粉紅泡泡背景 + 點擊愛心 ---------- */
const bc = $('bubbles');
const bx = bc.getContext('2d');
let W = 0, H = 0;
const COLORS = ['255,143,184', '255,190,215', '201,168,255', '180,220,255', '255,210,170'];
const HEART_COLORS = ['#ff5c93', '#ff8fb8', '#ffb3cb', '#c9a8ff', '#ff7aa8'];

function resize() {
  W = innerWidth;
  H = innerHeight;
  bc.width = W * DPR;
  bc.height = H * DPR;
  bx.setTransform(DPR, 0, 0, DPR, 0, 0);
}
resize();
addEventListener('resize', resize);

function makeBubble(initial) {
  return {
    x: Math.random() * W,
    y: initial ? Math.random() * H : H + 40,
    r: 6 + Math.random() * 24,
    v: 0.25 + Math.random() * 0.6,
    a: Math.random() * Math.PI * 2,
    c: COLORS[Math.floor(Math.random() * COLORS.length)]
  };
}
const bubbles = Array.from({ length: reduceMotion ? 8 : Math.max(12, Math.min(36, Math.floor(W / 28))) }, () => makeBubble(true));
const particles = [];

function drawBubble(b) {
  const g = bx.createRadialGradient(b.x - b.r * 0.35, b.y - b.r * 0.35, b.r * 0.1, b.x, b.y, b.r);
  g.addColorStop(0, 'rgba(255,255,255,.9)');
  g.addColorStop(0.4, `rgba(${b.c},.22)`);
  g.addColorStop(1, `rgba(${b.c},.5)`);
  bx.fillStyle = g;
  bx.beginPath();
  bx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
  bx.fill();
  bx.strokeStyle = `rgba(${b.c},.55)`;
  bx.lineWidth = 1;
  bx.stroke();
}

function drawHeartShape(x, y, size, color, alpha) {
  bx.save();
  bx.globalAlpha = alpha;
  bx.fillStyle = color;
  bx.translate(x, y);
  bx.scale(size / 18, size / 18);
  bx.beginPath();
  bx.moveTo(0, 6);
  bx.bezierCurveTo(-9, -1, -10, -8, -4.5, -9.5);
  bx.bezierCurveTo(-2, -10, 0, -8, 0, -5.5);
  bx.bezierCurveTo(0, -8, 2, -10, 4.5, -9.5);
  bx.bezierCurveTo(10, -8, 9, -1, 0, 6);
  bx.fill();
  bx.restore();
}

function drawEmoji(p, alpha) {
  bx.save();
  bx.globalAlpha = alpha;
  bx.font = `${p.s}px sans-serif`;
  bx.textAlign = 'center';
  bx.textBaseline = 'middle';
  bx.fillText(p.emoji, p.x, p.y);
  bx.restore();
}

function burst(x, y, n = 12, emoji = null) {
  for (let i = 0; i < n; i++) {
    const ang = Math.random() * Math.PI * 2;
    const sp = 2 + Math.random() * 5;
    particles.push({
      x, y,
      vx: Math.cos(ang) * sp,
      vy: Math.sin(ang) * sp - 3,
      s: emoji ? 20 + Math.random() * 14 : 12 + Math.random() * 16,
      c: HEART_COLORS[i % HEART_COLORS.length],
      emoji,
      g: 0.12,
      life: 1
    });
  }
}

function pigRain() {
  for (let i = 0; i < 36; i++) {
    particles.push({
      x: Math.random() * W,
      y: -20 - Math.random() * H * 0.5,
      vx: (Math.random() - 0.5) * 1.2,
      vy: 2 + Math.random() * 3,
      s: 22 + Math.random() * 18,
      emoji: '🐽',
      g: 0.03,
      life: 1.6
    });
  }
}

addEventListener('click', (e) => {
  if (e.target.closest('button, a, canvas, input, .terminal, .mochi, h1, footer')) return;
  if (Math.random() < 0.1) {
    burst(e.clientX, e.clientY, 10, '🐽');
    unlock('lucky');
  } else {
    burst(e.clientX, e.clientY, 10);
  }
});

function loop() {
  bx.clearRect(0, 0, W, H);
  for (const b of bubbles) {
    if (!reduceMotion) {
      b.y -= b.v;
      b.a += 0.01;
      b.x += Math.sin(b.a) * 0.4;
    }
    if (b.y < -b.r - 10) Object.assign(b, makeBubble(false));
    drawBubble(b);
  }
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    p.x += p.vx;
    p.y += p.vy;
    p.vy += p.g;
    p.vx *= 0.99;
    p.life -= 0.012;
    if (p.life <= 0 || p.y > H + 60) { particles.splice(i, 1); continue; }
    const a = Math.min(1, p.life * 1.5);
    p.emoji ? drawEmoji(p, a) : drawHeartShape(p.x, p.y, p.s, p.c, a);
  }
  requestAnimationFrame(loop);
}
loop();
