/* ==================================================
   FOOTBALL TOURNAMENT — LIVE VENUE DISPLAY
   Reads tournament data from Firebase and renders group tables,
   the full fixture schedule, the live pitch map and both knockout brackets.
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
    name: "Sikh Channel",
    logo: "logos/sikh-channel.png"
  },

  {
    name: "Sunderland",
    logo: "logos/sunderland-afc.png"
  },

  {
    name: "Durham County FA",
    logo: "logos/durham-county-fa.png"
  },

  {
    name: "Leisure United",
    logo: "logos/leisure-united.png"
  },

  {
    name: "Doabe Wale",
    logo: "logos/doabe-wale.png"
  },

  {
    name: "Lauren Howe Media",
    logo: "logos/lauren-howe-media.png"
  },

  {
    name: "Billy Lead Photography",
    logo: "logos/billy-lead-photography.png"
  },

  {
    name: "Wedz",
    logo: "logos/wedz.png"
  },

  {
    name: "Ladhar Investments",
    logo: "logos/ladhar-investments.png"
  },

  {
    name: "Bikar Singh Johal",
    logo: "logos/bikar-singh-johal.png"
  },

  {
    name: "Seaton Group Pharmacy",
    logo: "logos/seaton-group-pharmacy.png"
  },

  {
    name: "Sahota Stores",
    logo: "logos/sahota-stores.png"
  },

  {
    name: "Kular Stores",
    logo: "logos/kular-stores.png"
  },

  {
    name: "Sukhwinder Singh Dhillon",
    logo: "logos/sukhwinder-singh-dhillon.png"
  },

  {
    name: "B&S K Group",
    logo: "logos/bs-k-group.png"
  },

  {
    name: "Gills Premier",
    logo: "logos/gills-premier.png"
  },

  {
    name: "Envy Sports",
    logo: "logos/envy-sports.png"
  }
];

const GROUP_SPONSORS = {
  B: {
    name: "Trussted Group",
    logo: "logos/trussted-group.png"
  },

  C: {
    name: "Stonewater Estates",
    logo: "logos/stonewater-estates.png"
  },

  D: {
    name: "Holiday Inn Washington",
    logo: "logos/holiday-inn-washington.png"
  },

  E: {
    name: "Northwood Estates",
    logo: "logos/northwood-estates.png"
  },

  F: {
    name: "Sandhu Lettings",
    logo: "logos/sandhu-lettings.png"
  }
};

const TOURNAMENT_BRAND = {
  name: "Sikh Tournament",
  logo: "logos/tournament-logo.png"
};

const MAIN_SPONSOR = {
  name: "Ladhar Investments",
  label: "Main Sponsor",
  subtitle: "North East",
  logo: "logos/ladhar-investments.png"
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

  "kisan fc": "logos/kisan-fc.png",
  "huddersfield fc": "logos/huddersfield-fc.png",
  "akaal fc paris": "logos/akaal-fc-paris.png",
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
  "doncaster fc a": "logos/doncaster-fc-a.png",
  "gng thornaby": "logos/gng-thornaby.png",
  "newcastle panjab fc c": "logos/newcastle-punjab-fc-c.png",
  "newcastle punjab fc c": "logos/newcastle-punjab-fc-c.png",

  "punjab united fc gravesend": "logos/punjab-united-fc-gravesend.png",
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
let displayMatches = {};
let displayPitchMapAssignments = {};
let displayKnockoutSetup = {};
let displayKnockoutResults = {};
let displayPlateSetup = {};
let displayPlateResults = {};
let displaySettings = {
  mode: "groups",
  sponsorTicker: true,
  rotationMode: "off",
  rotationStartedAt: 0,
  rotationIntervalMs: 15000
};

const DISPLAY_ROTATION_ORDERS = {
  groupStage: [
    "groups",
    "pitchMap",
    "fixtures"
  ],

  knockout: [
    "knockout",
    "plate"
  ]
};

const DEFAULT_DISPLAY_ROTATION_INTERVAL_MS = 15000;
const DISPLAY_TRANSITION_DURATION_MS = 620;

let displayRotationTimer = null;
let displayTransitionTimer = null;
let activeDisplayMode = null;
let displayServerTimeOffset = 0;

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

const DISPLAY_ROUND_OF_16_PLACEHOLDERS = {
  1: ["Winner of Group B", "1st seed 4th / Group F 3rd"],
  2: ["Runner-up of Group C", "Runner-up of Group D"],
  3: ["Winner of Group E", "3rd place of Group D"],
  4: ["Winner of Group F", "3rd place of Group C"],
  5: ["Winner of Group D", "3rd place of Group E"],
  6: ["3rd place of Group B", "Runner-up of Group F"],
  7: ["Winner of Group C", "Group F 3rd / 1st seed 4th"],
  8: ["Runner-up of Group B", "Runner-up of Group E"]
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

function getDisplayTeamGoalsFor(
  groupKey,
  teamName
) {
  return Object.values(
    displayMatches?.[groupKey] || {}
  ).reduce((total, match) => {
    if (!displayMatchHasScore(match)) {
      return total;
    }

    if (match.teamA === teamName) {
      return total +
        displayToNumber(match.scoreA);
    }

    if (match.teamB === teamName) {
      return total +
        displayToNumber(match.scoreB);
    }

    return total;
  }, 0);
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

      const firstGoalsFor =
        getDisplayTeamGoalsFor(
          groupKey,
          first.name
        );

      const secondGoalsFor =
        getDisplayTeamGoalsFor(
          groupKey,
          second.name
        );

      if (secondGoalsFor !== firstGoalsFor) {
        return secondGoalsFor - firstGoalsFor;
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
            <div class="sponsor-ticker-item${
              sponsor.logo
                ? ""
                : " sponsor-ticker-item-no-logo"
            }">
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
  const sponsor = GROUP_SPONSORS[groupKey];

  if (!sponsor || typeof sponsor !== "object") {
    return {
      name: "",
      logo: ""
    };
  }

  return {
    name: String(sponsor.name || "").trim(),
    logo: String(sponsor.logo || "").trim()
  };
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

  const groupHasStarted = teams.some(
    (team) => displayToNumber(team.p) > 0
  );

  const teamRows = teams
    .slice(0, 4)
    .map((team, index) => {
      let rowClass = "";

      if (groupHasStarted) {
        if (index < 2) {
          rowClass = "group-position-top-two";
        } else if (index === 2) {
          rowClass = "group-position-third";
        } else if (index === teams.length - 1) {
          rowClass = "group-position-last";
        }
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

      <footer class="display-group-sponsor-footer">
        <div class="display-group-sponsor-copy">
          <span class="display-group-sponsor-label">
            Sponsored by
          </span>

          <strong class="display-group-sponsor-name">
            ${
              groupSponsor.name
                ? escapeDisplayHtml(groupSponsor.name)
                : "Sponsor TBC"
            }
          </strong>
        </div>

        <div class="display-group-sponsor-logo-frame">
          ${renderOptionalImage(
            groupSponsor.logo,
            "display-group-sponsor-logo",
            `${groupSponsor.name || `Group ${groupKey} sponsor`} logo`
          )}
        </div>
      </footer>
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


function getDisplayKnockoutPlaceholder(
  roundKey,
  matchNumber,
  slot
) {
  if (roundKey === "roundOf16") {
    return DISPLAY_ROUND_OF_16_PLACEHOLDERS[matchNumber]?.[
      slot === "one" ? 0 : 1
    ] || "Round of 16 team";
  }

  const previousRound =
    roundKey === "quarterFinals"
      ? KNOCKOUT_ROUNDS.roundOf16
      : roundKey === "semiFinals"
        ? KNOCKOUT_ROUNDS.quarterFinals
        : roundKey === "final"
          ? KNOCKOUT_ROUNDS.semiFinals
          : null;

  if (!previousRound) return "Team to be confirmed";

  const previousMatchNumber =
    slot === "one"
      ? matchNumber * 2 - 1
      : matchNumber * 2;

  return `Winner of ${previousRound.shortLabel} ${previousMatchNumber}`;
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

function renderDisplayBracketTeam(
  reference,
  score,
  winner,
  placeholder = "Team to be confirmed"
) {
  const team = findDisplayTeam(reference);
  const isWinner = displayTeamReferencesMatch(reference, winner);

  if (!team) {
    return `
      <div class="display-bracket-team">
        <span class="display-bracket-team-name display-bracket-placeholder">
          ${escapeDisplayHtml(placeholder)}
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


const DISPLAY_KNOCKOUT_PITCHES = {
  roundOf16: {
    1: 1,
    2: 2,
    3: 3,
    4: 4,
    5: 4,
    6: 3,
    7: 2,
    8: 1
  },

  quarterFinals: {
    1: 4,
    2: 2,
    3: 3,
    4: 1
  },

  semiFinals: {
    1: 2,
    2: 1
  },

  final: {
    1: 1
  }
};

function getDisplayKnockoutPitch(roundKey, matchNumber) {
  return DISPLAY_KNOCKOUT_PITCHES?.[roundKey]?.[matchNumber] || null;
}

function renderDisplayBracketMatch(
  roundKey,
  matchNumber,
  slotNumber = 1
) {
  const round = KNOCKOUT_ROUNDS[roundKey];
  const teams = getDisplayKnockoutMatchTeams(roundKey, matchNumber);
  const result = getDisplayKnockoutResult(roundKey, matchNumber);

  return `
    <article
      class="display-bracket-match display-bracket-slot-${slotNumber}"
      data-round="${escapeDisplayHtml(roundKey)}"
      data-match="${matchNumber}"
    >
      <div class="display-bracket-match-label">
        ${escapeDisplayHtml(round.shortLabel)} ${matchNumber}
        ${getDisplayKnockoutPitch(roundKey, matchNumber)
          ? ` • Pitch ${getDisplayKnockoutPitch(roundKey, matchNumber)}`
          : ""}
      </div>

      ${renderDisplayBracketTeam(
        teams.teamOne,
        result.scoreOne,
        result.winner,
        getDisplayKnockoutPlaceholder(
          roundKey,
          matchNumber,
          "one"
        )
      )}

      ${renderDisplayBracketTeam(
        teams.teamTwo,
        result.scoreTwo,
        result.winner,
        getDisplayKnockoutPlaceholder(
          roundKey,
          matchNumber,
          "two"
        )
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
    <section
      class="display-bracket-column display-round-${escapeDisplayHtml(roundKey)} ${extraClass}"
    >
      <h2 class="display-bracket-column-title">
        ${escapeDisplayHtml(round.label)}
      </h2>

      <div class="display-bracket-column-matches">
        ${matchNumbers
          .map((matchNumber, index) =>
            renderDisplayBracketMatch(
              roundKey,
              matchNumber,
              index + 1
            )
          )
          .join("")}
      </div>
    </section>
  `;
}

function displayKnockoutConnectorClass(
  roundKey,
  matchNumber
) {
  return getDisplayKnockoutWinner(
    roundKey,
    matchNumber
  )
    ? "display-bracket-connector is-advanced"
    : "display-bracket-connector";
}

function renderDisplayKnockoutConnectors() {
  return `
    <svg
      class="display-knockout-connectors"
      viewBox="0 0 1400 800"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path class="${displayKnockoutConnectorClass("roundOf16", 1)}"
        d="M176 100 H190 V200 H204" />
      <path class="${displayKnockoutConnectorClass("roundOf16", 2)}"
        d="M176 300 H190 V200 H204" />
      <path class="${displayKnockoutConnectorClass("roundOf16", 3)}"
        d="M176 500 H190 V600 H204" />
      <path class="${displayKnockoutConnectorClass("roundOf16", 4)}"
        d="M176 700 H190 V600 H204" />

      <path class="${displayKnockoutConnectorClass("quarterFinals", 1)}"
        d="M380 200 H394 V400 H408" />
      <path class="${displayKnockoutConnectorClass("quarterFinals", 2)}"
        d="M380 600 H394 V400 H408" />
      <path class="${displayKnockoutConnectorClass("semiFinals", 1)}"
        d="M584 400 H612" />

      <path class="${displayKnockoutConnectorClass("roundOf16", 5)}"
        d="M1224 100 H1210 V200 H1196" />
      <path class="${displayKnockoutConnectorClass("roundOf16", 6)}"
        d="M1224 300 H1210 V200 H1196" />
      <path class="${displayKnockoutConnectorClass("roundOf16", 7)}"
        d="M1224 500 H1210 V600 H1196" />
      <path class="${displayKnockoutConnectorClass("roundOf16", 8)}"
        d="M1224 700 H1210 V600 H1196" />

      <path class="${displayKnockoutConnectorClass("quarterFinals", 3)}"
        d="M1020 200 H1006 V400 H992" />
      <path class="${displayKnockoutConnectorClass("quarterFinals", 4)}"
        d="M1020 600 H1006 V400 H992" />
      <path class="${displayKnockoutConnectorClass("semiFinals", 2)}"
        d="M816 400 H788" />
    </svg>
  `;
}

function renderDisplayKnockoutBracket() {
  const bracket = displayById("displayKnockoutBracket");
  const title = displayById("displayKnockoutTitle");

  if (!bracket) return;
  if (title) title.textContent = getDisplayKnockoutHeading();

  bracket.innerHTML = `
    ${renderDisplayKnockoutConnectors()}
    ${renderDisplayBracketColumn("roundOf16", [1, 2, 3, 4], "display-side-left")}
    ${renderDisplayBracketColumn("quarterFinals", [1, 2], "display-side-left")}
    ${renderDisplayBracketColumn("semiFinals", [1], "display-side-left")}
    ${renderDisplayBracketColumn("final", [1], "display-final-column")}
    ${renderDisplayBracketColumn("semiFinals", [2], "display-side-right")}
    ${renderDisplayBracketColumn("quarterFinals", [3, 4], "display-side-right")}
    ${renderDisplayBracketColumn("roundOf16", [5, 6, 7, 8], "display-side-right")}
  `;
}


/* ==================================================
   Group Fixture Schedule Display

/* ==================================================
   Group Fixture Schedule Display
================================================== */

