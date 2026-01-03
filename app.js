/* ============================
   PROGRAM DATA (Restored)
============================ */
const programBlocks = {
  1: { 
    label: "Weeks 1–3", 
    days: { 
      1: { title: "Back & Rear Delts", lifts: ["Deadlifts","Pull-Ups","Single-Arm DB Rows","T-Bar Rows","Bent-Over Lateral Raises"] }, 
      2: { title: "Chest & Ant/Lat Delts", lifts: ["Incline DB Press","Flat Bench Press","Landmine Press","Dumbbell Flys","Alt DB Front Raises","Lateral Raises"] }, 
      3: { title: "Legs", lifts: ["Squats","Walking Lunges","Romanian Deadlifts","Glute Bridges","Kettlebell Swings","Seated Calf Raises"] }, 
      4: { title: "Arms & Traps", lifts: ["Alt Hammer Curls","Close-Grip Bench Press","Barbell Shrug / High Row","Skull Crushers","Barbell Curls","Single-Arm Cable Pushdowns","Underhand Pulldowns"] } 
    } 
  },
  2: { 
    label: "Weeks 4–6", 
    days: { 
      1: { title: "Legs & Calves", lifts: ["Squats","Step-Ups","Trap Bar Deadlifts","Lateral Box Squats","Romanian Deadlifts","Seated Calf Raises"] }, 
      2: { title: "Back, Traps & Biceps", lifts: ["Incline DB Curls","Dumbbell Shrugs","Dumbbell Pullovers","Bent-Over Rows (Smith)","V-Grip Pull-Ups","Drag Curls"] }, 
      3: { title: "Chest, Triceps & Back", lifts: ["Flat DB Press","Single-Arm DB Rows","Single-Arm DB Press","Incline Flys","Rear Delt Raises","Incline Barbell Press"] }, 
      4: { title: "Delts & Forearms", lifts: ["Overhead Press","Reverse Curls","Reverse Upright Rows","Lateral Raises","Single-Arm KB Press","Finger Curls"] } 
    } 
  },
  3: { 
    label: "Weeks 7–9", 
    days: { 
      1: { title: "Back & Trapezius", lifts: ["Pull-Ups","T-Bar Rows","Pendlay Rows","Dumbbell Pullovers","Rack Pulls","Barbell Shurgs"] }, 
      2: { title: "Chest", lifts: ["Barbell Press (Smith)","Incline DB Press","Dumbbell Flys","Weighted Dips","Cable Crossovers","Landmine Press"] }, 
      3: { title: "Legs & Calves", lifts: ["Box Squats","Walking Lunges","Romanian Deadlifts","Hamstring Curls","Seated Calf Raises"] }, 
      4: { title: "Arms", lifts: ["Skull Crushers","Close-Grip Bench Press","Rope Extensions","Seated DB Curls","Underhand Pulldowns","Reverse Curls"] } 
    } 
  },
  4: { 
    label: "Weeks 10–12", 
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
const phaseContent = document.getElementById("phaseContent");
const resetBtn = document.getElementById("resetBtn");

// Load last selected user or default to Zach
let currentUser = localStorage.getItem("lastUser") || "Zach";
userSelect.value = currentUser;

// Helper to create unique keys for LocalStorage
// Format: "Zach-b1-d1-Deadlifts"
function getKey(block, day, lift) {
  return `${currentUser}-b${block}-d${day}-${lift}`;
}

/* ============================
   RENDER LOGIC
============================ */
function renderTabs() {
  phaseTabs.innerHTML = "";
  Object.entries(programBlocks).forEach(([blockId, data], index) => {
    const btn = document.createElement("button");
    btn.className = `nav-link ${index === 0 ? "active" : ""}`;
    btn.textContent = data.label;
    
    // When clicking a tab, render that block
    btn.onclick = () => {
      // Update active visual state
      document.querySelectorAll(".phase-tabs .nav-link").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      renderBlock(blockId);
    };
    
    phaseTabs.appendChild(btn);
  });
}

function renderBlock(blockId) {
  phaseContent.innerHTML = "";
  const blockData = programBlocks[blockId];

  // 1. Render Week Start Input (Optional)
  const weekStartKey = `${currentUser}-weekStart-${blockId}`;
  const weekStartDiv = document.createElement("div");
  weekStartDiv.className = "mb-3 text-center";
  weekStartDiv.innerHTML = `
    <label class="text-white small opacity-75">Week Start (Optional)</label>
    <input type="text" 
           class="form-control form-control-sm mx-auto mt-1 text-center" 
           placeholder="e.g. 01/02/2026" 
           style="max-width: 150px; background: rgba(255,255,255,0.1); color: white; border: none;"
           value="${localStorage.getItem(weekStartKey) || ''}">
  `;
  // Save date on change
  weekStartDiv.querySelector("input").addEventListener("input", (e) => {
    localStorage.setItem(weekStartKey, e.target.value);
  });
  phaseContent.appendChild(weekStartDiv);

  // 2. Render Workout Cards
  Object.entries(blockData.days).forEach(([dayNum, day]) => {
    const card = document.createElement("div");
    card.className = "card p-3";
    
    // Generate HTML for lifts
    const liftsHtml = day.lifts.map(lift => {
      const isDone = localStorage.getItem(getKey(blockId, dayNum, lift)) === "done";
      const weightVal = localStorage.getItem(getKey(blockId, dayNum, lift + '-weight')) || "";
      
      return `
        <div class="lift-row ${isDone ? 'completed' : ''}" data-lift="${lift}">
          <input type="checkbox" ${isDone ? 'checked' : ''}>
          <span>${lift}</span>
          <input type="number" class="weight-input" placeholder="lbs" value="${weightVal}">
        </div>
      `;
    }).join("");

    // Add StairClimber manually to every day (as per original app)
    const stairKey = getKey(blockId, dayNum, "StairClimber");
    const stairDone = localStorage.getItem(stairKey) === "done";
    const stairHtml = `
       <div class="lift-row mt-3 pt-2 border-top border-secondary ${stairDone ? 'completed' : ''}" data-lift="StairClimber">
          <input type="checkbox" ${stairDone ? 'checked' : ''}>
          <span style="color:var(--gold);">StairClimber (30 min)</span>
       </div>
    `;

    card.innerHTML = `
      <div class="card-title">Day ${dayNum} — ${day.title}</div>
      ${liftsHtml}
      ${stairHtml}
    `;

    // 3. Attach Event Listeners (Event Delegation)
    card.addEventListener('change', (e) => {
      const row = e.target.closest('.lift-row');
      if (!row) return;
      
      const liftName = row.dataset.lift;

      // Handle Checkbox
      if (e.target.type === 'checkbox') {
        if (e.target.checked) {
          row.classList.add("completed");
          localStorage.setItem(getKey(blockId, dayNum, liftName), "done");
        } else {
          row.classList.remove("completed");
          localStorage.removeItem(getKey(blockId, dayNum, liftName));
        }
      }

      // Handle Weight Input
      if (e.target.type === 'number') {
        localStorage.setItem(getKey(blockId, dayNum, liftName + '-weight'), e.target.value);
      }
    });

    phaseContent.appendChild(card);
  });
}

/* ============================
   USER SWITCHING & RESET
============================ */
userSelect.addEventListener("change", (e) => {
  currentUser = e.target.value;
  localStorage.setItem("lastUser", currentUser);
  // Re-render the current view with new user's data
  // Find active tab to know which block to render
  const activeTabIdx = Array.from(phaseTabs.children).findIndex(btn => btn.classList.contains("active"));
  renderBlock(Object.keys(programBlocks)[activeTabIdx !== -1 ? activeTabIdx : 0]);
});

resetBtn.addEventListener("click", () => {
  if (confirm(`Are you sure you want to clear ALL data for ALL users? This cannot be undone.`)) {
    localStorage.clear();
    location.reload();
  }
});

/* ============================
   INITIALIZATION
============================ */
renderTabs();
renderBlock("1"); // Start at Block 1

