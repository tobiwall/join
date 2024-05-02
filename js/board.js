let allTasks = [];
let tasksColumn;
let doneSubtasks = 0;
let taskId;

async function init() {
  includeHTML();
  await load();
  taskId = findHighestTaskId();
  renderCards();
}

function includeHTML() {
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

function showHighestId() {
  console.log("Die höchste ID ist:", taskId);
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
function renderCards() {
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

      if(task.status === 'todo') {
      toDoContainer.innerHTML += generateCardHTML(task, i, taskId);
      categoryColor(i, taskId);
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

    if (task.status === 'progress') {
      inProgressContainer.innerHTML += generateCardHTML(task, i, taskId);
      categoryColor(i, taskId);
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

    if (task.status === 'feedback') {
      awaitFeedbackContainer.innerHTML += generateCardHTML(task, i, taskId);
      categoryColor(i, taskId);
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

    if (task.status === 'done') {
      doneContainer.innerHTML += generateCardHTML(task, i, taskId);
      categoryColor(i, taskId);
      renderUsers(i, taskId);
      generateCardPrio(task, i, taskId);
    }
  }
}

function renderUsers(i, taskId) {
  let userContainer = document.getElementById(`userContainer${i}_${taskId}`);
  userContainer.innerHTML = "";

  // Überprüfe, ob cardsToDo[i].users definiert ist, bevor du versuchst, über sie zu iterieren
  if (allTasks[i] !== undefined) {
    for (let j = 0; j < allTasks[i].users.length; j++) {
      const user = allTasks[i].users[j];

      userContainer.innerHTML += `
        <div class="user-initials-card" style="background-color: ${user.color};">
          ${user.initials}
        </div>
      `;
    }
  }
}

function renderPopupUsers(i) {
  let userContainer = document.getElementById(`popupUserContainer${i}`);
  userContainer.innerHTML = "";

  for (let j = 0; j < allTasks[i].users.length; j++) {
    const user = allTasks[i].users[j];

    userContainer.innerHTML += `
      <div class="popup-user">
        <div class="popuser-initials-card" style="background-color: ${user.color};">
          ${user.initials}
        </div>
        <div>${user.name}</div>
      </div>
    `;
  }
}

function renderPopupSubtasks(i) {
  let subtaskContainer = document.getElementById(
    `task-popup-subtask-container${i}`
  );
  subtaskContainer.innerHTML = "";

  for (let j = 0; j < allTasks[i]["subtasks"].length; j++) {
    const subtask = allTasks[i].subtasks[j];

    subtaskContainer.innerHTML += `
      <div class="popup-subtask-container">
        <div><input type="checkbox" id="subtaskCheckbox${i}_${j}" value="${subtask}" onclick="toggleSubtask(${i}, ${j})"></div>
        <div>${subtask}</div>
      </div>
    `;
  }
}

function toggleSubtask(i, j) {
  const subtaskCheckbox = document.getElementById(`subtaskCheckbox${i}_${j}`);
  const doneSubtasksContainer = document.getElementById(`doneSubtasks${i}`);

  if (subtaskCheckbox.checked) {
    doneSubtasksContainer.innerHTML =
      parseInt(doneSubtasksContainer.innerHTML) + 1;
  } else {
    doneSubtasksContainer.innerHTML =
      parseInt(doneSubtasksContainer.innerHTML) - 1;
  }
  generateProgressbar(i);
}

function generateCardHTML(task, i, taskId) {
  return /*html*/ `
    <div draggable="true" class="card" id="card${
      task["id"]
    }" onclick="openTaskPopup(${i})">
        <div class="small-card-category" id="category${i}_${taskId}">${
    task["category"]
  }</div>
        <h3>${task["title"]}</h3>
        <p>${task["description"]}</p>
        <div class="subtasks-info">
          <div class="progressbar">
            <div id="subtaskProgressbar${i}" class="done-subtask-progressbar" style="width:0%"></div>
          </div>
          <div class="progressbar-text-container">
            <span id="doneSubtasks${i}">${doneSubtasks}</span>
            <span>/</span>
            <span>${task["subtasks"].length}</span> 
            <span>Subtasks</span> 
          </div>
        </div>
        <div class="card-bottom-section">
          <div class="userContainer" id="userContainer${i}_${taskId}">
          </div>
          <div><img id="cardPrioImg${i}_${taskId}" src="" alt="PRIO"></div>
        </div>
    </div>
    `;
}

function generateProgressbar(i) {
  let progressbar = document.getElementById(`subtaskProgressbar${i}`);
  let amountSubtasks = parseInt(allTasks[i]["subtasks"].length);
  let amountDoneSubtasks = parseInt(
    document.getElementById(`doneSubtasks${i}`).innerHTML
  );

  progressbar.style.width = (amountDoneSubtasks / amountSubtasks) * 100 + "%";
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

function popupCategoryColor(i) {
  let categoryElement = document.getElementById(`popupCategory${i}`);
  let category = document.getElementById(`popupCategory${i}`).innerHTML;

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

function generatepopupCardPrio(task, i) {
  let prioImage = document.getElementById(`popupCardPrioImg${(task, i)}`);
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

    <div>
      <button class="clear-button">Clear <img src="./assets/icons/close.png" alt="X"></button>
      <button class="task-button" onclick="createTask(taskContainer)">Create Task <img src="./assets/icons/check.png" alt="OK"></button>
    </div>
  `;
}

function closeAddTaskPopup() {
  let addTaskTemplate = document.getElementById("addTaskTemplate");
  let overlay = document.getElementById("overlay");
  addTaskTemplate.style.display = "none";
  overlay.style.display = "none";
}

function openTaskPopup(i) {
  let taskContainer = document.getElementById("taskPopup");
  taskContainer.innerHTML = "";
  taskContainer.style.display = "flex";
  const task = allTasks[i];
  const prio =
  allTasks[i].prio.charAt(0).toUpperCase() + allTasks[i].prio.slice(1);
  taskContainer.innerHTML = taskPopup(task, i, prio);
  popupCategoryColor(i);
  generatepopupCardPrio(task, i);
  renderPopupUsers(i);
  renderPopupSubtasks(i);
}

function taskPopup(task, i, prio) {
  return `
    <div class="task-popup-top-section">
      <div class="popupCategory" id="popupCategory${i}">${
    task["category"]
  }</div>
      <img src="./assets/icons/subtask_icons/close.png" alt="X" onclick="closeTaskPopup()">
    </div>
    <h3>${task["title"]}</h3>
    <p>${task["description"]}</p>
    <p>Due Date: ${task["dueDate"]}</p>
    <div class"pupup-prio-container">
      <span>Priority: ${prio}</span>
      <img id="popupCardPrioImg${(task, i)}" src="" alt="PRIO">
    </div>
    <span>Assigned to:</span>
    <div class="popup-user-container" id="popupUserContainer${i}"></div>
    <span>Subtasks</span>
    <div id="task-popup-subtask-container${i}"></div>
    <div class="task-popup-bottom-section">
      <div onclick="deleteTask(${i})"><img src="./assets/icons/subtask_icons/delete.png" alt="DEL">Delete</div>
      <img src="./assets/icons/mini_seperator.png" alt="/">
      <div><img src="./assets/icons/subtask_icons/edit.png" alt="EDIT">Edit</div>
    </div>
  `;
}

function closeTaskPopup() {
  let taskContainer = document.getElementById("taskPopup");
  taskContainer.style.display = "none";
}

function deleteTask(i) {
  allTasks.splice(i, 1);
  closeTaskPopup();
  renderCards();
  save();
}
