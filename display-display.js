/* ==================================================
   NEST PLATE CHAMPIONSHIP â€” LIVE VENUE DISPLAY

   Dedicated display page for the eight-team Plate
   competition. It reads the Bottom 8 setup and results
   from Firebase but uses only public-facing NEST Plate
   Championship wording.
================================================== */

/* ==================================================
   Branding and Sponsors
================================================== */

const PLATE_DISPLAY_SPONSORS = [
  {
    name: "Ladhar Investments",
    logo: "assets/sponsors/ladhar-investments.png"
  }
];

const PLATE_TOURNAMENT_BRAND = {
  name: "Sikh Tournament",
  logo: "logos/tournament-logo.png"
};

const PLATE_MAIN_SPONSOR = {
  name: "Ladhar Investments",
  label: "Main Sponsor",
  subtitle: "North East",
  logo: "assets/sponsors/ladhar-investments.png"
};

const PLATE_TEAM_LOGOS = {
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
   Local State
================================================== */

let plateGroups = {};
let plateGroupKeys = [];
let plateSetup = {};
let plateResults = {};

/* ==================================================
   General Helpers
================================================== */

function plateById(id) {
  return document.getElementById(id);
}

function escapePlateHtml(value) {
  return String(value ?? "").replace(
    /[&<>'"]/g,
    (character) => {
      const entities = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        "'": "&#39;",
        '"': "&quot;"
      };

      return entities[character];
    }
  );
}

function plateToNumber(value, fallback = 0) {
  const number = Number(value);

  return Number.isFinite(number)
    ? number
    : fallback;
}

function plateToArray(value) {
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

function getPlateFallbackLogo(teamName) {
  const normalizedName = String(teamName || "")
    .trim()
    .toLowerCase();

  return PLATE_TEAM_LOGOS[normalizedName] || "";
}

function normalizePlateTeam(rawTeam) {
  const name = String(
    rawTeam?.name || "Team TBC"
  ).trim();

  return {
    name,
    logo: String(
      rawTeam?.logo ||
      getPlateFallbackLogo(name) ||
      ""
    ).trim()
  };
}

function normalizePlateGroupKeys(
  rawKeys,
  rawGroups
) {
  const keys = new Set();

  if (Array.isArray(rawKeys)) {
    rawKeys.forEach((key) => {
      if (key) keys.add(String(key));
    });
  } else if (
    rawKeys &&
    typeof rawKeys === "object"
  ) {
    Object.keys(rawKeys).forEach((key) => {
      if (rawKeys[key]) keys.add(String(key));
    });
  }

  if (
    rawGroups &&
    typeof rawGroups === "object"
  ) {
    Object.keys(rawGroups).forEach((key) => {
      keys.add(String(key));
    });
  }

  return [...keys].sort((first, second) =>
    first.localeCompare(second)
  );
}

function normalizePlateGroups(
  rawGroups,
  groupKeys
) {
  const groups = {};

  groupKeys.forEach((groupKey) => {
    groups[groupKey] = plateToArray(
      rawGroups?.[groupKey]
    ).map(normalizePlateTeam);
  });

  return groups;
}

function normalizePlateReference(reference) {
  if (
    !reference ||
    typeof reference !== "object"
  ) {
    return null;
  }

  const teamName = String(
    reference.teamName || ""
  ).trim();

  const groupKey = String(
    reference.groupKey || ""
  ).trim();

  if (!teamName) return null;

  return {
    teamName,
    groupKey
  };
}

function plateReferencesMatch(first, second) {
  return Boolean(
    first &&
    second &&
    first.groupKey === second.groupKey &&
    first.teamName === second.teamName
  );
}

function renderPlateImage(
  path,
  className,
  altText = ""
) {
  if (!path) return "";

  return `
    <img
      class="${escapePlateHtml(className)}"
      src="${escapePlateHtml(path)}"
      alt="${escapePlateHtml(altText)}"
      onerror="this.hidden=true"
    >
  `;
}

/* ==================================================
   Sponsor Rendering
================================================== */

function getExpandedPlateSponsors() {
  const validSponsors =
    PLATE_DISPLAY_SPONSORS.filter(
      (sponsor) => sponsor?.name
    );

  if (validSponsors.length === 0) {
    return [
      {
        name: "Tournament Sponsor",
        logo: ""
      }
    ];
  }

  const expanded = [];

  while (expanded.length < 6) {
    expanded.push(
      ...validSponsors.map(
        (sponsor) => ({ ...sponsor })
      )
    );
  }

  return expanded.slice(
    0,
    Math.max(6, validSponsors.length)
  );
}

function renderPlateSponsorTickerGroup(
  sponsors
) {
  return `
    <div class="sponsor-ticker-group">
      ${sponsors
        .map(
          (sponsor) => `
            <div class="sponsor-ticker-item">
              ${renderPlateImage(
                sponsor.logo,
                "sponsor-ticker-logo",
                sponsor.name
              )}

              <span class="sponsor-ticker-name">
                ${escapePlateHtml(sponsor.name)}
              </span>
            </div>
          `
        )
        .join("")}
    </div>
  `;
}

function renderPlateSponsorTicker() {
  const track = plateById(
    "sponsorTickerTrack"
  );

  if (!track) return;

  const sponsors = getExpandedPlateSponsors();
  const group =
    renderPlateSponsorTickerGroup(sponsors);

  track.innerHTML = group + group;
}

function renderPlateMainSponsor() {
  const container = plateById(
    "plateMainSponsor"
  );

  if (!container) return;

  container.innerHTML = `
    <div class="display-brand-lockup">
      <div class="tournament-brand-block">
        ${renderPlateImage(
          PLATE_TOURNAMENT_BRAND.logo,
          "tournament-brand-logo",
          PLATE_TOURNAMENT_BRAND.name
        )}

        <div class="tournament-brand-copy">
          <span class="display-brand-eyebrow">
            Tournament
          </span>

          <span class="tournament-brand-name">
            ${escapePlateHtml(
              PLATE_TOURNAMENT_BRAND.name
            )}
          </span>
        </div>
      </div>

      <div
        class="display-brand-divider"
        aria-hidden="true"
      ></div>

      <div class="main-sponsor-block">
        ${renderPlateImage(
          PLATE_MAIN_SPONSOR.logo,
          "main-sponsor-logo",
          PLATE_MAIN_SPONSOR.name
        )}

        <div class="main-sponsor-copy">
          <span class="display-brand-eyebrow">
            ${escapePlateHtml(
              PLATE_MAIN_SPONSOR.label
            )}
          </span>

          <span class="main-sponsor-name">
            ${escapePlateHtml(
              PLATE_MAIN_SPONSOR.name
            )}
          </span>

          <span class="main-sponsor-subtitle">
            ${escapePlateHtml(
              PLATE_MAIN_SPONSOR.subtitle
            )}
          </span>
        </div>
      </div>
    </div>
  `;
}

/* ==================================================
   Plate Bracket Logic
================================================== */

function getPlateResult(
  roundKey,
  matchNumber
) {
  const result =
    plateResults?.[roundKey]?.[matchNumber];

  return {
    scoreOne:
      result?.scoreOne === null ||
      result?.scoreOne === undefined
        ? null
        : plateToNumber(
            result.scoreOne,
            null
          ),

    scoreTwo:
      result?.scoreTwo === null ||
      result?.scoreTwo === undefined
        ? null
        : plateToNumber(
            result.scoreTwo,
            null
          ),

    winner: normalizePlateReference(
      result?.winner
    )
  };
}

function getPlateWinner(
  roundKey,
  matchNumber
) {
  return getPlateResult(
    roundKey,
    matchNumber
  ).winner;
}

function getPlateMatchTeams(
  roundKey,
  matchNumber
) {
  if (roundKey === "quarterFinals") {
    const setupMatch =
      plateSetup?.[matchNumber];

    return {
      teamOne: normalizePlateReference(
        setupMatch?.teamOne
      ),

      teamTwo: normalizePlateReference(
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
    teamOne: getPlateWinner(
      previousRound,
      matchNumber * 2 - 1
    ),

    teamTwo: getPlateWinner(
      previousRound,
      matchNumber * 2
    )
  };
}

function findPlateTeam(reference) {
  if (!reference) return null;

  const team = (
    plateGroups[reference.groupKey] || []
  ).find(
    (candidate) =>
      candidate.name === reference.teamName
  );

  return {
    name: reference.teamName,
    groupKey: reference.groupKey,
    logo:
      team?.logo ||
      getPlateFallbackLogo(
        reference.teamName
      ) ||
      ""
  };
}

function plateSetupIsComplete() {
  for (
    let matchNumber = 1;
    matchNumber <= 4;
    matchNumber += 1
  ) {
    const setupMatch =
      plateSetup?.[matchNumber];

    if (
      !setupMatch?.teamOne ||
      !setupMatch?.teamTwo
    ) {
      return false;
    }
  }

  return true;
}

function renderPlateBracketTeam(
  reference,
  score,
  winner
) {
  const team = findPlateTeam(reference);

  const isWinner = plateReferencesMatch(
    reference,
    winner
  );

  if (!team) {
    return `
      <div class="display-bracket-team">
        <span
          class="
            display-bracket-team-name
            display-bracket-placeholder
          "
        >
          Team TBC
        </span>

        <span class="display-bracket-score">
          â€”
        </span>
      </div>
    `;
  }

  return `
    <div
      class="
        display-bracket-team
        ${isWinner ? "is-winner" : ""}
      "
    >
      ${renderPlateImage(
        team.logo,
        "display-bracket-team-logo",
        `${team.name} logo`
      )}

      <span class="display-bracket-team-name">
        ${escapePlateHtml(team.name)}
      </span>

      <span class="display-bracket-score">
        ${
          score === null
            ? "â€”"
            : escapePlateHtml(score)
        }
      </span>
    </div>
  `;
}

function renderPlateBracketMatch(
  roundKey,
  matchNumber
) {
  const round = PLATE_ROUNDS[roundKey];

  const teams = getPlateMatchTeams(
    roundKey,
    matchNumber
  );

  const result = getPlateResult(
    roundKey,
    matchNumber
  );

  return `
    <article class="display-bracket-match">
      <div class="display-bracket-match-label">
        ${escapePlateHtml(round.shortLabel)}
        ${matchNumber}
      </div>

      ${renderPlateBracketTeam(
        teams.teamOne,
        result.scoreOne,
        result.winner
      )}

      ${renderPlateBracketTeam(
        teams.teamTwo,
        result.scoreTwo,
        result.winner
      )}
    </article>
  `;
}

function renderPlateBracketColumn(
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
        ${escapePlateHtml(round.label)}
      </h2>

      ${matchNumbers
        .map((matchNumber) =>
          renderPlateBracketMatch(
            roundKey,
            matchNumber
          )
        )
        .join("")}
    </section>
  `;
}

function renderPlateBracket() {
  const bracket = plateById(
    "plateDisplayBracket"
  );

  if (!bracket) return;

  if (!plateSetupIsComplete()) {
    bracket.innerHTML = `
      <p class="display-loading">
        NEST Plate Championship matches
        have not been confirmed yet.
      </p>
    `;
    return;
  }

  bracket.innerHTML = `
    ${renderPlateBracketColumn(
      "quarterFinals",
      [1, 2],
      "plate-quarter-final-column"
    )}

    ${renderPlateBracketColumn(
      "semiFinals",
      [1],
      "plate-semi-final-column"
    )}

    ${renderPlateBracketColumn(
      "final",
      [1],
      "display-final-column plate-final-column"
    )}

    ${renderPlateBracketColumn(
      "semiFinals",
      [2],
      "plate-semi-final-column"
    )}

    ${renderPlateBracketColumn(
      "quarterFinals",
      [3, 4],
      "plate-quarter-final-column"
    )}
  `;
}

/* ==================================================
   Firebase
================================================== */

function plateDatabaseIsReady() {
  return Boolean(
    window.db &&
    typeof window.db.ref === "function"
  );
}

function listenToPlateTournament() {
  if (!plateDatabaseIsReady()) return;

  window.db.ref("tournament").on(
    "value",
    (snapshot) => {
      const data = snapshot.val() || {};

      plateGroupKeys =
        normalizePlateGroupKeys(
          data.groupKeys,
          data.groups
        );

      plateGroups = normalizePlateGroups(
        data.groups,
        plateGroupKeys
      );

      plateSetup =
        data.bottomEightSetup &&
        typeof data.bottomEightSetup === "object"
          ? data.bottomEightSetup
          : {};

      plateResults =
        data.bottomEightResults &&
        typeof data.bottomEightResults === "object"
          ? data.bottomEightResults
          : {};

      renderPlateBracket();
    },
    (error) => {
      console.error(
        "The NEST Plate display could not load tournament data.",
        error
      );

      const loading = document.querySelectorAll(
        ".display-loading"
      );

      loading.forEach((element) => {
        element.textContent =
          "Tournament data could not be loaded.";
      });
    }
  );
}

function listenToPlateConnection() {
  if (!plateDatabaseIsReady()) return;

  window.db.ref(".info/connected").on(
    "value",
    (snapshot) => {
      const isConnected = Boolean(
        snapshot.val()
      );

      const dot = plateById(
        "displayLiveDot"
      );

      const text = plateById(
        "displayLiveText"
      );

      if (dot) {
        dot.classList.toggle(
          "is-live",
          isConnected
        );
      }

      if (text) {
        text.textContent = isConnected
          ? "Live"
          : "Disconnected";
      }
    }
  );
}

/* ==================================================
   Start
================================================== */

document.addEventListener(
  "DOMContentLoaded",
  () => {
    renderPlateSponsorTicker();
    renderPlateMainSponsor();
    listenToPlateTournament();
    listenToPlateConnection();
  }
);
