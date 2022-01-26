class Rectangle {
    constructor(height, width) {
      this.height = height;
      this.width = width;
    }
}

class Point{
    constructor(x, y){
        this.x = x
        this.y = y
    }

    scalarProduct(n){
        return new Point(this.x * n, this.y * n)
    }

    sum(p){
        return new Point(this.x + p.x, this.y + p.y)
    }
}

var SOUTH = "S"
var NORTH = "N"
var EAST = "E"
var WEST = "W"
var directionsVec = {
    "S" : new Point(0,1),
    "N" : new Point(0,-1),
    "E" : new Point(1,0),
    "W" : new Point(-1,0)
};
var directions = [EAST, WEST, NORTH, SOUTH]

class Wall {
    constructor(){}

    isWall(){
        return true
    }

    isPlayer(){
        return false
    }

    isPath() {
        return false
    }
    
    print(){
        return "#"
    }
}

class Path {
    constructor(){}

    isWall(){
        return false
    }

    isPlayer(){
        return false
    }

    isPath() {
        return true
    }

    print(){
        return " "
    }
}

class Door {
    constructor(direction){
        this.direction = direction
        this.state = false
    }

    open(){
        this.state = true
    }

    close(){
        this.state = false
    }

    isWall(){
        return false
    }

    isPlayer(){
        return false
    }

    isPath() {
        return false
    }
    
    print(){
        return this.direction.toString()
    }
}

class Chest {
    constructor(){}

    isWall(){
        return false
    }

    isPlayer(){
        return false
    }

    isPath() {
        return false
    }

    print(){
        return "C"
    }
}

const DOOR_RATIO = 0.5

class Maze{
    constructor(width, height){
        this.width = width
        this.height = height
        this.cells = Array(height)
        for(var y = 0; y < height; y++)
            this.cells[y] = Array(width).fill(new Wall())
        this.player = new Point(-1, -1)
    }

    isWall(cell){
        if (this.cellInBounds(cell)) {
            return this.cells[cell.y][cell.x].isWall()
        }
        return false
    }
    
    isPath(cell){
        if (this.cellInBounds(cell)) {
            return this.cells[cell.y][cell.x].isPath()
        }
        return false
    }
    
    setPath(cell){
        if (this.cellInBounds(cell)) {
            this.cells[cell.y][cell.x] = new Path()
        }
        else{
            throw "coordinates out of range"
        }
    }

    setDoor(cell, direction){
        if (this.cellInBounds(cell)) {
            this.cells[cell.y][cell.x] = new Door(direction)
        }
        else{
            throw "coordinates out of range"
        }
    }

    setPlayer(cell) {
        if (this.cellInBounds(cell)) {
            this.player = new Point(cell.x, cell.y)
        }
        else{
            throw "coordinates out of range"
        }
    }

    setChest(cell) {
        if (this.cellInBounds(cell)) {
            this.cells[cell.y][cell.x] = new Chest()
        }
        else{
            throw "coordinates out of range"
        }
    }

    cellInBounds(cell){
        return 0 <= cell.x && cell.x < this.width && 0 <= cell.y && cell.y < this.height
    }

    movePlayer(direction) {
        var dirVec = directionsVec[direction]
        if(this.playerCanGoInDirection(dirVec)){
            this.player = nextCell
        }
    }

    playerCanGoInDirection(dirVec) {
        if 
    }

    print(){
        console.log("printing maze...")
        for(var y = 0;y < this.height; y++){
            var row = ""
            for(var x = 0;x < this.width;x++){
                if(this.player.x == x && this.player.y == y)
                    row += "P"
                else
                    row += this.cells[y][x].print()
            }
            console.log(row)
        }
    }
}

class MazeGenerationState {
    constructor(cell, directions){
        this.cell = cell
        this.directions = directions
    }
}

class MazeGenerator{
    constructor(width, height){
        this.width = width
        this.height = height
    }

    makeMaze(startCell){
        var maze = new Maze(this.width, this.height)
        maze.print()
        var states = [this.buildNewState(startCell)]
        maze.setPath(startCell)

        while(states.length > 0){
            var currentState = states.at(-1)
            if(currentState.directions.length == 0){
                states.pop()
                continue
            }

            var nextDirection = currentState.directions.pop()
            console.log(nextDirection)
            console.log(directionsVec)
            console.log(directionsVec[SOUTH])
            var nextCell = directionsVec[nextDirection].scalarProduct(2).sum(currentState.cell)
            if(maze.isWall(nextCell)){
                var linkCell = directionsVec[nextDirection].sum(currentState.cell)
                if (Math.random() > DOOR_RATIO)
                    maze.setDoor(linkCell, nextDirection)
                else
                    maze.setPath(linkCell)

                maze.setPath(nextCell)
                states.push(this.buildNewState(nextCell))
            }
        }


        this.placeObjectRandomnly(maze, maze.setPlayer)
        this.placeObjectRandomnly(maze, maze.setChest)
        return maze
    }

    placeObjectRandomnly(maze, spawner) {
        var x, y
        do {
            x = Math.round(Math.random() * (this.width-1))
            y = Math.round(Math.random() * (this.height-1))
        } while(!maze.isPath(new Point(x,y)))

        spawner.apply(maze, [new Point(x,y)])
    }

    buildNewState(cell){
        var randomizedDirections = directions.map(x => x).sort((a, b) => 0.5 - Math.random());
        return new MazeGenerationState(cell, randomizedDirections)
    }
}

mazeGenerator = new MazeGenerator(21, 21)
maze = mazeGenerator.makeMaze(new Point(13, 13))
maze.print()
