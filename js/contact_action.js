/**
 * This function shows the x to close the popup if contact width is mobile
 * 
 */
function showClosingX() {
    let xClosingContact = document.getElementById('xClosingContact');
    if (contactMobile) {
      xClosingContact.classList.remove('d-none')
    } else {
      xClosingContact.classList.add('d-none')
    }
  }
  
  /**
   * close contact container
   * 
   */
  function closeContactContainer() {
    let contactBox = document.getElementById('contactBox');
    let scrollableContainer = document.getElementById('scrollable-container');
    let xClosingContact = document.getElementById('xClosingContact');
    contactBox.style.display = 'none';
    scrollableContainer.style.display = 'flex';
    xClosingContact.classList.add('d-none');
  }
  
  /**
   * close contact box
   * 
   */
  function closeContactBox() {
    let contactBoxName = document.getElementById("contactBoxName");
    let contactInformation = document.getElementById("contactInformation");
    contactBoxName.innerHTML = "";
    contactInformation.innerHTML = "";
  }
  
  /**
   * generateContactBoxHTML generates the contact container which has all information
   * 
   * @param {*} contact ist the clicked contact
   * @param {*} id is the id of this contact
   * @returns the html template
   */
  function generateContactBoxHTML(contact, id) {
    return /*html*/ `
          <div 
            class="initialien-big-round-container white-border" 
            style="background-color: ${contact.color};">${contact.initials}
          </div>
          <div class="contact-box-name-container">
            <p class="contact-box-name">${contact.name}</p>
            <div class="contact-box-edit-delete">
              <div class="edit-delete" id="edit" onclick="editContact(${id}, '${contact.color}', '${contact.initials}')">
                <img class="img-black" src="./assets/img/edit.svg" alt="">
                <img class="img-blue" src="./assets/icons/edit_blue.png" alt="">
                <p>Edit</p>
              </div>
              <div class="edit-delete" onclick="deleteContact(${id})" id="delete">
                <img class="img-black" src="./assets/img/delete.svg" alt="">
                <img class="img-blue" src="./assets/icons/delete_blue.png" alt="">
                <p>Delete</p>
              </div>
            </div>
          </div>
      `;
  }
  
  /**
   * showes the contact info
   * 
   * @param {*} klickedContact is the contact you cklicked on
   * @returns the html template
   */
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
  
  /**
   * open the popup to create a new contact
   * 
   */
  function openAddContact() {
    let addContact = document.getElementById("addContact");
    let overlay = document.getElementById("overlay");
    addContact.style.right = "50%";
    overlay.style.display = "block";
    overlay.addEventListener("click", closeContactPopupByOverlay);
  }
  
  /**
   * closes the contact popup
   * 
   */
  function closeContactPopup() {
    clearInput();
    let addContact = document.getElementById("addContact");
    let editContact = document.getElementById("editContact");
    let overlay = document.getElementById("overlay");
    addContact.style.right = "-1200px";
    editContact.style.right = "-1200px";
    overlay.style.display = "none";
  }
  
  /**
   * closeContactPopupByOverlay removes the overlay from the background
   * 
   * @param {*} event 
   */
  function closeContactPopupByOverlay(event) {
    if (event.target.id === "overlay") {
      closeContactPopup();
    }
  }
  
  /**
   * createContact gets the inputs and calls saveAndDisplayContacts
   * 
   */
  async function createContact() {
    let nameInput = document.getElementById("nameInput");
    let emailInput = document.getElementById("emailInput");
    let phoneInput = document.getElementById("phoneInput");
    await saveAndDisplayContacts(nameInput, emailInput, phoneInput);
    addedContactAnimation();
  }
  
  /**
   * add the contact popup and calls the animation after 0,5 seconds
   * 
   */
  function addedContactAnimation() {
    let addedContactPopup = document.getElementById('addedContactPopup');
    addedContactPopup.style.display = 'flex';
    setTimeout(showContactPopupAndAnimate, 500);
  }
  
  /**
   * create the animate and shows the contact popup
   * 
   */
  function showContactPopupAndAnimate() {
    let addedContactPopup = document.getElementById('addedContactPopup');
  
    addedContactPopup.style.bottom = '50%';
    setTimeout(() => {
      addedContactPopup.style.bottom = '110%';
    }, 1000);
    setTimeout(() => {
      addedContactPopup.style.display = 'none';
      addedContactPopup.style.bottom = '-10%';
    }, 1500);
  }
  
  /**
   * saveAndDisplayContacts saves the new contact and order them
   * 
   * @param {*} nameInput is the text from the input
   * @param {*} emailInput is the text from the input
   * @param {*} phoneInput is the number from the input
   */
  async function saveAndDisplayContacts(nameInput, emailInput, phoneInput) {
    let newContact = createNewContact(nameInput, emailInput, phoneInput);
    contacts.push(newContact);
    let newContactId = newContact.id;
    randomBackgroundColor();
    newContact = findContactById(newContactId);
    await addContactToFirebase(newContact);
    clearInput();
    closeContactPopup();
    contacts = await loadAllContacts();
    contacts = contacts.filter(contact => contact !== null);
    renderContacts();
  }
  
  /**
   * this function search the highest id in contacts
   * 
   * @returns maxId
   */
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
  
  /**
   * create a new contact and check if phone input is empty
   * 
   * @param {*} nameInput is the text from the input
   * @param {*} emailInput is the text from the input
   * @param {*} phoneInput is the number from the input
   * @returns the new buildet contact
   */
  function createNewContact(nameInput, emailInput, phoneInput) {
    if (phoneInput == null) {
      phoneInput = "";
      newBuildContacts = buildContact(nameInput, emailInput, phoneInput);
    } else {
      newBuildContacts = buildContact(nameInput, emailInput, phoneInput.value);
    }
    return newBuildContacts;
  }
  
  /**
   * buildContact builds a new contact
   * 
   * @param {*} nameInput is the text from the input
   * @param {*} emailInput is the text from the input
   * @param {*} phoneInput is the number from the input
   * @returns the new contact
   */
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
  
  /**
   * clearInput cleares the input after closing a popup
   * 
   */
  function clearInput() {
    let nameInput = document.getElementById("nameInput");
    let emailInput = document.getElementById("emailInput");
    let phoneInput = document.getElementById("phoneInput");
    nameInput.value = "";
    emailInput.value = "";
    phoneInput.value = "";
  }
  
  /**
   * deteleContact search the right contact and delate it with splice and calls deleteData
   * 
   * @param {*} id is the index of the contact from contacts
   */
  async function deleteContact(id) {
    let openContact = findContactById(id);
    let contactId = findIndexById(openContact);
    let editContact = document.getElementById("editContact");
    contacts.splice(contactId, 1);
    await deleteData(`/contacts/${id}`);
    if (editContact.style.display !== "none") {
      closeContactPopup();
    }
    closeContactBox();
    await renderContacts();
  }
  
  /**
   * findIndexById search the index of the contact
   * 
   * @param {*} openContact is the opened contact which you click
   * @returns the index of the openContact
   */
  function findIndexById(openContact) {
    return contacts.findIndex((contact) => contact === openContact);
  }
  
  /**
   * editContact shows the popup and calls createInputValue
   * 
   * @param {*} id is the id from the contact
   * @param {*} color ist the backgroundcolor from the contact logo
   * @param {*} initials are the first letters from name and sirname
   */
  function editContact(id, color, initials) {
    let editContact = document.getElementById("editContact");
    let contactLogo = document.getElementById('contactLogo');
    let overlay = document.getElementById("overlay");
    editContact.style.right = "50%";
    overlay.style.display = "block";
    overlay.addEventListener("click", closeContactPopupByOverlay);
    createInputValue(id);
    contactLogo.style.backgroundColor = color;
    contactLogo.innerHTML = /*html*/`
      <div class="initialien-big-round-container">${initials}</div>
    `
  }
  
  /**
   * createInputValue creates the new inputValue when you edit a contact
   * 
   * @param {*} id is the id from the contact
   */
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
  
  /**
   * changeContact gets the inputvalue and call changeContactDetails to change them
   * 
   * @param {*} id is the id from the contact
   */
  function changeContact(id) {
    let nameInput = document.getElementById("editNameInput").value;
    let emailInput = document.getElementById("editEmailInput").value;
    let phoneInput = document.getElementById("editPhoneInput").value;
    changeContactDetails(nameInput, emailInput, phoneInput, id);
  }
  
  /**
   * changeContactDetails changes the details an put in the input value
   * 
   * @param {*} nameInput is the value of input name
   * @param {*} emailInput is the value of input email
   * @param {*} phoneInput is the value of input phone
   * @param {*} id is the id from the contact
   */
  async function changeContactDetails(nameInput, emailInput, phoneInput, id) {
    let contact = findContactById(id);
    contact.name = `${nameInput}`;
    contact.email = `${emailInput}`;
    contact.phone = `${phoneInput}`;
    await updateContacts(contact, id);
    renderContacts();
    closeContactPopup();
    openContact(id);
  }
  
  /**
   * checkContactIsMobile checks the with of the window and sets contactMobile = true or false
   * 
   */
  function checkContactIsMobile() {
    let screenWidthContacts = window.innerWidth;
    let contactBox = document.getElementById('contactBox');
    let scrollableContainer = document.getElementById('scrollable-container');
    let xClosingContact = document.getElementById('xClosingContact');
    if (screenWidthContacts < 1351) {
      contactMobile = true;
      contactBox.style.display = 'none';
      scrollableContainer.style.display = 'flex';
      xClosingContact.classList.add('d-none')
    } else {
      contactMobile = false;
      contactBox.style.display = 'flex';
      showClosingX();
    }
  }