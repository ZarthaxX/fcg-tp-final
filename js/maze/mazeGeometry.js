const PROPORTION_FACTOR = 1;

class Vertex3 {
    constructor(x, y, z){
        this.x = x
        this.y = y
        this.z = z
    }

    scalar(num) {
        return new Vertex3(this.x * num, this.y * num, this.z * num)
    }

    traslation(v) {
        return new Vertex3(this.x + v.x, this.y + v.y, this.z + v.z)
    }

    minus(v){
        return new Vertex3(this.x - v.x, this.y - v.y, this.z - v.z)
    }

    cross(v){
        return new Vertex3(this.y * v.z - this.z * v.y, this.z * v.x - this.x * v.z, this.x * v.y - this.y * v.x)
    }

    normalize(){
        var length = Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z)
        return new Vertex3(this.x / length, this.y / length, this.z / length)
    }

    copy() {
        return new Vertex3(this.x, this.y, this.z)
    }
}

const nnn = new Vertex3(-1.0, -1.0, -1.0).scalar(PROPORTION_FACTOR)
const nnp = new Vertex3(-1.0, -1.0, 1.0).scalar(PROPORTION_FACTOR)
const npn = new Vertex3(-1.0, 1.0, -1.0).scalar(PROPORTION_FACTOR)
const npp = new Vertex3(-1.0, 1.0, 1.0).scalar(PROPORTION_FACTOR)
const pnn = new Vertex3(1.0, -1.0, -1.0).scalar(PROPORTION_FACTOR)
const pnp = new Vertex3(1.0, -1.0, 1.0).scalar(PROPORTION_FACTOR)
const ppn = new Vertex3(1.0, 1.0, -1.0).scalar(PROPORTION_FACTOR)
const ppp = new Vertex3(1.0, 1.0, 1.0).scalar(PROPORTION_FACTOR)

const facesTextures = {
    // Front
    "FRONT" : [
        0.0,  0.0,
        1.0,  0.0,
        1.0,  1.0,
        0.0,  0.0,
        0.0,  1.0,
        1.0,  1.0,
    ],
    // Back
    "BACK" : [
        0.0,  1.0,
        0.0,  0.0,
        1.0,  0.0,
        0.0,  1.0,
        1.0,  0.0,
        1.0,  1.0,
    ],
    // Top
    "TOP" : [
        0.0,  0.0,
        1.0,  0.0,
        1.0,  1.0,
        0.0,  0.0,
        1.0,  1.0,
        0.0,  1.0,
    ],
    // Bottom
    "BOTTOM" : [
        1.0,  0.0,
        1.0,  1.0,
        0.0,  0.0,
        1.0,  1.0,
        0.0,  1.0,
        0.0,  0.0,
    ],
    // Right
    "RIGHT" : [
        1.0,  1.0,
        1.0,  0.0,
        0.0,  0.0,
        1.0,  1.0,
        0.0,  1.0,
        0.0,  0.0,
    ],
    // Left
    "LEFT" : [
        0.0,  0.0,
        0.0,  1.0,
        1.0,  1.0,
        1.0,  1.0,
        1.0,  0.0,
        0.0,  0.0,
    ],
    // Bottom
    "MIDDLE-BOTTOM-TOP" : [
        1.0,  0.0,
        1.0,  1.0,
        0.0,  0.0,
        1.0,  1.0,
        0.0,  1.0,
        0.0,  0.0,
    ],
    "MIDDLE-RIGHT-LEFT" : [
        1.0,  1.0,
        1.0,  0.0,
        0.0,  0.0,
        1.0,  1.0,
        0.0,  1.0,
        0.0,  0.0,
    ],
};

const facesNormals = {
    // Front
    "FRONT" : Array(6).fill(new Vertex3(0.0, 0.0, 1.0)),
    // Back
    "BACK" : Array(6).fill(new Vertex3(0.0, 0.0, 1.0)),
    // Top
    "TOP" : Array(6).fill(new Vertex3(0.0, 1.0, 0.0)),
    // Bottom
    "BOTTOM" : Array(6).fill(new Vertex3(0.0, -1.0, 0.0)),
    // Left
    "LEFT" : Array(6).fill(new Vertex3(-1.0, 0.0, 0.0)),
    // Right
    "RIGHT" : Array(6).fill(new Vertex3(1.0, 0.0, 0.0)),
    // Middle bottom top
    "MIDDLE-BOTTOM-TOP" : Array(6).fill(new Vertex3(0.0, -1.0, 0.0)),
    // Middle right left
    "MIDDLE-RIGHT-LEFT" : Array(6).fill(new Vertex3(1.0, 0.0, 0.0)),
};

