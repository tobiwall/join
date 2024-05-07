let allTasks = [];
let tasksColumn;
let taskId;
let doneSubtasks = 0;
let currentDraggedTask;

async function init() {
  await includeHTML();
  await loadCurrentUsers();
  await loadAllTasks();
  taskId = findHighestTaskId();
  await renderCards();
  showHeaderUser();
  renderSubtasksOnload();
}

async function initHeader() {
  await includeHTML();
  await loadCurrentUsers();
  showHeaderUser();
}

async function includeHTML() {
  var z, i, elmnt, file, xhttp;
  /* Loop through a collection of all HTML elements: */
  z = document.getElementsByTagName("*");
  for (i = 0; i < z.length; i++) {
    elmnt = z[i];
    /*search for elements with a certain atrribute:*/
    file = elmnt.getAttribute("w3-include-html");
    if (file) {
      /* Make an HTTP request using the attribute value as the file name: */
      xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function () {
        if (this.readyState == 4) {
          if (this.status == 200) {
            elmnt.innerHTML = this.responseText;
          }
          if (this.status == 404) {
            elmnt.innerHTML = "Page not found.";
          }
          /* Remove the attribute, and call this function once more: */
          elmnt.removeAttribute("w3-include-html");
          includeHTML();
        }
      };
      xhttp.open("GET", file, true);
      xhttp.send();
      /* Exit the function: */
      return;
    }
  }
}

function showHeaderUser() {
  let names = currentUser.user_name.split(" ");
  let firstNameInitial = names[0].charAt(0).toUpperCase();
  let lastNameInitial = names[names.length - 1].charAt(0).toUpperCase();
  document.getElementById('headerInitialUser').innerHTML = firstNameInitial + lastNameInitial;
}

async function createTaskOnBoard(status) {
  let title = document.getElementById("taskTitle");
  let discription = document.getElementById("taskDiscription");
  let date = document.getElementById("taskDate");
  let category = document.getElementById("categoryInput");
  let subtasksList = document.getElementById("contentSubtasks");
  let assignedUsers = document.getElementById("contentAssignedUsers");
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

  title.value = "";
  discription.value = "";
  date.value = "";
  category.value = "";
  selectedPriority = selectedPriority;
  subtasks = [""];
  users = [""];
  subtasksList.innerHTML = "";
  assignedUsers.innerHTML = "";
  selectedUsers = [""];
  renderCards();
  save();
  renderCards(); 
}

function findHighestTaskId() {
  let highestId = 0;
  for (let i = 0; i < allTasks.length; i++) {
    if (allTasks[i].id > highestId) {
      highestId = allTasks[i].id;
    }
  }
  return highestId;
}

/**
 * Diese funktion rendert alle Spalten nacheinander
 *
 */
async function renderCards() {
  renderToDoCards();
  renderInProgressCards();
  renderAwaitFeedbackCards();
  renderDoneCards();
}

function renderToDoCards() {
  let toDoContainer = document.getElementById("toDoContainer");
  toDoContainer.innerHTML = "";

  for (let i = 0; i < allTasks.length; i++) {
    const task = allTasks[i];
    const taskId = allTasks[i].id;

    if (task.status === "todo") {
      toDoContainer.innerHTML += generateCardHTML(task, i, taskId);
      categoryColor(i, taskId);
      generateProgressbar(i, task);
      renderUsers(i, taskId);
      generateCardPrio(task, i, taskId);
    }
  }
}

function renderInProgressCards() {
  let inProgressContainer = document.getElementById("inProgressContainer");
  inProgressContainer.innerHTML = "";

  for (let i = 0; i < allTasks.length; i++) {
    const task = allTasks[i];
    const taskId = allTasks[i].id;

    if (task.status === "progress") {
      inProgressContainer.innerHTML += generateCardHTML(task, i, taskId);
      categoryColor(i, taskId);
      generateProgressbar(i, task);
      renderUsers(i, taskId);
      generateCardPrio(task, i, taskId);
    }
  }
}

function renderAwaitFeedbackCards() {
  let awaitFeedbackContainer = document.getElementById(
    "awaitFeedbackContainer"
  );
  awaitFeedbackContainer.innerHTML = "";

  for (let i = 0; i < allTasks.length; i++) {
    const task = allTasks[i];
    const taskId = allTasks[i].id;

    if (task.status === "feedback") {
      awaitFeedbackContainer.innerHTML += generateCardHTML(task, i, taskId);
      categoryColor(i, taskId);
      generateProgressbar(i, task);
      renderUsers(i, taskId);
      generateCardPrio(task, i, taskId);
    }
  }
}

