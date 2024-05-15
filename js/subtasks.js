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