// D474designs | JOCV-III ///////
// All Rights Reserved ///////

// This is a long one. I hope this over-commenting helps. Let's do this!

// Let's put our settings up top so we can change them easily
let settings = {
  spotlightRadius: 1250,
  boxCount: 350,
  moveSpeed: 1.2,
  turboSpeed: 7,
}

// Let's define our states, there's only one in this game at the moment
function state(s){
  // we call our init state all the way down the bottom of our code
  if (s==="init"){
    // let's create an instance of our class Application
    const app = new Application;

    // Add our UI
    let wrapper = document.querySelector('#game-wrapper');
    // update light position
    wrapper.addEventListener('mousemove',function(e){
      app.universe.light.position.x = e.clientX*window.devicePixelRatio;
      app.universe.light.position.y = e.clientY*window.devicePixelRatio;
    });
    // engage turbo when our mouse is down
    wrapper.addEventListener('mousedown',() => {
      app.universe.speed = settings.turboSpeed;
    });
    // release turbo when mouse is up
    wrapper.addEventListener('mouseup',()=>{
      app.universe.speed = settings.moveSpeed;
    });
  }
}

// This is our application class. It contains our Universe which contains our Boxes and our Light
// I called them boxes, not crystals, because this project changed direction as it progressed
class Application {
  constructor(){
    // Our app has a width and a height
    // wWe don't know their size yet but we can figure them out using the resize function below
    this.width = null;
    this.height = null;

    let wrapper = document.querySelector('#game-wrapper');
    // Let's create our canvas that the game will be rendered on
    this.canvas = document.createElement('canvas');
    // and put it inside of our wrapper
    wrapper.appendChild(this.canvas);
    // create a context for it that we will render into, it's a 2d sim
    this.context = this.canvas.getContext('2d');

    // We'll also need a masking canvas to hide crystals ourside of the lit area
    // It's the black outside of our visible ring, we'll call it an overlay
    this.canvasOverlay = document.createElement('canvas');
    wrapper.appendChild(this.canvasOverlay);
    this.contextOverlay = this.canvasOverlay.getContext('2d');

    // Let's resize our canvas
    this.resize();
    // and set up a listener which will resize it again if the window size changes
    window.addEventListener('resize', () => this.resize(), false);

    // if you haven't come across this "() => foo()":
    // It's just a condensed way of writing "function() {foo()}"
    // read here: https://babeljs.io/learn-es2015/

    // Let's add our Universe class to our app and pass through the width and height values
    this.universe = new Universe(this.width,this.height);

    // and start our render function
    this.render();
  }

