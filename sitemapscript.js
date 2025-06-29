const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

document.querySelectorAll(".scramble").forEach((el) => {
  el.addEventListener("mouseover", () => {
    let iterations = 0;
    const original = el.dataset.text;

    const interval = setInterval(() => {
      el.innerText = original
        .split("")
        .map((char, i) => {
          if (i < iterations) return char;
          return letters[Math.floor(Math.random() * 26)];
        })
        .join("");

      if (iterations >= original.length) clearInterval(interval);
      //Change the number 1/5 to increase or decrease the animation speed
      iterations += 1 / 5;
    }, 30);
  });
});

var urls = [
  "./theAPI.html",
  "./notTheAPI.html",
  "https://globalsolutionsunited.github.io/uplink",
  "https://d474designs.github.io/payload",
  "https://that-hill.github.io/secretlevel",
  "https://d474media.github.io/eldorado",
  "https://d474developments.github.io/feed",
  "https://discord.gg/gnDVaZF53h",
  "https://www.reddit.com/r/47thSociety",
  "https://d474com.wordpress.com/",
];

function randomLink() {
  var randomIndex = Math.floor(Math.random() * urls.length);
  document.getElementById("myLink").href = urls[randomIndex];
}
