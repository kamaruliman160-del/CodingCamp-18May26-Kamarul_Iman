/* =============================================
   MY DASHBOARD — app.js
   Vanilla JS · LocalStorage · No frameworks
   ============================================= */

'use strict';

/* ─────────────────────────────────────────────
   1. GREETING & CLOCK
   ───────────────────────────────────────────── */
const timeEl     = document.getElementById('time');
const dateEl     = document.getElementById('date');
const greetingEl = document.getElementById('greeting');

const DAYS   = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
const MONTHS = ['January','February','March','April','May','June',
                'July','August','September','October','November','December'];

function updateClock() {
  const now  = new Date();
  const h    = String(now.getHours()).padStart(2, '0');
  const m    = String(now.getMinutes()).padStart(2, '0');
  const s    = String(now.getSeconds()).padStart(2, '0');
  timeEl.textContent = `${h}:${m}:${s}`;

  const day  = DAYS[now.getDay()];
  const date = now.getDate();
  const mon  = MONTHS[now.getMonth()];
  const yr   = now.getFullYear();
  dateEl.textContent = `${day}, ${mon} ${date}, ${yr}`;

  const hour = now.getHours();
  let greet;
  if (hour >= 5  && hour < 12) greet = '☀️ Good Morning! Kamarul Iman';
  else if (hour >= 12 && hour < 17) greet = '🌤️ Good Afternoon! Kamarul Iman';
  else if (hour >= 17 && hour < 21) greet = '🌇 Good Evening! Kamarul Iman';
  else greet = '🌙 Good Night!';
  greetingEl.textContent = greet;
}

updateClock();
setInterval(updateClock, 1000);


/* ─────────────────────────────────────────────
   2. FOCUS TIMER
   ───────────────────────────────────────────── */
const TIMER_DURATION = 24 * 60; // seconds

const timerDisplay = document.getElementById('timer-display');
const timerLabel   = document.getElementById('timer-label');
const btnStart     = document.getElementById('btn-start');
const btnStop      = document.getElementById('btn-stop');
const btnReset     = document.getElementById('btn-reset');

let timerSeconds   = TIMER_DURATION;
let timerInterval  = null;
let timerRunning   = false;

function formatTime(sec) {
  const m = String(Math.floor(sec / 60)).padStart(2, '0');
  const s = String(sec % 60).padStart(2, '0');
  return `${m}:${s}`;
}

function renderTimer() {
  timerDisplay.textContent = formatTime(timerSeconds);
}

function startTimer() {
  if (timerRunning) return;
  timerRunning = true;
  timerDisplay.classList.add('running');
  timerDisplay.classList.remove('finished');
  timerLabel.textContent = 'Stay focused…';

  timerInterval = setInterval(() => {
    timerSeconds--;
    renderTimer();

    if (timerSeconds <= 0) {
      clearInterval(timerInterval);
      timerRunning = false;
      timerDisplay.classList.remove('running');
      timerDisplay.classList.add('finished');
      timerLabel.textContent = '🎉 Session complete! Take a break.';
    }
  }, 1000);
}

function stopTimer() {
  if (!timerRunning) return;
  clearInterval(timerInterval);
  timerRunning = false;
  timerDisplay.classList.remove('running');
  timerLabel.textContent = 'Paused.';
}

function resetTimer() {
  clearInterval(timerInterval);
  timerRunning  = false;
  timerSeconds  = TIMER_DURATION;
  timerDisplay.classList.remove('running', 'finished');
  timerLabel.textContent = 'Ready to focus?';
  renderTimer();
}

btnStart.addEventListener('click', startTimer);
btnStop.addEventListener('click', stopTimer);
btnReset.addEventListener('click', resetTimer);

renderTimer();


/* ─────────────────────────────────────────────
   3. TO-DO LIST
   ───────────────────────────────────────────── */
const todoInput   = document.getElementById('todo-input');
const btnAddTodo  = document.getElementById('btn-add-todo');
const todoList    = document.getElementById('todo-list');
const todoEmpty   = document.getElementById('todo-empty');

const TODOS_KEY   = 'dashboard_todos';

/** @returns {Array<{id:string, text:string, done:boolean}>} */
function loadTodos() {
  try {
    return JSON.parse(localStorage.getItem(TODOS_KEY)) || [];
  } catch {
    return [];
  }
}

function saveTodos(todos) {
  localStorage.setItem(TODOS_KEY, JSON.stringify(todos));
}

function renderTodos() {
  const todos = loadTodos();
  todoList.innerHTML = '';

  if (todos.length === 0) {
    todoEmpty.style.display = 'block';
    return;
  }
  todoEmpty.style.display = 'none';

  todos.forEach(todo => {
    const li = document.createElement('li');
    li.className = 'todo-item' + (todo.done ? ' done' : '');
    li.dataset.id = todo.id;

    // Checkbox
    const cb = document.createElement('input');
    cb.type      = 'checkbox';
    cb.className = 'todo-checkbox';
    cb.checked   = todo.done;
    cb.setAttribute('aria-label', 'Mark task as done');
    cb.addEventListener('change', () => toggleTodo(todo.id));

    // Text
    const span = document.createElement('span');
    span.className   = 'todo-text';
    span.textContent = todo.text;

    // Actions
    const actions = document.createElement('div');
    actions.className = 'todo-actions';

    const editBtn = document.createElement('button');
    editBtn.className = 'btn btn-ghost btn-icon';
    editBtn.textContent = '✏️';
    editBtn.setAttribute('aria-label', 'Edit task');
    editBtn.addEventListener('click', () => openEditModal(todo.id, todo.text));

    const delBtn = document.createElement('button');
    delBtn.className = 'btn btn-danger btn-icon';
    delBtn.textContent = '🗑️';
    delBtn.setAttribute('aria-label', 'Delete task');
    delBtn.addEventListener('click', () => deleteTodo(todo.id));

    actions.appendChild(editBtn);
    actions.appendChild(delBtn);

    li.appendChild(cb);
    li.appendChild(span);
    li.appendChild(actions);
    todoList.appendChild(li);
  });
}

