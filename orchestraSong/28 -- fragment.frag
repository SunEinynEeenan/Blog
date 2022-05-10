// Author @patriciogv - 2015
// http://patriciogonzalezvivo.com

#ifdef GL_ES
precision mediump float;
#endif

uniform sampler2D u_tex0;
uniform vec2 u_tex0Resolution;

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

vec2 normMouse = u_mouse/u_resolution;



void main()
{
gl_FragColor = vec4(normMouse,0.8,1.0);
}
