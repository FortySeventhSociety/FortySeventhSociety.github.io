# Pure CSS minesweeper

A Pen created on CodePen.io. Original URL: [https://codepen.io/bali_balo/pen/BLJONZ](https://codepen.io/bali_balo/pen/BLJONZ).

I wanted to see if I could do a fully functioning minesweeper with CSS only. And it works !  
I'm pretty satisfied with the less than <del>300</del> 400 (with the timer) lines of Sass, even if it quickly gets really slow to compile and to play with bigger grids.

The win detection is based on the flags. I know it's not like the actual game but it makes the logic much easier.
The grid is only randomized at compile time (when you hit run) not between restarts (it would make the CSS huge, it is already big as it is).

Yes, emojis were used and maybe even abused.

Issues : in Edge, the victory screen does not trigger.