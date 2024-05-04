document.addEventListener("DOMContentLoaded", function () {

function checkInputs() {
    const title = document.getElementById("taskTitle").value;
    const dueDate = document.getElementById("taskDate").value;
    const category = document.getElementById("categoryInput").value;

    const createTaskButton = document.getElementById("createTaskButton");

    if (
      title.trim() !== "" && dueDate.trim() !== "" && category.trim() !== "") {
      createTaskButton.disabled = false;
    } else {
      createTaskButton.disabled = true;
    }
  }
debugger;
  document.getElementById("taskTitle").addEventListener("input", checkInputs);
  document.getElementById("taskDate").addEventListener("change", checkInputs);
  document.getElementById("categoryInput").addEventListener("change", checkInputs);

});