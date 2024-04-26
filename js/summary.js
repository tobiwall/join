function initSummary() {
  includeHTML();
  load();
  loadTodoTasks();
  loadTaskInProgress();
  loadTasksFeedback();
  loadDoneTasks();
  loadTasksUrgent();
  loadTaskInBoard();
}

function loadTodoTasks() {
  let todoAmount = cardsToDo.length;
  let displayedTodo = document.getElementById('toDoAmount');

  displayedTodo.innerHTML = todoAmount;
}

function loadTaskInProgress() {
  let progressAmount = cardsInProgress.length;
  let displayedProgress = document.getElementById('progressAmount');

  displayedProgress.innerHTML = progressAmount;
}

function loadTasksFeedback() {
  let feedbackAmount = cardsAwaitFeedback.length;
  let displayedFeedback = document.getElementById('feedbackAmount');

  displayedFeedback.innerHTML = feedbackAmount;
}

function loadDoneTasks() {
  let doneAmount = cardsDone.length;
  let displayedDone = document.getElementById('doneAmount');

  displayedDone.innerHTML = doneAmount;
}

function loadTasksUrgent() {
  let urgentAmount = cardsUrgent.length;
  let displayedUrgent = document.getElementById('urgentAmount');

  displayedUrgent.innerHTML = urgentAmount;
}

function loadTaskInBoard() {
  let allAmount = allTasks.length;
  let displayedAll = document.getElementById('allAmount');

  displayedAll.innerHTML = allAmount;
}

