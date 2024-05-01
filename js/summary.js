function initSummary() {
  includeHTML();
  load();
  loadTodoTasks();
  loadTaskInProgress();
  loadTasksFeedback();
  loadDoneTasks();
  loadTasksUrgent();
  loadTaskInBoard();
  greeting();
}

function changeTodoCard(card, newSrc) {
  let img = card.querySelector('img');
  img.src = newSrc;
}

function resetTodoCard(card, newSrc) {
  let img = card.querySelector('img');
  img.src = newSrc;
}

function changeDoneCard(card, newSrc) {
  let img = card.querySelector('img');
  img.src = newSrc;
}

function resetDoneCard(card, newSrc) {
  let img = card.querySelector('img');
  img.src = newSrc;
}

function greeting() {
  let greetingContainer = document.getElementById('greeting-time');
  let date = new Date();
  let actualHour = date.getHours();
  
  if (actualHour >= 5 && actualHour <= 11) {
    greetingContainer.innerHTML = 'Good morning,';
  } else if (actualHour >= 12 && actualHour <= 17) {
    greetingContainer.innerHTML = 'Good afternoon,';
  } else {
    greetingContainer.innerHTML = 'Good evening,';
  }
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

