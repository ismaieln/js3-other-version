/*
  This list gives the ids of all the great houses that we want to look up.
  It should be inserted into the html above all the other files to ensure it is available
*/
const houseIdList = [
  7, // Eyrie
  17, // Baratheon
  169, // Greyjoy
  229, // Lannister
  362, // Stark
  378, // Targaryen
  395, // Tully
  398, // Tyrell
];
const lord = document.getElementById("got-house-list");

//function to fetch the house
const getHouse = async () => {
  let houseInformation = [];
  for (let y = 0; y < houseIdList.length; y++) {
    try {
      let respons = await fetch(
        "https://anapioficeandfire.com/api/houses/" + houseIdList[y]
      );
      let house = await respons.json();
      let lord = await getLord(house.currentLord);
      houseInformation.push({
        id: houseIdList[y],
        houseName: house.name,
        lordName: lord,
      });
    } catch {
      console.error;
    }
  }
  printHouses(houseInformation);
};

//function to fetch the lord
const getLord = async (url) => {
  try {
    const response = await fetch(url);
    const currentLordName = await response.json();
    return currentLordName.name;
  } catch {
    return "The lord died";
  }
};

//function to print the screen
const printHouses = (dataS) => {
  for (let i = 0; i < dataS.length; i++) {
    lord.innerHTML += `
      <div class="got-house">
                <h1 class="got-house__title">${dataS[i].houseName}</h1>
                <span class="got-house__current-lord" id="${dataS[i].id}">${dataS[i].lordName}</span>
            </div>
      `;
  }
};

//to kill a random lord
const ptn = document.getElementById("kill-random-lord-button");
ptn.addEventListener("click", killRandomLord);

//to replace the killed lord with other lord
async function killRandomLord() {
  const killedLordId = houseIdList[randomNumber(8)];
  const replacement = await swornMembers(killedLordId);
  const toKill = (document.getElementById(
    killedLordId
  ).innerHTML = replacement);
}

//to get the replacement lord name
const swornMembers = async (houseId) => {
  try {
    const res = await fetch(
      "https://anapioficeandfire.com/api/houses/" + houseId
    );
    const otherLord = await res.json();
    const otherLordName = await getLord(
      otherLord.swornMembers[randomNumber(otherLord.swornMembers.length - 1)]
    );
    return otherLordName;
  } catch {
    console.log("hi");
  }
};

// to get a random number
function randomNumber(x) {
  return Math.floor(Math.random() * x);
}

//to open the window on load
window.addEventListener("load", getHouse);
