//declaring global variables
var PLAY = 1;
var END = 0;
var gameState = PLAY;

var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var dieSound,jumpSound,checkpointSound

var score;
var gameover,gameoverImage,restart,restartImage;

function preload(){
  trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_collided = loadAnimation("trex_collided.png");
  
  groundImage = loadImage("ground2.png");
  
  cloudImage = loadImage("cloud.png");
  
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  
  gameoverImage = loadImage("gameOver.png")
  restartImage = loadImage("restart.png")
  
  dieSound=loadSound("die.mp3")
  jumpSound=loadSound("jump.mp3")
  checkpointSound=loadSound("checkPoint.mp3")
}

function setup() {
  createCanvas(600, 200);
  
  //making of trex sprite
  trex = createSprite(50,180,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided" , trex_collided)
  trex.scale = 0.5;
  
  //making ground sprite
  ground = createSprite(200,180,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  
  //making ground invisible for trex to make sure that trex touches the ground
  invisibleGround =            createSprite(200,190,400,10);
  invisibleGround.visible = false;
  
  //create Obstacle and Cloud Groups
  obstaclesGroup = createGroup();
  cloudsGroup = createGroup();
  
  
  //setting collider 
  trex.setCollider("circle",0,0,40);
  //trex.debug = true
  
  //making score , gameover,restart
  score = 0
  gameover=createSprite(300,100);
  gameover.addImage("gameOver",gameoverImage)
  gameover.scale=0.4
  restart=createSprite(300,120)
  restart.addImage("restart",restartImage)
  restart.scale=0.4
}

function draw() {
  background(180);
  
  
  
  //changing gamestate
  if(gameState === PLAY){
    gameover.visible=false
    restart.visible=false
    //move the ground
    ground.velocityX = -4;
    if(score>500){
     ground.velocityX=-(4+score/200)
   }
    //scoring
    score = score + Math.round(getFrameRate()/60);
    if(score>0 && score%100===0){
      checkpointSound.play();
    }
    
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
    
    //jump when the space key is pressed
    if(keyDown("space")&& trex.y >=161.5) {
        trex.velocityY = -15;
        jumpSound.play();
    }
    
    //add gravity
    trex.velocityY = trex.velocityY + 0.8
  
    //spawn the clouds
    spawnClouds();
  
    //spawn obstacles on the ground
    spawnObstacles();
    
    if(score > 700){
        background(60)
      }
    
    if(obstaclesGroup.isTouching(trex)){
        gameState = END;
        dieSound.play();
      
      
    }
  }
   else if(gameState === END) {
    gameover.visible=true
    restart.visible=true
    ground.velocityX = 0;
     
  //setting trex velocity for game's end
    trex.velocityY=0
    trex.changeAnimation("collided" , trex_collided)
     
  //giving velocity and lifetime to obstacle and clouds
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    obstaclesGroup.setLifetimeEach(-1)
    cloudsGroup.setLifetimeEach(-1)
     
    if(mousePressedOver(restart)){
      reset()
  }
     
   }
  
 
  //stop trex from falling down
  trex.collide(invisibleGround);
 
  drawSprites();
  //displaying score
  strokeWeight(4)
  stroke("white")
  text("Score: "+ score, 430,50);
}

//spawing obstacles 
function spawnObstacles(){
 if (frameCount % 80 === 0){
   var obstacle = createSprite(600,165,10,40);
   obstacle.velocityX = -4;
   if(score>500){
     obstacle.velocityX=-(4+score/200)
   }
   
    //generate random obstacles
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;
      default: break;
    }
   
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.5;
    obstacle.lifetime = -1;
   
   //add each obstacle to the group
    obstaclesGroup.add(obstacle);
 }
}

//spawing clouds
function spawnClouds() {
  //write code here to spawn the clouds
   if (frameCount % 60 === 0) {
    cloud = createSprite(600,100,40,10);
    cloud.y = Math.round(random(10,60));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime = 200;
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //adding cloud to the group
   cloudsGroup.add(cloud);
    }
}

//setting function reset
function reset(){
  gameState = PLAY;
  obstaclesGroup.destroyEach()
  cloudsGroup.destroyEach()
  score=0
  trex.changeAnimation("running",trex_running)
}


