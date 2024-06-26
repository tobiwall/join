/**
 * der Eventlistener closes the dropdown if one is open
 * 
 */
document.addEventListener("click", function(event) {
    const dropdowns = document.querySelectorAll(".dropdown");
    const userList = document.getElementById("editDropdownUsers");
    const addTaskUserList = document.getElementById("dropdown-users");
    let categoryList = document.getElementById("dropdown-categories");
    const inputs = document.querySelectorAll("input");
    const userContainers = document.querySelectorAll(".user-container");
    const isClickInsideDropdown = Array.from(dropdowns).some(dropdown => dropdown.contains(event.target));
    const isClickInsideInput = Array.from(inputs).some(input => input.contains(event.target));
    const isClickInsideUserContainer = Array.from(userContainers).some(container => container.contains(event.target));
  
    if (!isClickInsideDropdown && !isClickInsideInput && !isClickInsideUserContainer) {
        hideUsers();
        if (categoriesContainerClicked) {
        openCategories();
        }
        dropdowns.forEach(dropdown => {
            dropdown.style.border = "0px";
            if (userList) {
                userList.style.border = "0px";
            }
            if (addTaskUserList) {
                addTaskUserList.style.border = "0px";
                addTaskUserList.innerHTML = "";
            }
            if (categoryList) {
                categoryList.style.border = "0px";
                categoryList.innerHTML = "";
            }
        });
    }
});
  
const inputs = document.querySelectorAll("input");
inputs.forEach(input => {
    input.addEventListener("mousedown", function(event) {
        event.stopPropagation();
    });
});
