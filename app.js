// ── Data Layer ──
const DB = {
  get(key) {
    try { return JSON.parse(localStorage.getItem(key)); } catch { return null; }
  },
  set(key, val) { localStorage.setItem(key, JSON.stringify(val)); },
  getWorkouts() { return this.get('workouts') || []; },
  saveWorkout(w) {
    const all = this.getWorkouts();
    all.unshift(w);
    this.set('workouts', all);
  },
  deleteWorkout(id) {
    const all = this.getWorkouts().filter(w => w.id !== id);
    this.set('workouts', all);
  },
  getCustomExercises() { return this.get('customExercises') || []; },
  addCustomExercise(name) {
    const list = this.getCustomExercises();
    if (!list.find(e => e.name.toLowerCase() === name.toLowerCase())) {
      list.push({ name, muscle: 'Custom' });
      this.set('customExercises', list);
    }
  }
};

// ── Default Exercises ──
const DEFAULT_EXERCISES = [
  { name: 'Bench Press', muscle: 'Chest' },
  { name: 'Incline Dumbbell Press', muscle: 'Chest' },
  { name: 'Cable Flyes', muscle: 'Chest' },
  { name: 'Push Ups', muscle: 'Chest' },
  { name: 'Squat', muscle: 'Legs' },
  { name: 'Leg Press', muscle: 'Legs' },
  { name: 'Romanian Deadlift', muscle: 'Legs' },
  { name: 'Leg Curl', muscle: 'Legs' },
  { name: 'Leg Extension', muscle: 'Legs' },
  { name: 'Lunges', muscle: 'Legs' },
  { name: 'Calf Raises', muscle: 'Legs' },
  { name: 'Deadlift', muscle: 'Back' },
  { name: 'Barbell Row', muscle: 'Back' },
  { name: 'Pull Ups', muscle: 'Back' },
  { name: 'Lat Pulldown', muscle: 'Back' },
  { name: 'Seated Cable Row', muscle: 'Back' },
  { name: 'Overhead Press', muscle: 'Shoulders' },
  { name: 'Lateral Raises', muscle: 'Shoulders' },
  { name: 'Face Pulls', muscle: 'Shoulders' },
  { name: 'Rear Delt Flyes', muscle: 'Shoulders' },
  { name: 'Barbell Curl', muscle: 'Biceps' },
  { name: 'Dumbbell Curl', muscle: 'Biceps' },
  { name: 'Hammer Curl', muscle: 'Biceps' },
  { name: 'Tricep Pushdown', muscle: 'Triceps' },
  { name: 'Skull Crushers', muscle: 'Triceps' },
  { name: 'Overhead Tricep Extension', muscle: 'Triceps' },
  { name: 'Plank', muscle: 'Core' },
  { name: 'Crunches', muscle: 'Core' },
  { name: 'Hanging Leg Raise', muscle: 'Core' },
];

// ── State ──
let activeWorkout = null;
let timerInterval = null;
let workoutStartTime = null;

// ── DOM Refs ──
const $ = id => document.getElementById(id);
const tabs = document.querySelectorAll('.tab-btn');
const tabContents = {
  workout: $('tab-workout'),
  history: $('tab-history'),
  stats: $('tab-stats'),
};

// ── Tabs ──
tabs.forEach(btn => {
  btn.addEventListener('click', () => {
    tabs.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    Object.values(tabContents).forEach(tc => tc.hidden = true);
    tabContents[btn.dataset.tab].hidden = false;
    if (btn.dataset.tab === 'history') renderHistory();
    if (btn.dataset.tab === 'stats') renderStats();
  });
});

// ── Timer ──
function startTimer() {
  workoutStartTime = Date.now();
  timerInterval = setInterval(() => {
    const elapsed = Math.floor((Date.now() - workoutStartTime) / 1000);
    const min = String(Math.floor(elapsed / 60)).padStart(2, '0');
    const sec = String(elapsed % 60).padStart(2, '0');
    $('workout-timer').textContent = `${min}:${sec}`;
  }, 1000);
}

function stopTimer() {
  clearInterval(timerInterval);
  timerInterval = null;
}

// ── Workout Management ──
$('start-workout-btn').addEventListener('click', () => {
  activeWorkout = { exercises: [] };
  $('workout-name').value = 'Workout';
  $('exercises-list').innerHTML = '';
  $('no-active-workout').hidden = true;
  $('active-workout').hidden = false;
  startTimer();
});

