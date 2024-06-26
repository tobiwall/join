/**
 * validateEditForm(event, i) checks if the required fields are filled
 *
 */
function validateEditForm(event, i) {
  event.preventDefault();

  let title = document.getElementById("editTaskTitle");
  let dueDate = document.getElementById("editTaskDate");
  let titleError = document.getElementById("errorMessageEditTitle");
  let dateError = document.getElementById("errorMessageEditDate");

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

  if (isValid) {
      setTimeout(() => {
        submitChanges(i);
      }, 1500);
  }

  return isValid;
}

/**
 * renderPrioButton(task, i) render the chosen prio
 *
 */
function renderPrioButton(task, i) {
  buttonContainer = document.getElementById("edit-prio-buttons-container");
  taskPrio = task.prio;

  if (taskPrio === "urgent") {
    buttonContainer.innerHTML = prioEditUrgent(i);
  } else if (taskPrio === "medium") {
    buttonContainer.innerHTML = prioEditMedium(i);
  } else if (taskPrio === "low") {
    buttonContainer.innerHTML = prioEditLow(i);
  }
}

function prioEditUrgent(i) {
  return `
    <button type="button" class="prio-button urgent-active" id="urgentEdit" onclick="togglePrioButton('urgent', ${i})">Urgent<img id="urgentImgEdit" src="./assets/icons/prio_buttons/prio_urgent.png" alt=""></button>
    <button type="button" class="prio-button" id="mediumEdit" onclick="togglePrioButton('medium', ${i})">Medium<img id="mediumImgEdit" src="./assets/icons/prio_buttons/prio_medium_yellow.png" alt=""></button>
    <button type="button" class="prio-button" id="lowEdit" onclick="togglePrioButton('low', ${i})">Low<img id="lowImgEdit" src="./assets/icons/prio_buttons/prio_low_green.png" alt=""></button>
  `;
}

function prioEditMedium(i) {
  return `
    <button type="button" class="prio-button" id="urgentEdit" onclick="togglePrioButton('urgent', ${i})">Urgent<img id="urgentImgEdit" src="./assets/icons/prio_buttons/prio_urgent_red.png" alt=""></button>
    <button type="button" class="prio-button medium-active" id="mediumEdit" onclick="togglePrioButton('medium', ${i})">Medium<img id="mediumImgEdit" src="./assets/icons/prio_buttons/prio_medium.png" alt=""></button>
    <button type="button" class="prio-button" id="lowEdit" onclick="togglePrioButton('low', ${i})">Low<img id="lowImgEdit" src="./assets/icons/prio_buttons/prio_low_green.png" alt=""></button>
  `;
}

function prioEditLow(i) {
  return `
    <button type="button" class="prio-button" id="urgentEdit" onclick="togglePrioButton('urgent', ${i})">Urgent<img id="urgentImgEdit" src="./assets/icons/prio_buttons/prio_urgent_red.png" alt=""></button>
    <button type="button" class="prio-button" id="mediumEdit" onclick="togglePrioButton('medium', ${i})">Medium<img id="mediumImgEdit" src="./assets/icons/prio_buttons/prio_medium_yellow.png" alt=""></button>
    <button type="button" class="prio-button low-active" id="lowEdit" onclick="togglePrioButton('low', ${i})">Low<img id="lowImgEdit" src="./assets/icons/prio_buttons/prio_low.png" alt=""></button>
  `;
}

/**
 * togglePrioButton(priority, i) switch between prios and chose one for the edit task
 *
 */
function togglePrioButton(priority, i) {
  const task = allTasks[i];

  if (priority === "urgent") {
    editPrioUrgent(priority);
    task.prio = priority;
  } else if (priority === "medium") {
    editPrioMedium(priority);
    task.prio = priority;
  } else if (priority === "low") {
    editPrioLow(priority);
    task.prio = priority;
  }
}

function editPrioUrgent(priority) {
  document.getElementById(priority + "Edit").classList.add("urgent-active");
  document.getElementById(priority + "ImgEdit").src =
    "./assets/icons/prio_buttons/prio_urgent.png";
  document.getElementById("mediumEdit").classList.remove("medium-active");
  document.getElementById("mediumImgEdit").src =
    "./assets/icons/prio_buttons/prio_medium_yellow.png";
  document.getElementById("lowEdit").classList.remove("low-active");
  document.getElementById("lowImgEdit").src =
    "./assets/icons/prio_buttons/prio_low_green.png";
}

