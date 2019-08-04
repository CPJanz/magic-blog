const localStorage = window.localStorage;
let cardImage;

function getCardInfo(name) {
  let cardInfo = readFromLocal(name); // Check to see if card info is in local storage
  if (cardInfo) {
    console.log("Getting card from local storage");
    drawCard(cardInfo); // If so use data from there.
  } else {
    // If not, hit the API and get the card info.
    console.log("Hitting API.");
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        let cardList = JSON.parse(this.responseText).cards;
        // console.log(cardList);
        let i = 0;
        while (cardInfo === false && i < cardList.length) {
          if (Object.keys(cardList[i]).includes("imageUrl")) {
            // Some listings don't have imageUrls. This looks for a listing that does and uses that if possible.
            console.log(i, "Image url found");
            cardInfo = cardList[i];
          } else {
            console.log(i, "Image url not found");
            i++;
          }
        }
        console.log(cardInfo);
        if (!cardInfo) {
          cardInfo = cardList[0];
        }
        sendToLocal(cardInfo);
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
  console.log("loaded");
  cardList = document.getElementsByClassName("card");
  for (let i = 0; i < cardList.length; i++) {
    console.log(cardList[i]);
    cardList[i].onclick = function() {
      console.log(this.attributes["data-name"].value);
      getCardInfo(this.attributes["data-name"].value);
    };
  }
  cardImage = document.getElementById("image-div");
};

// Send data for a card to local storage to save on API hits
function sendToLocal(card) {
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
