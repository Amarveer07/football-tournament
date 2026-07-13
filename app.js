/**********************
  SHARED DATA
**********************/
function defaultGroups() {
  return {
    A: [
      { name: "Lions", p: 0, w: 0, d: 0, l: 0, points: 0, gd: 0 },
      { name: "Tigers", p: 0, w: 0, d: 0, l: 0, points: 0, gd: 0 }
    ],
    B: [Sat, Jan 17 at 6:26 PM
Sat, Jan 17 at 9:54 PM
im confused how to do step 2, I've attached an image of what I can see
Sun, Jan 18 at 5:48 PM
Sun, Jan 18 at 9:09 PM
Tue, Jan 20 at 4:44 PM
Tue, Jan 20 at 7:04 PM
Tue, Jan 20 at 11:27 PM
Wed, Jun 17 at 4:52 PM
Thursday 11:13 PM
Memory updated
Thought for a couple of seconds
Yes — what you want is definitely achievable.
In fact, you’re already much closer than you probably think.

Your current setup already has the key ingredients for 100s of users:

GitHub Pages can serve the public website to lots of people.
Firebase Realtime Database can share updates across devices.
Firebase Auth protects admin editing.
Your public/admin split is a good structure.
Your data is separate from the design, which makes it easier for a designer to restyle.
The main thing we’d need to do is professionalise the project structure so a web designer can work on the look without touching the core logic.
A better final setup would look like:

/public
  index.html
  public.css

/admin
  admin.html
  admin.css

/js
  app.js
  firebase-init.js

/assets
  logos, images, icons
That way:
the designer can mostly work in CSS and HTML
the Firebase/database logic stays separate
your admin tools stay protected
the public page can be redesigned without breaking the system
Changing the domain is also very possible. You can either:
buy/use a custom domain and connect it to GitHub Pages
or move the site to Netlify/Vercel, which can be even easier for custom domains
For 100s of users, Firebase + GitHub Pages is fine. We’d only start worrying if you had thousands of live users constantly refreshing or writing data.
The biggest next priorities would be:

Clean the file structure.
Remove old/unused code.
Make the public page designer-friendly.
Check Firebase security rules.
Add a custom domain.
Stress-test the public view on phone/laptop.
So yes: realistic, achievable, and actually a good use of what you’ve already built.
Today 10:50 PM
give me an update of my current to do list and keep it brief, all im no longer giving it to a web designer so we will need to do all the aesthetic stuff
Here's the current roadmap I'd work through, in order:
🔴 High Priority
✅ Finish dynamic groups (add/remove groups and make sure every part of the site supports unlimited groups).
🏆 Design and build the knockout stage once you know the tournament format.
🟡 Medium Priority
🎨 Completely redesign the public website so it looks like a professional football tournament website (this is now your responsibility instead of a web designer).
🎨 Improve branding (logo, colours, typography, icons, backgrounds, animations).
📱 Make the public site look excellent on mobile (admin can stay desktop-focused).
🟢 Nice-to-have Features
✨ Animated live score updates.
📅 Better fixtures page with filtering by group.
🥇 Top scorer / Golden Boot table.
🟨🟥 Discipline table (yellow/red cards).
📊 Tournament statistics (goals, matches played, biggest win, etc.).
📰 News/announcements section.
📸 Team pages with logos/photos.
🏟️ Venue/pitch information.
📥 Export fixtures/results as PDF.
🚀 Before the Tournament
🌐 Buy and connect your own domain.
🔒 Finalise Firebase security rules.
🧹 Clean up and organise the codebase.
🧪 Test with multiple devices and many simultaneous users.
My recommendation
I think we've reached the stage where adding more features isn't the priority anymore.
Instead, I'd focus on making it look like a website that people would genuinely expect to use for a football tournament.

I'd probably spend the next 5–10 sessions almost entirely on:

redesigning the homepage,
improving the public fixtures/results pages,
adding subtle animations,
making the branding feel premium.
The functionality is already becoming very strong. From here on, the biggest improvement in perceived quality will come from design and user experience rather than more features.
can we start by tidying up our current code so that we are at a good starting point, can we do this by me copy and pasting the current files into chat and you then fixing/cleaning them and repasting them. if they are tooling to be copied n]in one then split it up
Yes. That is the best way to restart cleanly.
Send the files one at a time, in this order:

index.html
admin.html
style.css
admin.css
firebase-init.js
app.js
For each file, I’ll:
remove duplicate or unused code
fix structural issues
keep all working features intact
improve naming and comments
make it easier to maintain
return a complete replacement version
For app.js, since it may be long, send it in multiple parts labelled clearly, for example:
app.js part 1 of 3
app.js part 2 of 3
app.js part 3 of 3
I’ll wait until all parts arrive before rewriting it.
Start by pasting your current index.html.
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Football Tournament – Standings</title>

  <link rel="stylesheet" href="style.css?v=2" />
  <script src="https://www.gstatic.com/firebasejs/12.8.0/firebase-app-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/12.8.0/firebase-database-compat.js"></script>
<script src="firebase-init.js" defer></script>

  <script src="app.js?v=14" defer></script>
</head>
<body>

  <div class="card" id="publicView">
    <h2>Standings</h2>
<p id="liveStatus" style="margin:6px 0 14px; font-size:13px; color: rgba(255,255,255,0.75);">
<span id="liveDot"
  style="display:inline-block;width:8px;height:8px;border-radius:50%;
  background:#22c55e;margin-right:8px;"></span>

  Live • Last updated: <span id="lastUpdated">—</span>
</p>

    <label for="publicGroupSelect">Select group</label><br>
    <select id="publicGroupSelect" onchange="renderPublicGroup()">
      <option value="A">Group A</option>
      <option value="B">Group B</option>
      <option value="C">Group C</option>
      <option value="D">Group D</option>
    </select>

    <div class="table-wrap">
      <table id="publicTable"></table>
   <h3 style="margin-top:16px;">Matches</h3>

<div class="section">
  <h4 style="margin:0 0 8px; font-size:14px; color:rgba(255,255,255,0.75);">Upcoming</h4>
  <div id="publicUpcoming"></div>
</div>

<div class="section" style="margin-top:12px;">
  <h4 style="margin:0 0 8px; font-size:14px; color:rgba(255,255,255,0.75);">Results</h4>
  <div id="publicResults"></div>
</div>


    <p style="margin-top: 14px; color: rgba(255,255,255,0.65); font-size: 13px;">
      Admin?
      <a href="admin.html">Login</a>
    </p>
  </div>

</body>
</html>
Your file had one main structural problem: the fixtures and results were accidentally placed inside the table wrapper, and the wrapper was never closed.
Replace the entire index.html with this:

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">

  <title>Football Tournament – Standings</title>

  <!-- Public styling -->
  <link rel="stylesheet" href="style.css?v=2">

  <!-- Firebase -->
  <script src="https://www.gstatic.com/firebasejs/12.8.0/firebase-app-compat.js"></script>
  <script src="https://www.gstatic.com/firebasejs/12.8.0/firebase-database-compat.js"></script>
  <script src="firebase-init.js" defer></script>

  <!-- Tournament application -->
  <script src="app.js?v=14" defer></script>
</head>

<body>
  <main class="public-page">
    <div class="card" id="publicView">

      <header class="public-header">
        <h1>Football Tournament</h1>
        <p class="page-subtitle">Live standings, fixtures and results</p>

        <p id="liveStatus" class="live-status">
          <span id="liveDot" class="live-dot" aria-hidden="true"></span>
          <span>
            Live · Last updated:
            <span id="lastUpdated">—</span>
          </span>
        </p>
      </header>

      <section class="section standings-section">
        <div class="section-heading">
          <div>
            <h2>Standings</h2>
            <p>Select a group to view its current table.</p>
          </div>

          <div class="group-selector">
            <label for="publicGroupSelect">Group</label>
            <select
              id="publicGroupSelect"
              onchange="renderPublicGroup()"
            >
              <option value="">Loading groups…</option>
            </select>
          </div>
        </div>

        <div class="table-wrap">
          <table id="publicTable">
            <caption class="visually-hidden">
              Current football tournament standings
            </caption>
          </table>
        </div>
      </section>

      <section class="section matches-section">
        <h2>Matches</h2>

        <div class="match-columns">
          <div class="match-panel">
            <h3>Upcoming fixtures</h3>
            <div id="publicUpcoming" aria-live="polite">
              Loading fixtures…
            </div>
          </div>

          <div class="match-panel">
            <h3>Results</h3>
            <div id="publicResults" aria-live="polite">
              Loading results…
            </div>
          </div>
        </div>
      </section>

      <footer class="public-footer">
        <a href="admin.html">Admin login</a>
      </footer>

    </div>
  </main>
</body>
</html>
This keeps all current functionality while:
fixing the broken HTML nesting
removing most inline styling
preparing the page for a proper redesign
allowing your dynamic group code to populate the selector
improving headings and accessibility
The new classes will be styled properly when we clean style.css.
Next, paste your current admin.html.
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Football Tournament – Admin</title>

  <!-- Styles -->
  <link rel="stylesheet" href="admin.css?v=2" />

  <!-- Firebase SDKs -->
  <script src="https://www.gstatic.com/firebasejs/12.8.0/firebase-app-compat.js"></script>
  <script src="https://www.gstatic.com/firebasejs/12.8.0/firebase-database-compat.js"></script>
  <script src="https://www.gstatic.com/firebasejs/12.8.0/firebase-auth-compat.js"></script>
  <script src="firebase-init.js" defer></script>

  <!-- App logic -->
  <script src="app.js?v=14" defer></script>

  <!-- Simple password gate (extra safety) -->
  <script>
    const PASSWORD = "a"; // change later
    const entered = prompt("Enter admin password:");
    if (entered !== PASSWORD) {
      alert("Access denied");
      window.location.href = "index.html";
    }
  </script>
</head>

<body>

  <!-- Admin login card -->
  <div class="card" style="margin-bottom:16px;">
    <h2 style="margin:0 0 10px;">Admin Login</h2>

    <input type="text" id="adminEmail" placeholder="Email">
    <input type="password" id="adminPassword" placeholder="Password">

    <div style="margin-top:8px;">
      <button onclick="adminLogin()">Login</button>
      <button onclick="adminLogout()">Logout</button>
    </div>

    <p id="adminStatus" style="margin:10px 0 0; font-size:13px; opacity:0.75;">
      Not signed in
    </p>
  </div>

  <!-- Main admin panel -->
  <div class="card">

    <!-- Group tabs -->
    <div class="tabs"></div>

    <!-- Standings -->
    <div class="section">
      <h3>Standings</h3>
      <div class="table-wrap">
        <table id="groupTable"></table>
      </div>
    </div>

    <!-- Manage Groups -->
    <div class="section">
      <h3>Manage Groups</h3>

      <label>Add a group</label><br>
      <input type="text" id="newGroupName" placeholder="e.g. E or Group 5">
      <button onclick="addGroup()">Add Group</button>

      <div style="margin-top:12px;">
        <label>Remove a group</label><br>
        <select id="removeGroupSelect"></select><br>
        <button onclick="removeGroup()">Remove Group</button>

        <p style="margin-top:6px; font-size:13px; opacity:0.7;">
          You can’t remove a group that still has teams or matches.
        </p>
      </div>
    </div>

    <!-- Match Schedule -->
    <div class="section">
      <h3>Match Schedule</h3>

      <label>Group</label><br>
      <select id="matchGroup"></select><br>

      <label>Team A</label><br>
      <select id="matchTeamA"></select><br>

      <label>Team B</label><br>
      <select id="matchTeamB"></select><br>

      <label>Date & Time</label><br>
      <input type="datetime-local" id="matchTime"><br>

      <label>Pitch</label><br>
      <input type="text" id="matchPitch" placeholder="e.g. Pitch 1"><br>

      <button onclick="addMatch()">Add Match</button>

      <h4 style="margin:14px 0 8px; font-size:14px; opacity:0.75;">
        Matches in this group
      </h4>
      <div id="adminMatchesList"></div>
    </div>

    <!-- Manage Teams -->
    <div class="section">
      <h3>Manage Teams</h3>

      <div class="row">
        <div>
          <label>Rename a team</label><br>
          <select id="renameSelect"></select><br>
          <input type="text" id="renameInput" placeholder="New team name">
          <button onclick="renameTeam()">Rename Team</button>
        </div>

        <div>
          <label>Add a team</label><br>
          <input type="text" id="newTeamInput" placeholder="New team name">
          <button onclick="addTeam()">Add Team</button>
        </div>
      </div>

      <div style="margin-top:12px;">
        <label>Remove a team</label><br>
        <select id="removeSelect"></select><br>
        <button onclick="removeTeam()">Remove Team</button>
      </div>
    </div>

    <!-- Update Team -->
    <div class="section">
      <h3>Update Team</h3>

      <select id="teamSelect"></select><br>

      <div style="margin-top:8px;">
        <button onclick="addWin()">+3 Win</button>
        <button onclick="addDraw()">+1 Draw</button>
        <button onclick="addLoss()">Loss</button>
        <button onclick="addGoal()">+ Goal</button>
        <button onclick="removeGoal()">- Goal</button>
      </div>
    </div>

    <!-- Admin actions -->
    <div class="section">
      <h3>Admin Actions</h3>
      <button onclick="undoLastAction()">Undo Last Action</button>
      <button onclick="resetTournament()">Reset Tournament</button>
    </div>

  </div>

</body>
</html>
This looks like only the first part of style.css—it stops at:
.card{
  max-width: 980px;
Paste the rest of the file from that point onward. If it is too long, split it into:
style.css part 1 of 2
style.css part 2 of 2
I’ll wait until I have the full file before cleaning and rewriting it.
my bad ignore that first bit here's the proper version:
No problem — paste the full corrected style.css whenever you’re ready. If it’s long, split it into clearly labelled parts, and I’ll wait for all of them before rewriting it.
/* =========
   Base
========= */
:root{
  --bg: #0b1220;
  --card: rgba(255,255,255,0.06);
  --cardSolid: #111a2e;
  --text: rgba(255,255,255,0.92);
  --muted: rgba(255,255,255,0.65);
  --line: rgba(255,255,255,0.10);
  --accent: #60a5fa;   /* blue */
  --good: #22c55e;     /* green */
  --bad: #ef4444;      /* red */
  --shadow: 0 18px 60px rgba(0,0,0,0.45);
  --radius: 18px;
}

*{ box-sizing: border-box; }
html,body{ height:100%; }
body{
  margin:0;
  font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji","Segoe UI Emoji";
  background:
    radial-gradient(900px 600px at 15% 10%, rgba(96,165,250,0.18), transparent 60%),
    radial-gradient(900px 600px at 85% 30%, rgba(34,197,94,0.12), transparent 60%),
    radial-gradient(900px 600px at 60% 90%, rgba(239,68,68,0.10), transparent 55%),
    var(--bg);
  color: var(--text);
  padding: 18px;
}

/* =========
   Layout
========= */
.card{
  max-width: 980px;
  margin: 0 auto;
  background: linear-gradient(180deg, rgba(255,255,255,0.08), rgba(255,255,255,0.04));
  border: 1px solid var(--line);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  padding: 18px;
  backdrop-filter: blur(12px);
}

h2{
  margin: 0 0 12px;
  font-size: 20px;
  letter-spacing: 0.2px;
}
label{
  color: var(--muted);
  font-size: 13px;
}

/* =========
   Controls
========= */
select, input[type="number"], input[type="text"]{
  width: 100%;
  max-width: 340px;
  padding: 10px 12px;
  border-radius: 12px;
  border: 1px solid var(--line);
  background: rgba(255,255,255,0.06);
  color: var(--text);
  outline: none;
}
select:focus, input:focus{
  border-color: rgba(96,165,250,0.55);
  box-shadow: 0 0 0 4px rgba(96,165,250,0.12);
}

a{
  color: var(--accent);
  text-decoration: none;
}
a:hover{ text-decoration: underline; }

/* =========
   Table
========= */
.table-wrap{
  margin-top: 14px;
  overflow-x: auto;           /* mobile friendly */
  -webkit-overflow-scrolling: touch;
  border-radius: 14px;
  border: 1px solid var(--line);
  background: rgba(0,0,0,0.18);
}

table{
  width: 100%;
  border-collapse: collapse;
  min-width: 640px;           /* keeps columns readable; scrolls on small screens */
}
th, td{
  padding: 12px 10px;
  text-align: center;
  border-bottom: 1px solid var(--line);
  font-size: 14px;
}
th{
  position: sticky;
  top: 0;
  background: rgba(17,26,46,0.92);
  backdrop-filter: blur(10px);
  font-size: 12px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: rgba(255,255,255,0.72);
}
td:first-child, th:first-child{
  text-align: left;
  padding-left: 14px;
  font-weight: 600;
}
tr:hover td{
  background: rgba(255,255,255,0.04);
}

.top-team td{
  background: rgba(34,197,94,0.14);
}
.bottom-team td{
  background: rgba(239,68,68,0.14);
}

/* =========
   Small screen tuning
========= */
@media (max-width: 520px){
  body{ padding: 12px; }
  .card{ padding: 14px; border-radius: 16px; }
  h2{ font-size: 18px; }
}
Replace the entire style.css with this cleaned version:
/* ==================================================
   Public Website — Base Variables
================================================== */

:root {
  --background: #0b1220;
  --surface: rgba(255, 255, 255, 0.06);
  --surface-strong: #111a2e;
  --surface-hover: rgba(255, 255, 255, 0.09);

  --text: rgba(255, 255, 255, 0.94);
  --text-muted: rgba(255, 255, 255, 0.66);
  --border: rgba(255, 255, 255, 0.11);

  --accent: #60a5fa;
  --success: #22c55e;
  --danger: #ef4444;

  --shadow: 0 18px 60px rgba(0, 0, 0, 0.45);
  --radius-large: 18px;
  --radius-medium: 14px;
  --radius-small: 10px;

  --page-width: 980px;
}


/* ==================================================
   Reset and Document
================================================== */

*,
*::before,
*::after {
  box-sizing: border-box;
}

html {
  min-height: 100%;
}

body {
  min-height: 100%;
  margin: 0;
  padding: 18px;

  font-family:
    ui-sans-serif,
    system-ui,
    -apple-system,
    BlinkMacSystemFont,
    "Segoe UI",
    Roboto,
    Helvetica,
    Arial,
    sans-serif;

  color: var(--text);

  background:
    radial-gradient(
      900px 600px at 15% 10%,
      rgba(96, 165, 250, 0.18),
      transparent 60%
    ),
    radial-gradient(
      900px 600px at 85% 30%,
      rgba(34, 197, 94, 0.12),
      transparent 60%
    ),
    radial-gradient(
      900px 600px at 60% 90%,
      rgba(239, 68, 68, 0.1),
      transparent 55%
    ),
    var(--background);
}

button,
input,
select {
  font: inherit;
}


/* ==================================================
   Main Layout
================================================== */

.public-page {
  width: 100%;
}

.card {
  width: 100%;
  max-width: var(--page-width);
  margin: 0 auto;
  padding: 22px;

  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.08),
    rgba(255, 255, 255, 0.04)
  );

  border: 1px solid var(--border);
  border-radius: var(--radius-large);
  box-shadow: var(--shadow);

  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}

.section {
  margin-top: 24px;
  padding-top: 24px;
  border-top: 1px solid var(--border);
}


/* ==================================================
   Typography
================================================== */

h1,
h2,
h3,
p {
  margin-top: 0;
}

h1 {
  margin-bottom: 6px;
  font-size: clamp(26px, 5vw, 38px);
  line-height: 1.1;
}

h2 {
  margin-bottom: 6px;
  font-size: 21px;
}

h3 {
  margin-bottom: 10px;
  font-size: 15px;
}

p {
  color: var(--text-muted);
  line-height: 1.5;
}

.page-subtitle {
  margin-bottom: 14px;
}

a {
  color: var(--accent);
  font-weight: 600;
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}


/* ==================================================
   Header and Live Status
================================================== */

.public-header {
  padding-bottom: 4px;
}

.live-status {
  display: flex;
  align-items: center;
  gap: 8px;

  margin: 0;
  font-size: 13px;
}

.live-dot {
  display: inline-block;
  width: 9px;
  height: 9px;
  flex-shrink: 0;

  background: var(--success);
  border-radius: 50%;
  box-shadow: 0 0 10px rgba(34, 197, 94, 0.65);
}


/* ==================================================
   Section Headings
================================================== */

.section-heading {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 20px;

  margin-bottom: 14px;
}

.section-heading p {
  margin-bottom: 0;
  font-size: 14px;
}


/* ==================================================
   Forms and Selectors
================================================== */

.group-selector {
  width: 180px;
  flex-shrink: 0;
}

label {
  display: block;
  margin-bottom: 6px;

  color: var(--text-muted);
  font-size: 13px;
  font-weight: 600;
}

select,
input[type="number"],
input[type="text"] {
  width: 100%;
  min-height: 42px;
  padding: 10px 12px;

  color: var(--text);
  background: rgba(255, 255, 255, 0.06);

  border: 1px solid var(--border);
  border-radius: 12px;
  outline: none;
}

select {
  cursor: pointer;
}

select option {
  color: #111827;
  background: #ffffff;
}

select:focus,
input:focus {
  border-color: rgba(96, 165, 250, 0.65);
  box-shadow: 0 0 0 4px rgba(96, 165, 250, 0.13);
}


/* ==================================================
   Standings Table
================================================== */

.table-wrap {
  width: 100%;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;

  background: rgba(0, 0, 0, 0.18);
  border: 1px solid var(--border);
  border-radius: var(--radius-medium);
}

table {
  width: 100%;
  min-width: 640px;
  border-collapse: collapse;
}

th,
td {
  padding: 12px 10px;

  font-size: 14px;
  text-align: center;

  border-bottom: 1px solid var(--border);
}

th {
  position: sticky;
  top: 0;
  z-index: 1;

  color: rgba(255, 255, 255, 0.72);
  background: rgba(17, 26, 46, 0.96);

  font-size: 12px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

td:first-child,
th:first-child {
  padding-left: 14px;
  font-weight: 600;
  text-align: left;
}

tbody tr:last-child td {
  border-bottom: 0;
}

tbody tr:hover td {
  background: var(--surface-hover);
}

.top-team td {
  background: rgba(34, 197, 94, 0.14);
}

.bottom-team td {
  background: rgba(239, 68, 68, 0.14);
}


/* ==================================================
   Fixtures and Results
================================================== */

.match-columns {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}

.match-panel {
  min-width: 0;
  padding: 16px;

  background: rgba(0, 0, 0, 0.16);
  border: 1px solid var(--border);
  border-radius: var(--radius-medium);
}

.match-panel h3 {
  color: var(--text-muted);
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

/*
  This styles match elements generated by app.js without
  requiring their exact class names.
*/
#publicUpcoming > *,
#publicResults > * {
  margin-bottom: 10px;
  padding: 12px;

  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-small);
}

#publicUpcoming > *:last-child,
#publicResults > *:last-child {
  margin-bottom: 0;
}


