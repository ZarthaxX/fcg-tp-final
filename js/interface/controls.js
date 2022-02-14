document.onkeydown = checkKey;

var maze
var mazeGeometry
var mazeDrawers

var dirToVec = {
    "S" : {"x": 0,"y":-1},
    "N" : {"x": 0,"y":1},
    "E" : {"x": -1,"y":0},
    "W" : {"x": 1,"y":0},
}

var dirToInt = {
    "N" : 0,
    "W" : 1,
    "S" : 2,
    "E" : 3,
}

var intToDir = {
    0 : "N",
    1 : "W",
    2 : "S",
    3 : "E",
}

function findAngle(x1,y1,x2,y2) {
    dot = x1*x2 + y1*y2      
    det = x1*y2 - y1*x2     
    angle = Math.atan2(det, dot)
    return angle
}

function getDir(dir) {
    var closestDir = "N"
    var closestDist = 10000
    for(const d of ["S","N","E","W"]){
        var vec = dirToVec[d]
        var dist = findAngle(direction.x,direction.y,vec.x,vec.y)
        if(Math.abs(dist) < closestDist){
            closestDir = d
            closestDist = Math.abs(dist)
        }
    }
    offset = (dirToInt[dir] - dirToInt[closestDir] + 4) % 4
    return intToDir[offset]
}

function updateCamera(dir) {
    switch(dir) {
        case NORTH:
            yaw = 450.0
            pitch = -1.0
        break;
        case SOUTH:
            yaw = 628
            pitch = 3.2
        break;
        case EAST:
            yaw = 365
            pitch = 5.5
        break;
        case WEST:
            yaw = 540
            pitch = 5.6
        break;
    }
    rotateByEulerAngle(0,0)
}

function checkKey(e) {

    e = e || window.event;
    var cameraSpeed = 0.1;
    var nextDir
    if (e.keyCode == '38' || e.keyCode == '87') {
        nextDir = getDir(NORTH)
        maze.movePlayer(nextDir)
        camera.setPosition(camera.cameraPos.traslation(camera.cameraFront.scalar(cameraSpeed)))
        updateMaze()
        // up arrow
    }
    else if (e.keyCode == '40' || e.keyCode == '83') {
        nextDir = getDir(SOUTH)
        maze.movePlayer(nextDir)
        camera.setPosition(camera.cameraPos.minus(camera.cameraFront.scalar(cameraSpeed)))
        updateMaze()
        // down arrow
    }
    else if (e.keyCode == '37' || e.keyCode == '65') {
        nextDir = getDir(WEST)
        maze.movePlayer(nextDir)
        camera.setPosition(camera.cameraPos.traslation(camera.cameraFront.cross(camera.cameraUp).scalar(cameraSpeed)));
        updateMaze()
       // left arrow
    }
    else if (e.keyCode == '39' || e.keyCode == '68') {
        nextDir = getDir(EAST)
        maze.movePlayer(nextDir)
        camera.setPosition(camera.cameraPos.minus(camera.cameraFront.cross(camera.cameraUp).scalar(cameraSpeed)));
        updateMaze()
       // right arrow
    } else if (e.keyCode == '32') {
        maze.playerOpenDoor()
        updateMaze()
    }
    updateMazeGeometry()
    updateCamera(nextDir)
}

function updateMazeGeometry() {
    var mazeGeometryMapper = new MazeGeometryMapper()
    mazeDrawers = mazeGeometryMapper.convertMazeToGeometry(maze)
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

var MIN_WIDTH = 5;
var MIN_HEIGHT = 5;
var MAX_WIDTH = 5;
var MAX_HEIGHT = 5;

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
}

function updateMaze(){
    if(maze.chestWasReached()){
        var mazesSolvedCounter = document.getElementById("mazes-solved-counter")
        var count = parseInt(mazesSolvedCounter.innerText, 10)
        mazesSolvedCounter.innerText = count + 1
        initGame()
        return
    }
    var mazeStr = maze.toString()
    var mazeNode = document.getElementById("maze")
    mazeNode.innerText = mazeStr
}