  render(){
    // Canvases need to be cleared each frame or else what you draw will just layer on top
    // So let's clear the whole canvas
    this.context.clearRect(0,0,this.width*window.devicePixelRatio,this.height*window.devicePixelRatio);

    // Let's fill in the "lit" area around our mouse with a nice gradien so the light looks like it fades away
    // First let's create our gradient
    let gradient=this.context.createRadialGradient(this.universe.light.position.x,this.universe.light.position.y,0.9*settings.spotlightRadius,this.universe.light.position.x,this.universe.light.position.y,0);
    // ... and pass through our hex colors
    gradient.addColorStop(0,"#202062");
    gradient.addColorStop(1,"#988280");

    // Now let's add this gradient to our canvas context
    this.context.fillStyle = gradient;
    this.context.fillRect(0,0,this.width,this.height);

    // Now let's draw the boxes from our universe
    // They exist in the universe, but everything is rendered in our app's render step
    let boxes = this.universe.boxArray;
    // create a for loop that goes through our box array
    for (var i=0; i<boxes.length;i++){
      //  and pulls out each box one at a time
      let box = boxes[i];

      // Let's draw this crystal
      // -----------------------
      // First let's get it's color
      this.context.fillStyle = box.color;
      this.context.strokeStyle = box.color;
      // For each side of the crystal we'll have to project that side into the distance:
      // Notice that each point on a crystal casts a "shadow" that extends away from where a mouse is
      // So for each point on this box let's do that
      for (let i = 0;i<box.shadowCorners.length;i++){
        // shade by section between this point and the next point and then the shadow
        // and loop back to the start if we're at our final point (to close the shape)
        let j = (i<box.shadowCorners.length-1) ? i+1:0

        // Let's project the side of our crystal off into the distance by creating a polygon
        // this is tricky to describe but maybe this will help imgur.com/a/84048
        this.context.beginPath();
        this.context.moveTo(box.corners[i].x,box.corners[i].y);
        this.context.lineTo(box.shadowCorners[i].x,box.shadowCorners[i].y);
        this.context.lineTo(box.shadowCorners[j].x,box.shadowCorners[j].y);
        this.context.lineTo(box.corners[j].x,box.corners[j].y);

        // close out path, fill and stroke and 
        this.context.closePath();
        this.context.stroke();
        this.context.fill();

        // We repeat this process for every side of every crystal :o computers are so cool
      }

      // Okay but we've still got to draw the happy box over the top of this mess
      this.context.beginPath();
      // fortunately this is just one shape
      this.context.moveTo(box.corners[0].x,box.corners[0].y);
      for (let i = 1;i<box.sides;i++){
        this.context.lineTo(box.corners[i].x,box.corners[i].y);
      }
      this.context.closePath();
      this.context.fill();
      this.context.stroke();
    }

    // Let's paint a little happy circle in where our mouse is
    // Remember, this is your universe, you don't have to do this
    // Just make it up as you go... (RIP Bob Ross)
    this.context.beginPath();
    this.context.arc(this.universe.light.position.x,this.universe.light.position.y,2,0,2*Math.PI);
    this.context.stroke();

    // Now let's draw our overlay
    // First let's clear the old one
    this.contextOverlay.clearRect(0,0,this.width*window.devicePixelRatio,this.height*window.devicePixelRatio);

    // We want a transparent circle centered around our mouse
    // rimmed with the color that our light fades out to
    gradient=this.contextOverlay.createRadialGradient(this.universe.light.position.x,this.universe.light.position.y,settings.spotlightRadius,this.universe.light.position.x,this.universe.light.position.y,0);
    gradient.addColorStop(0,"#0a0e23");
    gradient.addColorStop(0.5,"transparent");

    // Try commenting out these lines to see it without the overlay
    this.contextOverlay.fillStyle = gradient;
    this.contextOverlay.fillRect(0,0,this.width,this.height);

    // Now update the position of everything in our universe
    this.update();

    // And request another render frame
    window.requestAnimationFrame(()=>this.render());
  }

  update(){
    this.universe.update(this.center);
  }

  resize(){
    // Set our app width and height to that of the window
    this.width = window.innerWidth;
    this.height = window.innerHeight;

    // And resize our wrapper to these dimensions
    document.querySelector('#game-wrapper').style.width = this.width+'px';
    document.querySelector('#game-wrapper').style.height = this.height+'px';

    // Then get the size for our canvas based off the pixel density of the screen
    this.width *= window.devicePixelRatio;
    this.height *= window.devicePixelRatio;

    // and resize our canvases
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    this.canvasOverlay.width = this.width;
    this.canvasOverlay.height = this.height;

    // regenerate our boxes
    if (this.universe) this.universe.generateBoxes();

    // BLEND MODE
    // this will mix the colors of the crystals as they are laid over the top of one another
    this.context.globalCompositeOperation = 'screen';

    // And define our center pixel
    this.center = {
      x: this.width/2,
      y: this.height/2
    }
  }
}

// Our Universe class contains our light and our Boxes (crystals)
class Universe{
  constructor(width,height){
    // It inherits the width and height of our app
    this.width = width;
    this.height = height;
    this.speed = settings.moveSpeed;

    // Let's store all of the boxes in our universe in an array for nice access
    this.boxArray = [];

    // generate our Boxes
    this.generateBoxes();

    // And also add the light which hangs out on our mouse
    this.light = new Light(width*1.75,height*1.35);
  }

  generateBoxes(){
    // Clear array if there is one
    this.boxArray = [];
    // Let's create the number of boxes we defined in our settings
    for (let i=0;i<settings.boxCount;i++){
      // create a box
      let box = new Box(this.width, this.height);
      // and add it to our array of boxes
      this.boxArray.push(box);
    }
  }