function addTodo() {
  const text = todoInput.value.trim();
  if (!text) return;

  const todos = loadTodos();
  todos.push({ id: Date.now().toString(), text, done: false });
  saveTodos(todos);
  todoInput.value = '';
  renderTodos();
}

function toggleTodo(id) {
  const todos = loadTodos().map(t =>
    t.id === id ? { ...t, done: !t.done } : t
  );
  saveTodos(todos);
  renderTodos();
}

function deleteTodo(id) {
  const todos = loadTodos().filter(t => t.id !== id);
  saveTodos(todos);
  renderTodos();
}

btnAddTodo.addEventListener('click', addTodo);
todoInput.addEventListener('keydown', e => { if (e.key === 'Enter') addTodo(); });

renderTodos();


/* ─────────────────────────────────────────────
   4. EDIT TASK MODAL
   ───────────────────────────────────────────── */
const modalOverlay = document.getElementById('modal-overlay');
const modalInput   = document.getElementById('modal-input');
const modalSave    = document.getElementById('modal-save');
const modalCancel  = document.getElementById('modal-cancel');

let editingId = null;

function openEditModal(id, currentText) {
  editingId          = id;
  modalInput.value   = currentText;
  modalOverlay.classList.add('active');
  modalInput.focus();
}

function closeModal() {
  editingId = null;
  modalOverlay.classList.remove('active');
}

function saveEdit() {
  const newText = modalInput.value.trim();
  if (!newText || !editingId) return;

  const todos = loadTodos().map(t =>
    t.id === editingId ? { ...t, text: newText } : t
  );
  saveTodos(todos);
  renderTodos();
  closeModal();
}

modalSave.addEventListener('click', saveEdit);
modalCancel.addEventListener('click', closeModal);
modalInput.addEventListener('keydown', e => { if (e.key === 'Enter') saveEdit(); });
modalOverlay.addEventListener('click', e => {
  if (e.target === modalOverlay) closeModal();
});


/* ─────────────────────────────────────────────
   5. QUICK LINKS
   ───────────────────────────────────────────── */
const linkNameInput = document.getElementById('link-name-input');
const linkUrlInput  = document.getElementById('link-url-input');
const btnAddLink    = document.getElementById('btn-add-link');
const linksGrid     = document.getElementById('links-grid');
const linksEmpty    = document.getElementById('links-empty');

const LINKS_KEY     = 'dashboard_links';

/** @returns {Array<{id:string, name:string, url:string}>} */
function loadLinks() {
  try {
    return JSON.parse(localStorage.getItem(LINKS_KEY)) || [];
  } catch {
    return [];
  }
}

function saveLinks(links) {
  localStorage.setItem(LINKS_KEY, JSON.stringify(links));
}

function renderLinks() {
  const links = loadLinks();
  linksGrid.innerHTML = '';

  if (links.length === 0) {
    linksEmpty.style.display = 'block';
    return;
  }
  linksEmpty.style.display = 'none';

  links.forEach(link => {
    const chip = document.createElement('a');
    chip.className = 'link-chip';
    chip.href      = link.url;
    chip.target    = '_blank';
    chip.rel       = 'noopener noreferrer';

    const label = document.createElement('span');
    label.textContent = link.name;

    const delBtn = document.createElement('button');
    delBtn.className   = 'link-delete';
    delBtn.textContent = '✕';
    delBtn.setAttribute('aria-label', `Remove ${link.name}`);
    delBtn.addEventListener('click', e => {
      e.preventDefault();
      deleteLink(link.id);
    });

    chip.appendChild(label);
    chip.appendChild(delBtn);
    linksGrid.appendChild(chip);
  });
}

function addLink() {
  const name = linkNameInput.value.trim();
  let   url  = linkUrlInput.value.trim();

  if (!name || !url) return;

  // Auto-prepend https:// if missing
  if (!/^https?:\/\//i.test(url)) {
    url = 'https://' + url;
  }

  // Basic URL validation
  try {
    new URL(url);
  } catch {
    linkUrlInput.style.borderColor = 'var(--danger)';
    setTimeout(() => { linkUrlInput.style.borderColor = ''; }, 1500);
    return;
  }

  const links = loadLinks();
  links.push({ id: Date.now().toString(), name, url });
  saveLinks(links);

  linkNameInput.value = '';
  linkUrlInput.value  = '';
  renderLinks();
}

function deleteLink(id) {
  const links = loadLinks().filter(l => l.id !== id);
  saveLinks(links);
  renderLinks();
}

btnAddLink.addEventListener('click', addLink);
linkUrlInput.addEventListener('keydown', e => { if (e.key === 'Enter') addLink(); });

renderLinks();