function editPrioMedium(priority) {
  document.getElementById(priority + "Edit").classList.add("medium-active");
  document.getElementById(priority + "ImgEdit").src =
    "./assets/icons/prio_buttons/prio_medium.png";
  document.getElementById("urgentEdit").classList.remove("urgent-active");
  document.getElementById("urgentImgEdit").src =
    "./assets/icons/prio_buttons/prio_urgent_red.png";
  document.getElementById("lowEdit").classList.remove("low-active");
  document.getElementById("lowImgEdit").src =
    "./assets/icons/prio_buttons/prio_low_green.png";
}

function editPrioLow(priority) {
  document.getElementById(priority + "Edit").classList.add("low-active");
  document.getElementById(priority + "ImgEdit").src =
    "./assets/icons/prio_buttons/prio_low.png";
  document.getElementById("urgentEdit").classList.remove("urgent-active");
  document.getElementById("urgentImgEdit").src =
    "./assets/icons/prio_buttons/prio_urgent_red.png";
  document.getElementById("mediumEdit").classList.remove("medium-active");
  document.getElementById("mediumImgEdit").src =
    "./assets/icons/prio_buttons/prio_medium_yellow.png";
}

/**
 * showEditUsers(i) open the user dropdown
 *
 */
function showEditUsers(i) {
  let userList = document.getElementById("editDropdownUsers");
  let icon = document.getElementById("openEditUserIcon");
  userList.innerHTML = "";
  icon.style.transform = "rotate(180deg)";
  loadContacts();
  if (!assignedContainerClicked) {
    userList.style.border = "1px solid #CDCDCD";
    displayEditUserList(i, userList);
  } else {
    userList.style.border = "0px";
    hideUsers();
  }
}

/**
 * displayEditUserList(j, userList) render the users
 *
 */
function displayEditUserList(j, userList) {
  assignedContainerClicked = true;
  for (let i = 0; i < contacts.length; i++) {
    const contact = contacts[i];
    if (contact === null) {
      continue;
    }
    userList.innerHTML += editUserTemplate(j, contact);
  }
  selectedUsers.forEach((user) => {
    const checkbox = document.querySelector(
      `input[data-contact='${JSON.stringify(user)}']`
    );
    if (checkbox) {
      checkbox.checked = true;
    }
  });
}