const DISPLAY_FIXTURE_PITCHES = [1, 2, 3, 4, 5, 6];

const DISPLAY_FIXTURE_GROUP_COLOURS = {
  A: "fixture-group-a",
  B: "fixture-group-b",
  C: "fixture-group-c",
  D: "fixture-group-d",
  E: "fixture-group-e",
  F: "fixture-group-f"
};

function displayMatchHasScore(match) {
  return Boolean(
    match &&
    match.scoreA !== null &&
    match.scoreA !== undefined &&
    match.scoreB !== null &&
    match.scoreB !== undefined &&
    Number.isFinite(Number(match.scoreA)) &&
    Number.isFinite(Number(match.scoreB))
  );
}

function getDisplayFixtureTimestamp(value) {
  const timestamp = new Date(value || "").getTime();
  return Number.isFinite(timestamp) ? timestamp : null;
}

function formatDisplayFixtureTime(timestamp) {
  if (!Number.isFinite(timestamp)) return "TBC";

  return new Intl.DateTimeFormat("en-GB", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true
  })
    .format(new Date(timestamp))
    .replace("am", "AM")
    .replace("pm", "PM");
}

function getDisplayFixtureEntries() {
  const fixtures = [];

  displayGroupKeys.forEach((groupKey) => {
    Object.entries(displayMatches?.[groupKey] || {}).forEach(
      ([matchId, match]) => {
        if (!match || typeof match !== "object") return;

        const pitchNumber = Number(
          String(match.pitch || "").replace(/[^0-9]/g, "")
        );

        if (!DISPLAY_FIXTURE_PITCHES.includes(pitchNumber)) {
          return;
        }

        fixtures.push({
          groupKey,
          matchId,
          pitchNumber,
          timestamp: getDisplayFixtureTimestamp(match.time),
          teamA: String(match.teamA || "Team TBC").trim(),
          teamB: String(match.teamB || "Team TBC").trim(),
          scoreA: match.scoreA,
          scoreB: match.scoreB,
          completed: displayMatchHasScore(match)
        });
      }
    );
  });

  return fixtures.sort((first, second) => {
    const firstTime = first.timestamp ?? Number.MAX_SAFE_INTEGER;
    const secondTime = second.timestamp ?? Number.MAX_SAFE_INTEGER;

    if (firstTime !== secondTime) return firstTime - secondTime;
    if (first.pitchNumber !== second.pitchNumber) {
      return first.pitchNumber - second.pitchNumber;
    }

    return first.groupKey.localeCompare(second.groupKey);
  });
}

