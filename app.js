/* ============================
   PROGRAM DATA
============================ */
const programBlocks = {
  1: { 
    label: "Weeks 1–3", 
    weeks: [1, 2, 3],
    days: { 
      1: { title: "Back & Rear Delts", lifts: ["Deadlifts","Pull-Ups","Single-Arm DB Rows","T-Bar Rows","Bent-Over Lateral Raises"] }, 
      2: { title: "Chest & Ant/Lat Delts", lifts: ["Incline DB Press","Flat Bench Press","Landmine Press","Dumbbell Flys","Alt DB Front Raises","Lateral Raises"] }, 
      3: { title: "Legs", lifts: ["Squats","Walking Lunges","Romanian Deadlifts","Glute Bridges","Kettlebell Swings","Seated Calf Raises"] }, 
      4: { title: "Arms & Traps", lifts: ["Alt Hammer Curls","Close-Grip Bench Press","Barbell Shrug / High Row","Skull Crushers","Barbell Curls","Single-Arm Cable Pushdowns","Underhand Pulldowns"] } 
    } 
  },
  2: { 
    label: "Weeks 4–6", 
    weeks: [4, 5, 6],
    days: { 
      1: { title: "Legs & Calves", lifts: ["Squats","Step-Ups","Trap Bar Deadlifts","Lateral Box Squats","Romanian Deadlifts","Seated Calf Raises"] }, 
      2: { title: "Back, Traps & Biceps", lifts: ["Incline DB Curls","Dumbbell Shrugs","Dumbbell Pullovers","Bent-Over Rows (Smith)","V-Grip Pull-Ups","Drag Curls"] }, 
      3: { title: "Chest, Triceps & Back", lifts: ["Flat DB Press","Single-Arm DB Rows","Single-Arm DB Press","Incline Flys","Rear Delt Raises","Incline Barbell Press"] }, 
      4: { title: "Delts & Forearms", lifts: ["Overhead Press","Reverse Curls","Reverse Upright Rows","Lateral Raises","Single-Arm KB Press","Finger Curls"] } 
    } 
  },
  3: { 
    label: "Weeks 7–9", 
    weeks: [7, 8, 9],
    days: { 
      1: { title: "Back & Trapezius", lifts: ["Pull-Ups","T-Bar Rows","Pendlay Rows","Dumbbell Pullovers","Rack Pulls","Barbell Shurgs"] }, 
      2: { title: "Chest", lifts: ["Barbell Press (Smith)","Incline DB Press","Dumbbell Flys","Weighted Dips","Cable Crossovers","Landmine Press"] }, 
      3: { title: "Legs & Calves", lifts: ["Box Squats","Walking Lunges","Romanian Deadlifts","Hamstring Curls","Seated Calf Raises"] }, 
      4: { title: "Arms", lifts: ["Skull Crushers","Close-Grip Bench Press","Rope Extensions","Seated DB Curls","Underhand Pulldowns","Reverse Curls"] } 
    } 
  },
  4: { 
    label: "Weeks 10–12", 
    weeks: [10, 11, 12],
    days: { 
      1: { title: "Back & Chest", lifts: ["Flat DB Bench Press","Dumbbell Pullovers","Straight-Arm Pulldowns","Incline DB Flys","Bent-Over DB Rows","Pull-Ups"] }, 
      2: { title: "Legs", lifts: ["Squats","Romanian Deadlifts","Walking Lunges","Leg Extensions","Hamstring Curls","Standing Calf Raises"] }, 
      3: { title: "Shoulders & Traps", lifts: ["Arnold Press","Cable Face Pulls","Bent-Over Lateral Raises","Lateral Raises","Barbell Shrugs"] }, 
      4: { title: "Arms", lifts: ["Close-Grip Bench Press","Bench Dips","Cable Tricep Extensions","Concentration Curls","Cable Curls"] } 
    } 
  }
};

/* ============================
   STATE MANAGEMENT
============================ */
const userSelect = document.getElementById("userSelect");
const phaseTabs = document.getElementById("phaseTabs");
const weekTabs = document.getElementById("weekTabs");
const phaseContent = document.getElementById("phaseContent");
const resetBtn = document.getElementById("resetBtn");

// Initialize state from Storage
let currentUser = localStorage.getItem("lastUser") || "Zach";
userSelect.value = currentUser;

