let allTasks = [];
let tasksColumn;
let taskId;
let doneSubtasks = 0;
let currentDraggedTask;
let isMobil = false;

async function init() {
  await includeHTML();
  await loadCurrentUsers();
  await loadAllTasks();
  contacts = await loadAllContacts();
  orderContacts();
  taskId = findHighestTaskId();
  await renderCards();
  showHeaderUser();
  renderSubtasksOnload();
  getTodayDate();
}

async function initHeader() {
  await includeHTML();
  await loadCurrentUsers();
  showHeaderUser();
}

/**
 * getTodayDate gets the actual date from today for each calendar to block the past
 * 
 */
function getTodayDate() {
  const today = new Date().toISOString().split('T')[0];
  const dateInput = document.getElementById('taskDate');
  dateInput.min = today;
}

/**
 * This function includes all templates in every file
 * @returns 
 * 
 */
async function includeHTML() {
  var z, i, elmnt, file, xhttp;
  z = document.getElementsByTagName("*");
  for (i = 0; i < z.length; i++) {
    elmnt = z[i];
    file = elmnt.getAttribute("w3-include-html");
    if (file) {
      xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function () {
        if (this.readyState == 4) {
          if (this.status == 200) {
            elmnt.innerHTML = this.responseText;
          }
          if (this.status == 404) {
            elmnt.innerHTML = "Page not found.";
          }
          elmnt.removeAttribute("w3-include-html");
          includeHTML();
        }
      };
      xhttp.open("GET", file, true);
      xhttp.send();
      return;
    }
  }
}

/**
 * showHeaderUser displays the actual user in the header
 * 
 */
function showHeaderUser() {
  if (currentUser) {
  let names = currentUser.user_name.split(" ");
  let firstNameInitial = names[0].charAt(0).toUpperCase();
  let lastNameInitial = names[names.length - 1].charAt(0).toUpperCase();
  document.getElementById("headerInitialUser").innerHTML =
    firstNameInitial + lastNameInitial;
  } else {
    document.getElementById("headerInitialUser").innerHTML = 'G';
  }
}

/**
 * This function search for the highest Id in allTasks
 * 
 * @returns the highestId from allTasks
 */
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
 * This function render all task columns in board
 *
 */
async function renderCards() {
  renderToDoCards();
  renderInProgressCards();
  renderAwaitFeedbackCards();
  renderDoneCards();
}

/**
 * This function render all todo tasks in board
 * 
 */
function renderToDoCards() {
  let toDoContainer = document.getElementById("toDoContainer");
  toDoContainer.innerHTML = "";
  renderForLoopTasks("todo", toDoContainer);
  if (toDoContainer.innerHTML === "") {
    toDoContainer.innerHTML = /*html*/`
    <div class="noCardsInContainer">
      <span>No cards todo</span>
    </div>
  `;
  }
  toDoContainer.innerHTML += generateDropPlaceHTML("toDoContainer");
}

/**
 * This function render all inProgress tasks in board
 * 
 */
function renderInProgressCards() {
  let inProgressContainer = document.getElementById("inProgressContainer");
  inProgressContainer.innerHTML = "";
  renderForLoopTasks("progress", inProgressContainer);
  if (inProgressContainer.innerHTML === "") {
    inProgressContainer.innerHTML = /*html*/`
    <div class="noCardsInContainer">
      <span>No cards in progress</span>
    </div>
  `;
  }
  inProgressContainer.innerHTML += generateDropPlaceHTML("inProgressContainer");
}

/**
 * This function render all feedback tasks in board
 * 
 */
function renderAwaitFeedbackCards() {
  let awaitFeedbackContainer = document.getElementById("awaitFeedbackContainer");
  awaitFeedbackContainer.innerHTML = "";
  renderForLoopTasks("feedback", awaitFeedbackContainer);
  if (awaitFeedbackContainer.innerHTML === "") {
    awaitFeedbackContainer.innerHTML = /*html*/`
    <div class="noCardsInContainer">
      <span>No cards awaiting feedback</span>
    </div>
  `;
  }
  awaitFeedbackContainer.innerHTML += generateDropPlaceHTML(
    "awaitFeedbackContainer"
  );
}

/**
 * This function render all done tasks in board
 * 
 */
