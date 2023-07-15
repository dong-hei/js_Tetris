import BLOCKS from "./blocks.js"

//DOM
const playground = document.querySelector(".playground > ul");
const gameTxt = document.querySelector(".game-txt");
const scoreDisplay = document.querySelector(".score");
const restartBtn = document.querySelector(".game-txt > button");

//Setting
const GAME_ROWS = 20;
const GAME_COLS = 10;


// variables
let score = 0;
let duration = 500;
let downInterval;
let tempMovingItem;


const movingItem = {
    type : "",
    direction: 3,
    top: 0,
    left: 0,
}

init()

// functions 
function init(){
    tempMovingItem = { ...movingItem };
    //  스프레드 오퍼레이터를 가져와서 movingItem 을 가져오는게 아니라 괄호안에 변수를 가져온다

    for(let i=0; i< GAME_ROWS; i++){
        prependNewLine()
    }

    generateNewBlock()

}

function prependNewLine(){
        const li = document.createElement("li");
        const ul = document.createElement("ul");

        for(let j = 0; j < GAME_COLS; j++){
            const matrix = document.createElement("li");
            ul.prepend(matrix);
        }
        li.prepend(ul);
        playground.prepend(li);
    }


function renderBlocks(moveType=""){
    const { type,direction,top,left } = tempMovingItem;
    const movingBlocks = document.querySelectorAll(".moving");
    movingBlocks.forEach(moving =>{
        moving.classList.remove(type,"moving");
    })

    BLOCKS[type][direction].some(block => {
        const x = block[0] + left;
        const y = block[1] + top;
        const target = playground.childNodes[y] ? playground.childNodes[y].childNodes[0].childNodes[x] : null;  
        const isAvailable = checkEmpty(target);
        if(isAvailable){
            target.classList.add(type, "moving")
            // childNodes란? 0부터 9까지 배열로 쓸수있도록 한다.
        } else{
            tempMovingItem = { ...movingItem }
            if(moveType === 'retry'){
                clearInterval(downInterval)
                showGameoverText()
            }
            setTimeout(() =>{
                renderBlocks('retry');
                if(moveType === "top"){
                    seizeBlock();
                }

            },0)
        return true;
        }
        //화면이 밖을 못넘게끔 하는 if문
    });

    movingItem.left = left;
    movingItem.top = top;
    movingItem.direction = direction;

    //블록스 안에 타입,디렉션(그안에 트리)에 접근한다
}

function checkEmpty(target){
    if(!target || target.classList.contains("seized")){
        return false;
    }
    return true;
}
function showGameoverText(){
    gameTxt.style.display = "flex"
}

function moveBlock(moveType,amount){
    tempMovingItem[moveType] += amount;
    renderBlocks(moveType)
}

function changeDirection(){
    const direction = tempMovingItem.direction;
    direction == 3 ? tempMovingItem.direction = 0 : tempMovingItem.direction +=1;
    renderBlocks();
}


function seizeBlock(){
    const movingBlocks = document.querySelectorAll(".moving");
    movingBlocks.forEach(moving =>{
        moving.classList.remove("moving");
        moving.classList.add("seized");
    })
    checkMatch()
}

function checkMatch(){
    const childNodes = playground.childNodes;
    childNodes.forEach(child => {
        let matched = true;
        child.children[0].childNodes.forEach(li=>{
            if(!li.classList.contains("seized")){
                matched = false;
            }
        })
        if(matched){
            child.remove();
            prependNewLine();
            score++;
            scoreDisplay.innerText = score;
        }
    }) 

    generateNewBlock()
}

function generateNewBlock(){

    clearInterval(downInterval);
    downInterval = setInterval(() => {
        moveBlock('top',1)
    },duration)

    const blockArray = Object.entries(BLOCKS);    
    const randomIndex = Math.floor(Math.random() * blockArray.length)

    movingItem.type = blockArray[randomIndex][0]
    movingItem.top = 0;
    movingItem.left = 3;
    movingItem.direction = 0;
    tempMovingItem = {...movingItem};
    renderBlocks()
}

function dropBlock(){
    clearInterval(downInterval);
    downInterval = setInterval(()=>{
        moveBlock("top",1)
    },12)
}

//event handling
document.addEventListener("keydown",e =>{
    switch(e.keyCode){
        case 32: dropBlock(); break;
        case 39: moveBlock("left", 1); break;
        case 37: moveBlock("left", -1); break;
        case 38: changeDirection(); break;
        case 40: moveBlock("top",1); break;
        default: break;
    }
    // console.log(e)
})

restartBtn.addEventListener("click",()=>{
    playground.innerHTML = "";
    gameTxt.style.display = "none"
    init()
})