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

function renderSubtasks() {
  let subtasksList = document.getElementById('contentSubtasks');
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
      <img src="" alt="EDIT" onclick="editSubtask('${task}', ${i})">
      <img src="" alt="X" onclick="deleteSubtask(${i})">
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
    <div id="subtask${i}" class="subtask">
      <input id="changedSubtask${i}" value="${task}">
        <img src="" alt="X" onclick="deleteSubtask(${i})">
        <img src="" alt="OK" onclick="addChangedSubtask(${i})">
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
  
  let subtasksList = document.getElementById('contentSubtasks');
  subtasksList.innerHTML += subtaskTemplate(subtaskText, i);
  subtasks.splice(i, 1, subtaskText);
  input.value = ''; 
}

// Das Array mit Benutzern
const users = ["User1", "User2", "User3", "User4", "User5"];

// Die Funktion, um die Benutzerliste zu öffnen und anzuzeigen
function openUserList(event) {
    event.stopPropagation(); // Stoppt die Ausbreitung des Klickereignisses
    const dropdownUser = document.querySelector('.dropdown-user');
    dropdownUser.innerHTML = ''; // Leert den Inhalt des Dropdown-Menüs
    const userList = document.createElement('ul'); // Erstellt eine ungeordnete Liste für Benutzer
    userList.classList.add('user-list');

    // Fügt jedem Benutzer eine Checkbox hinzu
    users.forEach(user => {
        const listItem = document.createElement('li');
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.value = user;
        listItem.appendChild(checkbox);
        listItem.appendChild(document.createTextNode(user));
        userList.appendChild(listItem);
    });

    // Fügt die Benutzerliste dem Dropdown-Menü hinzu
    dropdownUser.appendChild(userList);

    // Zeigt das Dropdown-Menü an
    dropdownUser.style.display = 'block';

    // Schließt das Dropdown-Menü, wenn außerhalb davon geklickt wird
    document.addEventListener('click', closeUserList);
}

// Die Funktion, um das Dropdown-Menü zu schließen, wenn außerhalb davon geklickt wird
function closeUserList() {
    const dropdownUser = document.querySelector('.dropdown-user');
    dropdownUser.style.display = 'none';
    document.removeEventListener('click', closeUserList);
}

// Verhindert, dass das Klicken innerhalb des Dropdown-Menüs es schließt
function stopPropagation(event) {
    event.stopPropagation();
}

// Fügt den Eventlistener zum Klicken auf das Eingabefeld hinzu, um die Benutzerliste zu öffnen
document.getElementById('taskTitle').addEventListener('click', openUserList);
