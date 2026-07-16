/* ==================================================
   FOOTBALL TOURNAMENT — LIVE VENUE DISPLAY
   Reads tournament data from Firebase and renders either:
   1) all six group tables, or
   2) the mirrored knockout bracket.
================================================== */

/* ==================================================
   Branding and Sponsor Configuration

   Add future ticker sponsors by copying an object in
   DISPLAY_SPONSORS and changing the name/logo path.

   Add each group sponsor name inside GROUP_SPONSORS.
   Leave a value as an empty string until it is confirmed.
================================================== */

const DISPLAY_SPONSORS = [
  {
    name: "Ladhar Investments",
    logo: "assets/sponsors/ladhar-investments.png"
  }
];

const GROUP_SPONSORS = {
  A: "",
  B: "",
  C: "",
  D: "",
  E: "",
  F: ""
};

const TOURNAMENT_BRAND = {
  name: "Sikh Tournament",
  logo: "logos/tournament-logo.png"
};

const MAIN_SPONSOR = {
  name: "Ladhar Investments",
  label: "Main Sponsor",
  subtitle: "North East",
  logo: "assets/sponsors/ladhar-investments.png"
};


/*
  Local fallback logo paths for the venue display.
  Firebase logo values are still used first. These paths make the
  display reliable even if a team's saved logo field is temporarily blank.
*/
const DISPLAY_TEAM_LOGOS = {
  "real punjab fc": "logos/real-punjab-fc.png",
  "sunderland afc": "logos/sunderland-afc.png",
  "manchester youth": "logos/manchester-youth.png",
  "sikh gurdwara darlington": "logos/sikh-gurdwara-darlington.png",

  "kisan fc": "logos/kisan-fc.png",
  "huddersfield fc": "logos/huddersfield-fc.png",
  "chardi kala fc": "logos/chardi-kala-fc.png",

  "newcastle panjab fc a": "logos/newcastle-punjab-fc-a.png",
  "newcastle punjab fc a": "logos/newcastle-punjab-fc-a.png",
  "glasgow gurdwara": "logos/glasgow-gurdwara.png",
  "we start now": "logos/we-start-now.png",

  "singh brothers": "logos/singh-brothers.png",
  "slow & steady leeds": "logos/slow-and-steady-leeds.png",
  "soorma fc paris": "logos/soorma-fc-paris.png",
  "fc italy": "logos/fc-italy.png",

  "fc punjabi lions belgium": "logos/fc-punjabi-lions-belgium.png",
  "gng thornaby": "logos/gng-thornaby.png",
  "newcastle panjab fc c": "logos/newcastle-punjab-fc-c.png",
  "newcastle punjab fc c": "logos/newcastle-punjab-fc-c.png",

  "punjab united fc gravesend": "logos/punjab-united-fc-gravesend.png",
  "singh sabha slough": "logos/singh-sabha-slough.png",
  "newcastle panjab fc b": "logos/newcastle-punjab-fc-b.png",
  "newcastle punjab fc b": "logos/newcastle-punjab-fc-b.png",
  "punjabi mags": "logos/punjabi-mags.png"
};

function getDisplayTeamLogo(teamName) {
  const normalizedName = String(teamName || "")
    .trim()
    .toLowerCase();

  return DISPLAY_TEAM_LOGOS[normalizedName] || "";
}

/* ==================================================
   Local Display State
================================================== */

let displayGroups = {};
let displayGroupKeys = [];
let displayKnockoutSetup = {};
let displayKnockoutResults = {};
let displayPlateSetup = {};
let displayPlateResults = {};
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


