// D474designs | JOCV-III ///////
// All Rights Reserved ///////

const ALPHBET = [
  "a",
  "b",
  "c",
  "d",
  "e",
  "f",
  "g",
  "h",
  "i",
  "j",
  "k",
  "l",
  "m",
  "n",
  "o",
  "p",
  "q",
  "r",
  "s",
  "t",
  "u",
  "v",
  "w",
  "x",
  "y",
  "z"
];

const Words = [
  { category: "football", word: "everton", hint: "Based in Mersyside" },
  { category: "football", word: "liverpool", hint: "Based in Mersyside" },
  {
    category: "football",
    word: "swansea",
    hint: "First Welsh team to reach the Premier Leauge"
  },
  {
    category: "football",
    word: "chelsea",
    hint: "Owned by A russian Billionaire"
  },
  { category: "football", word: "hull", hint: "Once managed by Phil Brown" },
  {
    category: "football",
    word: "manchester-city",
    hint: "2013 FA Cup runners up"
  },
  {
    category: "football",
    word: "newcastle-united",
    hint: "Gazza's first club"
  },
  {
    category: "movie and series",
    word: "alien",
    hint: "Science-Fiction horror film"
  },
  {
    category: "movie and series",
    word: "dirty-harry",
    hint: "1971 American action film"
  },
  { category: "movie and series", word: "gladiator", hint: "Historical drama" },
  { category: "movie and series", word: "finding-nemo", hint: "Anamated Fish" },
  {
    category: "movie and series",
    word: "jaws",
    hint: "Giant great white shark"
  },
  { category: "city", word: "manchester", hint: "Northern city in the UK" },
  { category: "city", word: "milan", hint: "Home of AC and Inter" },
  { category: "city", word: "madrid", hint: "Spanish capital" },
  { category: "city", word: "amsterdam", hint: "Netherlands capital" },
  { category: "city", word: "prague", hint: "Czech Republic capital" }
];

/* SELECTORS
 *******************/
const $letter = { list: document.querySelector(".letter-list"), items: [] };
const $holder = { list: document.querySelector("#guess-list"), items: [] };
const $category = document.querySelector("#guess-category");
const $lives = document.querySelector("#lives-value");
const $toggleDarkMode = document.querySelector("#toggle-dark-mode");
const $stickman = document.querySelector("#stickman");
const $overlay = document.querySelector(".overlay-wrapper");
const $hint = {
  wrapper: document.querySelector("#hint-wrapper"),
  text: document.querySelector("#hint-text"),
  close: document.querySelector("#hint-close"),
  open: document.querySelector(".guess-hint")
};
const $win = {
  wrapper: document.querySelector(".win-wrapper")
};
const $lose = {
  wrapper: document.querySelector(".lose-wrapper")
};
const $reset = {
  guess: document.querySelector("#guess-reset"),
  win: document.querySelector("#win-reset"),
  lose: document.querySelector("#lose-reset")
};

class Stickman {
  static context = null;

  static levels = [
    Stickman.rightLeg,
    Stickman.leftLeg,
    Stickman.rightArm,
    Stickman.leftArm,
    Stickman.torso,
    Stickman.head,
    Stickman.frame4,
    Stickman.frame3,
    Stickman.frame2,
    Stickman.frame1
  ];

  static render(value) {
    return Stickman.levels[value]();
  }

  static init() {
    Stickman.context = $stickman.getContext("2d");
    Stickman.context.beginPath();
    Stickman.context.strokeStyle = "#fff";
    Stickman.context.lineWidth = 2;
  }

  static head() {
    Stickman.context.beginPath();
    Stickman.context.arc(60, 25, 10, 0, Math.PI * 2, true);
    Stickman.context.stroke();
  }

  static draw($pathFromx, $pathFromy, $pathTox, $pathToy) {
    Stickman.context.moveTo($pathFromx, $pathFromy);
    Stickman.context.lineTo($pathTox, $pathToy);
    Stickman.context.stroke();
  }

  static frame1() {
    Stickman.draw(0, 150, 150, 150);
  }

  static frame2() {
    Stickman.draw(10, 0, 10, 600);
  }

  static frame3() {
    Stickman.draw(0, 5, 70, 5);
  }

  static frame4() {
    Stickman.draw(60, 5, 60, 15);
  }

  static torso() {
    Stickman.draw(60, 36, 60, 70);
  }

  static rightArm() {
    Stickman.draw(60, 46, 100, 50);
  }

  static leftArm() {
    Stickman.draw(60, 46, 20, 50);
  }

  static rightLeg() {
    Stickman.draw(60, 70, 100, 100);
  }

  static leftLeg() {
    Stickman.draw(60, 70, 20, 100);
  }

  static reset() {
    return Stickman.context.clearRect(0, 0, 400, 400);
  }
}

