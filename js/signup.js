document.addEventListener("DOMContentLoaded", async function () {
    //Array Section
    let users = [];

    //Function Section
    async function loadUsers() {
        let loadedUsers = [];
        loadedUsers = await getItem('users');

        if (loadedUsers.data && loadedUsers.data.value != "null") {
            users.push(JSON.parse(loadedUsers.data.value));
        }
    }

    async function checkConfirm(formData, email, password, confirm) {
        if (password == confirm) {
            await checkEmail(formData, email);
        } else {
            console.error('Registrierung fehlgeschlagen');
            addHiddenContainer();
        }
    }

    async function checkEmail(formData, email) {
        let check = false;
        for (let i = 0; i < users.length; i++) {
            let userCheck = users[i].email;
            if (email == userCheck) {
                check = true;
                break;
            }
        }
        if (check == false) {
            formDataSave(formData)
            const dataAsText = JSON.stringify(users);
            await setItem('users', dataAsText);
        }
    }

    function formDataSave(formData) {
        formData.forEach(function (value) {
            users.push(value);
        });
    }

    function addHiddenContainer() {
        document.getElementById('hidden-container').classList.remove('d-none');
        document.getElementById('confirm-input').classList.add('red-border');
    }


    //EventListener Section
    await loadUsers();

    document.getElementById("arrow").addEventListener("click", function () {
        if (window.location.pathname !== '/signup.html') {
            window.location.href = 'signup.html';
        } else {
            window.location.href = 'index.html';
        }
    });

    document.getElementById("signup-btn").addEventListener("click", async function () {
        const formData = new FormData(document.getElementById("myForm"));
        
        const email = formData.get("user_email");
        const password = formData.get("user_password");
        const confirm = formData.get("user_password_confirm");

        await checkConfirm(formData, email, password, confirm);

        

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