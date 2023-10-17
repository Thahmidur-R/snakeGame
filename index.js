
/*
need to add map choosing function
need to take ss and add as image tag for each map
need to add hitting obstacle is game over,
need to change it so the map chosen 
decides which obstacles to make
*/
const gameBoard = document.querySelector(".game-board");
for (let i = 1; i <= 900; i++) {
    const gridItem = document.createElement("div");
    gridItem.classList.add("grid-item");
    gridItem.id = `tile${i}`;
    gameBoard.appendChild(gridItem);
  }
  
 

let width=30;
let tiles=document.querySelectorAll('.grid-item');
let currentIndex = 0;
let foodIndex = 0;
let currentSnake = [2, 1, 0];
let head=currentSnake[0];
let direction = 1;
let score = 0;
let speedIncrease = 0.98;
let movementIntervals = 150;
let interval = 0;
let snakeHeadClass='';
let highScore=0;
let obstacles=[];
let gameOverScreen=document.querySelector('.game-over-screen');
let chooseMapScreen = document.querySelector(".choose-map-screen");
let centreMoveBtn=document.querySelector(".centre-move-btn");
let mainContainer = document.querySelector('.main-container');

document.querySelector('.playBtn').onclick=()=>{
    
    document.querySelector('.rules-container').style.display='none';
    document.querySelector('.playBtn-container').style.display='none'; 
    chooseMapScreen.style.display='block';
    
}

const pauseButton = document.querySelector('.pauseBtn');
pauseButton.addEventListener('click', pauseGame);

document.querySelector('.play-again').onclick=()=>{
  restartGame();
}


document.querySelector('.original-map').addEventListener('click', function(){
mapSelected();
startGame();
})

document.querySelector('.horizontal-obstacles').addEventListener('click', function(){
  mapSelected();
  addHorizontalObstacles();
  startGame();
  })

  document.querySelector('.T-block-obstacles').addEventListener('click', function(){
    mapSelected();
    addTBlockObstacles();
    startGame();
    })

document.querySelector('.change-map-btn').addEventListener('click', function(){
 clearGame();
 document.querySelectorAll('.obstacle').forEach(element=>{
  element.classList.remove('obstacle');
});
  chooseMapScreen.style.display='block';
  
  mainContainer.style.display='none';
  centreMoveBtn.style.display='none';
  gameOverScreen.style.display='none';
  

})


function addHorizontalObstacles() {
  const tiles = document.getElementsByClassName("grid-item");
  for (let i = 0; i < tiles.length; i++) {
    const tile = tiles[i];
    if (i >= 272 && i <= 297 && (i - 271) % 3 === 0) {
      tile.classList.add("obstacle");
    }
    if (i >= 602 && i <= 627 && (i - 601) % 3 === 0) {
      tile.classList.add("obstacle");
    }
  }
}

function addTBlockObstacles(){
  const tiles = document.getElementsByClassName("grid-item");
  for (let i = 0; i < tiles.length; i+=3) {
    if(i>=151 && i<180){
      tiles[i].classList.add('obstacle');
    }
  }
  for (let i = 165; i < tiles.length; i += 90) {

if (i >= 166 && i <= 805) {
  tiles[i].classList.add("obstacle");
}
}
}

function mapSelected(){
  chooseMapScreen.style.display='none';
   mainContainer.style.display='flex';
   centreMoveBtn.style.display='flex';
  }

function startGame(){

  document.querySelector('.high-score').textContent="High Score:"+highScore;
   document.addEventListener('keydown',  function(event) {
    chooseDirection(event,tiles, head);
  });
  document.querySelectorAll('.move-btn').forEach(btn=>{
    btn.addEventListener('click', function(event){
      mobileChooseDirection(event, tiles, head);
    })
  })
generateFood(tiles);
direction = 1;
  currentSnake = [2, 1, 0];
  currentIndex = 0;
  currentSnake.forEach((element) => tiles[element].classList.add("snake"));
  interval = setInterval(() => moveOutcome(tiles), movementIntervals);
}


function moveOutcome(tiles){
  
if(isGameOver(tiles)){
  
  setTimeout(function() {
    gameOverScreen.style.display = 'flex';
    gameOverScreen.style.justifyContent = 'center';
gameOverScreen.style.alignItems = 'center';
document.querySelector('.final-score').textContent= "Final Score: "+score;
if(score>highScore){
  highScore= score;
}
    clearInterval(interval);
  }, 300);
}
else{
    moveSnake(tiles);
}
}

function moveSnake(tiles){
  
  switch (direction) {
    case width:
      snakeHeadClass = 'snakeHeadDownwards';
      break;
    case -width:
      snakeHeadClass = 'snakeHeadUpwards';
      break;
    case 1:
      snakeHeadClass = 'snakeHeadRight';
      break;
    case -1:
      snakeHeadClass = 'snakeHeadLeft';
      break;
  }
 
    head = currentSnake[0];
   
    head+=direction;
    
    currentSnake.unshift(head);
    tiles[head].classList.add('snake');
    if(tiles[head-direction].classList.contains('snakeHeadDownwards')||tiles[head-direction].classList.contains('snakeHeadUpwards')||tiles[head-direction].classList.contains('snakeHeadLeft')||tiles[head-direction].classList.contains('snakeHeadRight')){
      tiles[head-direction].classList.remove('snakeHeadDownwards','snakeHeadUpwards', 'snakeHeadRight', 'snakeHeadLeft');
    }
    tiles[head].classList.add(snakeHeadClass);
    
    let tail = currentSnake.pop();
    tiles[tail].classList.remove('snake');
eatFood(tiles, tail);
}