(function () {
  let chosen = { category: "", word: "", hint: "" };

  /* INITIALZE
   *******************/
  chosen = getRandomWord(Words);
  Stickman.init();
  $letter.items = [
    ...ALPHBET.map((letter) => {
      let $letterItem = $CreateLetterItem(letter);
      $letter.list.appendChild($letterItem);
      return $letterItem;
    })
  ];
  $holder.items = [
    ...[...chosen.word].map((letter) => {
      let $holderItem = $CreateHolderItem(letter);
      $holder.list.appendChild($holderItem);
      return $holderItem;
    })
  ];
  $category.textContent = chosen.category;

  /* EVENTS
   ****************************/
  document.querySelectorAll(".letter-item").forEach(($letterItem) => {
    $letterItem.addEventListener("click", handleClickLetter, false);
  });
  $hint.open.addEventListener(
    "click",
    function (ev) {
      return handleClickHintOpen.call(this, ev, chosen);
    },
    false
  );
  $hint.close.addEventListener("click", handleClickHintClose, false);
  $reset.guess.addEventListener("click", handleClickReset, false);
  $reset.win.addEventListener("click", handleClickReset, false);
  $reset.lose.addEventListener("click", handleClickReset, false);
  $toggleDarkMode.addEventListener("click", handleClickToggleDarkMode, false);
})();

function handleClickToggleDarkMode(ev) {
  console.log("[TOGGLE DARK-MODE] : turn-on");
  document.body.classList.toggle("dark-mode");
  return;
}

function handleClickReset(ev) {
  Stickman.reset();
  $letter.items = [];
  $holder.items = [];
  [...$letter.list.children].forEach((child) => child.remove());
  [...$holder.list.children].forEach((child) => child.remove());
  $lives.dataset.value = 10;
  $lives.textContent = 10;

  if ($lose.wrapper.classList.contains("lose-active")) {
    $lose.wrapper.classList.remove("lose-active");
  }

  if ($win.wrapper.classList.contains("win-active")) {
    $win.wrapper.classList.remove("win-active");
  }

  if ($overlay.classList.contains("overlay-active")) {
    $overlay.classList.remove("overlay-active");
  }

  if ($lives.parentElement.classList.contains("guess-heart-error")) {
    $lives.parentElement.classList.remove("guess-heart-error");
  }
  let chosen = { category: "", word: "", hint: "" };

  chosen = getRandomWord(Words);
  $letter.items = [
    ...ALPHBET.map((letter) => {
      let $letterItem = $CreateLetterItem(letter);
      $letter.list.appendChild($letterItem);
      return $letterItem;
    })
  ];
  $holder.items = [
    ...[...chosen.word].map((letter) => {
      let $holderItem = $CreateHolderItem(letter);
      $holder.list.appendChild($holderItem);
      return $holderItem;
    })
  ];
  $category.textContent = chosen.category;

  document.querySelectorAll(".letter-item").forEach(($letterItem) => {
    $letterItem.addEventListener("click", handleClickLetter, false);
  });
}

function handleClickHintOpen(ev, { hint }) {
  $hint.wrapper.classList.add("hint-active");
  $overlay.classList.add("overlay-active");
  $hint.text.textContent = hint;
  return;
}

function handleClickHintClose(ev) {
  $hint.wrapper.classList.remove("hint-active");
  $overlay.classList.remove("overlay-active");
}

function handleClickLetter(ev) {
  let $this = ev.target;
  let letter = $this.textContent;
  checkLetter(letter)
    .then(($holderItems) => {
      correctLetter($this, $holderItems);
    })
    .catch(() => {
      incorrectLetter($this);
    })
    .finally(() => {
      $this.setAttribute("disabled", "disabled");
      $this.removeEventListener("click", handleClickLetter, false);
    });
}

function correctLetter($letterItem, $holderItems) {
  $holderItems.map(($holderItem) => {
    $holderItem.textContent = $letterItem.textContent;
    $holderItem.classList.add("guess-holder-active");
  });

  let wholeWord = [...$holder.items.map((item) => item.dataset.letter)].join(
    ""
  );
  let insertedWord = [...$holder.items.map((item) => item.innerHTML)].join("");

  if (wholeWord == insertedWord) {
    $win.wrapper.classList.add("win-active");
    return $overlay.classList.add("overlay-active");
  }

  return $letterItem.classList.add("letter-item-correct");
}

function incorrectLetter($letterItem) {
  $letterItem.classList.add("letter-item-incorrect");
  let liveValue = window.parseInt($lives.dataset.value);

  if (liveValue - 1 < 0) {
    $overlay.classList.add("overlay-active");
    $lose.wrapper.classList.add("lose-active");
    return;
  }

  if (liveValue - 1 < 6) {
    $lives.parentElement.classList.add("guess-heart-error");
  }

  Stickman.render(liveValue - 1);

  $lives.dataset.value = liveValue - 1;
  $lives.textContent = `0${liveValue - 1}`;
  return;
}