function renderDoneCards() {
  let doneContainer = document.getElementById("doneContainer");
  doneContainer.innerHTML = "";

  for (let i = 0; i < allTasks.length; i++) {
    const task = allTasks[i];
    const taskId = allTasks[i].id;

    if (task.status === "done") {
      doneContainer.innerHTML += generateCardHTML(task, i, taskId);
      categoryColor(i, taskId);
      generateProgressbar(i, task);
      renderUsers(i, taskId);
      generateCardPrio(task, i, taskId);
    }
  }
}

function renderUsers(i, taskId) {
  let userContainer = document.getElementById(`userContainer${i}_${taskId}`);
  userContainer.innerHTML = "";

  // Überprüfe, ob allTasks[i] definiert ist, bevor du versuchst, über sie zu iterieren
  if (allTasks[i] !== undefined) {
    const users = allTasks[i].users;
    const totalUsers = users.length;

    // Rendern der ersten fünf Benutzer
    for (let j = 0; j < Math.min(5, totalUsers); j++) {
      const user = users[j];
      userContainer.innerHTML += `
        <div class="user-initials-card" style="background-color: ${user.color};">
          ${user.initials}
        </div>
      `;
    }

    // Wenn es mehr als fünf Benutzer gibt, zeige die Gesamtanzahl der restlichen Benutzer an
    if (totalUsers > 5) {
      const remainingUsers = totalUsers - 5;
      userContainer.innerHTML += `
        <div class="rest-user-amount">
          + ${remainingUsers}
        </div>
      `;
    }
  }
}

function generateCardHTML(task, i, taskId) {
  return /*html*/ `
    <div draggable="true" ondragstart="startDragging(${task["id"]})" class="card" id="card${task["id"]}" onclick="openTaskPopup(${i})">
        <div class="small-card-category" id="category${i}_${taskId}">${task["category"]}</div>
        <h3>${task["title"]}</h3>
        <p>${task["description"]}</p>
        <div id="subtaskProgressbarContainer${i}" class="subtasks-info"> 
        </div>
        <div class="card-bottom-section">
          <div class="userContainer" id="userContainer${i}_${taskId}">
          </div>
          <div><img id="cardPrioImg${i}_${taskId}" src="" alt="PRIO"></div>
        </div>
    </div>
    `;
}

function generateProgressbar(i, task) {
  let subtaskAmount = task.subtasks.length;
  let subtaskProgressbarContainer = document.getElementById(`subtaskProgressbarContainer${i}`);
  
  if (subtaskAmount > 0) {
    subtaskProgressbarContainer.innerHTML = `
      <div class="progressbar">
        <div id="subtaskProgressbar${i}" class="done-subtask-progressbar" style="width:0%"></div>
      </div>
      <div class="progressbar-text-container">
        <span id="doneSubtasks${i}">${doneSubtasks}</span>
        <span>/</span>
        <span>${task["subtasks"].length}</span> 
        <span>Subtasks</span> 
      </div>
    `;
    updateProgressbar(i);
  }
}

function updateProgressbar(i) {
  let subtaskAmount = allTasks[i].subtasks.length;
  let progressbar = document.getElementById(`subtaskProgressbar${i}`);
  let amountSubtaskString = parseInt(subtaskAmount);
  let amountDoneSubtasks = parseInt(
      document.getElementById(`doneSubtasks${i}`).innerHTML
    );
    progressbar.style.width = (amountDoneSubtasks / amountSubtaskString) * 100 + "%";
}

function categoryColor(i, taskId) {
  let categoryElement = document.getElementById(`category${i}_${taskId}`);
  let category = document.getElementById(`category${i}_${taskId}`).innerHTML;

  if (category === "Technical Task") {
    categoryElement.style.backgroundColor = "#1FD7C1";
  } else if (category === "User Story") {
    categoryElement.style.backgroundColor = "#0038FF";
  } else if (category === "Feature") {
    categoryElement.style.backgroundColor = "#FF7A00";
  } else if (category === "Bug") {
    categoryElement.style.backgroundColor = "#FF4646";
  } else if (category === "Documentation") {
    categoryElement.style.backgroundColor = "#6E52FF";
  } else if (category === "Design") {
    categoryElement.style.backgroundColor = "#00BEE8";
  } else if (category === "Testing QA") {
    categoryElement.style.backgroundColor = "#FFE62B";
  } else if (category === "Analyse/Research") {
    categoryElement.style.backgroundColor = "#C3FF2B";
  }
}

function generateCardPrio(task, i, taskId) {
  let prioImage = document.getElementById(`cardPrioImg${i}_${taskId}`);
  let taskPrio = task.prio;

  if (taskPrio === "urgent") {
    prioImage.src = "./assets/icons/prio_buttons/prio_urgent_red.png";
  } else if (taskPrio === "medium") {
    prioImage.src = "./assets/icons/prio_buttons/prio_medium_yellow.png";
  } else if (taskPrio === "low") {
    prioImage.src = "./assets/icons/prio_buttons/prio_low_green.png";
  }
}