const facesVertices = {
    "BACK" : [  
        // back - upper
        nnn, npn, ppn,
        // back - lower
        nnn, ppn, pnn,
    ],
    "FRONT" : [  
        // front - upper
        npp, nnp, pnp,
        // front - lower
        npp, ppp, pnp,
    ],
    "TOP" : [  
        // top - upper
        npn, ppn, ppp,
        // top - lower
        npn, ppp, npp,
    ],
    "BOTTOM" : [  
        // bottom - upper
        nnn, nnp, pnn,
        // bottom - lower
        nnp, pnp, pnn,
    ],
    "LEFT" : [  
        // left - upper
        npn, npp, nnp,
        // left - lower
        nnp, nnn, npn,
    ],
    "RIGHT" : [  
        // right - upper
        ppp, ppn, pnn,
        // right - lower
        ppp, pnp, pnn
    ],
    "MIDDLE-BOTTOM-TOP" : [  
        // bottom - upper
        new Vertex3(-1.0, 0, -1.0), new Vertex3(-1.0, 0, 1.0), new Vertex3(1.0, 0, -1.0),
        // bottom - lower
        new Vertex3(-1.0, 0, 1.0), new Vertex3(1.0, 0, 1.0), new Vertex3(1.0, 0, -1.0),
    ],
    "MIDDLE-RIGHT-LEFT" : [  
        // bottom - upper
        new Vertex3(0, 1.0, 1.0), new Vertex3(0, 1.0, -1.0), new Vertex3(0, -1.0, -1.0),
        // bottom - lower
        new Vertex3(0, 1.0, 1.0), new Vertex3(0, -1.0, 1.0), new Vertex3(0, -1.0, -1.0),
    ],
};

class GeometryObjectData {
    constructor() {
        this.faces = []
        this.scale = 1.0
        this.texture = []
    }

    withFaces(faces) {
        this.faces = faces
        return this
    }

    withScale(scale) {
        this.scale = scale
        return this
    }

    withTexture(texture) {
        this.texture = texture
        return this
    }

    toGeometryObject() {
        var vertices = this.faces.map(faceKey => facesVertices[faceKey]).flat().map(v => v.scalar(this.scale))
        var normals = this.faces.map(faceKey => facesNormals[faceKey]).flat()
        var textures = this.faces.map(faceKey => facesTextures[faceKey]).flat()

        return new GeometryObject(vertices, normals, textures)
    }
}

class GeometryObject {
    constructor(vertices, normals, textures) {
        this.vertices = vertices
        this.normals = normals
        this.textures = textures
    }

    copy() {
        return new GeometryObject(
            this.vertices.map(v => v.copy()), 
            this.normals.map(v => v.copy()), 
            this.textures.map(v => v))
    }

    translate(offset) {
        this.vertices = this.vertices.map(v => v.traslation(offset))
        return this
    }

    toMesh() {
        return [
            this.vertices.reduce((acc, v) => acc.concat([-v.x,v.y,-v.z]), []), 
            this.normals.reduce((acc, v) => acc.concat([-v.x,v.y,-v.z]), []),
            this.textures
        ]
    }
}

const wallGeometry = new GeometryObjectData()
    .withFaces(["BACK","FRONT","TOP","BOTTOM","LEFT","RIGHT"])
    .withScale(1.0)
    .toGeometryObject();

const pathGeometry = new GeometryObjectData()
    .withFaces(["BACK"])
    .withScale(1.0)
    .toGeometryObject();

const nullGeometry = new GeometryObjectData().toGeometryObject();

var doorsGeometry = {
    "S" : new GeometryObjectData()
        .withFaces(["MIDDLE-BOTTOM-TOP"])
        .withScale(1.0)
        .toGeometryObject(),
    "N" : new GeometryObjectData()
        .withFaces(["MIDDLE-BOTTOM-TOP"])
        .withScale(1.0)
        .toGeometryObject(),
    "E" : new GeometryObjectData()
        .withFaces(["MIDDLE-RIGHT-LEFT"])
        .withScale(1.0)
        .toGeometryObject(),
    "W" : new GeometryObjectData()
        .withFaces(["MIDDLE-RIGHT-LEFT"])
        .withScale(1.0)
        .toGeometryObject(),
};

