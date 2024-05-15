/**
 * openAddTask opens the popup to add a new task
 * 
 * @param {*} status is the parameter for the container where to show this new card
 */
function openAddTask(status) {
    let content = document.querySelector(".content");
    let addTaskTemplate = document.getElementById("addTaskTemplate");
    let closeIcon = document.getElementById("close-task-popup-img");
    closeIcon.style.display = "flex";
  
    addTaskTemplate.style.right = "50%";
    content.classList.add('non-clickable');
  
    document.getElementById("createTaskButton").setAttribute("onclick", `validateForm(event, '${status}')`);
  }
  
  function closeAddTaskPopup() {
    let content = document.querySelector(".content");
    let addTaskTemplate = document.getElementById("addTaskTemplate");
    addTaskTemplate.style.right = "-600px";
    content.classList.remove('non-clickable');
  }
  
  function addHighlight(id) {
    if (id === "todo") {
      index = toDoContainer;
    }
    if (id === "progress") {
      index = inProgressContainer;
    }
    if (id === "feedback") {
      index = awaitFeedbackContainer;
    }
    if (id === "done") {
      index = doneContainer;
    }
    let container = document.getElementById(id);
    let currentContainer = document.getElementById(`dropPlace${index.id}`);
    let dropPlace = document.getElementsByClassName("dropPlace");
    let currentMobilWidth = checkIsMobil();
    if (currentMobilWidth) {
      return;
    } else {
      for (let i = 0; i < dropPlace.length; i++) {
        if (dropPlace[i] === currentContainer) {
          continue;
        } else {
          dropPlace[i].classList.remove("d-none");
        }
      }
    }
  }
  
  function addHighlightMobil(id) {
    if (isMobil) {
      let container = document.getElementById(id);
      container.classList.add("highlightContainer");
    }
  }
  
  function removeHighlightMobil(id) {
    if (isMobil) {
      let container = document.getElementById(id);
      container.classList.remove("highlightContainer");
    }
  }
  
  function checkIsMobil() {
    isMobil = false;
    let screenWidth = window.innerWidth;
    if (screenWidth < 1551) {
      isMobil = true;
    }
    return isMobil;
  }
  
  function generateDropPlaceHTML(containerStatus) {
    return /*html*/ `
      <div ondragover="allowDrop(event)" id="dropPlace${containerStatus}" class="dropPlace d-none">
        <h3>Drop here</h3>
      </div>
    `;
  }
  
  function removeHighlight(id) {
    let container = document.getElementById(id);
    let dropPlace = document.getElementById(`dropPlace${id}`);
    dropPlace.classList.add("d-none");
  }
  
  function allowDrop(ev) {
    ev.preventDefault();
  }
  
  async function moveTo(statusContainer, index) {
    let task = findTaskById();
    let taskId = task.idKey;
    await updateStatusTask(taskId, statusContainer);
    task.status = statusContainer;
    renderCards();
    renderSubtasksOnload();
    removeHighlight(index);
  }
  
  function findTaskById() {
    return allTasks.find((task) => task.id === currentDraggedTask);
  }
  
  function startDragging(id) {
    currentDraggedTask = id;
  }
  
  function filter() {
    let searchInput = document.getElementById("searchInput");
    let searchTerm = searchInput.value.toLowerCase();
    filterTitle(searchTerm);
  }
  
  function filterTitle(search) {
    let todo = document.getElementById("toDoContainer");
    let progress = document.getElementById("inProgressContainer");
    let feedback = document.getElementById("awaitFeedbackContainer");
    let done = document.getElementById("doneContainer");
    clearTaskContainer(todo, progress, feedback, done);
    displayFilteredTasks(todo, progress, feedback, done, search);
  }
  
  function clearTaskContainer(todo, progress, feedback, done) {
    todo.innerHTML = "";
    progress.innerHTML = "";
    feedback.innerHTML = "";
    done.innerHTML = "";
  }
  
  function displayFilteredTasks(todo, progress, feedback, done, search) {
    for (let i = 0; i < allTasks.length; i++) {
      const task = allTasks[i];
      const title = task.title;
      const taskId = allTasks[i].id;
      if (title.toLowerCase().includes(search)) {
        filteredToDo(task, todo, i, taskId);
        filteredInProgress(task, progress, i, taskId);
        filteredAwaitFeedback(task, feedback, i, taskId);
        filteredDone(task, done, i, taskId);
      }
    }
  }
  
  function filteredToDo(task, toDoContainer, i, taskId) {
    if (task.status === "todo") {
      toDoContainer.innerHTML += generateCardHTML(task, i, taskId);
      categoryColor(i, taskId);
      renderUsers(i, taskId);
      generateCardPrio(task, i, taskId);
    }
  }
  
  function filteredInProgress(task, inProgressContainer, i, taskId) {
    if (task.status === "progress") {
      inProgressContainer.innerHTML += generateCardHTML(task, i, taskId);
      categoryColor(i, taskId);
      renderUsers(i, taskId);
      generateCardPrio(task, i, taskId);
    }
  }
  
  function filteredAwaitFeedback(task, awaitFeedbackContainer, i, taskId) {
    if (task.status === "feedback") {
      awaitFeedbackContainer.innerHTML += generateCardHTML(task, i, taskId);
      categoryColor(i, taskId);
      renderUsers(i, taskId);
      generateCardPrio(task, i, taskId);
    }
  }
  
  function filteredDone(task, doneContainer, i, taskId) {
    if (task.status === "done") {
      doneContainer.innerHTML += generateCardHTML(task, i, taskId);
      categoryColor(i, taskId);
      renderUsers(i, taskId);
      generateCardPrio(task, i, taskId);
    }
  }
  
  async function logOut() {
    await deleteData("/currentUser");
    window.location.href = './index.html';
  }