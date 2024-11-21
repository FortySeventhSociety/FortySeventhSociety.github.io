var Game = {
      canvas: null,
      ctx: null,
      canvas2: null,
      ctx2: null,
      colors: {
        sky: "#D4F5FE",
        mountains: "#83CACE",
        ground: "#8FC04C",
        groundDark: "#73B043",
        road: "#606a7c",
        roadLine: "#FFF",
        hud: "#FFF"
      },
      settings: {
        fps: 60,
        skySize: 120,
        ground: {
          size: 350,
          min: 4,
          max: 120
        },
        road: {
          min: 76,
          max: 700,
        }
      },
      state: {
        bgpos: 0,
        offset: 0,
        startDark: true,
        curve: 0,
        currentCurve: 0,
        turn: 1,
        speed: 27,
        xpos: 0,
        section: 50,
        car: {
          maxSpeed: 50,
          friction: 0.4,
          acc: 0.85,
          deAcc: 0.5
        },
        keypress: {
          up: false,
          left: false,
          right: false,
          down: false
        }
      },
      storage: {
        bg: null
      }
    };
Game.canvas = document.getElementsByTagName('canvas')[0];
Game.ctx = Game.canvas.getContext('2d');
Game.canvas2 = document.createElement('canvas');
Game.canvas2.width = Game.canvas.width;
Game.canvas2.height = Game.canvas.height;
Game.ctx2 = Game.canvas2.getContext('2d');
window.addEventListener("keydown", keyDown, false);
window.addEventListener("keyup", keyUp, false);

drawBg();
draw();

function draw() {
  setTimeout(function() {
    calcMovement();
    
    //if(Game.state.speed > 0) {
      Game.state.bgpos += (Game.state.currentCurve * 0.02) * (Game.state.speed * 0.2);
      Game.state.bgpos = Game.state.bgpos % Game.canvas.width;
      
      Game.ctx.putImageData(Game.storage.bg, Game.state.bgpos, 5);
      Game.ctx.putImageData(Game.storage.bg, Game.state.bgpos > 0 ? Game.state.bgpos - Game.canvas.width : Game.state.bgpos + Game.canvas.width, 5);
    //}
    
    Game.state.offset += Game.state.speed * 0.05;
    if(Game.state.offset > Game.settings.ground.min) {
      Game.state.offset = Game.settings.ground.min - Game.state.offset;
      Game.state.startDark = !Game.state.startDark;
    }
    drawGround(Game.ctx, Game.state.offset, Game.colors.ground, Game.colors.groundDark, Game.canvas.width);
    
    drawRoad(Game.settings.road.min + 6, Game.settings.road.max + 36, 10, Game.colors.roadLine);
    drawGround(Game.ctx2, Game.state.offset, Game.colors.roadLine, Game.colors.road, Game.canvas.width);
    drawRoad(Game.settings.road.min, Game.settings.road.max, 10, Game.colors.road);
    drawRoad(3, 24, 0, Game.ctx.createPattern(Game.canvas2, 'repeat'));
    drawCar();
    drawHUD(Game.ctx, 630, 340, Game.colors.hud);
    
    requestAnimationFrame(draw);
  }, 1000 / Game.settings.fps);
}

function drawHUD(ctx, centerX, centerY, color) {
  var radius = 50, tigs = [0, 90, 135, 180, 225, 270, 315],
      angle = 90;

  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
  ctx.lineWidth = 7;
  ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
  ctx.fill();
  ctx.strokeStyle = color;
  ctx.stroke();
  
  for (var i = 0; i < tigs.length; i++) {
    drawTig(ctx, centerX, centerY, radius, tigs[i], 7);
  }
  
  // draw pointer
  angle = map(Game.state.speed, 0, Game.state.car.maxSpeed, 90, 360);
  drawPointer(ctx, color, 50, centerX, centerY, angle);
}