/* ==================================================
   Footer
================================================== */

.public-footer {
  margin-top: 24px;
  padding-top: 18px;

  text-align: center;
  border-top: 1px solid var(--border);
}


/* ==================================================
   Accessibility
================================================== */

.visually-hidden {
  position: absolute;

  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;

  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;

  border: 0;
}


/* ==================================================
   Responsive Layout
================================================== */

@media (max-width: 700px) {
  .section-heading {
    align-items: stretch;
    flex-direction: column;
    gap: 12px;
  }

  .group-selector {
    width: 100%;
  }

  .match-columns {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 520px) {
  body {
    padding: 12px;
  }

  .card {
    padding: 16px;
    border-radius: 16px;
  }

  .section {
    margin-top: 20px;
    padding-top: 20px;
  }

  h2 {
    font-size: 19px;
  }

  th,
  td {
    padding: 11px 9px;
    font-size: 13px;
  }
}
Also change this line in index.html:
<link rel="stylesheet" href="style.css?v=2">
to:
<link rel="stylesheet" href="style.css?v=3">
That forces browsers to load the cleaned version rather than an older cached copy.
Next, paste your current admin.css.
im going to do all the cache updates at the end also how come the new style.css is so much longer. its not a problem just curious.
That’s fine — doing all cache version changes at the end is sensible.
The new style.css is longer mainly because:

it now styles the extra structure added to the cleaned index.html
each property is spaced out for readability rather than compressed onto one line
it includes separate sections for the header, live status, fixtures, results, footer and mobile layout
it adds accessibility helpers such as .visually-hidden
repeated values are stored as variables so future redesigns are easier
So it has more lines, but it is better organised and easier to edit. “Cleaner code” does not always mean fewer lines—it often means clearer separation and less confusion.
We may shorten or adjust parts once we inspect app.js, because that will show exactly how the match cards are generated. Next, paste admin.css.
/* =========
   Base (same theme as public)
========= */
:root{
  --bg: #0b1220;
  --card: rgba(255,255,255,0.06);
  --text: rgba(255,255,255,0.92);
  --muted: rgba(255,255,255,0.65);
  --line: rgba(255,255,255,0.10);
  --accent: #60a5fa;
  --good: #22c55e;
  --bad: #ef4444;
  --warn: #f59e0b;
  --shadow: 0 18px 60px rgba(0,0,0,0.45);
  --radius: 18px;
}

*{ box-sizing: border-box; }
html,body{ height:100%; }
body{
  margin:0;
  font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial;
  background:
    radial-gradient(900px 600px at 15% 10%, rgba(96,165,250,0.18), transparent 60%),
    radial-gradient(900px 600px at 85% 30%, rgba(34,197,94,0.12), transparent 60%),
    radial-gradient(900px 600px at 60% 90%, rgba(239,68,68,0.10), transparent 55%),
    var(--bg);
  color: var(--text);
  padding: 18px;
}

/* =========
   Card / headings
========= */
.card{
  max-width: 980px;
  margin: 0 auto;
  background: linear-gradient(180deg, rgba(255,255,255,0.08), rgba(255,255,255,0.04));
  border: 1px solid var(--line);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  padding: 18px;
  backdrop-filter: blur(12px);
}

h2, h3{
  margin: 14px 0 10px;
  letter-spacing: 0.2px;
}
h3{
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 0.14em;
  color: rgba(255,255,255,0.70);
}

/* =========
   Tabs (segmented control)
========= */
.tabs{
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
  margin-bottom: 14px;
}
.tabs button{
  appearance: none;
  border: 1px solid var(--line);
  background: rgba(255,255,255,0.06);
  color: var(--text);
  padding: 10px 12px;
  border-radius: 14px;
  font-weight: 650;
  cursor: pointer;
  transition: transform 120ms ease, background 120ms ease, border-color 120ms ease;
}
.tabs button:hover{
  background: rgba(255,255,255,0.10);
  transform: translateY(-1px);
}
.tabs button:active{
  transform: translateY(0);
}

/* =========
   Controls / buttons
========= */
select, input[type="number"], input[type="text"]{
  width: 100%;
  max-width: 360px;
  padding: 10px 12px;
  border-radius: 12px;
  border: 1px solid var(--line);
  background: rgba(255,255,255,0.06);
  color: var(--text);
  outline: none;
  margin: 6px 0;
}
select:focus, input:focus{
  border-color: rgba(96,165,250,0.55);
  box-shadow: 0 0 0 4px rgba(96,165,250,0.12);
}

button{
  appearance: none;
  border: 1px solid var(--line);
  background: rgba(255,255,255,0.08);
  color: var(--text);
  padding: 10px 12px;
  border-radius: 12px;
  font-weight: 650;
  cursor: pointer;
  margin: 6px 6px 6px 0;
  transition: transform 120ms ease, background 120ms ease, border-color 120ms ease;
}
button:hover{
  background: rgba(255,255,255,0.12);
  transform: translateY(-1px);
}
button:active{ transform: translateY(0); }

/* Optional “semantic” button classes if you want to add them later */
.btn-good{ border-color: rgba(34,197,94,0.35); }
.btn-bad{ border-color: rgba(239,68,68,0.35); }
.btn-warn{ border-color: rgba(245,158,11,0.35); }

/* =========
   Sections layout
========= */
.section{
  border: 1px solid var(--line);
  background: rgba(0,0,0,0.14);
  border-radius: 16px;
  padding: 14px;
  margin-top: 14px;
}

.row{
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  align-items: start;
}

@media (max-width: 760px){
  .tabs{ grid-template-columns: repeat(2, 1fr); }
  .row{ grid-template-columns: 1fr; }
}

/* =========
   Table
========= */
.table-wrap{
  margin-top: 10px;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  border-radius: 14px;
  border: 1px solid var(--line);
  background: rgba(0,0,0,0.18);
}
table{
  width: 100%;
  border-collapse: collapse;
  min-width: 720px;
}
th, td{
  padding: 12px 10px;
  text-align: center;
  border-bottom: 1px solid var(--line);
  font-size: 14px;
}
th{
  position: sticky;
  top: 0;
  background: rgba(17,26,46,0.92);
  backdrop-filter: blur(10px);
  font-size: 12px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: rgba(255,255,255,0.72);
}
td:first-child, th:first-child{
  text-align: left;
  padding-left: 14px;
  font-weight: 700;
}
tr:hover td{ background: rgba(255,255,255,0.04); }

.top-team td{ background: rgba(34,197,94,0.14); }
.bottom-team td{ background: rgba(239,68,68,0.14); }
Replace the entire admin.css with this version. It matches the cleaned admin.html and keeps the same overall theme.
/* ==================================================
   Admin Dashboard — Variables
================================================== */

:root {
  --background: #0b1220;
  --surface: rgba(255, 255, 255, 0.06);
  --surface-hover: rgba(255, 255, 255, 0.1);
  --surface-dark: rgba(0, 0, 0, 0.16);
  --surface-strong: #111a2e;

  --text: rgba(255, 255, 255, 0.94);
  --text-muted: rgba(255, 255, 255, 0.66);
  --border: rgba(255, 255, 255, 0.11);

  --accent: #60a5fa;
  --success: #22c55e;
  --danger: #ef4444;
  --warning: #f59e0b;

  --shadow: 0 18px 60px rgba(0, 0, 0, 0.45);

  --radius-large: 18px;
  --radius-medium: 14px;
  --radius-small: 10px;

  --page-width: 1100px;
}


/* ==================================================
   Reset and Document
================================================== */

*,
*::before,
*::after {
  box-sizing: border-box;
}

html {
  min-height: 100%;
}

body {
  min-height: 100%;
  margin: 0;
  padding: 18px;

  font-family:
    ui-sans-serif,
    system-ui,
    -apple-system,
    BlinkMacSystemFont,
    "Segoe UI",
    Roboto,
    Helvetica,
    Arial,
    sans-serif;

  color: var(--text);

  background:
    radial-gradient(
      900px 600px at 15% 10%,
      rgba(96, 165, 250, 0.18),
      transparent 60%
    ),
    radial-gradient(
      900px 600px at 85% 30%,
      rgba(34, 197, 94, 0.12),
      transparent 60%
    ),
    radial-gradient(
      900px 600px at 60% 90%,
      rgba(239, 68, 68, 0.1),
      transparent 55%
    ),
    var(--background);
}

button,
input,
select {
  font: inherit;
}


/* ==================================================
   Main Layout
================================================== */

.admin-page {
  width: 100%;
  max-width: var(--page-width);
  margin: 0 auto;
}

.card {
  width: 100%;
  margin-bottom: 18px;
  padding: 22px;

  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.08),
    rgba(255, 255, 255, 0.04)
  );

  border: 1px solid var(--border);
  border-radius: var(--radius-large);
  box-shadow: var(--shadow);

  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}

