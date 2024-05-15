const STORAGE_URL =
  "https://join-gruppenarbeit-default-rtdb.europe-west1.firebasedatabase.app/";

let currentUser = null;

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
    debugger;
    console.error("Fehler beim Hinzufügen des Kontakts zu Firebase:", error);
  }
}

async function getData(path = "") {
  let response = await fetch(STORAGE_URL + path + ".json");
  return (responseToJson = await response.json());
}

async function deleteData(path = "") {
  let response = await fetch(STORAGE_URL + path + ".json", {
    method: "DELETE",
  });
  return (responseToJson = await response.json());
}

async function loadUsers() {
  let loadedUsers = await getData("/users");
  for (const key in loadedUsers) {
    if (Object.hasOwnProperty.call(loadedUsers, key)) {
      users.push(loadedUsers[key]);
    }
  }
}

async function loadCurrentUsers() {
  let loadedCurrentUser = await getData("/currentUser");
  for (const key in loadedCurrentUser) {
    if (Object.hasOwnProperty.call(loadedCurrentUser, key)) {
      currentUser = loadedCurrentUser[key];
    }
  }
}

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

async function loadAllContacts() {
  let loadedContacts = await getData("/contacts");
  /*for (const key in loadedContacts) {
          if (Object.hasOwnProperty.call(loadedContacts, key)) {
        contacts.push(loadedContacts[key]);
      }
  }*/
  return loadedContacts;
}

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