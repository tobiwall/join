let contacts = [
  {
    name: "Anna Schmidt",
    email: "anna.schmidt@example.com",
    phone: "+491234567891",
    id: 0,
  },
  {
    name: "Peter Müller",
    email: "peter.mueller@example.com",
    phone: "+491234567892",
    id: 1,
  },
  {
    name: "Julia Wagner",
    email: "julia.wagner@example.com",
    phone: "+491234567893",
    id: 2,
  },
  {
    name: "Markus Meier",
    email: "markus.meier@example.com",
    phone: "+491234567894",
    id: 3,
  },
  {
    name: "Lisa Fischer",
    email: "lisa.fischer@example.com",
    phone: "+491234567895",
    id: 4,
  },
  {
    name: "Michael Schulz",
    email: "michael.schulz@example.com",
    phone: "+491234567896",
    id: 5,
  },
  {
    name: "Sarah Richter",
    email: "sarah.richter@example.com",
    phone: "+491234567897",
    id: 6,
  },
  {
    name: "Stefan Becker",
    email: "stefan.becker@example.com",
    phone: "+491234567898",
    id: 7,
  },
  {
    name: "Maria Keller",
    email: "maria.keller@example.com",
    phone: "+491234567899",
    id: 8,
  },
  {
    name: "Thomas Weber",
    email: "thomas.weber@example.com",
    phone: "+491234567800",
    id: 9,
  },
  {
    name: "Laura Schäfer",
    email: "laura.schaefer@example.com",
    phone: "+491234567801",
    id: 10,
  },
  {
    name: "Andreas Neumann",
    email: "andreas.neumann@example.com",
    phone: "+491234567802",
    id: 11,
  },
  {
    name: "Sandra Schwarz",
    email: "sandra.schwarz@example.com",
    phone: "+491234567803",
    id: 12,
  },
  {
    name: "Patrick Hoffmann",
    email: "patrick.hoffmann@example.com",
    phone: "+491234567804",
    id: 13,
  },
  {
    name: "Nicole Lehmann",
    email: "nicole.lehmann@example.com",
    phone: "+491234567805",
    id: 14,
  },
  {
    name: "Christian Zimmermann",
    email: "christian.zimmermann@example.com",
    phone: "+491234567806",
    id: 15,
  },
  {
    name: "Jessica Braun",
    email: "jessica.braun@example.com",
    phone: "+491234567807",
    id: 16,
  },
  {
    name: "Daniel Wagner",
    email: "daniel.wagner@example.com",
    phone: "+491234567808",
    id: 17,
  },
  {
    name: "Melanie Schmitt",
    email: "melanie.schmitt@example.com",
    phone: "+491234567809",
    id: 18,
  },
];

let firstLetterArray = [];
let foundContacts = [];
let openEditContactId = [];
let contactMobile = false;

async function initContact() {
  contacts = await loadAllContacts();
  includeHTML();
  await loadCurrentUsers();
  renderContacts();
  showHeaderUser();
}

/**
 * renderContacts() reads all function to create the perfect contact list
 *
 */
async function renderContacts() {
  contacts = await loadAllContacts();
  orderContacts();
  displayContactsList();
}

function orderContacts() {
  sortContacts();
  extractInitials(contacts);
  randomBackgroundColor();
  orderFirstLetter();
}

function displayContactsList() {
  clearFoundContacts();
  findContactsByFirstLetter();
  renderContactListAlphabet();
}

/**
 * This function sort all contacts from the JSON Array contacts
 *
 * @returns This function compairs each contact if the name comes before or after or at the same place in the alphabet and returns sortet contacts
 */
function sortContacts() {
  contacts.sort((a, b) => {
    if (a && b !== null) {
      const nameA = a.name.toUpperCase();
      const nameB = b.name.toUpperCase();
      if (nameA < nameB) {
        return -1;
      }
      if (nameA > nameB) {
        return 1;
      }
    }
    return 0;
  });
  return contacts;
}

/**
 * This function get the first letter of each name and sirname
 *
 * @param {JSON Array} contactList
 */