.section {
  margin-top: 18px;
  padding: 18px;

  background: var(--surface-dark);
  border: 1px solid var(--border);
  border-radius: var(--radius-medium);
}

.login-card {
  margin-bottom: 18px;
}


/* ==================================================
   Typography
================================================== */

h1,
h2,
h3,
p {
  margin-top: 0;
}

h1 {
  margin-bottom: 6px;
  font-size: clamp(25px, 4vw, 34px);
}

h2 {
  margin-bottom: 6px;
  font-size: 20px;
}

h3 {
  margin-bottom: 12px;

  color: var(--text-muted);
  font-size: 13px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

p {
  color: var(--text-muted);
  line-height: 1.5;
}

.helper-text {
  margin: 10px 0 0;
  font-size: 13px;
}


/* ==================================================
   Headings and Status
================================================== */

.section-heading {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 20px;

  margin-bottom: 16px;
}

.section-heading p {
  margin-bottom: 0;
  font-size: 14px;
}

.admin-status {
  flex-shrink: 0;
  margin: 0;
  padding: 8px 11px;

  font-size: 13px;
  font-weight: 700;

  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 999px;
}


/* ==================================================
   Group Tabs
================================================== */

.tabs {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  gap: 10px;

  margin-bottom: 18px;
}

.tabs button {
  width: 100%;
  margin: 0;
}

.tabs button.active {
  color: #ffffff;
  background: rgba(96, 165, 250, 0.2);
  border-color: rgba(96, 165, 250, 0.65);
}


/* ==================================================
   Forms
================================================== */

.login-fields,
.form-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}

