const localStorage = window.localStorage;

// Send data for a card to local storage to save on API hits
function sendToLocalStorage(card) {
  logMessage("Sending <" + card.name + "> to local storage.");
  localStorage.setItem(card.name.toLowerCase(), JSON.stringify(card));
}

// Check local storage for a card. Returns the cardInfo or false if it is not found.
function readFromLocalStorage(cardName) {
  const result =
    JSON.parse(localStorage.getItem(cardName.toLowerCase())) || false;
  logMessage(
    result
      ? "Card found in local storage."
      : "Card not present in local storage."
  );
  return result;
}