function checkLetter(letter) {
  return new Promise((resolve, reject) => {
    let $holderItems = $holder.items.filter(
      ($holderItem) => $holderItem.dataset.letter == letter
    );

    if ($holderItems.length < 1) return reject();

    return resolve($holderItems);
  });
}

function $CreateLetterItem(letter) {
  const li = document.createElement("li");
  li.setAttribute("id", `letter-${letter}`);
  li.setAttribute("tabIndex", "0");
  li.classList.add("letter-item");
  li.textContent = letter;
  return li.cloneNode(true);
}

function $CreateHolderItem(letter) {
  const li = document.createElement("li");
  // li.setAttribute('id', `holder-`)
  li.dataset.letter = letter;

  if (letter != "-") li.classList.add("guess-holder-item");
  else {
    li.classList.add("guess-holder-delimiter");
    li.textContent = "-";
  }

  return li.cloneNode(true);
}

function getRandomWord(words) {
  return words[Math.floor(Math.random() * words.length)];
}

//   // Animate man
//   var animate = function () {
//     var drawMe = lives;
//     drawArray[drawMe]();
//   };

//   // Hangman
//   canvas = function () {
//     myStickman = document.getElementById("stickman");
//     context = myStickman.getContext("2d");
//     context.beginPath();
//     context.strokeStyle = "#fff";
//     context.lineWidth = 2;
//   };

//   head = function () {
//     myStickman = document.getElementById("stickman");
//     context = myStickman.getContext("2d");
//     context.beginPath();
//     context.arc(60, 25, 10, 0, Math.PI * 2, true);
//     context.stroke();
//   };

//   draw = function ($pathFromx, $pathFromy, $pathTox, $pathToy) {
//     context.moveTo($pathFromx, $pathFromy);
//     context.lineTo($pathTox, $pathToy);
//     context.stroke();
//   };

//   frame1 = function () {
//     draw(0, 150, 150, 150);
//   };

//   frame2 = function () {
//     draw(10, 0, 10, 600);
//   };

//   frame3 = function () {
//     draw(0, 5, 70, 5);
//   };

//   frame4 = function () {
//     draw(60, 5, 60, 15);
//   };

//   torso = function () {
//     draw(60, 36, 60, 70);
//   };

//   rightArm = function () {
//     draw(60, 46, 100, 50);
//   };

//   leftArm = function () {
//     draw(60, 46, 20, 50);
//   };

//   rightLeg = function () {
//     draw(60, 70, 100, 100);
//   };

//   leftLeg = function () {
//     draw(60, 70, 20, 100);
//   };

//   drawArray = [
//     rightLeg,
//     leftLeg,
//     rightArm,
//     leftArm,
//     torso,
//     head,
//     frame4,
//     frame3,
//     frame2,
//     frame1
//   ];

//   // OnClick Function
//   check = function () {
//     list.onclick = function () {
//       var geuss = this.innerHTML;
//       this.setAttribute("class", "active");
//       this.onclick = null;
//       for (var i = 0; i < word.length; i++) {
//         if (word[i] === geuss) {
//           geusses[i].innerHTML = geuss;
//           counter += 1;
//         }
//       }
//       var j = word.indexOf(geuss);
//       if (j === -1) {
//         lives -= 1;
//         comments();
//         animate();
//       } else {
//         comments();
//       }
//     };
//   };

//   // Play
//   play = function () {
//     categories = [
//       [
//         "everton",
//         "liverpool",
//         "swansea",
//         "chelsea",
//         "hull",
//         "manchester-city",
//         "newcastle-united"
//       ],
//       ["alien", "dirty-harry", "gladiator", "finding-nemo", "jaws"],
//       ["manchester", "milan", "madrid", "amsterdam", "prague"]
//     ];

//     chosenCategory = categories[Math.floor(Math.random() * categories.length)];
//     word = chosenCategory[Math.floor(Math.random() * chosenCategory.length)];
//     word = word.replace(/\s/g, "-");
//     console.log(word);

//     geusses = [];
//     lives = 10;
//     counter = 0;
//     space = 0;
//     result();
//     comments();
//     selectCat();
//     canvas();
//   };

//   play();

//   // Hint

//   hint.onclick = function () {
//     hints = [
//
//     var catagoryIndex = categories.indexOf(chosenCategory);
//     var hintIndex = chosenCategory.indexOf(word);
//     showClue.innerHTML = "Clue: - " + hints[catagoryIndex][hintIndex];
//   };

//   // Reset

//   document.getElementById("reset").onclick = function () {
//     correct.parentNode.removeChild(correct);
//     letters.parentNode.removeChild(letters);
//     showClue.innerHTML = "";
//     context.clearRect(0, 0, 400, 400);
//     play();
//   };
// };