function getDisplayFixtureTimeRows(fixtures) {
  const timestamps = [...new Set(
    fixtures
      .map((fixture) => fixture.timestamp)
      .filter((timestamp) => Number.isFinite(timestamp))
  )].sort((first, second) => first - second);

  const hasUnscheduled = fixtures.some(
    (fixture) => !Number.isFinite(fixture.timestamp)
  );

  if (hasUnscheduled) timestamps.push(null);

  return timestamps;
}

function getDisplayFixtureLivePitch(
  fixture
) {
  const liveEntry = Object.entries(
    displayPitchMapAssignments || {}
  ).find(([, assignment]) => {
    return Boolean(
      assignment?.groupKey ===
        fixture.groupKey &&
      assignment?.matchId ===
        fixture.matchId
    );
  });

  if (!liveEntry) return null;

  const pitchNumber =
    Number(liveEntry[0]);

  return Number.isInteger(pitchNumber)
    ? pitchNumber
    : null;
}

function renderDisplayFixtureCard(fixture) {
  if (!fixture) {
    return `
      <div class="fixture-display-empty" aria-label="No fixture">
        <span>—</span>
      </div>
    `;
  }

  const groupClass =
    DISPLAY_FIXTURE_GROUP_COLOURS[fixture.groupKey] || "";

  const livePitchNumber =
    fixture.completed
      ? null
      : getDisplayFixtureLivePitch(
          fixture
        );

  const isLive =
    Number.isInteger(
      livePitchNumber
    );

  const scoreMarkup = fixture.completed
    ? `
        <span class="fixture-display-score">
          ${escapeDisplayHtml(String(fixture.scoreA))}
          <span>–</span>
          ${escapeDisplayHtml(String(fixture.scoreB))}
        </span>
      `
    : `<span class="fixture-display-versus">v</span>`;

  return `
    <article class="fixture-display-match ${groupClass} ${isLive ? "is-live" : ""} ${fixture.completed ? "is-complete" : ""}">
      <div class="fixture-display-match-topline">
        <span class="fixture-display-group-badge">
          ${escapeDisplayHtml(fixture.groupKey)}
        </span>

        ${
          isLive
            ? `
              <span class="fixture-display-live-badge">
                Live${
                  livePitchNumber !==
                    fixture.pitchNumber
                    ? ` · P${livePitchNumber}`
                    : ""
                }
              </span>
            `
            : ""
        }
        ${fixture.completed ? '<span class="fixture-display-complete-badge">FT</span>' : ''}
      </div>

      <div
        class="fixture-display-team fixture-display-team-a"
        title="${escapeDisplayHtml(fixture.teamA)}"
      >
        ${escapeDisplayHtml(fixture.teamA)}
      </div>

      ${scoreMarkup}

      <div
        class="fixture-display-team fixture-display-team-b"
        title="${escapeDisplayHtml(fixture.teamB)}"
      >
        ${escapeDisplayHtml(fixture.teamB)}
      </div>
    </article>
  `;
}