function extractInitials(contactList) {
  for (let i = 0; i < contactList.length; i++) {
    let contact = contactList[i];
    if (contact !== null) {
      let names = contact.name.split(" ");
      let firstNameInitial = names[0].charAt(0).toUpperCase();
      let lastNameInitial = names[names.length - 1].charAt(0).toUpperCase();
      contact.initials = firstNameInitial + lastNameInitial;
    }
  }
}

/**
 * This function gives every contact a random color
 *
 */
function randomBackgroundColor() {
  for (let i = 0; i < contacts.length; i++) {
    let contact = contacts[i];
    if (contact !== null) {
      if (!contact.color) {
        let red = Math.floor(Math.random() * 128) + 128; // Wert zwischen 128 und 255 für eine hellere Farbe
        let green = Math.floor(Math.random() * 128) + 128; // Wert zwischen 128 und 255 für eine hellere Farbe
        let blue = Math.floor(Math.random() * 128) + 128; // Wert zwischen 128 und 255 für eine hellere Farbe
        let color =
          "#" + red.toString(16) + green.toString(16) + blue.toString(16);
        contact.color = color;
      }
    }
  }
}

function orderFirstLetter() {
  for (let i = 0; i < contacts.length; i++) {
    let contact = contacts[i];
    if (contact !== null) {
      let firstLetter = contact.name.charAt(0);
      if (!firstLetterArray.includes(firstLetter)) {
        firstLetterArray.push(firstLetter);
      }
    }
  }
}

function clearFoundContacts() {
  foundContacts.length = 0;
}

function findContactsByFirstLetter() {
  for (let i = 0; i < firstLetterArray.length; i++) {
    let firstLetter = firstLetterArray[i];
    let contactsWithFirstLetter = [];
    for (let j = 0; j < contacts.length; j++) {
      let contact = contacts[j];
      if (contact !== null) {
        if (contact.name.charAt(0).toUpperCase() === firstLetter) {
          contactsWithFirstLetter.push(contact);
        }
      }
    }
    if (contactsWithFirstLetter.length > 0) {
      foundContacts.push({
        letter: firstLetter,
        contacts: contactsWithFirstLetter,
      });
    }
  }
  return foundContacts;
}

function renderContactListAlphabet() {
  let scrollableContainer = document.getElementById("scrollable-container");
  scrollableContainer.innerHTML = "";
  scrollableContainer.innerHTML += createButtonAddContact();
  for (let i = 0; i < foundContacts.length; i++) {
    let foundcontact = foundContacts[i];
    if (foundcontact !== null) {
      scrollableContainer.innerHTML +=
        generateContactAlphabetListHTML(foundcontact);
      let alphabetListBox = document.getElementById(
        `alphabetList${foundcontact.letter}`
      );
      alphabetListBox.innerHTML = "";
      for (let j = 0; j < foundcontact.contacts.length; j++) {
        let eachFoundContact = foundcontact.contacts[j];
        alphabetListBox.innerHTML += generateContactListHTML(eachFoundContact);
      }
    }
  }
}

function createButtonAddContact() {
  return /*html*/ `
    <button onclick="openAddContact()" class="add-new-contact-btn">Add new contact <img src="./assets/img/person_add.svg" alt=""></button>
  `;
}

function generateContactAlphabetListHTML(foundcontact) {
  return /*html*/ `
        <div>
            <h3 class="alphabet-letter">${foundcontact.letter}</h3>
            <div class="line-lightgray"></div>
            <div id="alphabetList${foundcontact.letter}"></div>
        </div>
    `;
}

/**
 * This function create for each contact a container
 *
 * @param {Array} contact
 * @returns div container
 */
function generateContactListHTML(contact) {
  return /*html*/ `
        <div class="contact" onclick="checkContactIsMobile(); openContact(${contact.id}); showClosingX();">
            <div 
            class="initialien-round-container" 
            style="background-color: ${contact.color};">${contact.initials}
            </div>
            <div class="contact-info">
                <div class="contact-name">${contact.name}</div>
                <div class="contact-email">${contact.email}</div>
            </div>
        </div>
    `;
}

function findContactById(id) {
  for (let i = 0; i < contacts.length; i++) {
    let contact = contacts[i];
    if (contact !== null) {
      if (contacts[i].id === id) {
        return contacts[i];
      }
    }
  }
  return null;
}

