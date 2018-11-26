attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec2 aTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform mat4 uNMatrix;

varying vec2 vTextureCoord;

uniform sampler2D uSampler;
uniform float heightScale;
uniform float timeFactor;
uniform float texscale;

void main() {
    vTextureCoord =  aTextureCoord;

    //vec4 color = texture2D(uSampler, aTextureCoord+(vec2(0.0, 1.0) * timeFactor *0.05));  
    vec3 color = vec3(aVertexPosition.x, aVertexPosition.y + texture2D(uSampler, aTextureCoord * texscale + timeFactor*0.02 )[0] * heightScale , aVertexPosition.z);
    gl_Position = uPMatrix * uMVMatrix * vec4(color, 1.0);
}