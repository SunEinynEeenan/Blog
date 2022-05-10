

// Author:
// Title:

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;


int max_iters = 500;
float max_dist = 1000.0;
vec3 bg_col = vec3(0., 0., 0.);
vec3 fg_col = vec3(1.000,0.046,0.653);

/**
 * Rotation matrix from angles
 */
mat3 rotateX(float theta) {
    float c = cos(theta);
    float s = sin(theta);
    return mat3(
        vec3(1, 0, 0),
        vec3(0, c, s),
        vec3(0, -s, c)
    );
}
mat3 rotateY(float theta) {
    float c = cos(theta);
    float s = sin(theta);
    return mat3(
        vec3(c, 0, s),
        vec3(0, 1, 0),
        vec3(-s, 0, c)
    );
}

//the signed distance field function
//used in the ray march loop
float sdf(vec3 p) {
    //a sphere of radius 1.
    return length( p ) - 1.;
}

void main (){

//1 : retrieve the fragment's coordinates
	vec2 uv = ( gl_FragCoord.xy / u_resolution.xy ) * 2.0 - 1.0;
	//preserve aspect ratio
	uv.x *= u_resolution.x / u_resolution.y;


//2 : camera position and ray direction
	vec3 pos = vec3( 2.0, 2.0,-20.);
	vec3 dir = normalize( vec3( uv, 3.0 ) );

    vec2 mos = (u_mouse.xy / u_resolution.xy) - vec2(0.5);
    // pos = rotateY(u_time / 6.0) * pos;
    dir = rotateY(mos.x * 3.0*mod((sin(u_time/10.)),360.)) * rotateX(mos.y * 3.0*mod(sin(u_time/10.),360.)) * dir;

//3 : ray march loop
    //ip will store final color
	vec3 col = bg_col;

	//variable step size
	float t = 0.0;
    int i = 0;
	for (  int i = 0;  i < 303; i++) {
        //update position along path
        vec3 ip = pos + dir * t;

        //gets the shortest distance to the scene
        float m = 4.0;
        ip = abs(mod(ip - m*0.5, m) - m*0.5);
		float d = sdf( ip )+(((sin(u_time)+1.))/21.)+.85;

        //break the loop if the distance was too small
        //this means that we are close enough to the surface
        if (d < 0.01) {
            float a = float(i) / float(max_iters);
            float diffuse = dot(ip, vec3(0.6, 0.8, 0.0))*0.5 + 0.5;
            col = fg_col * diffuse * (1.0 - a) + bg_col * a;
        	// col = fg_col * diffuse * (1.0 - a) + bg_col * a;

            break;
        }

		//increment the step along the ray path
		t += d;

        //break if too far
        if (t > max_dist) {

            break;
        }
	}

  col/=vec3(uv,.1);




//4 : apply color to this fragment
	gl_FragColor = vec4(col, 1.0);

}
