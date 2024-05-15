let selectedPriority = "medium";
let subtasks;
let users = [];
let selectedUsers = [];
let categories = [
  "User Story",
  "Technical Task",
  "Feature",
  "Bug",
  "Documentation",
  "Design",
  "Testing QA",
  "Analyse/Research",
];
let assignedContainerClicked = false;
let categoriesContainerClicked = false;

async function initAddTask() {
  await includeHTML();
  await loadCurrentUsers();
  await loadAllTasks();
  contacts = await loadAllContacts();
  orderContacts();
  taskId = findHighestTaskId();
  showHeaderUser();
}

async function createTask(status) {
  let title = document.getElementById("taskTitle");
  let discription = document.getElementById("taskDiscription");
  let date = document.getElementById("taskDate");
  let category = document.getElementById("categoryInput");

  if (users.length == 0) {
    users = "";
  }
  taskId++;
  let newTask = {
    id: taskId,
    status: status,
    title: title.value,
    description: discription.value,
    users: users,
    dueDate: date.value,
    prio: selectedPriority,
    category: category.value,
    subtasks: subtasks,
  };
  await postData("/allTasks", newTask);
  allTasks.push(newTask);
  addedTaskAnimation();
  if (window.location.href === 'http://127.0.0.1:5500/add_task.html' || window.location.href === 'https://join-165.developerakademie.net/join_165/add_task.html') {
    window.location.href = "./board.html";
  } else {
    closeAddTaskPopup();
    clearPopupForm();
    renderNewCard(newTask);
  }
}

function clearPopupForm() {
  let title = document.getElementById("taskTitle");
  let discription = document.getElementById("taskDiscription");
  let date = document.getElementById("taskDate");
  let category = document.getElementById("categoryInput");
  let contentAssignedUsers = document.getElementById("contentAssignedUsers");
  let contentSubtasks = document.getElementById("contentSubtasks");
  title.value = "";
  discription.value = "";
  date.value = "";
  category.value = "";
  contentAssignedUsers.innerHTML = "";
  contentSubtasksopenCategoriesIcon.innerHTML = "";
}

function renderNewCard(newTask) {
  let toDoContainer = document.getElementById("toDoContainer");
  let inProgressContainer = document.getElementById("inProgressContainer");
  let awaitFeedbackContainer = document.getElementById("awaitFeedbackContainer");
  if (newTask.status === 'todo') {
    displayNewCard(newTask, toDoContainer);
  }
  if (newTask.status === 'progress') {
    displayNewCard(newTask, inProgressContainer);
  }
  if (newTask.status === 'feedback') {
    displayNewCard(newTask, awaitFeedbackContainer);
  }
}

function displayNewCard(newTask, container) {
  let taskId = newTask.id;
  const i = allTasks.findIndex(task => task.id === newTask.id);
  container.innerHTML += generateCardHTML(newTask, i, taskId);
  categoryColor(i, taskId);
  generateProgressbar(i, newTask);
  renderUsers(i, taskId);
  generateCardPrio(newTask, i, taskId);
}

function addedTaskAnimation() {
  let addedTaskPopup = document.getElementById('addedTaskPopup');

  addedTaskPopup.style.display = 'flex';
  addedTaskPopup.offsetHeight;
  showPopupAndAnimate();
}

function showPopupAndAnimate() {
  let addedTaskPopup = document.getElementById('addedTaskPopup');

  addedTaskPopup.style.bottom = '110%';
  setTimeout(() => {
      addedTaskPopup.style.display = 'none';
      addedTaskPopup.style.bottom = '-10%';
  }, 2500);
}