function editUserTemplate(j, contact) {
  const task = allTasks[j];
  let isChecked;
  if (!task.users) {
    isChecked = false;
  } else {
    isChecked = task.users.some((user) => user.name === contact.name);
  }
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
        <input type="checkbox" name="assignedUser" value="${contact.name}" 
        data-contact='${JSON.stringify(contact)}' 
        onchange="handleCheckboxChangeEditTask(${j}, event)" ${isChecked ? "checked" : ""}>
      </div>
    </div>
  `;
}

/**
 * hideUsers() close the user dropdown
 *
 */
function hideUsers() {
  assignedContainerClicked = false;
  let userList = document.getElementById("editDropdownUsers");
  let icon = document.getElementById("openEditUserIcon");
  if (icon !== null) {
    icon.style.transform = "rotate(0deg)";
    userList.innerHTML = "";
  }
}

/**
 * handleCheckboxChangeEditTask(j, event) controlls which user is checked in push it into the task
 *
 */
function handleCheckboxChangeEditTask(j, event) {
  const task = allTasks[j];
  const checkbox = event.target;
  const contactData = JSON.parse(checkbox.getAttribute("data-contact"));

  if (checkbox.checked) {
    if (!task.users) {
      let users = [];
      task.users = users;
    }
    task.users.push(contactData);
  } else {
    const userIndex = task.users.findIndex(
      (user) => user.name === contactData.name
    );
    if (userIndex !== -1) {
      task.users.splice(userIndex, 1);
    }
  }
}

/**
 * searchEditUser() search for user
 *
 */
function searchEditUser() {
  let searchValue = document
    .getElementById("popupUserInput")
    .value.trim()
    .toLowerCase();
  let userList = document.getElementById("editDropdownUsers");
  userList.innerHTML = "";
  loadContacts();

  for (let i = 0; i < contacts.length; i++) {
    const contact = contacts[i];
    if (contact.name.trim().toLowerCase().includes(searchValue)) {
      userList.innerHTML += userTemplate(contact);
    }
  }
}

function editTaskPopup(task, taskIndex, taskId) {
  return /*html*/ `
    <div class="edit-task-popup-top"><img src="./assets/icons/subtask_icons/close.png" alt="X" onclick="closeEditTaskPopup()"></div>
    <div>
      <div style="display: flex; align-items: center; gap: 8px;">
        <label>Title<span style="color: #FF8190">*</span></label>
        <div id="errorMessageEditTitle" style="color: #FF8190; margin-top: 2px;"></div>
      </div>
      <input id="editTaskTitle" type="text" value="${task.title}" placeholder="Enter a title">
    </div>
    <div>
      <label for="">Description</label>
      <textarea name="" id="editTaskDescription" cols="30" rows="10" placeholder="Enter a Description">${task.description}</textarea>
    </div>
    <div>
      <div style="display: flex; align-items: center; gap: 8px;">
        <label>Due date<span style="color: #FF8190">*</span></label>
        <div id="errorMessageEditDate" style="color: #FF8190; margin-top: 2px;"></div>
      </div>
      <input id="editTaskDate" type="date" value="${task.dueDate}">
    </div>
    <div class="prio-container">
      <label>Prio</label>
      <div id="edit-prio-buttons-container" class="buttons-container">
      </div>
    </div>
    <div class="assignedto-container">
      <label>Assigned to</label>
      <div class="assigned-container" id="popupAssignedContainer">
        <input id="popupUserInput" type="text" onkeyup="searchEditUser()" onclick="showEditUsers(${taskIndex})" placeholder="Select contacts to assign">
        <img id="openEditUserIcon" class="assigned-icon" src="./assets/icons/arrow_drop_down.png" alt="OPEN" onclick="showEditUsers(${taskIndex})">
      </div>
      <div id="editDropdownUsers" class="dropdown-users">
      </div>  
    </div>
    <div>
        <label>Subtasks</label>
        <div class="subtask-container">
          <input id="editSubtasksInput" type="text" class="subtask-input" placeholder="Add new subtask" onclick="enableSubtaskIcons(${taskIndex}, ${taskId})">
          <div class="edit-subtask-icon-container">
            <img src="./assets/icons/subtask_icons/add.png" onclick="enableSubtaskIcons(${taskIndex}, ${taskId})"></img>
          </div>
        </div>
        <ul id="edit-popup-contentSubtasks"></ul>
    </div>
    <div class="edit-task-bottom-section"><button type="submit" class="edit-task-button" onclick="validateEditForm(event ,${taskIndex})">OK<img src="./assets/icons/check_white1.png" alt=""></button></div>
  `;
}

function enableSubtaskIcons(taskIndex, taskId) {
  let iconContainer = document.querySelector(".edit-subtask-icon-container");
  iconContainer.querySelector("img").removeAttribute("onclick");

  iconContainer.innerHTML = `
    <div onclick="clearEditSubtaskInput(${taskIndex}, ${taskId})"><img src="./assets/icons/subtask_icons/close.png" alt="X"></div>
    <div><img src="./assets/icons/mini_seperator.png" alt="/"></div>
    <div onclick="addSubtaskInPopup(${taskIndex}, ${taskId})"><img src="./assets/icons/subtask_icons/check.png" alt="ADD" ></div>
  `;
}

function clearEditSubtaskInput(taskIndex, taskId) {
  input = document.getElementById("editSubtasksInput");
  let iconContainer = document.querySelector(".edit-subtask-icon-container");

  input.value = "";
  iconContainer.innerHTML = `
    <img src="./assets/icons/subtask_icons/add.png" onclick="enableSubtaskIcons(${taskIndex}, ${taskId})"></img>
  `;
}

/**
 * addSubtaskInPopup(taskIndex, taskId) add new subtask
 *
 */
function addSubtaskInPopup(taskIndex, taskId) {
  let input = document.getElementById("editSubtasksInput");
  let subtaskText = input.value.trim();
  const task = allTasks[taskIndex];

  if (subtaskText !== "") {
    if (!task.subtasks) {
      let subtasks = [];
      task.subtasks = subtasks;
    }
    task.subtasks.push({ name: subtaskText, completed: false });
    input.value = "";
  }
  renderEditPopupSubtasks(task, taskIndex, taskId);
}

/**
 * renderEditPopupSubtasks(task, taskIndex, taskId) render the subtasks
 *
 */
function renderEditPopupSubtasks(task, taskIndex, taskId) {
  let subtaskContainer = document.getElementById(`edit-popup-contentSubtasks`);
  subtaskContainer.innerHTML = "";
  if (task.subtasks) {
    for (let subtaskId = 0; subtaskId < task.subtasks.length; subtaskId++) {
      const subtask = task.subtasks[subtaskId];

      subtaskContainer.innerHTML += editSubtaskTamplete(
        taskIndex,
        subtaskId,
        subtask,
        taskId
      );
    }
  }
}

function editSubtaskTamplete(taskIndex, subtaskId, subtask, taskId) {
  return `
    <div id="subtask${subtaskId}_${taskId}" class="subtask">
      <li>
        <div>${subtask.name}</div>
        <div class="subtask-edit-icons">
          <div onclick="editPopupSubtask('${subtask.name}', ${taskIndex}, ${subtaskId}, ${taskId})"><img src="./assets/icons/subtask_icons/edit.png" alt="EDIT"></div>
          <div><img src="./assets/icons/mini_seperator.png" alt="/"></div>
          <div onclick="deletePopupSubtask(${taskIndex}, ${subtaskId}, ${taskId})"><img src="./assets/icons/subtask_icons/delete.png" alt="X"></div>
      </div>
      </li>
    </div>
  `;
}

function editPopupSubtask(subtask, taskIndex, subtaskId, taskId) {
  let subtaskbox = document.getElementById(`subtask${subtaskId}_${taskId}`);

  subtaskbox.innerHTML = `
    <div class="edit-input">
      <input id="changedSubtask${subtaskId}_${taskId}" value="${subtask}">
        <div class="edit-icons">
          <img src="./assets/icons/subtask_icons/delete.png" alt="X" onclick="deletePopupSubtask(${taskIndex}, ${subtaskId}, ${taskId})">
          <img src="./assets/icons/mini_seperator.png" alt="/">
          <img src="./assets/icons/subtask_icons/check.png" alt="OK" onclick="addChangedPopupSubtask(${taskIndex}, ${subtaskId}, ${taskId})">
      </div>
    </div>
  `;
}

/**
 * deletePopupSubtask(taskIndex, subtaskId, taskId) delete the subtask
 *
 */
function deletePopupSubtask(taskIndex, subtaskId, taskId) {
  const task = allTasks[taskIndex];
  task.subtasks.splice(subtaskId, 1);
  renderEditPopupSubtasks(task, taskIndex, taskId);
}

/**
 * addChangedPopupSubtask(taskIndex, subtaskId, taskId) add the changed subtask
 *
 */
function addChangedPopupSubtask(taskIndex, subtaskId, taskId) {
  const task = allTasks[taskIndex];
  let input = document.getElementById(`changedSubtask${subtaskId}_${taskId}`);
  let subtaskText = input.value.trim();
  task.subtasks[subtaskId]["name"] = subtaskText;
  input.value = "";
  renderEditPopupSubtasks(task, taskIndex, taskId);
}

function closeEditTaskPopup() {
  let taskPopup = document.getElementById("taskPopup");
  let taskContainer = document.getElementById("editTaskPopup");
  taskContainer.style.left = '150%';
  taskPopup.style.display = "none";
  let content = document.querySelector(".content");
  content.classList.remove('non-clickable');
}

/**
 * submitChanges(i) submit the changed task and update the baord
 *
 */
function submitChanges(i) {
  const task = allTasks[i];
  let title = document.getElementById("editTaskTitle").value;
  let description = document.getElementById("editTaskDescription").value;
  let date = document.getElementById("editTaskDate").value;
  let taskIdKey = task.idKey;

  task.title = title;
  task.description = description;
  task.dueDate = date;

  updateEditTask(taskIdKey, task);
  renderCards();
  closeEditTaskPopup();
}
