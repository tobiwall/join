let selectedPriority = "medium";
let subtasks;
let users = [];
let selectedUsers = [];
let categories = [
  "User Story",
  "Technical Task",
  "Feature",
  "Bug",
  "Documentation",
  "Design",
  "Testing QA",
  "Analyse/Research",
];
let assignedContainerClicked = false;
let categoriesContainerClicked = false;

async function initAddTask() {
  await includeHTML();
  await loadCurrentUsers();
  await loadAllTasks();
  contacts = await loadAllContacts();
  orderContacts();
  taskId = findHighestTaskId();
  showHeaderUser();
}

async function createTask(status) {
  let title = document.getElementById("taskTitle");
  let discription = document.getElementById("taskDiscription");
  let date = document.getElementById("taskDate");
  let category = document.getElementById("categoryInput");

  if (users.length == 0) {
    users = "";
  }
  taskId++;
  let newTask = {
    id: taskId,
    status: status,
    title: title.value,
    description: discription.value,
    users: users,
    dueDate: date.value,
    prio: selectedPriority,
    category: category.value,
    subtasks: subtasks,
  };
  await postData("/allTasks", newTask);
  allTasks.push(newTask);
  addedTaskAnimation();
  if (window.location.href === 'http://127.0.0.1:5500/add_task.html' || window.location.href === 'https://join-165.developerakademie.net/join_165/add_task.html') {
    window.location.href = "./board.html";
  } else {
    closeAddTaskPopup();
    clearPopupForm();
    renderNewCard(newTask);
  }
}

function clearPopupForm() {
  let title = document.getElementById("taskTitle");
  let discription = document.getElementById("taskDiscription");
  let date = document.getElementById("taskDate");
  let category = document.getElementById("categoryInput");
  let contentAssignedUsers = document.getElementById("contentAssignedUsers");
  let contentSubtasks = document.getElementById("contentSubtasks");
  title.value = "";
  discription.value = "";
  date.value = "";
  category.value = "";
  contentAssignedUsers.innerHTML = "";
  contentSubtasks.innerHTML = "";
}

/**
 * renderNewCard(newTask) renders a new task
 *
 */
function renderNewCard(newTask) {
  let toDoContainer = document.getElementById("toDoContainer");
  let inProgressContainer = document.getElementById("inProgressContainer");
  let awaitFeedbackContainer = document.getElementById("awaitFeedbackContainer");
  if (newTask.status === 'todo') {
    displayNewCard(newTask, toDoContainer);
  }
  if (newTask.status === 'progress') {
    displayNewCard(newTask, inProgressContainer);
  }
  if (newTask.status === 'feedback') {
    displayNewCard(newTask, awaitFeedbackContainer);
  }
}

function displayNewCard(newTask, container) {
  let taskId = newTask.id;
  const i = allTasks.findIndex(task => task.id === newTask.id);
  container.innerHTML += generateCardHTML(newTask, i, taskId);
  categoryColor(i, taskId);
  generateProgressbar(i, newTask);
  renderUsers(i, taskId);
  generateCardPrio(newTask, i, taskId);
}

/**
 * addedTaskAnimation() animation for popup after added a task
 *
 */
function addedTaskAnimation() {
  let addedTaskPopup = document.getElementById('addedTaskPopup');

  addedTaskPopup.style.display = 'flex';
  addedTaskPopup.offsetHeight;
  showPopupAndAnimate();
}

function showPopupAndAnimate() {
  let addedTaskPopup = document.getElementById('addedTaskPopup');

  addedTaskPopup.style.bottom = '110%';
  setTimeout(() => {
      addedTaskPopup.style.display = 'none';
      addedTaskPopup.style.bottom = '-10%';
  }, 2500);
}

/**
 * validateForm(event, status) validate the form to controll if required fields are filled
 *
 */
