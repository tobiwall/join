let dueDates = [];

async function initSummary() {
  includeHTML();
  await loadCurrentUsers();
  load();
  loadTodoTasks();
  loadTaskInProgress();
  loadTasksFeedback();
  loadDoneTasks();
  loadTasksUrgent();
  loadTaskInBoard();
  greeting();
  loadUpcomingDeadline();
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

function getCurrentDate() {
  const today = new Date();
  const year = today.getFullYear();
  let month = today.getMonth() + 1; // Monat ist nullbasiert, daher +1
  let day = today.getDate();

  // Füge eine führende Null hinzu, wenn der Monat oder Tag einstellig ist
  if (month < 10) {
      month = '0' + month;
  }
  if (day < 10) {
      day = '0' + day;
  }

  return `${year}-${month}-${day}`;
}

function formatDate(dateString) {
  const date = new Date(dateString);
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return date.toLocaleDateString('en-US', options);
}

function loadUpcomingDeadline() {
  let deadlineContainer = document.getElementById('deadlineContainer');
  const currentDate = getCurrentDate();

  for (let i = 0; i < allTasks.length; i++) {
    const taskDate = allTasks[i].dueDate;
    
    dueDates.push(taskDate)
  }
  dueDates.sort();
  let deadline = formatDate(dueDates[0]);

  if (dueDates.length > 0) {
    deadlineContainer.innerHTML = `
      <span class="deadline-date">${deadline}</span>
      <span>Upcoming deadline</span>
    `;
  } else {
    deadlineContainer.innerHTML = `
      <span>No upcoming Deadline</span>
    `;
  }
}

function loadTodoTasks() {
  let displayedTodo = document.getElementById('toDoAmount');
  let todoCount = 0;

  for (let i = 0; i < allTasks.length; i++) {
    
    if (allTasks[i].status === 'todo') {
      todoCount++;
    }  
  }
  displayedTodo.innerHTML = todoCount;  
}

function loadTaskInProgress() {
  let displayedProgress = document.getElementById('progressAmount');
  let progressCount = 0;

  for (let i = 0; i < allTasks.length; i++) {
    
    if (allTasks[i].status === 'progress') {
      progressCount++;
    }  
  }
  displayedProgress.innerHTML = progressCount;
}

function loadTasksFeedback() {
  let displayedFeedback = document.getElementById('feedbackAmount');
  let feedbackCount = 0;

  for (let i = 0; i < allTasks.length; i++) {
    
    if (allTasks[i].status === 'feedback') {
      feedbackCount++;
    }  
  }
  displayedFeedback.innerHTML = feedbackCount;
}

function loadDoneTasks() {
  let displayedDone = document.getElementById('doneAmount');
  let doneCount = 0;

  for (let i = 0; i < allTasks.length; i++) {
    
    if (allTasks[i].status === 'progress') {
      doneCount++;
    }  
  }
  displayedDone.innerHTML = doneCount;
}

function loadTasksUrgent() {
  let displayedUrgent = document.getElementById('urgentAmount');
  let urgentCount = 0;

  for (let i = 0; i < allTasks.length; i++) {
    
    if (allTasks[i].prio === 'urgent') {
      urgentCount++;
    }  
  }
  displayedUrgent.innerHTML = urgentCount;
}

function loadTaskInBoard() {
  let allCount = allTasks.length;
  let displayedAll = document.getElementById('allAmount');

  displayedAll.innerHTML = allCount;
}

