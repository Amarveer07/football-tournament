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
function toArray(maybeArrayOrObject) {
  if (Array.isArray(maybeArrayOrObject)) return maybeArrayOrObject;
  if (maybeArrayOrObject && typeof maybeArrayOrObject === "object") {
    // Convert {"0": {...}, "1": {...}} -> [{...},{...}] in numeric key order
    return Object.keys(maybeArrayOrObject)
      .sort((a, b) => Number(a) - Number(b))
      .map(k => maybeArrayOrObject[k]);
  }
  return [];
}

function normalizeGroups(raw) {
  const out = { A: [], B: [], C: [], D: [] };
  ["A", "B", "C", "D"].forEach(letter => {
    out[letter] = toArray(raw?.[letter]);
  });
  return out;
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

/**********************
  FIREBASE SYNC (Realtime Database)
**********************/
function dbReady() {
  return typeof window.db !== "undefined" && window.db && window.db.ref;
}

function writeGroupsToFirebase() {
  if (!dbReady()) return;
  return window.db.ref("tournament/groups").set(groups);
}

function listenToGroupsFromFirebase() {
  if (!dbReady()) return;

  window.db.ref("tournament/groups").on("value", (snapshot) => {
    const data = snapshot.val();

    if (data && typeof data === "object") {
      groups = normalizeGroups(data);
      renderAdmin();
      renderPublicGroup();
      fillMatchTeamDropdowns();
    }
  });
}


function saveGroups() {
  // keep a local backup
  localStorage.setItem("groups", JSON.stringify(groups));
  // write to shared online database
  writeGroupsToFirebase();
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
  MATCHES (Firebase)
  Data path: tournament/matches/{A|B|C|D}/{matchId}
**********************/
let matches = { A: {}, B: {}, C: {}, D: {} };

function listenToMatchesFromFirebase() {
  if (!dbReady()) return;

  window.db.ref("tournament/matches").on("value", (snapshot) => {
    const data = snapshot.val();
    matches = data && typeof data === "object" ? data : { A: {}, B: {}, C: {}, D: {} };

   //  rebuild standings from match results
recalcStandingsFromMatches();

//  now re-render tables + matches
renderAdmin();
renderPublicGroup();
renderPublicMatches();
renderAdminMatches();
  });
}

function isAdminAuthed() {
  return !!(window.auth && window.auth.currentUser);
}

function matchObjToArray(groupLetter) {
  const obj = matches?.[groupLetter] || {};
  return Object.entries(obj).map(([id, m]) => ({ id, ...m }));
}

function formatMatchTime(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleString([], {
    year: "numeric", month: "short", day: "2-digit",
    hour: "2-digit", minute: "2-digit"
  });
}

function matchIsResult(m) {
  return m && m.scoreA !== null && m.scoreA !== undefined && m.scoreB !== null && m.scoreB !== undefined;
}

/**********************
  PUBLIC MATCH RENDER
**********************/
function renderPublicMatches() {
  const upcomingEl = byId("publicUpcoming");
  const resultsEl = byId("publicResults");
  if (!upcomingEl || !resultsEl) return;

  const groupLetter = (byId("publicGroupSelect")?.value) || "A";
  const list = matchObjToArray(groupLetter);

  list.sort((m1, m2) => {
    const t1 = new Date(m1.time || "9999-12-31T00:00:00Z").getTime();
    const t2 = new Date(m2.time || "9999-12-31T00:00:00Z").getTime();
    return t1 - t2;
  });

  const upcoming = list.filter(m => !matchIsResult(m));
  const results = list.filter(m => matchIsResult(m));

  upcomingEl.innerHTML = upcoming.length
    ? upcoming.map(m => `
        <div style="padding:10px 12px; border:1px solid rgba(255,255,255,0.10); border-radius:12px; margin-bottom:10px;">
          <div style="font-weight:700;">${m.teamA} vs ${m.teamB}</div>
          <div style="opacity:0.75; font-size:13px; margin-top:4px;">
            ${formatMatchTime(m.time)} • ${m.pitch ? `Pitch: ${m.pitch}` : "Pitch: TBC"}
          </div>
        </div>
      `).join("")
    : `<div style="opacity:0.7; font-size:13px;">No upcoming matches yet.</div>`;

  resultsEl.innerHTML = results.length
    ? results.map(m => `
        <div style="padding:10px 12px; border:1px solid rgba(255,255,255,0.10); border-radius:12px; margin-bottom:10px;">
          <div style="font-weight:700;">
            ${m.teamA} ${m.scoreA}–${m.scoreB} ${m.teamB}
          </div>
          <div style="opacity:0.75; font-size:13px; margin-top:4px;">
            ${formatMatchTime(m.time)} • ${m.pitch ? `Pitch: ${m.pitch}` : "Pitch: TBC"}
          </div>
        </div>
      `).join("")
    : `<div style="opacity:0.7; font-size:13px;">No results yet.</div>`;
}

/**********************
  ADMIN RENDER
**********************/
function renderAdmin() {
  const table = byId("groupTable");
  if (!table) return;

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
  const select = byId("teamSelect");        // Update Team dropdown (still used)
  const renameSelect = byId("renameSelect");
  const removeSelect = byId("removeSelect");

  // If teamSelect isn't on the page, we're not on admin
  if (!select) return;

  select.innerHTML = "";
  if (renameSelect) renameSelect.innerHTML = "";
  if (removeSelect) removeSelect.innerHTML = "";

  (groups[currentGroup] || []).forEach((team, index) => {
    // teamSelect
    const opt = document.createElement("option");
    opt.value = index;
    opt.textContent = team.name;
    select.appendChild(opt);

    // renameSelect
    if (renameSelect) {
      const opt2 = document.createElement("option");
      opt2.value = index;
      opt2.textContent = team.name;
      renameSelect.appendChild(opt2);
    }

    // removeSelect
    if (removeSelect) {
      const opt3 = document.createElement("option");
      opt3.value = index;
      opt3.textContent = team.name;
      removeSelect.appendChild(opt3);
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
  g[i].p++; g[i].w++; g[i].points += 3;
  renderAdmin();
}

function addDraw() {
  const sel = byId("teamSelect");
  if (!sel) return;
  saveStateForUndo();
  const g = groups[currentGroup];
  const i = Number(sel.value);
  g[i].p++; g[i].d++; g[i].points += 1;
  renderAdmin();
}

function addLoss() {
  const sel = byId("teamSelect");
  if (!sel) return;
  saveStateForUndo();
  const g = groups[currentGroup];
  const i = Number(sel.value);
  g[i].p++; g[i].l++;
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

  if (sA > sB) { A.w++; A.points += 3; B.l++; }
  else if (sB > sA) { B.w++; B.points += 3; A.l++; }
  else { A.d++; B.d++; A.points += 1; B.points += 1; }

  scoreA.value = "";
  scoreB.value = "";

  renderAdmin();
}

/**********************
  ADMIN MATCH UI + ACTIONS
**********************/
function fillMatchTeamDropdowns() {
  const grpSel = byId("matchGroup");
  const aSel = byId("matchTeamA");
  const bSel = byId("matchTeamB");
  if (!grpSel || !aSel || !bSel) return;

  const g = grpSel.value || "A";
  const teams = (groups[g] || []).map(t => t.name);

  aSel.innerHTML = "";
  bSel.innerHTML = "";

  teams.forEach((name) => {
    const o1 = document.createElement("option");
    o1.value = name;
    o1.textContent = name;
    aSel.appendChild(o1);

    const o2 = document.createElement("option");
    o2.value = name;
    o2.textContent = name;
    bSel.appendChild(o2);
  });
}

function renderAdminMatches() {
  const listEl = byId("adminMatchesList");
  const grpSel = byId("matchGroup");
  if (!listEl || !grpSel) return;

  const g = grpSel.value || "A";
  const list = matchObjToArray(g);

  list.sort((m1, m2) => {
    const t1 = new Date(m1.time || "9999-12-31T00:00:00Z").getTime();
    const t2 = new Date(m2.time || "9999-12-31T00:00:00Z").getTime();
    return t1 - t2;
  });

  if (list.length === 0) {
    listEl.innerHTML = `<div style="opacity:0.7; font-size:13px;">No matches in Group ${g} yet.</div>`;
    return;
  }

  listEl.innerHTML = list.map(m => `
    <div style="padding:10px 12px; border:1px solid rgba(255,255,255,0.10); border-radius:12px; margin-bottom:10px;">
      <div style="font-weight:700;">${m.teamA} vs ${m.teamB}</div>
      <div style="opacity:0.75; font-size:13px; margin-top:4px;">
        ${formatMatchTime(m.time)} • ${m.pitch ? `Pitch: ${m.pitch}` : "Pitch: TBC"}
      </div>

      <div style="margin-top:10px; display:flex; gap:8px; flex-wrap:wrap; align-items:center;">
        <input type="number" placeholder="A" style="width:90px;" id="scoreA_${m.id}" value="${matchIsResult(m) ? m.scoreA : ""}">
        <input type="number" placeholder="B" style="width:90px;" id="scoreB_${m.id}" value="${matchIsResult(m) ? m.scoreB : ""}">
        <button onclick="saveMatchScore('${g}','${m.id}')">Save Score</button>
        <button onclick="deleteMatch('${g}','${m.id}')">Delete</button>
      </div>
    </div>
  `).join("");
}

function addMatch() {
  if (!dbReady()) return alert("Database not ready yet.");
  if (!isAdminAuthed()) return alert("Please log in as admin first.");

  const grp = byId("matchGroup")?.value || "A";
  const teamA = byId("matchTeamA")?.value;
  const teamB = byId("matchTeamB")?.value;
  const timeLocal = byId("matchTime")?.value;
  const pitch = (byId("matchPitch")?.value || "").trim();

  if (!teamA || !teamB) return alert("Pick both teams.");
  if (teamA === teamB) return alert("A team cannot play itself.");

  const timeISO = timeLocal ? new Date(timeLocal).toISOString() : "";

  const newRef = window.db.ref(`tournament/matches/${grp}`).push();
  newRef.set({ teamA, teamB, time: timeISO, pitch: pitch || "", scoreA: null, scoreB: null });

  if (byId("matchTime")) byId("matchTime").value = "";
  if (byId("matchPitch")) byId("matchPitch").value = "";
}

function saveMatchScore(groupLetter, matchId) {
  if (!dbReady()) return alert("Database not ready yet.");
  if (!isAdminAuthed()) return alert("Please log in as admin first.");

  const aVal = byId(`scoreA_${matchId}`)?.value;
  const bVal = byId(`scoreB_${matchId}`)?.value;

  const scoreA = Number(aVal);
  const scoreB = Number(bVal);

  if (Number.isNaN(scoreA) || Number.isNaN(scoreB)) {
    return alert("Enter both scores (numbers).");
  }

  window.db.ref(`tournament/matches/${groupLetter}/${matchId}`).update({ scoreA, scoreB });
}

function deleteMatch(groupLetter, matchId) {
  if (!dbReady()) return alert("Database not ready yet.");
  if (!isAdminAuthed()) return alert("Please log in as admin first.");
  if (!confirm("Delete this match?")) return;
  window.db.ref(`tournament/matches/${groupLetter}/${matchId}`).remove();
}

/**********************
  TEAM MANAGEMENT
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
  renderPublicGroup();
  fillMatchTeamDropdowns();
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
  renderPublicGroup();
  fillMatchTeamDropdowns();
}

function removeTeam() {
  const removeSelect = byId("removeSelect");
  if (!removeSelect) return;

  const i = Number(removeSelect.value);
  const team = groups[currentGroup]?.[i];
  if (!team) return;

  if ((groups[currentGroup] || []).length <= 2) {
    return alert("You must have at least 2 teams in a group.");
  }

  if (!confirm(`Remove ${team.name} from Group ${currentGroup}?`)) return;

  saveStateForUndo();
  groups[currentGroup].splice(i, 1);

  renderAdmin();
  renderPublicGroup();
  fillMatchTeamDropdowns();
}

/**********************
  UNDO & RESET
**********************/
function undoLastAction() {
  if (undoStack.length === 0) return alert("No actions to undo!");
  groups = undoStack.pop();
  renderAdmin();
  renderPublicGroup();
  fillMatchTeamDropdowns();
}

function resetTournament() {
  if (!confirm("Reset all data?")) return;

  localStorage.removeItem("groups");
  undoStack = [];
  groups = defaultGroups();
  saveGroups();

  renderAdmin();
  renderPublicGroup();
  fillMatchTeamDropdowns();
  alert("Tournament has been reset!");
}

/**********************
  PUBLIC RENDER (Table + Matches)
**********************/
let publicCurrentGroup = "A";

function renderPublicGroup() {
  const select = byId("publicGroupSelect");
  const table = byId("publicTable");
  if (!select || !table) return;

  publicCurrentGroup = select.value;
  const group = groups[publicCurrentGroup] || [];

  if (group.length === 0) {
    table.innerHTML = `<tr><th>No teams in Group ${publicCurrentGroup}</th></tr>`;
    renderPublicMatches();
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

  // IMPORTANT: keep matches in sync with group selection
  renderPublicMatches();
}

/**********************
  ADMIN AUTH (Firebase)
**********************/
function setAdminStatus(text) {
  const el = byId("adminStatus");
  if (el) el.textContent = text;
}

function adminLogin() {
  if (!window.auth) return alert("Auth not ready");

  const email = byId("adminEmail")?.value?.trim();
  const pass = byId("adminPassword")?.value;

  if (!email || !pass) return alert("Enter email + password");

  window.auth
    .signInWithEmailAndPassword(email, pass)
    .then(() => alert("Logged in!"))
    .catch((err) => alert(err.message));
}

function adminLogout() {
  if (!window.auth) return;
  window.auth.signOut().then(() => alert("Logged out"));
}
function recalcStandingsFromMatches() {
  // Reset all stats back to 0
  ["A","B","C","D"].forEach(letter => {
    (groups[letter] || []).forEach(t => {
      t.p = 0; t.w = 0; t.d = 0; t.l = 0;
      t.points = 0; t.gd = 0;
    });
  });

  // Apply all finished match results onto the table
  ["A","B","C","D"].forEach(letter => {
    const list = matchObjToArray(letter);

    list.forEach(m => {
      if (!matchIsResult(m)) return;

      const sA = Number(m.scoreA);
      const sB = Number(m.scoreB);
      if (Number.isNaN(sA) || Number.isNaN(sB)) return;

      const teamA = (groups[letter] || []).find(t => t.name === m.teamA);
      const teamB = (groups[letter] || []).find(t => t.name === m.teamB);
      if (!teamA || !teamB) return;

      teamA.p++; teamB.p++;
      teamA.gd += (sA - sB);
      teamB.gd += (sB - sA);

      if (sA > sB) {
        teamA.w++; teamA.points += 3;
        teamB.l++;
      } else if (sB > sA) {
        teamB.w++; teamB.points += 3;
        teamA.l++;
      } else {
        teamA.d++; teamB.d++;
        teamA.points += 1;
        teamB.points += 1;
      }
    });
  });
}

/**********************
  START (single predictable boot)
**********************/
document.addEventListener("DOMContentLoaded", () => {
  // Auth status
  if (window.auth) {
    window.auth.onAuthStateChanged((user) => {
      if (user) setAdminStatus("Signed in as " + user.email);
      else setAdminStatus("Not signed in");
    });
  }

  // Firebase listeners
  listenToGroupsFromFirebase();
  listenToMatchesFromFirebase();

  // Initial renders
  renderAdmin();
  renderPublicGroup();
  renderPublicMatches();
  renderAdminMatches();

  // Admin match dropdowns
  const grpSel = byId("matchGroup");
  if (grpSel) {
    fillMatchTeamDropdowns();
    grpSel.addEventListener("change", () => {
      fillMatchTeamDropdowns();
      renderAdminMatches();
    });
  }

  // Public group selector should update matches too
  const pubSel = byId("publicGroupSelect");
  if (pubSel) {
    pubSel.addEventListener("change", renderPublicGroup);
  }

  // Optional safety refresh (Firebase already pushes updates)
  setInterval(() => {
    renderPublicGroup();
  }, 5000);
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

window.renameTeam = renameTeam;
window.addTeam = addTeam;
window.removeTeam = removeTeam;

window.adminLogin = adminLogin;
window.adminLogout = adminLogout;

window.addMatch = addMatch;
window.saveMatchScore = saveMatchScore;
window.deleteMatch = deleteMatch;

// Keep your old inline onchange="renderPublicGroup()" working
window.renderPublicGroup = renderPublicGroup;
