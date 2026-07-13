/* ==================================================
   FOOTBALL TOURNAMENT APPLICATION
   Shared by the public and admin pages.
================================================== */

/* ==================================================
   Default Data and Normalisation
================================================== */

function createTeam(name) {
  return {
    name,
    logo: "",
    p: 0,
    w: 0,
    d: 0,
    l: 0,
    points: 0,
    gd: 0,
    adjustments: {
      p: 0,
      w: 0,
      d: 0,
      l: 0,
      points: 0,
      gd: 0
    }
  };
}

function defaultGroups() {
  return {
    A: [createTeam("Lions"), createTeam("Tigers")],
    B: [createTeam("Eagles"), createTeam("Sharks")],
    C: [createTeam("Bears"), createTeam("Spiders")],
    D: [createTeam("Monkeys"), createTeam("Fishes")]
  };
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function toNumber(value, fallback = 0) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

function toArray(value) {
  if (Array.isArray(value)) {
    return value;
  }

  if (value && typeof value === "object") {
    return Object.keys(value)
      .sort((a, b) => {
        const aNumber = Number(a);
        const bNumber = Number(b);

        if (Number.isFinite(aNumber) && Number.isFinite(bNumber)) {
          return aNumber - bNumber;
        }

        return a.localeCompare(b);
      })
      .map((key) => value[key]);
  }

  return [];
}

function normalizeAdjustments(raw) {
  return {
    p: toNumber(raw?.p),
    w: toNumber(raw?.w),
    d: toNumber(raw?.d),
    l: toNumber(raw?.l),
    points: toNumber(raw?.points),
    gd: toNumber(raw?.gd)
  };
}

function normalizeTeam(raw) {
  return {
    name: String(raw?.name || "Unnamed team").trim(),
    logo: String(raw?.logo || "").trim(),
    p: toNumber(raw?.p),
    w: toNumber(raw?.w),
    d: toNumber(raw?.d),
    l: toNumber(raw?.l),
    points: toNumber(raw?.points),
    gd: toNumber(raw?.gd),
    adjustments: normalizeAdjustments(raw?.adjustments)
  };
}

function normalizeGroupKeys(rawGroupKeys, rawGroups) {
  const keys = new Set();

  if (Array.isArray(rawGroupKeys)) {
    rawGroupKeys.forEach((key) => {
      if (key) keys.add(String(key));
    });
  } else if (rawGroupKeys && typeof rawGroupKeys === "object") {
    Object.keys(rawGroupKeys).forEach((key) => {
      if (rawGroupKeys[key]) keys.add(String(key));
    });
  }

  if (rawGroups && typeof rawGroups === "object") {
    Object.keys(rawGroups).forEach((key) => keys.add(String(key)));
  }

  return [...keys].sort((a, b) => a.localeCompare(b));
}

function normalizeGroups(rawGroups, keys) {
  const normalized = {};

  keys.forEach((key) => {
    normalized[key] = toArray(rawGroups?.[key]).map(normalizeTeam);
  });

  return normalized;
}

function normalizeMatches(rawMatches, keys) {
  const normalized = {};

  keys.forEach((key) => {
    const groupMatches = rawMatches?.[key];
    normalized[key] =
      groupMatches && typeof groupMatches === "object"
        ? groupMatches
        : {};
  });

  return normalized;
}

function groupRegistryFromKeys(keys) {
  return keys.reduce((registry, key) => {
    registry[key] = true;
    return registry;
  }, {});
}

/* ==================================================
   Local State
================================================== */

function loadLocalState() {
  try {
    const saved = localStorage.getItem("footballTournamentState");

    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed && typeof parsed === "object") return parsed;
    }

    // One-time support for the localStorage format used by the old app.js.
    const legacyGroups = localStorage.getItem("groups");
    if (legacyGroups) {
      const parsedGroups = JSON.parse(legacyGroups);

      if (parsedGroups && typeof parsedGroups === "object") {
        return { groups: parsedGroups };
      }
    }

    return null;
  } catch (error) {
    console.warn("Could not load the local tournament backup.", error);
    return null;
  }
}

const localState = loadLocalState();
const initialGroups = localState?.groups || defaultGroups();