async function openContact(id) {
  let contactContainer = document.getElementById('contact-container');
  let klickedContact = findContactById(id);
  let contactBoxName = document.getElementById("contactBoxName");
  let contactInformation = document.getElementById("contactInformation");
  if (contactMobile) {
    await showContactBox(id, contactContainer, klickedContact, contactBoxName, contactInformation);
    let contactBox = document.getElementById('contactBox');
    let scrollableContainer = document.getElementById('scrollable-container');
    scrollableContainer.style.display = 'none';
    contactBox.style.display = 'flex';
  } else {
  showContactBox(id, contactContainer, klickedContact, contactBoxName, contactInformation);
  }
}

async function showContactBox(id, contactContainer, klickedContact, contactBoxName, contactInformation) {
  document.body.style.overflowX = "hidden";

  contactContainer.style.animation = "";

  setTimeout(function() {
    contactContainer.style.animation = "slideFromRightToLeft 0.5s forwards";
  }, 50);

  contactContainer.addEventListener("animationend", function() {
    document.body.style.overflowX = "auto";
  }, { once: true });
  contactBoxName.innerHTML = "";
  contactBoxName.innerHTML += generateContactBoxHTML(klickedContact, id);
  contactInformation.innerHTML = "";
  contactInformation.innerHTML += displayContactInfo(klickedContact);
}

function showClosingX() {
  let xClosingContact = document.getElementById('xClosingContact');
  if (contactMobile) {
    xClosingContact.classList.remove('d-none')
  } else {
    xClosingContact.classList.add('d-none')
  }
}

function closeContactContainer() {
  let contactBox = document.getElementById('contactBox');
  let scrollableContainer = document.getElementById('scrollable-container');
  let xClosingContact = document.getElementById('xClosingContact');
  contactBox.style.display = 'none';
  scrollableContainer.style.display = 'flex';
  xClosingContact.classList.add('d-none');
}

function closeContactBox() {
  let contactBoxName = document.getElementById("contactBoxName");
  let contactInformation = document.getElementById("contactInformation");
  contactBoxName.innerHTML = "";
  contactInformation.innerHTML = "";
}

function generateContactBoxHTML(contact, id) {
  return /*html*/ `
        <div 
          class="initialien-big-round-container white-border" 
          style="background-color: ${contact.color};">${contact.initials}
        </div>
        <div class="contact-box-name-container">
          <p class="contact-box-name">${contact.name}</p>
          <div class="contact-box-edit-delete">
            <div class="edit-delete" id="edit" onclick="editContact(${id})">
              <img class="img-black" src="../assets/img/edit.svg" alt="">
              <img class="img-blue" src="../assets/icons/edit_blue.png" alt="">
              <p>Edit</p>
            </div>
            <div class="edit-delete" onclick="deleteContact(${id})" id="delete">
              <img class="img-black" src="../assets/img/delete.svg" alt="">
              <img class="img-blue" src="../assets/icons/delete_blue.png" alt="">
              <p>Delete</p>
            </div>
          </div>
        </div>
    `;
}

function displayContactInfo(klickedContact) {
  return /*html*/ `
    <div class="contact-information">
      <p class="contact-info-headline">Contact Information</p>
      <p class="bold">Email</p>
      <p class="email">${klickedContact.email}</p>
      <p class="bold">Phone</p>
      <p class="phonenumber">${klickedContact.phone}</p>
    </div>
  `;
}

function openAddContact() {
  let addContact = document.getElementById("addContact");
  let overlay = document.getElementById("overlay");
  addContact.style.right = "50%";
  overlay.style.display = "block";
  overlay.addEventListener("click", closeContactPopupByOverlay);
}

function closeContactPopup() {
  clearInput();
  let addContact = document.getElementById("addContact");
  let editContact = document.getElementById("editContact");
  let overlay = document.getElementById("overlay");
  addContact.style.right = "-1200px";
  editContact.style.right = "-1200px";
  overlay.style.display = "none";
}

function closeContactPopupByOverlay(event) {
  if (event.target.id === "overlay") {
    closeContactPopup();
  }
}

function saveContactsLocal() {
  localStorage.setItem("contacts", JSON.stringify(contacts));
}

