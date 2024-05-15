window.addEventListener("resize", function () {
  checkContactIsMobile();
});

document.addEventListener("click", function () {
    const clickContacts = document.querySelectorAll(".contact");
    let activeElement = null;
    clickContacts.forEach((contact) => {
      contact.addEventListener("click", function () {
        if (activeElement !== null) {
          activeElement.classList.remove("active");
        }
        contact.classList.add("active");
        activeElement = contact;
      });
    });
  });
  