function validateForm(event, status) {
  event.preventDefault();

  let title = document.getElementById("taskTitle");
  let dueDate = document.getElementById("taskDate");
  let category = document.getElementById("categoryInput");
  let titleError = document.getElementById("errorMessageTitle");
  let dateError = document.getElementById("errorMessageDate");
  let categoryError = document.getElementById("errorMessageCategory");

  let isValid = true;

  if (title.value.trim() === "") {
      title.style.border = "1px solid #FF8190";
      titleError.innerText = "Please fill out this field.";
      isValid = false;
  } else {
      title.style.border = "";
      titleError.innerText = "";
  }

  if (dueDate.value === "") {
      dueDate.style.border = "1px solid #FF8190";
      dateError.innerText = "Please fill out this field.";
      isValid = false;
  } else {
      dueDate.style.border = "";
      dateError.innerText = "";
  }

  if (category.value.trim() === "") {
      category.style.border = "1px solid #FF8190";
      categoryError.innerText = "Please fill out this field.";
      isValid = false;
  } else {
      category.style.border = "";
      categoryError.innerText = "";
  }

  if (isValid) {
      addedTaskAnimation();
      setTimeout(() => {
          createTask(status);
      }, 1500);
  }

  return isValid;
}

/**
 * toggleButton(priority) switch buttons and give the prio to task
 *
 */
function toggleButton(priority) {
  if (priority === "urgent") {
    prioUrgent(priority);
  } else if (priority === "medium") {
    prioMedium(priority);
  } else if (priority === "low") {
    prioLow(priority);
  }
}

function prioUrgent(priority) {
  document.getElementById(priority).classList.add("urgent-active");
  document.getElementById(priority + "Img").src =
    "./assets/icons/prio_buttons/prio_urgent.png";
  document.getElementById("medium").classList.remove("medium-active");
  document.getElementById("mediumImg").src =
    "./assets/icons/prio_buttons/prio_medium_yellow.png";
  document.getElementById("low").classList.remove("low-active");
  document.getElementById("lowImg").src =
    "./assets/icons/prio_buttons/prio_low_green.png";
  selectedPriority = priority;
}

function prioMedium(priority) {
  document.getElementById(priority).classList.add("medium-active");
  document.getElementById(priority + "Img").src =
    "./assets/icons/prio_buttons/prio_medium.png";
  document.getElementById("urgent").classList.remove("urgent-active");
  document.getElementById("urgentImg").src =
    "./assets/icons/prio_buttons/prio_urgent_red.png";
  document.getElementById("low").classList.remove("low-active");
  document.getElementById("lowImg").src =
    "./assets/icons/prio_buttons/prio_low_green.png";
  selectedPriority = priority;
}

function prioLow(priority) {
  document.getElementById(priority).classList.add("low-active");
  document.getElementById(priority + "Img").src =
    "./assets/icons/prio_buttons/prio_low.png";
  document.getElementById("urgent").classList.remove("urgent-active");
  document.getElementById("urgentImg").src =
    "./assets/icons/prio_buttons/prio_urgent_red.png";
  document.getElementById("medium").classList.remove("medium-active");
  document.getElementById("mediumImg").src =
    "./assets/icons/prio_buttons/prio_medium_yellow.png";
  selectedPriority = priority;
}

function changeClearButton(button, newSrc) {
  let img = button.querySelector("img");
  img.src = newSrc;
}

function resetClearButton(button, newSrc) {
  let img = button.querySelector("img");
  img.src = newSrc;
}

function renderCategories() {
  let categoryContainer = document.getElementById('dropdown-categories');
  categoryContainer.innerHTML = '';

  for (let i = 0; i < categories.length; i++) {
    const category = categories[i];
    
    categoryContainer.innerHTML += `
      <div class="task-category" onclick="selectCategory('${category}')">
        ${category}
      </div>
    `;
  }
}

function selectCategory(categoryText) {
  let categoryInput = document.getElementById('categoryInput');
  let categoryList = document.getElementById("dropdown-categories");

  categoryInput.value = categoryText;
  hideCategories();
  categoryList.style.border = "0px";
}

function openCategories() {
  let categoryList = document.getElementById("dropdown-categories");
  let icon = document.getElementById("openCategoriesIcon");
  icon.style.transform = "rotate(180deg)";
  categoryList.innerHTML = "";
  if (!categoriesContainerClicked) {
    categoriesContainerClicked = true;
    categoryList.style.border = "1px solid #CDCDCD";
    renderCategories();
  } else {
    categoriesContainerClicked = false;
    categoryList.style.border = "0px";
    hideCategories();
  }
}

function hideCategories() {
  categoriesContainerClicked = false;
  let categoryList = document.getElementById("dropdown-categories");
  let icon = document.getElementById("openCategoriesIcon");
  icon.style.transform = "rotate(0deg)";
  categoryList.innerHTML = "";
}
