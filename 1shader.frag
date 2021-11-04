#ifdef GL_ES
precision highp float;
#endif

#define PI 3.1415926535
#define HALF_PI 1.57079632679

const float MAX = 10000.0;

uniform vec2 u_resolution;
uniform float u_time;
uniform vec2 u_mouse;

uniform sampler2D u_tex0;
uniform vec2 u_tex0Resolution;

// ray intersects sphere
// e = -b +/- sqrt( b^2 - c )
vec2 ray_vs_sphere( vec3 p, vec3 dir, float r ) {
	float b = dot( p, dir );
	float c = dot( p, p ) - r * r;

	float d = b * b - c;
	if ( d < 0.0 ) {
		return vec2( MAX, -MAX );
	}
	d = sqrt( d );

	return vec2( -b - d, -b + d );
}

// scatter const
const float R_INNER = 0.076;
const float R = R_INNER + 0.08;
//R_SPHERE Is border b/w outside and boolean
const float R_SPHERE = R_INNER - 0.08;

//noramlized mouse position
vec2 interact =u_mouse/u_resolution.xy;

const int NUM_IN_SCATTER = 100;


float saturate(float x)
{
    return clamp(x, 0.0, 1.0);
}

vec3 saturate(vec3 v)
{
    return clamp(v, vec3(0), vec3(1.));
}

float rand(vec2 coord)
{
    return saturate(fract(sin(dot(coord, vec2(12.9898, 78.223))) * 43758.5453));
}

//declare arguemnts/inputs!
vec3 in_scatter(vec3 o, vec3 dir, vec2 e, vec3 l, float dither) {


    //e.y is far intersection bw ray and sphere
    //e.x is close -- the one we want
    //len is steplegnth
	float len = (e.y - e.x) / float(NUM_IN_SCATTER);
    //s is step
    	//step is in a direction and has a sample legnth
    vec3 s = dir * len;

    // o = origin = eye
    //dither is rattling the ray a little randomly to get rid of aliasing
    //if set to 0 it aliases
	vec3 v = o + (dir * (e.x + dither*0.02));

    //making a new vec3 -- initiallizing scatter which will be defined in the
    //next function
    //light accumulate
    vec3 scatter = vec3(0.);

    //hologram style
    for (int i = 0; i < NUM_IN_SCATTER; i++)
    {
        float distanceToSurface = abs(length(v) - R_INNER);


        //.1 is how sphere is visible thru lines
        //
        if (fract(v.y * 1000.344 - u_time) < 0.03){

        if (distanceToSurface < 0.0003)
        {
            scatter += vec3(.3,.5,.1);
        }
        }

        //if v ( point im looking at thats gittering/dithering around) is less R_INNER
        if (v.y < -0.064 && length(v) < R_INNER + R_SPHERE)
        {
            // the float we're multiplying by
            //is intensity slider ... 1. is fully opaque
            //lower is a bit transparent
            scatter += vec3(1., 0., 0.)*interact.x;
        }

        if (v.y > 0.064 && length(v) < R_INNER + R_SPHERE)
        {
            scatter += vec3(1., 0., 0.)*interact.x;
        }

        v += s;

	}

    //color correction
	// return scatter*vec3(.1, 0.6, .02);
    return scatter*vec3(interact, .02);

}

// angle : pitch, yaw
mat3 rot3xy( vec2 angle ) {
	vec2 c = cos( angle );
	vec2 s = sin( angle );

	return mat3(
		c.y      ,  0.0, -s.y,
		s.y * s.x,  c.x,  c.y * s.x,
		s.y * c.x, -s.x,  c.y * c.x
	);
}

// ray direction
vec3 ray_dir(float fov, vec2 size, vec2 pos) {
	vec2 xy = pos - size * 0.5;

	float cot_half_fov = tan( radians( 90.0 - fov * 0.5 ) );
	float z = size.y * 0.5 * cot_half_fov;

	return normalize(vec3( xy, -z ));
}

void main()
{
	// default ray dir
	vec3 dir = ray_dir(5., u_resolution.xy, gl_FragCoord.xy);

	// default ray origin
	vec3 eye = vec3( 0.0, 0.0, 3.0 );

	// rotate camera
    vec2 normalizedMouse = ((u_mouse.xy/u_resolution.xy)-vec2(0.5, 0.5))*2.;

    mat3 rot = rot3xy(vec2(0.000,-0.130));

	dir = rot * dir;
	eye = rot * eye;

    //random number based on pixelcoord
    // need pixel location so it has to be in main to have access to it
	float dither = rand(gl_FragCoord.xy/u_resolution.xy + sin(u_time * 1.0) );
	// sun light dir
	vec3 l = vec3(0.0, 0.0, 1.0);

	vec2 e = ray_vs_sphere( eye, dir, R );
	if ( e.x > e.y ) {
		gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
        return;
	}

	vec3 I = in_scatter( eye, dir, e, l, dither);

	gl_FragColor = vec4(pow( I, vec3( 1.0 / 2.2 ) ), 1.0 );

}