function renderDisplayFixtures() {
  const grid = displayById("displayFixturesGrid");
  if (!grid) return;

  const fixtures = getDisplayFixtureEntries();
  const timeRows = getDisplayFixtureTimeRows(fixtures);

  grid.style.setProperty(
    "--fixture-row-count",
    String(
      Math.max(
        1,
        timeRows.length
      )
    )
  );

  const teamCount = displayGroupKeys.reduce(
    (total, groupKey) => total + (displayGroups[groupKey] || []).length,
    0
  );

  const teamCountElement = displayById("fixtureDisplayTeamCount");
  const groupCountElement = displayById("fixtureDisplayGroupCount");
  const matchCountElement = displayById("fixtureDisplayMatchCount");

  if (teamCountElement) teamCountElement.textContent = String(teamCount);
  if (groupCountElement) groupCountElement.textContent = String(displayGroupKeys.length);
  if (matchCountElement) matchCountElement.textContent = String(fixtures.length);

  if (fixtures.length === 0 || timeRows.length === 0) {
    grid.innerHTML = `
      <p class="display-loading">
        No group fixtures have been loaded yet.
      </p>
    `;
    return;
  }

  const fixturesBySlot = new Map();

  fixtures.forEach((fixture) => {
    const timeKey = Number.isFinite(fixture.timestamp)
      ? String(fixture.timestamp)
      : "unscheduled";

    const key = `${timeKey}:${fixture.pitchNumber}`;

    if (!fixturesBySlot.has(key)) {
      fixturesBySlot.set(key, []);
    }

    fixturesBySlot.get(key).push(fixture);
  });

  const headerCells = DISPLAY_FIXTURE_PITCHES
    .map((pitchNumber) => `
      <div class="fixture-display-column-heading">
        Pitch ${pitchNumber}
      </div>
    `)
    .join("");

  const rowMarkup = timeRows
    .map((timestamp) => {
      const timeKey = Number.isFinite(timestamp)
        ? String(timestamp)
        : "unscheduled";

      const cells = DISPLAY_FIXTURE_PITCHES
        .map((pitchNumber) => {
          const slotFixtures = fixturesBySlot.get(
            `${timeKey}:${pitchNumber}`
          ) || [];

          return `
            <div class="fixture-display-cell">
              ${
                slotFixtures.length
                  ? slotFixtures.map(renderDisplayFixtureCard).join("")
                  : renderDisplayFixtureCard(null)
              }
            </div>
          `;
        })
        .join("");

      return `
        <div class="fixture-display-time-cell">
          ${escapeDisplayHtml(formatDisplayFixtureTime(timestamp))}
        </div>
        ${cells}
      `;
    })
    .join("");

  grid.innerHTML = `
    <div class="fixture-display-corner-heading">Time</div>
    ${headerCells}
    ${rowMarkup}
  `;
}


