const users = [];

async function loadUsers() {
    let loadedUsers = await getItem('users');
    let loadedCurrentUser = await getItem('currentUser')

    if (loadedUsers.data && loadedUsers.data.value != "null") {
        users.push(...JSON.parse(loadedUsers.data.value));
    }

    if (loadedCurrentUser.data && loadedCurrentUser.data.value != "null") {
        currentUser = JSON.parse(loadedCurrentUser.data.value);
    }
}

document.addEventListener("DOMContentLoaded", async function () {
    await loadUsers();

    document.getElementById("myForm").addEventListener("submit", async function (e) {
        e.preventDefault();

        const formData = new FormData(document.getElementById("myForm"));
        const email = formData.get("user_email");
        const password = formData.get("user_password");

        let found = false;

        for (let i = 0; i < users.length; i++) {
            const user = users[i];
            if (user.user_email === email && user.user_password === password) {
                currentUser = user;
                found = true;
                console.log(currentUser);
                break;
            }
        }

        if (found) {
            const currentUserAsText = JSON.stringify(currentUser);
            await setItem('currentUser', currentUserAsText);
            window.location.href = 'summary.html';
        } else {
            alert("Falsche E-Mail-Adresse oder Passwort. Bitte versuchen Sie es erneut.");
        }
    });

    document.getElementById("guest-login").addEventListener("click", function () {
        window.location.href = 'summary.html';
    })

    document.getElementById("myForm").addEventListener("submit", function (event) {
        const form = document.getElementById("myForm");
        if (!form.checkValidity()) {
            event.preventDefault();
        }
    });
});