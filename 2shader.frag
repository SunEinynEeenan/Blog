<!DOCTYPE html>
<html>

<!-- load in glslCanvas from patrizio -->
<script type="text/javascript" src="https://rawgit.com/patriciogonzalezvivo/glslCanvas/master/dist/GlslCanvas.js"></script>


<body>

<h1>My First Heading</h1>

<div>

    <canvas class="glslCanvas"  data-fragment="

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

    void main () {
        vec2 st = gl_FragCoord.xy/u_resolution.xy;
        vec4 color = vec4(st.x,st.y,0.0,1.0);

        color = texture2D(u_tex0,st);

        gl_FragColor = color;
    }


    " data-textures="TandyLogo.png" width="500" height="500"></canvas>
<!-- //TandyLogo.png -->

</div>

<p>My first paragraph.</p>



</body>
</html>