function getKey(block, week, day, lift) {
  return `${currentUser}-w${week}-b${block}-d${day}-${lift}`;
}

/* ============================
   RENDER LOGIC
============================ */
function renderTabs() {
  phaseTabs.innerHTML = "";
  const lastBlockForUser = localStorage.getItem(`${currentUser}-activeBlock`) || "1";

  Object.entries(programBlocks).forEach(([blockId, data]) => {
    const btn = document.createElement("button");
    const isActive = blockId === lastBlockForUser;
    
    btn.className = `nav-link ${isActive ? "active" : ""}`;
    btn.textContent = data.label;
    
    btn.onclick = () => {
      document.querySelectorAll(".phase-tabs .nav-link").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      localStorage.setItem(`${currentUser}-activeBlock`, blockId);
      renderWeeks(blockId, data.weeks[0]);
    };
    
    phaseTabs.appendChild(btn);
  });

  renderWeeks(lastBlockForUser);
}

function renderWeeks(blockId, targetWeek = null) {
  weekTabs.innerHTML = "";
  const blockData = programBlocks[blockId];
  
  let activeWeek = targetWeek;
  if (!activeWeek) {
     activeWeek = parseInt(localStorage.getItem(`${currentUser}-activeWeek-b${blockId}`)) || blockData.weeks[0];
  }

  blockData.weeks.forEach(weekNum => {
    const btn = document.createElement("button");
    btn.className = `nav-link ${weekNum === activeWeek ? "active" : ""}`;
    btn.textContent = `Week ${weekNum}`;
    
    btn.onclick = () => {
      document.querySelectorAll(".week-tabs .nav-link").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      localStorage.setItem(`${currentUser}-activeWeek-b${blockId}`, weekNum);
      renderWorkoutCards(blockId, weekNum);
    };
    
    weekTabs.appendChild(btn);
  });

  renderWorkoutCards(blockId, activeWeek);
}

function renderWorkoutCards(blockId, weekNum) {
  phaseContent.innerHTML = "";
  const blockData = programBlocks[blockId];

  const isFirstWeekOfBlock = weekNum === blockData.weeks[0];
  const prevWeekNum = isFirstWeekOfBlock ? null : weekNum - 1;

  // 1. Render Cards
  Object.entries(blockData.days).forEach(([dayNum, day]) => {
    const card = document.createElement("div");
    card.className = "card"; // Removed p-3 to control padding via CSS
    
    const liftsHtml = day.lifts.map(lift => {
      const currentKeyPrefix = getKey(blockId, weekNum, dayNum, lift);
      const isDone = localStorage.getItem(currentKeyPrefix) === "done";
      const weightVal = localStorage.getItem(currentKeyPrefix + '-weight') || "";
      const repsVal = localStorage.getItem(currentKeyPrefix + '-reps') || "";
      
      // Ghost Data
      let ghostText = "";
      if (prevWeekNum) {
        const prevKeyPrefix = getKey(blockId, prevWeekNum, dayNum, lift);
        const prevWeight = localStorage.getItem(prevKeyPrefix + '-weight');
        const prevReps = localStorage.getItem(prevKeyPrefix + '-reps');
        
        if (prevWeight || prevReps) {
          ghostText = `${prevWeight || 0} x ${prevReps || 0}`;
        }
      }
      
      return `
        <div class="lift-row ${isDone ? 'completed' : ''}" data-lift="${lift}">
          <input type="checkbox" ${isDone ? 'checked' : ''}>
          <span>${lift}</span>
          
          <div class="input-wrapper">
            <input type="number" class="weight-input" placeholder="lbs" value="${weightVal}">
            <div class="ghost-text">${ghostText}</div>
          </div>
          
          <div class="input-wrapper">
            <input type="number" class="reps-input" placeholder="reps" value="${repsVal}">
          </div>
        </div>
      `;
    }).join("");

    const stairKey = getKey(blockId, weekNum, dayNum, "StairClimber");
    const stairDone = localStorage.getItem(stairKey) === "done";
    
    card.innerHTML = `
      <div class="card-title">Day ${dayNum} — ${day.title}</div>
      ${liftsHtml}
      <div class="lift-row mt-3 pt-2 border-top border-secondary ${stairDone ? 'completed' : ''}" data-lift="StairClimber">
          <input type="checkbox" ${stairDone ? 'checked' : ''}>
          <span style="color:var(--gold);">StairClimber (30 min)</span>
      </div>
    `;

    // Event Delegation
    card.addEventListener('change', (e) => {
      const row = e.target.closest('.lift-row');
      if (!row) return;
      const liftName = row.dataset.lift;

      if (e.target.type === 'checkbox') {
        const key = getKey(blockId, weekNum, dayNum, liftName);
        if (e.target.checked) {
          row.classList.add("completed");
          localStorage.setItem(key, "done");
        } else {
          row.classList.remove("completed");
          localStorage.removeItem(key);
        }
      }

      if (e.target.classList.contains('weight-input')) {
        localStorage.setItem(getKey(blockId, weekNum, dayNum, liftName + '-weight'), e.target.value);
      }
      if (e.target.classList.contains('reps-input')) {
        localStorage.setItem(getKey(blockId, weekNum, dayNum, liftName + '-reps'), e.target.value);
      }
    });

    phaseContent.appendChild(card);
  });

  // 2. Week Start Date Input (Moved to Bottom)
  const weekStartKey = `${currentUser}-weekStart-w${weekNum}`;
  const weekStartDiv = document.createElement("div");
  weekStartDiv.className = "mt-4 mb-2 text-center";
  weekStartDiv.innerHTML = `
    <label class="text-white small opacity-50" style="font-size:0.7rem;">WEEK ${weekNum} START DATE</label>
    <br>
    <input type="text" 
           class="form-control form-control-sm mx-auto mt-1 text-center" 
           placeholder="MM/DD/YYYY" 
           style="max-width: 140px; background: rgba(0,0,0,0.2); color: var(--gold); border: 1px solid rgba(255,255,255,0.1);"
           value="${localStorage.getItem(weekStartKey) || ''}">
  `;
  weekStartDiv.querySelector("input").addEventListener("input", (e) => {
    localStorage.setItem(weekStartKey, e.target.value);
  });
  phaseContent.appendChild(weekStartDiv);
}

