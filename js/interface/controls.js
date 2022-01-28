document.onkeydown = checkKey;
window.addEventListener("load", initGame);

var maze
var mazeGeometry

function checkKey(e) {

    e = e || window.event;

    if (e.keyCode == '38') {
        maze.movePlayer(NORTH)
        updateMaze()
        // up arrow
    }
    else if (e.keyCode == '40') {
        maze.movePlayer(SOUTH)
        updateMaze()
        // down arrow
    }
    else if (e.keyCode == '37') {
        maze.movePlayer(WEST)
        updateMaze()
       // left arrow
    }
    else if (e.keyCode == '39') {
        maze.movePlayer(EAST)
        updateMaze()
       // right arrow
    } else if (e.keyCode == '32') {
        maze.playerOpenDoor()
        updateMaze()
        updateMazeGeometry()
    }
}

function updateMazeGeometry() {
    var mazeGeometryMapper = new MazeGeometryMapper()
    mazeGeometry = mazeGeometryMapper.convertMazeToGeometry(maze)
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function initGame() {   
    var width = getRandomInt(3, 13)
    if(width % 2 == 0){
        width++
    }
    var height = getRandomInt(3, 21)
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