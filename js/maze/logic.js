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
var directionStringMap = {
    "S" : "―",
    "N" : "―",
    "E" : "|",
    "W" : "|"
}
var directions = [EAST, WEST, NORTH, SOUTH]

class Wall {
    constructor(){}
    
    isDoor() {
        return false
    }
    
    isWall(){
        return true
    }

    isPlayer(){
        return false
    }

    isChest(){
        return false
    }

    isPath() {
        return false
    }
    
    canEnter(dir) {
        return false
    }

    canLeave(dir) {
        return false
    }

    changeState(){}
    
    toGeometry(mapper) {
        return mapper.mapToWall(this)
    }

    print(){
        return "#"
    }
}

class Path {
    constructor(){}

    isDoor() {
        return false
    }

    isWall(){
        return false
    }

    isPlayer(){
        return false
    }

    isChest(){
        return false
    }

    isPath() {
        return true
    }

    canEnter(dir) {
        return true
    }

    canLeave(dir) {
        return true
    }
    
    changeState(){}
  
    toGeometry(mapper) {
        return mapper.mapToPath(this)
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

    isOpen() {
        return this.state
    }
    
    open(){
        this.state = true
    }

    close(){
        this.state = false
    }

    isDoor() {
        return true
    }
    
    isWall(){
        return false
    }

    isPlayer(){
        return false
    }

    isChest(){
        return false
    }

    isPath() {
        return false
    }

    canEnter(dir) {
        if(this.state)
            return true

        switch(this.direction){
            case NORTH:
            case SOUTH:
                return dir != SOUTH && dir != NORTH
            case WEST:
            case EAST:
                return dir != EAST && dir != WEST
        }
    }

    canLeave(dir) {
        if(this.state)
            return true
        return this.direction != dir
    }
    
    changeState(){
        this.state = !this.state
    }

    toGeometry(mapper) {
        return mapper.mapToDoor(this)
    }

    print(){
        if(this.state)
            return '.'
        return directionStringMap[this.direction]
    }
}

class Chest {
    constructor(){}

    isDoor() {
        return false
    }
    
    isWall(){
        return false
    }

    isPlayer(){
        return false
    }

    isChest(){
        return true
    }

    isPath() {
        return false
    }

    canEnter(dir) {
        return true
    }

    canLeave(dir) {
        return true
    }

    changeState(){}

    toGeometry(mapper) {
        return mapper.mapToChest(this)
    }

    print(){
        return "C"
    }
}

class Player {
    constructor(point, direction){
        this.point = point
        this.direction = direction
    }

    moveInDirection(direction) {
        var dirVec = directionsVec[direction]
        this.point = this.point.sum(dirVec)
        this.direction = direction
    }

    pointInDirection(direction) {
        this.direction = direction
    }
    
    print(){
        return "P"
    }
}

var DOOR_RATIO = 0.1

class Maze{
    constructor(width, height){
        this.width = width
        this.height = height
        this.cells = Array(height)
        for(var y = 0; y < height; y++)
            this.cells[y] = Array(width).fill(new Wall())
        this.player = new Player(new Point(-1,-1), NORTH)
    }

    playerOpenDoor() {
        var direction = this.player.direction
        var dirVec = directionsVec[direction]
        var leaving = this.player.point
        var entering = this.player.point.sum(dirVec)
        this.cells[leaving.y][leaving.x].changeState()
        this.cells[entering.y][entering.x].changeState()
    }

    isDoor(cell){
        if (this.cellInBounds(cell)) {
            return this.cells[cell.y][cell.x].isDoor()
        }
        return false
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
    
    isChest(cell){
        if (this.cellInBounds(cell)) {
            return this.cells[cell.y][cell.x].isChest()
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
            this.player = new Player(cell, NORTH)
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
        this.player.pointInDirection(direction)
        if(this.playerCanGoInDirection(direction)){
           this.player.moveInDirection(direction)
        }
    }

    changePlayerDirection(direction) {
        this.player.pointInDirection(direction)
    }
    
    playerCanGoInDirection(direction) {
        var dirVec = directionsVec[direction]
        var leaving = this.player.point
        var entering = this.player.point.sum(dirVec)
        return this.cellInBounds(entering) 
            && this.cells[entering.y][entering.x].canEnter(direction)
    }

    chestWasReached(){
        var cell = this.player.point
        return this.cells[cell.y][cell.x].isChest()
        // return false
    }

    toString(){
        var maze = ""
        for(var y = 0;y < this.height; y++){
            var row = ""
            for(var x = 0;x < this.width;x++){
                if(this.player.point.x == x && this.player.point.y == y)
                    row += "P"
                else
                    row += this.cells[y][x].print()
            }
            maze += row + "\n"
        }
        return maze
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
        if(this.width <= 3 && this.height <= 3){
            return maze   
        }
        var states = [this.buildNewState(startCell)]
        maze.setPath(startCell)

        while(states.length > 0){
            var currentState = states.at(-1)
            if(currentState.directions.length == 0){
                states.pop()
                continue
            }

            var nextDirection = currentState.directions.pop()
            var nextCell = directionsVec[nextDirection].scalarProduct(2).sum(currentState.cell)
            if(maze.isWall(nextCell)){
                var linkCell = directionsVec[nextDirection].sum(currentState.cell)
                if (Math.random() <= DOOR_RATIO)
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