let groupKeys = normalizeGroupKeys(
  localState?.groupKeys,
  initialGroups
);

if (groupKeys.length === 0) {
  groupKeys = Object.keys(defaultGroups());
}

let groups = normalizeGroups(initialGroups, groupKeys);
let matches = normalizeMatches(localState?.matches, groupKeys);
let currentGroup = groupKeys[0] || "";
let undoStack = [];

function getGroupKeys() {
  return [...groupKeys].sort((a, b) => a.localeCompare(b));
}

function ensureGroupExists(groupKey) {
  if (!groupKey) return;

  if (!groupKeys.includes(groupKey)) {
    groupKeys.push(groupKey);
    groupKeys.sort((a, b) => a.localeCompare(b));
  }

  if (!groups[groupKey]) groups[groupKey] = [];
  if (!matches[groupKey]) matches[groupKey] = {};
}

function createStateSnapshot() {
  return clone({
    groupKeys,
    groups,
    matches,
    currentGroup
  });
}

function restoreState(snapshot) {
  groupKeys = [...(snapshot.groupKeys || [])];
  groups = clone(snapshot.groups || {});
  matches = clone(snapshot.matches || {});
  currentGroup = snapshot.currentGroup || groupKeys[0] || "";
}

function saveLocalState() {
  try {
    localStorage.setItem(
      "footballTournamentState",
      JSON.stringify({ groupKeys, groups, matches })
    );
  } catch (error) {
    console.warn("Could not save the local tournament backup.", error);
  }
}

/* ==================================================
   General Helpers
================================================== */

function byId(id) {
  return document.getElementById(id);
}

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>'"]/g, (character) => {
    const entities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      "'": "&#39;",
      '"': "&quot;"
    };

    return entities[character];
  });
}
function renderTeamName(team) {
  const logoPath = String(team.logo || "").trim();

  const logoHtml = logoPath
    ? `
        <img
          class="team-logo"
          src="${escapeHtml(logoPath)}"
          alt=""
          loading="lazy"
        >
      `
    : "";

  return `
    <div class="team-name-cell">
      ${logoHtml}
      <span>${escapeHtml(team.name)}</span>
    </div>
  `;
}
function setLastUpdatedNow() {
  const element = byId("lastUpdated");
  if (!element) return;

  element.textContent = new Date().toLocaleString([], {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit"
  });
}

function setLiveStatus(isConnected) {
  const dot = byId("liveDot");
  const status = byId("liveStatus");

  if (dot) {
    dot.style.background = isConnected ? "#22c55e" : "#ef4444";
  }

  if (status) {
    status.title = isConnected
      ? "Connected to live tournament updates"
      : "Disconnected from live tournament updates";
  }
}

function formatMatchTime(isoString) {
  if (!isoString) return "Time TBC";

  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) return String(isoString);

  return date.toLocaleString([], {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  });
}

function matchIsResult(match) {
  return (
    match &&
    match.scoreA !== null &&
    match.scoreA !== undefined &&
    match.scoreB !== null &&
    match.scoreB !== undefined
  );
}

function matchObjectToArray(groupKey) {
  const groupMatches = matches?.[groupKey] || {};

  return Object.entries(groupMatches).map(([id, match]) => ({
    id,
    ...match
  }));
}

function sortMatchesByTime(matchList) {
  return [...matchList].sort((first, second) => {
    const firstTime = new Date(
      first.time || "9999-12-31T00:00:00Z"
    ).getTime();

    const secondTime = new Date(
      second.time || "9999-12-31T00:00:00Z"
    ).getTime();

    return firstTime - secondTime;
  });
}

function teamNameExists(groupKey, teamName, ignoredIndex = -1) {
  const normalizedName = teamName.trim().toLowerCase();

  return (groups[groupKey] || []).some((team, index) => {
    return (
      index !== ignoredIndex &&
      team.name.trim().toLowerCase() === normalizedName
    );
  });
}

function getSelectedTeam(selectId) {
  const select = byId(selectId);
  if (!select || !currentGroup) return null;

  const index = Number(select.value);
  const team = groups[currentGroup]?.[index];

  if (!team) return null;

  return { index, team };
}

/* ==================================================
   Firebase and Persistence
================================================== */

function databaseIsReady() {
  return Boolean(window.db && typeof window.db.ref === "function");
}

