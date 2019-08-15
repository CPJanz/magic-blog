const localStorage = window.localStorage;
let cardImage;

function getCardInfo(name, set) {
  let cardInfo = readFromLocal(name); // Check to see if card info is in local storage
  if (cardInfo) {
    console.log("Getting card from local storage");
    drawCard(cardInfo); // If so use data from there.
  } else {
    // If not, hit the API and get the card info.
    console.log("Card not in local storage, Hitting API.");
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        let cardList = JSON.parse(this.responseText).cards;
        console.log(cardList);
        if (cardInfo === false) {
          if (set) {
            console.log("Set passed, finding specified set");
            for (var i = 0; i < cardList.length; i++) {
              if (set === cardList[i].set) {
                cardInfo = cardList[i];
              }
            }
            if (!cardInfo) {
            }
          } else {
            let i = 0;
            while (i < cardList.length) {
              if (Object.keys(cardList[i]).includes("imageUrl")) {
                // Some listings don't have imageUrls. This looks for a listing that does and uses that if possible.
                console.log(i, "Image url found");
                cardInfo = cardList[i];
                i = cardList.length;
              } else {
                console.log(i, "Image url not found");
                i++;
              }
            }
          }
        }
        console.log(cardInfo);
        if (!cardInfo) {
          cardInfo = cardList[0];
        }
        sendToLocalStorage(cardInfo);
        drawCard(cardInfo);
      }
    };
    xhttp.open(
      "GET",
      "https://api.magicthegathering.io/v1/cards?name=" + name,
      true
    );
    xhttp.send();
  }
}

window.onload = () => {
  cardList = document.getElementsByClassName("card");
  for (let i = 0; i < cardList.length; i++) {
    cardList[i].onclick = function() {
      let name = this.attributes["data-name"].value;
      let set;
      if ("data-set" in this.attributes) {
        set = this.attributes["data-set"].value;
      }
      console.log("Name:", name, "Set:", set);
      getCardInfo(name, set);
    };
  }
  cardImage = document.getElementById("image-div");
  cardImage.onclick = function() {
    let emptyDiv = document.createElement("div");
    this.replaceChild(emptyDiv, cardImage.firstChild);
  };
};

// Send data for a card to local storage to save on API hits
function sendToLocalStorage(card) {
  localStorage.setItem(card.name.toLowerCase(), JSON.stringify(card));
}

// Check local storage for a card. Returns the cardInfo or false if it is not found.
function readFromLocal(cardName) {
  return JSON.parse(localStorage.getItem(cardName.toLowerCase())) || false;
}

// Draw the card onto the screen.
function drawCard(cardInfo) {
  let image = document.createElement("img");
  image.src = cardInfo.imageUrl || "assets/images/172px-Magic_card_back.jpg";
  cardImage.replaceChild(image, cardImage.firstChild);
}
