const firebaseConfig = {
  apiKey: "AIzaSyB_uwE-wY_ps0tpP3TWbThTQ097Qwif0fk",
  authDomain: "coptic-ee8df.firebaseapp.com",
  databaseURL: "https://coptic-ee8df-default-rtdb.firebaseio.com",
  projectId: "coptic-ee8df",
  storageBucket: "coptic-ee8df.appspot.com",
  messagingSenderId: "444856301954",
  appId: "1:444856301954:web:f712c7152c16887aabf79b",
};

firebase.initializeApp(firebaseConfig);

document.addEventListener("DOMContentLoaded", () => {
  // ------------------ signup ------------------
  const form = document.querySelector(".signup");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const name = document.getElementById("signupEmail").value.trim();
      const password = document.getElementById("signupPassword").value;

      if (name === "" || password === "") {
        alert("من فضلك املأ كل البيانات");
        return;
      }

      const fakeEmail = name + "@elzero.com";

      firebase
        .auth()
        .createUserWithEmailAndPassword(fakeEmail, password)
        .then((userCredential) => {
          const user = userCredential.user;

          // نحفظ الاسم الحقيقي في الـ Database
          firebase
            .database()
            .ref("users/" + user.uid)
            .set({
              name: name,
              password: password,
              stars: 0,
            });

          alert("تم تسجيل الحساب باسم " + name);
          localStorage.setItem("userId", user.uid);
          localStorage.setItem("userName", name);
          // window.location.href = "levels.html";
        })
        .catch((error) => {
          if (error.code === "auth/email-already-in-use") {
            alert("الاسم مستخدم قبل كده، جرّب تدخل من صفحة تسجيل الدخول");
          } else {
            alert("خطأ: " + error.message);
          }
        });
    });
  }

  // ----------------- Login ----------------
  const form1 = document.querySelector(".login");
  if (form1) {
    form1.addEventListener("submit", (e) => {
      e.preventDefault();

      const name = document.getElementById("loginEmail").value.trim();
      const password = document.getElementById("loginPass").value;

      if (!name || !password) {
        alert("اكتب الاسم والباسورد");
        return;
      }
      // نقرأ كل المستخدمين
      firebase
        .database()
        .ref("users")
        .once("value")
        .then((snapshot) => {
          let found = false;

          snapshot.forEach((childSnapshot) => {
            const userData = childSnapshot.val();
            if (userData.name === name && userData.password === password) {
              found = true;

              // خزّن بيانات الدخول
              localStorage.setItem("userId", childSnapshot.key);
              localStorage.setItem("userName", name);

              // ودّيه على الصفحة الرئيسية
              window.location.href = "index.html";
              if(name == "john") window.location.href = "dashborad.html"
            }
          });

          if (!found) {
            alert("الاسم أو الباسورد غلط ❌");
          }
        });
    });
  }

  let logout = document.getElementById("logout");
  let Log = document.getElementById("Log");
  let Sign = document.getElementById("Sign");
  logout.onclick = () => {
    if(localStorage.getItem("userId")){
      localStorage.removeItem("userId");
      window.location.href = "login.html"
    }
  }
  if(!localStorage.getItem("userId")){
    logout.style.display = "none";
  } else{
    Log.style.display = "none";
    Sign.style.display = "none";
  }
  // ----------------- Game -----------------------
  const userId = localStorage.getItem("userId");
  const game = document.getElementById("lessonsContainer");

  if (game) {
    firebase
      .database()
      .ref("lessons")
      .once("value")
      .then((snapshot) => {
        const lessons = [];
        snapshot.forEach((child) => {
          lessons.push({ id: child.key, data: child.val() });
        });

        // نجيب التقدم والنجوم بتاع المستخدم
        firebase
          .database()
          .ref(`users/${userId}/progress`)
          .once("value")
          .then((progressSnap) => {
            const progress = progressSnap.val() || {};
            const totalStars = Object.values(progress).reduce(
              (acc, p) => acc + (p.stars || 0),
              0
            );
            const completedLessons = Object.keys(progress).length;

            let count = 1;
            lessons.forEach((lessonObj, index) => {
              const lessonId = lessonObj.id;
              const href = `level.html?level=${lessonId}`;
              const currentCount = count;

              // حساب الشروط:
              const requiredCompletedLessons = index;
              const requiredStars = index >= 2 ? index - 1 : 0;

              let isUnlocked = true;

              if (completedLessons < requiredCompletedLessons) {
                isUnlocked = false;
              }

              if (index >= 2 && totalStars < requiredStars) {
                isUnlocked = false;
              }

              // رسم النجوم
              const starsDiv = document.createElement("div");
              starsDiv.className = "stars";
              starsDiv.setAttribute("date-game", currentCount);

              for (let i = 1; i <= 3; i++) {
                const star = document.createElement("i");
                star.className = "fa-solid fa-star";
                star.id = `star${i}-game${currentCount}`;
                starsDiv.appendChild(star);
              }

              // رسم الديف بتاع الدرس
              const gameDiv = document.createElement("div");
              gameDiv.className = "game";

              if (isUnlocked) {
                gameDiv.innerHTML = `
                <a href="${href}" id="goGame${currentCount}" class="game-link">
                  <h3 id="game" class="${currentCount}" onclick="joinGame()">${currentCount}</h3>
                </a>
              `;
              } else {
                gameDiv.innerHTML = `
                <div class="locked">
                  <h3 class="locked">${currentCount}</h3>
                </div>
              `;
                gameDiv.style.opacity = "0.5";
              }

              game.appendChild(starsDiv);
              game.appendChild(gameDiv);

              // نلوّن النجوم حسب عدد النجوم المكتسبة
              const starsData =
                progress[lessonId]?.stars && Number(progress[lessonId].stars);

              if (starsData) {
                for (let s = 1; s <= starsData; s++) {
                  const starEl = document.getElementById(
                    `star${s}-game${currentCount}`
                  );
                  if (starEl) {
                    starEl.style.color = "yellow";
                  }
                }
              }

              count++;
            });
          });
      });
  }

  // ---------- Level -------------------
  const levelId = new URLSearchParams(window.location.search).get("level");
  const questionsWrapper = document.getElementById("questionsWrapper");
  const title = document.getElementById("lessonTitle");

  if (!levelId) {
    title.textContent = "حدث خطأ: لا يوجد ليفل";
    return;
  }

  firebase
    .database()
    .ref("lessons/" + levelId)
    .once("value")
    .then((snapshot) => {
      const data = snapshot.val();

      if (!data) {
        title.textContent = "الدرس غير موجود ❌";
        return;
      }

      title.textContent = data.title || "الدرس";

      const questions = data.questions;

      if (!questions) {
        title.textContent = "لا يوجد أسئلة في هذا الدرس 🚫";
        return;
      }

      let index = 1;

      for (let key in questions) {
        const q = questions[key];

        const qustBox = document.createElement("div");
        qustBox.classList.add(`Qus${index}`);

        let questionHTML = `<h3>${q.question}</h3>`;

        // ✅ لو فيه اختيارات
        if (q.type === "mcq" && Array.isArray(q.options)) {
          questionHTML += `<p>الاختيارات: ${q.options.join(" - ")}</p>`;
        }

        questionHTML += `<input type="text" id="answer${index}" required/>`;

        qustBox.innerHTML = questionHTML;

        questionsWrapper.appendChild(qustBox);
        index++;
      }
    })
    .catch((error) => {
      title.textContent = "حدث خطأ أثناء تحميل البيانات ❗";
      console.error(error);
    });

  // ---------- Submit in Level -------------
  const submitBtn = document.getElementById("submitAnswer");
  const urlParams = new URLSearchParams(window.location.search);
  const level = urlParams.get("level");

  submitBtn.addEventListener("click", (e) => {
    if (!level || !userId) return;

    firebase
      .database()
      .ref(`lessons/${level}/questions`)
      .once("value")
      .then((snapshot) => {
        let correctCount = 0;
        let inputIndex = 1;

        snapshot.forEach((childSnapshot) => {
          const questionData = childSnapshot.val();
          const input = document.getElementById(`answer${inputIndex}`);
          inputIndex++;

          if (!input) return;

          const userAnswer = input.value.trim().toLowerCase();
          const correctAnswer = String(questionData.answer)
            .trim()
            .toLowerCase();

          if (userAnswer === correctAnswer) {
            correctCount++;
          }
        });

        firebase.database().ref(`users/${userId}/progress/${level}`).set({
          stars: correctCount,
        });

        alert(`أحسنت! جبت ${correctCount} من 3 ✨`);
        window.location.href = "game.html";
      });
  });
});


