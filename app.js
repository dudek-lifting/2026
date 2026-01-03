/* ============================
   🔒 BASELINE PROGRAM LOGIC
============================ */

const programBlocks = {
  1: {
    label: "Weeks 1–3",
    days: {
      1: { title: "Back & Rear Delts", lifts: ["Deadlifts","Pull-Ups","Single-Arm DB Rows","T-Bar Rows","Bent-Over Lateral Raises"] },
      2: { title: "Chest & Delts", lifts: ["Incline DB Press","Flat Bench Press","Landmine Press","Dumbbell Flys","Lateral Raises"] },
      3: { title: "Legs", lifts: ["Squats","Walking Lunges","Romanian Deadlifts","Glute Bridges","Seated Calf Raises"] },
      4: { title: "Arms & Traps", lifts: ["Hammer Curls","Close-Grip Bench","Shrugs","Skull Crushers","Barbell Curls"] }
    }
  },
  2: { label: "Weeks 4–6", days: {} },
  3: { label: "Weeks 7–9", days: {} },
  4: { label: "Weeks 10–12", days: {} }
};

const phaseTabs = document.getElementById("phaseTabs");
const phaseContent = document.getElementById("phaseContent");

function key(block, day, lift) {
  return `b${block}-d${day}-${lift}`;
}

function renderTabs() {
  Object.entries(programBlocks).forEach(([block, data], i) => {
    const btn = document.createElement("button");
    btn.className = `nav-link ${i === 0 ? "active" : ""}`;
    btn.textContent = data.label;
    btn.onclick = () => renderBlock(block, btn);
    phaseTabs.appendChild(btn);
  });
}

function renderBlock(block, btn) {
  document.querySelectorAll(".nav-link").forEach(b => b.classList.remove("active"));
  btn.classList.add("active");
  phaseContent.innerHTML = "";

  const days = programBlocks[block].days;
  Object.entries(days).forEach(([dayNum, day]) => {
    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <p>Day ${dayNum} — ${day.title}</p>
      ${day.lifts.map(lift => `
        <div class="lift-row ${localStorage.getItem(key(block, dayNum, lift)) === "done" ? "completed" : ""}">
          <input type="checkbox"
            ${localStorage.getItem(key(block, dayNum, lift)) === "done" ? "checked" : ""}
            onchange="localStorage.setItem('${key(block, dayNum, lift)}', this.checked ? 'done' : ''); this.parentElement.classList.toggle('completed', this.checked)">
          <span>${lift}</span>
          <input type="number" placeholder="lbs"
            value="${localStorage.getItem(key(block, dayNum, lift + '-w')) || ""}"
            oninput="localStorage.setItem('${key(block, dayNum, lift + '-w')}', this.value)">
        </div>
      `).join("")}
      <div class="lift-row">
        <input type="checkbox">
        <span>StairClimber — 30 min steady</span>
      </div>
    `;

    phaseContent.appendChild(card);
  });
}

renderTabs();
renderBlock("1", phaseTabs.children[0]);
