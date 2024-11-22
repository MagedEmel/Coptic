"use strict";

let answer1 = document.getElementById("answer1");
let answer2 = document.getElementById("answer2");
let answer3 = document.getElementById("answer3");
let submitAnswer = document.getElementById("submitAnswer");

submitAnswer.onclick = function () {
  const answer1Value = answer1.value;
  const answer2Value = answer2.value;
  const answer3Value = answer3.value;

  const value1 =
    answer1Value === "11" ||
    answer1Value === "حداشر" ||
    answer1Value === "احدى عشر" ||
    answer1Value === "١١";

  const value2 =
    answer2Value === "34" ||
    answer2Value === "اربعة و ثلاثين" ||
    answer2Value === "اربعة و ثلاثون" ||
    answer2Value === "٣٤";

  const value3 =
    answer3Value === "49" ||
    answer3Value === "تسعة و اربعين" ||
    answer3Value === "تسعة و اربعون" ||
    answer3Value == "٤٩";

  const qustAnswers = document.getElementById("qustAnswers");
  const countAnswer = document.getElementById("countAnswer");
  const displaysAnswer = document.getElementById("displaysAnswer");

  let correctAnswers = 0;
  if (value1) correctAnswers++;
  if (value2) correctAnswers++;
  if (value3) correctAnswers++;

  qustAnswers.style.display = "none";
  displaysAnswer.style.display = "block";
  countAnswer.innerHTML = `انت جاوبت على ${
    correctAnswers === 1 ? "سؤال واحد" : `${correctAnswers} اسئلة`
  } صح`;
  localStorage.setItem("NumOfStars-game2", correctAnswers);
};