function adminIsAuthenticated() {
  return Boolean(window.auth?.currentUser);
}

function requireAdmin() {
  if (!adminIsAuthenticated()) {
    alert("Please sign in as an admin first.");
    return false;
  }

  return true;
}

async function writeTournamentState() {
  if (!databaseIsReady()) {
    throw new Error("The database is not ready yet.");
  }

  await window.db.ref("tournament").update({
    groupKeys: groupRegistryFromKeys(groupKeys),
    groups,
    matches
  });
}

async function commitStateChange(changeFunction) {
  if (!requireAdmin()) return false;

  const previousState = createStateSnapshot();
  undoStack.push(previousState);

  if (undoStack.length > 30) {
    undoStack.shift();
  }

  try {
    changeFunction();
    recalculateStandingsFromMatches();
    saveLocalState();
    renderEverything();
    await writeTournamentState();
    return true;
  } catch (error) {
    console.error(error);

    restoreState(previousState);
    undoStack.pop();
    recalculateStandingsFromMatches();
    saveLocalState();
    renderEverything();

    alert(`The change could not be saved: ${error.message}`);
    return false;
  }
}

function listenToTournamentFromFirebase() {
  if (!databaseIsReady()) return;

  window.db.ref("tournament").on(
    "value",
    (snapshot) => {
      const data = snapshot.val();

      if (data && typeof data === "object") {
        const incomingKeys = normalizeGroupKeys(
          data.groupKeys,
          data.groups
        );

        if (incomingKeys.length > 0) {
          groupKeys = incomingKeys;
          groups = normalizeGroups(data.groups, groupKeys);
          matches = normalizeMatches(data.matches, groupKeys);

          if (!groupKeys.includes(currentGroup)) {
            currentGroup = groupKeys[0] || "";
          }
        }
      }

      recalculateStandingsFromMatches();
      saveLocalState();
      renderEverything();
      setLastUpdatedNow();
    },
    (error) => {
      console.error("Tournament data could not be loaded.", error);
      setLiveStatus(false);
    }
  );
}

function listenToConnectionStatus() {
  if (!databaseIsReady()) return;

  window.db.ref(".info/connected").on("value", (snapshot) => {
    setLiveStatus(Boolean(snapshot.val()));
  });
}

/* ==================================================
   Standings Calculation
================================================== */

function applyTeamAdjustments(team) {
  const adjustments = normalizeAdjustments(team.adjustments);

  team.p = adjustments.p;
  team.w = adjustments.w;
  team.d = adjustments.d;
  team.l = adjustments.l;
  team.points = adjustments.points;
  team.gd = adjustments.gd;
}

function recalculateStandingsFromMatches() {
  getGroupKeys().forEach((groupKey) => {
    (groups[groupKey] || []).forEach(applyTeamAdjustments);
  });

  getGroupKeys().forEach((groupKey) => {
    matchObjectToArray(groupKey).forEach((match) => {
      if (!matchIsResult(match)) return;

      const scoreA = Number(match.scoreA);
      const scoreB = Number(match.scoreB);

      if (!Number.isFinite(scoreA) || !Number.isFinite(scoreB)) {
        return;
      }

      const teamA = (groups[groupKey] || []).find(
        (team) => team.name === match.teamA
      );

      const teamB = (groups[groupKey] || []).find(
        (team) => team.name === match.teamB
      );

      if (!teamA || !teamB) return;

      teamA.p += 1;
      teamB.p += 1;

      teamA.gd += scoreA - scoreB;
      teamB.gd += scoreB - scoreA;

      if (scoreA > scoreB) {
        teamA.w += 1;
        teamA.points += 3;
        teamB.l += 1;
      } else if (scoreB > scoreA) {
        teamB.w += 1;
        teamB.points += 3;
        teamA.l += 1;
      } else {
        teamA.d += 1;
        teamB.d += 1;
        teamA.points += 1;
        teamB.points += 1;
      }
    });
  });
}

function getSortedGroup(groupKey) {
  return [...(groups[groupKey] || [])].sort((first, second) => {
    if (second.points !== first.points) {
      return second.points - first.points;
    }

    if (second.gd !== first.gd) {
      return second.gd - first.gd;
    }

    return first.name.localeCompare(second.name);
  });
}

