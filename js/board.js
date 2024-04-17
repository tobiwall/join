const STORAGE_TOKEN = "LBRCE7ZOJGJE5A61XE03E0RA3FUCZKJ11X9OKHSK";
let STORAGE_URL = "https://remote-storage.developerakademie.org/item";

let cardsToDo = [];
let cardsInProgress = [];
let cardsAwaitFeedback = [];
let cardsDone = [];

function init() {
  includeHTML();
}

function includeHTML() {
  var z, i, elmnt, file, xhttp;
  /* Loop through a collection of all HTML elements: */
  z = document.getElementsByTagName("*");
  for (i = 0; i < z.length; i++) {
    elmnt = z[i];
    /*search for elements with a certain atrribute:*/
    file = elmnt.getAttribute("w3-include-html");
    if (file) {
      /* Make an HTTP request using the attribute value as the file name: */
      xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function () {
        if (this.readyState == 4) {
          if (this.status == 200) {
            elmnt.innerHTML = this.responseText;
          }
          if (this.status == 404) {
            elmnt.innerHTML = "Page not found.";
          }
          /* Remove the attribute, and call this function once more: */
          elmnt.removeAttribute("w3-include-html");
          includeHTML();
        }
      };
      xhttp.open("GET", file, true);
      xhttp.send();
      /* Exit the function: */
      return;
    }
  }
}

/**
 * Diese funktion rendert alle Spalten nacheinander
 *
 */
function renderCards() {
  renderToDo();
  renderInProgress();
  renderAwaitFeedback();
  renderDone();
}

function renderToDo() {}

function renderInProgress() {}

function renderAwaitFeedback() {}

function renderDone() {}

function generateCardHTML() {
  return /*html*/ `
    <div class="card">
        <div>${category}</div>
        <h3>${title}</h3>
        <p>${description}</p>
    </div>
    `;
}

function setItem(key, value) {}

function getItem(key) {}