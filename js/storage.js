const STORAGE_URL =
  "https://join-gruppenarbeit-default-rtdb.europe-west1.firebasedatabase.app/";

let currentUser = null;

/**
 * postData() post new data to firebase
 * 
 * @param {*} path in firebase
 * @param {*} data new data to post
 * @returns data as JSON
 */
async function postData(path = "", data = {}) {
  let response = await fetch(STORAGE_URL + path + ".json", {
    method: "POST",
    header: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return (responseToJson = await response.json());
}

async function saveContactsOnFirebase() {
  for (let i = 0; i < contacts.length; i++) {
    const contact = contacts[i];
    await addContactToFirebase(contact);
  }
}

/**
 * addContactToFirebase() put contact to firebase
 * 
 * @param {*} contact is the contact which is to put
 */
async function addContactToFirebase(contact) {
  try {
    const response = await fetch(`${STORAGE_URL}/contacts/${contact.id}.json`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(contact),
    });

    if (!response.ok) {
      throw new Error("Fehler beim Hinzufügen des Kontakts zu Firebase");
    }

    const responseData = await response.json();
    console.log("Kontakt erfolgreich zu Firebase hinzugefügt:", responseData);
  } catch (error) {
    console.error("Fehler beim Hinzufügen des Kontakts zu Firebase:", error);
  }
}

/**
 * getData() gets the data from firebase
 * 
 * @param {*} path in firebase
 * @returns the date from this path
 */
async function getData(path = "") {
  let response = await fetch(STORAGE_URL + path + ".json");
  return (responseToJson = await response.json());
}

/**
 * deleteData() deletes task
 * 
 * @param {*} path in firebase
 * @returns 
 */
async function deleteData(path = "") {
  let response = await fetch(STORAGE_URL + path + ".json", {
    method: "DELETE",
  });
  return (responseToJson = await response.json());
}

/**
 * loadUsers() loades all users from firebase
 * 
 */
async function loadUsers() {
  let loadedUsers = await getData("/users");
  for (const key in loadedUsers) {
    if (Object.hasOwnProperty.call(loadedUsers, key)) {
      users.push(loadedUsers[key]);
    }
  }
}

/**
 * loadCurrentUsers() loads the current user from firebase
 * 
 */
async function loadCurrentUsers() {
  let loadedCurrentUser = await getData("/currentUser");
  for (const key in loadedCurrentUser) {
    if (Object.hasOwnProperty.call(loadedCurrentUser, key)) {
      currentUser = loadedCurrentUser[key];
    }
  }
}

/**
 * loadAllTasks() gets all data from firebase of allTasks
 * 
 */
async function loadAllTasks() {
  let loadedAllTasks = await getData("/allTasks");
  for (const key in loadedAllTasks) {
    if (Object.hasOwnProperty.call(loadedAllTasks, key)) {
      const taskKey = key;
      const task = loadedAllTasks[key];
      allTasks.push({ idKey: taskKey, ...task });
    }
  }
}

/**
 * updateContacts() updates the contact from edit contact
 * 
 * @param {*} contact is the new input from edit contact
 * @param {*} id is the id of this contact
 */
async function updateContacts(contact, id) {
  try {
    const response = await fetch(`${STORAGE_URL}/contacts/${id}.json`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(contact),
    });

  } catch (error) {
    console.error('Error updating contact:', error);
    throw error;
  }
}

/**
 * loadAllContacts() loads all contacts to firebase
 * 
 * @returns loaded contacts
 */
async function loadAllContacts() {
  let loadedContacts = await getData("/contacts");
  return loadedContacts;
}

/**
 * updateTask() updates the subtasks
 * 
 * @param {*} taskId is the id of the task
 * @param {*} updateSubTask is the new input from subtasks
 * @param {*} j is the index of subtask
 */
async function updateTask(taskId, updateSubTask, j) {
  try {
    const response = await fetch(`${STORAGE_URL}/allTasks/${taskId}/subtasks/${j}/completed.json`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updateSubTask),
    });

  } catch (error) {
    
  }
}

/**
 * updateStatusTask() changes the status if task is move to another container
 * 
 * @param {*} taskId is the id of the task
 * @param {*} updateStatusTask is the new status
 */
async function updateStatusTask(taskId, updateStatusTask) {
  try {
    const response = await fetch(`${STORAGE_URL}/allTasks/${taskId}/status.json`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updateStatusTask),
    });

  } catch (error) {
    
  }
}

/**
 * updateEditTask() updates the in firebase
 * 
 * @param {*} taskIdKey is the idKey from the task
 * @param {*} updateTask is the new input from edit Task
 */
async function updateEditTask(taskIdKey, updateTask) {
  try {
    const response = await fetch(`${STORAGE_URL}/allTasks/${taskIdKey}.json`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updateTask),
    });

  } catch (error) {
    
  }
}