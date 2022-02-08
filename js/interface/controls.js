document.onkeydown = checkKey;
window.addEventListener("load", initGame);

var maze
var mazeGeometry
var mazeDrawers

function checkKey(e) {

    e = e || window.event;
    var cameraSpeed = 0.1;

    if (e.keyCode == '38') {
        camera.setPosition(camera.cameraPos.traslation(camera.cameraFront.scalar(cameraSpeed)))
        maze.movePlayer(NORTH)
        updateMaze()
        // up arrow
    }
    else if (e.keyCode == '40') {
        camera.setPosition(camera.cameraPos.minus(camera.cameraFront.scalar(cameraSpeed)))
        maze.movePlayer(SOUTH)
        updateMaze()
        // down arrow
    }
    else if (e.keyCode == '37') {
        camera.setPosition(camera.cameraPos.traslation(camera.cameraFront.cross(camera.cameraUp).scalar(cameraSpeed)));
        maze.movePlayer(WEST)
        updateMaze()
       // left arrow
    }
    else if (e.keyCode == '39') {
        camera.setPosition(camera.cameraPos.minus(camera.cameraFront.cross(camera.cameraUp).scalar(cameraSpeed)));
        maze.movePlayer(EAST)
        updateMaze()
       // right arrow
    } else if (e.keyCode == '32') {
        maze.playerOpenDoor()
        updateMaze()
    }
    updateMazeGeometry()
    DrawScene();
}

function updateMazeGeometry() {
    var mazeGeometryMapper = new MazeGeometryMapper()
    mazeDrawers = mazeGeometryMapper.convertMazeToGeometry(maze)
    DrawScene()
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const MIN_WIDTH = 11;
const MIN_HEIGHT = 11;
const MAX_WIDTH = 11;
const MAX_HEIGHT = 11;

function initGame() {  
    const generator = new Math.seedrandom()
    Math.random = generator;
     
    var width = getRandomInt(MIN_WIDTH, MAX_WIDTH)
    if(width % 2 == 0){
        width++
    }
    var height = getRandomInt(MIN_HEIGHT, MAX_HEIGHT)
    if(height % 2 == 0){
        height++
    }
    var initialX = getRandomInt(1, width-2)
    if(initialX % 2 == 0){
        initialX++
    }
    var initialY = getRandomInt(1, height-2)
    if(initialY % 2 == 0){
        initialY++
    }
    var mazeGenerator = new MazeGenerator(width, height)
    maze = mazeGenerator.makeMaze(new Point(initialX, initialY))
    updateMaze()
    updateMazeGeometry()
    
    DrawScene()
}

function updateMaze(){
    if(maze.chestWasReached()){
        initGame()
        return
    }
    var mazeStr = maze.toString()
    var mazeNode = document.getElementById("maze")
    mazeNode.innerText = mazeStr
}