function renderStandingsTable(table, groupKey) {
  if (!table) return;

  const group = getSortedGroup(groupKey);

  if (!groupKey) {
    table.innerHTML = "<tr><th>No groups have been created yet.</th></tr>";
    return;
  }

  if (group.length === 0) {
    table.innerHTML = `
      <tr>
        <th>No teams in Group ${escapeHtml(groupKey)}</th>
      </tr>
    `;
    return;
  }

  const topPoints = group[0].points;
  const bottomPoints = group[group.length - 1].points;

  const rows = group
    .map((team) => {
      let rowClass = "";

      if (team.points === topPoints) {
        rowClass = "top-team";
      } else if (team.points === bottomPoints) {
        rowClass = "bottom-team";
      }

      return `
        <tr class="${rowClass}">
<td>${renderTeamName(team)}</td>
          <td>${team.p}</td>
          <td>${team.w}</td>
          <td>${team.d}</td>
          <td>${team.l}</td>
          <td>${team.points}</td>
          <td>${team.gd}</td>
        </tr>
      `;
    })
    .join("");

  table.innerHTML = `
    <thead>
      <tr>
        <th>Team</th>
        <th>P</th>
        <th>W</th>
        <th>D</th>
        <th>L</th>
        <th>Pts</th>
        <th>GD</th>
      </tr>
    </thead>
    <tbody>${rows}</tbody>
  `;
}

/* ==================================================
   Dynamic Group Interface
================================================== */

function refreshGroupInterface() {
  const keys = getGroupKeys();

  if (!keys.includes(currentGroup)) {
    currentGroup = keys[0] || "";
  }

  const tabs = document.querySelector(".tabs");
  if (tabs) {
    tabs.innerHTML = keys.length
      ? keys
          .map((key) => {
            const activeClass = key === currentGroup ? "active" : "";
            const encodedKey = encodeURIComponent(key);

            return `
              <button
                type="button"
                class="${activeClass}"
                onclick="showGroup(decodeURIComponent('${encodedKey}'))"
              >
                Group ${escapeHtml(key)}
              </button>
            `;
          })
          .join("")
      : "";
  }

  updateGroupSelect("publicGroupSelect", keys, currentGroup);
  updateGroupSelect("removeGroupSelect", keys, currentGroup);
  updateGroupSelect("matchGroup", keys, currentGroup);
}

function updateGroupSelect(selectId, keys, fallbackValue) {
  const select = byId(selectId);
  if (!select) return;

  const previousValue = select.value;

  select.innerHTML = keys
    .map(
      (key) =>
        `<option value="${escapeHtml(key)}">Group ${escapeHtml(key)}</option>`
    )
    .join("");

  if (keys.includes(previousValue)) {
    select.value = previousValue;
  } else if (keys.includes(fallbackValue)) {
    select.value = fallbackValue;
  } else if (keys.length > 0) {
    select.value = keys[0];
  }
}

function showGroup(groupKey) {
  if (!groupKeys.includes(groupKey)) return;

  currentGroup = groupKey;
  refreshGroupInterface();
  renderAdminStandings();
  updateAdminTeamDropdowns();
}

async function addGroup() {
  const input = byId("newGroupName");
  if (!input) return;

  let groupKey = input.value.trim();
  if (!groupKey) {
    alert("Enter a group name first.");
    return;
  }

  groupKey = groupKey.replace(/^group\s+/i, "").trim().toUpperCase();

  if (!/^[A-Z0-9_-]{1,8}$/.test(groupKey)) {
    alert("Use 1–8 letters, numbers, hyphens or underscores.");
    return;
  }

  if (groupKeys.includes(groupKey)) {
    alert("That group already exists.");
    return;
  }

  const saved = await commitStateChange(() => {
    ensureGroupExists(groupKey);
    currentGroup = groupKey;
  });

  if (saved) input.value = "";
}

