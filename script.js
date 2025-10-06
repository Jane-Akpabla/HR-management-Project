// =================== LOGIN SECTION ===================
document.getElementById("loginform")?.addEventListener("submit", function(e) {
  e.preventDefault();
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  // Simple hardcoded login for demo
  if (username === "admin" && password === "1234") {
    window.location.href = "dashboard.html";
  } else {
    alert("Invalid username or password. Try admin / 1234");
  }
});

// =================== DASHBOARD NAVIGATION ===================
// This function loads the correct section into the #content area
function loadSection(section) {
  const content = document.getElementById("content");
  if (section === "employee") {
    // Render Employee Management UI
    content.innerHTML = `
      <h2>Employee Management</h2>
      <form id="employeeForm">
        <input type="text" id="empName" placeholder="Employee Name" required>
        <input type="text" id="empDept" placeholder="Department" required>
        <input type="email" id="empEmail" placeholder="Email" required>
        <button type="submit">Add Employee</button>
      </form>
      <input type="text" id="empSearch" placeholder="Search employees..." style="margin:15px 0; padding:6px; width:300px;">
      <button id="empExportCsv" style="margin-left:10px; padding:6px 10px;">Export CSV</button>
      <table id="employeeTable" cellpadding="8">
        <thead>
          <tr>
            <th>Name</th>
            <th>Department</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody></tbody>
      </table>
      <div id="empPagination" style="margin-top:15px;"></div>
    `;
    initEmployeeManagement();
  } else if (section === "recruitment") {
    // Render Recruitment Management UI
    content.innerHTML = `
      <h2>Recruitment Management</h2>
      <form id="jobForm">
        <input type="text" id="jobTitle" placeholder="Job Title" required>
        <input type="text" id="jobDept" placeholder="Department" required>
        <textarea id="jobDesc" placeholder="Job Description" required></textarea>
        <select id="jobStatus" required>
          <option value="Open">Open</option>
          <option value="Closed">Closed</option>
        </select>
        <button type="submit">Post Job</button>
      </form>
      <input type="text" id="jobSearch" placeholder="Search jobs..." style="margin:15px 0; padding:5px;">
  <table id="jobTable" cellpadding="8">
        <thead>
          <tr>
            <th>Title</th>
            <th>Department</th>
            <th>Description</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody></tbody>
      </table>
    `;
    initRecruitment();
  } else if (section === "attendance") {
    // Render Attendance & Leave UI
    content.innerHTML = `
      <h2>Attendance & Leave</h2>
      <div class="attendance-block">
        <div id="clockStatus"></div>
        <button id="clockInBtn">Clock In</button>
        <button id="clockOutBtn" style="display:none;">Clock Out</button>
      </div>
      <table id="attendanceTable">
        <thead>
          <tr>
            <th>Leave Request</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody></tbody>
      </table>
      <form id="leaveForm">
        <input type="text" id="leaveEmployee" placeholder="Employee Name" required>
        <input type="text" id="leaveType" placeholder="Type (e.g. Sick, Vacation)" required>
        <input type="date" id="leaveFrom" required>
        <input type="date" id="leaveTo" required>
        <textarea id="leaveReason" placeholder="Reason" required></textarea>
        <button type="submit">Request Leave</button>
      </form>
  <h3>Leave History</h3>
      <table id="leaveTable">
        <thead>
          <tr>
            <th>Employee Name</th>
            <th>Type</th>
            <th>From</th>
            <th>To</th>
            <th>Reason</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody></tbody>
      </table>
    `;
      initAttendance();

// =================== ATTENDANCE & LEAVE (Simple Version for Interns) ===================

function initAttendance() {
  // --- Attendance (Clock In/Out) ---
  // Get the buttons and status area from the page
  const clockInBtn = document.getElementById("clockInBtn");
  const clockOutBtn = document.getElementById("clockOutBtn");
  const clockStatus = document.getElementById("clockStatus");
  const attendanceTableBody = document.querySelector("#attendanceTable tbody");

  // Get saved attendance records from browser, or start with empty list
  let attendanceRecords = JSON.parse(localStorage.getItem("attendanceRecords")) || [];
  // Get the current clock-in session (if someone is clocked in)
  let currentSession = JSON.parse(localStorage.getItem("currentSession")) || null;

  // Show the right buttons and status when the page loads
  showClockStatus();
  showAttendanceTable();

  // When you click Clock In
  clockInBtn.onclick = function() {
    // Ask for the employee's name
    const name = prompt("Enter employee name for clock in:");
    if (!name) return; // If no name, do nothing
    // Get the current date and time
    const now = new Date();
    // Save the session (not yet clocked out)
    currentSession = {
      name: name,
      date: now.toLocaleDateString(),
      clockIn: now.toLocaleTimeString(),
      clockOut: ""
    };
    localStorage.setItem("currentSession", JSON.stringify(currentSession));
    showClockStatus();
  };

  // When you click Clock Out
  clockOutBtn.onclick = function() {
    if (!currentSession) return;
    // Get the current time
    const now = new Date();
    // Save the clock out time
    currentSession.clockOut = now.toLocaleTimeString();
    // Add this record to the list
    attendanceRecords.push(currentSession);
    // Save the list in the browser
    localStorage.setItem("attendanceRecords", JSON.stringify(attendanceRecords));
    // Remove the current session
    localStorage.removeItem("currentSession");
    currentSession = null;
    showClockStatus();
    showAttendanceTable();
  };

  // Show the clock in/out status and which buttons to display
  function showClockStatus() {
    if (currentSession) {
      clockStatus.textContent = `Status: ${currentSession.name} clocked in at ${currentSession.clockIn}`;
      clockInBtn.style.display = "none";
      clockOutBtn.style.display = "inline-block";
    } else {
      clockStatus.textContent = "Status: No one clocked in.";
      clockInBtn.style.display = "inline-block";
      clockOutBtn.style.display = "none";
    }
  }

  // Show all attendance records in the table
  function showAttendanceTable() {
    attendanceTableBody.innerHTML = "";
    attendanceRecords.forEach(function(record) {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${record.name}</td>
        <td>${record.date}</td>
        <td>${record.clockIn}</td>
        <td>${record.clockOut}</td>
      `;
      attendanceTableBody.appendChild(row);
    });
  }

  // --- Leave Request ---
  // Get the form and table for leave requests
  const leaveForm = document.getElementById("leaveForm");
  const leaveTableBody = document.querySelector("#leaveTable tbody");
  // Get saved leave requests from browser, or start with empty list
  let leaves = JSON.parse(localStorage.getItem("leaves")) || [];
  showLeaveTable();

  // When you submit the leave form
  leaveForm.onsubmit = function(e) {
    e.preventDefault();
    // Get all the values from the form
    const employee = document.getElementById("leaveEmployee").value.trim();
    const type = document.getElementById("leaveType").value.trim();
    const from = document.getElementById("leaveFrom").value;
    const to = document.getElementById("leaveTo").value;
    const reason = document.getElementById("leaveReason").value.trim();
    // Add the new leave request to the list
    leaves.push({ employee: employee, type: type, from: from, to: to, reason: reason, status: "Pending" });
    // Save the list in the browser
    localStorage.setItem("leaves", JSON.stringify(leaves));
    showLeaveTable();
    leaveForm.reset();
  };

  // Show all leave requests in the table
  function showLeaveTable() {
    leaveTableBody.innerHTML = "";
    leaves.forEach(function(leave) {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${leave.employee}</td>
        <td>${leave.type}</td>
        <td>${leave.from}</td>
        <td>${leave.to}</td>
        <td>${leave.reason}</td>
        <td>${leave.status}</td>
      `;
      leaveTableBody.appendChild(row);
    });
  }
}
  } else if (section === "payroll") {
    // Render Payroll UI
    content.innerHTML = `
      <h2>Payroll Management</h2>
      <form id="payrollForm">
        <input type="text" id="payrollEmployee" placeholder="Employee Name" required>
        <input type="number" id="payrollBasic" placeholder="Basic Salary" required>
        <input type="number" id="payrollAllowances" placeholder="Allowances" value="0" required>
        <input type="number" id="payrollDeductions" placeholder="Deductions" value="0" required>
        <input type="month" id="payrollMonth" required>
        <button type="submit">Add Payroll</button>
      </form>
      <h3>Payroll Records</h3>
      <table id="payrollTable">
        <thead>
          <tr>
            <th>Employee Name</th>
            <th>Month</th>
            <th>Basic</th>
            <th>Allowances</th>
            <th>Deductions</th>
            <th>Net Salary</th>
          </tr>
        </thead>
        <tbody></tbody>
      </table>
    `;
    initPayroll();
// =================== PAYROLL MODULE (Simple & Commented) ===================
function initPayroll() {
  // Get the form and table body
  const form = document.getElementById("payrollForm");
  const tableBody = document.querySelector("#payrollTable tbody");
  // Get saved payroll records from browser, or start with empty list
  let payrolls = JSON.parse(localStorage.getItem("payrolls")) || [];
  showPayrollTable();

  // When you submit the payroll form
  form.onsubmit = function(e) {
    e.preventDefault();
    // Get all the values from the form
    const employee = document.getElementById("payrollEmployee").value.trim();
    const basic = parseFloat(document.getElementById("payrollBasic").value) || 0;
    const allowances = parseFloat(document.getElementById("payrollAllowances").value) || 0;
    const deductions = parseFloat(document.getElementById("payrollDeductions").value) || 0;
    const month = document.getElementById("payrollMonth").value;
    // Calculate net salary
    const net = basic + allowances - deductions;
    // Add the new payroll record to the list
    payrolls.push({ employee, month, basic, allowances, deductions, net });
    // Save the list in the browser
    localStorage.setItem("payrolls", JSON.stringify(payrolls));
    showPayrollTable();
    form.reset();
  };

  // Show all payroll records in the table
  function showPayrollTable() {
    tableBody.innerHTML = "";
    payrolls.forEach(function(pay) {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${pay.employee}</td>
        <td>${pay.month}</td>
        <td>${pay.basic.toFixed(2)}</td>
        <td>${pay.allowances.toFixed(2)}</td>
        <td>${pay.deductions.toFixed(2)}</td>
        <td><b>${pay.net.toFixed(2)}</b></td>
      `;
      tableBody.appendChild(row);
    });
  }
}
  } else if (section === "reports") {
    // Render Reports UI (simple placeholder for learning)
    content.innerHTML = `
      <h2>Reports & Analytics</h2>
      <form id="reportForm">
        <label for="reportType">Report Type:</label>
        <select id="reportType" required>
          <option value="attendance">Attendance</option>
          <option value="payroll">Payroll</option>
          <option value="leave">Leave</option>
        </select>
        <label for="reportFrom">From:</label>
        <input type="date" id="reportFrom" required>
        <label for="reportTo">To:</label>
        <input type="date" id="reportTo" required>
        <button type="submit">Generate Report</button>
      </form>
      <div style="display:flex; align-items:center; gap:10px;">
        <h3 style="margin:0;">Report Results</h3>
        <button id="reportExportCsv" style="padding:6px 10px;">Export CSV</button>
      </div>
      <table id="reportTable">
        <thead>
          <tr id="reportTableHead">
            <!-- Will be filled dynamically -->
          </tr>
        </thead>
        <tbody id="reportTableBody">
          <!-- Will be filled dynamically -->
        </tbody>
      </table>
    `;
    initReports();
// =================== REPORTS MODULE (Simple & Commented) ===================
function initReports() {
  const form = document.getElementById("reportForm");
  const tableHead = document.getElementById("reportTableHead");
  const tableBody = document.getElementById("reportTableBody");

  form.onsubmit = function(e) {
    e.preventDefault();
    const type = document.getElementById("reportType").value;
    const from = document.getElementById("reportFrom").value;
    const to = document.getElementById("reportTo").value;
    // For demo: just show all data for the selected type (no real date filtering)
    if (type === "attendance") {
      showAttendanceReport();
    } else if (type === "payroll") {
      showPayrollReport();
    } else if (type === "leave") {
      showLeaveReport();
    }
  };

  // Add a Print button for clean print to PDF
  const printBtn = document.createElement('button');
  printBtn.textContent = 'Print';
  printBtn.style.marginLeft = '8px';
  printBtn.onclick = function() { window.print(); };
  const titleRow = document.querySelector('#reportTable').previousElementSibling;
  if (titleRow && titleRow.appendChild) titleRow.appendChild(printBtn);

  // Export current report table as CSV
  const exportBtn = document.getElementById("reportExportCsv");
  if (exportBtn) {
    exportBtn.onclick = function() {
      exportTableToCsv("reportTable", "report.csv");
    };
  }

  function showAttendanceReport() {
    tableHead.innerHTML = `
      <th>Employee Name</th>
      <th>Date</th>
      <th>Clock In</th>
      <th>Clock Out</th>
    `;
    const records = JSON.parse(localStorage.getItem("attendanceRecords")) || [];
    tableBody.innerHTML = records.map(r => `
      <tr>
        <td>${r.name}</td>
        <td>${r.date}</td>
        <td>${r.clockIn}</td>
        <td>${r.clockOut}</td>
      </tr>
    `).join("");
  }
  function showPayrollReport() {
    tableHead.innerHTML = `
      <th>Employee Name</th>
      <th>Month</th>
      <th>Basic</th>
      <th>Allowances</th>
      <th>Deductions</th>
      <th>Net Salary</th>
    `;
    const records = JSON.parse(localStorage.getItem("payrolls")) || [];
    tableBody.innerHTML = records.map(r => `
      <tr>
        <td>${r.employee}</td>
        <td>${r.month}</td>
        <td>${r.basic.toFixed(2)}</td>
        <td>${r.allowances.toFixed(2)}</td>
        <td>${r.deductions.toFixed(2)}</td>
        <td><b>${r.net.toFixed(2)}</b></td>
      </tr>
    `).join("");
  }
  function showLeaveReport() {
    tableHead.innerHTML = `
      <th>Employee Name</th>
      <th>Type</th>
      <th>From</th>
      <th>To</th>
      <th>Reason</th>
      <th>Status</th>
    `;
    const records = JSON.parse(localStorage.getItem("leaves")) || [];
    tableBody.innerHTML = records.map(r => `
      <tr>
        <td>${r.employee}</td>
        <td>${r.type}</td>
        <td>${r.from}</td>
        <td>${r.to}</td>
        <td>${r.reason}</td>
        <td>${r.status}</td>
      </tr>
    `).join("");
  }
}
  } else if (section === "settings") {
    content.innerHTML = `
      <h2>Settings</h2>
      <div style="background:#f8fafc; padding:16px; border-radius:8px; max-width:520px; box-shadow:0 1px 4px rgba(0,0,0,0.03);">
        <label style="display:flex; align-items:center; gap:10px; font-weight:600;">
          <input type="checkbox" id="darkModeToggle"> Enable Dark Mode
        </label>
        <p style="margin-top:8px; color:#555;">This preference is saved in your browser.</p>
      </div>
    `;
    initSettings();
  } else if (section === "profile") {
    content.innerHTML = `
      <h2>Profile</h2>
      <form id="profileForm" style="max-width:520px; background:#f8fafc; padding:16px; border-radius:8px; box-shadow:0 1px 4px rgba(0,0,0,0.03);">
        <label>Name</label>
        <input type="text" id="profileName" placeholder="Your name" required>
        <label>Email</label>
        <input type="email" id="profileEmail" placeholder="Your email" required>
        <label>Avatar</label>
        <input type="file" id="profileAvatar" accept="image/*">
        <div style="display:flex; gap:10px; align-items:center; margin:8px 0;">
          <img id="profilePreview" src="images/pic.jpg" alt="Preview" style="width:56px; height:56px; border-radius:50%; object-fit:cover; border:1px solid #ddd;" />
          <button type="submit">Save Profile</button>
        </div>
        <h3 style="margin-top:16px;">Change Password (scaffold)</h3>
        <input type="password" id="oldPassword" placeholder="Old password" disabled>
        <input type="password" id="newPassword" placeholder="New password" disabled>
        <small>Note: This is a UI scaffold only (no backend yet).</small>
      </form>
    `;
    initProfile();
  } else {
    content.innerHTML = `
      <h2>Dashboard</h2>
      <p>Select a section from the sidebar.</p>
      <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap:16px; margin-top:12px;">
        <div class="content-area" style="padding:16px;">
          <h3>Attendance Trend</h3>
          <canvas id="chartAttendance" height="160"></canvas>
        </div>
        <div class="content-area" style="padding:16px;">
          <h3>Headcount by Department</h3>
          <canvas id="chartHeadcount" height="160"></canvas>
        </div>
        <div class="content-area" style="padding:16px;">
          <h3>Payroll by Month</h3>
          <canvas id="chartPayroll" height="160"></canvas>
        </div>
      </div>
    `;
    initDashboardCharts();
  }
}

// =================== LOGOUT ===================
function logout() {
  alert("Logging out...");
  window.location.href = "Index.html";
}

// =================== SIDEBAR TOGGLE ===================
function toggleSidebar() {
  document.getElementById("sidebar").classList.toggle("collapsed");
}

// =================== SETTINGS (Dark Mode) ===================
function initSettings() {
  const checkbox = document.getElementById("darkModeToggle");
  if (!checkbox) return;
  const saved = localStorage.getItem("theme") || "light";
  checkbox.checked = (saved === "dark");
  applyTheme(saved);
  checkbox.onchange = function() {
    const next = checkbox.checked ? "dark" : "light";
    localStorage.setItem("theme", next);
    applyTheme(next);
  };
}

function applyTheme(theme) {
  const body = document.body;
  if (theme === "dark") {
    body.classList.add("dark");
  } else {
    body.classList.remove("dark");
  }
}

// Apply theme on initial load
applyTheme(localStorage.getItem("theme") || "light");

// =================== CSV HELPERS ===================
function downloadCsv(filename, rows) {
  const csvContent = rows.map(r => r.map(escapeCsv).join(",")).join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function escapeCsv(value) {
  const v = String(value ?? "");
  if (/[",\n]/.test(v)) return '"' + v.replace(/"/g, '""') + '"';
  return v;
}

function exportTableToCsv(tableId, filename) {
  const table = document.getElementById(tableId);
  if (!table) return;
  const headCells = Array.from(table.querySelectorAll("thead th")).map(th => th.textContent.trim());
  const bodyRows = Array.from(table.querySelectorAll("tbody tr")).map(tr =>
    Array.from(tr.querySelectorAll("td")).map(td => td.textContent.trim())
  );
  downloadCsv(filename, [headCells, ...bodyRows]);
}

// =================== DASHBOARD CHARTS ===================
function initDashboardCharts() {
  if (typeof Chart === "undefined") return;
  // Attendance trend by date (count of records per date)
  const attendance = JSON.parse(localStorage.getItem("attendanceRecords")) || [];
  const dateToCount = attendance.reduce((map, r) => {
    map[r.date] = (map[r.date] || 0) + 1;
    return map;
  }, {});
  const attLabels = Object.keys(dateToCount);
  const attValues = attLabels.map(d => dateToCount[d]);
  const attCtx = document.getElementById("chartAttendance");
  if (attCtx) new Chart(attCtx, {
    type: "line",
    data: { labels: attLabels, datasets: [{ label: "Clock-ins", data: attValues, borderColor: "#2563eb", backgroundColor: "rgba(37,99,235,0.2)", tension: 0.3 }] },
    options: { plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true } } }
  });

  // Headcount by department
  const employees = JSON.parse(localStorage.getItem("employees")) || [];
  const deptToCount = employees.reduce((map, e) => { map[e.dept] = (map[e.dept] || 0) + 1; return map; }, {});
  const deptLabels = Object.keys(deptToCount);
  const deptValues = deptLabels.map(d => deptToCount[d]);
  const headCtx = document.getElementById("chartHeadcount");
  if (headCtx) new Chart(headCtx, {
    type: "bar",
    data: { labels: deptLabels, datasets: [{ label: "Headcount", data: deptValues, backgroundColor: "#10b981" }] },
    options: { plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true } } }
  });

  // Payroll by month (sum net by YYYY-MM)
  const payrolls = JSON.parse(localStorage.getItem("payrolls")) || [];
  const monthToNet = payrolls.reduce((map, p) => {
    map[p.month] = (map[p.month] || 0) + (Number(p.net) || 0);
    return map;
  }, {});
  const payLabels = Object.keys(monthToNet);
  const payValues = payLabels.map(m => Number(monthToNet[m].toFixed ? monthToNet[m].toFixed(2) : monthToNet[m]));
  const payCtx = document.getElementById("chartPayroll");
  if (payCtx) new Chart(payCtx, {
    type: "bar",
    data: { labels: payLabels, datasets: [{ label: "Net Salary", data: payValues, backgroundColor: "#f59e0b" }] },
    options: { plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true } } }
  });
}

// =================== PROFILE ===================
function initProfile() {
  const form = document.getElementById("profileForm");
  if (!form) return;
  const nameInput = document.getElementById("profileName");
  const emailInput = document.getElementById("profileEmail");
  const fileInput = document.getElementById("profileAvatar");
  const preview = document.getElementById("profilePreview");
  const saved = JSON.parse(localStorage.getItem("profile") || "{}");
  if (saved.name) nameInput.value = saved.name;
  if (saved.email) emailInput.value = saved.email;
  if (saved.avatar) preview.src = saved.avatar;

  fileInput.onchange = function() {
    const file = fileInput.files && fileInput.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(e) {
      preview.src = e.target.result;
    };
    reader.readAsDataURL(file);
  };

  form.onsubmit = function(e) {
    e.preventDefault();
    const profile = { name: nameInput.value.trim(), email: emailInput.value.trim(), avatar: preview.src };
    localStorage.setItem("profile", JSON.stringify(profile));
    // reflect in header
    const headerName = document.getElementById("headerUserName");
    const headerImg = document.getElementById("headerUserImg");
    if (headerName) headerName.textContent = profile.name || "Admin";
    if (headerImg && profile.avatar) headerImg.src = profile.avatar;
    alert("Profile saved.");
  };
}

// =================== EMPLOYEE MANAGEMENT ===================
function initEmployeeManagement() {
  // Get DOM elements
  const form = document.getElementById("employeeForm");
  const tableBody = document.querySelector("#employeeTable tbody");
  const searchBar = document.getElementById("empSearch");
  const pagination = document.getElementById("empPagination");
  if (!form || !tableBody || !searchBar) return; // Wait for DOM

  let employees = JSON.parse(localStorage.getItem("employees")) || [];
  let editIndex = null;
  let currentPage = 1;
  const rowsPerPage = 5;

  // Add or update employee
  form.onsubmit = function(e) {
    e.preventDefault();
    const name = document.getElementById("empName").value.trim();
    const dept = document.getElementById("empDept").value.trim();
    const email = document.getElementById("empEmail").value.trim();
    if (!validateEmail(email)) {
      alert("Please enter a valid email.");
      return;
    }
    if (employees.some((emp, idx) => emp.email === email && idx !== editIndex)) {
      alert("An employee with this email already exists!");
      return;
    }
    if (editIndex !== null) {
      employees[editIndex] = { name, dept, email };
      editIndex = null;
    } else {
      employees.push({ name, dept, email });
    }
    saveAndRender();
    form.reset();
  };

  // Save and render table
  function saveAndRender() {
    localStorage.setItem("employees", JSON.stringify(employees));
    renderTable(searchBar.value);
  }

  // Render table with pagination
  function renderTable(filter = "") {
    tableBody.innerHTML = "";
    let filtered = employees.filter(emp =>
      emp.name.toLowerCase().includes(filter.toLowerCase()) ||
      emp.dept.toLowerCase().includes(filter.toLowerCase()) ||
      emp.email.toLowerCase().includes(filter.toLowerCase())
    );
    const start = (currentPage - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    const paginated = filtered.slice(start, end);
    paginated.forEach(emp => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${emp.name}</td>
        <td>${emp.dept}</td>
        <td>${emp.email}</td>
        <td>
          <button class="edit-btn">Edit</button>
          <button class="delete-btn">Delete</button>
        </td>
      `;
      // Edit button
      row.querySelector(".edit-btn").onclick = function() {
        document.getElementById("empName").value = emp.name;
        document.getElementById("empDept").value = emp.dept;
        document.getElementById("empEmail").value = emp.email;
        editIndex = employees.indexOf(emp);
      };
      // Delete button
      row.querySelector(".delete-btn").onclick = function() {
        employees.splice(employees.indexOf(emp), 1);
        saveAndRender();
      };
      tableBody.appendChild(row);
    });
    renderPagination(filtered.length);
  }

  // Pagination controls
  function renderPagination(total) {
    const totalPages = Math.ceil(total / rowsPerPage);
    pagination.innerHTML = "";
    for (let i = 1; i <= totalPages; i++) {
      const btn = document.createElement("button");
      btn.textContent = i;
      btn.className = (i === currentPage) ? "active" : "";
      btn.onclick = () => {
        currentPage = i;
        renderTable(searchBar.value);
      };
      pagination.appendChild(btn);
    }
  }

  // Live search
  searchBar.oninput = function() {
    currentPage = 1;
    renderTable(searchBar.value);
  };

  // Export CSV for employees
  const exportBtn = document.getElementById("empExportCsv");
  if (exportBtn) {
    exportBtn.onclick = function() {
      const headers = ["Name","Department","Email"];
      const rows = employees.map(e => [e.name, e.dept, e.email]);
      downloadCsv("employees.csv", [headers, ...rows]);
    };
  }

  // Email validation helper
  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  renderTable();
}

// =================== RECRUITMENT MANAGEMENT ===================
function initRecruitment() {
  const form = document.getElementById("jobForm");
  const search = document.getElementById("jobSearch");
  const tableBody = document.querySelector("#jobTable tbody");
  if (!form || !tableBody || !search) return;
  let jobs = JSON.parse(localStorage.getItem("jobs")) || [];
  let editIndex = null;
  renderTable();

  // Add or update job
  form.onsubmit = function(e) {
    e.preventDefault();
    const title = document.getElementById("jobTitle").value.trim();
    const dept = document.getElementById("jobDept").value.trim();
    const desc = document.getElementById("jobDesc").value.trim();
    const status = document.getElementById("jobStatus").value;
    if (editIndex !== null) {
      jobs[editIndex] = { title, dept, desc, status };
      editIndex = null;
    } else {
      jobs.push({ title, dept, desc, status });
    }
    saveAndRender();
    form.reset();
  };

  // Save and render table
  function saveAndRender() {
    localStorage.setItem("jobs", JSON.stringify(jobs));
    renderTable(search.value);
  }

  // Render jobs table
  function renderTable(filter = "") {
    tableBody.innerHTML = "";
    jobs
      .filter(job =>
        job.title.toLowerCase().includes(filter.toLowerCase()) ||
        job.dept.toLowerCase().includes(filter.toLowerCase()) ||
        job.desc.toLowerCase().includes(filter.toLowerCase()) ||
        job.status.toLowerCase().includes(filter.toLowerCase())
      )
      .forEach((job, idx) => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${job.title}</td>
          <td>${job.dept}</td>
          <td>${job.desc}</td>
          <td>${job.status}</td>
          <td>
            <button class="edit-btn">Edit</button>
            <button class="delete-btn">Delete</button>
          </td>
        `;
        // Edit button
        row.querySelector(".edit-btn").onclick = function() {
          document.getElementById("jobTitle").value = job.title;
          document.getElementById("jobDept").value = job.dept;
          document.getElementById("jobDesc").value = job.desc;
          document.getElementById("jobStatus").value = job.status;
          editIndex = idx;
        };
        // Delete button
        row.querySelector(".delete-btn").onclick = function() {
          jobs.splice(idx, 1);
          saveAndRender();
        };
        tableBody.appendChild(row);
      });
  }

  // Live search
  search.oninput = function() {
    renderTable(search.value);
  };
}
