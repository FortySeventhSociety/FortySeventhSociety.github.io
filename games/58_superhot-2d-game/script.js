(function() {
  //---------------------------------------------------
  // VARIABLES
  //---------------------------------------------------
  var Bullet, Enemy, Player, bulletEnemyHandler, bullet_time, bullets, bullets_count, checkInput, controls, create, currentHorizontalDirection, currentVerticalDirection, drawShape, enemies, enemies_bullets, enemies_count, game, gameOver, killEnemy, max_delay, min_delay, motion, motionUpdate, motion_timer, moveBullets, moveEnemies, movePlayer, nextLevel, player, playerEnemyHandler, preload, render, resetGame, score, score_text, slowDownTime, spawnText, speed, speedUpTime, text, time, update, updateMotion, updateScore;

  player = null;

  bullets = null;

  bullets_count = 3;

  bullet_time = 0;

  enemies = null;

  enemies_count = 0;

  enemies_bullets = null;

  time = 0;

  speed = 10;

  motion = 0;

  motion_timer = null;

  max_delay = 60;

  min_delay = 1;

  text = null;

  score = 0;

  score_text = null;

  controls = [];

  currentVerticalDirection = false;

  currentHorizontalDirection = false;

  // preview = new PreviewImage("https://s3-us-west-2.amazonaws.com/s.cdpn.io/150586/superhot2d.png") #PREVIEW IMAGE

  //---------------------------------------------------
  // GAME CLASS
  //---------------------------------------------------

  //PRELOAD STATE
  preload = function() {};

  // nothing to preload ¯\_(ツ)_/¯

  //CREATE STATE
  create = function() {
    
    //remove preview image
    // preview.clear()

    //set scale mode
    game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    game.scale.pageAlignVertically = true;
    game.scale.pageAlignHorizontally = true;
    
    //background color
    game.stage.backgroundColor = '#CCCCCC';
    
    //start physics engine
    game.physics.startSystem(Phaser.Physics.ARCADE);
    //input
    this.game.input.keyboard.addKeyCapture(Phaser.Keyboard.SPACEBAR);
    this.game.input.keyboard.addKeyCapture(Phaser.Keyboard.UP);
    this.game.input.keyboard.addKeyCapture(Phaser.Keyboard.DOWN);
    this.game.input.keyboard.addKeyCapture(Phaser.Keyboard.LEFT);
    this.game.input.keyboard.addKeyCapture(Phaser.Keyboard.RIGHT);
    controls = {
      "up": game.input.keyboard.addKey(Phaser.Keyboard.UP),
      "down": game.input.keyboard.addKey(Phaser.Keyboard.DOWN),
      "left": game.input.keyboard.addKey(Phaser.Keyboard.LEFT),
      "right": game.input.keyboard.addKey(Phaser.Keyboard.RIGHT)
    };
    //start the game
    return nextLevel();
  };

  //RESET THE GAME
  resetGame = function() {
    var bullet, enemy, i;
    
    //nuke everything
    game.world.removeAll();
    //score text
    score_text = game.add.text(game.world.width - 60, 10, score);
    score_text.align = 'right';
    score_text.font = 'Orbitron';
    score_text.fontSize = 40;
    score_text.fill = '#ff0000';
    
    //add player  
    player = new Player(game, game.rnd.integerInRange(100, game.world.width - 100), 500, drawShape(32, 32, '#FFFFFF'));
    
    //ada player's bullet group
    bullets = game.add.group();
    
    //add bullets to memory so we can throttle the shot 
    i = 0;
    while (i < bullets_count) {
      bullet = new Bullet(game, 0, 0, drawShape(10, 10, '#000000'));
      bullets.add(bullet);
      bullet.events.onOutOfBounds.add(bullet.kill, bullet);
      i++;
    }
    
    //add enemies and enemy bullets
    enemies = game.add.group();
    enemies_bullets = game.add.group();
    i = 0;
    while (i < enemies_count) {
      enemy = new Enemy(game, game.rnd.integerInRange(100, game.world.width - 100), game.rnd.integerInRange(50, 150), drawShape());
      enemies.add(enemy);
      i++;
    }
    
    //create a new timer. this timer will act as our motion timer that we'll use to update time and motion instead of the main game update loop
    return motion_timer = game.time.events.loop(60, motionUpdate, this);
  };

  
  //DRAW SHAPES
  drawShape = function(width = 64, height = 64, color = '#ff0000') {
    var bmd;
    bmd = game.add.bitmapData(width, height);
    bmd.ctx.beginPath();
    bmd.ctx.rect(0, 0, width, height);
    bmd.ctx.fillStyle = color;
    bmd.ctx.fill();
    return bmd;
  };

  
  //CHECK INPUT
  checkInput = function() {
    // change time on input
    if (controls.up.isDown || controls.down.isDown || controls.left.isDown || controls.right.isDown) {
      speedUpTime();
    } else {
      slowDownTime();
    }
    
    // determine what direction the player is moving
    if (controls.left.isDown) {
      currentHorizontalDirection = "left";
    } else if (controls.right.isDown) {
      currentHorizontalDirection = "right";
    } else {
      currentHorizontalDirection = false;
    }
    if (controls.up.isDown) {
      currentVerticalDirection = "up";
    } else if (controls.down.isDown) {
      currentVerticalDirection = "down";
    } else if (!currentHorizontalDirection) { // if nothing assume up
      currentVerticalDirection = "up";
    } else {
      currentVerticalDirection = false;
    }
    // fire!
    if (game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
      return player.fireBullet(currentHorizontalDirection, currentVerticalDirection);
    }
  };

// D474designs | Add button functionality ///////
$('#left').mousedown(function(){
  controls.left.isDown = true;
});
$('#right').mousedown(function(){
  controls.right.isDown = true;
});
$(document).mouseup(function(){
  controls.left.isDown = false;
  controls.right.isDown = false;
});
$('#up').mousedown(function(){
  controls.up.isDown = true;
});
$(document).mouseup(function(){
  controls.up.isDown = false;
});
$('#down').mousedown(function(){
  controls.down.isDown = true;
});
$(document).mouseup(function(){
  controls.down.isDown = false;
});

$('#shoot').mousedown(function(){
  return player.fireBullet(currentHorizontalDirection, currentVerticalDirection);
});

$("#left").on( "touchstart", function() {
  controls.left.isDown = true;
}).on("touchend", function(isKeyDown) {
  controls.left.isDown = false;
});
$("#right").on( "touchstart", function() {
  controls.right.isDown = true;
}).on("touchend", function(isKeyDown) {
  controls.right.isDown = false;
});
$("#up").on( "touchstart", function() {
  controls.up.isDown = true;
}).on("touchend", function(isKeyDown) {
  controls.up.isDown = false;
});
$("#down").on( "touchstart", function() {
  controls.down.isDown = true;
}).on("touchend", function(isKeyDown) {
  controls.down.isDown = false;
});

$("#shoot").on( "touchstart", function() {
  return player.fireBullet(currentHorizontalDirection, currentVerticalDirection);
})

  //MOVEMENT
  movePlayer = function() {
    return player.motionUpdate();
  };

  moveEnemies = function() {
    // Move the enemies towards the player at the rate of the game motion
    return enemies.forEachAlive(function(enemy) {
      return enemy.motionUpdate();
    });
  };

  moveBullets = function() {
    // player bullets
    bullets.forEachAlive(function(bullet) {
      return bullet.motionUpdate();
    });
    // enemy bullets
    return enemies_bullets.forEachAlive(function(bullet) {
      return bullet.motionUpdate();
    });
  };

  
  //COLLISION HANDLERS
  playerEnemyHandler = function(player, enemy) {
    //you dead. tint the player for a moment and then reset the game
    if (enemy.can_kill) {
      enemy.can_kill = false;
      player.tint = 0xff0000;
      return game.time.events.add(Phaser.Timer.SECOND * 0.2, function() {
        return gameOver();
      }, this);
    }
  };

  bulletEnemyHandler = function(bullet, enemy) {
    enemy.tint = 0x000000;
    bullet.kill();
    enemy.can_kill = false;
    updateScore(score += 1);
    return game.time.events.add(Phaser.Timer.SECOND * 0.2, function() {
      return killEnemy(enemy);
    }, this);
  };

  killEnemy = function(enemy) {
    enemy.kill();
    if (!enemies.getFirstAlive()) {
      return nextLevel();
    }
  };

  
  //MANIPULATE TIME
  speedUpTime = function() {
    if (motion_timer.delay > min_delay) {
      motion_timer.delay -= 2;
    } else {
      motion_timer.delay = min_delay;
    }
    return time = motion_timer.delay + speed;
  };

  slowDownTime = function() {
    if (motion_timer.delay < max_delay) {
      motion_timer.delay += 2;
    } else {
      motion_timer.delay = max_delay;
    }
    return time = motion_timer.delay - speed;
  };

  
  //UPDATE MOTION
  updateMotion = function() {
    // always keep some motion and factor it by the time
    return motion = (100 - (time * 2)) + speed;
  };

  
  //GAME OVER
  gameOver = function() {
    enemies_count = 1;
    updateScore(0);
    resetGame();
    spawnText("GAME");
    return game.time.events.add(Phaser.Timer.SECOND * 0.5, function() {
      return spawnText("OVER");
    }, this);
  };

  
  //NEXT LEVEL  
  nextLevel = function() {
    // increase enemies and reset the game
    enemies_count++;
    resetGame();
    spawnText("SUPER");
    return game.time.events.add(Phaser.Timer.SECOND * 0.5, function() {
      return spawnText("HOT");
    }, this);
  };

  
  //SPAWN TEXT
  spawnText = function(text = false, lifespan = 0.5) {
    if (text) {
      text = game.add.text(game.world.centerX, game.world.centerY, text);
      text.anchor.set(0.5);
      text.align = 'center';
      text.font = 'Orbitron';
      text.fontSize = 150;
      text.fill = '#ff0000';
      return game.time.events.add(Phaser.Timer.SECOND * lifespan, function() {
        return text.kill();
      }, this);
    }
  };

  //MANAGE SCORE
  updateScore = function(points) {
    score = points;
    return score_text.text = score;
  };

  
  //MOTION UPDATE LOOP
  motionUpdate = function() {
    updateMotion();
    movePlayer();
    moveEnemies();
    return moveBullets();
  };

  
  //MAIN GAME UPDATE LOOP
  update = function() {
    checkInput();
    
    // player vs enemies
    game.physics.arcade.overlap(player, enemies, playerEnemyHandler, null, this);
    // enemy fire vs player
    game.physics.arcade.overlap(player, enemies_bullets, playerEnemyHandler, null, this);
    // bullets vs enemies
    game.physics.arcade.overlap(bullets, enemies, bulletEnemyHandler, null, this);
    // bullets vs bullets
    return game.physics.arcade.collide(bullets, enemies_bullets);
  };

  // enemies vs enemies
  // game.physics.arcade.collide(enemies)

  //RENDER / DEBUG
  render = function() {};

  //game.debug.text "Move with arrow keys. Shoot with spacebar.", 30, 40
  // game.debug.text "Clock Delay " + motion_timer.delay + " / Time " + time + " / Motion " + motion, 30, 65

  //---------------------------------------------------
  // Player CLASS
  //---------------------------------------------------
  Player = function(game, x, y, sprite) {
    Phaser.Sprite.call(this, game, x, y, sprite);
    game.physics.arcade.enable(this);
    this.game = game;
    this.anchor.set(0.5);
    this.checkWorldBounds = true;
    this.events.onOutOfBounds.add(this.reposition, this);
    this.body.drag.x = 1;
    this.body.drag.y = 1;
    return game.add.existing(this);
  };

  //EXTENDS SPRITE CLASS
  Player.prototype = Object.create(Phaser.Sprite.prototype);

  Player.prototype.constructor = Player;

  //PLAYER MOTION UPDATE LOOP
  Player.prototype.motionUpdate = function() {
    var speed_modifier;
    //player should move slightly faster than enemies
    speed_modifier = speed / 6;
    if (controls.up.isDown) {
      this.body.velocity.y = -motion * speed_modifier;
    } else if (controls.down.isDown) {
      this.body.velocity.y = motion * speed_modifier;
    }
    if (controls.left.isDown) {
      this.body.velocity.x = -motion * speed_modifier;
    } else if (controls.right.isDown) {
      this.body.velocity.x = motion * speed_modifier;
    }
    if (!controls.up.isDown && !controls.down.isDown && !controls.left.isDown && !controls.right.isDown) {
      if (this.body.velocity.x > 0) {
        this.body.velocity.x -= motion / 2;
      } else if (this.body.velocity.x < 0) {
        this.body.velocity.x += motion / 2;
      }
      if (this.body.velocity.y > 0) {
        return this.body.velocity.y -= motion / 2;
      } else if (this.body.velocity.y < 0) {
        return this.body.velocity.y += motion / 2;
      }
    }
  };

  Player.prototype.reposition = function() {
    if (this.x < 0) {
      return this.x = game.world.width;
    } else if (this.x > game.world.width) {
      return this.x = 0;
    } else if (this.y < 0) {
      return this.y = game.world.height;
    } else if (this.y > game.world.height) {
      return this.y = 0;
    }
  };

  Player.prototype.fireBullet = function(h = false, v = false) {
    var bullet;
    if (game.time.now > bullet_time) {
      bullet = bullets.getFirstExists(false);
      if (bullet) {
        bullet.reset(this.x, this.y);
        bullet.h = h;
        bullet.v = v;
        bullet.mass = 1;
        return bullet_time = game.time.now + 150;
      }
    }
  };

  
  //---------------------------------------------------
  // BULLET CLASS
  //---------------------------------------------------
  Bullet = function(game, x, y, sprite, h = false, v = "up") {
    Phaser.Sprite.call(this, game, x, y, sprite);
    game.physics.arcade.enable(this);
    this.game = game;
    this.exists = false;
    this.visible = false;
    this.checkWorldBounds = true;
    this.angle = 45;
    this.anchor.set(0.5);
    this.mass = 0.2;
    this.can_kill = true;
    this.h = h;
    return this.v = v;
  };

  //EXTENDS SPRITE CLASS
  Bullet.prototype = Object.create(Phaser.Sprite.prototype);

  Bullet.prototype.constructor = Bullet;

  //BULLET MOTION UPDATE LOOP
  Bullet.prototype.motionUpdate = function() {
    var speed_modifier;
    
    //bullets should move faster than characters
    speed_modifier = speed / 2;
    switch (this.h) {
      case "left":
        this.body.velocity.x = -motion * speed_modifier;
        break;
      case "right":
        this.body.velocity.x = motion * speed_modifier;
    }
    switch (this.v) {
      case "up":
        return this.body.velocity.y = -motion * speed_modifier;
      case "down":
        return this.body.velocity.y = motion * speed_modifier;
    }
  };

  
  //---------------------------------------------------
  // ENEMY CLASS
  //---------------------------------------------------
  Enemy = function(game, x, y, sprite) {
    Phaser.Sprite.call(this, game, x, y, sprite);
    game.physics.arcade.enable(this);
    this.game = game;
    this.anchor.set(0.5);
    this.checkWorldBounds = true;
    this.events.onOutOfBounds.add(this.reposition, this);
    this.body.bounce.x = 1;
    this.body.bounce.y = 1;
    this.body.drag.x = 1;
    this.body.drag.y = 1;
    this.type = _.sample([1, 2, 3, 4, 5]);
    this.can_kill = true;
    return this.can_shoot = true;
  };

  //EXTENDS SPRITE CLASS
  Enemy.prototype = Object.create(Phaser.Sprite.prototype);

  Enemy.prototype.constructor = Enemy;

  //ENEMY MOTION UPDATE LOOP
  Enemy.prototype.motionUpdate = function() {
    
        // move enemy based on type
    switch (this.type) {
      case 1:
        // just move down
        this.body.velocity.y = motion;
        break;
      case 2:
        // just move left
        this.body.velocity.x = -motion;
        break;
      case 3:
        // just move right
        this.body.velocity.x = motion;
        break;
      default:
        //follow the player
        this.game.physics.arcade.moveToObject(this, player, motion);
    }
    
    // shoot to kill!
    if (this.can_shoot) {
      this.fireBullet();
      this.can_shoot = false;
      
      // randomly throttle firing
      return this.game.time.events.add(Phaser.Timer.SECOND * this.game.rnd.integerInRange(3, 10), function() {
        return this.can_shoot = true;
      }, this);
    }
  };

  Enemy.prototype.reposition = function() {
    if (this.x < 0) {
      return this.x = game.world.width;
    } else if (this.x > game.world.width) {
      return this.x = 0;
    } else if (this.y < 0) {
      return this.y = game.world.height;
    } else if (this.y > game.world.height) {
      return this.y = 0;
    }
  };

  Enemy.prototype.fireBullet = function() {
    var buffer, bullet, h, v;
    bullet = new Bullet(game, 0, 0, drawShape(10, 10, '#ff0000'));
    enemies_bullets.add(bullet);
    bullet.reset(this.x, this.y);
    // shoot towards the player
    buffer = 100;
    if (player.x < this.x - buffer) {
      h = "left";
    } else if (player.x > this.x + buffer) {
      h = "right";
    } else {
      h = false;
    }
    if (player.y < this.y - buffer) {
      v = "up";
    } else if (player.y > this.y + buffer) {
      v = "down";
    } else {
      v = false;
    }
    bullet.h = h;
    return bullet.v = v;
  };

  
  //---------------------------------------------------
  // INIT
  //---------------------------------------------------
  game = new Phaser.Game(900, 600, Phaser.AUTO, "game", {
    preload: preload,
    create: create,
    update: update,
    render: render
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiPGFub255bW91cz4iXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBRW9EO0VBQUE7OztBQUFBLE1BQUEsTUFBQSxFQUFBLEtBQUEsRUFBQSxNQUFBLEVBQUEsa0JBQUEsRUFBQSxXQUFBLEVBQUEsT0FBQSxFQUFBLGFBQUEsRUFBQSxVQUFBLEVBQUEsUUFBQSxFQUFBLE1BQUEsRUFBQSwwQkFBQSxFQUFBLHdCQUFBLEVBQUEsU0FBQSxFQUFBLE9BQUEsRUFBQSxlQUFBLEVBQUEsYUFBQSxFQUFBLElBQUEsRUFBQSxRQUFBLEVBQUEsU0FBQSxFQUFBLFNBQUEsRUFBQSxTQUFBLEVBQUEsTUFBQSxFQUFBLFlBQUEsRUFBQSxZQUFBLEVBQUEsV0FBQSxFQUFBLFdBQUEsRUFBQSxVQUFBLEVBQUEsU0FBQSxFQUFBLE1BQUEsRUFBQSxrQkFBQSxFQUFBLE9BQUEsRUFBQSxNQUFBLEVBQUEsU0FBQSxFQUFBLEtBQUEsRUFBQSxVQUFBLEVBQUEsWUFBQSxFQUFBLFNBQUEsRUFBQSxLQUFBLEVBQUEsV0FBQSxFQUFBLElBQUEsRUFBQSxJQUFBLEVBQUEsTUFBQSxFQUFBLFlBQUEsRUFBQTs7RUFDcEQsTUFBQSxHQUFTOztFQUNULE9BQUEsR0FBVTs7RUFDVixhQUFBLEdBQWdCOztFQUNoQixXQUFBLEdBQWM7O0VBQ2QsT0FBQSxHQUFVOztFQUNWLGFBQUEsR0FBZ0I7O0VBQ2hCLGVBQUEsR0FBa0I7O0VBQ2xCLElBQUEsR0FBTzs7RUFDUCxLQUFBLEdBQVE7O0VBQ1IsTUFBQSxHQUFTOztFQUNULFlBQUEsR0FBZTs7RUFDZixTQUFBLEdBQVk7O0VBQ1osU0FBQSxHQUFZOztFQUNaLElBQUEsR0FBTzs7RUFDUCxLQUFBLEdBQVE7O0VBQ1IsVUFBQSxHQUFhOztFQUNiLFFBQUEsR0FBVzs7RUFDWCx3QkFBQSxHQUEyQjs7RUFDM0IsMEJBQUEsR0FBNkIsTUFuQnVCOzs7Ozs7Ozs7RUEyQnBELE9BQUEsR0FBVSxRQUFBLENB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RUFBcUIsR0FBckIsRUFBMEIsTUFBTSxDQUFDLElBQWpDLEVBQXVDLE1BQXZDLEVBQ0w7SUFBQSxPQUFBLEVBQVMsT0FBVDtJQUNBLE1BQUEsRUFBUSxNQURSO0lBRUEsTUFBQSxFQUFRLE1BRlI7SUFHQSxNQUFBLEVBQVE7RUFIUixDQURLO0FBcGI2QyIsInNvdXJjZXNDb250ZW50IjpbIiMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiMgVkFSSUFCTEVTXG4jLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5wbGF5ZXIgPSBudWxsXG5idWxsZXRzID0gbnVsbFxuYnVsbGV0c19jb3VudCA9IDNcbmJ1bGxldF90aW1lID0gMFxuZW5lbWllcyA9IG51bGxcbmVuZW1pZXNfY291bnQgPSAwXG5lbmVtaWVzX2J1bGxldHMgPSBudWxsXG50aW1lID0gMFxuc3BlZWQgPSAxMFxubW90aW9uID0gMFxubW90aW9uX3RpbWVyID0gbnVsbFxubWF4X2RlbGF5ID0gNjBcbm1pbl9kZWxheSA9IDFcbnRleHQgPSBudWxsXG5zY29yZSA9IDBcbnNjb3JlX3RleHQgPSBudWxsXG5jb250cm9scyA9IFtdXG5jdXJyZW50VmVydGljYWxEaXJlY3Rpb24gPSBmYWxzZVxuY3VycmVudEhvcml6b250YWxEaXJlY3Rpb24gPSBmYWxzZVxuIyBwcmV2aWV3ID0gbmV3IFByZXZpZXdJbWFnZShcImh0dHBzOi8vczMtdXMtd2VzdC0yLmFtYXpvbmF3cy5jb20vcy5jZHBuLmlvLzE1MDU4Ni9zdXBlcmhvdDJkLnBuZ1wiKSAjUFJFVklFVyBJTUFHRVxuXG4jLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4jIEdBTUUgQ0xBU1NcbiMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuI1BSRUxPQUQgU1RBVEVcbnByZWxvYWQgPSAtPlxuICAjIG5vdGhpbmcgdG8gcHJlbG9hZCDCr1xcXyjjg4QpXy/Cr1xuICBcbiNDUkVBVEUgU1RBVEVcbmNyZWF0ZSA9IC0+XG4gIFxuICAjcmVtb3ZlIHByZXZpZXcgaW1hZ2VcbiAgIyBwcmV2aWV3LmNsZWFyKClcbiAgXG4gICNzZXQgc2NhbGUgbW9kZVxuICBnYW1lLnNjYWxlLnNjYWxlTW9kZSA9IFBoYXNlci5TY2FsZU1hbmFnZXIuU0hPV19BTExcbiAgZ2FtZS5zY2FsZS5wYWdlQWxpZ25WZXJ0aWNhbGx5ID0gdHJ1ZVxuICBnYW1lLnNjYWxlLnBhZ2VBbGlnbkhvcml6b250YWxseSA9IHRydWVcbiAgXG4gICNiYWNrZ3JvdW5kIGNvbG9yXG4gIGdhbWUuc3RhZ2UuYmFja2dyb3VuZENvbG9yID0gJyNDQ0NDQ0MnXG4gIFxuICAjc3RhcnQgcGh5c2ljcyBlbmdpbmVcbiAgZ2FtZS5waHlzaWNzLnN0YXJ0U3lzdGVtKFBoYXNlci5QaHlzaWNzLkFSQ0FERSlcblxuICAjaW5wdXRcbiAgdGhpcy5nYW1lLmlucHV0LmtleWJvYXJkLmFkZEtleUNhcHR1cmUoUGhhc2VyLktleWJvYXJkLlNQQUNFQkFSKVxuICB0aGlzLmdhbWUuaW5wdXQua2V5Ym9hcmQuYWRkS2V5Q2FwdHVyZShQaGFzZXIuS2V5Ym9hcmQuVVApXG4gIHRoaXMuZ2FtZS5pbnB1dC5rZXlib2FyZC5hZGRLZXlDYXB0dXJlKFBoYXNlci5LZXlib2FyZC5ET1dOKVxuICB0aGlzLmdhbWUuaW5wdXQua2V5Ym9hcmQuYWRkS2V5Q2FwdHVyZShQaGFzZXIuS2V5Ym9hcmQuTEVGVClcbiAgdGhpcy5nYW1lLmlucHV0LmtleWJvYXJkLmFkZEtleUNhcHR1cmUoUGhhc2VyLktleWJvYXJkLlJJR0hUKVxuICBcbiAgY29udHJvbHMgPSBcbiAgICBcInVwXCI6IGdhbWUuaW5wdXQua2V5Ym9hcmQuYWRkS2V5KFBoYXNlci5LZXlib2FyZC5VUClcbiAgICBcImRvd25cIjogZ2FtZS5pbnB1dC5rZXlib2FyZC5hZGRLZXkoUGhhc2VyLktleWJvYXJkLkRPV04pXG4gICAgXCJsZWZ0XCI6IGdhbWUuaW5wdXQua2V5Ym9hcmQuYWRkS2V5KFBoYXNlci5LZXlib2FyZC5MRUZUKVxuICAgIFwicmlnaHRcIjogZ2FtZS5pbnB1dC5rZXlib2FyZC5hZGRLZXkoUGhhc2VyLktleWJvYXJkLlJJR0hUKVxuXG4gICNzdGFydCB0aGUgZ2FtZVxuICBuZXh0TGV2ZWwoKVxuXG4jUkVTRVQgVEhFIEdBTUVcbnJlc2V0R2FtZSA9IC0+XG4gIFxuICAjbnVrZSBldmVyeXRoaW5nXG4gIGdhbWUud29ybGQucmVtb3ZlQWxsKClcblxuICAjc2NvcmUgdGV4dFxuICBzY29yZV90ZXh0ID0gZ2FtZS5hZGQudGV4dChnYW1lLndvcmxkLndpZHRoIC0gNjAsIDEwLCBzY29yZSlcbiAgc2NvcmVfdGV4dC5hbGlnbiA9ICdyaWdodCdcbiAgc2NvcmVfdGV4dC5mb250ID0gJ09yYml0cm9uJ1xuICBzY29yZV90ZXh0LmZvbnRTaXplID0gNDBcbiAgc2NvcmVfdGV4dC5maWxsID0gJyNmZjAwMDAnXG4gIFxuICAjYWRkIHBsYXllciAgXG4gIHBsYXllciA9IG5ldyBQbGF5ZXIgZ2FtZSwgZ2FtZS5ybmQuaW50ZWdlckluUmFuZ2UoMTAwLCBnYW1lLndvcmxkLndpZHRoIC0gMTAwKSwgNTAwLCBkcmF3U2hhcGUoMzIsMzIsJyNGRkZGRkYnKVxuICBcbiAgI2FkYSBwbGF5ZXIncyBidWxsZXQgZ3JvdXBcbiAgYnVsbGV0cyA9IGdhbWUuYWRkLmdyb3VwKClcbiAgXG4gICNhZGQgYnVsbGV0cyB0byBtZW1vcnkgc28gd2UgY2FuIHRocm90dGxlIHRoZSBzaG90IFxuICBpID0gMFxuICB3aGlsZSBpIDwgYnVsbGV0c19jb3VudFxuICAgIGJ1bGxldCA9IG5ldyBCdWxsZXQgZ2FtZSwgMCwgMCwgZHJhd1NoYXBlKDEwLCAxMCwgJyMwMDAwMDAnKVxuICAgIGJ1bGxldHMuYWRkIGJ1bGxldCBcbiAgICBidWxsZXQuZXZlbnRzLm9uT3V0T2ZCb3VuZHMuYWRkIGJ1bGxldC5raWxsLCBidWxsZXRcbiAgICBpKytcbiBcbiAgI2FkZCBlbmVtaWVzIGFuZCBlbmVteSBidWxsZXRzXG4gIGVuZW1pZXMgPSBnYW1lLmFkZC5ncm91cCgpXG4gIGVuZW1pZXNfYnVsbGV0cyA9IGdhbWUuYWRkLmdyb3VwKClcbiAgXG4gIGkgPSAwXG4gIHdoaWxlIGkgPCBlbmVtaWVzX2NvdW50XG4gICAgZW5lbXkgPSBuZXcgRW5lbXkgZ2FtZSwgZ2FtZS5ybmQuaW50ZWdlckluUmFuZ2UoMTAwLCBnYW1lLndvcmxkLndpZHRoIC0gMTAwKSwgZ2FtZS5ybmQuaW50ZWdlckluUmFuZ2UoNTAsIDE1MCksIGRyYXdTaGFwZSgpXG4gICAgZW5lbWllcy5hZGQgZW5lbXlcbiAgICBpKytcbiAgICBcbiAgI2NyZWF0ZSBhIG5ldyB0aW1lci4gdGhpcyB0aW1lciB3aWxsIGFjdCBhcyBvdXIgbW90aW9uIHRpbWVyIHRoYXQgd2UnbGwgdXNlIHRvIHVwZGF0ZSB0aW1lIGFuZCBtb3Rpb24gaW5zdGVhZCBvZiB0aGUgbWFpbiBnYW1lIHVwZGF0ZSBsb29wXG4gIG1vdGlvbl90aW1lciA9IGdhbWUudGltZS5ldmVudHMubG9vcCg2MCwgbW90aW9uVXBkYXRlLCB0aGlzKVxuICBcbiNEUkFXIFNIQVBFU1xuZHJhd1NoYXBlID0gKHdpZHRoPTY0LCBoZWlnaHQ9NjQsIGNvbG9yPScjZmYwMDAwJyktPlxuICBibWQgPSBnYW1lLmFkZC5iaXRtYXBEYXRhKHdpZHRoLCBoZWlnaHQpXG4gIGJtZC5jdHguYmVnaW5QYXRoKClcbiAgYm1kLmN0eC5yZWN0IDAsIDAsIHdpZHRoLCBoZWlnaHRcbiAgYm1kLmN0eC5maWxsU3R5bGUgPSBjb2xvclxuICBibWQuY3R4LmZpbGwoKVxuICByZXR1cm4gYm1kXG4gIFxuI0NIRUNLIElOUFVUXG5jaGVja0lucHV0ID0gLT5cbiAgIyBjaGFuZ2UgdGltZSBvbiBpbnB1dFxuICBpZiBjb250cm9scy51cC5pc0Rvd24gb3IgY29udHJvbHMuZG93bi5pc0Rvd24gb3IgY29udHJvbHMubGVmdC5pc0Rvd24gb3IgY29udHJvbHMucmlnaHQuaXNEb3duXG4gICAgc3BlZWRVcFRpbWUoKVxuICBlbHNlXG4gICAgc2xvd0Rvd25UaW1lKClcbiAgICBcbiAgIyBkZXRlcm1pbmUgd2hhdCBkaXJlY3Rpb24gdGhlIHBsYXllciBpcyBtb3ZpbmdcbiAgaWYgY29udHJvbHMubGVmdC5pc0Rvd25cbiAgICBjdXJyZW50SG9yaXpvbnRhbERpcmVjdGlvbiA9IFwibGVmdFwiXG4gIGVsc2UgaWYgY29udHJvbHMucmlnaHQuaXNEb3duXG4gICAgY3VycmVudEhvcml6b250YWxEaXJlY3Rpb24gPSBcInJpZ2h0XCJcbiAgZWxzZVxuICAgIGN1cnJlbnRIb3Jpem9udGFsRGlyZWN0aW9uID0gZmFsc2VcbiAgICBcbiAgaWYgY29udHJvbHMudXAuaXNEb3duXG4gICAgY3VycmVudFZlcnRpY2FsRGlyZWN0aW9uID0gXCJ1cFwiXG4gIGVsc2UgaWYgY29udHJvbHMuZG93bi5pc0Rvd25cbiAgICBjdXJyZW50VmVydGljYWxEaXJlY3Rpb24gPSBcImRvd25cIlxuICBlbHNlIGlmICFjdXJyZW50SG9yaXpvbnRhbERpcmVjdGlvbiAjIGlmIG5vdGhpbmcgYXNzdW1lIHVwXG4gICAgY3VycmVudFZlcnRpY2FsRGlyZWN0aW9uID0gXCJ1cFwiXG4gIGVsc2VcbiAgICBjdXJyZW50VmVydGljYWxEaXJlY3Rpb24gPSBmYWxzZVxuXG4gICMgZmlyZSFcbiAgaWYgZ2FtZS5pbnB1dC5rZXlib2FyZC5pc0Rvd24oUGhhc2VyLktleWJvYXJkLlNQQUNFQkFSKVxuICAgIHBsYXllci5maXJlQnVsbGV0KGN1cnJlbnRIb3Jpem9udGFsRGlyZWN0aW9uLCBjdXJyZW50VmVydGljYWxEaXJlY3Rpb24pXG5cbiNNT1ZFTUVOVFxubW92ZVBsYXllciA9IC0+XG4gIHBsYXllci5tb3Rpb25VcGRhdGUoKVxuICAgIFxubW92ZUVuZW1pZXMgPSAtPlxuICAjIE1vdmUgdGhlIGVuZW1pZXMgdG93YXJkcyB0aGUgcGxheWVyIGF0IHRoZSByYXRlIG9mIHRoZSBnYW1lIG1vdGlvblxuICBlbmVtaWVzLmZvckVhY2hBbGl2ZSAoZW5lbXkpIC0+ICBcbiAgICBlbmVteS5tb3Rpb25VcGRhdGUoKVxuICAgICAgXG5tb3ZlQnVsbGV0cyA9IC0+XG4gICMgcGxheWVyIGJ1bGxldHNcbiAgYnVsbGV0cy5mb3JFYWNoQWxpdmUgKGJ1bGxldCkgLT5cbiAgICBidWxsZXQubW90aW9uVXBkYXRlKClcblxuICAjIGVuZW15IGJ1bGxldHNcbiAgZW5lbWllc19idWxsZXRzLmZvckVhY2hBbGl2ZSAoYnVsbGV0KSAtPlxuICAgIGJ1bGxldC5tb3Rpb25VcGRhdGUoKVxuICAgIFxuI0NPTExJU0lPTiBIQU5ETEVSU1xucGxheWVyRW5lbXlIYW5kbGVyID0gKHBsYXllciwgZW5lbXkpLT5cbiAgI3lvdSBkZWFkLiB0aW50IHRoZSBwbGF5ZXIgZm9yIGEgbW9tZW50IGFuZCB0aGVuIHJlc2V0IHRoZSBnYW1lXG4gIGlmIGVuZW15LmNhbl9raWxsXG4gICAgZW5lbXkuY2FuX2tpbGwgPSBmYWxzZVxuICAgIHBsYXllci50aW50ID0gMHhmZjAwMDBcbiAgICBnYW1lLnRpbWUuZXZlbnRzLmFkZChQaGFzZXIuVGltZXIuU0VDT05EICogMC4yLCAtPlxuICAgICAgICBnYW1lT3ZlcigpXG4gICAgLCB0aGlzKVxuXG5idWxsZXRFbmVteUhhbmRsZXIgPSAoYnVsbGV0LCBlbmVteSktPlxuICBlbmVteS50aW50ID0gMHgwMDAwMDBcbiAgYnVsbGV0LmtpbGwoKVxuICBlbmVteS5jYW5fa2lsbCA9IGZhbHNlXG4gIHVwZGF0ZVNjb3JlIHNjb3JlKz0xXG4gIGdhbWUudGltZS5ldmVudHMuYWRkKFBoYXNlci5UaW1lci5TRUNPTkQgKiAwLjIsIC0+XG4gICAga2lsbEVuZW15KGVuZW15KVxuICAsIHRoaXMpXG4gIFxua2lsbEVuZW15ID0gKGVuZW15KS0+XG4gIGVuZW15LmtpbGwoKVxuICAjY2hlY2sgaWYgYWxsIGVuZW1pZXMgYXJlIGRlYWRcbiAgaWYgIWVuZW1pZXMuZ2V0Rmlyc3RBbGl2ZSgpXG4gICAgbmV4dExldmVsKCkgXG4gIFxuI01BTklQVUxBVEUgVElNRVxuc3BlZWRVcFRpbWUgPSAtPlxuICBpZiBtb3Rpb25fdGltZXIuZGVsYXkgPiBtaW5fZGVsYXlcbiAgICBtb3Rpb25fdGltZXIuZGVsYXkgLT0gMlxuICBlbHNlIFxuICAgIG1vdGlvbl90aW1lci5kZWxheSA9IG1pbl9kZWxheVxuICB0aW1lID0gbW90aW9uX3RpbWVyLmRlbGF5ICsgc3BlZWRcbiAgXG5zbG93RG93blRpbWUgPSAtPlxuICBpZiBtb3Rpb25fdGltZXIuZGVsYXkgPCBtYXhfZGVsYXlcbiAgICBtb3Rpb25fdGltZXIuZGVsYXkgKz0gMlxuICBlbHNlIFxuICAgIG1vdGlvbl90aW1lci5kZWxheSA9IG1heF9kZWxheVxuICB0aW1lID0gbW90aW9uX3RpbWVyLmRlbGF5IC0gc3BlZWRcbiAgIFxuI1VQREFURSBNT1RJT05cbnVwZGF0ZU1vdGlvbiA9IC0+XG4gICMgYWx3YXlzIGtlZXAgc29tZSBtb3Rpb24gYW5kIGZhY3RvciBpdCBieSB0aGUgdGltZVxuICBtb3Rpb24gPSAoMTAwIC0gKHRpbWUgKiAyKSkgKyBzcGVlZFxuICBcbiNHQU1FIE9WRVJcbmdhbWVPdmVyID0gLT5cbiAgZW5lbWllc19jb3VudCA9IDFcbiAgdXBkYXRlU2NvcmUgMFxuICByZXNldEdhbWUoKVxuICBzcGF3blRleHQgXCJHQU1FXCJcbiAgZ2FtZS50aW1lLmV2ZW50cy5hZGQoUGhhc2VyLlRpbWVyLlNFQ09ORCAqIDAuNSwgLT5cbiAgICBzcGF3blRleHQgXCJPVkVSXCJcbiAgLCB0aGlzKVxuICBcbiNORVhUIExFVkVMICBcbm5leHRMZXZlbCA9IC0+XG4gICMgaW5jcmVhc2UgZW5lbWllcyBhbmQgcmVzZXQgdGhlIGdhbWVcbiAgZW5lbWllc19jb3VudCsrXG4gIHJlc2V0R2FtZSgpXG4gIHNwYXduVGV4dCBcIlNVUEVSXCJcbiAgZ2FtZS50aW1lLmV2ZW50cy5hZGQoUGhhc2VyLlRpbWVyLlNFQ09ORCAqIDAuNSwgLT5cbiAgICBzcGF3blRleHQgXCJIT1RcIlxuICAsIHRoaXMpXG4gIFxuI1NQQVdOIFRFWFRcbnNwYXduVGV4dCA9ICh0ZXh0PWZhbHNlLCBsaWZlc3Bhbj0wLjUpLT5cbiAgaWYgdGV4dFxuICAgIHRleHQgPSBnYW1lLmFkZC50ZXh0KGdhbWUud29ybGQuY2VudGVyWCwgZ2FtZS53b3JsZC5jZW50ZXJZLCB0ZXh0KVxuICAgIHRleHQuYW5jaG9yLnNldCAwLjVcbiAgICB0ZXh0LmFsaWduID0gJ2NlbnRlcidcbiAgICB0ZXh0LmZvbnQgPSAnT3JiaXRyb24nXG4gICAgdGV4dC5mb250U2l6ZSA9IDE1MFxuICAgIHRleHQuZmlsbCA9ICcjZmYwMDAwJ1xuXG4gICAgZ2FtZS50aW1lLmV2ZW50cy5hZGQoUGhhc2VyLlRpbWVyLlNFQ09ORCAqIGxpZmVzcGFuLCAtPlxuICAgICAgdGV4dC5raWxsKClcbiAgICAsIHRoaXMpXG5cbiNNQU5BR0UgU0NPUkVcbnVwZGF0ZVNjb3JlID0gKHBvaW50cyktPlxuICBzY29yZSA9IHBvaW50c1xuICBzY29yZV90ZXh0LnRleHQgPSBzY29yZVxuICBcbiNNT1RJT04gVVBEQVRFIExPT1Bcbm1vdGlvblVwZGF0ZSA9IC0+XG4gIHVwZGF0ZU1vdGlvbigpXG4gIG1vdmVQbGF5ZXIoKVxuICBtb3ZlRW5lbWllcygpXG4gIG1vdmVCdWxsZXRzKClcbiAgXG4jTUFJTiBHQU1FIFVQREFURSBMT09QXG51cGRhdGUgPSAtPlxuICBjaGVja0lucHV0KClcbiAgXG4gICMgcGxheWVyIHZzIGVuZW1pZXNcbiAgZ2FtZS5waHlzaWNzLmFyY2FkZS5vdmVybGFwKHBsYXllciwgZW5lbWllcywgcGxheWVyRW5lbXlIYW5kbGVyLCBudWxsLCB0aGlzKVxuICAjIGVuZW15IGZpcmUgdnMgcGxheWVyXG4gIGdhbWUucGh5c2ljcy5hcmNhZGUub3ZlcmxhcChwbGF5ZXIsIGVuZW1pZXNfYnVsbGV0cywgcGxheWVyRW5lbXlIYW5kbGVyLCBudWxsLCB0aGlzKVxuICAjIGJ1bGxldHMgdnMgZW5lbWllc1xuICBnYW1lLnBoeXNpY3MuYXJjYWRlLm92ZXJsYXAoYnVsbGV0cywgZW5lbWllcywgYnVsbGV0RW5lbXlIYW5kbGVyLCBudWxsLCB0aGlzKVxuICAjIGJ1bGxldHMgdnMgYnVsbGV0c1xuICBnYW1lLnBoeXNpY3MuYXJjYWRlLmNvbGxpZGUoYnVsbGV0cywgZW5lbWllc19idWxsZXRzKVxuICAjIGVuZW1pZXMgdnMgZW5lbWllc1xuICAjIGdhbWUucGh5c2ljcy5hcmNhZGUuY29sbGlkZShlbmVtaWVzKVxuXG4jUkVOREVSIC8gREVCVUdcbnJlbmRlciA9IC0+XG4gICNnYW1lLmRlYnVnLnRleHQgXCJNb3ZlIHdpdGggYXJyb3cga2V5cy4gU2hvb3Qgd2l0aCBzcGFjZWJhci5cIiwgMzAsIDQwXG4gICMgZ2FtZS5kZWJ1Zy50ZXh0IFwiQ2xvY2sgRGVsYXkgXCIgKyBtb3Rpb25fdGltZXIuZGVsYXkgKyBcIiAvIFRpbWUgXCIgKyB0aW1lICsgXCIgLyBNb3Rpb24gXCIgKyBtb3Rpb24sIDMwLCA2NVxuXG4jLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4jIFBsYXllciBDTEFTU1xuIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuUGxheWVyID0gKGdhbWUsIHgsIHksIHNwcml0ZSktPlxuICBQaGFzZXIuU3ByaXRlLmNhbGwgQCwgZ2FtZSwgeCwgeSwgc3ByaXRlXG4gIGdhbWUucGh5c2ljcy5hcmNhZGUuZW5hYmxlIEBcbiAgQGdhbWUgPSBnYW1lXG4gIEBhbmNob3Iuc2V0IDAuNVxuICBAY2hlY2tXb3JsZEJvdW5kcyA9IHRydWVcbiAgQGV2ZW50cy5vbk91dE9mQm91bmRzLmFkZCBAcmVwb3NpdGlvbiwgQFxuICBAYm9keS5kcmFnLnggPSAxXG4gIEBib2R5LmRyYWcueSA9IDFcbiAgZ2FtZS5hZGQuZXhpc3RpbmcgQFxuXG4jRVhURU5EUyBTUFJJVEUgQ0xBU1NcblBsYXllci5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKFBoYXNlci5TcHJpdGUucHJvdG90eXBlKVxuUGxheWVyOjpjb25zdHJ1Y3RvciA9IFBsYXllclxuXG4jUExBWUVSIE1PVElPTiBVUERBVEUgTE9PUFxuUGxheWVyOjptb3Rpb25VcGRhdGUgPSAtPlxuICAjcGxheWVyIHNob3VsZCBtb3ZlIHNsaWdodGx5IGZhc3RlciB0aGFuIGVuZW1pZXNcbiAgc3BlZWRfbW9kaWZpZXIgPSBzcGVlZCAvIDZcbiAgaWYgY29udHJvbHMudXAuaXNEb3duXG4gICAgQGJvZHkudmVsb2NpdHkueSA9IC1tb3Rpb24gKiBzcGVlZF9tb2RpZmllclxuICBlbHNlIGlmIGNvbnRyb2xzLmRvd24uaXNEb3duXG4gICAgQGJvZHkudmVsb2NpdHkueSA9IG1vdGlvbiAqIHNwZWVkX21vZGlmaWVyIFxuICBpZiBjb250cm9scy5sZWZ0LmlzRG93blxuICAgIEBib2R5LnZlbG9jaXR5LnggPSAtbW90aW9uICogc3BlZWRfbW9kaWZpZXIgXG4gIGVsc2UgaWYgY29udHJvbHMucmlnaHQuaXNEb3duXG4gICAgQGJvZHkudmVsb2NpdHkueCA9IG1vdGlvbiAqIHNwZWVkX21vZGlmaWVyXG4gICAgXG4gICMgbGFjayBvZiBtb3ZlbWVudFxuICBpZiAhY29udHJvbHMudXAuaXNEb3duIGFuZCAhY29udHJvbHMuZG93bi5pc0Rvd24gYW5kICFjb250cm9scy5sZWZ0LmlzRG93biBhbmQgIWNvbnRyb2xzLnJpZ2h0LmlzRG93blxuICAgIGlmIEBib2R5LnZlbG9jaXR5LnggPiAwIHRoZW4gQGJvZHkudmVsb2NpdHkueCAtPSAobW90aW9uIC8gMilcbiAgICBlbHNlIGlmIEBib2R5LnZlbG9jaXR5LnggPCAwIHRoZW4gQGJvZHkudmVsb2NpdHkueCArPSAobW90aW9uIC8gMilcbiAgICBpZiBAYm9keS52ZWxvY2l0eS55ID4gMCB0aGVuIEBib2R5LnZlbG9jaXR5LnkgLT0gKG1vdGlvbiAvIDIpXG4gICAgZWxzZSBpZiBAYm9keS52ZWxvY2l0eS55IDwgMCB0aGVuIEBib2R5LnZlbG9jaXR5LnkgKz0gKG1vdGlvbiAvIDIpXG5cblBsYXllcjo6cmVwb3NpdGlvbiA9IC0+XG4gIGlmIEB4IDwgMCB0aGVuIEB4ID0gZ2FtZS53b3JsZC53aWR0aFxuICBlbHNlIGlmIEB4ID4gZ2FtZS53b3JsZC53aWR0aCB0aGVuIEB4ID0gMFxuICBlbHNlIGlmIEB5IDwgMCB0aGVuIEB5ID0gZ2FtZS53b3JsZC5oZWlnaHRcbiAgZWxzZSBpZiBAeSA+IGdhbWUud29ybGQuaGVpZ2h0IHRoZW4gQHkgPSAwXG4gIFxuUGxheWVyOjpmaXJlQnVsbGV0ID0gKGg9ZmFsc2UsIHY9ZmFsc2UpLT5cbiAgaWYgZ2FtZS50aW1lLm5vdyA+IGJ1bGxldF90aW1lXG4gICAgYnVsbGV0ID0gYnVsbGV0cy5nZXRGaXJzdEV4aXN0cyhmYWxzZSlcbiAgICBpZiBidWxsZXRcbiAgICAgIGJ1bGxldC5yZXNldCBAeCwgQHkgIFxuICAgICAgYnVsbGV0LmggPSBoXG4gICAgICBidWxsZXQudiA9IHZcbiAgICAgIGJ1bGxldC5tYXNzID0gMVxuICAgICAgYnVsbGV0X3RpbWUgPSBnYW1lLnRpbWUubm93ICsgMTUwXG4gIFxuIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuIyBCVUxMRVQgQ0xBU1NcbiMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbkJ1bGxldCA9IChnYW1lLCB4LCB5LCBzcHJpdGUsIGg9ZmFsc2UsIHY9XCJ1cFwiKS0+XG4gIFBoYXNlci5TcHJpdGUuY2FsbCBALCBnYW1lLCB4LCB5LCBzcHJpdGVcbiAgZ2FtZS5waHlzaWNzLmFyY2FkZS5lbmFibGUgQFxuICBAZ2FtZSA9IGdhbWVcbiAgQGV4aXN0cyA9IGZhbHNlXG4gIEB2aXNpYmxlID0gZmFsc2VcbiAgQGNoZWNrV29ybGRCb3VuZHMgPSB0cnVlXG4gIEBhbmdsZSA9IDQ1XG4gIEBhbmNob3Iuc2V0IDAuNVxuICBAbWFzcyA9IDAuMlxuICBAY2FuX2tpbGwgPSB0cnVlXG4gIEBoID0gaFxuICBAdiA9IHZcblxuI0VYVEVORFMgU1BSSVRFIENMQVNTXG5CdWxsZXQucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShQaGFzZXIuU3ByaXRlLnByb3RvdHlwZSlcbkJ1bGxldDo6Y29uc3RydWN0b3IgPSBCdWxsZXRcblxuI0JVTExFVCBNT1RJT04gVVBEQVRFIExPT1BcbkJ1bGxldDo6bW90aW9uVXBkYXRlID0gLT5cbiAgICAgXG4gICAgI2J1bGxldHMgc2hvdWxkIG1vdmUgZmFzdGVyIHRoYW4gY2hhcmFjdGVyc1xuICAgIHNwZWVkX21vZGlmaWVyID0gc3BlZWQgLyAyXG4gICAgc3dpdGNoIEBoXG4gICAgICB3aGVuIFwibGVmdFwiXG4gICAgICAgIEBib2R5LnZlbG9jaXR5LnggPSAtbW90aW9uICogc3BlZWRfbW9kaWZpZXIgXG4gICAgICB3aGVuIFwicmlnaHRcIlxuICAgICAgICBAYm9keS52ZWxvY2l0eS54ID0gbW90aW9uICogc3BlZWRfbW9kaWZpZXJcbiAgICAgICAgXG4gICAgc3dpdGNoIEB2XG4gICAgICB3aGVuIFwidXBcIlxuICAgICAgICBAYm9keS52ZWxvY2l0eS55ID0gLW1vdGlvbiAqIHNwZWVkX21vZGlmaWVyIFxuICAgICAgd2hlbiBcImRvd25cIlxuICAgICAgICBAYm9keS52ZWxvY2l0eS55ID0gbW90aW9uICogc3BlZWRfbW9kaWZpZXJcbiAgXG4jLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4jIEVORU1ZIENMQVNTXG4jLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5FbmVteSA9IChnYW1lLCB4LCB5LCBzcHJpdGUpLT5cbiAgUGhhc2VyLlNwcml0ZS5jYWxsIEAsIGdhbWUsIHgsIHksIHNwcml0ZVxuICBnYW1lLnBoeXNpY3MuYXJjYWRlLmVuYWJsZSBAXG4gIEBnYW1lID0gZ2FtZVxuICBAYW5jaG9yLnNldCAwLjVcbiAgQGNoZWNrV29ybGRCb3VuZHMgPSB0cnVlXG4gIEBldmVudHMub25PdXRPZkJvdW5kcy5hZGQgQHJlcG9zaXRpb24sIEBcbiAgQGJvZHkuYm91bmNlLnggPSAxXG4gIEBib2R5LmJvdW5jZS55ID0gMVxuICBAYm9keS5kcmFnLnggPSAxXG4gIEBib2R5LmRyYWcueSA9IDFcbiAgQHR5cGUgPSBfLnNhbXBsZShbMS4uLjZdKSAjIHJhbmRvbS4gc29tZSBlbmVtaWVzIHdpbGwgZm9sbG93IHRoZSBwbGF5ZXJzLCBvdGhlcnMganVzdCBtb3ZlIGFyb3VuZFxuICBAY2FuX2tpbGwgPSB0cnVlXG4gIEBjYW5fc2hvb3QgPSB0cnVlXG5cbiNFWFRFTkRTIFNQUklURSBDTEFTU1xuRW5lbXkucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShQaGFzZXIuU3ByaXRlLnByb3RvdHlwZSlcbkVuZW15Ojpjb25zdHJ1Y3RvciA9IEVuZW15XG5cbiNFTkVNWSBNT1RJT04gVVBEQVRFIExPT1BcbkVuZW15Ojptb3Rpb25VcGRhdGUgPSAtPlxuICBcbiAgIyBtb3ZlIGVuZW15IGJhc2VkIG9uIHR5cGVcbiAgc3dpdGNoIEB0eXBlXG4gICAgd2hlbiAxXG4gICAgICAjIGp1c3QgbW92ZSBkb3duXG4gICAgICBAYm9keS52ZWxvY2l0eS55ID0gbW90aW9uXG4gICAgd2hlbiAyXG4gICAgICAjIGp1c3QgbW92ZSBsZWZ0XG4gICAgICBAYm9keS52ZWxvY2l0eS54ID0gLW1vdGlvblxuICAgIHdoZW4gM1xuICAgICAgIyBqdXN0IG1vdmUgcmlnaHRcbiAgICAgIEBib2R5LnZlbG9jaXR5LnggPSBtb3Rpb25cbiAgICBlbHNlXG4gICAgICAjZm9sbG93IHRoZSBwbGF5ZXJcbiAgICAgIEBnYW1lLnBoeXNpY3MuYXJjYWRlLm1vdmVUb09iamVjdChALCBwbGF5ZXIsIG1vdGlvbilcbiAgICAgIFxuICAjIHNob290IHRvIGtpbGwhXG4gIGlmIEBjYW5fc2hvb3QgXG4gICAgQGZpcmVCdWxsZXQoKVxuICAgIEBjYW5fc2hvb3QgPSBmYWxzZVxuICAgIFxuICAgICMgcmFuZG9tbHkgdGhyb3R0bGUgZmlyaW5nXG4gICAgQGdhbWUudGltZS5ldmVudHMuYWRkKFBoYXNlci5UaW1lci5TRUNPTkQgKiBAZ2FtZS5ybmQuaW50ZWdlckluUmFuZ2UoMywgMTApLCAtPlxuICAgICAgQGNhbl9zaG9vdCA9IHRydWVcbiAgICAsIHRoaXMpXG4gICAgXG5FbmVteTo6cmVwb3NpdGlvbiA9IC0+XG4gIGlmIEB4IDwgMCB0aGVuIEB4ID0gZ2FtZS53b3JsZC53aWR0aFxuICBlbHNlIGlmIEB4ID4gZ2FtZS53b3JsZC53aWR0aCB0aGVuIEB4ID0gMFxuICBlbHNlIGlmIEB5IDwgMCB0aGVuIEB5ID0gZ2FtZS53b3JsZC5oZWlnaHRcbiAgZWxzZSBpZiBAeSA+IGdhbWUud29ybGQuaGVpZ2h0IHRoZW4gQHkgPSAwXG5cbkVuZW15OjpmaXJlQnVsbGV0ID0gLT5cbiAgYnVsbGV0ID0gbmV3IEJ1bGxldCBnYW1lLCAwLCAwLCBkcmF3U2hhcGUoMTAsIDEwLCAnI2ZmMDAwMCcpXG4gIGVuZW1pZXNfYnVsbGV0cy5hZGQgYnVsbGV0XG4gIGJ1bGxldC5yZXNldCBAeCwgQHlcbiAgIyBzaG9vdCB0b3dhcmRzIHRoZSBwbGF5ZXJcbiAgYnVmZmVyID0gMTAwXG4gIGlmIHBsYXllci54IDwgQHggLSBidWZmZXIgIHRoZW4gaCA9IFwibGVmdFwiXG4gIGVsc2UgaWYgcGxheWVyLnggPiBAeCArIGJ1ZmZlciB0aGVuIGggPSBcInJpZ2h0XCJcbiAgZWxzZSBoID0gZmFsc2VcbiAgaWYgcGxheWVyLnkgPCBAeSAtIGJ1ZmZlciB0aGVuIHYgPSBcInVwXCJcbiAgZWxzZSBpZiBwbGF5ZXIueSA+IEB5ICsgYnVmZmVyIHRoZW4gdiA9IFwiZG93blwiXG4gIGVsc2UgdiA9IGZhbHNlIFxuICBidWxsZXQuaCA9IGhcbiAgYnVsbGV0LnYgPSB2XG4gIFxuIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuIyBJTklUXG4jLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5nYW1lID0gbmV3IFBoYXNlci5HYW1lKDkwMCwgNjAwLCBQaGFzZXIuQVVUTywgXCJnYW1lXCIsXG4gIHByZWxvYWQ6IHByZWxvYWRcbiAgY3JlYXRlOiBjcmVhdGVcbiAgdXBkYXRlOiB1cGRhdGVcbiAgcmVuZGVyOiByZW5kZXJcbikiXX0=
//# sourceURL=coffeescript