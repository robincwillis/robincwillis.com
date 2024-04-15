const myShader = `
precision mediump float;

// Simplex noise functions (2D and 3D) by Stefan Gustavson
// https://gist.github.com/patriciogonzalezvivo/670c22f3966e662d2f83


uniform float iTime;
uniform vec2 iResolution;

vec3 mod289(vec3 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec2 mod289(vec2 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec3 permute(vec3 x) {
  return mod289(((x*32.0)+1.0)*x);
}

float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187,  // (3.0-sqrt(3.0))/6.0
                      0.366025403784439,  // 0.5*(sqrt(3.0)-1.0)
                     -0.577350269189626,  // -1.0 + 2.0 * C.x
                      0.024390243902439); // 1.0 / 41.0
  vec2 i  = floor(v + dot(v, C.yy));
  vec2 x0 = v -   i + dot(i, C.xx);

  vec2 i1;
  i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;

  i = mod289(i); // Avoid truncation effects in permutation
  vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
  + i.x + vec3(0.0, i1.x, 1.0 ));

  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
  m = m*m ;
  m = m*m ;

  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;

  m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );

  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

void main() {
  // Get the coordinates of the fragment
  vec2 uv = gl_FragCoord.xy / iResolution.xy;

  // Scale the coordinates to make the noise more or less visible
  uv *= iResolution.x * 200.0;

  // Generate Perlin noise
  float noiseValue = snoise(uv);

  // Define the range for the animation
  const float minValue = 0.0;
  const float maxValue = 1.0;

  float animationValue = 0.5 * (sin(iTime) + 1.0);
    
  // Map the value to the desired range
  float animatedValue = mix(minValue, maxValue, animationValue);

  // Add some bias and scale to adjust the texture
  float bias = 0.0;
  float scale = 0.45;
// float bias = 2.5;
// float scale = 2.95;
  float stuccoValue = bias + scale * noiseValue;

  // gl_FragColor = vec4(animatedValue, animatedValue, animatedValue, 1.0);

  // Output the stucco texture
  // gl_FragColor = vec4(0.0, 0.0, 0.0, stuccoValue);
  // gl_FragColor = vec4(vec3(stuccoValue), 0.5);

    gl_FragColor = vec4(0.0, 0.0, 0.0, stuccoValue);
}
`

export default myShader