function drawPointer(ctx, color, radius, centerX, centerY, angle) {
  var point = getCirclePoint(centerX, centerY, radius - 20, angle),
      point2 = getCirclePoint(centerX, centerY, 2, angle + 90),
      point3 = getCirclePoint(centerX, centerY, 2, angle - 90);
  
  ctx.beginPath();
  ctx.strokeStyle = "#FF9166";
  ctx.lineCap = 'round';
  ctx.lineWidth = 4;
  ctx.moveTo(point2.x, point2.y);
  ctx.lineTo(point.x, point.y);
  ctx.lineTo(point3.x, point3.y);
  ctx.stroke();
  
  ctx.beginPath();
  ctx.arc(centerX, centerY, 9, 0, 2 * Math.PI, false);
  ctx.fillStyle = color;
  ctx.fill();
}

function drawTig(ctx, x, y, radius, angle, size) {
  var startPoint = getCirclePoint(x, y, radius - 4, angle),
      endPoint = getCirclePoint(x, y, radius - size, angle)
  
  ctx.beginPath();
  ctx.lineCap = 'round';
  ctx.moveTo(startPoint.x, startPoint.y);
  ctx.lineTo(endPoint.x, endPoint.y);
  ctx.stroke();
}

function getCirclePoint(x, y, radius, angle) {
    var radian = (angle / 180) * Math.PI;
  
    return {
      x: x + radius * Math.cos(radian),
      y: y + radius * Math.sin(radian)
    }
}

function calcMovement() {
  var move = Game.state.speed * 0.01,
      newCurve = 0;
  
  if(Game.state.keypress.up) {
    Game.state.speed += Game.state.car.acc - (Game.state.speed * 0.015);
  } else if (Game.state.speed > 0) {
    Game.state.speed -= Game.state.car.friction;
  }
  
  if(Game.state.keypress.down && Game.state.speed > 0) {
    Game.state.speed -= 1;
  }
  
  // Left and right
  Game.state.xpos -= (Game.state.currentCurve * Game.state.speed) * 0.005;
  
  if(Game.state.speed) {
    if(Game.state.keypress.left) {
      Game.state.xpos += (Math.abs(Game.state.turn) + 7 + (Game.state.speed > Game.state.car.maxSpeed / 4 ? (Game.state.car.maxSpeed - (Game.state.speed / 2)) : Game.state.speed)) * 0.2;
      Game.state.turn -= 1;
    }
  
    if(Game.state.keypress.right) {
      Game.state.xpos -= (Math.abs(Game.state.turn) + 7 + (Game.state.speed > Game.state.car.maxSpeed / 4 ? (Game.state.car.maxSpeed - (Game.state.speed / 2)) : Game.state.speed)) * 0.2;
      Game.state.turn += 1;
    }
    
    if(Game.state.turn !== 0 && !Game.state.keypress.left && !Game.state.keypress.right) {
      Game.state.turn += Game.state.turn > 0 ? -0.25 : 0.25;
    }
  }
  
  Game.state.turn = clamp(Game.state.turn, -5, 5);
  Game.state.speed = clamp(Game.state.speed, 0, Game.state.car.maxSpeed);
  
  // section
  Game.state.section -= Game.state.speed;
  
  if(Game.state.section < 0) {
    Game.state.section = randomRange(1000, 9000);
    
    newCurve = randomRange(-50, 50);
    
    if(Math.abs(Game.state.curve - newCurve) < 20) {
      newCurve = randomRange(-50, 50);
    }
    
    Game.state.curve = newCurve;
  }
  
  if(Game.state.currentCurve < Game.state.curve && move < Math.abs(Game.state.currentCurve - Game.state.curve)) {
    Game.state.currentCurve += move;
  } else if(Game.state.currentCurve > Game.state.curve && move < Math.abs(Game.state.currentCurve - Game.state.curve)) {
    Game.state.currentCurve -= move;
  }
  
  if(Math.abs(Game.state.xpos) > 550) {
    Game.state.speed *= 0.96;
  }
  
  Game.state.xpos = clamp(Game.state.xpos, -650, 650);
}

