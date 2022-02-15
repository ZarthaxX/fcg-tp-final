// Estructuras globales e inicializaciones
var meshDrawer;         // clase para contener el comportamiento de la malla
var meshFloor;
var canvas, gl;         // canvas y contexto WebGL
var perspectiveMatrix;	// matriz de perspectiva
var camera;
var direction
// Euler angles
var yaw = 90;
var pitch = 0;
var upperViewEnabled = false;
var fov_angle = 60
var rotX=0, rotY=0, transZ=0.2, autorot=0;
var textures = [];
var focusingCanvas = false;

function OnMouseEnter() {
	focusingCanvas=true;
}

function OnMouseLeave() {
	focusingCanvas=false;
}

class Camera {

	constructor() {
		this.cameraPos = new Vertex3(0.0, 0.0, 0.0);
		this.cameraFront = new Vertex3(0.0, 1.0, 0.0);
		this.cameraUp = new Vertex3(0.0, 0.0, -1.0);
	}

	setPosition(pos) {
		this.cameraPos = pos;
	}

	setFront(front) {
		this.cameraFront = front;
	}

	setUpVector(up) {
		this.cameraUp = up;
	}
}

// Funcion de inicialización, se llama al cargar la página
function InitWebGL()
{
	camera = new Camera();
	direction = new Vertex3(directionsVec[SOUTH].x,directionsVec[SOUTH].y,0)
	// Inicializamos el canvas WebGL
	canvas = document.getElementById("canvas");
	canvas.oncontextmenu = function() {return false;};
	gl = canvas.getContext("webgl", {antialias: false, depth: true});	
	if (!gl) 
	{
		alert("Imposible inicializar WebGL. Tu navegador quizás no lo soporte.");
		return;
	}
	
	// Inicializar color clear
	gl.clearColor(0,0,0,0);
	gl.enable(gl.DEPTH_TEST); // habilitar test de profundidad 
	
	meshDrawer = new MeshDrawer();
	loadImages([floorTexture, wallTexture, closedDoorTexture, portalTexture, openDoorTexture], (images) => {
		// create 2 textures
		for (var ii = 0; ii < images.length; ii++) {
			var texture = gl.createTexture();
			gl.bindTexture(gl.TEXTURE_2D, texture);
		
			// Upload the image into the texture.
			gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, images[ii]);
		
			// Set the parameters so we can render any size image.
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

			// add the texture to the array of textures.
			textures.push(texture);
		}
		meshDrawer.setTextures(textures)
		UpdateCanvasSize();
		initGame();
		DrawScene();
	});

}

function UpdateCanvasSize()
{
	canvas.style.width  = "100%";
	canvas.style.height = "100%";

	const pixelRatio = window.devicePixelRatio || 1;
	canvas.width  = pixelRatio * canvas.clientWidth;
	canvas.height = pixelRatio * canvas.clientHeight;

	const width  = (canvas.width  / pixelRatio);
	const height = (canvas.height / pixelRatio);

	canvas.style.width  = width  + 'px';
	canvas.style.height = height + 'px';
	
	gl.viewport( 0, 0, canvas.width, canvas.height );

	UpdateProjectionMatrix();
}

function DrawScene()
{
	// si el maze no fue creado no renderizamos la escena
	if(maze == undefined)
		return
	width = maze.width
	height = maze.height
	currentPos = maze.player.point
	currentDir = maze.player.direction
	// Obtenemos las matrices de transformación de la camara
	camera.setPosition(new Vertex3(0, 0, 0));
	cameraMatrix = getCameraMatrix(camera.cameraPos, camera.cameraFront.traslation(camera.cameraPos) , camera.cameraUp);
	// obtenemos la model view matrix
	var mv  = GetModelViewMatrix( 0,0, transZ, rotX, autorot+rotY );
	var view = MatrixMult(cameraMatrix, mv)
	
	//calculamos la model view projection matrix dependiendo si estamos usando la vista superior o no
	var mvp
	if(upperViewEnabled){
		mvp = MatrixMult( perspectiveMatrix, mv);
	}else {
		mvp = MatrixMult( perspectiveMatrix, view);
	}

	gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT );
	
	// Dibujamos los objetos
	var nrmTrans = [ mv[0],mv[1],mv[2], mv[4],mv[5],mv[6], mv[8],mv[9],mv[10] ];
	if(mazeDrawers != undefined)
	for(var i = 0; i < mazeDrawers.length; i++) {
		mazeDrawers[i](mvp, mv, nrmTrans);
	}

}