function openAddTask(taskContainer) {
  let addTaskTemplate = document.getElementById("addTaskTemplate");
  let overlay = document.getElementById("overlayAddTask");
  let buttonContainer = document.getElementById("buttonContainer");
  addTaskTemplate.style.display = "flex";
  overlay.style.display = "block";
  //overlay.addEventListener("click", closeContactPopupByOverlay);
  buttonContainer.innerHTML = "";
  buttonContainer.innerHTML += generateButtonAddTaskHTML(taskContainer);
}

function generateButtonAddTaskHTML(taskContainer) {
  return /*html*/ `
        <img onclick="closeAddTaskPopup()" class="add-contact-close" src="./assets/icons/Close.png" alt="">

        <div class="bottom-content">
        <span><span style="color: #FF8190">*</span>This field is required</span>
        <div>
            <button class="clear-button" onclick="clearAddTaskInput()">CLEAR<img src="./assets/icons/subtask_icons/close.png" alt="X"></button>
            <button class="task-button" onclick="createTaskOnBoard('${taskContainer}')">CREATE TASK<img src="./assets/icons/check_white1.png" alt="OK"></button>
        </div>
    </div>
  `;
}

function closeAddTaskPopup() {
  let addTaskTemplate = document.getElementById("addTaskTemplate");
  let overlay = document.getElementById("overlay");
  addTaskTemplate.style.display = "none";
  overlay.style.display = "none";
}

function addHighlight(id) {
  let container = document.getElementById(id);

  container.classList.add("highlightContainer");
}

function removeHighlight(id) {
  let container = document.getElementById(id);
  container.classList.remove("highlightContainer");
}

function allowDrop(ev) {
  ev.preventDefault();
}

async function moveTo(statusContainer, index) {
  let task = findTaskById();
  let taskId = task.idKey;
  await updateStatusTask(taskId, statusContainer);
  task.status = statusContainer;
  renderCards();
  renderSubtasksOnload();
  removeHighlight(index);
}

function findTaskById() {
  return allTasks.find((task) => task.id === currentDraggedTask);
}

function startDragging(id) {
  currentDraggedTask = id;
}

function filter() {
  let searchInput = document.getElementById("searchInput");
  let searchTerm = searchInput.value.toLowerCase();
  filterTitle(searchTerm);
}

function filterTitle(search) {
  let todo = document.getElementById("toDoContainer");
  let progress = document.getElementById("inProgressContainer");
  let feedback = document.getElementById("awaitFeedbackContainer");
  let done = document.getElementById("doneContainer");
  clearTaskContainer(todo, progress, feedback, done)
  displayFilteredTasks(todo, progress, feedback, done, search);
}

function clearTaskContainer(todo, progress, feedback, done) {
  todo.innerHTML = "";
  progress.innerHTML = "";
  feedback.innerHTML = "";
  done.innerHTML = "";
}

function displayFilteredTasks(todo, progress, feedback, done, search) {
  for (let i = 0; i < allTasks.length; i++) {
    const task = allTasks[i];
    const title = task.title;
    const taskId = allTasks[i].id;
    if (title.toLowerCase().includes(search)) {
      filteredToDo(task, todo, i, taskId);
      filteredInProgress(task, progress, i, taskId);
      filteredAwaitFeedback(task, feedback, i, taskId);
      filteredDone(task, done, i, taskId);
    }
  }
}

function filteredToDo(task, toDoContainer, i, taskId) {
  if (task.status === "todo") {
    toDoContainer.innerHTML += generateCardHTML(task, i, taskId);
    categoryColor(i, taskId);
    renderUsers(i, taskId);
    generateCardPrio(task, i, taskId);
  }
}

function filteredInProgress(task, inProgressContainer, i, taskId) {
  if (task.status === "progress") {
    inProgressContainer.innerHTML += generateCardHTML(task, i, taskId);
    categoryColor(i, taskId);
    renderUsers(i, taskId);
    generateCardPrio(task, i, taskId);
  }
}

function filteredAwaitFeedback(task, awaitFeedbackContainer, i, taskId) {
  if (task.status === "feedback") {
    awaitFeedbackContainer.innerHTML += generateCardHTML(task, i, taskId);
    categoryColor(i, taskId);
    renderUsers(i, taskId);
    generateCardPrio(task, i, taskId);
  }
}

function filteredDone(task, doneContainer, i, taskId) {
  if (task.status === "done") {
    doneContainer.innerHTML += generateCardHTML(task, i, taskId);
    categoryColor(i, taskId);
    renderUsers(i, taskId);
    generateCardPrio(task, i, taskId);
  }
}