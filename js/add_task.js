let selectedPriority;
let subtasks = [];

function createTask() {
  let title = document.getElementById('taskTitle');
  let discription = document.getElementById('taskDiscription');
  let date = document.getElementById('taskDate');
  let category = document.getElementById('categoryInput');

  let newTask = {
    'id': 0,
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
    let listItem = document.createElement('li');
    listItem.textContent = subtaskText;
    subtasksList.appendChild(listItem);
    subtasks.push(subtaskText);
    input.value = ''; 
  }
}

function clearInput() {
  document.getElementById('subtasksInput').value = '';
}