// Función que compila los shaders que se le pasan por parámetro (vertex & fragment shaders)
// Recibe los strings de cada shader y retorna un programa
function InitShaderProgram( vsSource, fsSource, wgl=gl )
{
	// Función que compila cada shader individualmente
	const vs = CompileShader( wgl.VERTEX_SHADER,   vsSource, wgl );
	const fs = CompileShader( wgl.FRAGMENT_SHADER, fsSource, wgl );

	// Crea y linkea el programa 
	const prog = wgl.createProgram();
	wgl.attachShader(prog, vs);
	wgl.attachShader(prog, fs);
	wgl.linkProgram(prog);

	if (!wgl.getProgramParameter(prog, wgl.LINK_STATUS)) 
	{
		alert('No se pudo inicializar el programa: ' + wgl.getProgramInfoLog(prog));
		return null;
	}
	return prog;
}

function CompileShader( type, source, wgl=gl )
{
	const shader = wgl.createShader(type);

	wgl.shaderSource(shader, source);
	wgl.compileShader(shader);

	if (!wgl.getShaderParameter( shader, wgl.COMPILE_STATUS) ) 
	{
		alert('Ocurrió un error durante la compilación del shader:' + wgl.getShaderInfoLog(shader));
		wgl.deleteShader(shader);
		return null;
	}

	return shader;
}

function MatrixMult( A, B )
{
	var C = [];
	for ( var i=0; i<4; ++i ) 
	{
		for ( var j=0; j<4; ++j ) 
		{
			var v = 0;
			for ( var k=0; k<4; ++k ) 
			{
				v += A[j+4*k] * B[k+4*i];
			}

			C.push(v);
		}
	}
	return C;
}

// ======== Funciones para el control de la interfaz ========
// Al cargar la página
window.onload = function() 
{
	InitWebGL();
	canvas.zoom = function( s ) 
	{
		if(upperViewEnabled) transZ *= Math.pow(s/canvas.height + 1.0, 5);
		UpdateProjectionMatrix();
		DrawScene();
	}
	canvas.onwheel = function() { canvas.zoom(0.3*event.deltaY); }
	canvas.onmouseup = canvas.onmouseleave = function(){canvas.onmousemove = null;}

	// registramos si el mouse esta apretado
	var mouseDown = 0;
	document.body.onmousedown = function() {
		if(mouseDown == 0){
			mouseDown = 1;
		}
	}
	document.body.onmouseup = function() {
		if(mouseDown == 1){
			mouseDown = 0;
		}
	}

	document.addEventListener('mousemove', (event) => {
		mouseSensitivity = 0.05;
		xoffset = event.movementX * mouseSensitivity;
		yoffset = event.movementY * mouseSensitivity;
		
		if(mouseDown && focusingCanvas){
			rotateByEulerAngle(xoffset, yoffset)
		}
	});
	
};
// Evento resize
function WindowResize()
{
	UpdateCanvasSize();
	DrawScene();
}

function SetShininess( param )
{
	var exp = param.value;
	var s = Math.pow(10,exp/25);
	document.getElementById('shininess-value').innerText = s.toFixed( s < 10 ? 2 : 0 );
}

