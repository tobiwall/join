const STORAGE_TOKEN = "LBRCE7ZOJGJE5A61XE03E0RA3FUCZKJ11X9OKHSK";
let STORAGE_URL = "https://remote-storage.developerakademie.org/item";

let cardsToDo = [];
let cardsInProgress = [];
let cardsAwaitFeedback = [];
let cardsDone = [];
let tasksColumn;

function init() {
  includeHTML();
  load();
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

/**
 * Diese funktion rendert alle Spalten nacheinander
 *
 */
function renderCards() {
  renderBoardCard();
  //renderInProgress();
  //renderAwaitFeedback();
  //renderDone();
}

function renderBoardCard(numberContainer) {
  let toDoContainer = document.getElementById("toDoContainer");
  for (let i = 0; i < cardsToDo.length; i++) {
    const task = cardsToDo[i]
    for (let j = 0; j < cardsToDo[i].users.length; j++) {
      const user = cardsToDo[i].users[j];
      toDoContainer.innerHTML += generateCardHTML(task ,user);
    }
  }
}

function generateCardHTML(task, user) {
  return /*html*/ `
    <div class="card">
        <div>${task['category']}</div>
        <h3>${task['title']}</h3>
        <p>${task['description']}</p>
        <div>${task['subtasks']}</div>
        <div>
          <div class="initialien-round-container" style="background-color: ${user.color};">
            ${user.initials}
          </div>
          <div>${task['prio']}</div>
        </div>
    </div>
    `;
}

function openAddTask(taskContainer) {
  tasksColumn = taskContainer;
  let addTaskTemplate = document.getElementById("addTaskTemplate");
  let overlay = document.getElementById("overlay");
  let buttonContainer = document.getElementById("buttonContainer");
  addTaskTemplate.style.display = "flex";
  overlay.style.display = "block";
  //overlay.addEventListener("click", closeContactPopupByOverlay);
  buttonContainer.innerHTML = '';
  buttonContainer.innerHTML += generateButtonAddTaskHTML();
}

function generateButtonAddTaskHTML() {
  return /*html*/ `
        <img onclick="closeAddTaskPopup()" class="add-contact-close" src="./assets/icons/Close.png" alt="">

    <div>
      <button class="clear-button">Clear <img src="./assets/icons/close.png" alt="X"></button>
      <button class="task-button" onclick="createTask(tasksColumn)">Create Task <img src="./assets/icons/check.png" alt="OK"></button>
    </div>
  `;
}

function closeAddTaskPopup() {
  let addTaskTemplate = document.getElementById("addTaskTemplate");
  let overlay = document.getElementById("overlay");
  addTaskTemplate.style.display = "none";
  overlay.style.display = "none";
}