async function removeGroup() {
  const select = byId("removeGroupSelect");
  const groupKey = select?.value;

  if (!groupKey || !groupKeys.includes(groupKey)) return;

  if (groupKeys.length === 1) {
    alert("The tournament must keep at least one group.");
    return;
  }

  const teamCount = (groups[groupKey] || []).length;
  const matchCount = Object.keys(matches[groupKey] || {}).length;

  if (teamCount > 0) {
    alert("Remove every team from this group first.");
    return;
  }

  if (matchCount > 0) {
    alert("Delete every match from this group first.");
    return;
  }

  if (!confirm(`Remove Group ${groupKey}?`)) return;

  await commitStateChange(() => {
    groupKeys = groupKeys.filter((key) => key !== groupKey);
    delete groups[groupKey];
    delete matches[groupKey];

    if (currentGroup === groupKey) {
      currentGroup = groupKeys[0] || "";
    }
  });
}

/* ==================================================
   Public Page
================================================== */

function renderPublicGroup() {
  const select = byId("publicGroupSelect");
  const table = byId("publicTable");

  if (!select || !table) return;

  const selectedGroup = groupKeys.includes(select.value)
    ? select.value
    : groupKeys[0] || "";

  if (selectedGroup && select.value !== selectedGroup) {
    select.value = selectedGroup;
  }

  renderStandingsTable(table, selectedGroup);
  renderPublicMatches(selectedGroup);
}

function renderPublicMatches(groupKeyFromRender) {
  const upcomingElement = byId("publicUpcoming");
  const resultsElement = byId("publicResults");

  if (!upcomingElement || !resultsElement) return;

  const selectedGroup =
    groupKeyFromRender || byId("publicGroupSelect")?.value || groupKeys[0] || "";

  const matchList = sortMatchesByTime(
    matchObjectToArray(selectedGroup)
  );

  const upcomingMatches = matchList.filter(
    (match) => !matchIsResult(match)
  );

  const completedMatches = matchList.filter(matchIsResult);

  upcomingElement.innerHTML = upcomingMatches.length
    ? upcomingMatches.map(renderPublicUpcomingMatch).join("")
    : '<p class="empty-state">No upcoming matches yet.</p>';

  resultsElement.innerHTML = completedMatches.length
    ? completedMatches.map(renderPublicResult).join("")
    : '<p class="empty-state">No results yet.</p>';
}

function renderPublicUpcomingMatch(match) {
  return `
    <article class="match-card">
      <div class="match-title">
        ${escapeHtml(match.teamA)} vs ${escapeHtml(match.teamB)}
      </div>
      <div class="match-meta">
        ${escapeHtml(formatMatchTime(match.time))}
        · ${match.pitch ? `Pitch: ${escapeHtml(match.pitch)}` : "Pitch: TBC"}
      </div>
    </article>
  `;
}

function renderPublicResult(match) {
  return `
    <article class="match-card">
      <div class="match-title">
        ${escapeHtml(match.teamA)}
        ${toNumber(match.scoreA)}–${toNumber(match.scoreB)}
        ${escapeHtml(match.teamB)}
      </div>
      <div class="match-meta">
        ${escapeHtml(formatMatchTime(match.time))}
        · ${match.pitch ? `Pitch: ${escapeHtml(match.pitch)}` : "Pitch: TBC"}
      </div>
    </article>
  `;
}

/* ==================================================
   Admin Page Rendering
================================================== */

function renderAdminStandings() {
  renderStandingsTable(byId("groupTable"), currentGroup);
}

function updateAdminTeamDropdowns() {
  const selectIds = [
  "teamSelect",
  "renameSelect",
  "removeSelect",
  "logoTeamSelect"
];
  const teams = groups[currentGroup] || [];

  selectIds.forEach((selectId) => {
    const select = byId(selectId);
    if (!select) return;

    const previousValue = select.value;

    select.innerHTML = teams
      .map(
        (team, index) =>
          `<option value="${index}">${escapeHtml(team.name)}</option>`
      )
      .join("");

    if (teams[Number(previousValue)]) {
      select.value = previousValue;
    }
  });
}

function fillMatchTeamDropdowns() {
  const groupSelect = byId("matchGroup");
  const teamASelect = byId("matchTeamA");
  const teamBSelect = byId("matchTeamB");

  if (!groupSelect || !teamASelect || !teamBSelect) return;

  const groupKey = groupSelect.value || groupKeys[0] || "";
  const teamNames = (groups[groupKey] || []).map((team) => team.name);

  const createOptions = () =>
    teamNames
      .map(
        (name) =>
          `<option value="${escapeHtml(name)}">${escapeHtml(name)}</option>`
      )
      .join("");

  teamASelect.innerHTML = createOptions();
  teamBSelect.innerHTML = createOptions();

  if (teamNames.length > 1) {
    teamBSelect.selectedIndex = 1;
  }
}