function keyUp(e) {
    move(e, false);
}

function keyDown(e) {
    move(e, true);
}

function move(e, isKeyDown) {
  if(e.keyCode >= 37 && e.keyCode <= 40) {
    e.preventDefault();
  }

  if(e.keyCode === 37) {
    Game.state.keypress.left = isKeyDown;
  } 

  if(e.keyCode === 38) {
    Game.state.keypress.up = isKeyDown;
  } 

  if(e.keyCode === 39) {
    Game.state.keypress.right = isKeyDown;
  } 

  if(e.keyCode === 40) {
    Game.state.keypress.down = isKeyDown;
  }
}

// D474designs | Add button functionality ///////
$('#left').mousedown(function(isKeyDown){
  Game.state.keypress.left = isKeyDown;
  Game.state.keypress.up = isKeyDown;
  Game.state.keypress.right = !isKeyDown;
});
$('#right').mousedown(function(isKeyDown){
  Game.state.keypress.right = isKeyDown;
  Game.state.keypress.up = isKeyDown;
  Game.state.keypress.left = !isKeyDown;
});
$(document).mouseup(function(isKeyDown){
  Game.state.keypress.up = !isKeyDown;
});
$('#gas').mousedown(function(isKeyDown){
  Game.state.keypress.up = isKeyDown;
  Game.state.keypress.down = !isKeyDown;
});
$(document).mouseup(function(isKeyDown){
  Game.state.keypress.up = !isKeyDown;
});
$('#brake').mousedown(function(isKeyDown){
  Game.state.keypress.down = isKeyDown;
  Game.state.keypress.up = !isKeyDown;
  Game.state.keypress.left = !isKeyDown;
  Game.state.keypress.right = !isKeyDown;
});
$(document).mouseup(function(isKeyDown){
  Game.state.keypress.down = !isKeyDown;
});

$("#left").on( "touchstart", function(isKeyDown) {
  Game.state.keypress.left = isKeyDown;
  Game.state.keypress.up = isKeyDown;
}).on("touchend", function(isKeyDown) {
  Game.state.keypress.left = !isKeyDown;
  Game.state.keypress.up = !isKeyDown;
});
$("#right").on( "touchstart", function(isKeyDown) {
  Game.state.keypress.right = isKeyDown;
  Game.state.keypress.up = isKeyDown;
}).on("touchend", function(isKeyDown) {
  Game.state.keypress.right = !isKeyDown;
  Game.state.keypress.up = !isKeyDown;
});
$("#gas").on( "touchstart", function(isKeyDown) {
  Game.state.keypress.up = isKeyDown;
  Game.state.keypress.down = !isKeyDown;
}).on("touchend", function(isKeyDown) {
  Game.state.keypress.up = !isKeyDown;
});
$("#brake").on( "touchstart", function(isKeyDown) {
  Game.state.keypress.down = isKeyDown;
  Game.state.keypress.up = !isKeyDown;
  Game.state.keypress.left = !isKeyDown;
  Game.state.keypress.right = !isKeyDown;
}).on("touchend", function(isKeyDown) {
  Game.state.keypress.down = !isKeyDown;
});

function randomRange(min, max) {
  return min + Math.random() * (max - min);
}

function norm(value, min, max) {
  return (value - min) / (max - min);
}

function lerp(norm, min, max) {
  return (max - min) * norm + min;
}