async function createContact() {
  let nameInput = document.getElementById("nameInput");
  let emailInput = document.getElementById("emailInput");
  let phoneInput = document.getElementById("phoneInput");
  await saveAndDisplayContacts(nameInput, emailInput, phoneInput);
}

async function saveAndDisplayContacts(nameInput, emailInput, phoneInput) {
  let newContact = createNewContact(nameInput, emailInput, phoneInput);
  contacts.push(newContact);
  orderContacts();
  displayContactsList();
  let newContactId = newContact.id;
  newContact = findContactById(newContactId);
  await addContactToFirebase(newContact);
  clearInput();
  closeContactPopup();
  renderContacts();
}

function findHighestId() {
  let maxId = contacts[0].id;
  for (let i = 1; i < contacts.length; i++) {
    let contact = contacts[i];
    if (contact !== null) {
      if (contacts[i].id > maxId) {
        maxId = contacts[i].id;
      }
    }
  }
  return maxId;
}

function createNewContact(nameInput, emailInput, phoneInput) {
  if (phoneInput == null) {
    phoneInput = "";
    newBuildContacts = buildContact(nameInput, emailInput, phoneInput);
  } else {
    newBuildContacts = buildContact(nameInput, emailInput, phoneInput.value);
  }
  return newBuildContacts;
}

function buildContact(nameInput, emailInput, phoneInput) {
  lastContactId = findHighestId();
  lastContactId++;
  let newContact = {
    name: nameInput.value,
    email: emailInput.value,
    phone: phoneInput,
    id: lastContactId,
  };
  return newContact;
}

function clearInput() {
  let nameInput = document.getElementById("nameInput");
  let emailInput = document.getElementById("emailInput");
  let phoneInput = document.getElementById("phoneInput");
  nameInput.value = "";
  emailInput.value = "";
  phoneInput.value = "";
}

function deleteContact(id) {
  let openContact = findContactById(id);
  let contactId = findIndexById(openContact);
  let editContact = document.getElementById("editContact");
  contacts.splice(contactId, 1);
  deleteData(`/contacts/${id}`);
  renderContacts();
  if (editContact.style.display !== "none") {
    closeContactPopup();
  }
  closeContactBox();
  renderContacts();
}

function findIndexById(openContact) {
  return contacts.findIndex((contact) => contact === openContact);
}

function editContact(id) {
  let editContact = document.getElementById("editContact");
  let overlay = document.getElementById("overlay");
  editContact.style.right = "50%";
  overlay.style.display = "block";
  overlay.addEventListener("click", closeContactPopupByOverlay);
  createInputValue(id);
}

function createInputValue(id) {
  let contact = findContactById(id);
  let editNameInput = document.getElementById("editNameInput");
  let editEmailInput = document.getElementById("editEmailInput");
  let editPhoneInput = document.getElementById("editPhoneInput");
  editNameInput.value = `${contact.name}`;
  editEmailInput.value = `${contact.email}`;
  editPhoneInput.value = `${contact.phone}`;
  openEditContactId = contact.id;
}

function changeContact(id) {
  let nameInput = document.getElementById("editNameInput").value;
  let emailInput = document.getElementById("editEmailInput").value;
  let phoneInput = document.getElementById("editPhoneInput").value;
  changeContactDetails(nameInput, emailInput, phoneInput, id);
}

async function changeContactDetails(nameInput, emailInput, phoneInput, id) {
  let contact = findContactById(id);
  contact.name = `${nameInput}`;
  contact.email = `${emailInput}`;
  contact.phone = `${phoneInput}`;
  await updateContacts(contact, id);
  renderContacts();
  closeContactPopup();
}

window.addEventListener("resize", function() {
  checkContactIsMobile();
})

function checkContactIsMobile() {
  let screenWidthContacts = window.innerWidth;
  let contactBox = document.getElementById('contactBox');
  let scrollableContainer = document.getElementById('scrollable-container');
  if (screenWidthContacts < 1151) {
    contactMobile = true;
    contactBox.style.display = 'none';
    scrollableContainer.style.display = 'flex';
  } else {
    contactMobile = false;
    contactBox.style.display = 'flex';
    showClosingX();
  }
}