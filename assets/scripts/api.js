let API_HITS = 0;

const getCardInfo = (name, set) => {
  return new Promise((resolve, reject) => {
    logMessage("Attempting to find <" + name + "> in local storage.");
    let cardInfo = readFromLocalStorage(name);
    if (cardInfo) {
      resolve(cardInfo);
    } else {
      logMessage("Hitting Gatherer API.");
      var xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
          let cardList = JSON.parse(this.responseText).cards;
          if (cardList.length > 0) {
            logMessage(
              "Results recieved. " + cardList.length + " cards returned."
            );
            if (cardInfo === false) {
              if (set) {
                logMessage(
                  "<" + set + "> passed as desired set. Searching data..."
                );
                for (var i = 0; i < cardList.length; i++) {
                  if (set === cardList[i].set) {
                    logMessage("Desired set found.");
                    cardInfo = cardList[i];
                  }
                }
                if (!cardInfo) {
                  logMessage("Desired set not found.");
                }
              } else {
                logMessage(
                  "Set not specified. Finding first result with an image."
                );
                let i = 0;
                while (i < cardList.length) {
                  if (Object.keys(cardList[i]).includes("imageUrl")) {
                    logMessage("Image url found");
                    cardInfo = cardList[i];
                    i = cardList.length;
                  } else {
                    i++;
                  }
                }
                if (!cardInfo) {
                  logMessage("No image found for <" + name + ">.");
                }
              }
            }
            if (!cardInfo) {
              logMessage("Using data from the first result.");
              cardInfo = cardList[0];
            }
            sendToLocalStorage(cardInfo);
            resolve(cardInfo);
          } else {
            reject("No results found for <" + name + ">.");
          }
        }
      };
      API_HITS++;
      logMessage(API_HITS + " requests to the Gatherer API this session.");
      xhttp.open(
        "GET",
        "https://api.magicthegathering.io/v1/cards?name=" + name,
        true
      );
      xhttp.send();
    }
  });
};