.match-form {
  grid-template-columns: repeat(3, minmax(0, 1fr));
  margin-bottom: 12px;
}

.form-panel {
  min-width: 0;
  padding: 16px;

  background: var(--surface-dark);
  border: 1px solid var(--border);
  border-radius: var(--radius-medium);
}

.form-field {
  min-width: 0;
  margin-bottom: 12px;
}

.form-field:last-child {
  margin-bottom: 0;
}

.compact-field {
  max-width: 380px;
}

label {
  display: block;
  margin-bottom: 6px;

  color: var(--text-muted);
  font-size: 13px;
  font-weight: 650;
}

input,
select {
  width: 100%;
  min-height: 42px;
  padding: 10px 12px;

  color: var(--text);
  background: var(--surface);

  border: 1px solid var(--border);
  border-radius: 12px;
  outline: none;
}

input::placeholder {
  color: rgba(255, 255, 255, 0.4);
}

select {
  cursor: pointer;
}

select option {
  color: #111827;
  background: #ffffff;
}

input:focus,
select:focus {
  border-color: rgba(96, 165, 250, 0.65);
  box-shadow: 0 0 0 4px rgba(96, 165, 250, 0.13);
}


/* ==================================================
   Buttons
================================================== */

button {
  min-height: 42px;
  padding: 10px 14px;

  color: var(--text);
  font-weight: 700;

  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 12px;

  cursor: pointer;

  transition:
    transform 120ms ease,
    background 120ms ease,
    border-color 120ms ease;
}