  // This is called alongside each render frame 
  update(centerPixel){
    // First we calculate our change in direction based on where the mouse is 
    // the further it is from the center, the more we move in that direction
    // Our change in x
    let dx = (centerPixel.x - this.light.position.x)/100;
    // and our change in y
    let dy = (centerPixel.y - this.light.position.y)/100;

    // Now we can use this change to update our box positions and their shadows
    Array.prototype.forEach.call(this.boxArray, (box)=>{
      box.update(centerPixel,dx*this.speed,dy*this.speed,this.light);
    });
  }
}

// Each box is a crystal
class Box {
  constructor(width,height){
    // When it's created let's give it a random position inside of the width and height of our universe
    this.position = {
      x: Math.random()*width,
      y: Math.random()*height,
    }
    // and give it a random radius
    this.radius = Math.random()*30;
    // a random rotation
    this.rotation = Math.random();
    // a random rotation speed
    this.rotationSpeed = (Math.random()-0.5)/100;
    // a random number of sides
    // (min 3 sides max 8)
    this.sides = Math.floor(Math.random()*6+3);
    // and a random color using the getRandomColor function below
    this.color = this.getRandomColor();

    // let's create an array for each box to store the location of it's corners and the projection of those corners away from our light source
    this.corners = [];
    // and let's figure out those locations
    this.getCornerLocations();
    this.shadowCorners = this.corners;
  }

  update(centerPixel,dx,dy,light){
    // update the box position
    this.position.x += dx;
    this.position.y += dy;

    // check location of our box and loop it if it's outside of canvas 
    if (this.position.x<-this.radius){
      this.position.x+=centerPixel.x*2+this.radius*2;
    } else if (this.position.x>centerPixel.x*2+this.radius){
      this.position.x -= centerPixel.x*2+this.radius*2;
    }
    if (this.position.y<0-this.radius){
      this.position.y+=centerPixel.y*2+this.radius*2;
    } else if (this.position.y>centerPixel.y*2+this.radius){
      this.position.y-=centerPixel.y*2+this.radius*2;
    }

    // rotate the box according to it's speed
    this.rotation += this.rotationSpeed;

    // Dump our old locations
    this.corners = [];
    this.shadowCorners = [];

    // and find the new corners of our box and porject them
    this.getCornerLocations();
    this.getShadowCorners(light);
  }

  getCornerLocations(){   
    // We're going to draw our shapes on a circle by breaking the circle up into the number of sections that we need
    // The angle between each of our points is defined by:
    let internalAngle = Math.PI*2/this.sides;
    // see imgur.com/a/YhwKg

    // Let's calculate the location of each of the corners for our polygon
    for (var i=0;i<this.sides;i++){
      // Use trig to get the location based off of our x and y
      let x = this.position.x + this.radius*Math.sin(this.rotation+i*internalAngle);
      let y = this.position.y + this.radius*Math.cos(this.rotation+i*internalAngle);
      // and push to the array
      this.corners.push({x:x,y:y});
    }
  }

  getShadowCorners(light){
    // Our shadow corners are the projected corners of our boxes

    // for each of our box corners, let's figure out the projection
    for (var i=0;i<this.sides;i++){
      // Let's figure out the x and y of our corner relative to our light, and make our shadowCorner a point on the same line, much further away
      let dx = this.corners[i].x - light.position.x;
      let dy = this.corners[i].y - light.position.y;
      let dist = Math.sqrt(dx*dx+dy*dy);

      // extrapolate this line into the distance (relative to our starting point)
      let x = light.position.x + dx * settings.spotlightRadius / dist * 20;  // 20 times the distance of our light radius
      let y = light.position.y + dy * settings.spotlightRadius / dist * 20; 

      // lol whoop[s]
      // let x = this.corners[i].x + dx * settings.spotlightRadius / dist;
      // let y = this.corners[i].y + dy * settings.spotlightRadius / dist; 

      // and push the point to our shadowCorner array
      this.shadowCorners.push({x:x,y:y});
    }
  }

  // function we use to get a random color
  getRandomColor() {
    let letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++ ) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }
}

// Our light class, pretty simple...
// I was thinking about adding multiple lights or light of different colors and creating a light class could of allowed me to do this in the future. But I didn't :P
class Light {
  constructor(x,y){
    this.position = {
      x: x,
      y: y,
    }
  }
}

// on load, start our initialization state
window.onload = function() {
  state("init");
  // followMe("init");
}