function validateForm(event, status) {
  event.preventDefault(); // Verhindert das Standardverhalten des Buttons

  let title = document.getElementById("taskTitle");
  let dueDate = document.getElementById("taskDate");
  let category = document.getElementById("categoryInput");
  let titleError = document.getElementById("errorMessageTitle");
  let dateError = document.getElementById("errorMessageDate");
  let categoryError = document.getElementById("errorMessageCategory");

  let isValid = true;

  if (title.value.trim() === "") {
      title.style.border = "1px solid #FF8190";
      titleError.innerText = "Please fill out this field.";
      isValid = false;
  } else {
      title.style.border = "";
      titleError.innerText = "";
  }

  if (dueDate.value === "") {
      dueDate.style.border = "1px solid #FF8190";
      dateError.innerText = "Please fill out this field.";
      isValid = false;
  } else {
      dueDate.style.border = "";
      dateError.innerText = "";
  }

  if (category.value.trim() === "") {
      category.style.border = "1px solid #FF8190";
      categoryError.innerText = "Please fill out this field.";
      isValid = false;
  } else {
      category.style.border = "";
      categoryError.innerText = "";
  }

  if (isValid) {
      addedTaskAnimation();
      setTimeout(() => {
          createTask(status);
      }, 1500);
  }

  return isValid;
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

function addSubtask() {
  let input = document.getElementById("subtasksInput");
  let subtaskText = input.value.trim();

  if (subtaskText !== "") {
    if (!subtasks) {
      subtasks = [];
    }
    subtasks.push({ name: subtaskText, completed: false });
    input.value = "";
  }
  renderSubtasks();
}

function renderSubtasks() {
  let subtasksList = document.getElementById("contentSubtasks");
  subtasksList.innerHTML = "";

  for (let i = 0; i < subtasks.length; i++) {
    const task = subtasks[i];
    subtasksList.innerHTML += subtaskTemplate(task, i);
  }
}

function enableIcons() {
  let iconContainer = document.querySelector(".subtask-icon-container");
  iconContainer.querySelector("img").removeAttribute("onclick");

  iconContainer.innerHTML = `
    <div onclick="clearSubtaskInput()"><img src="./assets/icons/subtask_icons/close.png" alt="X"></div>
    <div><img src="./assets/icons/mini_seperator.png" alt="/"></div>
    <div onclick="addSubtask()"><img src="./assets/icons/subtask_icons/check.png" alt="ADD" ></div>
  `;
}

function clearSubtaskInput() {
  let iconContainer = document.querySelector(".subtask-icon-container");
  input = document.getElementById("subtasksInput");
  input.value = "";

  iconContainer.innerHTML = `
    <img src="./assets/icons/subtask_icons/add.png" onclick="enableIcons()"></img>
  `;
}

function subtaskTemplate(task, i) {
  return `
  <div id="subtask${i}" class="subtask">
    <li>
      <div>${task.name}</div>
      <div class="subtask-edit-icons">
        <div onclick="editSubtask('${task.name}', ${i})"><img src="./assets/icons/subtask_icons/edit.png" alt="EDIT"></div>
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
    <div class="edit-input">
      <input id="changedSubtask${i}" value="${task}">
        <div class="edit-icons">
          <img src="./assets/icons/subtask_icons/check.png" alt="OK" onclick="addChangedSubtask(${i})">
          <img src="./assets/icons/mini_seperator.png" alt="/">
          <img src="./assets/icons/subtask_icons/delete.png" alt="X" onclick="deleteSubtask(${i})">  
      </div>
    </div>
  `;
}

function addChangedSubtask(i) {
  let input = document.getElementById(`changedSubtask${i}`);
  let subtaskText = input.value.trim();
  subtasks[i]["name"] = subtaskText;
  input.value = "";
  renderSubtasks();
}

function deleteSubtask(i) {
  subtasks.splice(i, 1);
  renderSubtasks();
}

async function loadContacts() {
  await loadAllContacts();
  extractInitials(contacts);
  randomBackgroundColor();
  sortContacts();
}

function showUsers() {
  let userList = document.getElementById("dropdown-users");
  let icon = document.getElementById("openUserIcon");
  userList.innerHTML = "";
  icon.style.transform = "rotate(180deg)";
  loadContacts();
  if (!assignedContainerClicked) {
    userList.style.border = "1px solid #CDCDCD";
    displayUserList(userList);
  } else {
    userList.style.border = "0px";
    hideUsers();
  }
}

function displayUserList(userList) {
  assignedContainerClicked = true;
  for (let i = 0; i < contacts.length; i++) {
    const contact = contacts[i];
    if (contact !== null) {
      userList.innerHTML += userTemplate(contact);
    }
  }
  // Wiederherstellen des Status der ausgewählten Benutzer
  selectedUsers.forEach((user) => {
    const checkbox = document.querySelector(
      `input[data-contact='${JSON.stringify(user)}']`
    );
    if (checkbox) {
      checkbox.checked = true;
    }
  });
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
      <input id="confirm" type="checkbox" name="assignedUser" value="${
        contact.name
      }" data-contact='${JSON.stringify(
    contact
  )}' onchange="handleCheckboxChange(event)"><label for="confirm"></label>
    </div>
  </div>