button:hover {
  background: var(--surface-hover);
  transform: translateY(-1px);
}

button:active {
  transform: translateY(0);
}

button:focus-visible {
  outline: 3px solid rgba(96, 165, 250, 0.35);
  outline-offset: 2px;
}

button:disabled {
  cursor: not-allowed;
  opacity: 0.5;
  transform: none;
}

.button-row {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.secondary-button {
  color: var(--text-muted);
}

.danger-button {
  color: #fecaca;
  background: rgba(239, 68, 68, 0.1);
  border-color: rgba(239, 68, 68, 0.35);
}

.danger-button:hover {
  background: rgba(239, 68, 68, 0.18);
  border-color: rgba(239, 68, 68, 0.55);
}

.adjustment-buttons {
  margin-top: 12px;
}


/* ==================================================
   Danger Areas
================================================== */

.danger-panel,
.danger-section {
  border-color: rgba(239, 68, 68, 0.28);
}

.danger-section {
  background: rgba(239, 68, 68, 0.05);
}


/* ==================================================
   Standings Table
================================================== */

.table-wrap {
  width: 100%;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;

  background: rgba(0, 0, 0, 0.18);
  border: 1px solid var(--border);
  border-radius: var(--radius-medium);
}

table {
  width: 100%;
  min-width: 720px;
  border-collapse: collapse;
}

th,
td {
  padding: 12px 10px;

  font-size: 14px;
  text-align: center;

  border-bottom: 1px solid var(--border);
}

th {
  position: sticky;
  top: 0;
  z-index: 1;

  color: rgba(255, 255, 255, 0.72);
  background: rgba(17, 26, 46, 0.96);

  font-size: 12px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

td:first-child,
th:first-child {
  padding-left: 14px;
  font-weight: 700;
  text-align: left;
}

tbody tr:last-child td {
  border-bottom: 0;
}

tbody tr:hover td {
  background: var(--surface-hover);
}

.top-team td {
  background: rgba(34, 197, 94, 0.14);
}

.bottom-team td {
  background: rgba(239, 68, 68, 0.14);
}


/* ==================================================
   Match List
================================================== */

.subsection {
  margin-top: 20px;
  padding-top: 18px;

  border-top: 1px solid var(--border);
}

#adminMatchesList > * {
  margin-bottom: 12px;
  padding: 14px;

  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-small);
}

