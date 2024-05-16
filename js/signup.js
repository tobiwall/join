const users = [];

async function initSignUp() {
    contacts = await loadAllContacts();
}

function userEmailExists(email) {
    return users.some(user => user.user_email === email);
}

function passwordConfirmError() {
    document.getElementById('password-error').classList.remove('d-none');
    document.getElementById('confirm-input').classList.add('red-border');
}

function emailExistError() {
    document.getElementById('email-error').classList.remove('d-none');
    document.getElementById('email-input').classList.add('red-border');
}

function generateRandomId() {
    const min = 100;
    const max = 999;
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

document.addEventListener("DOMContentLoaded", async function () {
    await loadUsers();

    document.getElementById("myForm").addEventListener("submit", async function (e) {
        e.preventDefault();
        const formData = new FormData(document.getElementById("myForm"));
        const email = formData.get("user_email");
        const password = formData.get("user_password");
        const confirm = formData.get("user_password_confirm");

        if (password !== confirm) {
            passwordConfirmError();
            return;
        }

        if (userEmailExists(email)) {
            emailExistError();
            return;
        }
        await createContactUser();
        const userData = {};
        formData.forEach((value, id) => userData[id] = value);
        userData.id = generateRandomId();        
        
        await postData("users", userData);
        document.getElementById('popup-container').classList.add('show');
        document.getElementById('popup').classList.add('show');
        
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 4000);
    });

    document.getElementById("user_password_confirm").addEventListener('keyup', function () {
        if (document.getElementById('confirm-input').classList.contains('red-border')) {
            document.getElementById('confirm-input').classList.remove('red-border');
            document.getElementById('password-error').classList.add('d-none');
        }
    });

    document.getElementById("user_email").addEventListener('keyup', function () {
        if (document.getElementById('email-input').classList.contains('red-border')) {
            document.getElementById('email-input').classList.remove('red-border');
            document.getElementById('email-error').classList.add('d-none');
        }
    });

    document.getElementById("myForm").addEventListener("submit", function (event) {
        const form = document.getElementById("myForm");
        if (!form.checkValidity()) {
            event.preventDefault();
        }
    });
});

async function createContactUser() {
    const name = document.getElementById('user_name');
    const email = document.getElementById('user_email');
    let newContact = createNewContact(name, email);
        contacts.push(newContact);
        orderContacts();
        let newContactId = newContact.id;
        newContact = findContactById(newContactId);
        await addContactToFirebase(newContact);
}