#ifdef GL_ES
precision highp float;
#endif

varying vec2 vTextureCoord;
uniform sampler2D uSampler2;
uniform float texscale;

void main() {
	gl_FragColor = texture2D(uSampler2, vTextureCoord * texscale);
}
