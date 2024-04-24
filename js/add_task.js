taskId = 0;
let selectedPriority;
let subtasks = [];
let subtaskId = 0;
let users = ['User1', 'User2'];


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
  title.value = '';
  discription.value = '';
  date.value = '';
  category.value = '';
  selectedPriority = prioMedium('medium');
  subtasks = [];
  subtaskId = 0;
}

function clearForm() {
  
}

function toggleButton(priority) {
  if (priority === 'urgent') {
    prioUrgent(priority);
  } else if (priority === 'medium') {
    prioMedium(priority);
  } else if (priority === 'low') {
    prioLow(priority);
  }
}

function prioUrgent(priority) {
  document.getElementById(priority).classList.add('urgent-active');
  document.getElementById(priority + 'Img').src = ('./assets/icons/prio_buttons/prio_urgent.png');
  document.getElementById('medium').classList.remove('medium-active');
  document.getElementById('mediumImg').src = ('./assets/icons/prio_buttons/prio_medium_yellow.png');
  document.getElementById('low').classList.remove('low-active');
  document.getElementById('lowImg').src = ('./assets/icons/prio_buttons/prio_low_green.png');
  selectedPriority = priority;
}

function prioMedium(priority) {
  document.getElementById(priority).classList.add('medium-active');
  document.getElementById(priority + 'Img').src = ('./assets/icons/prio_buttons/prio_medium.png');
  document.getElementById('urgent').classList.remove('urgent-active');
  document.getElementById('urgentImg').src = ('./assets/icons/prio_buttons/prio_urgent_red.png');
  document.getElementById('low').classList.remove('low-active');
  document.getElementById('lowImg').src = ('./assets/icons/prio_buttons/prio_low_green.png');
  selectedPriority = priority;
}

function prioLow(priority) {
  document.getElementById(priority).classList.add('low-active');
  document.getElementById(priority + 'Img').src = ('./assets/icons/prio_buttons/prio_low.png');
  document.getElementById('urgent').classList.remove('urgent-active');
  document.getElementById('urgentImg').src = ('./assets/icons/prio_buttons/prio_urgent_red.png');
  document.getElementById('medium').classList.remove('medium-active');
  document.getElementById('mediumImg').src = ('./assets/icons/prio_buttons/prio_medium_yellow.png');
  selectedPriority = priority;
}

function renderSubtasks() {
  let subtasksList = document.getElementById('contentSubtasks');
  subtasksList.innerHTML = '';

  for (let i = 0; i < subtasks.length; i++) {
    const task = subtasks[i];
    subtasksList.innerHTML += subtaskTemplate(task, i);
  }
}

function addSubtask() {
  let input = document.getElementById('subtasksInput');
  let subtaskText = input.value.trim();
  
  if (subtaskText !== '') {
    subtasks.push(subtaskText);
    subtaskId++;
    input.value = ''; 
  }
  renderSubtasks();
}

function subtaskTemplate(task, i) {
  return `
  <div id="subtask${i}" class="subtask">
    <li>${task}</li>
    <div class="subtask-edit-icons">
      <img src="./assets/icons/edit_black.png" alt="EDIT" onclick="editSubtask('${task}', ${i})">
      <img src="./assets/icons/delete.png" alt="X" onclick="deleteSubtask(${i})">
    </div>
  </div>
`;
}

function clearInput() {
  document.getElementById('subtasksInput').value = '';
}

function editSubtask(task, i) {
  let subtask = document.getElementById(`subtask${i}`);

  subtask.innerHTML = `
    <div class="edit-input" id="subtask${i}" class="subtask">
      <input id="changedSubtask${i}" value="${task}">
        <div class="edit-icons">
          <img src="./assets/icons/delete.png" alt="X" onclick="deleteSubtask(${i})">
          <img src="./assets/icons/check1.png" alt="OK" onclick="addChangedSubtask(${i})">
      </div>
    </div>
  `;
}

function deleteSubtask(i) {
  subtasks.splice(i, 1)
  renderSubtasks();
}

function addChangedSubtask(i) {
  let input = document.getElementById(`changedSubtask${i}`);
  let subtaskText = input.value.trim();
  subtasks.splice(i, 1, subtaskText);
  input.value = '';
  renderSubtasks();
}

function clearInput() {
  document.getElementById('taskTitle').value = '';
  document.getElementById('taskDiscription').value = '';
  document.getElementById('taskDate').value = '';
  document.getElementById('categoryInput').value = '';
  subtasks = [];
}

function showUsers() {
  let userList = document.getElementById('dropdown-user');
  userList.innerHTML = '';

  getLocalStorage();
  extractInitials(contacts);
  randomBackgroundColor();
  sortContacts();

  for (let i = 0; i < contacts.length; i++) {
    const contact = contacts[i];
    
    userList.innerHTML += `
      <label>
        <div>
          ${contact.name}
          <input type="checkbox" name="assignedUser" value="${contact}">
        </div>
      </label><br>
    `;
  }
}
