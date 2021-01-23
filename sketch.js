var dog, happyDog;
var foodS, foodStock;
var database;
var lastFed, milkImg;

function preload() {
  dogImg = loadImage("dogImg.png");
  happyDogImg = loadImage("dogImg1.png");
  milkImg = loadImage("Milk.png")
}

function setup() {
  createCanvas(500, 500);

  database = firebase.database();

  dog = createSprite(400, 250, 20, 20);
  dog.addImage(dogImg);
  dog.scale = 0.3;

  foodStock = database.ref('Food');
  foodStock.on("value", readStock);

  fedTime = database.ref('FeedTime');
  fedTime.on("value", function(data) {
    lastFed = data.val();
  })

  for (var i = 30; i < 300; i=i+50) 
{
  var milk = createSprite(i, 200, 20, 20);
milk.addImage(milkImg);
milk.scale=0.08;
}
for (var m = 30; m < 300; m=m+50) 
{
  var milk2 = createSprite(m, 300, 20, 20);
milk2.addImage(milkImg);
milk2.scale=0.08;
}
 

  feedPet = createButton("Feed Sillu");
  feedPet.position(670, 95);
  feedPet.mousePressed(feedDog);

  addFood = createButton("Add Food");
  addFood.position(770, 95);
  addFood.mousePressed(addFoods);
}


function draw() {
  background(46, 139, 87);
  drawSprites();

  fill(255, 255, 254);
  textSize(15);
  if(lastFed >= 12){
    text("Last Feed : " + lastFed % 12 + " PM", 50, 30);
  }
  else if(lastFed == 0){
    text("Last Feed : 12 AM", 50, 30);
  }
  else {
    text("Last Feed : " + lastFed + " AM", 50, 30);
  }
  
  
  var x = 70, y = 100;
  
  imageMode(CENTER);
  
  if(foodStock != 0) {
    for(var i = 0; i < foodStock; i ++) {
      if(i % 10 == 0) {
        x = 70;
        y = y + 50;
      }
      image(milkImg, x, y, 50, 50);
      x = x + 30;
    }
  }

  textFont("Georgia");
  textSize(20);
  textAlign(CENTER);
  fill("white");
  text("Food Stock: " + foodS, 400, 30);
}

function readStock(data) {
  foodS = data.val();
}

function feedDog() {
  dog.addImage(happyDogImg);

  database.ref('/').update({
    Food: foodS - 1,
    FeedTime: hour()
  })
}

function addFoods() {

  foodS ++;

  database.ref('/').update({
    Food: foodS
  })
}

async function hour() {
  var response = await fetch("http://worldtimeapi.org/api/timezone/Asia/Kolkata");
  var responseJSON = await response.json();

  var datetime = responseJSON.datetime;
  var hour = datetime.slice(11, 13);

  database.ref('/'),update({
    FeedTime: hour
  })

  console.log(hour);
}