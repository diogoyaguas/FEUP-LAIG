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

void main() {
    vec4 color = texture2D(uSampler, aTextureCoord+(vec2(0.0, 1.0) * timeFactor *0.05));  
    float height = (color.r + color.g + color.b) / 3.0;  
    gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition + vec3(0.0, 1.0, 0.0)*height*heightScale, 1.0);
}