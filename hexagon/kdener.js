// D474designs | Modifications, and fixes by JOCV-III ///////
// All Rights Reserved ///////

(() => {
  const styleContent = `.labs-follow-me-twitter, .labs-follow-me {
  transform: scale(1);
  position: fixed;
  transition: background 0.3s ease;
  right: 3px;
  top: 0px;
  color: currentColor !important;
  z-index: 99;
  
  &:visited, &:active { 
    color: currentColor;
  }
  @media (hover) {
    &:hover {
      background: rgba(255, 255, 255, 0.04);
    }
  }
}
`;
  const hide = `.labs-follow-me{display: none !important}`;
  const disableAnimations = `
    *, *:before, *:after {animation-play-state: paused !important; --base-speed: 0s; }
    
  `;

  const embed = new URLSearchParams(window.location.search).has("labs-embed");
  const style = document.createElement("style");
  if (embed) {
    style.innerHTML = hide;
  } else {
    style.innerHTML = styleContent;
  }
  document.head.appendChild(style);

  if (embed) {
    setTimeout(() => {
      const style2 = document.createElement("style");
      style2.innerHTML = disableAnimations;
      document.head.appendChild(style2);
      window.clearInterval(0);
      window.clearInterval(1);
      window.clearInterval(2);
      window.setTimeout = window.setInterval = window.requestAnimationFrame = () => {};
      document
        .querySelectorAll("animate")
        .forEach((node) => node.setAttribute("dur", "0s"));
    }, 5000);
  }

  let followMeButton = document.createElement("a");
  followMeButton.classList.add("labs-follow-me-twitter");
  followMeButton.classList.add("labs-follow-me");
  document.body.appendChild(followMeButton);
  followMeButton.href = "https://twitter.com/D474designs";
  followMeButton.target = "_blank";
  followMeButton.setAttribute('title', 'Follow me on X for more!');
  followMeButton.innerHTML = `<svg version="1.0" xmlns="http://www.w3.org/2000/svg"
 width="300.000000pt" height="140.000000pt" viewBox="0 0 300.000000 140.000000"
 preserveAspectRatio="xMidYMid meet">
<metadata>
Created by potrace 1.10, written by Peter Selinger 2001-2011
</metadata>
<g transform="translate(0.000000,140.000000) scale(0.100000,-0.100000)"
fill="#000000" stroke="none">
<path d="M40 1360 c0 -3 0 -151 0 -330 l0 -324 197 -198 198 -198 292 0 293 0
0 118 0 117 -271 -3 -271 -3 -103 108 -104 108 -1 188 0 187 463 0 462 0 -3
-412 -2 -413 120 -120 120 -120 0 650 0 650 -695 0 c-382 0 -695 -2 -695 -5z
m1344 -56 c9 -25 7 -1112 -3 -1118 -4 -3 -40 28 -80 68 l-71 74 0 400 0 401
-26 20 c-26 21 -37 21 -476 21 l-449 0 -24 -25 c-25 -24 -25 -26 -25 -208 0
-174 1 -186 22 -213 31 -42 180 -193 203 -207 13 -8 102 -14 270 -17 l250 -5
0 -70 0 -70 -260 -3 -259 -2 -188 187 -188 188 0 297 0 298 649 0 c582 0 649
-2 655 -16z"/>
<path d="M1570 715 l0 -650 120 120 120 120 -2 413 -3 412 463 0 462 0 0 -187
-1 -188 -104 -108 -103 -108 -271 3 -271 3 0 -117 0 -118 293 0 292 0 198 198
197 198 1 327 0 327 -695 3 -696 2 0 -650z m1348 305 l2 -295 -188 -188 -189
-187 -259 2 -259 3 0 70 0 70 250 5 c163 3 257 9 270 17 34 19 205 201 215
228 6 15 10 104 10 199 0 170 0 174 -25 200 l-24 26 -449 0 c-432 0 -450 -1
-474 -20 l-26 -20 -7 -407 -7 -408 -66 -67 c-36 -37 -69 -65 -74 -62 -10 6
-11 1118 -1 1127 3 4 297 6 652 5 l646 -3 3 -295z"/>
</g>
</svg>

`.replaceAll('fill="black"','fill="currentColor"');
})();