function renderDoneCards() {
  let doneContainer = document.getElementById("doneContainer");
  doneContainer.innerHTML = "";
  renderForLoopTasks("done", doneContainer);
  if (doneContainer.innerHTML === "") {
    doneContainer.innerHTML = /*html*/`
      <div class="noCardsInContainer"><span>No cards done</span></div>
    `;
  }
  doneContainer.innerHTML += generateDropPlaceHTML("doneContainer");
}

/**
 * Thise funktion searches all column task status and renders all tasks
 * 
 * @param {*} column is the status of todo, progress, feedback or done
 * @param {*} container is the div container for cards
 */
function renderForLoopTasks(column, container) {
  for (let i = 0; i < allTasks.length; i++) {
    const task = allTasks[i];
    const taskId = allTasks[i].id;
    if (task.status === column) {
      container.innerHTML += generateCardHTML(task, i, taskId);
      renderInnerDetailTask(i, taskId, task);
    }
  }
}

/**
 * Thise function renders all inner details of ohne task
 * 
 * @param {*} i is the index from the loop which renders all tasks
 * @param {*} taskId is the id in the actual task
 * @param {*} task id the actual task
 */
function renderInnerDetailTask(i, taskId, task) {
  categoryColor(i, taskId);
  generateProgressbar(i, task);
  renderUsers(i, taskId);
  generateCardPrio(task, i, taskId);
}

/**
 * renderUsers renders the select users in each task
 * 
 * @param {*} i is the index of the task in allTasks
 * @param {*} taskId is the id in the task
 */
function renderUsers(i, taskId) {
  let userContainer = document.getElementById(`userContainer${i}_${taskId}`);
  userContainer.innerHTML = "";
  if (allTasks[i] !== undefined) {
    const users = allTasks[i].users;
    if(users){
      const totalUsers = users.length;
      userLoop(userContainer, totalUsers, users);
      countUserTask(userContainer, totalUsers);
    }
  }
}

/**
 * userLoop showes all select users in card
 * 
 * @param {*} userContainer is the div this task
 * @param {*} totalUsers is the number of all selected users
 * @param {*} users is the array of all users
 */
function userLoop(userContainer, totalUsers, users) {
  for (let j = 0; j < Math.min(5, totalUsers); j++) {
    const user = users[j];
    userContainer.innerHTML += `
      <div class="user-initials-card" style="background-color: ${user.color};">
        ${user.initials}
      </div>
    `;
  }
}

/**
 * countUserTask counts showes a number of more users if there are more than five
 * 
 * @param {*} userContainer is the div to plase the number
 * @param {*} totalUsers is the number of selected users
 */
function countUserTask(userContainer, totalUsers) {
  if (totalUsers > 5) {
    const remainingUsers = totalUsers - 5;
    userContainer.innerHTML += `
      <div class="rest-user-amount">
        + ${remainingUsers}
      </div>
    `;
  }
}

function generateCardHTML(task, i, taskId) {
  return /*html*/ `
    <div draggable="true" ondragstart="startDragging(${task["id"]}); addHighlight('${task.status}');" class="card" id="card${task["id"]}" onclick="openTaskPopup(${i})">
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

/**
 * generates the html templates of the progressbar
 * 
 * @param {*} i ist the index of subtasks
 * @param {*} task is the selected task
 * @returns the html template
 */
function generateProgressbar(i, task) {
  if (!task.subtasks) {
    return;
  } else {
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
}

/**
 * updates the progressbar if changing something
 * 
 * @param {*} i is the index of the subtasks array
 */
function updateProgressbar(i) {
  let subtaskAmount = allTasks[i].subtasks.length;
  let progressbar = document.getElementById(`subtaskProgressbar${i}`);
  let amountSubtaskString = parseInt(subtaskAmount);
  let amountDoneSubtasks = parseInt(
    document.getElementById(`doneSubtasks${i}`).innerHTML
  );
  progressbar.style.width =
    (amountDoneSubtasks / amountSubtaskString) * 100 + "%";
}

/**
 * categoryColor picks the right color for the category
 * 
 * @param {*} i is the index of the array
 * @param {*} taskId is the id of the task in allTasks
 */
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

/**
 * generates the html of the priority of task
 * 
 * @param {*} task is the current task
 * @param {*} i is the index of this task
 * @param {*} taskId is the id of this task
 */
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