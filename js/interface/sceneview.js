function GetModelViewMatrix(translationX, translationY, translationZ, rotationX, rotationY)
{
	var rotXMatrix = [
		1, 0, 0, 0,
		0, Math.cos(rotationX), Math.sin(rotationX), 0,
		0, -Math.sin(rotationX), Math.cos(rotationX), 0,
		0, 0, 0, 1
	];
	var rotYMatrix = [
		Math.cos(rotationY), 0, -Math.sin(rotationY), 0,
		0, 1, 0, 0,
		Math.sin(rotationY), 0, Math.cos(rotationY), 0,
		0, 0, 0, 1
	];
	// Matriz de traslación
	var trans = [
		1, 0, 0, 0,
		0, 1, 0, 0,
		0, 0, 1, 0,
		translationX, translationY, translationZ, 1
	];

	var mvp = MatrixMult(trans, MatrixMult(rotYMatrix, rotXMatrix));
	return mvp;
}

function getCameraMatrix(position, target, worldUp) {

	var P = position;
	var D = P.minus(target).normalize();
	var R = worldUp.cross(D).normalize();
	var U = D.cross(R).normalize();

	//Column-Major
	var left = [
		R.x, U.x, D.x, 0,
		R.y, U.y, D.y, 0,
		R.z, U.z, D.z, 0,
		0, 0, 0, 1
	];

	var right = [
		1, 0, 0, 0,
		0, 1, 0, 0,
		0, 0, 1, 0,
		P.x, -P.y, -P.z, 1
	];

	return MatrixMult(left, right);
}

class MeshDrawer
{
	// El constructor es donde nos encargamos de realizar las inicializaciones necesarias. 
	constructor()
	{
		this.prog   = InitShaderProgram(meshVS, meshFS);

		this.lightEnabled = gl.getUniformLocation(this.prog, 'lightEnabled');

		this.sampler = gl.getUniformLocation(this.prog, 'texGPU');

		this.lightDir = gl.getUniformLocation(this.prog, 'lightDir');
		this.alpha = gl.getUniformLocation(this.prog, 'alpha');
		this.mvp = gl.getUniformLocation(this.prog, 'mvp');
		this.mv = gl.getUniformLocation(this.prog, 'mv');
		this.mn = gl.getUniformLocation(this.prog, 'mn');

		this.vert = gl.getAttribLocation(this.prog, 'pos');
		this.texCoord = gl.getAttribLocation(this.prog, 'tc');
		this.normal = gl.getAttribLocation(this.prog, 'norm');

		this.bufferPos = gl.createBuffer();
		this.bufferText = gl.createBuffer();
		this.bufferNorm = gl.createBuffer();
		this.textures = []; 
		
	}
	
	static getNextID() {
		return this.meshCounter++;
	}

	setMesh(vertPos, texCoords, normals)
	{
		this.numTriangles = vertPos.length / 3 / 3;

		gl.bindBuffer(gl.ARRAY_BUFFER, this.bufferPos);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertPos), gl.STATIC_DRAW);
		
		gl.bindBuffer(gl.ARRAY_BUFFER, this.bufferText);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texCoords), gl.STATIC_DRAW);

		gl.bindBuffer(gl.ARRAY_BUFFER, this.bufferNorm);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);
	}
	
	draw(texID, matrixMVP, matrixMV, matrixNormal)
	{
		gl.useProgram(this.prog);
		
		gl.uniformMatrix4fv(this.mvp, false, matrixMVP);
		gl.uniformMatrix4fv(this.mv, false, matrixMV);
		gl.uniformMatrix3fv(this.mn, false, matrixNormal);
		
		gl.bindBuffer(gl.ARRAY_BUFFER, this.bufferPos);
		gl.vertexAttribPointer(this.vert, 3, gl.FLOAT, false, 0, 0);
		gl.enableVertexAttribArray(this.vert);
		
		gl.bindBuffer(gl.ARRAY_BUFFER, this.bufferText);
		gl.vertexAttribPointer(this.texCoord, 2, gl.FLOAT, false, 0, 0);
		gl.enableVertexAttribArray(this.texCoord);

		gl.bindBuffer(gl.ARRAY_BUFFER, this.bufferNorm);
		gl.vertexAttribPointer(this.normal, 3, gl.FLOAT, false, 0, 0);
		gl.enableVertexAttribArray(this.normal);

		// set which texture units to render with.
		gl.uniform1i(this.sampler, 0);  // texture unit 0

		// Set each texture unit to use a particular texture.
		gl.activeTexture(gl.TEXTURE0);
		gl.bindTexture(gl.TEXTURE_2D, this.textures[texID]);
		// Set texture ID to use in shader
		gl.uniform1i(this.texID, texID); 

		gl.drawArrays(gl.TRIANGLES, 0, this.numTriangles * 3);
	}
	
	setTextures(textures)
	{
		this.textures = textures
	}

	// Este método se llama al actualizar la dirección de la luz desde la interfaz
	setLightDir(x, y, z)
	{			
		gl.useProgram(this.prog);
		gl.uniform3f(this.lightDir, x, y, z);
	}
	
	setLight(value) 
	{		
		gl.useProgram(this.prog);
		if(value) gl.uniform1i(this.lightEnabled, 1);
		else gl.uniform1i(this.lightEnabled, 0);
	}

	// Este método se llama al actualizar el brillo del material 
	setShininess(shininess)
	{				
		gl.useProgram(this.prog);
		gl.uniform1f(this.alpha, shininess); 
	}
}

// Vertex Shader
var meshVS = `

	attribute vec3 pos;
	attribute vec2 tc;
	attribute vec3 norm;

	uniform mat4 mvp;
	uniform mat4 mv;

	varying vec2 texCoord;
	varying vec3 normCoord;
	varying vec3 vertCoord;

	void main()
	{ 	
		texCoord = tc;
		normCoord = norm;
		vertCoord = (-mv * vec4(pos, 1.0)).xyz;
		
		gl_Position = mvp * vec4(pos,1);
	}
`;

// Fragment Shader
var meshFS = `
	uniform bool lightEnabled;

	precision mediump float;
	
	uniform sampler2D texGPU;
	uniform vec3 lightDir;
	uniform float alpha;
	uniform mat3 mn;

	varying vec2 texCoord;
	varying vec3 normCoord;
	varying vec3 vertCoord;

	void main()
	{	
		gl_FragColor = texture2D(texGPU, texCoord);
		
		if(gl_FragColor.a < 0.5)
			discard;

		vec4 kd = gl_FragColor;
		vec4 ks = vec4(1.0, 1.0, 1.0, 1.0);
		vec3 l = normalize(lightDir);
		vec3 v = normalize(vertCoord);
		vec3 n = normalize(mn * (normalize(normCoord)));
		vec3 h = normalize(v + l);
		float cosTheta = dot(n, l);
		float cosOmega = dot(n, h);

		if(lightEnabled)
			gl_FragColor =  
				vec4(1.0, 1.0, 1.0, 1.0) *
				max(0.0, cosTheta) *
				(kd + (ks * pow(max(0.0, cosOmega), alpha) / cosTheta));
		gl_FragColor.w = 1.0;
	}
`;
