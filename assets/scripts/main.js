let cardImageElement;
let shownCard;
const DEBUG_MESSAGES = true; //TODO: Do this correctly

window.onload = () => {
  cardImageElement = document.getElementById("image-div");
  cardImageElement.onclick = clearCard;

  const cardList = [...document.getElementsByClassName("card")];

  cardList.forEach(element => {
    const name = element.attributes["data-name"].value;
    const set =
      "data-set" in element.attributes
        ? element.attributes["data-set"].value
        : undefined;
    element.onmouseover = function() {
      if (shownCard !== name) {
        shownCard = name;
        getCardInfo(name, set)
          .then(cardInfo => drawCard(cardInfo))
          .catch(err => logMessage(err));
      }
    };
  });
};

// Draw the card onto the screen.
const drawCard = cardInfo => {
  const image = document.createElement("img");
  image.src = cardInfo.imageUrl || "assets/images/172px-Magic_card_back.jpg"; //Fallback image in case there is no image available.
  cardImageElement.replaceChild(image, cardImageElement.firstChild);
};

const clearCard = () => {
  const emptyDiv = document.createElement("div");
  cardImageElement.replaceChild(emptyDiv, cardImageElement.firstChild);
};

const logMessage = message => {
  if (DEBUG_MESSAGES) {
    console.log(message);
  }
};
