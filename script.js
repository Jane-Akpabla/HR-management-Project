
/**************** LOGIN SECTION ****************/
document.getElementById("loginform")?.addEventListener("submit", function(e) {
  e.preventDefault();

  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  // === Hardcoded credentials ===
  if (username === "admin" && password === "1234") {
    window.location.href = "dashboard.html";
  } else {
    alert("Invalid username or password. Try admin / 1234");
  }
});


/**************** DASHBOARD NAVIGATION ****************/
function loadSection(section) {
  const content = document.getElementById("content");

  switch (section) {
    case "employee":
      content.innerHTML = `
        <h2>Employee Management</h2>
        <form id="employeeForm">
          <input type="text" id="empName" placeholder="Employee Name" required>
          <input type="text" id="empDept" placeholder="Department" required>
          <input type="email" id="empEmail" placeholder="Email" required>
          <button type="submit">Add Employee</button>
        </form>

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
      `;
      initEmployeeManagement(); 
      break;

    case "recruitment":
      content.innerHTML = "<h2>Recruitment</h2><p>Post jobs, manage applications, and onboarding.</p>";
      break;

    case "attendance":
      content.innerHTML = "<h2>Attendance & Leave</h2><p>Track clock-in/out and leave requests.</p>";
      break;

    case "payroll":
      content.innerHTML = "<h2>Payroll</h2><p>View and calculate salaries, deductions, and payslips.</p>";
      break;

    case "reports":
      content.innerHTML = "<h2>Reports & Analytics</h2><p>Generate reports and insights here.</p>";
      break;

    default:
      content.innerHTML = "<h2>Dashboard</h2><p>Select a section from the sidebar.</p>";
  }
}


/**************** LOGOUT ****************/
function logout() {
  alert("Logging out...");
  window.location.href = "index.html"; 
}


/**************** SIDEBAR TOGGLE ****************/
function toggleSidebar() {
  document.getElementById("sidebar").classList.toggle("collapsed");
}


/**************** EMPLOYEE MANAGEMENT ****************/
function initEmployeeManagement() {
  const form = document.getElementById("employeeForm");
  const tableBody = document.getElementById("employeeTable").querySelector("tbody");

  // === Create a search bar ===
  const searchBar = document.createElement("input");
  searchBar.type = "text";
  searchBar.placeholder = "Search employees...";
  searchBar.style.marginBottom = "15px";
  searchBar.style.width ="300px"
  form.insertAdjacentElement("beforebegin", searchBar);


  // === Load saved employees from localStorage ===
  let employees = JSON.parse(localStorage.getItem("employees")) || [];
  let editIndex = null;
  renderTable();

  // === Add or Update Employee ===
  form.addEventListener("submit", function(e) {
    e.preventDefault();
    const name = document.getElementById("empName").value.trim();
    const dept = document.getElementById("empDept").value.trim();
    const email = document.getElementById("empEmail").value.trim();

    // ✅ Email validation
    if (!validateEmail(email)) {
      alert("Please enter a valid email.");
      return;
    }

    // ✅ Prevent duplicate emails
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
  });

  // === Save & Re-render ===
  function saveAndRender() {
    localStorage.setItem("employees", JSON.stringify(employees));
    renderTable();
  }

  // === Render Table ===
  function renderTable(filter = "") {
    tableBody.innerHTML = "";
    employees
      .filter(emp =>
        emp.name.toLowerCase().includes(filter.toLowerCase()) ||
        emp.dept.toLowerCase().includes(filter.toLowerCase()) ||
        emp.email.toLowerCase().includes(filter.toLowerCase())
      )
      .forEach((emp, idx) => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td class="emp-name">${emp.name}</td>
          <td class="emp-dept">${emp.dept}</td>
          <td class="emp-email">${emp.email}</td>
          <td>
            <button class="edit-btn">Edit</button>
            <button class="delete-btn">Delete</button>
          </td>
        `;

        // Edit
        row.querySelector(".edit-btn").addEventListener("click", function() {
          document.getElementById("empName").value = emp.name;
          document.getElementById("empDept").value = emp.dept;
          document.getElementById("empEmail").value = emp.email;
          editIndex = idx;
        });

        // Delete
        row.querySelector(".delete-btn").addEventListener("click", function() {
          employees.splice(idx, 1);
          saveAndRender();
        });

        tableBody.appendChild(row);
      });
  }

  // === Search in real-time ===
  searchBar.addEventListener("input", function() {
    renderTable(searchBar.value);
  });

  // === Email validation helper ===
  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
}



