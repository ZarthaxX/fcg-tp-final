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
}

const nnn = new Vertex(-1.0, -1.0, -1.0)
const nnp = new Vertex(-1.0, -1.0, 1.0)
const npn = new Vertex(-1.0, 1.0, -1.0)
const npp = new Vertex(-1.0, 1.0, 1.0)
const pnn = new Vertex(1.0, -1.0, -1.0)
const pnp = new Vertex(1.0, -1.0, 1.0)
const ppn = new Vertex(1.0, 1.0, -1.0)
const ppp = new Vertex(1.0, 1.0, 1.0)

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
    // bottom - upper
    nnn, nnp, pnn,
    // bottom - lower
    nnp, pnp, pnn,
]

var doorsGeometry = {
    "S" : [  
        // back - upper
        nnn, npn, ppn,
        // back - lower
        nnn, ppn, pnn
    ],
    "N" : [  
        // front - upper
        npp, nnp, pnp,
        // front - lower
        npp, ppp, pnp,
    ],
    "E" : [  
        // left - upper
        npn, npp, nnp,
        // left - lower
        nnp, nnn, npn,
    ],
    "W" : [  
        // right - upper
        ppp, ppn, pnn,
        // right - lower
        ppp, pnp, pnn
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
        var objects = []
        for(var y = 0; y < maze.height; y++){
            for(var x = 0; x < maze.width; x++){
                var offset = new Vertex(x, y, 0)

                var objGeo = maze.cells[y][x].toGeometry(this)
                objects.push(objGeo.map(v => v.traslation(offset)))
            }
        }
        return objects.flat().reduce((acc, v) => acc.concat([v.x,v.y,v.z]), [])
    }

    mapToWall(wall) {
        return wallGeometry
    }

    mapToPath(path) {
        return pathGeometry
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