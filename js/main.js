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
    top: 400,
    behavior: "smooth",
  });
});

let count;

let CountGame = document.getElementById("CountGame");

var hrefValues = [
  "game1.html",
  "game2.html",
  "game3.html",
  "game4.html",
  "game5.html",
];

for (count = 1; count <= 5; count++) {
  game.innerHTML += `
            <div class="stars" date-game="${count}">
            <i class="fa-solid fa-star" id="star1-game${count}"></i>
            <i class="fa-solid fa-star" id="star2-game${count}"></i>
            <i class="fa-solid fa-star" id="star3-game${count}"></i>
          </div>
          <div class="game">
            <a href="${
              hrefValues[count - 1]
            }" id="goGame${count}" class="game-link">
              <h3 id="game" class="${count}" onclick="joinGame()">${count}</h3>
            </a>
          </div>`;
}

function updateStars() {
  for (count = 1; count <= hrefValues.length; count++) {
    let score = localStorage.getItem(`NumOfStars-game${count}`);
    if (score) {
      score = parseInt(score, 10);
      if (score >= 1) {
        document.getElementById(`star1-game${count}`).style.color = "yellow";
      }
      if (score >= 2) {
        document.getElementById(`star2-game${count}`).style.color = "yellow";
      }
      if (score >= 3) {
        document.getElementById(`star3-game${count}`).style.color = "yellow";
      }
    }
  }
}

function getTotalStarsForLesson(lessonNumber) {
  let totalStars = 0;
  for (let i = 1; i < lessonNumber; i++) {
    let key = `NumOfStars-game${i}`;
    let score = localStorage.getItem(key);
    if (score) {
      totalStars += parseInt(score, 10);
    }
  }
  return totalStars;
}
function updateLinks() {
  const links = document.querySelectorAll(".game-link");
  links.forEach((link, index) => {
    const lessonNum = index + 1;
    const requiredStars = 3 + (lessonNum - 2) * 2;
    console.log(requiredStars);
    const totalStars = getTotalStarsForLesson(lessonNum);

    link.addEventListener("click", (event) => {
      const isLessonCompleted = localStorage.getItem(
        `Completed-game${lessonNum}`
      );
      if (isLessonCompleted) {
        event.preventDefault();
        alert(`انت خلصت الدرس دة يجميل و حليتو كلو صح مينفعش تدخل تانى`);
      } else if (lessonNum > 3 && totalStars < requiredStars) {
        event.preventDefault();
        alert(
          `انت لسا محتاج ${requiredStars} نجوم من الدروس ال فاتت عشان توصل للدرس ${lessonNum}`
        );
      }
    });
  });
}
document.addEventListener("DOMContentLoaded", () => {
  updateStars();
  updateLinks();
});
