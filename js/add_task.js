let taskId = findHighestId();
let selectedPriority = 'medium';
let subtasks = [];
let subtaskId = 0;
let users = [];

function initAddTask() {
  includeHTML();
  load();
}

function showHighestId() {
  console.log("Die höchste ID ist:", taskId)
}

function findHighestId() {
  let highestId = 0;
  for (let i = 0; i < allTasks.length; i++) {
      if (allTasks[i].id > highestId) {
          highestId = allTasks[i].id;
      }
  }
  return highestId;
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

  if (selectedPriority === 'urgent') {
    cardsUrgent.push(newTask);
  }
  
  tasksColumn.push(newTask);
  allTasks.push(newTask);

  title.value = "";
  discription.value = "";
  date.value = "";
  category.value = "";
  selectedPriority = prioMedium('medium');
  subtasks = [""];
  subtaskId = 0;
  users = [""];

  renderSubtasks();
  renderAssignedUser();
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
    <li>
      <div>${task}</div>
      <div class="subtask-edit-icons">
        <div onclick="editSubtask('${task}', ${i})"><img src="./assets/icons/subtask_icons/edit.png" alt="EDIT"></div>
        <div><img src="./assets/icons/mini_seperator.png" alt="/"></div>
        <div onclick="deleteSubtask(${i})"><img src="./assets/icons/subtask_icons/delete.png" alt="X"></div>
    </div>
  </li>
  </div>
`;
}

function editSubtask(task, i) {
  let subtask = document.getElementById(`subtask${i}`);

  subtask.innerHTML = `
    <div class="edit-input" id="subtask${i}">
      <input id="changedSubtask${i}" value="${task}">
        <div class="edit-icons">
          <img src="./assets/icons/subtask_icons/delete.png" alt="X" onclick="deleteSubtask(${i})">
          <img src="./assets/icons/subtask_icons/check.png" alt="OK" onclick="addChangedSubtask(${i})">
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

function enableIcons() {
  let iconContainer = document.querySelector('.subtask-icon-container');
  iconContainer.querySelector('img').removeAttribute('onclick');

  iconContainer.innerHTML = `
    <div onclick="clearInput()"><img src="./assets/icons/subtask_icons/close.png" alt="X"></div>
    <div><img src="./assets/icons/mini_seperator.png" alt="/"></div>
    <div onclick="addSubtask()"><img src="./assets/icons/subtask_icons/check.png" alt="ADD" ></div>
  `;
}

function save() {
  let toDoAsText = JSON.stringify(cardsToDo);
  let allTasksAsText = JSON.stringify(allTasks);
  let cardsInProgressAsText = JSON.stringify(cardsInProgress);
  let cardsAwaitFeedbackAsText = JSON.stringify(cardsAwaitFeedback);
  let cardsDoneAsText = JSON.stringify(cardsDone);
  let urgendTasks = JSON.stringify(cardsUrgent);

  localStorage.setItem("toDos", toDoAsText);
  localStorage.setItem("allTasks", allTasksAsText);
  localStorage.setItem("inProgress", cardsInProgressAsText);
  localStorage.setItem("awaitFeedback", cardsAwaitFeedbackAsText);
  localStorage.setItem("done", cardsDoneAsText);
  localStorage.setItem("urgent", urgendTasks);
}

function load() {
  let toDoAsText = localStorage.getItem("toDos");
  let allTasksAsText = localStorage.getItem("allTasks");
  let cardsInProgressAsText = localStorage.getItem("inProgress");
  let cardsAwaitFeedbackAsText = localStorage.getItem("awaitFeedback");
  let cardsDoneAsText = localStorage.getItem("done");
  let urgendTasks = localStorage.getItem("urgent");
  
  if (toDoAsText && allTasksAsText && cardsInProgressAsText &&    cardsAwaitFeedbackAsText && cardsDoneAsText && urgendTasks) {
    cardsToDo = JSON.parse(toDoAsText);
    allTasks = JSON.parse(allTasksAsText);
    cardsAwaitFeedback = JSON.parse(cardsInProgressAsText);
    cardsDone = JSON.parse(cardsAwaitFeedbackAsText);
    cardsUrgent = JSON.parse(cardsDoneAsText);
    allTasks = JSON.parse(allTasks);
  }
}
