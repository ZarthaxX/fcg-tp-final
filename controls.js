document.onkeydown = checkKey;

function checkKey(e) {

    e = e || window.event;

    if (e.keyCode == '38') {
        maze.movePlayer(NORTH)
        maze.print()
        // up arrow
    }
    else if (e.keyCode == '40') {
        maze.movePlayer(SOUTH)
        maze.print()
        // down arrow
    }
    else if (e.keyCode == '37') {
        maze.movePlayer(WEST)
        maze.print()
       // left arrow
    }
    else if (e.keyCode == '39') {
        maze.movePlayer(EAST)
        maze.print()
       // right arrow
    }

}