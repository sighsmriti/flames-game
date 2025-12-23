console.log("JS LOADED");

const playBtn = document.getElementById("playBtn");
const playAgainBtn = document.getElementById("playAgainBtn");
const resultDiv = document.getElementById("result");
const name1Input = document.getElementById("name1");
const name2Input = document.getElementById("name2");

/* ---------- UI HELPERS ---------- */
function popResult(text, extraClass = "") {
  // reset classes
  resultDiv.className = "result";

  // force reflow to replay animation
  void resultDiv.offsetWidth;

  // apply visible state
  resultDiv.classList.add("show");
  if (extraClass) resultDiv.classList.add(extraClass);

  resultDiv.textContent = text;
}

function showWarning(message) {
  popResult(message);
  playAgainBtn.classList.add("hidden");
}

function showFinalResult(message, glowClass) {
  popResult(message, glowClass);
  playAgainBtn.classList.remove("hidden");
}

function resetGame() {
  // clear inputs
  name1Input.value = "";
  name2Input.value = "";

  // show READY again
  popResult("READY?");
  playAgainBtn.classList.add("hidden");
}

/* ---------- INITIAL STATE ---------- */
popResult("READY?");
playAgainBtn.classList.add("hidden");

/* ---------- PLAY AGAIN ---------- */
playAgainBtn.addEventListener("click", resetGame);

/* ---------- PLAY BUTTON ---------- */
playBtn.addEventListener("click", () => {
  let name1 = name1Input.value.trim();
  let name2 = name2Input.value.trim();

  /* ----- VALIDATION ----- */
  if (name1 === "" && name2 === "") {
    showWarning("⚠️ ENTER BOTH PLAYER NAMES!");
    return;
  }

  if (name1 === "" || name2 === "") {
    showWarning("⚠️ BOTH NAMES REQUIRED!");
    return;
  }

  if (!/^[a-zA-Z ]+$/.test(name1) || !/^[a-zA-Z ]+$/.test(name2)) {
    showWarning("❌ LETTERS ONLY! NO NUMBERS OR SYMBOLS");
    return;
  }

  /* ----- NORMALIZE ----- */
  name1 = name1.toLowerCase().replace(/\s+/g, "");
  name2 = name2.toLowerCase().replace(/\s+/g, "");

  /* ----- REMOVE COMMON CHARS ----- */
  let arr1 = name1.split("");
  let arr2 = name2.split("");

  for (let i = 0; i < arr1.length; i++) {
    let idx = arr2.indexOf(arr1[i]);
    if (idx !== -1) {
      arr1.splice(i, 1);
      arr2.splice(idx, 1);
      i--;
    }
  }

  const count = arr1.length + arr2.length;

  if (count === 0) {
    showWarning("🤔 SAME NAMES? TRY DIFFERENT ONES!");
    return;
  }

  /* ----- FLAMES LOGIC ----- */
  let flames = ["F", "L", "A", "M", "E", "S"];
  let index = 0;

  while (flames.length > 1) {
    index = (index + count - 1) % flames.length;
    flames.splice(index, 1);
  }

  const resultMap = {
    F: ["🤝 FRIENDS", "friend"],
    L: ["💖 LOVE", "love"],
    A: ["🩵 AFFECTION", "affection"],
    M: ["💍 MARRIAGE", "marriage"],
    E: ["😈 ENEMY", "enemy"],
    S: ["👨‍👩‍👧 SIBLINGS", "sibling"]
  };

  const [text, glow] = resultMap[flames[0]];

  showFinalResult(text, glow);
});
