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
  
  /**
   * This function closes the popup add Task
   * 
   */
  function closeAddTaskPopup() {
    let content = document.querySelector(".content");
    let addTaskTemplate = document.getElementById("addTaskTemplate");
    addTaskTemplate.style.right = "-600px";
    content.classList.remove('non-clickable');
  }
  
  /**
   * This function checks the start container
   * 
   * @param {*} id is the id of the draged element
   */
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
    highlightContainersButCurrent(id);
  }

  /**
   * add the highlighed toDrop container
   * 
   * @param {*} id is the current container id
   * @returns ends if the window is mobile
   */
  function highlightContainersButCurrent(id) {
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
  
  /**
   * addHighlightMobil highlighted the container if the window width is mobile
   * 
   * @param {*} id is the id of the container
   */
  function addHighlightMobil(id) {
    if (isMobil) {
      let container = document.getElementById(id);
      container.classList.add("highlightContainer");
    }
  }
  
  /**
   * removeHighlightMobil removes the highlighted containers if widow is mobile
   * 
   * @param {*} id is the id of the container
   */
  function removeHighlightMobil(id) {
    if (isMobil) {
      let container = document.getElementById(id);
      container.classList.remove("highlightContainer");
    }
  }
  
  /**
   * This function checks if the window width in board is mobile
   * 
   * @returns true or false
   */
  function checkIsMobil() {
    isMobil = false;
    let screenWidth = window.innerWidth;
    if (screenWidth < 1551) {
      isMobil = true;
    }
    return isMobil;
  }

  /**
   * generate the drop place HTML
   * 
   * @param {*} containerStatus is the status from the to shown place
   * @returns the html templates
   */
  function generateDropPlaceHTML(containerStatus) {
    return /*html*/ `
      <div ondragover="allowDrop(event)" id="dropPlace${containerStatus}" class="dropPlace d-none">
        <h3>Drop here</h3>
      </div>
    `;
  }
  
  /**
   * remove highlighted containers in display width
   * 
   * @param {*} id is the id of the container
   */
  function removeHighlight(id) {
    let container = document.getElementById(id);
    let dropPlace = document.getElementById(`dropPlace${id}`);
    dropPlace.classList.add("d-none");
  }
  
  /**
   * This function allows to drop here an element
   * 
   * @param {*} ev 
   */
  function allowDrop(ev) {
    ev.preventDefault();
  }
  
  /**
   * moveTo moves the draged element to the droped place
   * 
   * @param {*} statusContainer is the container where the element to drop
   * @param {*} index is the index of the task
   */
  async function moveTo(statusContainer, index) {
    let task = findTaskById();
    let taskId = task.idKey;
    await updateStatusTask(taskId, statusContainer);
    task.status = statusContainer;
    renderCards();
    renderSubtasksOnload();
    removeHighlight(index);
    isTouching = false;
  }
  
  /**
   * findTaskById search the dragged task in allTasks
   * 
   * @returns the draged task
   */
  function findTaskById() {
    return allTasks.find((task) => task.id === currentDraggedTask);
  }
  
  /**
   * gives currentDraggedTask the id from the dragged task
   * 
   * @param {*} id 
   */
  function startDragging(id) {
    currentDraggedTask = id;
  }
  
  /**
   * filter gets the input from the searchbar
   * 
   */
  function filter() {
    let searchInput = document.getElementById("searchInput");
    let searchTerm = searchInput.value.toLowerCase();
    filterTitle(searchTerm);
  }
  
  /**
   * This function calls the function to clear and display found tasks
   * 
   * @param {*} search is the value of the searchbar
   */
  function filterTitle(search) {
    let todo = document.getElementById("toDoContainer");
    let progress = document.getElementById("inProgressContainer");
    let feedback = document.getElementById("awaitFeedbackContainer");
    let done = document.getElementById("doneContainer");
    clearTaskContainer(todo, progress, feedback, done);
    displayFilteredTasks(todo, progress, feedback, done, search);
  }
  
  /**
   * clear the task containers
   * 
   * @param {*} todo 
   * @param {*} progress 
   * @param {*} feedback 
   * @param {*} done 
   */
  function clearTaskContainer(todo, progress, feedback, done) {
    todo.innerHTML = "";
    progress.innerHTML = "";
    feedback.innerHTML = "";
    done.innerHTML = "";
  }
  
  /**
   * This function calls the function to filter all tasks if search
   * 
   * @param {*} todo is a container for tasks
   * @param {*} progress is a container for tasks
   * @param {*} feedback is a container for tasks
   * @param {*} done is a container for tasks
   * @param {*} search is the searchbar
   */
  function displayFilteredTasks(todo, progress, feedback, done, search) {
    for (let i = 0; i < allTasks.length; i++) {
      const task = allTasks[i];
      if (!task.title) {
        continue;
      }
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
  
  /**
   * filtered toDO task for the leters of searchbar
   * 
   * @param {*} task is the current Task
   * @param {*} toDoContainer is the container where the tasks are placed
   * @param {*} i is the index if the task
   * @param {*} taskId is the id of the task
   */
  function filteredToDo(task, toDoContainer, i, taskId) {
    if (task.status === "todo") {
      toDoContainer.innerHTML += generateCardHTML(task, i, taskId);
      categoryColor(i, taskId);
      renderUsers(i, taskId);
      generateCardPrio(task, i, taskId);
    }
  }
  
/**
 * filtered in progress task for the leters of searchbar
 * 
 * @param {*} task is the current Task
 * @param {*} inProgressContainer is the container where the tasks are placed
 * @param {*} i is the index if the task
 * @param {*} taskId is the id of the task
 */
  function filteredInProgress(task, inProgressContainer, i, taskId) {
    if (task.status === "progress") {
      inProgressContainer.innerHTML += generateCardHTML(task, i, taskId);
      categoryColor(i, taskId);
      renderUsers(i, taskId);
      generateCardPrio(task, i, taskId);
    }
  }
  
  /**
   * filtered await feedback task for the leters of searchbar
   * 
   * @param {*} task is the current Task
   * @param {*} awaitFeedbackContainer is the container where the tasks are placed
   * @param {*} i is the index if the task
   * @param {*} taskId is the id of the task
   */
  function filteredAwaitFeedback(task, awaitFeedbackContainer, i, taskId) {
    if (task.status === "feedback") {
      awaitFeedbackContainer.innerHTML += generateCardHTML(task, i, taskId);
      categoryColor(i, taskId);
      renderUsers(i, taskId);
      generateCardPrio(task, i, taskId);
    }
  }
  
  /**
   * filtered done task for the leters of searchbar
   * 
   * @param {*} task is the current Task
   * @param {*} doneContainer is the container where the tasks are placed
   * @param {*} i is the index if the task
   * @param {*} taskId is the id of the task
   */
  function filteredDone(task, doneContainer, i, taskId) {
    if (task.status === "done") {
      doneContainer.innerHTML += generateCardHTML(task, i, taskId);
      categoryColor(i, taskId);
      renderUsers(i, taskId);
      generateCardPrio(task, i, taskId);
    }
  }
  
  /**
   * function to log out the user
   * 
   */
  async function logOut() {
    await deleteData("/currentUser");
    window.location.href = './index.html';
  }