const users = ["Zach", "Dave", "Holly"];
let currentUser = localStorage.getItem("currentUser") || "Zach";

const defaultPRs = {
  Zach: { Bench: 225, Squat: 265, Deadlift: 300 },
  Dave: { Bench: 215, Squat: 265, Deadlift: 300 },
  Holly: { Bench: 70, Squat: 175, Deadlift: 170 }
};

function getUserData() {
  return JSON.parse(localStorage.getItem(`data_${currentUser}`)) || {
    prs: { ...defaultPRs[currentUser] }
  };
}

function saveUserData(data) {
  localStorage.setItem(`data_${currentUser}`, JSON.stringify(data));
}

document.getElementById("userSelect").value = currentUser;

document.getElementById("userSelect").addEventListener("change", e => {
  currentUser = e.target.value;
  localStorage.setItem("currentUser", currentUser);
  renderPRs();
});

function renderPRs() {
  const tbody = document.getElementById("prTable");
  const data = getUserData();
  tbody.innerHTML = "";

  ["Bench", "Squat", "Deadlift"].forEach(lift => {
    tbody.innerHTML += `
      <tr>
        <td>${lift}</td>
        <td>${data.prs[lift]} lb</td>
        <td>
          <input type="number" min="0" class="form-control"
            onchange="updatePR('${lift}', this.value)">
        </td>
      </tr>`;
  });
}

function updatePR(lift, value) {
  const data = getUserData();
  const num = Number(value);
  if (num > data.prs[lift]) {
    data.prs[lift] = num;
    saveUserData(data);
    renderPRs();
  }
}

document.getElementById("exportBtn").addEventListener("click", () => {
  const data = getUserData();
  const blob = new Blob(
    [JSON.stringify(data, null, 2)],
    { type: "application/json" }
  );

  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `${currentUser}_training_data.json`;
  a.click();
});

renderPRs();