$('finish-workout-btn').addEventListener('click', () => {
  if (!activeWorkout || activeWorkout.exercises.length === 0) {
    alert('Add at least one exercise before finishing.');
    return;
  }
  stopTimer();
  const elapsed = Math.floor((Date.now() - workoutStartTime) / 1000);
  const workout = {
    id: Date.now().toString(),
    name: $('workout-name').value.trim() || 'Workout',
    date: new Date().toISOString(),
    duration: elapsed,
    exercises: activeWorkout.exercises.map(ex => ({
      name: ex.name,
      sets: ex.sets.filter(s => s.weight || s.reps).map(s => ({
        weight: parseFloat(s.weight) || 0,
        reps: parseInt(s.reps) || 0,
        done: s.done,
      }))
    })).filter(ex => ex.sets.length > 0)
  };
  if (workout.exercises.length === 0) {
    alert('Log at least one set before finishing.');
    startTimer();
    return;
  }
  DB.saveWorkout(workout);
  activeWorkout = null;
  $('no-active-workout').hidden = false;
  $('active-workout').hidden = true;
});

$('cancel-workout-btn').addEventListener('click', () => {
  if (!confirm('Discard this workout?')) return;
  stopTimer();
  activeWorkout = null;
  $('no-active-workout').hidden = false;
  $('active-workout').hidden = true;
});

// ── Exercise Modal ──
$('add-exercise-btn').addEventListener('click', () => {
  $('exercise-search').value = '';
  renderExerciseOptions('');
  $('exercise-modal').hidden = false;
  $('exercise-search').focus();
});

$('exercise-search').addEventListener('input', (e) => {
  renderExerciseOptions(e.target.value);
});

function getAllExercises() {
  return [...DEFAULT_EXERCISES, ...DB.getCustomExercises()];
}

function renderExerciseOptions(query) {
  const q = query.toLowerCase().trim();
  const all = getAllExercises();
  const filtered = q ? all.filter(e => e.name.toLowerCase().includes(q)) : all;
  const container = $('exercise-options');
  container.innerHTML = '';
  filtered.forEach(ex => {
    const div = document.createElement('div');
    div.className = 'exercise-option';
    div.innerHTML = `<span>${ex.name}</span><span class="muscle">${ex.muscle}</span>`;
    div.addEventListener('click', () => addExercise(ex.name));
    container.appendChild(div);
  });
  const customBtn = $('add-custom-exercise-btn');
  customBtn.hidden = !q || filtered.some(e => e.name.toLowerCase() === q);
  customBtn.textContent = `Add "${query}" as Custom Exercise`;
}

$('add-custom-exercise-btn').addEventListener('click', () => {
  const name = $('exercise-search').value.trim();
  if (!name) return;
  DB.addCustomExercise(name);
  addExercise(name);
});

function addExercise(name) {
  $('exercise-modal').hidden = true;
  const exercise = {
    name,
    sets: [{ weight: '', reps: '', done: false }],
  };
  activeWorkout.exercises.push(exercise);
  renderExercises();
}

function renderExercises() {
  const container = $('exercises-list');
  container.innerHTML = '';
  activeWorkout.exercises.forEach((ex, exIdx) => {
    const card = document.createElement('div');
    card.className = 'exercise-card';
    card.innerHTML = `
      <div class="exercise-card-header">
        <h3>${ex.name}</h3>
        <button class="btn-icon remove-exercise" data-idx="${exIdx}" aria-label="Remove exercise">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
        </button>
      </div>
      <div class="sets-table">
        <div class="sets-header">
          <span>Set</span><span>Kg</span><span>Reps</span><span></span>
        </div>
        <div class="sets-body" data-ex="${exIdx}"></div>
      </div>
      <button class="add-set-btn" data-ex="${exIdx}">+ Add Set</button>
    `;
    container.appendChild(card);
    const setsBody = card.querySelector('.sets-body');
    ex.sets.forEach((set, setIdx) => {
      setsBody.appendChild(createSetRow(exIdx, setIdx, set));
    });
  });

  // Event: remove exercise
  container.querySelectorAll('.remove-exercise').forEach(btn => {
    btn.addEventListener('click', () => {
      activeWorkout.exercises.splice(parseInt(btn.dataset.idx), 1);
      renderExercises();
    });
  });

  // Event: add set
  container.querySelectorAll('.add-set-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const exIdx = parseInt(btn.dataset.ex);
      const lastSet = activeWorkout.exercises[exIdx].sets.at(-1);
      activeWorkout.exercises[exIdx].sets.push({
        weight: lastSet ? lastSet.weight : '',
        reps: lastSet ? lastSet.reps : '',
        done: false,
      });
      renderExercises();
    });
  });
}