/* ============================
   USER SWITCHING
============================ */
userSelect.addEventListener("change", (e) => {
  currentUser = e.target.value;
  localStorage.setItem("lastUser", currentUser);
  renderTabs();
});

resetBtn.addEventListener("click", () => {
  if (confirm(`Are you sure you want to clear ALL data for ALL users?`)) {
    localStorage.clear();
    location.reload();
  }
});

/* ============================
   EXPORT DATA TO EMAIL (CSV)
============================ */
const exportBtn = document.getElementById("exportBtn");

exportBtn.addEventListener("click", () => {
  let csvContent = `Athlete: ${currentUser}\n`;
  csvContent += "Phase,Week,Day,Exercise,Weight (lbs),Reps,Status\n";

  Object.entries(programBlocks).forEach(([blockId, blockData]) => {
    blockData.weeks.forEach(weekNum => {
        Object.entries(blockData.days).forEach(([dayNum, day]) => {
            day.lifts.forEach(lift => {
                const prefix = getKey(blockId, weekNum, dayNum, lift);
                const weight = localStorage.getItem(prefix + '-weight') || "0";
                const reps = localStorage.getItem(prefix + '-reps') || "0";
                const status = localStorage.getItem(prefix) === "done" ? "Completed" : "Incomplete";
                
                csvContent += `"${blockData.label}","Week ${weekNum}","Day ${dayNum}","${lift}","${weight}","${reps}","${status}"\n`;
            });
            const stairKey = getKey(blockId, weekNum, dayNum, "StairClimber");
            const stairStatus = localStorage.getItem(stairKey) === "done" ? "Completed" : "Incomplete";
            csvContent += `"${blockData.label}","Week ${weekNum}","Day ${dayNum}","StairClimber","N/A","N/A","${stairStatus}"\n`;
        });
    });
  });

  const subject = encodeURIComponent(`${currentUser}'s Fitness Progress - Dudek & Boyd`);
  const body = encodeURIComponent(`Attached is my current workout progress data.\n\n--- DATA BELOW ---\n\n${csvContent}`);
  window.location.href = `mailto:?subject=${subject}&body=${body}`;
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `${currentUser}_Progress.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
});

/* ============================
   INITIALIZATION
============================ */
renderTabs();
