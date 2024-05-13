document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("back").addEventListener("click", function () {
        if (document.referrer) {
            window.location.href = document.referrer;
        } else {
            window.location.href = './summary.html';
        }
    });
});