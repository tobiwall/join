const users = [];


//Login Section

async function initLogin() {
    await loadUsers();

}



function login() {
    let email = document.getElementById('user_password').value;
    let password = document.getElementById('user_email').value;
    let user = users.find(u => u.email == email && u.password == password);


}







