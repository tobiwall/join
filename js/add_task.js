function createTask() {
  let title = document.getElementById('taskTitle');
  let discription = document.getElementById('taskDiscription');
  let subtasks = document.getElementById('taskSubtasks');
  let date = document.getElementById('taskDate');

let newTask = {
  'id': 0,
  'title': title.value,
  'description': discription.value,
  'assignedTo': '',
  'dueDate': date.value,
  'prio': '',
  'category': '',
  'subtasks': subtasks.value
};

  tasks.push(newTask);
}