async function loadContacts() {
  await loadAllContacts();
  extractInitials(contacts);
  randomBackgroundColor();
  sortContacts();
}

/**
 * showUsers() open the assigned to dropdown 
 *
 */
function showUsers() {
  let userList = document.getElementById("dropdown-users");
  let icon = document.getElementById("openUserIcon");
  userList.innerHTML = "";
  icon.style.transform = "rotate(180deg)";
  loadContacts();
  if (!assignedContainerClicked) {
    userList.style.border = "1px solid #CDCDCD";
    displayUserList(userList);
  } else {
    userList.style.border = "0px";
    hideUsers();
  }
}

/**
 * displayUserList(userList) render the contact list into dropdown
 *
 */
function displayUserList(userList) {
  assignedContainerClicked = true;
  for (let i = 0; i < contacts.length; i++) {
    const contact = contacts[i];
    if (contact !== null) {
      userList.innerHTML += userTemplate(contact);
    }
  }
  selectedUsers.forEach((user) => {
    const checkbox = document.querySelector(
      `input[data-contact='${JSON.stringify(user)}']`
    );
    if (checkbox) {
      checkbox.checked = true;
    }
  });
}

function userTemplate(contact) {
  return `
  <div class="user-container">
    <div class="user">
      <div class="user-initials" style="background-color: ${contact.color};">
        ${contact.initials}
      </div>
      <div>
        ${contact.name}
      </div>
    </div>
    <div>
      <input id="confirm" type="checkbox" name="assignedUser" value="${
        contact.name
      }" data-contact='${JSON.stringify(
    contact
  )}' onchange="handleCheckboxChange(event)"><label for="confirm"></label>
    </div>
  </div>
`;
}

/**
 * hideUsers() close the dropdown of assigned to
 *
 */
function hideUsers() {
  assignedContainerClicked = false;
  let userList = document.getElementById("dropdown-users");
  let icon = document.getElementById("openUserIcon");
  icon.style.transform = "rotate(0deg)";
  userList.innerHTML = "";
}

/**
 * handleCheckboxChange(event) controlls if a user is checked, when so push it into the selected users for the new task
 *
 */
function handleCheckboxChange(event) {
  const checkbox = event.target;
  const contactData = JSON.parse(checkbox.getAttribute("data-contact"));

  if (checkbox.checked) {
    selectedUsers.push(contactData);
    users.push(contactData);
    renderAssignedUser();
  } else {
    const selectedUserIndex = selectedUsers.findIndex(
      (user) => user.name === contactData.name
    );
    if (selectedUserIndex !== -1) {
      selectedUsers.splice(selectedUserIndex, 1);
    }
    const userIndex = users.findIndex((user) => user.name === contactData.name);
    if (userIndex !== -1) {
      users.splice(userIndex, 1);
      renderAssignedUser();
    }
  }
}

/**
 * searchUser() search for a user in the dropdown by tiping 
 *
 */
function searchUser() {
  let searchValue = document
    .getElementById("userInput")
    .value.trim()
    .toLowerCase();
  let userList = document.getElementById("dropdown-users");
  userList.innerHTML = "";
  loadContacts();

  for (let i = 0; i < contacts.length; i++) {
    const contact = contacts[i];
    if (contact.name.trim().toLowerCase().includes(searchValue)) {
      userList.innerHTML += userTemplate(contact);
    }
  }
}

/**
 * renderAssignedUser() render the selected users into the container
 *
 */
function renderAssignedUser() {
  let assignedUsers = document.getElementById("contentAssignedUsers");
  assignedUsers.innerHTML = "";

  for (let i = 0; i < users.length; i++) {
    const user = users[i];

    assignedUsers.innerHTML += `
    <div class="initialien-addtask-container" style="background-color: ${user.color};">
      ${user.initials}
    </div>
    `;
  }
}