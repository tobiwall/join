function openTaskPopup(i) {
  let taskContainer = document.getElementById("taskPopup");
  taskContainer.innerHTML = "";
  taskContainer.style.display = "flex";
  const task = allTasks[i];
  const taskId = allTasks[i].id;
  const prio =
    task.prio.charAt(0).toUpperCase() + task.prio.slice(1);
  taskContainer.innerHTML = taskPopup(task, i, taskId, prio);
  popupCategoryColor(i);
  generatepopupCardPrio(task, i);
  renderPopupUsers(i);
  renderPopupSubtasks(i);
}

function taskPopup(task, i, taskId, prio) {
  return /*html*/`
    <div class="task-popup-top-section">
      <div class="popupCategory" id="popupCategory${i}">${task["category"]}</div>
      <img src="./assets/icons/subtask_icons/close.png" alt="X" onclick="closeTaskPopup()">
    </div>
    <h3>${task["title"]}</h3>
    <p>${task["description"]}</p>
    <p>Due Date: ${task["dueDate"]}</p>
    <div class"popup-prio-container">
      <span>Priority: ${prio}</span>
      <img id="popupCardPrioImg${(task, i)}" src="" alt="PRIO">
    </div>
    <span>Assigned to:</span>
    <div class="popup-user-container" id="popupUserContainer${i}"></div>
    <span>Subtasks</span>
    <div class="task-popup-subtask-container" id="task-popup-subtask-container${i}"></div>
    <div class="task-popup-bottom-section">
      <div onclick="deleteTask(${i})"><img src="./assets/icons/subtask_icons/delete.png" alt="DEL">Delete</div>
      <img src="./assets/icons/mini_seperator.png" alt="/">
      <div onclick="editTask(${i}, ${taskId})"><img src="./assets/icons/subtask_icons/edit.png" alt="EDIT">Edit</div>
    </div>
  `;
}

function closeTaskPopup() {
  let taskContainer = document.getElementById("taskPopup");
  taskContainer.style.display = "none";
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
  let subtaskContainer = document.getElementById(`task-popup-subtask-container${i}`);
  const subtasks = allTasks[i]["subtasks"];
  subtaskContainer.innerHTML = "";

  if (subtasks.length > 0) {
    for (let j = 0; j < subtasks.length; j++) {
      const subtask = subtasks[j];

      subtaskContainer.innerHTML += `
      <div class="popup-subtask-container">
        <div><input type="checkbox" id="subtaskCheckbox${i}_${j}" value="${subtask}" onclick="toggleSubtask(${i}, ${j})" ${subtask.completed ? 'checked' : ''}></div>
        <div>${subtask.name}</div>
      </div>
    `;
    } 
  } else {
    subtaskContainer.innerHTML = `
      <span>Es sind keine Subtasks vorhanden!</span>
    `;
  }
}

function toggleSubtask(i, j) {
  const subtaskCheckbox = document.getElementById(`subtaskCheckbox${i}_${j}`);
  const doneSubtasksContainer = document.getElementById(`doneSubtasks${i}`);
  const subtask = allTasks[i].subtasks[j];

  subtask.completed = !subtask.completed;
  subtaskCheckbox.checked = subtask.completed;

  if (subtaskCheckbox.checked) {
    doneSubtasksContainer.innerHTML =
    doneSubtasksContainer.innerHTML = allTasks[i].subtasks.filter(sub => sub.completed).length;
  } else {
    doneSubtasksContainer.innerHTML = allTasks[i].subtasks.filter(sub => sub.completed).length;
  }
  updateProgressbar(i);
}