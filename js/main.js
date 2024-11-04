"use strict";
// add class active to header scroll

let header = document.querySelector("header");

window.onscroll = function () {
  if (this.scrollY >= 50) {
    header.classList.add("active");
  } else {
    header.classList.remove("active");
  }
};
let linkes = document.getElementById("links");
function openCloseMenu() {
  linkes.classList.toggle("active");
}

let game = document.querySelector(".projects .container");

let join = document.getElementById("join");

let goToGame = document.querySelector(".btn");

goToGame.addEventListener("click", function () {
  window.scrollTo({
    top: 900,
    behavior: "smooth",
  });
});

let count;

let CountGame = document.getElementById("CountGame");

let gameArr = [
  "الدرس الاول",
  "الدرس التانى",
  "الدرس التالت",
  "الدرس الرابع",
  "الدرس الخامس",
  "الدرس السادس",
  "الدرس السابع",
  "الدرس التامن",
  "الدرس التاسع",
  "الدرس العاشر",
  "الدرس الحادى عشر",
];

for (count = 1; count <= 1; count++) {
  game.innerHTML += `
            <div class="stars">
            <i class="fa-solid fa-star"></i>
            <i class="fa-solid fa-star"></i>
            <i class="fa-solid fa-star"></i>
          </div>
          <div class="game">
            <h3 id="game" class="${count}" onclick="joinGame()">${count}</h3>
          </div>`;
}

var x = document.querySelector(".btns");

let creatA = document.createElement("a");
creatA.className = "btn";
creatA.id = "btnjoingame";
creatA.textContent = "يلا نلعب";
x.appendChild(creatA);

var gameId = document.querySelectorAll("#game");
gameId.forEach((gameId) => {
  gameId.addEventListener("click", function () {
    CountGame.innerHTML = gameArr[Number(gameId.className - 1)];
    creatA.href = hrefValues[this.className - 1];
  });
});

var hrefValues = [
  "game1.html",
  "game2.html",
  "game3.html",
  "game4.html",
  "game5.html",
  "game6.html",
  "game7.html",
  "game8.html",
  "game9.html",
  "game10.html",
  "game11.html",
];

function joinGame() {
  join.classList.add("join");
  game.classList.add("hidden");
}

let btns = document.querySelector(".join .container .btns");

var parent = document.querySelector(".join .container");