const chestGeometry = new GeometryObjectData()
    .withFaces(["BACK","FRONT","TOP","BOTTOM","LEFT","RIGHT"])
    .withScale(0.5)
    .toGeometryObject();

const playerGeometry = new GeometryObjectData()
    .withFaces(["BACK"])
    .withScale(0.5)
    .toGeometryObject();

class MeshDrawerData {
    constructor(triangles, normals, textures){
        this.triangles = triangles
        this.normals = normals
        this.textures = textures
    }
}

class MazeGeometryMapper {
    constructor(){}
    
    convertMazeToGeometry(maze) {
        return [
            this.generateRoofGeometry(maze),
            this.generateWallsGeometry(maze),
            this.generateClosedDoorsGeometry(maze),
            this.generatePortalGeometry(maze),
            this.generateOpenDoorsGeometry(maze),
          //  this.generatePlayerGeometry(maze),
        ]
    }

    generateOffset(maze, x, y) {
        return new Vertex3(x*2 - maze.player.point.x*2, y*2 - maze.player.point.y*2, 0).scalar(PROPORTION_FACTOR)
    }

    generateGeometry(texID, maze, geoSource, entityApplies) {
        var triangles = []
        var normals = []
        var textures = []
        for(var y = 0; y < maze.height; y++){
            for(var x = 0; x < maze.width; x++){
                var offset = this.generateOffset(maze, x,y)
                if(entityApplies(maze, x, y)){
                    var [meshTriangles, meshNormals, meshTextures] = geoSource(maze, x, y).translate(offset).toMesh()
                    triangles.push(...meshTriangles)
                    normals.push(...meshNormals)
                    textures.push(...meshTextures)
                }
            }
        }
        
        return function(matrixMVP, matrixMV, matrixNormal) {
            if(triangles.length != 0){
                meshDrawer.setMesh(triangles, textures, normals)
                meshDrawer.draw(texID, matrixMVP, matrixMV, matrixNormal)
            }
        }
    }

    generateGeometryDrawer(texID, triangles, textures, normals) {
        return function(matrixMVP, matrixMV, matrixNormal) {
            if(triangles.length != 0){
                meshDrawer.setMesh(triangles, textures, normals)
                meshDrawer.draw(texID, matrixMVP, matrixMV, matrixNormal)
            }
        }
    }

    generateWallsGeometry(maze) {
        return this.generateGeometry(1, maze, (m, x, y) => m.cells[y][x].toGeometry(this), (m, x, y) => m.isWall(new Point(x, y)))
    }

    generatePlayerGeometry(maze) {
        var offset = this.generateOffset(maze, maze.player.point.x, maze.player.point.y)
        var [triangles, normals, textures] = playerGeometry.copy().translate(offset).toMesh()
        return this.generateGeometryDrawer(3, triangles, textures, normals)
    }

    generateClosedDoorsGeometry(maze) {
        return this.generateGeometry(2, maze, (m, x, y) => m.cells[y][x].toGeometry(this), (m, x, y) => m.isDoor(new Point(x, y)) && !m.cells[y][x].isOpen())
    }

    generateOpenDoorsGeometry(maze) {
        return this.generateGeometry(4, maze, (m, x, y) => m.cells[y][x].toGeometry(this), (m, x, y) => m.isDoor(new Point(x, y)) && m.cells[y][x].isOpen())
    }

    generateRoofGeometry(maze) {
        return this.generateGeometry(0, maze, (m, x, y) => pathGeometry.copy(), (m, x, y) => true)
    }

    generatePortalGeometry(maze) {
        return this.generateGeometry(3, maze, (m, x, y) => m.cells[y][x].toGeometry(this), (m, x, y) => m.isChest(new Point(x, y)))
    }

    mapToWall(wall) {
        return wallGeometry.copy()
    }

    mapToPath(path) {
        return nullGeometry.copy()
    }

    mapToDoor(door) {
        return doorsGeometry[door.direction].copy()
    }

    mapToChest(chest) {
        return chestGeometry.copy()
    }
}