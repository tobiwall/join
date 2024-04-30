const users = [];

async function loadUsers() {
    let loadedUsers = await getItem('users');

    if (loadedUsers.data && loadedUsers.data.value != "null") {
        users.push(...JSON.parse(loadedUsers.data.value));
    }
}

document.addEventListener("DOMContentLoaded", async function () {
    await loadUsers();

    
});