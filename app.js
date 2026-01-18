/**********************
  SHARED DATA
**********************/
function defaultGroups() {
  return {
    A: [
      { name: "Lions", p: 0, w: 0, d: 0, l: 0, points: 0, gd: 0 },
      { name: "Tigers", p: 0, w: 0, d: 0, l: 0, points: 0, gd: 0 }
    ],
    B: [
      { name: "Eagles", p: 0, w: 0, d: 0, l: 0, points: 0, gd: 0 },
      { name: "Sharks", p: 0, w: 0, d: 0, l: 0, points: 0, gd: 0 }
    ],
    C: [
      { name: "Bears", p: 0, w: 0, d: 0, l: 0, points: 0, gd: 0 },
      { name: "Spiders", p: 0, w: 0, d: 0, l: 0, points: 0, gd: 0 }
    ],
    D: [
      { name: "Monkeys", p: 0, w: 0, d: 0, l: 0, points: 0, gd: 0 },
      { name: "Fishes", p: 0, w: 0, d: 0, l: 0, points: 0, gd: 0 }
    ]
  };
}

function loadGroups() {
  const saved = localStorage.getItem("groups");
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      if (parsed && typeof parsed === "object") return parsed;
    } catch (e) {}
  }
  return defaultGroups();
}

let groups = loadGroups();
let currentGroup = "A";
let undoStack = [];

function saveGroups() {
  localStorage.setItem("groups", JSON.stringify(groups));
}

function sortGroup(group) {
  group.sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    return b.gd - a.gd;
  });
}

function saveStateForUndo() {
  undoStack.push(JSON.parse(JSON.stringify(groups)));
  if (undoStack.length > 50) undoStack.shift();
}

function byId(id) {
  return document.getElementById(id);
}

/**********************
  ADMIN RENDER
**********************/
function renderAdmin() {
  const table = byId("groupTable");
  if (!table) return; // not on this page

  const group = groups[currentGroup] || [];
  if (group.length === 0) {
    table.innerHTML = `<tr><th>No teams in Group ${currentGroup}</th></tr>`;
    updateAdminDropdowns();
    saveGroups();
    return;
  }

  sortGroup(group);

  table.innerHTML = `
    <tr>
      <th>Team</th><th>P</th><th>W</th><th>D</th><th>L</th><th>Pts</th><th>GD</th>
    </tr>
  `;

  const topPoints = group[0].points;
  const bottomPoints = group[group.length - 1].points;

  group.forEach(team => {
    let rowClass = "";
    if (team.points === topPoints) rowClass = "top-team";
    else if (team.points === bottomPoints) rowClass = "bottom-team";

    table.innerHTML += `
      <tr class="${rowClass}">
        <td>${team.name}</td>
        <td>${team.p}</td>
        <td>${team.w}</td>
        <td>${team.d}</td>
        <td>${team.l}</td>
        <td>${team.points}</td>
        <td>${team.gd}</td>
      </tr>
    `;
  });

  updateAdminDropdowns();
  saveGroups();
}
function updateAdminDropdowns() {
  const select = byId("teamSelect");
  const a = byId("teamA");
  const b = byId("teamB");
  const renameSelect = byId("renameSelect");
  const removeSelect = byId("removeSelect");

  // if these don't exist, we're not on admin page
  if (!select || !a || !b) return;

  select.innerHTML = "";
  a.innerHTML = "";
  b.innerHTML = "";
  if (renameSelect) renameSelect.innerHTML = "";
  if (removeSelect) removeSelect.innerHTML = "";

  (groups[currentGroup] || []).forEach((team, index) => {
    // teamSelect, teamA, teamB
    [select, a, b].forEach(el => {
      const opt = document.createElement("option");
      opt.value = index;
      opt.textContent = team.name;
      el.appendChild(opt);
    });

    // renameSelect
    if (renameSelect) {
      const opt = document.createElement("option");
      opt.value = index;
      opt.textContent = team.name;
      renameSelect.appendChild(opt);
    }

    // removeSelect
    if (removeSelect) {
      const opt = document.createElement("option");
      opt.value = index;
      opt.textContent = team.name;
      removeSelect.appendChild(opt);
    }
  });
}


/**********************
  ADMIN ACTIONS
**********************/
function showGroup(letter) {
  currentGroup = letter;
  renderAdmin();
}

function addWin() {
  const sel = byId("teamSelect");
  if (!sel) return;
  saveStateForUndo();

  const g = groups[currentGroup];
  const i = Number(sel.value);
  g[i].p++;
  g[i].w++;
  g[i].points += 3;

  renderAdmin();
}

function addDraw() {
  const sel = byId("teamSelect");
  if (!sel) return;
  saveStateForUndo();

  const g = groups[currentGroup];
  const i = Number(sel.value);
  g[i].p++;
  g[i].d++;
  g[i].points += 1;

  renderAdmin();
}

function addLoss() {
  const sel = byId("teamSelect");
  if (!sel) return;
  saveStateForUndo();

  const g = groups[currentGroup];
  const i = Number(sel.value);
  g[i].p++;
  g[i].l++;

  renderAdmin();
}