#adminMatchesList > *:last-child {
  margin-bottom: 0;
}

#adminMatchesList input {
  width: auto;
  min-width: 70px;
  max-width: 130px;
  margin: 4px;
}


/* ==================================================
   Accessibility
================================================== */

.visually-hidden {
  position: absolute;

  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;

  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;

  border: 0;
}


/* ==================================================
   Responsive Layout
================================================== */

@media (max-width: 850px) {
  .match-form {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 700px) {
  .section-heading {
    flex-direction: column;
    gap: 10px;
  }

  .login-fields,
  .form-grid,
  .match-form {
    grid-template-columns: 1fr;
  }

  .admin-status {
    align-self: flex-start;
  }
}

@media (max-width: 520px) {
  body {
    padding: 12px;
  }

  .card {
    padding: 15px;
    border-radius: 16px;
  }

  .section {
    padding: 14px;
  }

  .tabs {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .button-row {
    flex-direction: column;
  }

  .button-row button {
    width: 100%;
  }
}
I have left the cache version unchanged for now, as requested. Next is firebase-init.js.
const firebaseConfig = {
  apiKey: "AIzaSyDflqJLfd9wK4eicO9Ir9NCyUZYMRIXUwI",
  authDomain: "football-tournament-87366.firebaseapp.com",
  databaseURL: "https://football-tournament-87366-default-rtdb.firebaseio.com",
  projectId: "football-tournament-87366",
  storageBucket: "football-tournament-87366.firebasestorage.app",
  messagingSenderId: "25593487396",
  appId: "1:25593487396:web:fec9543a7f8f41134ab8b1"
};
// 2) Initialize Firebase + Database
firebase.initializeApp(firebaseConfig);

window.db = firebase.database();
window.auth = firebase.auth();
Replace firebase-init.js with this cleaned version:
const firebaseConfig = {
  apiKey: "AIzaSyDflqJLfd9wK4eicO9Ir9NCyUZYMRIXUwI",
  authDomain: "football-tournament-87366.firebaseapp.com",
  databaseURL:
    "https://football-tournament-87366-default-rtdb.firebaseio.com",
  projectId: "football-tournament-87366",
  storageBucket: "football-tournament-87366.firebasestorage.app",
  messagingSenderId: "25593487396",
  appId: "1:25593487396:web:fec9543a7f8f41134ab8b1"
};

function initialiseFirebase() {
  if (typeof firebase === "undefined") {
    console.error("Firebase failed to load.");
    return;
  }

  // Prevent Firebase being initialised more than once.
  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }

  // Available on both the public and admin pages.
  window.db = firebase.database();

  // Authentication is only loaded on the admin page.
  window.auth =
    typeof firebase.auth === "function"
      ? firebase.auth()
      : null;
}

initialiseFirebase();
The important fix is the authentication check. Your public page does not load the Firebase Auth script, so the old version could cause an error when it tried to run firebase.auth() there.
Your Firebase web API key appearing in this file is normal; the actual protection comes from your Firebase Authentication and database security rules.

Next, paste app.js. Split it into labelled parts if needed, and I’ll wait for the whole file before rewriting it.

Pasted text.txt
Document
Worked for 3m 49s
I’ve cleaned the full app.js you uploaded.
Because it is very long, use this complete replacement file rather than combining several chat messages:

app.js

Major fixes include:

removed the Firebase write loop caused by saving during rendering
made dynamic and empty groups persist properly
made reset clear fixtures and results too
made team renaming update existing fixtures
stopped teams being removed while they still have matches
made manual adjustments survive automatic recalculation
improved undo so it covers teams, groups and matches
removed the unnecessary five-second refresh
added safer handling of team names and other displayed text
restricted every editing action to an authenticated admin
I have checked the JavaScript syntax successfully, but we still need to test it with your actual Firebase data.
For now, replace only app.js, leave the cache numbers unchanged, and tell me whether both the public and admin pages load.
I can't open the link
Try this new link:
cleaned-app.js

I also made two backups in case your browser still blocks it:

Download it as a ZIP

cleaned-app.txt





Library
/
cleaned-app.txt


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
          <td>${escapeHtml(team.name)}</td>
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
  const selectIds = ["teamSelect", "renameSelect", "removeSelect"];
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

Library
/
cleaned-app.txt


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
          <td>${escapeHtml(team.name)}</td>
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
  const selectIds = ["teamSelect", "renameSelect", "removeSelect"];
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
function setLastUpdatedNow() {
  const el = document.getElementById("lastUpdated");
  if (!el) return; // not on public page
  el.textContent = new Date().toLocaleString([], { hour: "2-digit", minute: "2-digit", day: "2-digit", month: "short" });
}
function setLiveStatus(isLive) {
  const dot = document.getElementById("liveDot");
  if (!dot) return;

  dot.style.background = isLive ? "#22c55e" : "#ef4444";
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
     refreshGroupUI();
      renderAdmin();
      renderPublicGroup();
      fillMatchTeamDropdowns();
      setLastUpdatedNow();

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
  GROUP HELPERS (dynamic groups)
**********************/
function getGroupKeys() {
  return Object.keys(groups || {}).sort((a, b) => a.localeCompare(b));
}

function ensureGroupExists(letter) {
  if (!groups[letter]) groups[letter] = [];
  if (!matches) matches = {};
  if (!matches[letter]) matches[letter] = {};
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
setLastUpdatedNow();

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
function refreshGroupUI() {
  const keys = getGroupKeys();

  // ---- Admin tabs (buttons) ----
  const tabsEl = document.querySelector(".tabs");
  if (tabsEl) {
    tabsEl.innerHTML = keys.map(k =>
      `<button onclick="showGroup('${k}')">Group ${k}</button>`
    ).join("");
  }

  // ---- Public group dropdown ----
  const pubSel = byId("publicGroupSelect");
  if (pubSel) {
    const current = pubSel.value || keys[0] || "A";
    pubSel.innerHTML = keys.map(k =>
      `<option value="${k}">Group ${k}</option>`
    ).join("");
    if (keys.includes(current)) pubSel.value = current;
  }

  // ---- Admin remove-group dropdown ----
  const removeGroupSelect = byId("removeGroupSelect");
  if (removeGroupSelect) {
    removeGroupSelect.innerHTML = keys.map(k =>
      `<option value="${k}">Group ${k}</option>`
    ).join("");
  }

  // ---- Admin match group dropdown (if present) ----
  const matchGroup = byId("matchGroup");
  if (matchGroup) {
    const current = matchGroup.value || keys[0] || "A";
    matchGroup.innerHTML = keys.map(k =>
      `<option value="${k}">Group ${k}</option>`
    ).join("");
    if (keys.includes(current)) matchGroup.value = current;
  }
}
function addGroup() {
  const input = byId("newGroupName");
  if (!input) return;

  let name = input.value.trim();
  if (!name) return alert("Enter a group name first.");

  // Simple cleanup: allow "Group E" -> "E"
  name = name.replace(/^group\s+/i, "").trim();
  // Keep short + neat (optional)
  if (name.length > 8) return alert("Keep group name short (max 8 chars).");

  // Normalize: use uppercase for consistency
  const key = name.toUpperCase();

  if (groups[key]) return alert("That group already exists.");

  groups[key] = [];
  if (!matches) matches = {};
  matches[key] = {};

  // If this is the first group ever, switch to it
  if (!currentGroup) currentGroup = key;

  input.value = "";

  saveGroups();
  if (dbReady()) window.db.ref(`tournament/matches/${key}`).set({});

  refreshGroupUI();
  renderAdmin();
  renderPublicGroup();
  renderPublicMatches();
  renderAdminMatches();
}

function removeGroup() {
  const sel = byId("removeGroupSelect");
  if (!sel) return;

  const key = sel.value;
  if (!key || !groups[key]) return;

  const teamCount = (groups[key] || []).length;
  const matchCount = Object.keys(matches?.[key] || {}).length;

  if (teamCount > 0) {
    return alert("You can’t remove a group that still has teams. Remove the teams first.");
  }
  if (matchCount > 0) {
    return alert("You can’t remove a group that still has matches. Delete the matches first.");
  }

  if (!confirm(`Remove Group ${key}?`)) return;

  delete groups[key];
  if (matches && matches[key]) delete matches[key];

  // If we deleted the current group, switch to another
  const keysLeft = getGroupKeys();
  if (currentGroup === key) currentGroup = keysLeft[0] || "";

  saveGroups();
  if (dbReady()) window.db.ref(`tournament/matches/${key}`).remove();

  refreshGroupUI();
  renderAdmin();
  renderPublicGroup();
  renderPublicMatches();
  renderAdminMatches();
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
  getGroupKeys().forEach(letter => {
    (groups[letter] || []).forEach(t => {
      t.p = 0; t.w = 0; t.d = 0; t.l = 0;
      t.points = 0; t.gd = 0;
    });
  });

  // Apply all finished match results onto the table
  getGroupKeys().forEach(letter => {
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
function listenToConnectionStatus() {
  if (!dbReady()) return;

  const connectedRef = window.db.ref(".info/connected");
  connectedRef.on("value", (snap) => {
    setLiveStatus(!!snap.val());
  });
}
document.addEventListener("DOMContentLoaded", () => {
  // Auth status
  if (window.auth) {
    window.auth.onAuthStateChanged((user) => {
      if (user) setAdminStatus("Signed in as " + user.email);
      else setAdminStatus("Not signed in");
   getGroupKeys()
    });
  }

  // Firebase listeners
  listenToGroupsFromFirebase();
  listenToMatchesFromFirebase();
listenToConnectionStatus();


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
window.addGroup = addGroup;
window.removeGroup = removeGroup;
