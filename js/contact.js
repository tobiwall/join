let firstLetterArray = [];
let foundContacts = [];
let openEditContactId = [];
let contactMobile = false;

async function initContact() {
  contacts = await loadAllContacts();
  await includeHTML();
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
  contacts = contacts.filter(contact => contact !== null);
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
    if (a !== null && b !== null) {
      const nameA = a.name.toUpperCase();
      const nameB = b.name.toUpperCase();
      if (nameA < nameB) {
        return -1;
      }
      if (nameA > nameB) {
        return 1;
      }
    } else if (a === null && b !== null) {
      return 1;
    } else if (a !== null && b === null) {
      return -1;
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

/**
 * This function sort the array contacts by the alphabet
 * 
 */
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

/**
 * This function sorts all contact by the first letter
 * 
 * @returns the array foundContacts
 */
function findContactsByFirstLetter() {
  for (let i = 0; i < firstLetterArray.length; i++) {
    let firstLetter = firstLetterArray[i];
    let contactsWithFirstLetter = [];
    for (let j = 0; j < contacts.length; j++) {
      let contact = contacts[j];
      if (contact !== null) {
        if (contact.name.charAt(0).toUpperCase() === firstLetter) {contactsWithFirstLetter.push(contact);}
      }
    }
    if (contactsWithFirstLetter.length > 0) {
      foundContacts.push({letter: firstLetter, contacts: contactsWithFirstLetter});
    }
  }
  return foundContacts;
}

/**
 * renderContactListAlphabet shows the letters and calls the function to put them in
 * 
 */
function renderContactListAlphabet() {
  let scrollableContainer = document.getElementById("scrollable-container");
  scrollableContainer.innerHTML = "";
  scrollableContainer.innerHTML += createButtonAddContact();
  for (let i = 0; i < foundContacts.length; i++) {
    let foundcontact = foundContacts[i];
    if (foundcontact !== null) {
      loadFoundContacts(scrollableContainer, foundcontact);
    }
  }
}

/**
 * loadFoundContacts displays the contact in the container
 * 
 * @param {*} scrollableContainer is the div where the conacts are shown
 * @param {*} foundcontact is the array of all sorted conacts
 */
function loadFoundContacts(scrollableContainer, foundcontact) {
  scrollableContainer.innerHTML += generateContactAlphabetListHTML(foundcontact);
    let alphabetListBox = document.getElementById(`alphabetList${foundcontact.letter}`);
      alphabetListBox.innerHTML = "";
      for (let j = 0; j < foundcontact.contacts.length; j++) {
        let eachFoundContact = foundcontact.contacts[j];
        alphabetListBox.innerHTML += generateContactListHTML(eachFoundContact);
      }
}

/**
 * create the addContact button
 * 
 * @returns the html template
 */
function createButtonAddContact() {
  return /*html*/ `
    <button onclick="openAddContact()" class="add-new-contact-btn">Add new contact <img src="./assets/img/person_add.svg" alt=""></button>
  `;
}

/**
 * generate the letters for the list
 * 
 * @param {*} foundcontact is the contact where to get the letter
 * @returns the html template
 */
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

/**
 * findContactById search the contact width the given id
 * 
 * @param {*} id is the id of one contact we search
 * @returns the found contact
 */
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

/**
 * This function open the contact and calls the function to show it in the right place
 * 
 * @param {*} id is the id of the clicked contact
 */
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

/**
 * shows the contact box and call the functions to generate the html
 * 
 * @param {*} id of the contact from contacts
 * @param {*} contactContainer is the container where the information is shown
 * @param {*} klickedContact is the selected contact
 * @param {*} contactBoxName is the div, where the headline is shown
 * @param {*} contactInformation are the details of the contact
 */
async function showContactBox(id, contactContainer, klickedContact, contactBoxName, contactInformation) {
  document.body.style.overflowX = "hidden";
  contactContainer.style.animation = "";
  setTimeout(function() {contactContainer.style.animation = "slideFromRightToLeft 0.5s forwards";}, 50);

  contactContainer.addEventListener("animationend", function() {
    document.body.style.overflowX = "auto";
  }, { once: true });
  contactBoxName.innerHTML = "";
  contactBoxName.innerHTML += generateContactBoxHTML(klickedContact, id);
  contactInformation.innerHTML = "";
  contactInformation.innerHTML += displayContactInfo(klickedContact);
}