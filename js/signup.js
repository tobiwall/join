const users = [];

async function loadUsers() {
    let loadedUsers = [];
    loadedUsers = await getItem('users');

    if (loadedUsers.data && loadedUsers.data.value != "null") {
        users.push(JSON.parse(loadedUsers.data.value));
    }
}

function userEmailExists(email) {
    for (const user of users)
        if (user.email === email)
            return true;

    return false;
}

function formDataSave(formData) {
    formData.forEach(function (value) {
        console.log(value);
        users.push(value);
    });
}

function addHiddenContainer() {
    document.getElementById('hidden-container').classList.remove('d-none');
    document.getElementById('confirm-input').classList.add('red-border');
}



document.addEventListener("DOMContentLoaded", async function () { 
    //EventListener Section
    await loadUsers();

    document.getElementById("arrow").addEventListener("click", function () {
        if (window.location.pathname !== '/signup.html') {
            window.location.href = 'signup.html';
        } else {
            window.location.href = 'index.html';
        }
    });

    document.getElementById("myForm").addEventListener("submit", async function (e) {
        e.preventDefault();
        const formData = new FormData(document.getElementById("myForm"));
        
        const email = formData.get("user_email");
        const password = formData.get("user_password");
        const confirm = formData.get("user_password_confirm");

        console.log(confirm, password);
        if (password !== confirm) {
            console.error('Registrierung fehlgeschlagen, Passw confirm');
            addHiddenContainer();
            return;
        }

        if (userEmailExists(email)) {
            console.error('Registrierung fehlgeschlagen, Doppelte email');
            addHiddenContainer();
            return;
        }

        let data = {};
        formData.forEach((value, id) => data[id] = value);
        console.log(JSON.stringify(data));
        //formDataSave(formData);
        //const dataAsText = JSON.stringify(users);
        //await setItem('users', dataAsText);

        console.log(formData);
        console.log(users);
    });




    document.getElementById("myForm").addEventListener("submit", function (event) {
        const form = document.getElementById("myForm");
        if (!form.checkValidity()) {
            event.preventDefault();
        }
    });
});