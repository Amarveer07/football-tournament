/* ==================================================
   FOOTBALL TOURNAMENT — LIVE VENUE DISPLAY
   Reads tournament data from Firebase and renders either:
   1) all six group tables, or
   2) the mirrored knockout bracket.
================================================== */

/* ==================================================
   Sponsor Configuration

   To add another sponsor later, copy one sponsor object and
   change its name and logo path. Upload logos into:
   assets/sponsors/
================================================== */

const DISPLAY_SPONSORS = [
  {
    name: "Ladhar Investments",
    logo: "assets/sponsors/ladhar-investments.png"
  }
];

const MAIN_SPONSOR = {
  name: "Ladhar Investments",
  subtitle: "North East",
  tournamentName: "Sikh Tournament",
  logo: "assets/sponsors/ladhar-investments.png"
};

/* ==================================================
   Local Display State
================================================== */

let displayGroups = {};
let displayGroupKeys = [];
let displayKnockoutSetup = {};
let displayKnockoutResults = {};
let displaySettings = {
  mode: "groups",
  sponsorTicker: true
};

const KNOCKOUT_ROUNDS = {
  roundOf16: {
    label: "Round of 16",
    shortLabel: "R16",
    matchCount: 8
  },
  quarterFinals: {
    label: "Quarter-finals",
    shortLabel: "QF",
    matchCount: 4
  },
  semiFinals: {
    label: "Semi-finals",
    shortLabel: "SF",
    matchCount: 2
  },
  final: {
    label: "Final",
    shortLabel: "Final",
    matchCount: 1
  }
};

/* ==================================================
   General Helpers
================================================== */

function displayById(id) {
  return document.getElementById(id);
}

