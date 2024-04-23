taskId = 0;
let selectedPriority;
let subtasks = [];
let subtaskId = 0;

function createTask() {
  let title = document.getElementById('taskTitle');
  let discription = document.getElementById('taskDiscription');
  let date = document.getElementById('taskDate');
  let category = document.getElementById('categoryInput');

  let newTask = {
    'id': taskId++,
    'title': title.value,
    'description': discription.value,
    'assignedTo': '',
    'dueDate': date.value,
    'prio': selectedPriority,
    'category': category.value,
    'subtasks': subtasks
  };

  tasks.push(newTask);
}

function toggleButton(priority) {
  if (priority === 'urgent') {
    document.getElementById(priority).classList.add('urgent-active');
    document.getElementById(priority + 'Img').src = ('./assets/icons/prio_urgent.png');
    document.getElementById('medium').classList.remove('medium-active');
    document.getElementById('low').classList.remove('low-active');
    selectedPriority = priority;
  } else if (priority === 'medium') {
    document.getElementById(priority).classList.add('medium-active');
    document.getElementById(priority + 'Img').src = ('./assets/icons/prio_medium.png');
    document.getElementById('urgent').classList.remove('urgent-active');
    document.getElementById('low').classList.remove('low-active');
    selectedPriority = priority;
  } else if (priority === 'low') {
    document.getElementById(priority).classList.add('low-active');
    document.getElementById('urgent').classList.remove('urgent-active');
    document.getElementById('medium').classList.remove('medium-active');
    selectedPriority = priority;
  }
}

function addSubtask() {
  let input = document.getElementById('subtasksInput');
  let subtaskText = input.value.trim();
  
  if (subtaskText !== '') {
    let subtasksList = document.getElementById('contentSubtasks');
    subtasksList.innerHTML += subtaskTemplate(subtaskText, subtaskId);
    subtasks.push(subtaskText);
    subtaskId++;
    input.value = ''; 
  }
}

function subtaskTemplate(subtaskText, subtaskId) {
  return `
  <div id="subtask${subtaskId}" class="subtask">
    <li>${subtaskText}</li>
    <div class="subtask-edit-icons">
      <img src="" alt="EDIT" onclick="editSubtask('${subtaskText}', ${subtaskId})">
      <img src="" alt="X" onclick="deleteSubtask(${subtaskId})">
    </div>
  </div>
`;
}

function clearInput() {
  document.getElementById('subtasksInput').value = '';
}

function editSubtask(subtaskText, subtaskId) {
  let subtask = document.getElementById(`subtask${subtaskId}`);

  subtask.innerHTML = `
    <div id="subtask${subtaskId}" class="subtask">
      <input id="changedSubtask${subtaskId}" value="${subtaskText}">
        <img src="" alt="X" onclick="deleteSubtask(${subtaskId})">
        <img src="" alt="OK" onclick="addChangedSubtask(${subtaskId})">
      </div>
    </div>
  `;
}

function deleteSubtask(subtaskId) {
  subtasks.splice(subtaskId, 1)
}

function addChangedSubtask(subtaskId) {
  let input = document.getElementById(`changedSubtask${subtaskId}`);
  let subtaskText = input.value.trim();
  
  if (subtaskText !== '') {
    let subtasksList = document.getElementById('contentSubtasks');
    subtasksList.innerHTML += subtaskTemplate(subtaskText, subtaskId);
    subtasks.push(subtaskText);
    input.value = ''; 
  }
}
