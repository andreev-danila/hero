const vertexShader = `
  uniform float time;
  uniform vec2 mouse;
  varying vec3 vPosition;
  varying vec3 vNormal;
  varying vec2 vUv;

  void main() {
    vPosition = position;
    vNormal = normal;
    vUv = uv;

    vec3 pos = position;
    pos.x += sin(pos.y * 10.0 + time * 2.0) * 0.05;
    pos.y += sin(pos.x * 10.0 + time * 2.0) * 0.05;
    pos.z += sin(pos.x * 10.0 + time * 2.0) * 0.05;

    vec4 modelPosition = modelMatrix * vec4(pos, 1.0);
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;

    gl_Position = projectedPosition;
  }
`;

const fragmentShader = `
  uniform float time;
  uniform vec2 mouse;
  uniform float hovered;
  varying vec3 vPosition;
  varying vec3 vNormal;
  varying vec2 vUv;

  vec3 palette( in float t, in vec3 a, in vec3 b, in vec3 c, in vec3 d ) {
    return a + b*cos( 6.28318*(c*t+d) );
  }

  void main() {
    vec3 color = palette(
      length(vUv - 0.5) + time * 0.1,
    vec3(0.5, 0.2, 0.8),
    vec3(0.4, 0.4, 0.6),
      vec3(1.0, 1.0, 1.0),
      vec3(0.0, 0.10, 0.20)
    );

    vec3 normal = normalize(vNormal);
    vec3 viewDir = normalize(cameraPosition - vPosition);
    float fresnel = pow(1.0 - dot(viewDir, normal), 3.0);

    color = mix(color, vec3(1.0), fresnel * 0.5);
    color = mix(color, color * 1.5, hovered * 0.5);

    gl_FragColor = vec4(color, 1.0);
  }
`;

export { vertexShader, fragmentShader };