function SetMaxHeight(param)
{
	MAX_HEIGHT = parseInt(param.value, 10);
	document.getElementById('max-height-value').innerText = MAX_HEIGHT;
	document.getElementById('max-height').value = MAX_HEIGHT;
	if(MIN_HEIGHT > MAX_HEIGHT){
		SetMinHeight({value: MAX_HEIGHT.toString()});
	}
}

function SetMaxWidth( param )
{
	MAX_WIDTH = parseInt(param.value, 10);
	document.getElementById('max-width-value').innerText = MAX_WIDTH;
	document.getElementById('max-width').value = MAX_WIDTH;
	if(MIN_WIDTH > MAX_WIDTH){
		SetMinWidth({value: MAX_WIDTH.toString()});
	}
}

function SetMinHeight(param)
{
	MIN_HEIGHT = parseInt(param.value, 10);
	document.getElementById('min-height-value').innerText = MIN_HEIGHT;
	document.getElementById('min-height').value = MIN_HEIGHT;
	if(MIN_HEIGHT > MAX_HEIGHT){
		SetMaxHeight({value: MIN_HEIGHT.toString()});
	}
}

function SetMinWidth( param )
{
	MIN_WIDTH = parseInt(param.value, 10);
	document.getElementById('min-width-value').innerText = MIN_WIDTH;
	document.getElementById('min-width').value = MIN_WIDTH;
	if(MIN_WIDTH > MAX_WIDTH){
		SetMaxWidth({value: MIN_WIDTH.toString()});
	}
}

function SetDoorRatio( param )
{
	DOOR_RATIO = parseInt(param.value, 10) / 100.0;
	document.getElementById('door-ratio-value').innerText = DOOR_RATIO;
}

function ResetMaze( param ) {
	initGame()
	DrawScene()
}

// ======== Funciones auxiliares ========
function loadImage(url, callback) {
	var image = new Image();
	image.src = url;
	image.onload = callback;
	return image;
  }
  
function loadImages(urls, callback) {
	var images = [];
	var imagesToLoad = urls.length;

	// Called each time an image finished
	// loading.
	var onImageLoad = function() {
		--imagesToLoad;
		// If all the images are loaded call the callback.
		if (imagesToLoad === 0) {
		callback(images);
		}
	};

	for (var ii = 0; ii < imagesToLoad; ++ii) {
		var image = loadImage(urls[ii], onImageLoad);
		images.push(image);
	}
}

function ProjectionMatrix( c )
{
	var r = c.width / c.height;
	var n = 0.1;
	var f = 100;
	var fov = 3.145 * fov_angle / 180;
	var s = 1 / Math.tan( fov/2 );
	
	return [
		s/r, 0, 0, 0,
		0, s, 0, 0,
		0, 0, (n+f)/(f-n), 1,
		0, 0, -2*n*f/(f-n), 0
	];
}

function UpdateProjectionMatrix()
{
	perspectiveMatrix = ProjectionMatrix( canvas, transZ );
}

function rotateByEulerAngle(xoffset, yoffset){
	yaw += xoffset;
	pitch += yoffset;

	yaw_radians = yaw * (Math.PI / 180);
	pitch_radians = pitch * (Math.PI / 180);

	direction.x = Math.cos(yaw_radians) * Math.cos(pitch_radians);
	direction.y = Math.sin(yaw_radians) * Math.cos(pitch_radians);
	direction.z = - Math.sin(pitch_radians);
	camera.setFront(direction.normalize());
	console.log("dir: ",direction.normalize(), " yaw: ", yaw, " pitch: ", pitch);
	UpdateProjectionMatrix();
	DrawScene();
	//ugly hack to change player direction when camera moves
	maze.changePlayerDirection(getDir(NORTH))
}

function setUpperView(item){
	upperViewEnabled = item.checked;
	if(!upperViewEnabled) transZ = 0.2
	if(upperViewEnabled) fov_angle = 60;
	else fov_angle = 60;
	DrawScene();
}
