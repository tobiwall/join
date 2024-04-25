taskId = 0;
let selectedPriority;
let subtasks = [];
let subtaskId = 0;
let users = [];

function initAddTask() {
  includeHTML();
  load();
}

function createTask(tasksColumn) {
  let title = document.getElementById("taskTitle");
  let discription = document.getElementById("taskDiscription");
  let date = document.getElementById("taskDate");
  let category = document.getElementById("categoryInput");

  let newTask = {
    id: taskId++,
    title: title.value,
    description: discription.value,
    users: users,
    dueDate: date.value,
    prio: selectedPriority,
    category: category.value,
    subtasks: subtasks,
  };

  tasksColumn.push(newTask);

  title.value = "";
  discription.value = "";
  date.value = "";
  category.value = "";
  selectedPriority = prioMedium("medium");
  subtasks = [""];
  subtaskId = 0;
  users = [""];

  renderSubtasks();
  renderAssignedUser();
  renderCards();
  save();
}

function clearAddTaskInput() {
  document.getElementById("taskTitle").value = "";
  document.getElementById("taskDiscription").value = "";
  document.getElementById("taskDate").value = "";
  document.getElementById("categoryInput").value = "";
  document.getElementById("subtasksInput").value = "";
  subtasks = [""];
  subtaskId = 0;
  users = [""];

  renderSubtasks();
  renderAssignedUser();
}

function toggleButton(priority) {
  if (priority === "urgent") {
    prioUrgent(priority);
  } else if (priority === "medium") {
    prioMedium(priority);
  } else if (priority === "low") {
    prioLow(priority);
  }
}

function prioUrgent(priority) {
  document.getElementById(priority).classList.add("urgent-active");
  document.getElementById(priority + "Img").src =
    "./assets/icons/prio_buttons/prio_urgent.png";
  document.getElementById("medium").classList.remove("medium-active");
  document.getElementById("mediumImg").src =
    "./assets/icons/prio_buttons/prio_medium_yellow.png";
  document.getElementById("low").classList.remove("low-active");
  document.getElementById("lowImg").src =
    "./assets/icons/prio_buttons/prio_low_green.png";
  selectedPriority = priority;
}

function prioMedium(priority) {
  document.getElementById(priority).classList.add("medium-active");
  document.getElementById(priority + "Img").src =
    "./assets/icons/prio_buttons/prio_medium.png";
  document.getElementById("urgent").classList.remove("urgent-active");
  document.getElementById("urgentImg").src =
    "./assets/icons/prio_buttons/prio_urgent_red.png";
  document.getElementById("low").classList.remove("low-active");
  document.getElementById("lowImg").src =
    "./assets/icons/prio_buttons/prio_low_green.png";
  selectedPriority = priority;
}

function prioLow(priority) {
  document.getElementById(priority).classList.add("low-active");
  document.getElementById(priority + "Img").src =
    "./assets/icons/prio_buttons/prio_low.png";
  document.getElementById("urgent").classList.remove("urgent-active");
  document.getElementById("urgentImg").src =
    "./assets/icons/prio_buttons/prio_urgent_red.png";
  document.getElementById("medium").classList.remove("medium-active");
  document.getElementById("mediumImg").src =
    "./assets/icons/prio_buttons/prio_medium_yellow.png";
  selectedPriority = priority;
}

function renderSubtasks() {
  let subtasksList = document.getElementById("contentSubtasks");
  subtasksList.innerHTML = "";

  for (let i = 0; i < subtasks.length; i++) {
    const task = subtasks[i];
    subtasksList.innerHTML += subtaskTemplate(task, i);
  }
}

function addSubtask() {
  let input = document.getElementById("subtasksInput");
  let subtaskText = input.value.trim();

  if (subtaskText !== "") {
    subtasks.push(subtaskText);
    subtaskId++;
    input.value = "";
  }
  renderSubtasks();
}

function subtaskTemplate(task, i) {
  return `
  <div id="subtask${i}" class="subtask">
    <li>${task}</li>
    <div class="subtask-edit-icons">
      <img src="./assets/icons/edit_black.png" alt="EDIT" onclick="editSubtask('${task}', ${i})">
      <img src="./assets/icons/delete.png" alt="X" onclick="deleteSubtask(${i})">
    </div>
  </div>
`;
}