function renderAdminMatches() {
  const listElement = byId("adminMatchesList");
  const groupSelect = byId("matchGroup");

  if (!listElement || !groupSelect) return;

  const groupKey = groupSelect.value || groupKeys[0] || "";
  const matchList = sortMatchesByTime(matchObjectToArray(groupKey));

  if (matchList.length === 0) {
    listElement.innerHTML = `
      <p class="empty-state">
        No matches in Group ${escapeHtml(groupKey || "—")} yet.
      </p>
    `;
    return;
  }

  listElement.innerHTML = matchList
    .map((match) => {
      const scoreA = matchIsResult(match) ? match.scoreA : "";
      const scoreB = matchIsResult(match) ? match.scoreB : "";
      const encodedGroupKey = encodeURIComponent(groupKey);
      const encodedMatchId = encodeURIComponent(match.id);

      return `
        <article class="admin-match-card">
          <div class="match-title">
            ${escapeHtml(match.teamA)} vs ${escapeHtml(match.teamB)}
          </div>

          <div class="match-meta">
            ${escapeHtml(formatMatchTime(match.time))}
            · ${match.pitch ? `Pitch: ${escapeHtml(match.pitch)}` : "Pitch: TBC"}
          </div>

          <div class="match-actions">
            <input
              type="number"
              min="0"
              step="1"
              inputmode="numeric"
              aria-label="${escapeHtml(match.teamA)} score"
              placeholder="A"
              id="scoreA_${match.id}"
              value="${escapeHtml(scoreA)}"
            >

            <input
              type="number"
              min="0"
              step="1"
              inputmode="numeric"
              aria-label="${escapeHtml(match.teamB)} score"
              placeholder="B"
              id="scoreB_${match.id}"
              value="${escapeHtml(scoreB)}"
            >

            <button
              type="button"
              onclick="saveMatchScore(
                decodeURIComponent('${encodedGroupKey}'),
                decodeURIComponent('${encodedMatchId}')
              )"
            >
              Save Score
            </button>

            <button
              type="button"
              class="danger-button"
              onclick="deleteMatch(
                decodeURIComponent('${encodedGroupKey}'),
                decodeURIComponent('${encodedMatchId}')
              )"
            >
              Delete
            </button>
          </div>
        </article>
      `;
    })
    .join("");
}

function renderEverything() {
  refreshGroupInterface();
  renderAdminStandings();
  updateAdminTeamDropdowns();
  fillMatchTeamDropdowns();
  renderAdminMatches();
  renderPublicGroup();
}

/* ==================================================
   Team Management
================================================== */

async function renameTeam() {
  const selection = getSelectedTeam("renameSelect");
  const input = byId("renameInput");

  if (!selection || !input) return;

  const newName = input.value.trim();
  if (!newName) {
    alert("Enter a new team name first.");
    return;
  }

  if (teamNameExists(currentGroup, newName, selection.index)) {
    alert("A team with that name already exists in this group.");
    return;
  }

  const oldName = selection.team.name;

  const saved = await commitStateChange(() => {
    groups[currentGroup][selection.index].name = newName;

    Object.values(matches[currentGroup] || {}).forEach((match) => {
      if (match.teamA === oldName) match.teamA = newName;
      if (match.teamB === oldName) match.teamB = newName;
    });
  });

  if (saved) input.value = "";
}

async function addTeam() {
  const input = byId("newTeamInput");
  if (!input) return;

  if (!currentGroup) {
    alert("Create a group before adding teams.");
    return;
  }

  const teamName = input.value.trim();
  if (!teamName) {
    alert("Enter a team name first.");
    return;
  }

  if (teamNameExists(currentGroup, teamName)) {
    alert("A team with that name already exists in this group.");
    return;
  }

  const saved = await commitStateChange(() => {
    groups[currentGroup].push(createTeam(teamName));
  });

  if (saved) input.value = "";
}

