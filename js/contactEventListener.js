window.addEventListener("resize", function () {
  checkContactIsMobile();
});

document.addEventListener("click", function () {
    const contacts = document.querySelectorAll(".contact");
    let activeElement = null;
    contacts.forEach((contact) => {
      contact.addEventListener("click", function () {
        if (activeElement !== null) {
          activeElement.classList.remove("active");
        }
        contact.classList.add("active");
        activeElement = contact;
      });
    });
  });
  
