# HR Management Project (HRMS)

Welcome! This project is a simple, learning-friendly HR Management System built with plain HTML, CSS, and JavaScript (no frameworks). It helps you learn by building.

## What it does
- Login page (demo credentials)
- Dashboard layout with sidebar and top navigation
- Employee Management: add/edit/delete, search, pagination, local storage persistence
- Recruitment: post/edit/delete jobs, search
- Attendance & Leave: clock in/out, leave requests, history
- Payroll: add payroll records, auto-calc net salary
- Reports: simple tables generated from saved data

## How to run (no install needed)
1. Open the project folder.
2. Double-click `Index.html` to open in your browser.
3. Login with:
   - Username: `admin`
   - Password: `1234`
4. You’ll be redirected to `dashboard.html`.

Tip: Everything saves in your browser using localStorage. Clearing site data resets the app.

## Project structure
- `Index.html` — Login page
- `dashboard.html` — Main dashboard layout
- `script.js` — All app logic (navigation + feature modules)
- `style.css` — Styles for all pages and components
- `images/` — Project images

## Learning path (what to read and in what order)
1. Open `Index.html` to see the login form markup.
2. Open `dashboard.html` to see the sidebar and content layout.
3. Open `script.js` and search for these functions:
   - `loadSection(section)` — switches views by injecting HTML into `#content`.
   - `initEmployeeManagement()` — CRUD + search + pagination example.
   - `initRecruitment()` — CRUD + search for jobs.
   - `initAttendance()` — clock in/out and leave requests.
   - `initPayroll()` — salary calc and table.
   - `initReports()` — reads data and renders report tables.

Reading these functions will teach you: DOM selection, event listeners, form handling, table rendering, filtering, pagination, and saving data with localStorage.

## Recent fixes (to learn from)
- Fixed login avatar image path to be relative (`images/hr.jpg`).
- Fixed sidebar Settings link casing (`settings`) to match JavaScript checks.
- Replaced invalid navbar search (input inside button) with a simple input.
- Removed duplicate `initAttendance()` call.
- Fixed logout redirect to `Index.html`.

Why these matter:
- Correct paths and casing prevent broken links.
- Clean HTML structure avoids unpredictable behavior.
- Avoiding duplicate function calls prevents double event bindings and bugs.

## New features added (with code map)

### 1) Settings + Dark Mode (saved in your browser)
- Where to click: Sidebar → Settings
- What it does: Toggle dark mode; your choice is saved using `localStorage` and applied every time the app loads.
- Where the code lives:
  - `script.js`
    - `loadSection('settings')`: renders the Settings view
    - `initSettings()`: reads/sets the checkbox and saves theme
    - `applyTheme(theme)`: adds/removes `body.dark`
    - a one-time call near the bottom applies saved theme on page load
  - `style.css`
    - `body.dark { ... }` and related selectors change backgrounds and text colors

How it works step-by-step:
1. When you open Settings, the checkbox is set based on `localStorage.getItem('theme')` (default `light`).
2. Toggling the checkbox saves `theme` as `dark` or `light`.
3. `applyTheme` adds/removes the `dark` class on `<body>`.
4. CSS rules under `body.dark` switch colors.

Try it: Toggle Dark Mode → navigate to another section → refresh the page. The theme persists.

### 2) CSV Export (Employees and Reports)
- Where to click:
  - Employees → click “Export CSV” button near the search bar
  - Reports → click “Export CSV” next to the “Report Results” title
- What it does: Downloads a `.csv` file of the current data so you can open it in Excel/Sheets.
- Where the code lives (in `script.js`):
  - Employees: inside `initEmployeeManagement()` we attach a click handler to `#empExportCsv` that collects employee rows and calls `downloadCsv(...)`.
  - Reports: inside `initReports()` we attach a click handler to `#reportExportCsv` that calls `exportTableToCsv('reportTable', 'report.csv')`.
  - Helpers:
    - `downloadCsv(filename, rows)` creates a CSV blob and triggers a download.
    - `escapeCsv(value)` safely quotes cells with commas or quotes.
    - `exportTableToCsv(tableId, filename)` reads table headers and rows from the DOM.

Tips:
- If you don’t see rows in the report, generate one first (submit the form), then export.
- The export includes whatever columns/rows are currently rendered.

## How to use each module (quick guide)
- Employees:
  - Go to Sidebar → Employee Management
  - Add a few employees; use the search bar; flip pages via pagination buttons
- Recruitment:
  - Add jobs with title/department/description; use search
- Attendance & Leave:
  - Clock In → Clock Out to log a session; submit leave requests
- Payroll:
  - Enter employee, basic, allowances, deductions; net is auto-calculated
- Reports:
  - Choose report type and dates (demo shows all); view generated table

## Concepts you’re learning
- DOM manipulation (creating and inserting HTML)
- Event handling (submit, click, input)
- Data persistence in `localStorage`
- Basic data modeling using arrays/objects
- Rendering lists and tables from data
- Search/filtering and simple pagination

## FAQ
- I changed code but nothing updates — Hard refresh the browser (Ctrl+F5).
- Data disappeared — localStorage may have been cleared; enter data again.
- Images not loading — make sure the path is `images/your-file.jpg` (no leading slash).

## Contributing (as you learn)
- Keep edits small and test after each change.
- Prefer adding new functionality in `script.js` functions near similar features.
- When styles conflict, remove duplicates and keep one definition per component.

---

If you’re stuck or curious about a concept, open an issue note for yourself in this README and we’ll expand the explanation in code comments and here.


