/* // D474designs | Modifications, and fixes by JOCV-III ///////
// All Rights Reserved /////// */

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

<!-- // D474designs | JOCV-III ///////
// All Rights Reserved /////// -->

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

/*
The MIT License (MIT)

Copyright (c) 2025 sunil (https://codepen.io/sunil264787/pen/GgJeoOz)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

/* // D474designs | Modifications, and fixes by JOCV-III ///////
// All Rights Reserved /////// */