/* ==================================================
   Live Pitch Map
================================================== */

const DISPLAY_PITCH_ORDER = [6, 3, 4, 5, 1, 2];

function normalizeDisplayPitchAssignments(
  rawAssignments
) {
  const normalized = {};

  for (
    let pitchNumber = 1;
    pitchNumber <= 6;
    pitchNumber += 1
  ) {
    const assignment =
      rawAssignments?.[pitchNumber];

    const groupKey = String(
      assignment?.groupKey || ""
    ).trim();

    const matchId = String(
      assignment?.matchId || ""
    ).trim();

    normalized[pitchNumber] =
      groupKey && matchId
        ? { groupKey, matchId }
        : null;
  }

  return normalized;
}

function getDisplayPitchMatch(
  pitchNumber
) {
  const assignment =
    displayPitchMapAssignments?.[pitchNumber];

  if (!assignment) return null;

  const match =
    displayMatches?.[assignment.groupKey]?.[
      assignment.matchId
    ];

  if (!match || typeof match !== "object") {
    return null;
  }

  return {
    ...match,
    groupKey: assignment.groupKey,
    matchId: assignment.matchId
  };
}

function renderPitchMapTeam(
  groupKey,
  teamName
) {
  const team = findDisplayTeam({
    groupKey,
    teamName
  });

  if (!team) {
    return `
      <div class="pitch-map-team">
        <span class="pitch-map-team-name">
          Team TBC
        </span>
      </div>
    `;
  }

  return `
    <div class="pitch-map-team">
      ${renderOptionalImage(
        team.logo,
        "pitch-map-team-logo",
        `${team.name} logo`
      )}

      <span class="pitch-map-team-name">
        ${escapeDisplayHtml(team.name)}
      </span>
    </div>
  `;
}

