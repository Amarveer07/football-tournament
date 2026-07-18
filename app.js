/* ==================================================
   FOOTBALL TOURNAMENT APPLICATION
   Shared by the public and admin pages.
   Designed for current Chrome, Safari, Edge and Firefox browsers.
================================================== */

/* ==================================================
   Default Data and Normalisation
================================================== */

const DEFAULT_TEAM_LOGOS = {
  "Kisan FC": "logos/kisan-fc.png",
  "Huddersfield FC": "logos/huddersfield-fc.png",
  "Akaal FC Paris": "logos/akaal-fc-paris.png",
  "Chardi Kala FC": "logos/chardi-kala-fc.png",

  "NCL Punjab A": "logos/newcastle-punjab-fc-a.png",
  "Glasgow Gurdwara": "logos/glasgow-gurdwara.png",
  "We start now": "logos/we-start-now.png",
  "Sunderland AFC": "logos/sunderland-afc.png",

  "Singh Brothers": "logos/singh-brothers.png",
  "Slow & Steady Leeds": "logos/slow-and-steady-leeds.png",
  "Soorma FC Paris": "logos/soorma-fc-paris.png",
  "FC ITALY": "logos/fc-italy.png",

  "FC Punjab Lions Belgium": "logos/fc-punjabi-lions-belgium.png",
  "Doncaster FC A": "logos/doncaster-fc-a.png",
  "GNG Thornaby": "logos/gng-thornaby.png",
  "NCL Punjab FC C": "logos/newcastle-punjab-fc-c.png",

  "Punjab United FC Gravesend": "logos/punjab-united-fc-gravesend.png",
  "Real Punjab FC": "logos/real-punjab-fc.png",
  "NCL Punjab B": "logos/newcastle-punjab-fc-b.png",
  "Punjab Mags": "logos/punjabi-mags.png"
};

function getDefaultTeamLogo(teamName) {
  return DEFAULT_TEAM_LOGOS[
    String(teamName || "").trim()
  ] || "";
}

function createTeam(name, logo = getDefaultTeamLogo(name)) {
  return {
    name,
    logo,
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
    B: [
      createTeam("Kisan FC"),
      createTeam("Huddersfield FC"),
      createTeam("Akaal FC Paris"),
      createTeam("Chardi Kala FC")
    ],

    C: [
      createTeam("NCL Punjab A"),
      createTeam("Glasgow Gurdwara"),
      createTeam("We start now"),
      createTeam("Sunderland AFC")
    ],

    D: [
      createTeam("Singh Brothers"),
      createTeam("Slow & Steady Leeds"),
      createTeam("Soorma FC Paris"),
      createTeam("FC ITALY")
    ],

    E: [
      createTeam("FC Punjab Lions Belgium"),
      createTeam("Doncaster FC A"),
      createTeam("GNG Thornaby"),
      createTeam("NCL Punjab FC C")
    ],

    F: [
      createTeam("Punjab United FC Gravesend"),
      createTeam("Real Punjab FC"),
      createTeam("NCL Punjab B"),
      createTeam("Punjab Mags")
    ]
  };
}

const OFFICIAL_TEAM_NAME_ALIASES = {
  "Manchester Youth": "Manchester Youth FC",
  "Newcastle Panjab FC A": "NCL Punjab A",
  "Newcastle Punjab FC A": "NCL Punjab A",
  "Glasgow Gurdwara FC": "Glasgow Gurdwara",
  "We Start Now": "We start now",
  "FC Italy": "FC ITALY",
  "FC Punjabi Lions Belgium": "FC Punjab Lions Belgium",
  "Newcastle Panjab FC C": "NCL Punjab FC C",
  "Newcastle Punjab FC C": "NCL Punjab FC C",
  "Newcastle Panjab FC B": "NCL Punjab B",
  "Newcastle Punjab FC B": "NCL Punjab B",
  "Punjabi Mags": "Punjab Mags",
  "Chardikala FC": "Chardi Kala FC"
};

const OFFICIAL_FIXTURE_VERSION =
  "2026-07-18-20-team-five-groups-v1";

const OFFICIAL_FIXTURE_DATE = {
  year: 2026,
  monthIndex: 6,
  day: 18
};

const OFFICIAL_GROUP_FIXTURES = {
  B: [
    [10, 30, "1", "Kisan FC", "Huddersfield FC"],
    [10, 30, "2", "Akaal FC Paris", "Chardi Kala FC"],
    [11, 30, "1", "Kisan FC", "Akaal FC Paris"],
    [11, 30, "2", "Huddersfield FC", "Chardi Kala FC"],
    [12, 30, "1", "Kisan FC", "Chardi Kala FC"],
    [12, 30, "2", "Huddersfield FC", "Akaal FC Paris"]
  ],

  C: [
    [10, 0, "1", "NCL Punjab A", "Glasgow Gurdwara"],
    [10, 0, "2", "We start now", "Sunderland AFC"],
    [11, 0, "1", "NCL Punjab A", "We start now"],
    [11, 0, "2", "Glasgow Gurdwara", "Sunderland AFC"],
    [12, 0, "1", "NCL Punjab A", "Sunderland AFC"],
    [12, 0, "2", "Glasgow Gurdwara", "We start now"]
  ],

  D: [
    [10, 0, "3", "Singh Brothers", "Slow & Steady Leeds"],
    [10, 0, "4", "Soorma FC Paris", "FC ITALY"],
    [11, 0, "3", "Singh Brothers", "Soorma FC Paris"],
    [11, 0, "4", "Slow & Steady Leeds", "FC ITALY"],
    [12, 0, "3", "Singh Brothers", "FC ITALY"],
    [12, 0, "4", "Slow & Steady Leeds", "Soorma FC Paris"]
  ],

  E: [
    [10, 0, "5", "FC Punjab Lions Belgium", "Doncaster FC A"],
    [10, 0, "6", "GNG Thornaby", "NCL Punjab FC C"],
    [11, 0, "5", "FC Punjab Lions Belgium", "GNG Thornaby"],
    [11, 0, "6", "Doncaster FC A", "NCL Punjab FC C"],
    [12, 0, "5", "FC Punjab Lions Belgium", "NCL Punjab FC C"],
    [12, 0, "6", "Doncaster FC A", "GNG Thornaby"]
  ],

  F: [
    [10, 30, "3", "Punjab United FC Gravesend", "Real Punjab FC"],
    [10, 30, "4", "NCL Punjab B", "Punjab Mags"],
    [11, 30, "3", "Punjab United FC Gravesend", "NCL Punjab B"],
    [11, 30, "4", "Real Punjab FC", "Punjab Mags"],
    [12, 30, "3", "Punjab United FC Gravesend", "Punjab Mags"],
    [12, 30, "4", "Real Punjab FC", "NCL Punjab B"]
  ]
};

function getOfficialTeamName(teamName) {
  const currentName = String(teamName || "").trim();

  return OFFICIAL_TEAM_NAME_ALIASES[currentName] || currentName;
}

function createOfficialFixtureTime(hour, minute) {
  const { year, monthIndex, day } = OFFICIAL_FIXTURE_DATE;

  return new Date(
    year,
    monthIndex,
    day,
    hour,
    minute,
    0,
    0
  ).toISOString();
}