function map(value, sourceMin, sourceMax, destMin, destMax) {
  return lerp(norm(value, sourceMin, sourceMax), destMin, destMax);
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function drawBg() {
  Game.ctx.fillStyle = Game.colors.sky;
  Game.ctx.fillRect(0, 0, Game.canvas.width, Game.settings.skySize);
  drawMountain(0, 60, 200);
  drawMountain(280, 40, 200);
  drawMountain(400, 80, 200);
  drawMountain(550, 60, 200);
  
  Game.storage.bg = Game.ctx.getImageData(0, 0, Game.canvas.width, Game.canvas.height);
}

function drawMountain(pos, height, width) {
  Game.ctx.fillStyle = Game.colors.mountains;
  Game.ctx.strokeStyle = Game.colors.mountains;
  Game.ctx.lineJoin = "round";
  Game.ctx.lineWidth = 20;
  Game.ctx.beginPath();
  Game.ctx.moveTo(pos, Game.settings.skySize);
  Game.ctx.lineTo(pos + (width / 2), Game.settings.skySize - height);
  Game.ctx.lineTo(pos + width, Game.settings.skySize);
  Game.ctx.closePath();
  Game.ctx.stroke();
  Game.ctx.fill();
}

function drawSky() {
  Game.ctx.fillStyle = Game.colors.sky;
  Game.ctx.fillRect(0, 0, Game.canvas.width, Game.settings.skySize);
}

function drawRoad(min, max, squishFactor, color) {
  var basePos = Game.canvas.width + Game.state.xpos;
  
  Game.ctx.fillStyle = color;
  Game.ctx.beginPath();
  Game.ctx.moveTo(((basePos + min) / 2) - (Game.state.currentCurve * 3), Game.settings.skySize);
  Game.ctx.quadraticCurveTo((((basePos / 2) + min)) + (Game.state.currentCurve / 3) + squishFactor, Game.settings.skySize + 52, (basePos + max) / 2, Game.canvas.height);
  Game.ctx.lineTo((basePos - max) / 2, Game.canvas.height);
  Game.ctx.quadraticCurveTo((((basePos / 2) - min)) + (Game.state.currentCurve / 3) - squishFactor, Game.settings.skySize + 52, ((basePos - min) / 2) - (Game.state.currentCurve * 3), Game.settings.skySize);
  Game.ctx.closePath();
  Game.ctx.fill();
}

function drawCar() {
  var carWidth = 160,
      carHeight = 50,
      carX = (Game.canvas.width / 2) - (carWidth / 2),
      carY = 320;
  
  // shadow
  roundedRect(Game.ctx, "rgba(0, 0, 0, 0.35)", carX - 1 + Game.state.turn, carY + (carHeight - 35), carWidth + 10, carHeight, 9);
  
  // tires
  roundedRect(Game.ctx, "#111", carX, carY + (carHeight - 30), 30, 40, 6);
  roundedRect(Game.ctx, "#111", (carX - 22) + carWidth, carY + (carHeight - 30), 30, 40, 6);
  
  drawCarBody(Game.ctx);
}

function drawCarBody(ctx) {
  var startX = 299, startY = 311,
      lights = [10, 26, 134, 152],
      lightsY = 0;
  
  /* Front */
  roundedRect(Game.ctx, "#C2C2C2", startX + 6 + (Game.state.turn * 1.1), startY - 18, 146, 40, 18);
  
  ctx.beginPath(); 
  ctx.lineWidth="12";
  ctx.fillStyle="#FFFFFF";
  ctx.strokeStyle="#FFFFFF";
  ctx.moveTo(startX + 30, startY);
  ctx.lineTo(startX + 46 + Game.state.turn, startY - 25);
  ctx.lineTo(startX + 114 + Game.state.turn, startY - 25);
  ctx.lineTo(startX + 130, startY);
  ctx.fill();
  ctx.stroke();
  /* END: Front */
  
  ctx.lineWidth="12";
  ctx.lineCap = 'round';
  ctx.beginPath(); 
  ctx.fillStyle="#DEE0E2";
  ctx.strokeStyle="#DEE0E2";
  ctx.moveTo(startX + 2, startY + 12 + (Game.state.turn * 0.2));
  ctx.lineTo(startX + 159, startY + 12 + (Game.state.turn * 0.2));
  ctx.quadraticCurveTo(startX + 166, startY + 35, startX + 159, startY + 55 + (Game.state.turn * 0.2));
  ctx.lineTo(startX + 2, startY + 55 - (Game.state.turn * 0.2));
  ctx.quadraticCurveTo(startX - 5, startY + 32, startX + 2, startY + 12 - (Game.state.turn * 0.2));
  ctx.fill();
  ctx.stroke();

  ctx.beginPath(); 
  ctx.lineWidth="12";
  ctx.fillStyle="#DEE0E2";
  ctx.strokeStyle="#DEE0E2";
  ctx.moveTo(startX + 30, startY);
  ctx.lineTo(startX + 40 + (Game.state.turn * 0.7), startY - 15);
  ctx.lineTo(startX + 120 + (Game.state.turn * 0.7), startY - 15);
  ctx.lineTo(startX + 130, startY);
  ctx.fill();
  ctx.stroke();
  
  roundedRect(ctx, "#474747", startX - 4, startY, 169, 10, 3, true, 0.2);
  roundedRect(ctx, "#474747", startX + 40, startY + 5, 80, 10, 5, true, 0.1);
  
  ctx.fillStyle = "#FF9166";
  
  lights.forEach(function(xPos) {
    ctx.beginPath();
    ctx.arc(startX + xPos, startY + 20 + lightsY, 6, 0, Math.PI*2, true); 
    ctx.closePath();
    ctx.fill();
    lightsY += Game.state.turn * 0.05;
  });
  
  ctx.lineWidth="9";
  ctx.fillStyle="#222222";
  ctx.strokeStyle="#444";
  
  roundedRect(Game.ctx, "#FFF", startX + 60, startY + 25, 40, 18, 3, true, 0.05);
}

function roundedRect(ctx, color, x, y, width, height, radius, turn, turneffect) {
  var skew = turn === true ? Game.state.turn * turneffect : 0;
  
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(x + radius, y - skew);
  
  // top right
  ctx.lineTo(x + width - radius, y + skew);
  ctx.arcTo(x + width, y + skew, x + width, y + radius + skew, radius);
  ctx.lineTo(x + width, y + radius + skew);
  
  // down right
  ctx.lineTo(x + width, (y + height + skew) - radius);
  ctx.arcTo(x + width, y + height + skew, (x + width) - radius, y + height + skew, radius);
  ctx.lineTo((x + width) - radius, y + height + skew);
  
  // down left
  ctx.lineTo(x + radius, y + height - skew);
  ctx.arcTo(x, y + height - skew, x, (y + height - skew) - radius, radius);
  ctx.lineTo(x, (y + height - skew) - radius);
  
  // top left
  ctx.lineTo(x, y + radius - skew);
  ctx.arcTo(x, y - skew, x + radius, y - skew, radius);
  ctx.lineTo(x + radius, y - skew);
  ctx.fill();
}

function drawGround(ctx, offset, lightColor, darkColor, width) {
  var pos = (Game.settings.skySize - Game.settings.ground.min) + offset, stepSize = 1, drawDark = Game.state.startDark, firstRow = true;
  ctx.fillStyle = lightColor;
  ctx.fillRect(0, Game.settings.skySize, width, Game.settings.ground.size);

  ctx.fillStyle =  darkColor;
  while(pos <= Game.canvas.height) {
    stepSize = norm(pos, Game.settings.skySize, Game.canvas.height) * Game.settings.ground.max;
    if(stepSize < Game.settings.ground.min) {
      stepSize = Game.settings.ground.min;
    }
  
    if(drawDark) {
      if(firstRow) {
        ctx.fillRect(0, Game.settings.skySize, width, stepSize - (offset > Game.settings.ground.min ? Game.settings.ground.min : Game.settings.ground.min - offset));
      } else {
        ctx.fillRect(0, pos < Game.settings.skySize ? Game.settings.skySize : pos, width, stepSize);
      }
    }
    
    firstRow = false;
    pos += stepSize;
    drawDark = !drawDark;
  }
}