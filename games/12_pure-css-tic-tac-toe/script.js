// D474designs | JOCV-III ///////
// All Rights Reserved ///////

/* Get the documentElement (<html>) to display the page in fullscreen */
var elem = document.documentElement;

/* View in fullscreen */
function openFullscreen() {
  if (elem.requestFullscreen) {
    elem.requestFullscreen();
  } else if (elem.webkitRequestFullscreen) { /* Safari */
    elem.webkitRequestFullscreen();
  } else if (elem.msRequestFullscreen) { /* IE11 */
    elem.msRequestFullscreen();
  }
}

/* Close fullscreen */
function closeFullscreen() {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.webkitExitFullscreen) { /* Safari */
    document.webkitExitFullscreen();
  } else if (document.msExitFullscreen) { /* IE11 */
    document.msExitFullscreen();
  }
}

// Look ma' no JS! :)

/*
I have seen demos of pure CSS Tic-tac-toe games, but I was unable to find a version that truly works. If I have missed it, please send me link, so I can see how another dev has created it.

My version works as any normal Tic-tac-toe game would: 2 players can play against each other, it can result in either a win or a tie. Players can also restart the game.

In my CodePen example, I used Jade and SASS, so that my code looks much cleaner and simpler to understand.
*/
// How it works: https://codepen.io/ziga-miklic/blog/pure-css-tic-tac-toe/