`;
}

function hideUsers() {
  assignedContainerClicked = false;
  let userList = document.getElementById("dropdown-users");
  let icon = document.getElementById("openUserIcon");
  icon.style.transform = "rotate(0deg)";
  userList.innerHTML = "";
}

function handleCheckboxChange(event) {
  const checkbox = event.target;
  const contactData = JSON.parse(checkbox.getAttribute("data-contact"));

  if (checkbox.checked) {
    selectedUsers.push(contactData); // Aktualisieren des Status der ausgewählten Benutzer
    users.push(contactData); // Hinzufügen des ausgewählten Benutzers zum users-Array
    renderAssignedUser();
  } else {
    const selectedUserIndex = selectedUsers.findIndex(
      (user) => user.name === contactData.name
    );
    if (selectedUserIndex !== -1) {
      selectedUsers.splice(selectedUserIndex, 1); // Aktualisieren des Status der ausgewählten Benutzer
    }
    const userIndex = users.findIndex((user) => user.name === contactData.name);
    if (userIndex !== -1) {
      users.splice(userIndex, 1); // Entfernen des ausgewählten Benutzers aus dem users-Array
      renderAssignedUser();
    }
  }
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
    <div class="initialien-addtask-container" style="background-color: ${user.color};">
      ${user.initials}
    </div>
    `;
  }
}

function changeClearButton(button, newSrc) {
  let img = button.querySelector("img");
  img.src = newSrc;
}

function resetClearButton(button, newSrc) {
  let img = button.querySelector("img");
  img.src = newSrc;
}

function renderCategories() {
  let categoryContainer = document.getElementById('dropdown-categories');
  categoryContainer.innerHTML = '';

  for (let i = 0; i < categories.length; i++) {
    const category = categories[i];
    
    categoryContainer.innerHTML += `
      <div class="task-category" onclick="selectCategory('${category}')">
        ${category}
      </div>
    `;
  }
}

function selectCategory(categoryText) {
  let categoryInput = document.getElementById('categoryInput');
  let categoryList = document.getElementById("dropdown-categories");

  categoryInput.value = categoryText;
  hideCategories();
  categoryList.style.border = "0px";
}

function openCategories() {
  let categoryList = document.getElementById("dropdown-categories");
  let icon = document.getElementById("openCategoriesIcon");
  icon.style.transform = "rotate(180deg)";
  categoryList.innerHTML = "";
  if (!categoriesContainerClicked) {
    categoriesContainerClicked = true;
    categoryList.style.border = "1px solid #CDCDCD";
    renderCategories();
  } else {
    categoriesContainerClicked = false;
    categoryList.style.border = "0px";
    hideCategories();
  }
}

function hideCategories() {
  categoriesContainerClicked = false;
  let categoryList = document.getElementById("dropdown-categories");
  let icon = document.getElementById("openCategoriesIcon");
  icon.style.transform = "rotate(0deg)";
  categoryList.innerHTML = "";
}