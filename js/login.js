const users = [];

function loginError() {
    document.getElementById('login-error').classList.remove('d-none');
    document.getElementById('password-input').classList.add('red-border');
    document.getElementById('email-input').classList.add('red-border');
}

function removeClasses() {
    document.getElementById('email-input').classList.remove('red-border');
    document.getElementById('password-input').classList.remove('red-border');

    if (!document.getElementById('login-error').classList.contains('d-none') &&
        !document.getElementById('email-input').classList.contains('red-border') &&
        !document.getElementById('password-input').classList.contains('red-border')) {
        
        document.getElementById('login-error').classList.add('d-none');
    }
}

document.addEventListener("DOMContentLoaded", async function () {
    await loadUsers();
    await loadCurrentUsers();

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
                break;
            }
        }

        if (found) {
            await deleteData("/currentUser");
            await postData("/currentUser", currentUser);
            window.location.href = 'summary.html';
        } else {
            loginError();
        }
    });

    document.getElementById("guest-login").addEventListener("click", async function () {
        currentUser = { user_name: "Guest User" };
        await deleteData("/currentUser");
        await postData("/currentUser", currentUser);
        window.location.href = 'summary.html';
    })

    document.getElementById("myForm").addEventListener("submit", function (event) {
        const form = document.getElementById("myForm");
        if (!form.checkValidity()) {
            event.preventDefault();
        }
    });

    document.getElementById('user_email').addEventListener('keyup', removeClasses);

    document.getElementById('user_password').addEventListener('keyup', removeClasses);
});