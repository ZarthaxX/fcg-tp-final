document.onkeydown = checkKey;
window.addEventListener("load", initGame);

var maze

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
    }
}

function initGame() {     
    var mazeGenerator = new MazeGenerator(21, 21)
    maze = mazeGenerator.makeMaze(new Point(13, 13))
    updateMaze()
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