function createSetRow(exIdx, setIdx, set) {
  const row = document.createElement('div');
  row.className = 'set-row';
  row.innerHTML = `
    <span class="set-num">${setIdx + 1}</span>
    <input type="number" inputmode="decimal" placeholder="0" value="${set.weight}" data-ex="${exIdx}" data-set="${setIdx}" data-field="weight">
    <input type="number" inputmode="numeric" placeholder="0" value="${set.reps}" data-ex="${exIdx}" data-set="${setIdx}" data-field="reps">
    <button class="btn-check ${set.done ? 'done' : ''}" data-ex="${exIdx}" data-set="${setIdx}">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 6L9 17l-5-5"/></svg>
    </button>
  `;

  row.querySelectorAll('input').forEach(input => {
    input.addEventListener('change', () => {
      const ex = parseInt(input.dataset.ex);
      const s = parseInt(input.dataset.set);
      activeWorkout.exercises[ex].sets[s][input.dataset.field] = input.value;
    });
  });

  row.querySelector('.btn-check').addEventListener('click', (e) => {
    const btn = e.currentTarget;
    const ex = parseInt(btn.dataset.ex);
    const s = parseInt(btn.dataset.set);
    activeWorkout.exercises[ex].sets[s].done = !activeWorkout.exercises[ex].sets[s].done;
    btn.classList.toggle('done');
  });

  return row;
}

// ── Close Modals ──
document.querySelectorAll('.modal-close').forEach(btn => {
  btn.addEventListener('click', () => {
    btn.closest('.modal').hidden = true;
  });
});

document.querySelectorAll('.modal').forEach(modal => {
  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.hidden = true;
  });
});

// ── History ──
function renderHistory() {
  const workouts = DB.getWorkouts();
  const list = $('history-list');
  list.innerHTML = '';
  $('no-history').hidden = workouts.length > 0;

  workouts.forEach(w => {
    const date = new Date(w.date);
    const dur = formatDuration(w.duration);
    const card = document.createElement('div');
    card.className = 'history-card';
    card.innerHTML = `
      <div class="history-card-top">
        <h3>${w.name}</h3>
        <span>${date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} · ${dur}</span>
      </div>
      <div class="history-card-body">
        ${w.exercises.map(ex => `${ex.sets.length}× ${ex.name}`).join('<br>')}
      </div>
    `;
    card.addEventListener('click', () => showDetail(w));
    list.appendChild(card);
  });
}

function showDetail(w) {
  $('detail-title').textContent = w.name;
  const date = new Date(w.date);
  $('detail-body').innerHTML = `
    <p style="color:var(--text-muted);margin-bottom:1rem">${date.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} · ${formatDuration(w.duration)}</p>
    ${w.exercises.map(ex => `
      <div class="detail-exercise">
        <h4>${ex.name}</h4>
        <div class="detail-sets">
          ${ex.sets.map((s, i) => `Set ${i + 1}: ${s.weight} kg × ${s.reps} reps`).join('<br>')}
        </div>
      </div>
    `).join('')}
  `;
  $('delete-workout-btn').onclick = () => {
    if (!confirm('Delete this workout?')) return;
    DB.deleteWorkout(w.id);
    $('detail-modal').hidden = true;
    renderHistory();
    renderStats();
  };
  $('detail-modal').hidden = false;
}

function formatDuration(sec) {
  if (!sec) return '0m';
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

// ── Stats ──
function renderStats() {
  const workouts = DB.getWorkouts();
  $('stat-total').textContent = workouts.length;

  // This week
  const now = new Date();
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay());
  startOfWeek.setHours(0, 0, 0, 0);
  const thisWeek = workouts.filter(w => new Date(w.date) >= startOfWeek).length;
  $('stat-week').textContent = thisWeek;

  // Total volume
  let volume = 0;
  workouts.forEach(w => {
    w.exercises.forEach(ex => {
      ex.sets.forEach(s => { volume += (s.weight || 0) * (s.reps || 0); });
    });
  });
  $('stat-volume').textContent = volume >= 1000 ? `${(volume / 1000).toFixed(1)}k` : volume;

  // Streak
  $('stat-streak').textContent = calcStreak(workouts);

  // Top exercises
  const counts = {};
  workouts.forEach(w => {
    w.exercises.forEach(ex => {
      counts[ex.name] = (counts[ex.name] || 0) + 1;
    });
  });
  const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 5);
  const container = $('top-exercises');
  if (sorted.length === 0) {
    container.innerHTML = '<p style="color:var(--text-muted)">No data yet</p>';
  } else {
    container.innerHTML = sorted.map(([name, count]) =>
      `<div class="exercise-stat"><span class="name">${name}</span><span class="count">${count}×</span></div>`
    ).join('');
  }
}

function calcStreak(workouts) {
  if (workouts.length === 0) return 0;
  const days = new Set();
  workouts.forEach(w => {
    const d = new Date(w.date);
    days.add(`${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`);
  });
  let streak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  for (let i = 0; i < 365; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
    if (days.has(key)) {
      streak++;
    } else if (i === 0) {
      continue; // today hasn't happened yet
    } else {
      break;
    }
  }
  return streak;
}

// ── PWA Install ──
let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  $('install-btn').hidden = false;
});

$('install-btn').addEventListener('click', async () => {
  if (!deferredPrompt) return;
  deferredPrompt.prompt();
  await deferredPrompt.userChoice;
  deferredPrompt = null;
  $('install-btn').hidden = true;
});

// ── Register Service Worker ──
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js');
}

// ── Init ──
renderHistory();
renderStats();
