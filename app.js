// app.js

/* ... (Keep your programBlocks object as is) ... */

const userSelect = document.getElementById("userSelect");
const phaseTabs = document.getElementById("phaseTabs");
const phaseContent = document.getElementById("phaseContent");
const resetBtn = document.getElementById("resetBtn");

// Helper to get the current user
let currentUser = localStorage.getItem("lastUser") || "Zach";
userSelect.value = currentUser;

// Enhanced storage key: includes the User Name
function key(block, day, lift) {
  return `${currentUser}-b${block}-d${day}-${lift}`;
}

function renderTabs() {
  phaseTabs.innerHTML = ""; // Clear for re-render
  Object.entries(programBlocks).forEach(([block, data], index) => {
    const btn = document.createElement("button");
    btn.className = `nav-link ${index === 0 ? "active" : ""}`;
    btn.textContent = data.label;
    btn.onclick = () => renderBlock(block, btn);
    phaseTabs.appendChild(btn);
  });
}

function renderBlock(block, btn) {
  // UI handling for active state
  document.querySelectorAll(".phase-tabs .nav-link").forEach(b => b.classList.remove("active"));
  if(btn) btn.classList.add("active");

  phaseContent.innerHTML = "";
  
  Object.entries(programBlocks[block].days).forEach(([dayNum, day]) => {
    const card = document.createElement("div");
    card.className = "card p-3 mb-3";

    let liftsHtml = day.lifts.map(lift => {
      const isDone = localStorage.getItem(key(block, dayNum, lift)) === "done";
      const savedWeight = localStorage.getItem(key(block, dayNum, lift + '-w')) || "";
      
      return `
        <div class="lift-row ${isDone ? 'completed' : ''}" data-lift="${lift}">
          <input type="checkbox" ${isDone ? 'checked' : ''}>
          <span>${lift}</span>
          <input type="number" class="weight-input" placeholder="lbs" value="${savedWeight}">
        </div>
      `;
    }).join("");

    card.innerHTML = `
      <p class="section-title">Day ${dayNum}: ${day.title}</p>
      ${liftsHtml}
    `;

    // Event Delegation: Listen for changes inside the card
    card.addEventListener('change', (e) => {
      const row = e.target.closest('.lift-row');
      const liftName = row.dataset.lift;

      if (e.target.type === 'checkbox') {
        if (e.target.checked) {
          row.classList.add("completed");
          localStorage.setItem(key(block, dayNum, liftName), "done");
        } else {
          row.classList.remove("completed");
          localStorage.removeItem(key(block, dayNum, liftName));
        }
      }

      if (e.target.type === 'number') {
        localStorage.setItem(key(block, dayNum, liftName + '-w'), e.target.value);
      }
    });

    phaseContent.appendChild(card);
  });
}

// Handle User Change
userSelect.addEventListener("change", (e) => {
  currentUser = e.target.value;
  localStorage.setItem("lastUser", currentUser);
  renderBlock("1", phaseTabs.children[0]); // Reset to block 1 view on switch
});

// Handle Global Reset
resetBtn.addEventListener("click", () => {
  if(confirm("Clear all progress for all athletes?")) {
    localStorage.clear();
    location.reload();
  }
});

// Init
renderTabs();
renderBlock("1", phaseTabs.children[0]);