function createOfficialMatches() {
  const officialMatches = {};

  Object.entries(OFFICIAL_GROUP_FIXTURES).forEach(
    ([groupKey, fixtures]) => {
      officialMatches[groupKey] = {};

      fixtures.forEach((fixture, index) => {
        const [hour, minute, pitch, teamA, teamB] = fixture;
        const matchNumber = String(index + 1).padStart(2, "0");
        const matchId = `official_${groupKey}_${matchNumber}`;

        officialMatches[groupKey][matchId] = {
          teamA,
          teamB,
          time: createOfficialFixtureTime(hour, minute),
          pitch,
          scoreA: null,
          scoreB: null
        };
      });
    }
  );

  return officialMatches;
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
  const name = String(
    raw?.name || "Unnamed team"
  ).trim();

  const savedLogo = String(
    raw?.logo || ""
  ).trim();

  return {
    name,
    logo:
      savedLogo ||
      getDefaultTeamLogo(name),
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

function normalizePitchMapAssignments(rawAssignments) {
  const normalized = {};

  for (let pitchNumber = 1; pitchNumber <= 6; pitchNumber += 1) {
    const assignment = rawAssignments?.[pitchNumber];

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

let pitchMapAssignments = normalizePitchMapAssignments(
  localState?.pitchMapAssignments
);

let officialFixturesVersion = String(
  localState?.officialFixturesVersion || ""
);

let officialFixturesLoaded = Boolean(
  localState?.officialFixturesLoaded
) &&
  officialFixturesVersion ===
    OFFICIAL_FIXTURE_VERSION;

let currentGroup = groupKeys[0] || "";
let undoStack = [];

const roundOf16Plan = [
  {
    matchNumber: 1,
    teamOneSource: "Winner of Group B",
    teamTwoSource: "1st seed 4th / Group F 3rd"
  },
  {
    matchNumber: 2,
    teamOneSource: "Runner-up of Group C",
    teamTwoSource: "Runner-up of Group D"
  },
  {
    matchNumber: 3,
    teamOneSource: "Winner of Group E",
    teamTwoSource: "3rd place of Group D"
  },
  {
    matchNumber: 4,
    teamOneSource: "Winner of Group F",
    teamTwoSource: "3rd place of Group C"
  },
  {
    matchNumber: 5,
    teamOneSource: "Winner of Group D",
    teamTwoSource: "3rd place of Group E"
  },
  {
    matchNumber: 6,
    teamOneSource: "3rd place of Group B",
    teamTwoSource: "Runner-up of Group F"
  },
  {
    matchNumber: 7,
    teamOneSource: "Winner of Group C",
    teamTwoSource: "Group F 3rd / 1st seed 4th"
  },
  {
    matchNumber: 8,
    teamOneSource: "Runner-up of Group B",
    teamTwoSource: "Runner-up of Group E"
  }
];

let knockoutSetup =
  localState?.knockoutSetup && typeof localState.knockoutSetup === "object"
    ? clone(localState.knockoutSetup)
    : {};

const knockoutRoundConfig = {
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

function createEmptyKnockoutMatchResult() {
  return {
    scoreOne: null,
    scoreTwo: null,
    winner: null
  };
}

function createEmptyKnockoutResults() {
  const results = {};

  Object.entries(knockoutRoundConfig).forEach(
    ([roundKey, round]) => {
      results[roundKey] = {};

      for (
        let matchNumber = 1;
        matchNumber <= round.matchCount;
        matchNumber += 1
      ) {
        results[roundKey][matchNumber] =
          createEmptyKnockoutMatchResult();
      }
    }
  );

  return results;
}

function normalizeKnockoutTeamReference(reference) {
  if (!reference || typeof reference !== "object") return null;

  const groupKey = String(reference.groupKey || "").trim();
  const teamName = String(reference.teamName || "").trim();

  if (!teamName) return null;

  return {
    groupKey,
    teamName
  };
}

function normalizeKnockoutResults(rawResults) {
  const normalized = createEmptyKnockoutResults();

  Object.entries(knockoutRoundConfig).forEach(
    ([roundKey, round]) => {
      for (
        let matchNumber = 1;
        matchNumber <= round.matchCount;
        matchNumber += 1
      ) {
        const rawMatch = rawResults?.[roundKey]?.[matchNumber];

        if (!rawMatch || typeof rawMatch !== "object") continue;

        const scoreOne =
          rawMatch.scoreOne === null ||
          rawMatch.scoreOne === undefined ||
          rawMatch.scoreOne === ""
            ? null
            : toNumber(rawMatch.scoreOne, null);

        const scoreTwo =
          rawMatch.scoreTwo === null ||
          rawMatch.scoreTwo === undefined ||
          rawMatch.scoreTwo === ""
            ? null
            : toNumber(rawMatch.scoreTwo, null);

        normalized[roundKey][matchNumber] = {
          scoreOne:
            Number.isInteger(scoreOne) && scoreOne >= 0
              ? scoreOne
              : null,
          scoreTwo:
            Number.isInteger(scoreTwo) && scoreTwo >= 0
              ? scoreTwo
              : null,
          winner: normalizeKnockoutTeamReference(
            rawMatch.winner
          )
        };
      }
    }
  );

  return normalized;
}

let knockoutResults = normalizeKnockoutResults(
  localState?.knockoutResults
);


const bottomEightPlan = [
  {
    matchNumber: 1,
    teamOneSource: "Seed 1",
    teamTwoSource: "Seed 4"
  },
  {
    matchNumber: 2,
    teamOneSource: "Seed 2",
    teamTwoSource: "Seed 3"
  }
];

const bottomEightDirectSeedPlan = [];

const bottomEightRoundConfig = {
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

let plateSetupMigrationDetected = false;

function normalizeBottomEightSetup(rawSetup) {
  if (!rawSetup || typeof rawSetup !== "object") {
    return {};
  }

  if (
    Object.keys(rawSetup).length > 0 &&
    rawSetup.formatVersion !== 4
  ) {
    plateSetupMigrationDetected = true;
    return {};
  }

  const normalized = {
    formatVersion: 4
  };

  for (const matchNumber of [1, 2]) {
    const rawMatch = rawSetup?.[matchNumber];

    const teamOne = normalizeKnockoutTeamReference(
      rawMatch?.teamOne
    );

    const teamTwo = normalizeKnockoutTeamReference(
      rawMatch?.teamTwo
    );

    if (teamOne || teamTwo) {
      normalized[matchNumber] = {
        teamOne,
        teamTwo
      };
    }
  }

  return normalized;
}

let bottomEightSetup = normalizeBottomEightSetup(
  localState?.bottomEightSetup
);

function createEmptyBottomEightResults() {
  const results = {};

  Object.entries(bottomEightRoundConfig).forEach(
    ([roundKey, round]) => {
      results[roundKey] = {};

      for (
        let matchNumber = 1;
        matchNumber <= round.matchCount;
        matchNumber += 1
      ) {
        results[roundKey][matchNumber] =
          createEmptyKnockoutMatchResult();
      }
    }
  );

  return results;
}

function normalizeBottomEightResults(rawResults) {
  const normalized = createEmptyBottomEightResults();

  Object.entries(bottomEightRoundConfig).forEach(
    ([roundKey, round]) => {
      for (
        let matchNumber = 1;
        matchNumber <= round.matchCount;
        matchNumber += 1
      ) {
        const rawMatch = rawResults?.[roundKey]?.[matchNumber];

        if (!rawMatch || typeof rawMatch !== "object") continue;

        const scoreOne =
          rawMatch.scoreOne === null ||
          rawMatch.scoreOne === undefined ||
          rawMatch.scoreOne === ""
            ? null
            : toNumber(rawMatch.scoreOne, null);

        const scoreTwo =
          rawMatch.scoreTwo === null ||
          rawMatch.scoreTwo === undefined ||
          rawMatch.scoreTwo === ""
            ? null
            : toNumber(rawMatch.scoreTwo, null);

        normalized[roundKey][matchNumber] = {
          scoreOne:
            Number.isInteger(scoreOne) && scoreOne >= 0
              ? scoreOne
              : null,
          scoreTwo:
            Number.isInteger(scoreTwo) && scoreTwo >= 0
              ? scoreTwo
              : null,
          winner: normalizeKnockoutTeamReference(
            rawMatch.winner
          )
        };
      }
    }
  );

  return normalized;
}

let bottomEightResults = normalizeBottomEightResults(
  localState?.bottomEightResults
);


function normalizeTopScorers(rawScorers) {
  const normalized = {};

  if (!rawScorers || typeof rawScorers !== "object") {
    return normalized;
  }

  Object.entries(rawScorers).forEach(
    ([savedId, rawScorer]) => {
      if (!rawScorer || typeof rawScorer !== "object") {
        return;
      }

      const id = String(
        rawScorer.id || savedId || ""
      ).trim();

      const groupKey = String(
        rawScorer.groupKey || ""
      ).trim();

      const teamName = String(
        rawScorer.teamName || ""
      ).trim();

      const playerNumber = String(
        rawScorer.playerNumber || ""
      ).trim();

      const goals = toNumber(rawScorer.goals);

      if (
        !id ||
        !teamName ||
        !/^\d{1,2}$/.test(playerNumber)
      ) {
        return;
      }

      normalized[id] = {
        id,
        groupKey,
        teamName,
        playerNumber,
        goals:
          Number.isInteger(goals) && goals >= 0
            ? goals
            : 0
      };
    }
  );

  return normalized;
}

let topScorers = normalizeTopScorers(
  localState?.topScorers
);

const REMOVED_TEAM_NAMES = new Set([
  "Sikh Gurdwara Darlington",
  "TBC",
  "Singh Sabha Slough",
  "Manchester Youth",
  "Manchester Youth FC"
]);

let tournamentMigrationPending = false;
let tournamentMigrationRunning = false;
let tournamentDataLoadedFromFirebase = false;

function teamHasBeenRemoved(teamName) {
  return REMOVED_TEAM_NAMES.has(
    String(teamName || "").trim()
  );
}

function setupContainsRemovedTeam(setup) {
  return Object.values(setup || {}).some((match) => {
    return [match?.teamOne, match?.teamTwo].some(
      (team) => teamHasBeenRemoved(team?.teamName)
    );
  });
}

function standardizeOfficialTeamNamesInState() {
  let changed = false;

  getGroupKeys().forEach((groupKey) => {
    (groups[groupKey] || []).forEach((team) => {
      const officialName = getOfficialTeamName(team.name);

      if (officialName !== team.name) {
        team.name = officialName;

        if (!String(team.logo || "").trim()) {
          team.logo = getDefaultTeamLogo(officialName);
        }

        changed = true;
      }
    });

    Object.values(matches[groupKey] || {}).forEach((match) => {
      const officialTeamA = getOfficialTeamName(match?.teamA);
      const officialTeamB = getOfficialTeamName(match?.teamB);

      if (officialTeamA !== match.teamA) {
        match.teamA = officialTeamA;
        changed = true;
      }

      if (officialTeamB !== match.teamB) {
        match.teamB = officialTeamB;
        changed = true;
      }
    });
  });

  [knockoutSetup, bottomEightSetup].forEach((setup) => {
    Object.values(setup || {}).forEach((match) => {
      ["teamOne", "teamTwo"].forEach((slot) => {
        const team = match?.[slot];
        if (!team) return;

        const officialName = getOfficialTeamName(team.teamName);

        if (officialName !== team.teamName) {
          team.teamName = officialName;
          changed = true;
        }
      });
    });
  });

  [
    [knockoutRoundConfig, knockoutResults],
    [bottomEightRoundConfig, bottomEightResults]
  ].forEach(([roundConfig, results]) => {
    Object.entries(roundConfig).forEach(([roundKey, round]) => {
      for (
        let matchNumber = 1;
        matchNumber <= round.matchCount;
        matchNumber += 1
      ) {
        const winner = results?.[roundKey]?.[matchNumber]?.winner;
        if (!winner) continue;

        const officialName = getOfficialTeamName(winner.teamName);

        if (officialName !== winner.teamName) {
          winner.teamName = officialName;
          changed = true;
        }
      }
    });
  });

  Object.values(topScorers || {}).forEach((scorer) => {
    const officialName = getOfficialTeamName(scorer.teamName);

    if (officialName !== scorer.teamName) {
      scorer.teamName = officialName;
      changed = true;
    }
  });

  return changed;
}

function removeUnavailableTeamsFromState() {
  let changed = standardizeOfficialTeamNamesInState();
  const deletedMatchKeys = new Set();

  getGroupKeys().forEach((groupKey) => {
    const currentTeams = groups[groupKey] || [];
    const filteredTeams = currentTeams.filter(
      (team) => !teamHasBeenRemoved(team.name)
    );

    if (filteredTeams.length !== currentTeams.length) {
      groups[groupKey] = filteredTeams;
      changed = true;
    }

    Object.entries(matches[groupKey] || {}).forEach(
      ([matchId, match]) => {
        if (
          teamHasBeenRemoved(match?.teamA) ||
          teamHasBeenRemoved(match?.teamB)
        ) {
          delete matches[groupKey][matchId];
          deletedMatchKeys.add(`${groupKey}:${matchId}`);
          changed = true;
        }
      }
    );
  });

  Object.keys(pitchMapAssignments).forEach(
    (pitchNumber) => {
      const assignment = pitchMapAssignments[pitchNumber];
      if (!assignment) return;

      const key = `${assignment.groupKey}:${assignment.matchId}`;
      const match =
        matches?.[assignment.groupKey]?.[assignment.matchId];

      if (deletedMatchKeys.has(key) || !match) {
        pitchMapAssignments[pitchNumber] = null;
        changed = true;
      }
    }
  );

  Object.entries(topScorers).forEach(([scorerId, scorer]) => {
    if (teamHasBeenRemoved(scorer?.teamName)) {
      delete topScorers[scorerId];
      changed = true;
    }
  });

  if (setupContainsRemovedTeam(knockoutSetup)) {
    knockoutSetup = {};
    knockoutResults = createEmptyKnockoutResults();
    changed = true;
  }

  if (setupContainsRemovedTeam(bottomEightSetup)) {
    bottomEightSetup = {};
    bottomEightResults = createEmptyBottomEightResults();
    changed = true;
  }

  if (changed) {
    officialFixturesLoaded = false;
    officialFixturesVersion = "";
  }

  tournamentMigrationPending =
    tournamentMigrationPending ||
    changed ||
    plateSetupMigrationDetected;

  return changed;
}

async function persistTournamentMigrationIfNeeded() {
  if (
    !tournamentMigrationPending ||
    tournamentMigrationRunning ||
    !tournamentDataLoadedFromFirebase ||
    !databaseIsReady() ||
    !adminIsAuthenticated()
  ) {
    return;
  }

  tournamentMigrationRunning = true;

  try {
    tournamentMigrationPending = false;
    await writeTournamentState();
    console.info(
      "Saved the 20-team tournament structure to Firebase."
    );
  } catch (error) {
    tournamentMigrationPending = true;
    console.error(
      "The 20-team tournament update could not be saved.",
      error
    );
  } finally {
    tournamentMigrationRunning = false;
  }
}

removeUnavailableTeamsFromState();

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
    knockoutSetup,
    knockoutResults,
    bottomEightSetup,
    bottomEightResults,
    topScorers,
    pitchMapAssignments,
    officialFixturesLoaded,
    officialFixturesVersion,
    currentGroup
  });
}

function restoreState(snapshot) {
  groupKeys = [...(snapshot.groupKeys || [])];
  groups = clone(snapshot.groups || {});
  matches = clone(snapshot.matches || {});
  knockoutSetup = clone(snapshot.knockoutSetup || {});
  knockoutResults = normalizeKnockoutResults(
    snapshot.knockoutResults
  );
  bottomEightSetup = normalizeBottomEightSetup(
    snapshot.bottomEightSetup
  );
  bottomEightResults = normalizeBottomEightResults(
    snapshot.bottomEightResults
  );
  topScorers = normalizeTopScorers(
    snapshot.topScorers
  );
  pitchMapAssignments = normalizePitchMapAssignments(
    snapshot.pitchMapAssignments
  );
  officialFixturesVersion = String(
    snapshot.officialFixturesVersion || ""
  );
  officialFixturesLoaded = Boolean(
    snapshot.officialFixturesLoaded
  ) &&
    officialFixturesVersion ===
      OFFICIAL_FIXTURE_VERSION;
  currentGroup = snapshot.currentGroup || groupKeys[0] || "";
}

function saveLocalState() {
  try {
    localStorage.setItem(
      "footballTournamentState",
      JSON.stringify({
        groupKeys,
        groups,
        matches,
        knockoutSetup,
        knockoutResults,
        bottomEightSetup,
        bottomEightResults,
        topScorers,
        pitchMapAssignments,
        officialFixturesLoaded,
        officialFixturesVersion
      })
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

function toDateTimeLocalInputValue(isoString) {
  if (!isoString) return "";

  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) return "";

  const localDate = new Date(
    date.getTime() - date.getTimezoneOffset() * 60000
  );

  return localDate.toISOString().slice(0, 16);
}

function formatPitchLabel(pitch) {
  const value = String(pitch || "").trim();
  if (!value) return "Pitch TBC";

  return /^pitch\b/i.test(value)
    ? value
    : `Pitch ${value}`;
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
    matches,
    knockoutSetup,
    knockoutResults,
    bottomEightSetup,
    bottomEightResults,
    topScorers,
    pitchMapAssignments,
    officialFixturesLoaded,
    officialFixturesVersion
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
          knockoutSetup =
            data.knockoutSetup &&
            typeof data.knockoutSetup === "object"
              ? clone(data.knockoutSetup)
              : {};

          knockoutResults = normalizeKnockoutResults(
            data.knockoutResults
          );

          bottomEightSetup = normalizeBottomEightSetup(
            data.bottomEightSetup
          );

          bottomEightResults = normalizeBottomEightResults(
            data.bottomEightResults
          );

          topScorers = normalizeTopScorers(
            data.topScorers
          );

          pitchMapAssignments =
            normalizePitchMapAssignments(
              data.pitchMapAssignments
            );

          officialFixturesVersion = String(
            data.officialFixturesVersion || ""
          );

          officialFixturesLoaded = Boolean(
            data.officialFixturesLoaded
          ) &&
            officialFixturesVersion ===
              OFFICIAL_FIXTURE_VERSION;

          if (!groupKeys.includes(currentGroup)) {
            currentGroup = groupKeys[0] || "";
          }

          removeUnavailableTeamsFromState();
        }
      }

      tournamentDataLoadedFromFirebase = true;
      recalculateStandingsFromMatches();
      saveLocalState();
      renderEverything();
      setLastUpdatedNow();
      persistTournamentMigrationIfNeeded();
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

    const firstGoalsFor = getTeamGoalsFor(
      groupKey,
      first.name
    );

    const secondGoalsFor = getTeamGoalsFor(
      groupKey,
      second.name
    );

    if (secondGoalsFor !== firstGoalsFor) {
      return secondGoalsFor - firstGoalsFor;
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

  const groupHasStarted = group.some(
    (team) => toNumber(team.p) > 0
  );

  const rows = group
    .map((team, index) => {
      let rowClass = "";

      if (groupHasStarted) {
        if (index < 2) {
          rowClass = "group-position-top-two";
        } else if (index === 2) {
          rowClass = "group-position-third";
        } else if (index === group.length - 1) {
          rowClass = "group-position-last";
        }
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
function getThirdPlacedTeams() {
  return getGroupKeys()
    .map((groupKey) => {
      const sortedGroup = getSortedGroup(groupKey);
      const thirdPlacedTeam = sortedGroup[2];

      if (!thirdPlacedTeam) return null;

      const played = Math.max(
        0,
        toNumber(thirdPlacedTeam.p)
      );

      const pointsPerGame =
        played > 0
          ? toNumber(thirdPlacedTeam.points) / played
          : 0;

      return {
        ...thirdPlacedTeam,
        groupKey,
        ppg: pointsPerGame,
        gf: getTeamGoalsFor(
          groupKey,
          thirdPlacedTeam.name
        )
      };
    })
    .filter(Boolean)
    .sort((first, second) => {
      if (second.ppg !== first.ppg) {
        return second.ppg - first.ppg;
      }

      if (second.gd !== first.gd) {
        return second.gd - first.gd;
      }

      if (second.gf !== first.gf) {
        return second.gf - first.gf;
      }

      return first.name.localeCompare(second.name);
    });
}

function getFourthPlacedTeams() {
  return getGroupKeys()
    .map((groupKey) => {
      const sortedGroup = getSortedGroup(groupKey);
      const fourthPlacedTeam = sortedGroup[3];

      if (!fourthPlacedTeam) return null;

      const played = Math.max(
        0,
        toNumber(fourthPlacedTeam.p)
      );

      const pointsPerGame =
        played > 0
          ? toNumber(fourthPlacedTeam.points) / played
          : 0;

      return {
        ...fourthPlacedTeam,
        groupKey,
        ppg: pointsPerGame,
        gf: getTeamGoalsFor(
          groupKey,
          fourthPlacedTeam.name
        )
      };
    })
    .filter(Boolean)
    .sort((first, second) => {
      if (second.ppg !== first.ppg) {
        return second.ppg - first.ppg;
      }

      if (second.gd !== first.gd) {
        return second.gd - first.gd;
      }

      if (second.gf !== first.gf) {
        return second.gf - first.gf;
      }

      return first.name.localeCompare(second.name);
    });
}

function renderThirdPlaceTable() {
  const table = byId("thirdPlaceTable");
  if (!table) return;

  const thirdPlacedTeams = getThirdPlacedTeams();

  if (thirdPlacedTeams.length === 0) {
    table.innerHTML = `
      <tr>
        <th>No third-placed teams are available yet.</th>
      </tr>
    `;
    return;
  }

  const rows = thirdPlacedTeams
    .map((team, index) => {
      const rowClass = "third-place-qualified";

      return `
        <tr class="${rowClass}">
          <td>${index + 1}</td>
          <td>${renderTeamName(team)}</td>
          <td>${escapeHtml(team.groupKey)}</td>
          <td>${team.p}</td>
          <td>${team.points}</td>
          <td>${team.ppg.toFixed(2)}</td>
          <td>${team.gd}</td>
          <td>${team.gf}</td>
        </tr>
      `;
    })
    .join("");

  table.innerHTML = `
    <thead>
      <tr>
        <th>Rank</th>
        <th>Team</th>
        <th>Group</th>
        <th>P</th>
        <th>Pts</th>
        <th>PPG</th>
        <th>GD</th>
        <th>GF</th>
      </tr>
    </thead>

    <tbody>
      ${rows}
    </tbody>
  `;
}
function getAllKnockoutTeamOptions() {
  const teams = [];

  getGroupKeys().forEach((groupKey) => {
    (groups[groupKey] || []).forEach((team) => {
      teams.push({
        groupKey,
        teamName: team.name
      });
    });
  });

  return teams;
}

function encodeTeamReference(reference) {
  if (!reference) return "";

  return encodeURIComponent(
    JSON.stringify({
      groupKey: reference.groupKey || "",
      teamName: reference.teamName || ""
    })
  );
}

function decodeTeamReference(value) {
  if (!value) return null;

  try {
    return normalizeKnockoutTeamReference(
      JSON.parse(decodeURIComponent(value))
    );
  } catch (error) {
    console.warn("Could not read the selected team.", error);
    return null;
  }
}

function teamReferencesMatch(first, second) {
  return Boolean(
    first &&
      second &&
      first.groupKey === second.groupKey &&
      first.teamName === second.teamName
  );
}

function knockoutSetupIsComplete() {
  return roundOf16Plan.every((match) => {
    const savedMatch = knockoutSetup?.[match.matchNumber];

    return Boolean(savedMatch?.teamOne && savedMatch?.teamTwo);
  });
}

function getKnockoutResult(roundKey, matchNumber) {
  return (
    knockoutResults?.[roundKey]?.[matchNumber] ||
    createEmptyKnockoutMatchResult()
  );
}

function getKnockoutWinner(roundKey, matchNumber) {
  return normalizeKnockoutTeamReference(
    getKnockoutResult(roundKey, matchNumber).winner
  );
}

function getKnockoutMatchTeams(roundKey, matchNumber) {
  if (roundKey === "roundOf16") {
    const savedMatch = knockoutSetup?.[matchNumber];

    return {
      teamOne: normalizeKnockoutTeamReference(
        savedMatch?.teamOne
      ),
      teamTwo: normalizeKnockoutTeamReference(
        savedMatch?.teamTwo
      )
    };
  }

  const previousRoundKey =
    roundKey === "quarterFinals"
      ? "roundOf16"
      : roundKey === "semiFinals"
        ? "quarterFinals"
        : roundKey === "final"
          ? "semiFinals"
          : null;

  if (!previousRoundKey) {
    return {
      teamOne: null,
      teamTwo: null
    };
  }

  const firstPreviousMatch = matchNumber * 2 - 1;
  const secondPreviousMatch = matchNumber * 2;

  return {
    teamOne: getKnockoutWinner(
      previousRoundKey,
      firstPreviousMatch
    ),
    teamTwo: getKnockoutWinner(
      previousRoundKey,
      secondPreviousMatch
    )
  };
}

function getNextKnockoutMatch(roundKey, matchNumber) {
  if (roundKey === "roundOf16") {
    return {
      roundKey: "quarterFinals",
      matchNumber: Math.ceil(matchNumber / 2)
    };
  }

  if (roundKey === "quarterFinals") {
    return {
      roundKey: "semiFinals",
      matchNumber: Math.ceil(matchNumber / 2)
    };
  }

  if (roundKey === "semiFinals") {
    return {
      roundKey: "final",
      matchNumber: 1
    };
  }

  return null;
}

function clearKnockoutResultAndDependents(
  roundKey,
  matchNumber,
  includeCurrent = true
) {
  if (includeCurrent && knockoutResults?.[roundKey]) {
    knockoutResults[roundKey][matchNumber] =
      createEmptyKnockoutMatchResult();
  }

  const nextMatch = getNextKnockoutMatch(
    roundKey,
    matchNumber
  );

  if (!nextMatch) return;

  clearKnockoutResultAndDependents(
    nextMatch.roundKey,
    nextMatch.matchNumber,
    true
  );
}

function knockoutHasAnyResults() {
  return Object.entries(knockoutRoundConfig).some(
    ([roundKey, round]) => {
      for (
        let matchNumber = 1;
        matchNumber <= round.matchCount;
        matchNumber += 1
      ) {
        const result = getKnockoutResult(
          roundKey,
          matchNumber
        );

        if (
          result.scoreOne !== null ||
          result.scoreTwo !== null ||
          result.winner
        ) {
          return true;
        }
      }

      return false;
    }
  );
}


function getKnockoutSlotPlaceholder(
  roundKey,
  matchNumber,
  slot
) {
  if (roundKey === "roundOf16") {
    const plan = roundOf16Plan.find(
      (match) => match.matchNumber === matchNumber
    );

    return slot === "one"
      ? plan?.teamOneSource || "Round of 16 team"
      : plan?.teamTwoSource || "Round of 16 team";
  }

  const previousRoundKey =
    roundKey === "quarterFinals"
      ? "roundOf16"
      : roundKey === "semiFinals"
        ? "quarterFinals"
        : roundKey === "final"
          ? "semiFinals"
          : null;

  if (!previousRoundKey) return "Team to be confirmed";

  const previousRound = knockoutRoundConfig[previousRoundKey];
  const previousMatchNumber =
    slot === "one"
      ? matchNumber * 2 - 1
      : matchNumber * 2;

  return `Winner of ${previousRound.shortLabel} ${previousMatchNumber}`;
}

function getKnockoutDisplayTeam(
  reference,
  placeholder = "Team to be confirmed"
) {
  if (!reference) {
    return {
      name: placeholder,
      logo: "",
      groupKey: "",
      isPlaceholder: true
    };
  }

  const savedTeam = (groups[reference.groupKey] || []).find(
    (team) => team.name === reference.teamName
  );

  if (savedTeam) {
    return {
      ...savedTeam,
      groupKey: reference.groupKey,
      isPlaceholder: false
    };
  }

  return {
    name: reference.teamName || placeholder,
    logo: "",
    groupKey: reference.groupKey || "",
    isPlaceholder: false
  };
}

function renderKnockoutTeamLabel(reference) {
  const team = getKnockoutDisplayTeam(reference);
  return renderTeamName(team);
}

function renderKnockoutSetup() {
  const container = byId("knockoutSetup");
  if (!container) return;

  const allTeams = getAllKnockoutTeamOptions();

  const teamOptions = allTeams
    .map((team) => {
      const value = encodeTeamReference(team);

      return `
        <option value="${value}">
          ${escapeHtml(team.teamName)} — Group ${escapeHtml(team.groupKey)}
        </option>
      `;
    })
    .join("");

  const setupHtml = roundOf16Plan
    .map(
      (match) => `
        <div class="form-panel knockout-match-panel">
          <h3>Round of 16 — Match ${match.matchNumber}</h3>

          <p class="helper-text">
            ${escapeHtml(match.teamOneSource)}
            vs
            ${escapeHtml(match.teamTwoSource)}
          </p>

          <div class="form-field">
            <label for="knockoutTeamOne_${match.matchNumber}">
              Team 1
            </label>

            <select id="knockoutTeamOne_${match.matchNumber}">
              <option value="">Select team</option>
              ${teamOptions}
            </select>
          </div>

          <div class="form-field">
            <label for="knockoutTeamTwo_${match.matchNumber}">
              Team 2
            </label>

            <select id="knockoutTeamTwo_${match.matchNumber}">
              <option value="">Select team</option>
              ${teamOptions}
            </select>
          </div>
        </div>
      `
    )
    .join("");

  container.innerHTML = `
    <div class="form-grid">
      ${setupHtml}
    </div>

    <div class="subsection knockout-results-admin">
      <div class="section-heading">
        <div>
          <h3>Knockout Results</h3>
          <p>
            Enter scores for every round. If a match is tied,
            choose the winner after penalties.
          </p>
        </div>
      </div>

      ${renderAllAdminKnockoutRounds()}
    </div>
  `;

  roundOf16Plan.forEach((match) => {
    const savedMatch = knockoutSetup?.[match.matchNumber];
    if (!savedMatch) return;

    const teamOneSelect = byId(
      `knockoutTeamOne_${match.matchNumber}`
    );

    const teamTwoSelect = byId(
      `knockoutTeamTwo_${match.matchNumber}`
    );

    if (teamOneSelect && savedMatch.teamOne) {
      teamOneSelect.value = encodeTeamReference(
        savedMatch.teamOne
      );
    }

    if (teamTwoSelect && savedMatch.teamTwo) {
      teamTwoSelect.value = encodeTeamReference(
        savedMatch.teamTwo
      );
    }
  });
}

function renderAllAdminKnockoutRounds() {
  return Object.entries(knockoutRoundConfig)
    .map(([roundKey, round]) => {
      const matchCards = [];

      for (
        let matchNumber = 1;
        matchNumber <= round.matchCount;
        matchNumber += 1
      ) {
        matchCards.push(
          renderAdminKnockoutMatch(
            roundKey,
            matchNumber
          )
        );
      }

      return `
        <section class="knockout-admin-round">
          <h4>${escapeHtml(round.label)}</h4>
          <div class="form-grid">
            ${matchCards.join("")}
          </div>
        </section>
      `;
    })
    .join("");
}

function renderAdminKnockoutMatch(
  roundKey,
  matchNumber
) {
  const round = knockoutRoundConfig[roundKey];
  const teams = getKnockoutMatchTeams(
    roundKey,
    matchNumber
  );
  const result = getKnockoutResult(
    roundKey,
    matchNumber
  );

  const teamOne = getKnockoutDisplayTeam(
    teams.teamOne,
    getKnockoutSlotPlaceholder(
      roundKey,
      matchNumber,
      "one"
    )
  );
  const teamTwo = getKnockoutDisplayTeam(
    teams.teamTwo,
    getKnockoutSlotPlaceholder(
      roundKey,
      matchNumber,
      "two"
    )
  );

  const teamsReady = Boolean(
    teams.teamOne && teams.teamTwo
  );

  const winnerOneSelected = teamReferencesMatch(
    result.winner,
    teams.teamOne
  )
    ? "selected"
    : "";

  const winnerTwoSelected = teamReferencesMatch(
    result.winner,
    teams.teamTwo
  )
    ? "selected"
    : "";

  const encodedRoundKey = encodeURIComponent(roundKey);

  return `
    <div class="form-panel knockout-result-panel">
      <h3>
        ${escapeHtml(round.shortLabel)} ${matchNumber}
      </h3>

      <div class="knockout-admin-team">
        ${renderTeamName(teamOne)}
      </div>

      <div class="form-field">
        <label for="koScoreOne_${roundKey}_${matchNumber}">
          ${escapeHtml(teamOne.name)} score
        </label>
        <input
          type="number"
          min="0"
          step="1"
          inputmode="numeric"
          id="koScoreOne_${roundKey}_${matchNumber}"
          value="${
            result.scoreOne === null
              ? ""
              : result.scoreOne
          }"
          ${teamsReady ? "" : "disabled"}
        >
      </div>

      <div class="knockout-admin-team">
        ${renderTeamName(teamTwo)}
      </div>

      <div class="form-field">
        <label for="koScoreTwo_${roundKey}_${matchNumber}">
          ${escapeHtml(teamTwo.name)} score
        </label>
        <input
          type="number"
          min="0"
          step="1"
          inputmode="numeric"
          id="koScoreTwo_${roundKey}_${matchNumber}"
          value="${
            result.scoreTwo === null
              ? ""
              : result.scoreTwo
          }"
          ${teamsReady ? "" : "disabled"}
        >
      </div>

      <div class="form-field">
        <label for="koWinner_${roundKey}_${matchNumber}">
          Winner if tied
        </label>
        <select
          id="koWinner_${roundKey}_${matchNumber}"
          ${teamsReady ? "" : "disabled"}
        >
          <option value="">Choose after penalties</option>
          <option value="one" ${winnerOneSelected}>
            ${escapeHtml(teamOne.name)}
          </option>
          <option value="two" ${winnerTwoSelected}>
            ${escapeHtml(teamTwo.name)}
          </option>
        </select>
      </div>

      <div class="button-row">
        <button
          type="button"
          onclick="saveKnockoutMatchResult(
            decodeURIComponent('${encodedRoundKey}'),
            ${matchNumber}
          )"
          ${teamsReady ? "" : "disabled"}
        >
          Save Result
        </button>

        <button
          type="button"
          class="secondary-button"
          onclick="clearKnockoutMatchResult(
            decodeURIComponent('${encodedRoundKey}'),
            ${matchNumber}
          )"
          ${
            result.scoreOne === null &&
            result.scoreTwo === null &&
            !result.winner
              ? "disabled"
              : ""
          }
        >
          Clear
        </button>
      </div>
    </div>
  `;
}

function autoFillKnockoutSetup() {
  const group = (groupKey) => getSortedGroup(groupKey);

  const makeTeam = (groupKey, team) => {
    if (!team) return null;

    return {
      groupKey,
      teamName: team.name
    };
  };

  const choosePair = (
    priorityTeam,
    otherTeam,
    firstGroupToAvoid,
    secondGroupToAvoid
  ) => {
    const preferredOrderWorks =
      priorityTeam.groupKey !== firstGroupToAvoid &&
      otherTeam.groupKey !== secondGroupToAvoid;

    if (preferredOrderWorks) {
      return [priorityTeam, otherTeam];
    }

    const swappedOrderWorks =
      otherTeam.groupKey !== firstGroupToAvoid &&
      priorityTeam.groupKey !== secondGroupToAvoid;

    if (swappedOrderWorks) {
      return [otherTeam, priorityTeam];
    }

    return [priorityTeam, otherTeam];
  };

  const fourthPlaced = getFourthPlacedTeams();

  if (fourthPlaced.length < 5) {
    alert(
      "All five groups need complete standings before the best fourth-placed team can be selected."
    );
    return;
  }

  const bestFourth = makeTeam(
    fourthPlaced[0].groupKey,
    fourthPlaced[0]
  );

  const groupFThird = makeTeam(
    "F",
    group("F")[2]
  );

  if (!bestFourth || !groupFThird) {
    alert(
      "The best fourth-placed team and Group F third place must both be available."
    );
    return;
  }

  const flexiblePair = choosePair(
    bestFourth,
    groupFThird,
    "B",
    "C"
  );

  const suggestedMatches = {
    1: [
      makeTeam("B", group("B")[0]),
      flexiblePair[0]
    ],
    2: [
      makeTeam("C", group("C")[1]),
      makeTeam("D", group("D")[1])
    ],
    3: [
      makeTeam("E", group("E")[0]),
      makeTeam("D", group("D")[2])
    ],
    4: [
      makeTeam("F", group("F")[0]),
      makeTeam("C", group("C")[2])
    ],
    5: [
      makeTeam("D", group("D")[0]),
      makeTeam("E", group("E")[2])
    ],
    6: [
      makeTeam("B", group("B")[2]),
      makeTeam("F", group("F")[1])
    ],
    7: [
      makeTeam("C", group("C")[0]),
      flexiblePair[1]
    ],
    8: [
      makeTeam("B", group("B")[1]),
      makeTeam("E", group("E")[1])
    ]
  };

  const everyTeamAvailable = Object.values(
    suggestedMatches
  ).every((teams) => teams[0] && teams[1]);

  if (!everyTeamAvailable) {
    alert(
      "The group standings are not complete enough to build the knockout bracket yet."
    );
    return;
  }

  Object.entries(suggestedMatches).forEach(
    ([matchNumber, teams]) => {
      const teamOneSelect = byId(
        `knockoutTeamOne_${matchNumber}`
      );

      const teamTwoSelect = byId(
        `knockoutTeamTwo_${matchNumber}`
      );

      if (teamOneSelect) {
        teamOneSelect.value = encodeTeamReference(
          teams[0]
        );
      }

      if (teamTwoSelect) {
        teamTwoSelect.value = encodeTeamReference(
          teams[1]
        );
      }
    }
  );
}

async function saveKnockoutSetup() {
  const newSetup = {};
  const selectedTeams = new Set();

  for (const match of roundOf16Plan) {
    const teamOne = decodeTeamReference(
      byId(
        `knockoutTeamOne_${match.matchNumber}`
      )?.value
    );

    const teamTwo = decodeTeamReference(
      byId(
        `knockoutTeamTwo_${match.matchNumber}`
      )?.value
    );

    if (!teamOne || !teamTwo) {
      alert(
        `Select both teams for Match ${match.matchNumber}.`
      );
      return;
    }

    const teamOneKey =
      `${teamOne.groupKey}:${teamOne.teamName}`;

    const teamTwoKey =
      `${teamTwo.groupKey}:${teamTwo.teamName}`;

    if (
      selectedTeams.has(teamOneKey) ||
      selectedTeams.has(teamTwoKey) ||
      teamOneKey === teamTwoKey
    ) {
      alert(
        `A team has been selected more than once. Check Match ${match.matchNumber}.`
      );
      return;
    }

    selectedTeams.add(teamOneKey);
    selectedTeams.add(teamTwoKey);

    newSetup[match.matchNumber] = {
      teamOne,
      teamTwo
    };
  }

  const setupChanged =
    JSON.stringify(newSetup) !==
    JSON.stringify(knockoutSetup);

  if (
    setupChanged &&
    knockoutHasAnyResults() &&
    !confirm(
      "Changing the knockout setup will clear every knockout result. Continue?"
    )
  ) {
    return;
  }

  const saved = await commitStateChange(() => {
    knockoutSetup = newSetup;

    if (setupChanged) {
      knockoutResults =
        createEmptyKnockoutResults();
    }
  });

  if (saved) {
    alert("Knockout setup saved.");
  }
}

async function saveKnockoutMatchResult(
  roundKey,
  matchNumber
) {
  const round = knockoutRoundConfig[roundKey];

  if (
    !round ||
    !Number.isInteger(matchNumber) ||
    matchNumber < 1 ||
    matchNumber > round.matchCount
  ) {
    return;
  }

  const teams = getKnockoutMatchTeams(
    roundKey,
    matchNumber
  );

  if (!teams.teamOne || !teams.teamTwo) {
    alert(
      "Both teams must be confirmed before saving this result."
    );
    return;
  }

  const scoreOneValue = byId(
    `koScoreOne_${roundKey}_${matchNumber}`
  )?.value;

  const scoreTwoValue = byId(
    `koScoreTwo_${roundKey}_${matchNumber}`
  )?.value;

  if (
    scoreOneValue === "" ||
    scoreTwoValue === ""
  ) {
    alert("Enter both scores.");
    return;
  }

  const scoreOne = Number(scoreOneValue);
  const scoreTwo = Number(scoreTwoValue);

  if (
    !Number.isInteger(scoreOne) ||
    !Number.isInteger(scoreTwo) ||
    scoreOne < 0 ||
    scoreTwo < 0
  ) {
    alert(
      "Knockout scores must be whole numbers of 0 or more."
    );
    return;
  }

  let winner;

  if (scoreOne > scoreTwo) {
    winner = teams.teamOne;
  } else if (scoreTwo > scoreOne) {
    winner = teams.teamTwo;
  } else {
    const winnerChoice = byId(
      `koWinner_${roundKey}_${matchNumber}`
    )?.value;

    if (winnerChoice === "one") {
      winner = teams.teamOne;
    } else if (winnerChoice === "two") {
      winner = teams.teamTwo;
    } else {
      alert(
        "The score is tied. Choose the winner after penalties."
      );
      return;
    }
  }

  const previousWinner = getKnockoutWinner(
    roundKey,
    matchNumber
  );

  await commitStateChange(() => {
    knockoutResults[roundKey][matchNumber] = {
      scoreOne,
      scoreTwo,
      winner: clone(winner)
    };

    if (
      previousWinner &&
      !teamReferencesMatch(
        previousWinner,
        winner
      )
    ) {
      clearKnockoutResultAndDependents(
        roundKey,
        matchNumber,
        false
      );
    }
  });
}

async function clearKnockoutMatchResult(
  roundKey,
  matchNumber
) {
  const round = knockoutRoundConfig[roundKey];

  if (
    !round ||
    !Number.isInteger(matchNumber) ||
    matchNumber < 1 ||
    matchNumber > round.matchCount
  ) {
    return;
  }

  if (
    !confirm(
      "Clear this result and any later results that depend on it?"
    )
  ) {
    return;
  }

  await commitStateChange(() => {
    clearKnockoutResultAndDependents(
      roundKey,
      matchNumber,
      true
    );
  });
}

/* ==================================================
   NEST Plate Championship
================================================== */

function bottomEightSetupIsComplete() {
  return [1, 2].every((matchNumber) => {
    const match = bottomEightSetup?.[matchNumber];

    return Boolean(
      match?.teamOne &&
      match?.teamTwo
    );
  });
}

function getBottomEightResult(roundKey, matchNumber) {
  return (
    bottomEightResults?.[roundKey]?.[matchNumber] ||
    createEmptyKnockoutMatchResult()
  );
}

function getBottomEightWinner(roundKey, matchNumber) {
  return normalizeKnockoutTeamReference(
    getBottomEightResult(roundKey, matchNumber).winner
  );
}

function getBottomEightMatchTeams(roundKey, matchNumber) {
  if (roundKey === "semiFinals") {
    const savedMatch = bottomEightSetup?.[matchNumber];

    return {
      teamOne: normalizeKnockoutTeamReference(
        savedMatch?.teamOne
      ),
      teamTwo: normalizeKnockoutTeamReference(
        savedMatch?.teamTwo
      )
    };
  }

  if (roundKey === "final") {
    return {
      teamOne: getBottomEightWinner("semiFinals", 1),
      teamTwo: getBottomEightWinner("semiFinals", 2)
    };
  }

  return {
    teamOne: null,
    teamTwo: null
  };
}

function getNextBottomEightMatch(roundKey, matchNumber) {
  if (roundKey === "semiFinals") {
    return {
      roundKey: "final",
      matchNumber: 1
    };
  }

  return null;
}

function clearBottomEightResultAndDependents(
  roundKey,
  matchNumber,
  includeCurrent = true
) {
  if (
    includeCurrent &&
    bottomEightResults?.[roundKey]
  ) {
    bottomEightResults[roundKey][matchNumber] =
      createEmptyKnockoutMatchResult();
  }

  const nextMatch = getNextBottomEightMatch(
    roundKey,
    matchNumber
  );

  if (!nextMatch) return;

  clearBottomEightResultAndDependents(
    nextMatch.roundKey,
    nextMatch.matchNumber,
    true
  );
}

function bottomEightHasAnyResults() {
  return Object.entries(bottomEightRoundConfig).some(
    ([roundKey, round]) => {
      for (
        let matchNumber = 1;
        matchNumber <= round.matchCount;
        matchNumber += 1
      ) {
        const result = getBottomEightResult(
          roundKey,
          matchNumber
        );

        if (
          result.scoreOne !== null ||
          result.scoreTwo !== null ||
          result.winner
        ) {
          return true;
        }
      }

      return false;
    }
  );
}


function getBottomEightSlotPlaceholder(
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

function renderBottomEightSetup() {
  const container = byId("bottomEightSetup");
  if (!container) return;

  const allTeams = getAllKnockoutTeamOptions();

  const teamOptions = allTeams
    .map((team) => {
      const value = encodeTeamReference(team);

      return `
        <option value="${value}">
          ${escapeHtml(team.teamName)} — Group ${escapeHtml(team.groupKey)}
        </option>
      `;
    })
    .join("");

  const semiFinalHtml = bottomEightPlan
    .map((match) => `
      <div class="form-panel knockout-match-panel">
        <h3>NEST Plate — Semi-final ${match.matchNumber}</h3>

        <p class="helper-text">
          ${escapeHtml(match.teamOneSource)} vs ${escapeHtml(match.teamTwoSource)}
        </p>

        <div class="form-field">
          <label for="bottomEightTeamOne_${match.matchNumber}">
            ${escapeHtml(match.teamOneSource)}
          </label>

          <select id="bottomEightTeamOne_${match.matchNumber}">
            <option value="">Select team</option>
            ${teamOptions}
          </select>
        </div>

        <div class="form-field">
          <label for="bottomEightTeamTwo_${match.matchNumber}">
            ${escapeHtml(match.teamTwoSource)}
          </label>

          <select id="bottomEightTeamTwo_${match.matchNumber}">
            <option value="">Select team</option>
            ${teamOptions}
          </select>
        </div>
      </div>
    `)
    .join("");

  container.innerHTML = `
    <div class="section-heading">
      <div>
        <h3>Four-team seeded bracket</h3>
        <p>
          The four NEST Plate teams are the remaining fourth-placed teams,
          seeded by points per game, then goal difference, then goals scored.
          Seed 1 plays Seed 4 and Seed 2 plays Seed 3.
        </p>
      </div>
    </div>

    <div class="form-grid">
      ${semiFinalHtml}
    </div>

    <div class="subsection knockout-results-admin">
      <div class="section-heading">
        <div>
          <h3>NEST Plate Results</h3>
          <p>
            Enter the two semi-final results, then the final.
            If a match is tied, choose the winner after penalties.
          </p>
        </div>
      </div>

      ${renderAllAdminBottomEightRounds()}
    </div>
  `;

  bottomEightPlan.forEach((match) => {
    const savedMatch =
      bottomEightSetup?.[match.matchNumber];

    if (savedMatch?.teamOne) {
      byId(
        `bottomEightTeamOne_${match.matchNumber}`
      ).value = encodeTeamReference(
        savedMatch.teamOne
      );
    }

    if (savedMatch?.teamTwo) {
      byId(
        `bottomEightTeamTwo_${match.matchNumber}`
      ).value = encodeTeamReference(
        savedMatch.teamTwo
      );
    }
  });
}

function renderAllAdminBottomEightRounds() {
  return Object.entries(bottomEightRoundConfig)
    .map(([roundKey, round]) => {
      const matchCards = [];

      for (
        let matchNumber = 1;
        matchNumber <= round.matchCount;
        matchNumber += 1
      ) {
        matchCards.push(
          renderAdminBottomEightMatch(
            roundKey,
            matchNumber
          )
        );
      }

      return `
        <section class="knockout-admin-round">
          <h4>${escapeHtml(round.label)}</h4>

          <div class="form-grid">
            ${matchCards.join("")}
          </div>
        </section>
      `;
    })
    .join("");
}

function renderAdminBottomEightMatch(
  roundKey,
  matchNumber
) {
  const round = bottomEightRoundConfig[roundKey];

  const teams = getBottomEightMatchTeams(
    roundKey,
    matchNumber
  );

  const result = getBottomEightResult(
    roundKey,
    matchNumber
  );

  const teamOne = getKnockoutDisplayTeam(
    teams.teamOne,
    getBottomEightSlotPlaceholder(
      roundKey,
      matchNumber,
      "one"
    )
  );

  const teamTwo = getKnockoutDisplayTeam(
    teams.teamTwo,
    getBottomEightSlotPlaceholder(
      roundKey,
      matchNumber,
      "two"
    )
  );

  const teamsReady = Boolean(
    teams.teamOne && teams.teamTwo
  );

  const winnerOneSelected = teamReferencesMatch(
    result.winner,
    teams.teamOne
  )
    ? "selected"
    : "";

  const winnerTwoSelected = teamReferencesMatch(
    result.winner,
    teams.teamTwo
  )
    ? "selected"
    : "";

  const encodedRoundKey = encodeURIComponent(roundKey);

  return `
    <div class="form-panel knockout-result-panel">
      <h3>
        NEST Plate Championship ${escapeHtml(round.shortLabel)} ${matchNumber}
      </h3>

      <div class="knockout-admin-team">
        ${renderTeamName(teamOne)}
      </div>

      <div class="form-field">
        <label for="b8ScoreOne_${roundKey}_${matchNumber}">
          ${escapeHtml(teamOne.name)} score
        </label>

        <input
          type="number"
          min="0"
          step="1"
          inputmode="numeric"
          id="b8ScoreOne_${roundKey}_${matchNumber}"
          value="${
            result.scoreOne === null
              ? ""
              : result.scoreOne
          }"
          ${teamsReady ? "" : "disabled"}
        >
      </div>

      <div class="knockout-admin-team">
        ${renderTeamName(teamTwo)}
      </div>

      <div class="form-field">
        <label for="b8ScoreTwo_${roundKey}_${matchNumber}">
          ${escapeHtml(teamTwo.name)} score
        </label>

        <input
          type="number"
          min="0"
          step="1"
          inputmode="numeric"
          id="b8ScoreTwo_${roundKey}_${matchNumber}"
          value="${
            result.scoreTwo === null
              ? ""
              : result.scoreTwo
          }"
          ${teamsReady ? "" : "disabled"}
        >
      </div>

      <div class="form-field">
        <label for="b8Winner_${roundKey}_${matchNumber}">
          Winner if tied
        </label>

        <select
          id="b8Winner_${roundKey}_${matchNumber}"
          ${teamsReady ? "" : "disabled"}
        >
          <option value="">Choose after penalties</option>

          <option value="one" ${winnerOneSelected}>
            ${escapeHtml(teamOne.name)}
          </option>

          <option value="two" ${winnerTwoSelected}>
            ${escapeHtml(teamTwo.name)}
          </option>
        </select>
      </div>

      <div class="button-row">
        <button
          type="button"
          onclick="saveBottomEightMatchResult(
            decodeURIComponent('${encodedRoundKey}'),
            ${matchNumber}
          )"
          ${teamsReady ? "" : "disabled"}
        >
          Save Result
        </button>

        <button
          type="button"
          class="secondary-button"
          onclick="clearBottomEightMatchResult(
            decodeURIComponent('${encodedRoundKey}'),
            ${matchNumber}
          )"
          ${
            result.scoreOne === null &&
            result.scoreTwo === null &&
            !result.winner
              ? "disabled"
              : ""
          }
        >
          Clear
        </button>
      </div>
    </div>
  `;
}

function getTeamGoalsFor(groupKey, teamName) {
  return Object.values(matches[groupKey] || {}).reduce(
    (total, match) => {
      if (!matchIsResult(match)) return total;

      if (match.teamA === teamName) {
        return total + toNumber(match.scoreA);
      }

      if (match.teamB === teamName) {
        return total + toNumber(match.scoreB);
      }

      return total;
    },
    0
  );
}

function createPlateSeedCandidate(groupKey, team) {
  if (!team) return null;

  const played = Math.max(0, toNumber(team.p));

  return {
    groupKey,
    teamName: team.name,
    ppg:
      played > 0
        ? toNumber(team.points) / played
        : 0,
    gd: toNumber(team.gd),
    gf: getTeamGoalsFor(groupKey, team.name)
  };
}

function getSeededPlateTeams() {
  return getFourthPlacedTeams()
    .slice(1)
    .map((team) =>
      createPlateSeedCandidate(
        team.groupKey,
        team
      )
    )
    .filter(Boolean);
}

function plateSeedCandidateToReference(candidate) {
  if (!candidate) return null;

  return {
    groupKey: candidate.groupKey,
    teamName: candidate.teamName
  };
}

function autoFillBottomEightSetup() {
  const seededTeams = getSeededPlateTeams();

  if (seededTeams.length !== 4) {
    alert(
      "All five groups need valid standings before the four NEST Plate teams can be seeded."
    );
    return;
  }

  const references = seededTeams.map(
    plateSeedCandidateToReference
  );

  const assignments = {
    bottomEightTeamOne_1: references[0],
    bottomEightTeamTwo_1: references[3],
    bottomEightTeamOne_2: references[1],
    bottomEightTeamTwo_2: references[2]
  };

  Object.entries(assignments).forEach(
    ([selectId, team]) => {
      const select = byId(selectId);

      if (select && team) {
        select.value = encodeTeamReference(team);
      }
    }
  );

  const hasExactTie = seededTeams.some(
    (team, index) => {
      const nextTeam = seededTeams[index + 1];
      if (!nextTeam) return false;

      return (
        team.ppg === nextTeam.ppg &&
        team.gd === nextTeam.gd &&
        team.gf === nextTeam.gf
      );
    }
  );

  if (hasExactTie) {
    alert(
      "An exact seeding tie remains after PPG, goal difference and goals scored. The tied teams are currently ordered alphabetically; you can change them manually before saving."
    );
  }
}

async function saveBottomEightSetup() {
  const newSetup = {
    formatVersion: 4
  };

  const selectedTeams = new Set();

  const addUniqueTeam = (team, context) => {
    if (!team) {
      alert(`Select a team for ${context}.`);
      return false;
    }

    const teamKey = `${team.groupKey}:${team.teamName}`;

    if (selectedTeams.has(teamKey)) {
      alert(
        `${team.teamName} has been selected more than once.`
      );
      return false;
    }

    selectedTeams.add(teamKey);
    return true;
  };

  for (const match of bottomEightPlan) {
    const teamOne = decodeTeamReference(
      byId(
        `bottomEightTeamOne_${match.matchNumber}`
      )?.value
    );

    const teamTwo = decodeTeamReference(
      byId(
        `bottomEightTeamTwo_${match.matchNumber}`
      )?.value
    );

    if (
      !addUniqueTeam(
        teamOne,
        `Semi-final ${match.matchNumber} ${match.teamOneSource}`
      ) ||
      !addUniqueTeam(
        teamTwo,
        `Semi-final ${match.matchNumber} ${match.teamTwoSource}`
      )
    ) {
      return;
    }

    newSetup[match.matchNumber] = {
      teamOne,
      teamTwo
    };
  }

  const setupChanged =
    JSON.stringify(newSetup) !==
    JSON.stringify(bottomEightSetup);

  if (
    setupChanged &&
    bottomEightHasAnyResults() &&
    !confirm(
      "Changing the NEST Plate setup will clear every NEST Plate result. Continue?"
    )
  ) {
    return;
  }

  const saved = await commitStateChange(() => {
    bottomEightSetup = newSetup;

    if (setupChanged) {
      bottomEightResults =
        createEmptyBottomEightResults();
    }
  });

  if (saved) {
    alert("NEST Plate setup saved.");
  }
}

async function saveBottomEightMatchResult(
  roundKey,
  matchNumber
) {
  const round = bottomEightRoundConfig[roundKey];

  if (
    !round ||
    !Number.isInteger(matchNumber) ||
    matchNumber < 1 ||
    matchNumber > round.matchCount
  ) {
    return;
  }

  const teams = getBottomEightMatchTeams(
    roundKey,
    matchNumber
  );

  if (!teams.teamOne || !teams.teamTwo) {
    alert(
      "Both teams must be confirmed before saving this NEST Plate result."
    );
    return;
  }

  const scoreOneValue = byId(
    `b8ScoreOne_${roundKey}_${matchNumber}`
  )?.value;

  const scoreTwoValue = byId(
    `b8ScoreTwo_${roundKey}_${matchNumber}`
  )?.value;

  if (
    scoreOneValue === "" ||
    scoreTwoValue === ""
  ) {
    alert("Enter both scores.");
    return;
  }

  const scoreOne = Number(scoreOneValue);
  const scoreTwo = Number(scoreTwoValue);

  if (
    !Number.isInteger(scoreOne) ||
    !Number.isInteger(scoreTwo) ||
    scoreOne < 0 ||
    scoreTwo < 0
  ) {
    alert(
      "NEST Plate scores must be whole numbers of 0 or more."
    );
    return;
  }

  let winner;

  if (scoreOne > scoreTwo) {
    winner = teams.teamOne;
  } else if (scoreTwo > scoreOne) {
    winner = teams.teamTwo;
  } else {
    const winnerChoice = byId(
      `b8Winner_${roundKey}_${matchNumber}`
    )?.value;

    if (winnerChoice === "one") {
      winner = teams.teamOne;
    } else if (winnerChoice === "two") {
      winner = teams.teamTwo;
    } else {
      alert(
        "The score is tied. Choose the winner after penalties."
      );
      return;
    }
  }

  const previousWinner = getBottomEightWinner(
    roundKey,
    matchNumber
  );

  await commitStateChange(() => {
    bottomEightResults[roundKey][matchNumber] = {
      scoreOne,
      scoreTwo,
      winner: clone(winner)
    };

    if (
      previousWinner &&
      !teamReferencesMatch(
        previousWinner,
        winner
      )
    ) {
      clearBottomEightResultAndDependents(
        roundKey,
        matchNumber,
        false
      );
    }
  });
}

async function clearBottomEightMatchResult(
  roundKey,
  matchNumber
) {
  const round = bottomEightRoundConfig[roundKey];

  if (
    !round ||
    !Number.isInteger(matchNumber) ||
    matchNumber < 1 ||
    matchNumber > round.matchCount
  ) {
    return;
  }

  if (
    !confirm(
      "Clear this NEST Plate result and any later results that depend on it?"
    )
  ) {
    return;
  }

  await commitStateChange(() => {
    clearBottomEightResultAndDependents(
      roundKey,
      matchNumber,
      true
    );
  });
}

function renderPublicTournamentLockup() {
  return `
    <div class="public-knockout-lockup">
      <img
        src="logos/tournament-logo-full.png"
        alt="Ladhar Investments North East Sikh Tournament 2026"
      >
    </div>
  `;
}

function getPublicPlateSeedReference(seedNumber) {
  const seedSources = {
    1: bottomEightSetup?.[1]?.teamOne,
    2: bottomEightSetup?.[2]?.teamOne,
    3: bottomEightSetup?.[2]?.teamTwo,
    4: bottomEightSetup?.[1]?.teamTwo
  };

  return normalizeKnockoutTeamReference(
    seedSources[seedNumber]
  );
}

function renderPublicBottomEightMatch(
  roundKey,
  matchNumber,
  displayMatchNumber = matchNumber,
  extraClass = ""
) {
  const round = bottomEightRoundConfig[roundKey];

  const teams = getBottomEightMatchTeams(
    roundKey,
    matchNumber
  );

  const result = getBottomEightResult(
    roundKey,
    matchNumber
  );

  return `
    <article
      class="knockout-match-card ${escapeHtml(extraClass)}"
      data-round="bottomEight-${escapeHtml(roundKey)}"
      data-match="${matchNumber}"
    >
      <div class="knockout-match-number">
        NEST Plate Championship ${escapeHtml(round.shortLabel)}
        ${displayMatchNumber}
      </div>

      ${renderPublicKnockoutTeamRow(
        teams.teamOne,
        result.scoreOne,
        result.winner,
        getBottomEightSlotPlaceholder(
          roundKey,
          matchNumber,
          "one"
        )
      )}

      ${renderPublicKnockoutTeamRow(
        teams.teamTwo,
        result.scoreTwo,
        result.winner,
        getBottomEightSlotPlaceholder(
          roundKey,
          matchNumber,
          "two"
        )
      )}

      ${renderPublicPenaltyWinnerNote(result)}
    </article>
  `;
}

function renderPublicPlateByeMatch(
  displayMatchNumber,
  seedNumber,
  semiFinalNumber,
  slotNumber
) {
  const reference = getPublicPlateSeedReference(
    seedNumber
  );

  const team = getKnockoutDisplayTeam(
    reference,
    `Seed ${seedNumber}`
  );

  return `
    <article
      class="knockout-match-card plate-bye-match plate-grid-slot-${slotNumber}"
      data-plate-seed="${seedNumber}"
    >
      <div class="knockout-match-number">
        NEST Plate Championship QF ${displayMatchNumber} · BYE
      </div>

      <div class="knockout-team-row knockout-team-winner">
        ${renderTeamName(team)}
        <span class="plate-bye-chip">BYE</span>
      </div>

      <div class="plate-bye-message">
        Automatic bye — advances to Semi-final ${semiFinalNumber}
      </div>
    </article>
  `;
}

function publicPlateConnectorClass(hasAdvanced) {
  return hasAdvanced
    ? "plate-connector is-advanced"
    : "plate-connector";
}

function renderPublicPlateConnectors() {
  const semiFinalOneWinner = Boolean(
    getBottomEightWinner("semiFinals", 1)
  );

  const semiFinalTwoWinner = Boolean(
    getBottomEightWinner("semiFinals", 2)
  );

  return `
    <svg
      class="plate-bracket-connectors"
      viewBox="0 0 1000 800"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path class="${publicPlateConnectorClass(semiFinalOneWinner)}"
        d="M300 220 H500 V400 H700" />
      <path class="${publicPlateConnectorClass(semiFinalTwoWinner)}"
        d="M300 580 H500 V400 H700" />
    </svg>
  `;
}

function renderPublicBottomEightBracket() {
  const container = byId("publicBottomEightBracket");
  if (!container) return;

  container.innerHTML = `
    <div class="plate-bracket-modern plate-bracket-four-team">
      ${renderPublicPlateConnectors()}

      <section class="plate-stage plate-quarter-finals">
        <h3>Semi-finals</h3>

        <div class="plate-stage-matches">
          ${renderPublicBottomEightMatch(
            "semiFinals",
            1,
            1,
            "plate-grid-slot-1"
          )}

          ${renderPublicBottomEightMatch(
            "semiFinals",
            2,
            2,
            "plate-grid-slot-3"
          )}
        </div>
      </section>

      <section class="plate-stage plate-final-stage">
        <h3>Final</h3>

        <div class="plate-stage-matches">
          ${renderPublicBottomEightMatch(
            "final",
            1,
            1,
            "plate-grid-slot-1 plate-final-match"
          )}
        </div>
      </section>
    </div>

    ${renderPublicTournamentLockup()}
  `;
}


/* ==================================================
   Public Live Pitch Map
================================================== */

const PUBLIC_PITCH_MAP_ORDER = [6, 3, 4, 5, 1, 2];

function getPublicPitchMapMatch(pitchNumber) {
  const assignment = pitchMapAssignments?.[pitchNumber];

  if (!assignment?.groupKey || !assignment?.matchId) {
    return null;
  }

  const match = matches?.[assignment.groupKey]?.[
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

function renderPublicPitchMapTeam(
  groupKey,
  teamName
) {
  const reference = {
    groupKey,
    teamName: String(teamName || "Team TBC").trim()
  };

  const team = getKnockoutDisplayTeam(
    reference,
    "Team TBC"
  );

  const logoPath = String(team.logo || "").trim();

  return `
    <div class="public-pitch-map-team">
      ${
        logoPath
          ? `
              <img
                class="public-pitch-map-team-logo"
                src="${escapeHtml(logoPath)}"
                alt=""
                loading="lazy"
              >
            `
          : ""
      }

      <span>${escapeHtml(team.name)}</span>
    </div>
  `;
}

function renderPublicPitchMapCard(pitchNumber) {
  const match = getPublicPitchMapMatch(
    pitchNumber
  );

  if (!match) {
    return `
      <article class="public-pitch-map-card is-empty">
        <div class="public-pitch-map-card-title">
          Pitch ${pitchNumber}
        </div>

        <div class="public-pitch-map-empty-message">
          No match currently
        </div>
      </article>
    `;
  }

  return `
    <article class="public-pitch-map-card">
      <div class="public-pitch-map-card-title">
        <span>Pitch ${pitchNumber}</span>
        <span class="public-pitch-map-group-badge">
          Group ${escapeHtml(match.groupKey)}
        </span>
      </div>

      <div class="public-pitch-map-match">
        ${renderPublicPitchMapTeam(
          match.groupKey,
          match.teamA
        )}

        <span class="public-pitch-map-versus">VS</span>

        ${renderPublicPitchMapTeam(
          match.groupKey,
          match.teamB
        )}
      </div>
    </article>
  `;
}

function renderPublicPitchMap() {
  const grid = byId("publicPitchMapGrid");
  if (!grid) return;

  grid.innerHTML = PUBLIC_PITCH_MAP_ORDER
    .map(renderPublicPitchMapCard)
    .join("");
}


/* ==================================================
   Top Goalscorers

/* ==================================================
   Top Goalscorers
================================================== */

function getSortedTopScorers() {
  return Object.values(topScorers || {}).sort(
    (first, second) => {
      if (second.goals !== first.goals) {
        return second.goals - first.goals;
      }

      if (first.teamName !== second.teamName) {
        return first.teamName.localeCompare(
          second.teamName
        );
      }

      return (
        Number(first.playerNumber) -
        Number(second.playerNumber)
      );
    }
  );
}

function getTopScorerRank(sortedScorers, index) {
  if (index === 0) return 1;

  if (
    sortedScorers[index].goals ===
    sortedScorers[index - 1].goals
  ) {
    return getTopScorerRank(
      sortedScorers,
      index - 1
    );
  }

  return index + 1;
}

function getTopScorerTeam(scorer) {
  return getKnockoutDisplayTeam({
    groupKey: scorer.groupKey,
    teamName: scorer.teamName
  });
}

function renderTopScorerTeamOptions() {
  const select = byId("scorerTeamSelect");
  if (!select) return;

  const previousValue = select.value;

  const options = getAllKnockoutTeamOptions()
    .map((team) => {
      const value = encodeTeamReference(team);

      return `
        <option value="${value}">
          ${escapeHtml(team.teamName)}
          — Group ${escapeHtml(team.groupKey)}
        </option>
      `;
    })
    .join("");

  select.innerHTML = options;

  if (
    previousValue &&
    [...select.options].some(
      (option) => option.value === previousValue
    )
  ) {
    select.value = previousValue;
  }
}

function renderAdminTopScorers() {
  renderTopScorerTeamOptions();

  const container = byId("adminTopScorersList");
  if (!container) return;

  const scorers = getSortedTopScorers();

  if (scorers.length === 0) {
    container.innerHTML = `
      <p class="empty-state">
        No goalscorers have been added yet.
      </p>
    `;
    return;
  }

  container.innerHTML = `
    <div class="form-grid">
      ${scorers
        .map((scorer, index) => {
          const team = getTopScorerTeam(scorer);
          const encodedId = encodeURIComponent(scorer.id);

          return `
            <div class="form-panel">
              <h3>
                ${getTopScorerRank(scorers, index)}.
                Player #${escapeHtml(scorer.playerNumber)}
              </h3>

              <div class="knockout-admin-team">
                ${renderTeamName(team)}
              </div>

              <p class="helper-text">
                Current goals:
                <strong>${scorer.goals}</strong>
              </p>

              <div class="button-row">
                <button
                  type="button"
                  onclick="changeTopScorerGoals(
                    decodeURIComponent('${encodedId}'),
                    1
                  )"
                >
                  +1 Goal
                </button>

                <button
                  type="button"
                  class="secondary-button"
                  onclick="changeTopScorerGoals(
                    decodeURIComponent('${encodedId}'),
                    -1
                  )"
                  ${scorer.goals === 0 ? "disabled" : ""}
                >
                  −1 Goal
                </button>
              </div>

              <div class="form-field">
                <label for="scorerGoals_${escapeHtml(scorer.id)}">
                  Set exact goal total
                </label>

                <input
                  type="number"
                  min="0"
                  step="1"
                  inputmode="numeric"
                  id="scorerGoals_${escapeHtml(scorer.id)}"
                  value="${scorer.goals}"
                >
              </div>

              <div class="button-row">
                <button
                  type="button"
                  onclick="setTopScorerGoals(
                    decodeURIComponent('${encodedId}')
                  )"
                >
                  Save Total
                </button>

                <button
                  type="button"
                  class="danger-button"
                  onclick="removeTopScorer(
                    decodeURIComponent('${encodedId}')
                  )"
                >
                  Remove Player
                </button>
              </div>
            </div>
          `;
        })
        .join("")}
    </div>
  `;
}

function renderPublicTopScorers() {
  const table = byId("publicTopScorersTable");
  if (!table) return;

  const scorers = getSortedTopScorers().slice(0, 5);

  if (scorers.length === 0) {
    table.innerHTML = `
      <tbody>
        <tr>
          <td colspan="4">
            Top goalscorers will appear here once goals are recorded.
          </td>
        </tr>
      </tbody>
    `;
    return;
  }

  const rows = scorers
    .map((scorer, index) => {
      const team = getTopScorerTeam(scorer);
      const rank = getTopScorerRank(scorers, index);

      return `
        <tr class="${rank === 1 ? "top-scorer-leader" : ""}">
          <td class="top-scorer-rank">
            ${rank}
          </td>

          <td class="top-scorer-player">
            #${escapeHtml(scorer.playerNumber)}
          </td>

          <td>
            ${renderTeamName(team)}
          </td>

          <td>
            <span class="top-scorer-goals">
              ${scorer.goals}
            </span>
          </td>
        </tr>
      `;
    })
    .join("");

  table.innerHTML = `
    <thead>
      <tr>
        <th>Rank</th>
        <th>Player</th>
        <th>Team</th>
        <th>Goals</th>
      </tr>
    </thead>

    <tbody>
      ${rows}
    </tbody>
  `;
}

async function addTopScorer() {
  const teamReference = decodeTeamReference(
    byId("scorerTeamSelect")?.value
  );

  const playerNumber = String(
    byId("scorerNumberInput")?.value || ""
  ).trim();

  const goalsValue = String(
    byId("scorerStartingGoals")?.value || "0"
  ).trim();

  if (!teamReference) {
    alert("Choose a team.");
    return;
  }

  if (
    !/^\d{1,2}$/.test(playerNumber) ||
    Number(playerNumber) < 1 ||
    Number(playerNumber) > 99
  ) {
    alert("Enter a player number from 1 to 99.");
    return;
  }

  const goals = Number(goalsValue);

  if (
    !Number.isInteger(goals) ||
    goals < 0
  ) {
    alert("Goals must be a whole number of 0 or more.");
    return;
  }

  const duplicateExists = Object.values(
    topScorers
  ).some((scorer) => {
    return (
      scorer.groupKey === teamReference.groupKey &&
      scorer.teamName === teamReference.teamName &&
      Number(scorer.playerNumber) === Number(playerNumber)
    );
  });

  if (duplicateExists) {
    alert(
      "That player number has already been added for this team."
    );
    return;
  }

  const scorerId =
    `scorer_${Date.now()}_${Math.random()
      .toString(36)
      .slice(2, 8)}`;

  const saved = await commitStateChange(() => {
    topScorers[scorerId] = {
      id: scorerId,
      groupKey: teamReference.groupKey,
      teamName: teamReference.teamName,
      playerNumber,
      goals
    };
  });

  if (saved) {
    if (byId("scorerNumberInput")) {
      byId("scorerNumberInput").value = "";
    }

    if (byId("scorerStartingGoals")) {
      byId("scorerStartingGoals").value = "0";
    }
  }
}

async function changeTopScorerGoals(
  scorerId,
  amount
) {
  const scorer = topScorers?.[scorerId];
  if (!scorer) return;

  await commitStateChange(() => {
    scorer.goals = Math.max(
      0,
      toNumber(scorer.goals) + amount
    );
  });
}

async function setTopScorerGoals(scorerId) {
  const scorer = topScorers?.[scorerId];
  if (!scorer) return;

  const value = byId(
    `scorerGoals_${scorerId}`
  )?.value;

  const goals = Number(value);

  if (
    !Number.isInteger(goals) ||
    goals < 0
  ) {
    alert("Goals must be a whole number of 0 or more.");
    return;
  }

  await commitStateChange(() => {
    scorer.goals = goals;
  });
}

async function removeTopScorer(scorerId) {
  const scorer = topScorers?.[scorerId];
  if (!scorer) return;

  if (
    !confirm(
      `Remove Player #${scorer.playerNumber} from the goalscorer list?`
    )
  ) {
    return;
  }

  await commitStateChange(() => {
    delete topScorers[scorerId];
  });
}

function updateTopScorerTeamName(
  groupKey,
  oldName,
  newName
) {
  Object.values(topScorers || {}).forEach(
    (scorer) => {
      if (
        scorer.groupKey === groupKey &&
        scorer.teamName === oldName
      ) {
        scorer.teamName = newName;
      }
    }
  );
}

function teamHasTopScorers(groupKey, teamName) {
  return Object.values(topScorers || {}).some(
    (scorer) => {
      return (
        scorer.groupKey === groupKey &&
        scorer.teamName === teamName
      );
    }
  );
}


/* ==================================================
   Live Pitch Map
================================================== */

function getAllPitchMapFixtures() {
  const fixtures = [];

  groupKeys.forEach((groupKey) => {
    Object.entries(matches[groupKey] || {}).forEach(
      ([matchId, match]) => {
        if (!match || typeof match !== "object") return;

        fixtures.push({
          groupKey,
          matchId,
          teamA: String(match.teamA || "Team A"),
          teamB: String(match.teamB || "Team B"),
          time: String(match.time || ""),
          pitch: String(match.pitch || ""),
          completed: matchIsResult(match)
        });
      }
    );
  });

  return fixtures.sort((first, second) => {
    const firstTime = new Date(first.time || "").getTime();
    const secondTime = new Date(second.time || "").getTime();

    const safeFirstTime = Number.isFinite(firstTime)
      ? firstTime
      : Number.MAX_SAFE_INTEGER;

    const safeSecondTime = Number.isFinite(secondTime)
      ? secondTime
      : Number.MAX_SAFE_INTEGER;

    if (safeFirstTime !== safeSecondTime) {
      return safeFirstTime - safeSecondTime;
    }

    if (first.groupKey !== second.groupKey) {
      return first.groupKey.localeCompare(second.groupKey);
    }

    return first.teamA.localeCompare(second.teamA);
  });
}

function encodePitchMapFixture(groupKey, matchId) {
  return encodeURIComponent(
    JSON.stringify({ groupKey, matchId })
  );
}

function decodePitchMapFixture(value) {
  if (!value) return null;

  try {
    const parsed = JSON.parse(
      decodeURIComponent(value)
    );

    const groupKey = String(
      parsed?.groupKey || ""
    ).trim();

    const matchId = String(
      parsed?.matchId || ""
    ).trim();

    return groupKey && matchId
      ? { groupKey, matchId }
      : null;
  } catch {
    return null;
  }
}

function pitchMapAssignmentMatches(
  assignment,
  groupKey,
  matchId
) {
  return Boolean(
    assignment &&
    assignment.groupKey === groupKey &&
    assignment.matchId === matchId
  );
}

function getPitchMapFixture(
  assignment
) {
  if (!assignment) return null;

  const match =
    matches?.[assignment.groupKey]?.[
      assignment.matchId
    ];

  if (!match) return null;

  return {
    ...match,
    groupKey: assignment.groupKey,
    matchId: assignment.matchId
  };
}

function getFixturePitchNumber(value) {
  const pitchNumber = Number(
    String(value || "").replace(
      /[^0-9]/g,
      ""
    )
  );

  return Number.isInteger(pitchNumber)
    ? pitchNumber
    : null;
}

function getLivePitchNumberForFixture(
  groupKey,
  matchId
) {
  const liveEntry = Object.entries(
    pitchMapAssignments || {}
  ).find(([, assignment]) => {
    return pitchMapAssignmentMatches(
      assignment,
      groupKey,
      matchId
    );
  });

  if (!liveEntry) return null;

  const pitchNumber = Number(liveEntry[0]);

  return Number.isInteger(pitchNumber)
    ? pitchNumber
    : null;
}

function getNextUnplayedFixtureForPitch(
  pitchNumber,
  completedGroupKey,
  completedMatchId
) {
  const completedMatch =
    matches?.[completedGroupKey]?.[
      completedMatchId
    ];

  const completedTimestamp =
    new Date(
      completedMatch?.time || ""
    ).getTime();

  const fixturesAssignedElsewhere =
    new Set(
      Object.entries(
        pitchMapAssignments || {}
      )
        .filter(
          ([savedPitch]) =>
            Number(savedPitch) !== pitchNumber
        )
        .map(([, assignment]) => {
          if (!assignment) return "";

          return (
            `${assignment.groupKey}:` +
            `${assignment.matchId}`
          );
        })
        .filter(Boolean)
    );

  const candidates =
    getAllPitchMapFixtures()
      .filter((fixture) => {
        const fixtureKey =
          `${fixture.groupKey}:` +
          `${fixture.matchId}`;

        return (
          getFixturePitchNumber(
            fixture.pitch
          ) === pitchNumber &&
          !fixture.completed &&
          !(
            fixture.groupKey ===
              completedGroupKey &&
            fixture.matchId ===
              completedMatchId
          ) &&
          !fixturesAssignedElsewhere.has(
            fixtureKey
          )
        );
      });

  if (candidates.length === 0) {
    return null;
  }

  if (
    Number.isFinite(completedTimestamp)
  ) {
    const laterFixture =
      candidates.find((fixture) => {
        const fixtureTimestamp =
          new Date(
            fixture.time || ""
          ).getTime();

        return (
          Number.isFinite(
            fixtureTimestamp
          ) &&
          fixtureTimestamp >
            completedTimestamp
        );
      });

    if (laterFixture) {
      return laterFixture;
    }
  }

  return candidates[0];
}

function advanceLivePitchAfterResult(
  groupKey,
  matchId
) {
  Object.entries(
    pitchMapAssignments || {}
  ).forEach(
    ([savedPitch, assignment]) => {
      if (
        !pitchMapAssignmentMatches(
          assignment,
          groupKey,
          matchId
        )
      ) {
        return;
      }

      const pitchNumber =
        Number(savedPitch);

      const nextFixture =
        getNextUnplayedFixtureForPitch(
          pitchNumber,
          groupKey,
          matchId
        );

      pitchMapAssignments[
        pitchNumber
      ] = nextFixture
        ? {
            groupKey:
              nextFixture.groupKey,
            matchId:
              nextFixture.matchId
          }
        : null;
    }
  );
}

function renderPitchMapAssignments() {
  const container = byId(
    "pitchMapAssignments"
  );

  if (!container) return;

  const fixtures = getAllPitchMapFixtures();

  const fixtureOptions = fixtures
    .map((fixture) => {
      const completedCopy = fixture.completed
        ? " · completed"
        : "";

      const scheduledPitch = fixture.pitch
        ? ` · ${fixture.pitch}`
        : "";

      return `
        <option
          value="${encodePitchMapFixture(
            fixture.groupKey,
            fixture.matchId
          )}"
        >
          Group ${escapeHtml(fixture.groupKey)}:
          ${escapeHtml(fixture.teamA)}
          vs
          ${escapeHtml(fixture.teamB)}
          ${scheduledPitch}
          ${completedCopy}
        </option>
      `;
    })
    .join("");

  container.innerHTML = `
    <div class="form-grid">
      ${Array.from({ length: 6 }, (_, index) => {
        const pitchNumber = index + 1;

        return `
          <div class="form-panel">
            <h3>Pitch ${pitchNumber}</h3>

            <div class="form-field">
              <label for="pitchMapSelect_${pitchNumber}">
                Match currently playing
              </label>

              <select id="pitchMapSelect_${pitchNumber}">
                <option value="">
                  No match currently
                </option>

                ${fixtureOptions}
              </select>
            </div>

            <button
              type="button"
              onclick="savePitchMapAssignment(${pitchNumber})"
            >
              Save Pitch ${pitchNumber}
            </button>
          </div>
        `;
      }).join("")}
    </div>
  `;

  for (
    let pitchNumber = 1;
    pitchNumber <= 6;
    pitchNumber += 1
  ) {
    const select = byId(
      `pitchMapSelect_${pitchNumber}`
    );

    const assignment =
      pitchMapAssignments[pitchNumber];

    if (!select || !assignment) continue;

    const encoded = encodePitchMapFixture(
      assignment.groupKey,
      assignment.matchId
    );

    const optionExists = [...select.options].some(
      (option) => option.value === encoded
    );

    if (optionExists) {
      select.value = encoded;
    }
  }
}

async function savePitchMapAssignment(
  pitchNumber
) {
  if (
    !Number.isInteger(pitchNumber) ||
    pitchNumber < 1 ||
    pitchNumber > 6
  ) {
    return;
  }

  const selection = decodePitchMapFixture(
    byId(`pitchMapSelect_${pitchNumber}`)?.value
  );

  if (selection) {
    const fixture = getPitchMapFixture(selection);

    if (!fixture) {
      alert(
        "That fixture could not be found. Refresh the page and choose it again."
      );
      return;
    }

    const duplicatePitch = Object.entries(
      pitchMapAssignments
    ).find(([savedPitch, assignment]) => {
      return (
        Number(savedPitch) !== pitchNumber &&
        pitchMapAssignmentMatches(
          assignment,
          selection.groupKey,
          selection.matchId
        )
      );
    });

    if (duplicatePitch) {
      alert(
        `That fixture is already displayed on Pitch ${duplicatePitch[0]}.`
      );
      return;
    }
  }

  const saved = await commitStateChange(() => {
    pitchMapAssignments[pitchNumber] =
      selection
        ? clone(selection)
        : null;
  });

  if (saved) {
    alert(
      selection
        ? `Pitch ${pitchNumber} updated.`
        : `Pitch ${pitchNumber} cleared.`
    );
  }
}

function clearDeletedPitchMapFixture(
  groupKey,
  matchId
) {
  Object.keys(pitchMapAssignments).forEach(
    (pitchNumber) => {
      const assignment =
        pitchMapAssignments[pitchNumber];

      if (
        pitchMapAssignmentMatches(
          assignment,
          groupKey,
          matchId
        )
      ) {
        pitchMapAssignments[pitchNumber] = null;
      }
    }
  );
}


/* ==================================================
   Official Group Fixtures
================================================== */

function renderOfficialFixtureLoader() {
  const button = byId("loadOfficialFixturesBtn");
  const status = byId("officialFixturesStatus");

  if (button) {
    button.disabled = officialFixturesLoaded;
    button.textContent = officialFixturesLoaded
      ? "Official Fixtures Loaded"
      : "Load Official Fixtures";
  }

  if (status) {
    status.textContent = officialFixturesLoaded
      ? "All 30 official fixtures are loaded. Every match can still be edited below."
      : "Loads the new 30-match, 20-team group schedule for Saturday 18 July 2026.";
  }
}

function getMissingOfficialFixtureTeams() {
  const missingTeams = [];

  Object.entries(OFFICIAL_GROUP_FIXTURES).forEach(
    ([groupKey, fixtures]) => {
      const availableNames = new Set(
        (groups[groupKey] || []).map((team) => team.name)
      );

      fixtures.forEach(([, , , teamA, teamB]) => {
        [teamA, teamB].forEach((teamName) => {
          if (!availableNames.has(teamName)) {
            missingTeams.push(`Group ${groupKey}: ${teamName}`);
          }
        });
      });
    }
  );

  return [...new Set(missingTeams)];
}

function resetTeamTableAdjustments() {
  getGroupKeys().forEach((groupKey) => {
    (groups[groupKey] || []).forEach((team) => {
      team.adjustments = {
        p: 0,
        w: 0,
        d: 0,
        l: 0,
        points: 0,
        gd: 0
      };
    });
  });
}

async function loadOfficialFixtures() {
  if (!requireAdmin()) return;

  const confirmed = confirm(
    "Load the new 30-match official group schedule?\n\nThis changes the tournament to 20 teams in Groups B-F, removes Group A and Manchester Youth, moves Sunderland into Group C and Real Punjab into Group F, replaces all group fixtures and scores, and clears standings adjustments, goalscorers, pitch assignments and both knockout setups."
  );

  if (!confirmed) return;

  const saved = await commitStateChange(() => {
    groups = defaultGroups();
    groupKeys = Object.keys(groups);

    matches = normalizeMatches(
      createOfficialMatches(),
      groupKeys
    );

    resetTeamTableAdjustments();

    pitchMapAssignments =
      normalizePitchMapAssignments({});

    knockoutSetup = {};
    knockoutResults = createEmptyKnockoutResults();

    bottomEightSetup = {};
    bottomEightResults =
      createEmptyBottomEightResults();

    topScorers = {};

    officialFixturesLoaded = true;
    officialFixturesVersion =
      OFFICIAL_FIXTURE_VERSION;

    currentGroup = "B";
  });

  if (saved) {
    alert(
      "The new 20-team, 30-match official schedule has been loaded. Every fixture remains fully editable in Group Matches."
    );
  }
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
    ? upcomingMatches
        .map(
          (match) =>
            renderPublicUpcomingMatch(
              match,
              selectedGroup
            )
        )
        .join("")
    : '<p class="empty-state">No upcoming matches yet.</p>';

  resultsElement.innerHTML = completedMatches.length
    ? completedMatches.map(renderPublicResult).join("")
    : '<p class="empty-state">No results yet.</p>';
}

function renderPublicUpcomingMatch(
  match,
  groupKey
) {
  const livePitchNumber =
    getLivePitchNumberForFixture(
      groupKey,
      match.id
    );

  const isLive =
    Number.isInteger(livePitchNumber) &&
    !matchIsResult(match);

  return `
    <article class="match-card ${isLive ? "is-live" : ""}">
      ${
        isLive
          ? `
            <div class="match-live-row">
              <span class="match-live-badge">
                Live
              </span>

              <span class="match-live-pitch">
                Pitch ${livePitchNumber}
              </span>
            </div>
          `
          : ""
      }

      <div class="match-title">
        ${escapeHtml(match.teamA)}
        <span class="match-versus">vs</span>
        ${escapeHtml(match.teamB)}
      </div>

      <div class="match-meta">
        ${escapeHtml(formatMatchTime(match.time))}
        · ${escapeHtml(formatPitchLabel(match.pitch))}
      </div>
    </article>
  `;
}

function renderPublicResult(match) {
  return `
    <article class="match-card is-complete">
      <div class="match-title">
        ${escapeHtml(match.teamA)}
        ${toNumber(match.scoreA)}–${toNumber(match.scoreB)}
        ${escapeHtml(match.teamB)}
      </div>
      <div class="match-meta">
        ${escapeHtml(formatMatchTime(match.time))}
        · ${escapeHtml(formatPitchLabel(match.pitch))}
      </div>
    </article>
  `;
}
function renderPublicPenaltyWinnerNote(result) {
  const isPenaltyWin =
    result?.scoreOne !== null &&
    result?.scoreTwo !== null &&
    result.scoreOne === result.scoreTwo &&
    result.winner;

  if (!isPenaltyWin) return "";

  const winner = getKnockoutDisplayTeam(
    result.winner
  );

  return `
    <div class="knockout-penalty-note">
      ${escapeHtml(winner.name)} won on penalties
    </div>
  `;
}

function renderPublicKnockoutTeamRow(
  reference,
  score,
  winnerReference,
  placeholder = "Team to be confirmed"
) {
  const team = getKnockoutDisplayTeam(
    reference,
    placeholder
  );
  const isWinner = teamReferencesMatch(
    reference,
    winnerReference
  );

  return `
    <div class="knockout-team-row ${
      isWinner ? "knockout-team-winner" : ""
    } ${reference ? "" : "knockout-team-placeholder"}">
      ${renderTeamName(team)}
      <span class="knockout-score">
        ${score === null ? "—" : score}
      </span>
    </div>
  `;
}

function renderPublicKnockoutMatch(
  roundKey,
  matchNumber,
  slotNumber = 1
) {
  const round = knockoutRoundConfig[roundKey];
  const teams = getKnockoutMatchTeams(
    roundKey,
    matchNumber
  );
  const result = getKnockoutResult(
    roundKey,
    matchNumber
  );

  return `
    <article
      class="knockout-match-card knockout-grid-slot-${slotNumber}"
      data-round="${escapeHtml(roundKey)}"
      data-match="${matchNumber}"
    >
      <div class="knockout-match-number">
        ${escapeHtml(round.shortLabel)} ${matchNumber}
      </div>

      ${renderPublicKnockoutTeamRow(
        teams.teamOne,
        result.scoreOne,
        result.winner,
        getKnockoutSlotPlaceholder(
          roundKey,
          matchNumber,
          "one"
        )
      )}

      ${renderPublicKnockoutTeamRow(
        teams.teamTwo,
        result.scoreTwo,
        result.winner,
        getKnockoutSlotPlaceholder(
          roundKey,
          matchNumber,
          "two"
        )
      )}

      ${renderPublicPenaltyWinnerNote(result)}
    </article>
  `;
}

function renderPublicKnockoutRound(
  roundKey,
  matchNumbers,
  extraClass = ""
) {
  const round = knockoutRoundConfig[roundKey];

  return `
    <section class="knockout-column ${extraClass}">
      <h3>${escapeHtml(round.label)}</h3>
      <div class="knockout-column-matches">
        ${matchNumbers
          .map((matchNumber, index) =>
            renderPublicKnockoutMatch(
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

function publicKnockoutConnectorClass(
  roundKey,
  matchNumber
) {
  return getKnockoutWinner(roundKey, matchNumber)
    ? "main-knockout-connector is-advanced"
    : "main-knockout-connector";
}

function renderPublicKnockoutConnectors() {
  return `
    <svg
      class="main-knockout-connectors"
      viewBox="0 0 1400 800"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path class="${publicKnockoutConnectorClass("roundOf16", 1)}"
        d="M176 100 H190 V200 H204" />
      <path class="${publicKnockoutConnectorClass("roundOf16", 2)}"
        d="M176 300 H190 V200 H204" />
      <path class="${publicKnockoutConnectorClass("roundOf16", 3)}"
        d="M176 500 H190 V600 H204" />
      <path class="${publicKnockoutConnectorClass("roundOf16", 4)}"
        d="M176 700 H190 V600 H204" />

      <path class="${publicKnockoutConnectorClass("quarterFinals", 1)}"
        d="M380 200 H394 V400 H408" />
      <path class="${publicKnockoutConnectorClass("quarterFinals", 2)}"
        d="M380 600 H394 V400 H408" />
      <path class="${publicKnockoutConnectorClass("semiFinals", 1)}"
        d="M584 400 H612" />

      <path class="${publicKnockoutConnectorClass("roundOf16", 5)}"
        d="M1224 100 H1210 V200 H1196" />
      <path class="${publicKnockoutConnectorClass("roundOf16", 6)}"
        d="M1224 300 H1210 V200 H1196" />
      <path class="${publicKnockoutConnectorClass("roundOf16", 7)}"
        d="M1224 500 H1210 V600 H1196" />
      <path class="${publicKnockoutConnectorClass("roundOf16", 8)}"
        d="M1224 700 H1210 V600 H1196" />

      <path class="${publicKnockoutConnectorClass("quarterFinals", 3)}"
        d="M1020 200 H1006 V400 H992" />
      <path class="${publicKnockoutConnectorClass("quarterFinals", 4)}"
        d="M1020 600 H1006 V400 H992" />
      <path class="${publicKnockoutConnectorClass("semiFinals", 2)}"
        d="M816 400 H788" />
    </svg>
  `;
}

function renderPublicKnockoutBracket() {
  const container = byId("publicKnockoutBracket");
  if (!container) return;

  container.innerHTML = `
    <div class="knockout-bracket main-knockout-bracket-modern">
      ${renderPublicKnockoutConnectors()}

      ${renderPublicKnockoutRound(
        "roundOf16",
        [1, 2, 3, 4],
        "main-round-roundOf16 main-side-left"
      )}

      ${renderPublicKnockoutRound(
        "quarterFinals",
        [1, 2],
        "main-round-quarterFinals main-side-left"
      )}

      ${renderPublicKnockoutRound(
        "semiFinals",
        [1],
        "main-round-semiFinals main-side-left"
      )}

      ${renderPublicKnockoutRound(
        "final",
        [1],
        "main-round-final knockout-final"
      )}

      ${renderPublicKnockoutRound(
        "semiFinals",
        [2],
        "main-round-semiFinals main-side-right"
      )}

      ${renderPublicKnockoutRound(
        "quarterFinals",
        [3, 4],
        "main-round-quarterFinals main-side-right"
      )}

      ${renderPublicKnockoutRound(
        "roundOf16",
        [5, 6, 7, 8],
        "main-round-roundOf16 main-side-right"
      )}
    </div>

    ${renderPublicTournamentLockup()}
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

      const teamOptions = (groups[groupKey] || [])
        .map((team) => {
          const teamName = team.name;

          return `
            <option
              value="${escapeHtml(teamName)}"
              ${teamName === match.teamA ? "data-selected-a=\"true\"" : ""}
              ${teamName === match.teamB ? "data-selected-b=\"true\"" : ""}
            >
              ${escapeHtml(teamName)}
            </option>
          `;
        })
        .join("");

      return `
        <article class="admin-match-card">
          <div class="match-title">
            ${escapeHtml(match.teamA)} vs ${escapeHtml(match.teamB)}
          </div>

          <div class="match-meta">
            ${escapeHtml(formatMatchTime(match.time))}
            · ${escapeHtml(formatPitchLabel(match.pitch))}
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

          <details class="match-edit-panel">
            <summary>Edit fixture</summary>

            <div class="match-edit-grid">
              <div class="form-field">
                <label for="editTeamA_${match.id}">
                  Team A
                </label>

                <select id="editTeamA_${match.id}">
                  ${teamOptions}
                </select>
              </div>

              <div class="form-field">
                <label for="editTeamB_${match.id}">
                  Team B
                </label>

                <select id="editTeamB_${match.id}">
                  ${teamOptions}
                </select>
              </div>

              <div class="form-field">
                <label for="editTime_${match.id}">
                  Date and time
                </label>

                <input
                  type="datetime-local"
                  id="editTime_${match.id}"
                  value="${escapeHtml(
                    toDateTimeLocalInputValue(match.time)
                  )}"
                >
              </div>

              <div class="form-field">
                <label for="editPitch_${match.id}">
                  Pitch
                </label>

                <input
                  type="text"
                  id="editPitch_${match.id}"
                  value="${escapeHtml(match.pitch || "")}"
                  placeholder="For example: 1"
                >
              </div>
            </div>

            <button
              type="button"
              onclick="saveMatchDetails(
                decodeURIComponent('${encodedGroupKey}'),
                decodeURIComponent('${encodedMatchId}')
              )"
            >
              Save Fixture Changes
            </button>
          </details>
        </article>
      `;
    })
    .join("");

  matchList.forEach((match) => {
    const teamASelect = byId(`editTeamA_${match.id}`);
    const teamBSelect = byId(`editTeamB_${match.id}`);

    if (teamASelect) teamASelect.value = match.teamA;
    if (teamBSelect) teamBSelect.value = match.teamB;
  });
}

function renderEverything() {
  refreshGroupInterface();
  renderAdminStandings();
  updateAdminTeamDropdowns();
  fillMatchTeamDropdowns();
  renderOfficialFixtureLoader();
  renderAdminMatches();
  renderPitchMapAssignments();
  renderAdminTopScorers();
  renderPublicGroup();
  renderPublicTopScorers();
  renderThirdPlaceTable();
  renderKnockoutSetup();
  renderBottomEightSetup();
  renderPublicKnockoutBracket();
  renderPublicBottomEightBracket();
  renderPublicPitchMap();
}

function updateKnockoutTeamName(
  groupKey,
  oldName,
  newName
) {
  [knockoutSetup, bottomEightSetup].forEach(
    (setup) => {
      Object.values(setup || {}).forEach(
        (match) => {
          ["teamOne", "teamTwo"].forEach((slot) => {
            const team = match?.[slot];

            if (
              team?.groupKey === groupKey &&
              team.teamName === oldName
            ) {
              team.teamName = newName;
            }
          });
        }
      );
    }
  );

  [
    [knockoutRoundConfig, knockoutResults],
    [bottomEightRoundConfig, bottomEightResults]
  ].forEach(([roundConfig, results]) => {
    Object.entries(roundConfig).forEach(
      ([roundKey, round]) => {
        for (
          let matchNumber = 1;
          matchNumber <= round.matchCount;
          matchNumber += 1
        ) {
          const winner =
            results?.[roundKey]?.[matchNumber]
              ?.winner;

          if (
            winner?.groupKey === groupKey &&
            winner.teamName === oldName
          ) {
            winner.teamName = newName;
          }
        }
      }
    );
  });
}

function teamIsInKnockoutSetup(groupKey, teamName) {
  return [knockoutSetup, bottomEightSetup].some(
    (setup) => {
      return Object.values(setup || {}).some((match) => {
        return [match?.teamOne, match?.teamTwo].some(
          (team) => {
            return (
              team?.groupKey === groupKey &&
              team.teamName === teamName
            );
          }
        );
      });
    }
  );
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

    updateKnockoutTeamName(currentGroup, oldName, newName);
    updateTopScorerTeamName(
      currentGroup,
      oldName,
      newName
    );
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

  if (teamIsInKnockoutSetup(currentGroup, selection.team.name)) {
    alert(
      "Replace this team in the saved knockout setup before removing it."
    );
    return;
  }

  if (
    teamHasTopScorers(
      currentGroup,
      selection.team.name
    )
  ) {
    alert(
      "Remove this team's goalscorers before removing the team."
    );
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

async function saveMatchDetails(groupKey, matchId) {
  const match = matches?.[groupKey]?.[matchId];
  if (!match) return;

  const teamA = byId(`editTeamA_${matchId}`)?.value || "";
  const teamB = byId(`editTeamB_${matchId}`)?.value || "";
  const localTime = byId(`editTime_${matchId}`)?.value || "";
  const pitch = byId(`editPitch_${matchId}`)?.value.trim() || "";

  if (!teamA || !teamB) {
    alert("Choose both teams.");
    return;
  }

  if (teamA === teamB) {
    alert("A team cannot play itself.");
    return;
  }

  const availableNames = new Set(
    (groups[groupKey] || []).map((team) => team.name)
  );

  if (!availableNames.has(teamA) || !availableNames.has(teamB)) {
    alert("Choose teams from the selected group.");
    return;
  }

  const time = localTime
    ? new Date(localTime).toISOString()
    : "";

  const saved = await commitStateChange(() => {
    matches[groupKey][matchId].teamA = teamA;
    matches[groupKey][matchId].teamB = teamB;
    matches[groupKey][matchId].time = time;
    matches[groupKey][matchId].pitch = pitch;
  });

  if (saved) {
    alert("Fixture updated.");
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

    advanceLivePitchAfterResult(
      groupKey,
      matchId
    );
  });
}

async function deleteMatch(groupKey, matchId) {
  if (!matches[groupKey]?.[matchId]) return;
  if (!confirm("Delete this match?")) return;

  await commitStateChange(() => {
    delete matches[groupKey][matchId];
    clearDeletedPitchMapFixture(
      groupKey,
      matchId
    );
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
    knockoutSetup = {};
    knockoutResults = createEmptyKnockoutResults();
    bottomEightSetup = {};
    bottomEightResults = createEmptyBottomEightResults();
    topScorers = {};
    pitchMapAssignments =
      normalizePitchMapAssignments({});
    officialFixturesLoaded = false;
    officialFixturesVersion = "";
    currentGroup = groupKeys[0] || "";
  });
}


/* ==================================================
   One-Time Team Logo Sync
================================================== */

let teamLogoSyncRunning = false;

async function syncAvailableTeamLogosToFirebase() {
  if (
    teamLogoSyncRunning ||
    !databaseIsReady() ||
    !adminIsAuthenticated()
  ) {
    return;
  }

  teamLogoSyncRunning = true;

  try {
    const snapshot = await window.db
      .ref("tournament/groups")
      .once("value");

    const rawGroups = snapshot.val();

    if (
      !rawGroups ||
      typeof rawGroups !== "object"
    ) {
      return;
    }

    const updates = {};

    Object.entries(rawGroups).forEach(
      ([groupKey, rawGroup]) => {
        if (
          !rawGroup ||
          typeof rawGroup !== "object"
        ) {
          return;
        }

        Object.entries(rawGroup).forEach(
          ([teamKey, rawTeam]) => {
            const teamName = String(
              rawTeam?.name || ""
            ).trim();

            const savedLogo = String(
              rawTeam?.logo || ""
            ).trim();

            const defaultLogo =
              getDefaultTeamLogo(teamName);

            if (defaultLogo && !savedLogo) {
              updates[
                `tournament/groups/${groupKey}/${teamKey}/logo`
              ] = defaultLogo;
            }
          }
        );
      }
    );

    if (Object.keys(updates).length > 0) {
      await window.db.ref().update(updates);

      console.info(
        `Added ${Object.keys(updates).length} available team logos.`
      );
    }
  } catch (error) {
    console.error(
      "The available team logos could not be synced.",
      error
    );
  } finally {
    teamLogoSyncRunning = false;
  }
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

      /*
        Fill any currently blank Firebase logo fields with the
        available default paths. Existing custom logos are never
        overwritten.
      */
      syncAvailableTeamLogosToFirebase();
      persistTournamentMigrationIfNeeded();
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
   Venue Display Controls
================================================== */

const VENUE_DISPLAY_ROTATIONS = {
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

const VENUE_ROTATION_INTERVAL_MS = 15000;

let currentVenueDisplaySettings = {
  mode: "groups",
  rotationMode: "off",
  rotationStartedAt: 0,
  rotationIntervalMs:
    VENUE_ROTATION_INTERVAL_MS
};

let venueRotationStatusTimer = null;

function normalizeVenueDisplayMode(value) {
  if (value === "fixtures") return "fixtures";
  if (value === "pitchMap") return "pitchMap";
  if (value === "knockout") return "knockout";
  if (value === "plate") return "plate";

  return "groups";
}

function normalizeVenueRotationMode(value) {
  if (value === "groupStage") {
    return "groupStage";
  }

  if (value === "knockout") {
    return "knockout";
  }

  return "off";
}

function getVenueRotationOrder(rotationMode) {
  return (
    VENUE_DISPLAY_ROTATIONS[
      normalizeVenueRotationMode(
        rotationMode
      )
    ] || []
  );
}

function normalizeVenueDisplaySettings(rawSettings) {
  const settings =
    rawSettings &&
    typeof rawSettings === "object"
      ? rawSettings
      : {};

  return {
    mode: normalizeVenueDisplayMode(
      settings.mode
    ),

    rotationMode:
      normalizeVenueRotationMode(
        settings.rotationMode
      ),

    rotationStartedAt:
      Number(settings.rotationStartedAt) || 0,

    rotationIntervalMs:
      VENUE_ROTATION_INTERVAL_MS
  };
}

function getVenueRotatingMode(
  settings = currentVenueDisplaySettings,
  now = Date.now()
) {
  const normalized =
    normalizeVenueDisplaySettings(settings);

  const rotationOrder =
    getVenueRotationOrder(
      normalized.rotationMode
    );

  if (
    rotationOrder.length === 0 ||
    normalized.rotationStartedAt <= 0
  ) {
    return normalized.mode;
  }

  const elapsed = Math.max(
    0,
    now - normalized.rotationStartedAt
  );

  const rotationIndex =
    Math.floor(
      elapsed /
      normalized.rotationIntervalMs
    ) %
    rotationOrder.length;

  return rotationOrder[rotationIndex];
}

function getVenueDisplayModeCopy(mode) {
  const normalizedMode =
    normalizeVenueDisplayMode(mode);

  if (normalizedMode === "fixtures") {
    return {
      label: "Group Fixtures",
      changing:
        "Changing display to Group Fixtures…"
    };
  }

  if (normalizedMode === "pitchMap") {
    return {
      label: "Live Pitch Map",
      changing:
        "Changing display to Live Pitch Map…"
    };
  }

  if (normalizedMode === "knockout") {
    return {
      label: "Main Knockout",
      changing:
        "Changing display to Main Knockout…"
    };
  }

  if (normalizedMode === "plate") {
    return {
      label: "NEST Plate Championship",
      changing:
        "Changing display to NEST Plate Championship…"
    };
  }

  return {
    label: "Group Tables",
    changing:
      "Changing display to Group Tables…"
  };
}

function getVenueRotationCopy(rotationMode) {
  const normalizedMode =
    normalizeVenueRotationMode(
      rotationMode
    );

  if (normalizedMode === "knockout") {
    return {
      label: "Knockout rotation",
      sequence:
        "Main Knockout → NEST Plate",
      starting:
        "Starting the 15-second knockout rotation…",
      firstMode: "knockout"
    };
  }

  return {
    label: "Group-stage rotation",
    sequence:
      "Group Tables → Pitch Map → Fixtures",
    starting:
      "Starting the 15-second group-stage rotation…",
    firstMode: "groups"
  };
}

function renderVenueDisplayMode(
  settings = currentVenueDisplaySettings
) {
  const normalizedSettings =
    normalizeVenueDisplaySettings(settings);

  currentVenueDisplaySettings =
    normalizedSettings;

  const effectiveMode =
    getVenueRotatingMode(
      normalizedSettings
    );

  const rotationMode =
    normalizedSettings.rotationMode;

  const rotationIsActive =
    rotationMode !== "off";

  const groupsButton =
    byId("showGroupsDisplayBtn");

  const fixturesButton =
    byId("showFixturesDisplayBtn");

  const pitchMapButton =
    byId("showPitchMapDisplayBtn");

  const knockoutButton =
    byId("showKnockoutDisplayBtn");

  const plateButton =
    byId("showPlateDisplayBtn");

  const startGroupRotationButton =
    byId("startGroupRotationBtn");

  const startKnockoutRotationButton =
    byId("startKnockoutRotationBtn");

  const stopRotationButton =
    byId("stopDisplayRotationBtn");

  const status =
    byId("displayModeStatus");

  const buttonModes = [
    [groupsButton, "groups"],
    [fixturesButton, "fixtures"],
    [pitchMapButton, "pitchMap"],
    [knockoutButton, "knockout"],
    [plateButton, "plate"]
  ];

  buttonModes.forEach(
    ([button, buttonMode]) => {
      if (!button) return;

      const isShowing =
        !rotationIsActive &&
        effectiveMode === buttonMode;

      button.disabled = isShowing;

      button.setAttribute(
        "aria-pressed",
        String(isShowing)
      );
    }
  );

  if (startGroupRotationButton) {
    const groupRotationIsActive =
      rotationMode === "groupStage";

    startGroupRotationButton.disabled =
      groupRotationIsActive;

    startGroupRotationButton.setAttribute(
      "aria-pressed",
      String(groupRotationIsActive)
    );
  }

  if (startKnockoutRotationButton) {
    const knockoutRotationIsActive =
      rotationMode === "knockout";

    startKnockoutRotationButton.disabled =
      knockoutRotationIsActive;

    startKnockoutRotationButton.setAttribute(
      "aria-pressed",
      String(knockoutRotationIsActive)
    );
  }

  if (stopRotationButton) {
    stopRotationButton.disabled =
      !rotationIsActive;
  }

  if (!status) return;

  if (rotationIsActive) {
    const rotationCopy =
      getVenueRotationCopy(
        rotationMode
      );

    status.textContent =
      `${rotationCopy.label} active: ${rotationCopy.sequence} · 15 seconds each · Currently showing ${
        getVenueDisplayModeCopy(
          effectiveMode
        ).label
      }`;
  } else {
    status.textContent =
      `Current display: ${
        getVenueDisplayModeCopy(
          effectiveMode
        ).label
      }`;
  }
}

async function setVenueDisplayMode(mode) {
  const normalizedMode =
    normalizeVenueDisplayMode(mode);

  if (!requireAdmin()) return;

  if (!databaseIsReady()) {
    alert(
      "The database is not connected yet. Try again in a moment."
    );

    return;
  }

  const status =
    byId("displayModeStatus");

  if (status) {
    status.textContent =
      getVenueDisplayModeCopy(
        normalizedMode
      ).changing;
  }

  try {
    await window.db
      .ref("tournament/displaySettings")
      .update({
        mode: normalizedMode,
        rotationMode: "off",
        rotationStartedAt: null,
        rotationIntervalMs:
          VENUE_ROTATION_INTERVAL_MS
      });
  } catch (error) {
    console.error(
      "The venue display mode could not be changed.",
      error
    );

    alert(
      `The venue display could not be changed: ${error.message}`
    );
  }
}

async function startVenueDisplayRotation(
  rotationMode
) {
  const normalizedRotationMode =
    normalizeVenueRotationMode(
      rotationMode
    );

  if (
    normalizedRotationMode === "off"
  ) {
    return;
  }

  if (!requireAdmin()) return;

  if (!databaseIsReady()) {
    alert(
      "The database is not connected yet. Try again in a moment."
    );

    return;
  }

  const rotationCopy =
    getVenueRotationCopy(
      normalizedRotationMode
    );

  const status =
    byId("displayModeStatus");

  if (status) {
    status.textContent =
      rotationCopy.starting;
  }

  try {
    await window.db
      .ref("tournament/displaySettings")
      .update({
        mode: rotationCopy.firstMode,
        rotationMode:
          normalizedRotationMode,
        rotationStartedAt:
          firebase.database.ServerValue.TIMESTAMP,
        rotationIntervalMs:
          VENUE_ROTATION_INTERVAL_MS
      });
  } catch (error) {
    console.error(
      "The venue display rotation could not be started.",
      error
    );

    alert(
      `The display rotation could not be started: ${error.message}`
    );
  }
}

async function stopVenueDisplayRotation() {
  if (!requireAdmin()) return;

  if (!databaseIsReady()) {
    alert(
      "The database is not connected yet. Try again in a moment."
    );

    return;
  }

  const currentMode =
    getVenueRotatingMode(
      currentVenueDisplaySettings
    );

  const status =
    byId("displayModeStatus");

  if (status) {
    status.textContent =
      "Stopping the display rotation…";
  }

  try {
    await window.db
      .ref("tournament/displaySettings")
      .update({
        mode: currentMode,
        rotationMode: "off",
        rotationStartedAt: null,
        rotationIntervalMs:
          VENUE_ROTATION_INTERVAL_MS
      });
  } catch (error) {
    console.error(
      "The venue display rotation could not be stopped.",
      error
    );

    alert(
      `The display rotation could not be stopped: ${error.message}`
    );
  }
}

function startVenueDisplayControls() {
  const groupsButton =
    byId("showGroupsDisplayBtn");

  const fixturesButton =
    byId("showFixturesDisplayBtn");

  const pitchMapButton =
    byId("showPitchMapDisplayBtn");

  const knockoutButton =
    byId("showKnockoutDisplayBtn");

  const plateButton =
    byId("showPlateDisplayBtn");

  const startGroupRotationButton =
    byId("startGroupRotationBtn");

  const startKnockoutRotationButton =
    byId("startKnockoutRotationBtn");

  const stopRotationButton =
    byId("stopDisplayRotationBtn");

  const status =
    byId("displayModeStatus");

  if (
    !groupsButton &&
    !fixturesButton &&
    !pitchMapButton &&
    !knockoutButton &&
    !plateButton &&
    !startGroupRotationButton &&
    !startKnockoutRotationButton &&
    !stopRotationButton &&
    !status
  ) {
    return;
  }

  if (groupsButton) {
    groupsButton.addEventListener(
      "click",
      () => {
        setVenueDisplayMode("groups");
      }
    );
  }

  if (fixturesButton) {
    fixturesButton.addEventListener(
      "click",
      () => {
        setVenueDisplayMode("fixtures");
      }
    );
  }

  if (pitchMapButton) {
    pitchMapButton.addEventListener(
      "click",
      () => {
        setVenueDisplayMode("pitchMap");
      }
    );
  }

  if (knockoutButton) {
    knockoutButton.addEventListener(
      "click",
      () => {
        setVenueDisplayMode("knockout");
      }
    );
  }

  if (plateButton) {
    plateButton.addEventListener(
      "click",
      () => {
        setVenueDisplayMode("plate");
      }
    );
  }

  if (startGroupRotationButton) {
    startGroupRotationButton.addEventListener(
      "click",
      () => {
        startVenueDisplayRotation(
          "groupStage"
        );
      }
    );
  }

  if (startKnockoutRotationButton) {
    startKnockoutRotationButton.addEventListener(
      "click",
      () => {
        startVenueDisplayRotation(
          "knockout"
        );
      }
    );
  }

  if (stopRotationButton) {
    stopRotationButton.addEventListener(
      "click",
      stopVenueDisplayRotation
    );
  }

  if (venueRotationStatusTimer) {
    clearInterval(
      venueRotationStatusTimer
    );
  }

  venueRotationStatusTimer =
    setInterval(() => {
      if (
        currentVenueDisplaySettings
          .rotationMode !== "off"
      ) {
        renderVenueDisplayMode(
          currentVenueDisplaySettings
        );
      }
    }, 1000);

  if (!databaseIsReady()) {
    if (status) {
      status.textContent =
        "Waiting for the display connection…";
    }

    return;
  }

  window.db
    .ref("tournament/displaySettings")
    .on(
      "value",
      (snapshot) => {
        renderVenueDisplayMode(
          snapshot.val() || {}
        );
      },
      (error) => {
        console.error(
          "The venue display setting could not be loaded.",
          error
        );

        if (status) {
          status.textContent =
            "Display setting could not be loaded.";
        }
      }
    );
}

document.addEventListener(
  "DOMContentLoaded",
  startVenueDisplayControls
);
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
window.loadOfficialFixtures = loadOfficialFixtures;
window.saveMatchDetails = saveMatchDetails;
window.saveMatchScore = saveMatchScore;
window.deleteMatch = deleteMatch;
window.autoFillKnockoutSetup = autoFillKnockoutSetup;
window.saveKnockoutMatchResult = saveKnockoutMatchResult;
window.clearKnockoutMatchResult = clearKnockoutMatchResult;
window.autoFillBottomEightSetup = autoFillBottomEightSetup;
window.saveBottomEightSetup = saveBottomEightSetup;
window.saveBottomEightMatchResult = saveBottomEightMatchResult;
window.clearBottomEightMatchResult = clearBottomEightMatchResult;
window.addTopScorer = addTopScorer;
window.changeTopScorerGoals = changeTopScorerGoals;
window.setTopScorerGoals = setTopScorerGoals;
window.removeTopScorer = removeTopScorer;
window.savePitchMapAssignment = savePitchMapAssignment;
window.undoLastAction = undoLastAction;
window.resetTournament = resetTournament;
window.saveKnockoutSetup = saveKnockoutSetup;
window.adminLogin = adminLogin;
window.adminLogout = adminLogout;
window.renderPublicGroup = renderPublicGroup;
window.syncAvailableTeamLogosToFirebase =
  syncAvailableTeamLogosToFirebase;