document.addEventListener("DOMContentLoaded", () => {
  if(window.location.href.split("/")[window.location.href.split("/").length - 1] == "index.html") 
    document.getElementById("namee").innerHTML = localStorage.getItem("userName");
  if(window.location.href.split("/")[window.location.href.split("/").length - 1] == "game.html")
    document.getElementById("nameee").innerHTML = localStorage.getItem("userName");
  const table = document.getElementById("tableDash");

  firebase.database().ref("users").once("value").then((snapshot) => {
    snapshot.forEach((userSnap) => {
      const userData = userSnap.val();
      const userName = userData.name || "بدون اسم";

      let totalStars = 0;

      // لو فيه progress احسب عدد النجوم
      if (userData.progress) {
        for (let lessonId in userData.progress) {
          const stars = userData.progress[lessonId].stars;
          if (typeof stars === "number") {
            totalStars += stars;
          }
        }
      }

      // أنشئ صف جديد في الجدول
      const tr = document.createElement("tr");

      const nameTd = document.createElement("td");
      nameTd.textContent = userName;

      const starsTd = document.createElement("td");
      starsTd.textContent = totalStars;

      tr.appendChild(nameTd);
      tr.appendChild(starsTd);
      table.appendChild(tr);
    });
  }).catch((error) => {
    console.error("فشل في تحميل البيانات:", error);
  });
});