function escapeDisplayHtml(value) {
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

function displayToNumber(value, fallback = 0) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

function displayToArray(value) {
  if (Array.isArray(value)) return value;

  if (value && typeof value === "object") {
    return Object.keys(value)
      .sort((first, second) => {
        const firstNumber = Number(first);
        const secondNumber = Number(second);

        if (
          Number.isFinite(firstNumber) &&
          Number.isFinite(secondNumber)
        ) {
          return firstNumber - secondNumber;
        }

        return first.localeCompare(second);
      })
      .map((key) => value[key]);
  }

  return [];
}

function normalizeDisplayTeam(rawTeam) {
  return {
    name: String(rawTeam?.name || "Team TBC").trim(),
    logo: String(rawTeam?.logo || "").trim(),
    p: displayToNumber(rawTeam?.p),
    w: displayToNumber(rawTeam?.w),
    d: displayToNumber(rawTeam?.d),
    l: displayToNumber(rawTeam?.l),
    points: displayToNumber(rawTeam?.points),
    gd: displayToNumber(rawTeam?.gd)
  };
}

function normalizeDisplayGroupKeys(rawKeys, rawGroups) {
  const keys = new Set();

  if (Array.isArray(rawKeys)) {
    rawKeys.forEach((key) => {
      if (key) keys.add(String(key));
    });
  } else if (rawKeys && typeof rawKeys === "object") {
    Object.keys(rawKeys).forEach((key) => {
      if (rawKeys[key]) keys.add(String(key));
    });
  }

  if (rawGroups && typeof rawGroups === "object") {
    Object.keys(rawGroups).forEach((key) => keys.add(String(key)));
  }

  return [...keys].sort((first, second) =>
    first.localeCompare(second)
  );
}

function normalizeDisplayGroups(rawGroups, groupKeys) {
  const groups = {};

  groupKeys.forEach((groupKey) => {
    groups[groupKey] = displayToArray(rawGroups?.[groupKey]).map(
      normalizeDisplayTeam
    );
  });

  return groups;
}

function getSortedDisplayGroup(groupKey) {
  return [...(displayGroups[groupKey] || [])].sort(
    (first, second) => {
      if (second.points !== first.points) {
        return second.points - first.points;
      }

      if (second.gd !== first.gd) {
        return second.gd - first.gd;
      }

      return first.name.localeCompare(second.name);
    }
  );
}

function renderOptionalImage(path, className, altText = "") {
  if (!path) return "";

  return `
    <img
      class="${escapeDisplayHtml(className)}"
      src="${escapeDisplayHtml(path)}"
      alt="${escapeDisplayHtml(altText)}"
      onerror="this.hidden=true"
    >
  `;
}

/* ==================================================
   Sponsor Rendering
================================================== */

function getExpandedSponsors() {
  const validSponsors = DISPLAY_SPONSORS.filter(
    (sponsor) => sponsor?.name
  );

  if (validSponsors.length === 0) {
    return [{ name: "Tournament Sponsor", logo: "" }];
  }

  const expanded = [];

  while (expanded.length < 6) {
    expanded.push(
      ...validSponsors.map((sponsor) => ({ ...sponsor }))
    );
  }

  return expanded.slice(0, Math.max(6, validSponsors.length));
}

function renderSponsorTickerGroup(sponsors) {
  return `
    <div class="sponsor-ticker-group">
      ${sponsors
        .map(
          (sponsor) => `
            <div class="sponsor-ticker-item">
              ${renderOptionalImage(
                sponsor.logo,
                "sponsor-ticker-logo",
                sponsor.name
              )}

              <span class="sponsor-ticker-name">
                ${escapeDisplayHtml(sponsor.name)}
              </span>
            </div>
          `
        )
        .join("")}
    </div>
  `;
}

function renderSponsorTicker() {
  const track = displayById("sponsorTickerTrack");
  const strip = document.querySelector(".sponsor-strip");

  if (!track || !strip) return;

  strip.hidden = displaySettings.sponsorTicker === false;

  const sponsors = getExpandedSponsors();
  const sponsorGroup = renderSponsorTickerGroup(sponsors);

  // Two identical groups create a seamless continuous loop.
  track.innerHTML = sponsorGroup + sponsorGroup;
}

function renderMainSponsor() {
  const sponsorHtml = `
    ${renderOptionalImage(
      MAIN_SPONSOR.logo,
      "main-sponsor-logo",
      MAIN_SPONSOR.name
    )}

    <div class="main-sponsor-copy">
      <div class="main-sponsor-name">
        ${escapeDisplayHtml(MAIN_SPONSOR.name)}
      </div>

      <div class="main-sponsor-subtitle">
        ${escapeDisplayHtml(MAIN_SPONSOR.subtitle)}
      </div>

      <div class="main-sponsor-tournament">
        ${escapeDisplayHtml(MAIN_SPONSOR.tournamentName)}
      </div>
    </div>
  `;

  const groupSponsor = displayById("groupMainSponsor");
  const knockoutSponsor = displayById("knockoutMainSponsor");

  if (groupSponsor) groupSponsor.innerHTML = sponsorHtml;
  if (knockoutSponsor) knockoutSponsor.innerHTML = sponsorHtml;
}

/* ==================================================
   Group-Stage Display
================================================== */

function renderDisplayTeamLogo(team) {
  return renderOptionalImage(
    team.logo,
    "display-team-logo",
    `${team.name} logo`
  );
}

function renderDisplayGroupCard(groupKey) {
  const teams = getSortedDisplayGroup(groupKey);

  const teamRows = teams
    .slice(0, 4)
    .map(
      (team, index) => `
        <tr>
          <td class="display-position-cell">
            ${index + 1}.
          </td>

          <td class="display-team-cell">
            <div class="display-table-team">
              ${renderDisplayTeamLogo(team)}

              <span class="display-team-name">
                ${escapeDisplayHtml(team.name)}
              </span>

              <span class="display-team-stats">
                <span><strong>${team.points}</strong> PTS</span>
                <span>GD <strong>${team.gd}</strong></span>
              </span>
            </div>
          </td>
        </tr>
      `
    )
    .join("");

  return `
    <article class="display-group-card">
      <h2 class="display-group-title">
        Group ${escapeDisplayHtml(groupKey)}
      </h2>

      <table class="display-group-table">
        <tbody>
          ${
            teamRows ||
            `
              <tr>
                <td class="display-position-cell">—</td>
                <td class="display-team-cell">No teams yet</td>
              </tr>
            `
          }
        </tbody>
      </table>
    </article>
  `;
}

function renderAllDisplayGroups() {
  const grid = displayById("displayGroupsGrid");
  if (!grid) return;

  if (displayGroupKeys.length === 0) {
    grid.innerHTML = `
      <p class="display-loading">
        No tournament groups are available yet.
      </p>
    `;
    return;
  }

  grid.innerHTML = displayGroupKeys
    .slice(0, 6)
    .map(renderDisplayGroupCard)
    .join("");
}

/* ==================================================
   Knockout Helpers
================================================== */

function normalizeDisplayTeamReference(reference) {
  if (!reference || typeof reference !== "object") return null;

  const teamName = String(reference.teamName || "").trim();
  const groupKey = String(reference.groupKey || "").trim();

  if (!teamName) return null;

  return { teamName, groupKey };
}

function displayTeamReferencesMatch(first, second) {
  return Boolean(
    first &&
      second &&
      first.groupKey === second.groupKey &&
      first.teamName === second.teamName
  );
}

function getDisplayKnockoutResult(roundKey, matchNumber) {
  const result = displayKnockoutResults?.[roundKey]?.[matchNumber];

  return {
    scoreOne:
      result?.scoreOne === null || result?.scoreOne === undefined
        ? null
        : displayToNumber(result.scoreOne, null),
    scoreTwo:
      result?.scoreTwo === null || result?.scoreTwo === undefined
        ? null
        : displayToNumber(result.scoreTwo, null),
    winner: normalizeDisplayTeamReference(result?.winner)
  };
}

function getDisplayKnockoutWinner(roundKey, matchNumber) {
  return getDisplayKnockoutResult(roundKey, matchNumber).winner;
}

function getDisplayKnockoutMatchTeams(roundKey, matchNumber) {
  if (roundKey === "roundOf16") {
    const setupMatch = displayKnockoutSetup?.[matchNumber];

    return {
      teamOne: normalizeDisplayTeamReference(setupMatch?.teamOne),
      teamTwo: normalizeDisplayTeamReference(setupMatch?.teamTwo)
    };
  }

  const previousRound =
    roundKey === "quarterFinals"
      ? "roundOf16"
      : roundKey === "semiFinals"
        ? "quarterFinals"
        : roundKey === "final"
          ? "semiFinals"
          : null;

  if (!previousRound) {
    return { teamOne: null, teamTwo: null };
  }

  return {
    teamOne: getDisplayKnockoutWinner(
      previousRound,
      matchNumber * 2 - 1
    ),
    teamTwo: getDisplayKnockoutWinner(
      previousRound,
      matchNumber * 2
    )
  };
}

function findDisplayTeam(reference) {
  if (!reference) return null;

  const team = (displayGroups[reference.groupKey] || []).find(
    (candidate) => candidate.name === reference.teamName
  );

  return {
    name: reference.teamName,
    groupKey: reference.groupKey,
    logo: team?.logo || ""
  };
}

function displayKnockoutSetupIsComplete() {
  for (let matchNumber = 1; matchNumber <= 8; matchNumber += 1) {
    const setupMatch = displayKnockoutSetup?.[matchNumber];

    if (!setupMatch?.teamOne || !setupMatch?.teamTwo) {
      return false;
    }
  }

  return true;
}

function getDisplayKnockoutHeading() {
  if (getDisplayKnockoutWinner("final", 1)) {
    return "Tournament Complete";
  }

  const finalTeams = getDisplayKnockoutMatchTeams("final", 1);
  if (finalTeams.teamOne && finalTeams.teamTwo) return "Final";

  const semiTeams = getDisplayKnockoutMatchTeams("semiFinals", 1);
  if (semiTeams.teamOne && semiTeams.teamTwo) return "Semi-Finals";

  const quarterTeams = getDisplayKnockoutMatchTeams(
    "quarterFinals",
    1
  );
  if (quarterTeams.teamOne && quarterTeams.teamTwo) {
    return "Quarter-Finals";
  }

  return "Round of 16";
}

function renderDisplayBracketTeam(reference, score, winner) {
  const team = findDisplayTeam(reference);
  const isWinner = displayTeamReferencesMatch(reference, winner);

  if (!team) {
    return `
      <div class="display-bracket-team">
        <span class="display-bracket-team-name display-bracket-placeholder">
          Team TBC
        </span>
        <span class="display-bracket-score">—</span>
      </div>
    `;
  }

  return `
    <div class="display-bracket-team ${isWinner ? "is-winner" : ""}">
      ${renderOptionalImage(
        team.logo,
        "display-bracket-team-logo",
        `${team.name} logo`
      )}

      <span class="display-bracket-team-name">
        ${escapeDisplayHtml(team.name)}
      </span>

      <span class="display-bracket-score">
        ${score === null ? "—" : escapeDisplayHtml(score)}
      </span>
    </div>
  `;
}

function renderDisplayBracketMatch(roundKey, matchNumber) {
  const round = KNOCKOUT_ROUNDS[roundKey];
  const teams = getDisplayKnockoutMatchTeams(roundKey, matchNumber);
  const result = getDisplayKnockoutResult(roundKey, matchNumber);

  return `
    <article class="display-bracket-match">
      <div class="display-bracket-match-label">
        ${escapeDisplayHtml(round.shortLabel)} ${matchNumber}
      </div>

      ${renderDisplayBracketTeam(
        teams.teamOne,
        result.scoreOne,
        result.winner
      )}

      ${renderDisplayBracketTeam(
        teams.teamTwo,
        result.scoreTwo,
        result.winner
      )}
    </article>
  `;
}

function renderDisplayBracketColumn(
  roundKey,
  matchNumbers,
  extraClass = ""
) {
  const round = KNOCKOUT_ROUNDS[roundKey];

  return `
    <section class="display-bracket-column ${extraClass}">
      <h2 class="display-bracket-column-title">
        ${escapeDisplayHtml(round.label)}
      </h2>

      ${matchNumbers
        .map((matchNumber) =>
          renderDisplayBracketMatch(roundKey, matchNumber)
        )
        .join("")}
    </section>
  `;
}

function renderDisplayKnockoutBracket() {
  const bracket = displayById("displayKnockoutBracket");
  const title = displayById("displayKnockoutTitle");

  if (!bracket) return;
  if (title) title.textContent = getDisplayKnockoutHeading();

  if (!displayKnockoutSetupIsComplete()) {
    bracket.innerHTML = `
      <p class="display-loading">
        Knockout matches have not been confirmed yet.
      </p>
    `;
    return;
  }

  bracket.innerHTML = `
    ${renderDisplayBracketColumn("roundOf16", [1, 2, 3, 4])}
    ${renderDisplayBracketColumn("quarterFinals", [1, 2])}
    ${renderDisplayBracketColumn("semiFinals", [1])}
    ${renderDisplayBracketColumn(
      "final",
      [1],
      "display-final-column"
    )}
    ${renderDisplayBracketColumn("semiFinals", [2])}
    ${renderDisplayBracketColumn("quarterFinals", [3, 4])}
    ${renderDisplayBracketColumn("roundOf16", [5, 6, 7, 8])}
  `;
}

/* ==================================================
   Display Mode
================================================== */

function normalizeDisplayMode(value) {
  return value === "knockout" ? "knockout" : "groups";
}

function renderDisplayMode() {
  const groupsView = displayById("displayGroupsView");
  const knockoutView = displayById("displayKnockoutView");
  const modeLabel = displayById("displayModeLabel");

  const mode = normalizeDisplayMode(displaySettings.mode);

  if (groupsView) groupsView.hidden = mode !== "groups";
  if (knockoutView) knockoutView.hidden = mode !== "knockout";

  if (modeLabel) {
    modeLabel.textContent =
      mode === "knockout" ? "Knockout Stage" : "Group Stage";
  }
}

function renderCompleteDisplay() {
  renderSponsorTicker();
  renderMainSponsor();
  renderAllDisplayGroups();
  renderDisplayKnockoutBracket();
  renderDisplayMode();
}

/* ==================================================
   Firebase Listeners
================================================== */

function displayDatabaseIsReady() {
  return Boolean(window.db && typeof window.db.ref === "function");
}

function listenToDisplayTournament() {
  if (!displayDatabaseIsReady()) return;

  window.db.ref("tournament").on(
    "value",
    (snapshot) => {
      const data = snapshot.val() || {};

      displayGroupKeys = normalizeDisplayGroupKeys(
        data.groupKeys,
        data.groups
      );

      displayGroups = normalizeDisplayGroups(
        data.groups,
        displayGroupKeys
      );

      displayKnockoutSetup =
        data.knockoutSetup && typeof data.knockoutSetup === "object"
          ? data.knockoutSetup
          : {};

      displayKnockoutResults =
        data.knockoutResults &&
        typeof data.knockoutResults === "object"
          ? data.knockoutResults
          : {};

      displaySettings = {
        mode: normalizeDisplayMode(data.displaySettings?.mode),
        sponsorTicker: data.displaySettings?.sponsorTicker !== false
      };

      renderCompleteDisplay();
    },
    (error) => {
      console.error("The live display could not load tournament data.", error);

      const loading = document.querySelectorAll(".display-loading");
      loading.forEach((element) => {
        element.textContent = "Tournament data could not be loaded.";
      });
    }
  );
}

function listenToDisplayConnection() {
  if (!displayDatabaseIsReady()) return;

  window.db.ref(".info/connected").on("value", (snapshot) => {
    const isConnected = Boolean(snapshot.val());
    const dot = displayById("displayLiveDot");
    const text = displayById("displayLiveText");

    if (dot) dot.classList.toggle("is-live", isConnected);
    if (text) text.textContent = isConnected ? "Live" : "Disconnected";
  });
}

/* ==================================================
   Start
================================================== */

document.addEventListener("DOMContentLoaded", () => {
  renderSponsorTicker();
  renderMainSponsor();
  listenToDisplayTournament();
  listenToDisplayConnection();
});