async function removeTeam() {
  const selection = getSelectedTeam("removeSelect");
  if (!selection) return;

  const teamHasMatches = Object.values(matches[currentGroup] || {}).some(
    (match) => {
      return (
        match.teamA === selection.team.name ||
        match.teamB === selection.team.name
      );
    }
  );

  if (teamHasMatches) {
    alert("Delete this team's matches before removing the team.");
    return;
  }

  if (
    !confirm(
      `Remove ${selection.team.name} from Group ${currentGroup}?`
    )
  ) {
    return;
  }

  await commitStateChange(() => {
    groups[currentGroup].splice(selection.index, 1);
  });
}
async function setTeamLogo() {
  const selection = getSelectedTeam("logoTeamSelect");
  const input = byId("logoInput");

  if (!selection || !input) return;

  const logoPath = input.value.trim();

  const saved = await commitStateChange(() => {
    groups[currentGroup][selection.index].logo = logoPath;
  });

  if (saved) {
    input.value = "";
  }
}
/* ==================================================
   Manual Standings Adjustments
================================================== */

async function changeTeamAdjustment(changeFunction) {
  const selection = getSelectedTeam("teamSelect");
  if (!selection) return;

  await commitStateChange(() => {
    const adjustments = normalizeAdjustments(selection.team.adjustments);
    changeFunction(adjustments);
    selection.team.adjustments = adjustments;
  });
}

function addWin() {
  return changeTeamAdjustment((adjustments) => {
    adjustments.p += 1;
    adjustments.w += 1;
    adjustments.points += 3;
  });
}

function addDraw() {
  return changeTeamAdjustment((adjustments) => {
    adjustments.p += 1;
    adjustments.d += 1;
    adjustments.points += 1;
  });
}

function addLoss() {
  return changeTeamAdjustment((adjustments) => {
    adjustments.p += 1;
    adjustments.l += 1;
  });
}

function addGoal() {
  return changeTeamAdjustment((adjustments) => {
    adjustments.gd += 1;
  });
}

function removeGoal() {
  return changeTeamAdjustment((adjustments) => {
    adjustments.gd -= 1;
  });
}

/* ==================================================
   Match Management
================================================== */

async function addMatch() {
  const groupKey = byId("matchGroup")?.value || "";
  const teamA = byId("matchTeamA")?.value || "";
  const teamB = byId("matchTeamB")?.value || "";
  const localTime = byId("matchTime")?.value || "";
  const pitch = byId("matchPitch")?.value.trim() || "";

  if (!groupKey || !groupKeys.includes(groupKey)) {
    alert("Choose a valid group.");
    return;
  }

  if (!teamA || !teamB) {
    alert("Choose both teams.");
    return;
  }

  if (teamA === teamB) {
    alert("A team cannot play itself.");
    return;
  }

  if (!databaseIsReady()) {
    alert("The database is not ready yet.");
    return;
  }

  const matchId = window.db
    .ref(`tournament/matches/${groupKey}`)
    .push().key;

  const time = localTime ? new Date(localTime).toISOString() : "";

  const saved = await commitStateChange(() => {
    ensureGroupExists(groupKey);
    matches[groupKey][matchId] = {
      teamA,
      teamB,
      time,
      pitch,
      scoreA: null,
      scoreB: null
    };
  });

  if (saved) {
    if (byId("matchTime")) byId("matchTime").value = "";
    if (byId("matchPitch")) byId("matchPitch").value = "";
  }
}

async function saveMatchScore(groupKey, matchId) {
  const scoreAValue = byId(`scoreA_${matchId}`)?.value;
  const scoreBValue = byId(`scoreB_${matchId}`)?.value;

  if (scoreAValue === "" || scoreBValue === "") {
    alert("Enter both scores.");
    return;
  }

  const scoreA = Number(scoreAValue);
  const scoreB = Number(scoreBValue);

  if (
    !Number.isInteger(scoreA) ||
    !Number.isInteger(scoreB) ||
    scoreA < 0 ||
    scoreB < 0
  ) {
    alert("Scores must be whole numbers of 0 or more.");
    return;
  }

  if (!matches[groupKey]?.[matchId]) return;

  await commitStateChange(() => {
    matches[groupKey][matchId].scoreA = scoreA;
    matches[groupKey][matchId].scoreB = scoreB;
  });
}

