import random
import copy

class Point:
    def __init__(self, x, y):
        self.x = x
        self.y = y

    def scalarProduct(self, n):
        return Point(self.x * n, self.y * n)

    def sum(self, p):
        return Point(self.x + p.x, self.y + p.y)

directions = [Point(1,0),Point(-1,0),Point(0,1),Point(0,-1)]

class Maze:
    def __init__(self, width, height):
        self.width = width
        self.height = height
        self.cells = [[0 for j in range(width)] for i in range(height)]

    def isWall(self, cell):
        if 0 <= cell.x < self.width and 0 <= cell.y < self.height:
            return self.cells[cell.y][cell.x] == 0
        else:
            return False

    def isPath(self, cell):
        if 0 <= cell.x < self.width and 0 <= cell.y < self.height:
            return self.cells[cell.y][cell.x] == 1
        else:
            return False

    def setWall(self, cell):
        if 0 <= cell.x < self.width and 0 <= cell.y < self.height:
            self.cells[cell.y][cell.x] = 0
        else:
            raise Exception()

    def setPath(self, cell):
        if 0 <= cell.x < self.width and 0 <= cell.y < self.height:
            self.cells[cell.y][cell.x] = 1
        else:
            raise Exception()

    def print(self):
        for y in range(self.height):
            for x in range(self.width):
                cellType = self.cells[y][x]
                if cellType == 0:
                    print("#", end="")
                elif cellType == 1:
                    print(" ", end="")
                else:
                    raise Exception()
            print()

class MazeGenerationState:
    def __init__(self, cell, directions):
        self.cell = cell
        self.directions = directions

class MazeGenerator:
    def __init__(self, width, height):
        self.width = width
        self.height = height

    def makeMaze(self, startCell):
        maze = Maze(self.width, self.height)
        states = [self.buildNewState(startCell)]
        maze.setPath(startCell)
        
        while states:
            maze.print()
            print()
            currentState = states[-1]
            if not currentState.directions:
                states.pop()
                continue
            
            nextDirection = currentState.directions.pop()
            nextCell = nextDirection.scalarProduct(2).sum(currentState.cell)
            if maze.isWall(nextCell):
                linkCell = nextDirection.sum(currentState.cell)
                maze.setPath(linkCell)
                
                maze.setPath(nextCell)
                states.append(self.buildNewState(nextCell))
        
        return maze

    def buildNewState(self, cell):
        randomizedDirections = copy.deepcopy(directions)
        random.shuffle(randomizedDirections)
        return MazeGenerationState(cell, randomizedDirections)

mazeGenerator = MazeGenerator(11, 11)
maze = mazeGenerator.makeMaze(Point(5, 5))
maze.print()