function addGoal() {
  const sel = byId("teamSelect");
  if (!sel) return;
  saveStateForUndo();

  const g = groups[currentGroup];
  const i = Number(sel.value);
  g[i].gd++;

  renderAdmin();
}

function removeGoal() {
  const sel = byId("teamSelect");
  if (!sel) return;
  saveStateForUndo();

  const g = groups[currentGroup];
  const i = Number(sel.value);
  g[i].gd--;

  renderAdmin();
}

function submitMatch() {
  const teamA = byId("teamA");
  const teamB = byId("teamB");
  const scoreA = byId("scoreA");
  const scoreB = byId("scoreB");
  if (!teamA || !teamB || !scoreA || !scoreB) return;

  const iA = teamA.value;
  const iB = teamB.value;
  const sA = Number(scoreA.value);
  const sB = Number(scoreB.value);

  if (iA === iB) return alert("A team cannot play itself");
  if (isNaN(sA) || isNaN(sB)) return alert("Enter both scores");

  saveStateForUndo();

  const g = groups[currentGroup];
  const A = g[iA];
  const B = g[iB];

  A.p++; B.p++;
  A.gd += (sA - sB);
  B.gd += (sB - sA);

  if (sA > sB) {
    A.w++; A.points += 3;
    B.l++;
  } else if (sB > sA) {
    B.w++; B.points += 3;
    A.l++;
  } else {
    A.d++; B.d++;
    A.points += 1; B.points += 1;
  }

  scoreA.value = "";
  scoreB.value = "";

  renderAdmin();
}

/**********************
  TEAM MANAGEMENT (NEW)
**********************/
function renameTeam() {
  const renameSelect = byId("renameSelect");
  const renameInput = byId("renameInput");
  if (!renameSelect || !renameInput) return;

  const newName = renameInput.value.trim();
  if (!newName) return alert("Type a new team name first.");

  saveStateForUndo();

  const i = Number(renameSelect.value);
  groups[currentGroup][i].name = newName;

  renameInput.value = "";
  renderAdmin();
}

function addTeam() {
  const newTeamInput = byId("newTeamInput");
  if (!newTeamInput) return;

  const name = newTeamInput.value.trim();
  if (!name) return alert("Type a team name first.");

  saveStateForUndo();

  if (!groups[currentGroup]) groups[currentGroup] = [];
  groups[currentGroup].push({ name, p: 0, w: 0, d: 0, l: 0, points: 0, gd: 0 });

  newTeamInput.value = "";
  renderAdmin();
}

/**********************
  UNDO & RESET
**********************/
function undoLastAction() {
  if (undoStack.length === 0) return alert("No actions to undo!");
  groups = undoStack.pop();
  renderAdmin();
  renderPublic(); // safe if on public page too
}

function resetTournament() {
  if (!confirm("Reset all data?")) return;

  localStorage.removeItem("groups");
  undoStack = [];
  groups = defaultGroups();
  saveGroups();

  renderAdmin();
  renderPublic();
  alert("Tournament has been reset!");
}

/**********************
  PUBLIC RENDER
**********************/
let publicCurrentGroup = "A";

function renderPublic() {
  const select = byId("publicGroupSelect");
  const table = byId("publicTable");
  if (!select || !table) return; // not on this page

  // refresh groups in case admin updated elsewhere
  groups = loadGroups();

  publicCurrentGroup = select.value;
  const group = groups[publicCurrentGroup] || [];
  if (group.length === 0) {
    table.innerHTML = `<tr><th>No teams in Group ${publicCurrentGroup}</th></tr>`;
    return;
  }

  sortGroup(group);

  table.innerHTML = `
    <tr>
      <th>Team</th><th>P</th><th>W</th><th>D</th><th>L</th><th>Pts</th><th>GD</th>
    </tr>
  `;

  const topPoints = group[0].points;
  const bottomPoints = group[group.length - 1].points;

  group.forEach(team => {
    let rowClass = "";
    if (team.points === topPoints) rowClass = "top-team";
    else if (team.points === bottomPoints) rowClass = "bottom-team";

    table.innerHTML += `
      <tr class="${rowClass}">
        <td>${team.name}</td>
        <td>${team.p}</td>
        <td>${team.w}</td>
        <td>${team.d}</td>
        <td>${team.l}</td>
        <td>${team.points}</td>
        <td>${team.gd}</td>
      </tr>
    `;
  });
}

/**********************
  START
**********************/
document.addEventListener("DOMContentLoaded", () => {
  renderAdmin();
  renderPublic();

  // Public page auto-refresh (does nothing on admin page)
  setInterval(() => {
    renderPublic();
  }, 10000); // 5 seconds
});


/**********************
  Make onclick="" work
**********************/
window.showGroup = showGroup;
window.addWin = addWin;
window.addDraw = addDraw;
window.addLoss = addLoss;
window.addGoal = addGoal;
window.removeGoal = removeGoal;
window.submitMatch = submitMatch;
window.undoLastAction = undoLastAction;
window.resetTournament = resetTournament;
window.renderPublicGroup = renderPublic;
window.renameTeam = renameTeam;
window.addTeam = addTeam;