function renderPitchMapCard(
  pitchNumber
) {
  const match =
    getDisplayPitchMatch(pitchNumber);

  if (!match) {
    return `
      <article
        class="pitch-map-card pitch-map-card-empty"
        data-pitch="${pitchNumber}"
      >
        <div class="pitch-map-card-title">
          Pitch ${pitchNumber}
        </div>

        <div class="pitch-map-empty-message">
          No match currently
        </div>
      </article>
    `;
  }

  return `
    <article
      class="pitch-map-card"
      data-pitch="${pitchNumber}"
    >
      <div class="pitch-map-card-title">
        Pitch ${pitchNumber}
      </div>

      <div class="pitch-map-match">
        ${renderPitchMapTeam(
          match.groupKey,
          match.teamA
        )}

        <span class="pitch-map-versus">
          VS
        </span>

        ${renderPitchMapTeam(
          match.groupKey,
          match.teamB
        )}
      </div>
    </article>
  `;
}

function renderDisplayPitchMap() {
  const grid = displayById(
    "displayPitchMapGrid"
  );

  if (!grid) return;

  grid.innerHTML = DISPLAY_PITCH_ORDER
    .map(renderPitchMapCard)
    .join("");
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
  if (roundKey === "semiFinals") {
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

  if (roundKey === "final") {
    return {
      teamOne: getDisplayPlateWinner("semiFinals", 1),
      teamTwo: getDisplayPlateWinner("semiFinals", 2)
    };
  }

  return {
    teamOne: null,
    teamTwo: null
  };
}

function displayPlateSetupIsComplete() {
  return [1, 2].every((matchNumber) => {
    const match = displayPlateSetup?.[matchNumber];

    return Boolean(
      match?.teamOne &&
      match?.teamTwo
    );
  });
}


function getDisplayPlatePlaceholder(
  roundKey,
  matchNumber,
  slot
) {
  if (roundKey === "semiFinals") {
    if (matchNumber === 1) {
      return slot === "one"
        ? "Seed 1"
        : "Seed 4";
    }

    return slot === "one"
      ? "Seed 2"
      : "Seed 3";
  }

  if (roundKey === "final") {
    return slot === "one"
      ? "Winner of SF 1"
      : "Winner of SF 2";
  }

  return "Team to be confirmed";
}

function getDisplayPlateSeedReference(seedNumber) {
  const seedSources = {
    1: displayPlateSetup?.[1]?.teamOne,
    2: displayPlateSetup?.[2]?.teamOne,
    3: displayPlateSetup?.[2]?.teamTwo,
    4: displayPlateSetup?.[1]?.teamTwo
  };

  return normalizeDisplayTeamReference(
    seedSources[seedNumber]
  );
}

function renderDisplayPlateMatch(
  roundKey,
  matchNumber,
  displayMatchNumber = matchNumber,
  slotNumber = 1,
  extraClass = ""
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
    <article
      class="display-bracket-match display-plate-slot-${slotNumber} ${extraClass}"
      data-round="plate-${escapeDisplayHtml(roundKey)}"
      data-match="${matchNumber}"
    >
      <div class="display-bracket-match-label">
        ${escapeDisplayHtml(round.shortLabel)}
        ${displayMatchNumber}
      </div>

      ${renderDisplayBracketTeam(
        teams.teamOne,
        result.scoreOne,
        result.winner,
        getDisplayPlatePlaceholder(
          roundKey,
          matchNumber,
          "one"
        )
      )}

      ${renderDisplayBracketTeam(
        teams.teamTwo,
        result.scoreTwo,
        result.winner,
        getDisplayPlatePlaceholder(
          roundKey,
          matchNumber,
          "two"
        )
      )}

      ${renderDisplayPenaltyWinnerNote(result)}
    </article>
  `;
}

function renderDisplayPlateByeMatch(
  displayMatchNumber,
  seedNumber,
  semiFinalNumber,
  slotNumber
) {
  const reference = getDisplayPlateSeedReference(
    seedNumber
  );

  const team = findDisplayTeam(reference);
  const displayTeam = team || {
    name: `Seed ${seedNumber}`,
    logo: ""
  };

  return `
    <article
      class="display-bracket-match display-plate-bye-match display-plate-slot-${slotNumber}"
      data-plate-seed="${seedNumber}"
    >
      <div class="display-bracket-match-label">
        QF ${displayMatchNumber} · BYE
      </div>

      <div class="display-bracket-team is-winner">
        ${renderOptionalImage(
          displayTeam.logo,
          "display-bracket-team-logo",
          `${displayTeam.name} logo`
        )}

        <span class="display-bracket-team-name">
          ${escapeDisplayHtml(displayTeam.name)}
        </span>

        <span class="display-plate-bye-chip">BYE</span>
      </div>

      <div class="display-plate-bye-message">
        Automatic bye — advances to Semi-final ${semiFinalNumber}
      </div>
    </article>
  `;
}

function displayPlateConnectorClass(hasAdvanced) {
  return hasAdvanced
    ? "display-bracket-connector is-advanced"
    : "display-bracket-connector";
}

function renderDisplayPlateConnectors() {
  const semiFinalOneWinner = Boolean(
    getDisplayPlateWinner("semiFinals", 1)
  );

  const semiFinalTwoWinner = Boolean(
    getDisplayPlateWinner("semiFinals", 2)
  );

  return `
    <svg
      class="display-plate-connectors"
      viewBox="0 0 1000 800"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path
        class="${displayPlateConnectorClass(semiFinalOneWinner)}"
        d="M440 200 H500 V400 H560"
      />
      <path
        class="${displayPlateConnectorClass(semiFinalTwoWinner)}"
        d="M440 600 H500 V400 H560"
      />
    </svg>
  `;
}

function renderDisplayPlateBracket() {
  const bracket = displayById("displayPlateBracket");

  if (!bracket) return;

  /*
    The NEST Plate now has four teams only, so the venue bracket
    is intentionally two columns: two semi-finals feeding one final.
  */
  bracket.style.gridTemplateColumns =
    "minmax(300px, 1fr) minmax(300px, 1fr)";
  bracket.style.columnGap = "12%";
  bracket.style.width = "min(100%, 1200px)";

  bracket.innerHTML = `
    ${renderDisplayPlateConnectors()}

    <section class="display-plate-stage display-plate-semi-finals">
      <h2 class="display-bracket-column-title">Semi-finals</h2>

      <div class="display-plate-stage-matches">
        ${renderDisplayPlateMatch(
          "semiFinals",
          1,
          1,
          1
        )}

        ${renderDisplayPlateMatch(
          "semiFinals",
          2,
          2,
          2
        )}
      </div>
    </section>

    <section class="display-plate-stage display-plate-final-stage">
      <h2 class="display-bracket-column-title">Final</h2>

      <div class="display-plate-stage-matches">
        ${renderDisplayPlateMatch(
          "final",
          1,
          1,
          1,
          "display-plate-final-match"
        )}
      </div>
    </section>
  `;
}


/* ==================================================
   Display Mode and Rotation

/* ==================================================
   Display Mode and Rotation
================================================== */

function normalizeDisplayMode(value) {
  if (value === "fixtures") return "fixtures";
  if (value === "pitchMap") return "pitchMap";
  if (value === "knockout") return "knockout";
  if (value === "plate") return "plate";

  return "groups";
}

function normalizeDisplayRotationMode(value) {
  if (value === "groupStage") {
    return "groupStage";
  }

  if (value === "knockout") {
    return "knockout";
  }

  return "off";
}

function getDisplayRotationOrder(
  rotationMode
) {
  return (
    DISPLAY_ROTATION_ORDERS[
      normalizeDisplayRotationMode(
        rotationMode
      )
    ] || []
  );
}

function getDisplayRotationIntervalMs() {
  return DEFAULT_DISPLAY_ROTATION_INTERVAL_MS;
}

function getDisplayNow() {
  return Date.now() +
    displayServerTimeOffset;
}

function getEffectiveDisplayMode(
  now = getDisplayNow()
) {
  const rotationMode =
    normalizeDisplayRotationMode(
      displaySettings.rotationMode
    );

  const startedAt =
    Number(
      displaySettings.rotationStartedAt
    ) || 0;

  const rotationOrder =
    getDisplayRotationOrder(
      rotationMode
    );

  if (
    rotationOrder.length === 0 ||
    startedAt <= 0
  ) {
    return normalizeDisplayMode(
      displaySettings.mode
    );
  }

  const interval =
    getDisplayRotationIntervalMs();

  const elapsed = Math.max(
    0,
    now - startedAt
  );

  const rotationIndex =
    Math.floor(elapsed / interval) %
    rotationOrder.length;

  return rotationOrder[
    rotationIndex
  ];
}

function getDisplayView(mode) {
  const viewIds = {
    groups: "displayGroupsView",
    fixtures: "displayFixturesView",
    pitchMap: "displayPitchMapView",
    knockout: "displayKnockoutView",
    plate: "displayPlateView"
  };

  return displayById(
    viewIds[normalizeDisplayMode(mode)]
  );
}

function getAllDisplayViews() {
  return [
    getDisplayView("groups"),
    getDisplayView("fixtures"),
    getDisplayView("pitchMap"),
    getDisplayView("knockout"),
    getDisplayView("plate")
  ].filter(Boolean);
}

function updateDisplayModeLabel(mode) {
  const modeLabel =
    displayById("displayModeLabel");

  if (!modeLabel) return;

  if (mode === "fixtures") {
    modeLabel.textContent =
      "Group Fixtures";
  } else if (mode === "pitchMap") {
    modeLabel.textContent =
      "Live Pitch Map";
  } else if (mode === "knockout") {
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

function showDisplayModeImmediately(mode) {
  const normalizedMode =
    normalizeDisplayMode(mode);

  if (displayTransitionTimer) {
    clearTimeout(
      displayTransitionTimer
    );

    displayTransitionTimer = null;
  }

  getAllDisplayViews().forEach(
    (view) => {
      const isActive =
        view === getDisplayView(
          normalizedMode
        );

      view.classList.remove(
        "display-view-entering",
        "display-view-leaving"
      );

      view.hidden = !isActive;
      view.setAttribute(
        "aria-hidden",
        String(!isActive)
      );
    }
  );

  activeDisplayMode =
    normalizedMode;

  updateDisplayModeLabel(
    normalizedMode
  );
}

function transitionToDisplayMode(mode) {
  const normalizedMode =
    normalizeDisplayMode(mode);

  const nextView =
    getDisplayView(normalizedMode);

  const currentView =
    getDisplayView(activeDisplayMode);

  if (!nextView) return;

  if (
    !currentView ||
    activeDisplayMode === normalizedMode
  ) {
    showDisplayModeImmediately(
      normalizedMode
    );

    return;
  }

  if (displayTransitionTimer) {
    clearTimeout(
      displayTransitionTimer
    );
  }

  getAllDisplayViews().forEach(
    (view) => {
      if (
        view !== currentView &&
        view !== nextView
      ) {
        view.hidden = true;
        view.classList.remove(
          "display-view-entering",
          "display-view-leaving"
        );
      }
    }
  );

  nextView.hidden = false;
  nextView.setAttribute(
    "aria-hidden",
    "false"
  );

  nextView.classList.remove(
    "display-view-leaving"
  );

  nextView.classList.add(
    "display-view-entering"
  );

  currentView.classList.remove(
    "display-view-entering"
  );

  currentView.classList.add(
    "display-view-leaving"
  );

  /*
    Two animation frames allow the browser to paint the
    incoming starting position before it transitions.
  */
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      nextView.classList.remove(
        "display-view-entering"
      );
    });
  });

  activeDisplayMode =
    normalizedMode;

  updateDisplayModeLabel(
    normalizedMode
  );

  displayTransitionTimer =
    setTimeout(() => {
      currentView.hidden = true;

      currentView.setAttribute(
        "aria-hidden",
        "true"
      );

      currentView.classList.remove(
        "display-view-leaving"
      );

      displayTransitionTimer = null;
    }, DISPLAY_TRANSITION_DURATION_MS);
}

function renderDisplayMode({
  animate = true
} = {}) {
  const targetMode =
    getEffectiveDisplayMode();

  if (activeDisplayMode === null) {
    showDisplayModeImmediately(
      targetMode
    );

    return;
  }

  if (targetMode === activeDisplayMode) {
    updateDisplayModeLabel(
      targetMode
    );

    return;
  }

  if (animate) {
    transitionToDisplayMode(
      targetMode
    );
  } else {
    showDisplayModeImmediately(
      targetMode
    );
  }
}

function scheduleDisplayRotation() {
  if (displayRotationTimer) {
    clearTimeout(
      displayRotationTimer
    );

    displayRotationTimer = null;
  }

  const rotationMode =
    normalizeDisplayRotationMode(
      displaySettings.rotationMode
    );

  if (
    getDisplayRotationOrder(
      rotationMode
    ).length === 0
  ) {
    return;
  }

  const startedAt =
    Number(
      displaySettings.rotationStartedAt
    ) || 0;

  if (startedAt <= 0) return;

  const interval =
    getDisplayRotationIntervalMs();

  const elapsed = Math.max(
    0,
    getDisplayNow() - startedAt
  );

  const remainder =
    elapsed % interval;

  const delay =
    Math.max(
      80,
      interval - remainder + 35
    );

  displayRotationTimer =
    setTimeout(() => {
      renderDisplayMode({
        animate: true
      });

      scheduleDisplayRotation();
    }, delay);
}

function renderCompleteDisplay() {
  renderSponsorTicker();
  renderMainSponsor();
  renderAllDisplayGroups();
  renderDisplayFixtures();
  renderDisplayPitchMap();
  renderDisplayKnockoutBracket();
  renderDisplayPlateBracket();
  renderDisplayMode({
    animate: true
  });
  scheduleDisplayRotation();
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

      displayMatches =
        data.matches &&
        typeof data.matches === "object"
          ? data.matches
          : {};

      displayPitchMapAssignments =
        normalizeDisplayPitchAssignments(
          data.pitchMapAssignments
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
        mode: normalizeDisplayMode(
          data.displaySettings?.mode
        ),
        sponsorTicker:
          data.displaySettings?.sponsorTicker !== false,
        rotationMode:
          normalizeDisplayRotationMode(
            data.displaySettings?.rotationMode
          ),
        rotationStartedAt:
          Number(
            data.displaySettings?.rotationStartedAt
          ) || 0,
        rotationIntervalMs:
          Number(
            data.displaySettings?.rotationIntervalMs
          ) ||
          DEFAULT_DISPLAY_ROTATION_INTERVAL_MS
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

  window.db
    .ref(".info/serverTimeOffset")
    .on("value", (snapshot) => {
      displayServerTimeOffset =
        Number(snapshot.val()) || 0;

      renderDisplayMode({
        animate: false
      });

      scheduleDisplayRotation();
    });

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
