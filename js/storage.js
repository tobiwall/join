const STORAGE_TOKEN = 'LBRCE7ZOJGJE5A61XE03E0RA3FUCZKJ11X9OKHSK';
const STORAGE_URL = "https://remote-storage.developerakademie.org/item";

let currentUser = null;

async function setItem(key, value) {
    const payload = { key, value, token: STORAGE_TOKEN };
    return fetch(STORAGE_URL, { method: 'POST', body: JSON.stringify(payload)})
    .then(res => res.json());
  }
  
  async function getItem(key) {
    const url = `${STORAGE_URL}?key=${key}&token=${STORAGE_TOKEN}`;
    return fetch(url).then(res => res.json());
  }