function generateFood(tiles){
 
  let index = Math.floor(Math.random() * tiles.length);

while (tiles[index].classList.contains('snake')||tiles[index].classList.contains('obstacle')) {
  index = Math.floor(Math.random() * tiles.length);
}

tiles[index].classList.add('food');
}


function eatFood(tiles, tail){
  
head = currentSnake[0];
if(tiles[head].classList.contains('food')){
  tiles[head].classList.remove('food');
currentSnake.push(tail);
tiles[tail].classList.add('snake');
score++;
document.querySelector('.score').textContent="score:"+score;
generateFood(tiles);
clearInterval(interval);
    movementIntervals = movementIntervals * speedIncrease;
    interval = setInterval(() => moveOutcome(tiles), movementIntervals);
}
}

function chooseDirection(event, tiles, head){
 
  let keyCode = event.keyCode;
  
switch (keyCode) {
    case 37: // Left arrow
    case 65: // A
      // Logic for left direction
      event.preventDefault();
      if(tiles[head-1].classList.contains('snake')){
        return;
      }// condition to not allow snake to go back on itself
      
      direction=-1;
      break;
    case 38: // Up arrow
    case 87: // W
      // Logic for up direction
      
      event.preventDefault();
      if(tiles[head - width] !== undefined && tiles[head-width].classList.contains('snake')){
        return;
      }
   
      direction=-width
      break;
    case 39: // Right arrow
    case 68: // D
      // Logic for right direction
      event.preventDefault();
      if(tiles[head+1].classList.contains('snake')){
       
        return;
      }
      
      direction=1;
      break;
    case 40: // Down arrow
    case 83: // S
      // Logic for down direction
      event.preventDefault();
      if(tiles[head +  width] !== undefined &&tiles[head+width].classList.contains('snake')){
        
        return;
      }
    
      direction=width;
      break;
    default:
      // Default logic if none of the specified key codes match
      break;
  }
}

function mobileChooseDirection(event, tiles, head) {
  
  let buttonId = event.target.id;
  
  switch (buttonId) {
    case 'left-button':
      // Logic for left direction
      event.preventDefault();
      if (tiles[head - 1].classList.contains('snake')) {
        return;
      }
      direction = -1;
      break;
    case 'up-button':
      // Logic for up direction
      event.preventDefault();
      if (tiles[head - width] !== undefined && tiles[head - width].classList.contains('snake')) {
        return;
      }
      direction = -width;
      break;
    case 'right-button':
      // Logic for right direction
      event.preventDefault();
      if (tiles[head + 1].classList.contains('snake')) {
        return;
      }
      direction = 1;
      break;
    case 'down-button':
      // Logic for down direction
      event.preventDefault();
      if (tiles[head + width] !== undefined && tiles[head + width].classList.contains('snake')) {
        return;
      }
      direction = width;
      break;
    default:
      // Default logic if none of the specified buttons match
      break;
  }
}

function isGameOver(tiles){
  head= currentSnake[0];

if(
  (direction==1 && head%width ==width-1 )||
  (direction==-1 && head%width==0) ||
  (direction==width && head +width >= width*width)||
  (direction==-width && head-width<= 0 )||
  tiles[head+direction].classList.contains('snake')||
  tiles[head+direction].classList.contains('obstacle')
){
return true;
}
else{
  return false;
}
}

function pauseGame(){
  if (pauseButton.innerHTML == '❚❚') {
   
    pauseButton.innerHTML = '&#9658;';
    clearInterval(interval);
  } else {
    pauseButton.innerHTML = '&#10074;&#10074;';
    interval = setInterval(() => moveOutcome(tiles), movementIntervals);
  }
}


function clearGame(){
  currentIndex = 0;
 foodIndex = 0;
 currentSnake = [2, 1, 0];
 head=currentSnake[0];
 direction = 1;
 score = 0;
 speedIncrease = 0.98;
 movementIntervals = 150;
 interval = 0;
 snakeHeadClass='';
 gameOverScreen.style.display = 'none';
 document.querySelector('.score').textContent="score:"+score;
 document.querySelector('.food').classList.remove('food');
 const snakeElements = document.querySelectorAll('.snake');
snakeElements.forEach(element => {
  element.classList.remove('snake');
});
const snakeHeadElement = document.querySelector('.snakeHeadDownwards, .snakeHeadUpwards, .snakeHeadRight, .snakeHeadLeft');
if (snakeHeadElement) {
  snakeHeadElement.classList.remove('snakeHeadDownwards', 'snakeHeadUpwards', 'snakeHeadRight', 'snakeHeadLeft');
}
}

function restartGame(){
  clearGame();
 startGame();
}

