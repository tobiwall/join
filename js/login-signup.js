let users = [
    {
        'name': 'Bob',
        'email': 'bob@test.de',
        'password': 'test123'
    }
]

function addUser() {
    let name = document.getElementById('user_name');
    let email = document.getElementById('user_password');
    let password = document.getElementById('user_email');
    users.push({name: name.value.trim(), email: email.value.trim(), password: password.value.trim()});
    window.location.href = 'index.html?msg=Du hast dich erfolgreich rigistiert';
}

function login() {
    let email = document.getElementById('user_password');
    let password = document.getElementById('user_email');
    let user = users.find(u => u.email == email.value && u.password == password.value)

    if(user) {
        console.log('User gefunden');
        window.location.href = 'summary.html?msg=Du bist eingelogt.';
    }
}

function changePage() {
    window.location.href = 'signup.html?msg=Log dich ein';
}