function editSubtask(task, i) {
  let subtask = document.getElementById(`subtask${i}`);

  subtask.innerHTML = `
    <div class="edit-input" id="subtask${i}" class="subtask">
      <input id="changedSubtask${i}" value="${task}">
        <div class="edit-icons">
          <img src="./assets/icons/delete.png" alt="X" onclick="deleteSubtask(${i})">
          <img src="./assets/icons/check1.png" alt="OK" onclick="addChangedSubtask(${i})">
      </div>
    </div>
  `;
}

function deleteSubtask(i) {
  subtasks.splice(i, 1);
  renderSubtasks();
}

function addChangedSubtask(i) {
  let input = document.getElementById(`changedSubtask${i}`);
  let subtaskText = input.value.trim();
  subtasks.splice(i, 1, subtaskText);
  input.value = "";
  renderSubtasks();
}

function clearInput() {
  document.getElementById("taskTitle").value = "";
  document.getElementById("taskDiscription").value = "";
  document.getElementById("taskDate").value = "";
  document.getElementById("categoryInput").value = "";
  subtasks = [];
}

function loadContacts() {
  getLocalStorage();
  extractInitials(contacts);
  randomBackgroundColor();
  sortContacts();
}

let assignedContainerClicked = false;

function showUsers() {
  let userList = document.getElementById("dropdown-users");
  userList.innerHTML = "";
  loadContacts();
  if (!assignedContainerClicked) {
    displayUserList(userList);
  } else {
    hideUsers();
  }
}

function displayUserList(userList) {
  assignedContainerClicked = true;
  for (let i = 0; i < contacts.length; i++) {
    const contact = contacts[i];
    userList.innerHTML += userTemplate(contact);
  }
}

function hideUsers() {
  assignedContainerClicked = false;
  let userList = document.getElementById("dropdown-users");
  userList.innerHTML = "";
}

//Close Funktion für Assigned USer funktioniert nicht...
/*
document.addEventListener('click', function(event) {
  var dropdownUsers = document.getElementById('dropdown-users');
  var assignedIcon = document.querySelector('.assigned-icon');
  var isClickInsideDropdown = dropdownUsers.contains(event.target);
  var isClickOnIcon = assignedIcon.contains(event.target);

  if (!isClickInsideDropdown && !isClickOnIcon) {
      // Wenn der Klick außerhalb des Dropdowns oder des Icons liegt, schließe das Dropdown
      dropdownUsers.style.display = 'none';
  }
});

*/

function handleCheckboxChange(event) {
  const checkbox = event.target;
  const contactData = JSON.parse(checkbox.getAttribute("data-contact"));

  if (checkbox.checked) {
    users.push(contactData);
    renderAssignedUser();
  } else {
    const index = users.findIndex((user) => user.name === contactData.name);
    if (index !== -1) {
      users.splice(index, 1);
      renderAssignedUser();
    }
  }
}

function userTemplate(contact) {
  return `
  <div class="user-container">
    <div class="user">
      <div class="user-initials" style="background-color: ${contact.color};">
        ${contact.initials}
      </div>
      <div>
        ${contact.name}
      </div>
    </div>
    <div>
      <input type="checkbox" name="assignedUser" value="${
        contact.name
      }" data-contact='${JSON.stringify(
    contact
  )}' onchange="handleCheckboxChange(event)">
    </div>
  </div>
`;
}

function searchUser() {
  let searchValue = document
    .getElementById("userInput")
    .value.trim()
    .toLowerCase();
  let userList = document.getElementById("dropdown-users");
  userList.innerHTML = "";
  loadContacts();

  for (let i = 0; i < contacts.length; i++) {
    const contact = contacts[i];
    if (contact.name.trim().toLowerCase().includes(searchValue)) {
      userList.innerHTML += userTemplate(contact);
    }
  }
}

function renderAssignedUser() {
  let assignedUsers = document.getElementById("contentAssignedUsers");
  assignedUsers.innerHTML = "";

  for (let i = 0; i < users.length; i++) {
    const user = users[i];

    assignedUsers.innerHTML += `
    <div class="initialien-round-container" style="background-color: ${user.color};">
      ${user.initials}
    </div>
    `;
  }
}

function save() {
  let toDoAsText = JSON.stringify(cardsToDo);
  localStorage.setItem("toDos", toDoAsText);
}

function load() {
  let toDoAsText = localStorage.getItem("toDos");
  if (toDoAsText) {
    cardsToDo = JSON.parse(toDoAsText);
  }
}
