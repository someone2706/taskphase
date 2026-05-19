const quizEl = document.getElementById('quiz');
const progressEl = document.getElementById('progress');
const resultEl = document.getElementById('result');
const loaderEl = document.getElementById('loader');
const scoreText = document.getElementById('scoreText');
const highScoreText = document.getElementById('highScoreText');
const tryAgainBtn = document.getElementById('tryAgain');
const highScoreSide = document.getElementById('highScoreSide');
const QUESTIONS_JSON = document.getElementById('questions-data').textContent;

let questions = [];
let current = 0;
let score = 0;
let answers = [];
let typingTimer = null;
const storageKey = 'quiz_highscore_v1';
let previousHigh = 0;

function el(tag, props = {}, ...children){
  const node = document.createElement(tag);
  for(const [k,v] of Object.entries(props)){
    if(k === 'class') node.className = v;
    else if(k === 'html') node.innerHTML = v;
    else if(k.startsWith('on') && typeof v === 'function') node.addEventListener(k.slice(2), v);
    else node.setAttribute(k, String(v));
  }
  children.forEach(c => node.append(typeof c === 'string' ? document.createTextNode(c) : c));
  return node;
}

async function loadQuestions(){
  
  await new Promise(r => setTimeout(r, 80));
  try {
    const parsed = JSON.parse(QUESTIONS_JSON);
    if(!Array.isArray(parsed)) throw new Error('Invalid questions format');
    return parsed;
  } catch(err){
    quizEl.innerHTML = `<div class="card">Error loading questions</div>`;
    return [];
  }
}

function typeText(node, text, speed = 20){
  // clear any previous typing
  if(typingTimer) clearTimeout(typingTimer);
  node.textContent = '';
  let i = 0;
  return new Promise(res => {
    function step(){
      if(i <= text.length - 1){
        node.textContent += text.charAt(i);
        i++;
        typingTimer = setTimeout(step, speed);
      } else {
        typingTimer = null;
        res();
      }
    }
    step();
  });
}

function renderQuestion(qIdx){
  const q = questions[qIdx];
  if(!q) return;
  progressEl.textContent = `Question ${qIdx + 1} / ${questions.length}`;

  quizEl.innerHTML = ''; 
  const card = el('div', {class: 'card'});
  const qText = el('div', {class:'question'});
  const opts = el('div', {class: 'options', role: 'listbox', tabindex: -1});      

  q.options.forEach((optionText, i) => {
    const isSelected = answers[qIdx] === i;
    const opt = el('button', {
      class: 'option',
      role: 'option',
      'aria-checked': isSelected ? 'true' : 'false',
      onclick: () => selectOption(qIdx, i),
      onmouseover: () => {
        opt.style.backgroundColor = '#f0f0f0';
        opt.style.boxShadow = '0 0 10px azure';
      },
      onmouseout: () => {
        opt.style.backgroundColor = '';
        opt.style.boxShadow = '';
      },
    }, optionText);
    opts.appendChild(opt);
  });

  const controls = el('div', {class:'controls'});
  const prev = el('button', {
    onclick: () => goto(qIdx - 1),
  }, 'Previous');

  const next = el('button', {
    onclick: () => goto(qIdx + 1)
  }, qIdx === questions.length - 1 ? 'Submit' : 'Next');

  controls.append(prev, next);
  card.append(qText, opts, controls);
  quizEl.appendChild(card);

  const numbered = `${qIdx + 1}. ${q.question}`;
  typeText(qText, numbered, 20).then(() => {
  });

}

function selectOption(qIdx, optIdx){
  answers[qIdx] = optIdx;
  const optionButtons = quizEl.querySelectorAll('.option');
  optionButtons.forEach((btn, i) => btn.setAttribute('aria-checked', i === optIdx ? 'true' : 'false'));
}

function goto(nextIdx){
  if(nextIdx >= questions.length) return submit();
  if(nextIdx < 0) nextIdx = 0;
  current = nextIdx;
  renderQuestion(current);
}

function submit(){
  score = 0;
  questions.forEach((q, idx) => {
    const correctIndex = (typeof q.answerIndex === 'number') ? (q.answerIndex - 1) : q.answerIndex;
    if (answers[idx] === correctIndex) score += 1;
  });

  showResult();
}

function showResult(){
  quizEl.classList.add('hidden');
  resultEl.classList.remove('hidden');
  resultEl.setAttribute('aria-hidden', 'false');
  scoreText.textContent = `You scored ${score} / ${questions.length} (${Math.round((score/questions.length)*100)}%)`;

  const previous = previousHigh || 0;
  if (score > previous) {
    localStorage.setItem(storageKey, score);
    highScoreText.textContent = `🎉 New high score! Previous: ${previous}`;
  } else {
    highScoreText.textContent = `High score: ${previous}`;
  }
}

function restart(){
  answers = [];
  current = 0;
  score = 0;
  previousHigh = Number(localStorage.getItem(storageKey) || '0');
  highScoreSide.textContent = `High score: ${previousHigh}`;
  resultEl.classList.add('hidden');
  quizEl.classList.remove('hidden');
  renderQuestion(0);
}


tryAgainBtn?.addEventListener('click', restart);

(async function init(){
  if(loaderEl) loaderEl.classList.remove('hidden');
  questions = await loadQuestions();
  if(loaderEl) loaderEl.classList.add('hidden');
  if(!questions.length) return;

  previousHigh = Number(localStorage.getItem(storageKey) || '0');
  highScoreSide.textContent = `High score: ${previousHigh}`;

  renderQuestion(0);
})();