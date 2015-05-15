var game = new Phaser.Game(256, 256, Phaser.AUTO, 'game', { preload: preload, create: create, update: update, render:render});

function preload() {
  game.load.tilemap('objects', 'assets/map1-1.json', null, Phaser.Tilemap.TILED_JSON);
  game.load.image('tiles', 'assets/items2.png');
  game.load.spritesheet('mario', 'assets/marioSmall.png', 34, 34, 7);
}

var map;
var layer;
var cursors;
var jumpButton;
var runButton;
var result;

var mario = {
  sprite: undefined,
  direction: 'right',
  doNothing: true
}

function create() {
  game.physics.startSystem(Phaser.Physics.ARCADE);
  game.stage.backgroundColor = '#5C94FC';

  map = game.add.tilemap('objects');
  map.addTilesetImage('items', 'tiles');
  layer = map.createLayer('Capa de Patrones 1');
  layer.resizeWorld();
  layer.wrap = true;
  map.setCollisionBetween(14, 16);
  map.setCollisionBetween(21, 22);
  map.setCollisionBetween(27, 28);
  map.setCollisionByIndex(10);
  map.setCollisionByIndex(13);
  map.setCollisionByIndex(17);
  map.setCollisionByIndex(40);

  //game.physics.p2.convertTilemap(map, layer);
  //game.physics.p2.gravity.y = 300;
  //game.physics.p2.friction = 5;

  mario.sprite = game.add.sprite(50, 50, 'mario');
  mario.sprite.scale.setTo(0.47, 0.47);
  mario.sprite.anchor.x=0.5;
  mario.sprite.anchor.y=0.5;
  mario.sprite.animations.add('walk');

  game.physics.enable(mario.sprite);
  game.physics.arcade.gravity.y = 700;
  mario.sprite.body.bounce.y = 0;
  mario.sprite.body.linearDamping = 1;
  mario.sprite.body.collideWorldBounds = true;
  //mario.sprite.body.acceleration.x = 120;

  mario.sprite.animations.add('left', [2,4,5], 10, true);
  mario.sprite.animations.add('wait', [0], 10, true);
  mario.sprite.animations.add('jump', [6], 10, true);
  
  mario.sprite.body.fixedRotation = true;
  //mario.sprite.body.onBeginContact.add(blockHit, this);
  
  game.camera.follow(mario.sprite);
  cursors = game.input.keyboard.createCursorKeys();
  jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
  runButton = game.input.keyboard.addKey(Phaser.Keyboard.SHIFT);
};


function update(){
  game.physics.arcade.collide(mario.sprite, layer);
  mario.doNothing = true;
  if (cursors.left.isDown){
    //mario.sprite.body.acceleration.x = -120;
    if(mario.direction!='left'){
      mario.sprite.scale.x *= -1;
      mario.direction = 'left';
    }
    if(mario.sprite.body.velocity.x==0 ||
      (mario.sprite.animations.currentAnim.name!='left' && mario.sprite.body.onFloor())){
      mario.sprite.animations.play('left', 10, true);
    }

    mario.sprite.body.velocity.x -= 5;
    if(runButton.isDown){
      if(mario.sprite.body.velocity.x<-200){
        mario.sprite.body.velocity.x = -200;
      }
    }else{
      if(mario.sprite.body.velocity.x<-120){
        mario.sprite.body.velocity.x = -120;
      }
    }
    mario.doNothing = false;
  }else if (cursors.right.isDown){
    if(mario.direction!='right'){
      mario.sprite.scale.x *= -1;
      mario.direction = 'right';
    }
    if(mario.sprite.body.velocity.x==0 ||
      (mario.sprite.animations.currentAnim.name!='left' && mario.sprite.body.onFloor())){
      mario.sprite.animations.play('left', 10, true);
    }
    mario.sprite.body.velocity.x += 5;
    if(runButton.isDown){
      if(mario.sprite.body.velocity.x>200){
        mario.sprite.body.velocity.x = 200;
      }
    }else{
      if(mario.sprite.body.velocity.x>120){
        mario.sprite.body.velocity.x = 120;
      }
    }
    mario.doNothing = false;
  }
  if (cursors.up.justDown){
    if(mario.sprite.body.onFloor()){
      mario.sprite.body.velocity.y = -310;
      mario.sprite.animations.play('jump', 20, true);
      mario.doNothing = false;
    }
  }
  if(mario.doNothing){
    if(mario.sprite.body.velocity.x>10){
      //mario.sprite.body.acceleration.x = 10;
      mario.sprite.body.velocity.x -= 10;
    }else if(mario.sprite.body.velocity.x<-10){
      //mario.sprite.body.acceleration.x = -10;
      mario.sprite.body.velocity.x += 10;
    }else{
      //mario.sprite.body.acceleration.x = 0;
      mario.sprite.body.velocity.x = 0;
    }
    if(mario.sprite.body.onFloor()){
      mario.sprite.animations.play('wait', 20, true);
    }
  }

}

function render() {
  game.debug.bodyInfo(mario.sprite, 32, 32);
}