async function deleteMatch(groupKey, matchId) {
  if (!matches[groupKey]?.[matchId]) return;
  if (!confirm("Delete this match?")) return;

  await commitStateChange(() => {
    delete matches[groupKey][matchId];
  });
}

/* ==================================================
   Undo and Reset
================================================== */

async function undoLastAction() {
  if (!requireAdmin()) return;

  const previousState = undoStack.pop();
  if (!previousState) {
    alert("There are no actions to undo.");
    return;
  }

  const currentState = createStateSnapshot();

  try {
    restoreState(previousState);
    recalculateStandingsFromMatches();
    saveLocalState();
    renderEverything();
    await writeTournamentState();
  } catch (error) {
    console.error(error);
    restoreState(currentState);
    recalculateStandingsFromMatches();
    saveLocalState();
    renderEverything();
    undoStack.push(previousState);

    alert(`The undo could not be saved: ${error.message}`);
  }
}

async function resetTournament() {
  if (!confirm("Reset all groups, teams, fixtures and results?")) {
    return;
  }

  await commitStateChange(() => {
    groups = defaultGroups();
    groupKeys = Object.keys(groups);
    matches = normalizeMatches({}, groupKeys);
    currentGroup = groupKeys[0] || "";
  });
}

/* ==================================================
   Firebase Authentication
================================================== */

function setAdminStatus(message) {
  const element = byId("adminStatus");
  if (element) element.textContent = message;
}

function setAdminPanelVisibility(isSignedIn) {
  const panel = byId("adminPanel");
  if (panel) panel.hidden = !isSignedIn;
}

async function adminLogin() {
  if (!window.auth) {
    alert("Authentication is not ready yet.");
    return;
  }

  const email = byId("adminEmail")?.value.trim();
  const password = byId("adminPassword")?.value;

  if (!email || !password) {
    alert("Enter your email and password.");
    return;
  }

  try {
    await window.auth.signInWithEmailAndPassword(email, password);

    if (byId("adminPassword")) {
      byId("adminPassword").value = "";
    }
  } catch (error) {
    alert(error.message);
  }
}

async function adminLogout() {
  if (!window.auth) return;

  try {
    await window.auth.signOut();
  } catch (error) {
    alert(error.message);
  }
}

/* ==================================================
   Application Start
================================================== */

function attachPageEvents() {
  const matchGroupSelect = byId("matchGroup");
  if (matchGroupSelect) {
    matchGroupSelect.addEventListener("change", () => {
      fillMatchTeamDropdowns();
      renderAdminMatches();
    });
  }

  const publicGroupSelect = byId("publicGroupSelect");
  if (publicGroupSelect) {
    publicGroupSelect.addEventListener("change", renderPublicGroup);
  }
}

function startAuthenticationListener() {
  if (!window.auth) return;

  setAdminPanelVisibility(false);

  window.auth.onAuthStateChanged((user) => {
    if (user) {
      setAdminStatus(`Signed in as ${user.email}`);
      setAdminPanelVisibility(true);
    } else {
      setAdminStatus("Not signed in");
      setAdminPanelVisibility(false);
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  recalculateStandingsFromMatches();
  renderEverything();
  attachPageEvents();
  startAuthenticationListener();
  listenToTournamentFromFirebase();
  listenToConnectionStatus();
});

/* ==================================================
   Functions Used by HTML onclick Attributes
================================================== */

window.showGroup = showGroup;
window.addGroup = addGroup;
window.removeGroup = removeGroup;

window.renameTeam = renameTeam;
window.addTeam = addTeam;
window.removeTeam = removeTeam;
window.setTeamLogo = setTeamLogo;
window.addWin = addWin;
window.addDraw = addDraw;
window.addLoss = addLoss;
window.addGoal = addGoal;
window.removeGoal = removeGoal;

window.addMatch = addMatch;
window.saveMatchScore = saveMatchScore;
window.deleteMatch = deleteMatch;

window.undoLastAction = undoLastAction;
window.resetTournament = resetTournament;

window.adminLogin = adminLogin;
window.adminLogout = adminLogout;
window.renderPublicGroup = renderPublicGroup;
