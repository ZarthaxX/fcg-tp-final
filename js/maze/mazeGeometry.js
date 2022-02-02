const PROPORTION_FACTOR = 0.1;

class Vertex {
    constructor(x, y, z){
        this.x = x
        this.y = y
        this.z = z
    }

    scalar(num) {
        return new Vertex(this.x * num, this.y * num, this.z * num)
    }

    traslation(v) {
        return new Vertex(this.x + v.x, this.y + v.y, this.z + v.z)
    }

    minus(v){
        return new Vertex(this.x - v.x, this.y - v.y, this.z - v.z)
    }

    cross(v){
        return new Vertex(this.x * v.z - this.z * v.y, this.z * v.x - this.x * v.z, this.x * v.y - this.y * v.x)
    }
}

const nnn = new Vertex(-1.0, -1.0, -1.0).scalar(PROPORTION_FACTOR)
const nnp = new Vertex(-1.0, -1.0, 1.0).scalar(PROPORTION_FACTOR)
const npn = new Vertex(-1.0, 1.0, -1.0).scalar(PROPORTION_FACTOR)
const npp = new Vertex(-1.0, 1.0, 1.0).scalar(PROPORTION_FACTOR)
const pnn = new Vertex(1.0, -1.0, -1.0).scalar(PROPORTION_FACTOR)
const pnp = new Vertex(1.0, -1.0, 1.0).scalar(PROPORTION_FACTOR)
const ppn = new Vertex(1.0, 1.0, -1.0).scalar(PROPORTION_FACTOR)
const ppp = new Vertex(1.0, 1.0, 1.0).scalar(PROPORTION_FACTOR)

const wallGeometry = [
    // back - upper
    nnn, npn, ppn,
    // back - lower
    nnn, ppn, pnn,
    // front - upper
    npp, nnp, pnp,
    // front - lower
    npp, ppp, pnp,
    // top - upper
    npn, ppn, ppp,
    // top - lower
    npn, ppp, npp,
    // bottom - upper
    nnn, nnp, pnn,
    // bottom - lower
    nnp, pnp, pnn,
    // left - upper
    npn, npp, nnp,
    // left - lower
    nnp, nnn, npn,
    // right - upper
    ppp, ppn, pnn,
    // right - lower
    ppp, pnp, pnn
]

const pathGeometry = [
    // back - upper
    nnn, npn, ppn,
    // back - lower
    nnn, ppn, pnn
]

var doorsGeometry = {
    "S" : [  
    // top - upper
    npn, ppn, ppp,
    // top - lower
    npn, ppp, npp
    ],
    "N" : [  
        // bottom - upper
        nnn, nnp, pnn,
        // bottom - lower
        nnp, pnp, pnn,
    ],
    "E" : [  
        // right - upper
        ppp, ppn, pnn,
        // right - lower
        ppp, pnp, pnn
    ],
    "W" : [  
    // left - upper
    npn, npp, nnp,
    // left - lower
    nnp, nnn, npn,
    ]
};

const chestGeometry = [
    // back - upper
    nnn, npn, ppn,
    // back - lower
    nnn, ppn, pnn,
    // front - upper
    npp, nnp, pnp,
    // front - lower
    npp, ppp, pnp,
    // top - upper
    npn, ppn, ppp,
    // top - lower
    npn, ppp, npp,
    // bottom - upper
    nnn, nnp, pnn,
    // bottom - lower
    nnp, pnp, pnn,
    // left - upper
    npn, npp, nnp,
    // left - lower
    nnp, nnn, npn,
    // right - upper
    ppp, ppn, pnn,
    // right - lower
    ppp, pnp, pnn
].map(v => v.scalar(0.5))

class MazeGeometryMapper {
    constructor(){}
    
    convertMazeToGeometry(maze) {
        var triangles = []
        var norms = []
        for(var y = 0; y < maze.height; y++){
            for(var x = 0; x < maze.width; x++){
                var offset = new Vertex(x*2, y*2, 0).scalar(PROPORTION_FACTOR)

                var objGeo = maze.cells[y][x].toGeometry(this)
                var translatedObjGeo = objGeo.map(v => v.traslation(offset))
                triangles.push(translatedObjGeo)
                norms.push(this.convertObjectGeometryToNorms(translatedObjGeo))
            }
        }
        
        var offset = new Vertex(maze.player.point.x*2, maze.player.point.y*2, 0).scalar(PROPORTION_FACTOR)

        var translatedObjGeo = chestGeometry.map(v => v.traslation(offset))
        triangles.push(translatedObjGeo)
        norms.push(this.convertObjectGeometryToNorms(translatedObjGeo))

        var [roofTriangles, roofNorms] = this.generateRoof(maze)
        triangles = triangles.concat(roofTriangles)
        roofNorms = norms.concat(roofNorms)
        return [triangles.flat().reduce((acc, v) => acc.concat([v.x,v.y,v.z]), []), norms.flat().reduce((acc, v) => acc.concat([v.x,v.y,v.z]), [])]
    }

    generateRoof(maze) {
        var triangles = []
        var norms = []
        for(var y = 0; y < maze.height; y++){
            for(var x = 0; x < maze.width; x++){
                var offset = new Vertex(x*2, y*2, 0).scalar(PROPORTION_FACTOR)

                var translatedObjGeo = pathGeometry.map(v => v.traslation(offset))
                triangles.push(translatedObjGeo)
                norms.push(this.convertObjectGeometryToNorms(translatedObjGeo))
            }
        }
        return [triangles, norms]
    }

    // this method takes an object geometry and calculates all the norms associated with the triangles of it
    convertObjectGeometryToNorms(objGeo) {
        var norms = []
        for(var i = 0;i < objGeo.length; i++) {
            if(i % 3 == 2 && i != 0){
                var [v1, v2, v3] = objGeo.slice(-3)
                var l1 = v1.minus(v2)
                var l2 = v2.minus(v1)
                var l3 = v1.minus(v3)
                norms.push(l1.cross(l2))
                norms.push(l2.cross(l3))
                norms.push(l3.cross(l1))
            }
        }
        return norms
    }
    
    mapToWall(wall) {
        return wallGeometry
    }

    mapToPath(path) {
        return []
    }

    mapToDoor(door) {
        if(door.state)
            return []
        return doorsGeometry[door.direction]
    }

    mapToChest(chest) {
        return chestGeometry
    }
}