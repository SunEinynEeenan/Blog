// Author:
// Title:

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

vec3 color = vec3 (1.,1.,0.);

void main () {

    gl_FragColor = vec4(color, 1.0);
}