const PLATE_ROUNDS = {
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
  const name = String(rawTeam?.name || "Team TBC").trim();

  return {
    name,
    logo: String(
      rawTeam?.logo ||
      getDisplayTeamLogo(name) ||
      ""
    ).trim(),
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
  const brandingHtml = `
    <div class="display-brand-lockup">
      <div class="tournament-brand-block">
        ${renderOptionalImage(
          TOURNAMENT_BRAND.logo,
          "tournament-brand-logo",
          TOURNAMENT_BRAND.name
        )}

        <div class="tournament-brand-copy">
          <span class="display-brand-eyebrow">Tournament</span>
          <span class="tournament-brand-name">
            ${escapeDisplayHtml(TOURNAMENT_BRAND.name)}
          </span>
        </div>
      </div>

      <div class="display-brand-divider" aria-hidden="true"></div>

      <div class="main-sponsor-block">
        ${renderOptionalImage(
          MAIN_SPONSOR.logo,
          "main-sponsor-logo",
          MAIN_SPONSOR.name
        )}

        <div class="main-sponsor-copy">
          <span class="display-brand-eyebrow">
            ${escapeDisplayHtml(MAIN_SPONSOR.label)}
          </span>

          <span class="main-sponsor-name">
            ${escapeDisplayHtml(MAIN_SPONSOR.name)}
          </span>

          <span class="main-sponsor-subtitle">
            ${escapeDisplayHtml(MAIN_SPONSOR.subtitle)}
          </span>
        </div>
      </div>
    </div>
  `;

  const groupSponsor = displayById("groupMainSponsor");
  const knockoutSponsor = displayById("knockoutMainSponsor");
  const plateSponsor = displayById("plateMainSponsor");

  if (groupSponsor) groupSponsor.innerHTML = brandingHtml;
  if (knockoutSponsor) knockoutSponsor.innerHTML = brandingHtml;
  if (plateSponsor) plateSponsor.innerHTML = brandingHtml;
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

function getDisplayGroupSponsor(groupKey) {
  return String(GROUP_SPONSORS[groupKey] || "").trim();
}

function formatDisplayGoalDifference(value) {
  const goalDifference = displayToNumber(value);

  return goalDifference > 0
    ? `+${goalDifference}`
    : String(goalDifference);
}

function renderDisplayGroupCard(groupKey) {
  const teams = getSortedDisplayGroup(groupKey);
  const groupSponsor = getDisplayGroupSponsor(groupKey);
  const topPoints = teams[0]?.points;
  const bottomPoints = teams[teams.length - 1]?.points;

  const teamRows = teams
    .slice(0, 4)
    .map((team) => {
      let rowClass = "";

      if (team.points === topPoints) {
        rowClass = "top-team";
      } else if (team.points === bottomPoints) {
        rowClass = "bottom-team";
      }

      return `
        <tr class="${rowClass}">
          <td class="display-team-cell">
            <div class="display-table-team">
              ${renderDisplayTeamLogo(team)}

              <span class="display-team-name">
                ${escapeDisplayHtml(team.name)}
              </span>
            </div>
          </td>

          <td>${team.p}</td>
          <td>${team.w}</td>
          <td>${team.d}</td>
          <td>${team.l}</td>
          <td class="display-points-cell">${team.points}</td>
          <td>${escapeDisplayHtml(
            formatDisplayGoalDifference(team.gd)
          )}</td>
        </tr>
      `;
    })
    .join("");

  return `
    <article class="display-group-card">
      <header class="display-group-heading">
        <h2 class="display-group-title">
          Group ${escapeDisplayHtml(groupKey)}
        </h2>

        <div class="display-group-sponsor">
          <span class="display-group-sponsor-label">
            Sponsored by
          </span>

          <span class="display-group-sponsor-name">
            ${groupSponsor ? escapeDisplayHtml(groupSponsor) : "&nbsp;"}
          </span>
        </div>
      </header>

      <table class="display-group-table">
        <colgroup>
          <col class="display-team-column">
          <col class="display-stat-column">
          <col class="display-stat-column">
          <col class="display-stat-column">
          <col class="display-stat-column">
          <col class="display-stat-column">
          <col class="display-stat-column">
        </colgroup>

        <thead>
          <tr>
            <th class="display-team-heading">Team</th>
            <th>P</th>
            <th>W</th>
            <th>D</th>
            <th>L</th>
            <th>Pts</th>
            <th>GD</th>
          </tr>
        </thead>

        <tbody>
          ${
            teamRows ||
            `
              <tr>
                <td colspan="7" class="display-empty-group">
                  No teams yet
                </td>
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
    logo:
      team?.logo ||
      getDisplayTeamLogo(reference.teamName) ||
      ""
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
  return "Knockout Stages";
}

function renderDisplayPenaltyWinnerNote(result) {
  const isPenaltyWin =
    result?.scoreOne !== null &&
    result?.scoreTwo !== null &&
    result.scoreOne === result.scoreTwo &&
    result.winner;

  if (!isPenaltyWin) return "";

  const winner = findDisplayTeam(
    result.winner
  );

  return `
    <div class="display-penalty-note">
      ${escapeDisplayHtml(
        winner?.name || "Winner"
      )} won on penalties
    </div>
  `;
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

      ${renderDisplayPenaltyWinnerNote(result)}
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
   NEST Plate Championship
================================================== */

function getDisplayPlateResult(
  roundKey,
  matchNumber
) {
  const result =
    displayPlateResults?.[roundKey]?.[matchNumber];

  return {
    scoreOne:
      result?.scoreOne === null ||
      result?.scoreOne === undefined
        ? null
        : displayToNumber(
            result.scoreOne,
            null
          ),

    scoreTwo:
      result?.scoreTwo === null ||
      result?.scoreTwo === undefined
        ? null
        : displayToNumber(
            result.scoreTwo,
            null
          ),

    winner: normalizeDisplayTeamReference(
      result?.winner
    )
  };
}

function getDisplayPlateWinner(
  roundKey,
  matchNumber
) {
  return getDisplayPlateResult(
    roundKey,
    matchNumber
  ).winner;
}

function getDisplayPlateMatchTeams(
  roundKey,
  matchNumber
) {
  if (roundKey === "quarterFinals") {
    const setupMatch =
      displayPlateSetup?.[matchNumber];

    return {
      teamOne: normalizeDisplayTeamReference(
        setupMatch?.teamOne
      ),

      teamTwo: normalizeDisplayTeamReference(
        setupMatch?.teamTwo
      )
    };
  }

  const previousRound =
    roundKey === "semiFinals"
      ? "quarterFinals"
      : roundKey === "final"
        ? "semiFinals"
        : null;

  if (!previousRound) {
    return {
      teamOne: null,
      teamTwo: null
    };
  }

  return {
    teamOne: getDisplayPlateWinner(
      previousRound,
      matchNumber * 2 - 1
    ),

    teamTwo: getDisplayPlateWinner(
      previousRound,
      matchNumber * 2
    )
  };
}

function displayPlateSetupIsComplete() {
  for (
    let matchNumber = 1;
    matchNumber <= 4;
    matchNumber += 1
  ) {
    const setupMatch =
      displayPlateSetup?.[matchNumber];

    if (
      !setupMatch?.teamOne ||
      !setupMatch?.teamTwo
    ) {
      return false;
    }
  }

  return true;
}

function renderDisplayPlateMatch(
  roundKey,
  matchNumber
) {
  const round = PLATE_ROUNDS[roundKey];

  const teams = getDisplayPlateMatchTeams(
    roundKey,
    matchNumber
  );

  const result = getDisplayPlateResult(
    roundKey,
    matchNumber
  );

  return `
    <article class="display-bracket-match">
      <div class="display-bracket-match-label">
        ${escapeDisplayHtml(round.shortLabel)}
        ${matchNumber}
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

      ${renderDisplayPenaltyWinnerNote(result)}
    </article>
  `;
}

function renderDisplayPlateColumn(
  roundKey,
  matchNumbers,
  extraClass = ""
) {
  const round = PLATE_ROUNDS[roundKey];

  return `
    <section
      class="
        display-bracket-column
        ${extraClass}
      "
    >
      <h2 class="display-bracket-column-title">
        ${escapeDisplayHtml(round.label)}
      </h2>

      ${matchNumbers
        .map((matchNumber) =>
          renderDisplayPlateMatch(
            roundKey,
            matchNumber
          )
        )
        .join("")}
    </section>
  `;
}

function renderDisplayPlateBracket() {
  const bracket =
    displayById("displayPlateBracket");

  if (!bracket) return;

  if (!displayPlateSetupIsComplete()) {
    bracket.innerHTML = `
      <p class="display-loading">
        NEST Plate Championship matches
        have not been confirmed yet.
      </p>
    `;

    return;
  }

  bracket.innerHTML = `
    ${renderDisplayPlateColumn(
      "quarterFinals",
      [1, 2],
      "plate-quarter-final-column"
    )}

    ${renderDisplayPlateColumn(
      "semiFinals",
      [1],
      "plate-semi-final-column"
    )}

    ${renderDisplayPlateColumn(
      "final",
      [1],
      "display-final-column plate-final-column"
    )}

    ${renderDisplayPlateColumn(
      "semiFinals",
      [2],
      "plate-semi-final-column"
    )}

    ${renderDisplayPlateColumn(
      "quarterFinals",
      [3, 4],
      "plate-quarter-final-column"
    )}
  `;
}


/* ==================================================
   Display Mode
================================================== */

function normalizeDisplayMode(value) {
  if (value === "knockout") return "knockout";
  if (value === "plate") return "plate";

  return "groups";
}

function renderDisplayMode() {
  const groupsView =
    displayById("displayGroupsView");

  const knockoutView =
    displayById("displayKnockoutView");

  const plateView =
    displayById("displayPlateView");

  const modeLabel =
    displayById("displayModeLabel");

  const mode =
    normalizeDisplayMode(
      displaySettings.mode
    );

  if (groupsView) {
    groupsView.hidden =
      mode !== "groups";
  }

  if (knockoutView) {
    knockoutView.hidden =
      mode !== "knockout";
  }

  if (plateView) {
    plateView.hidden =
      mode !== "plate";
  }

  if (modeLabel) {
    if (mode === "knockout") {
      modeLabel.textContent =
        "Main Knockout";
    } else if (mode === "plate") {
      modeLabel.textContent =
        "NEST Plate Championship";
    } else {
      modeLabel.textContent =
        "Group Stage";
    }
  }
}

function renderCompleteDisplay() {
  renderSponsorTicker();
  renderMainSponsor();
  renderAllDisplayGroups();
  renderDisplayKnockoutBracket();
  renderDisplayPlateBracket();
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

      displayPlateSetup =
        data.bottomEightSetup &&
        typeof data.bottomEightSetup === "object"
          ? data.bottomEightSetup
          : {};

      displayPlateResults =
        data.bottomEightResults &&
        typeof data.bottomEightResults === "object"
          ? data.bottomEightResults
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
