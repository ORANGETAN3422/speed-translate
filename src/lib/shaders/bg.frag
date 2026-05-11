precision highp float;

uniform float u_time;
uniform vec2  u_resolution;
uniform vec3  u_bg;       // theme --bg
uniform vec3  u_glow;     // theme --primary

float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}
float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(
        mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), u.x),
        mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
        u.y
    );
}
float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    for (int i = 0; i < 5; i++) {
        v += a * noise(p);
        p *= 2.02;
        a *= 0.5;
    }
    return v;
}

void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    vec2 p  = (gl_FragCoord.xy - 0.5 * u_resolution.xy) / u_resolution.y;

    float t = u_time * 0.04;

    vec2  q = vec2(fbm(p * 1.2 + vec2(t, -t)), fbm(p * 1.2 + vec2(-t, t * 0.7)));
    float fog = fbm(p * 1.8 + q * 1.5 + t);

    float g = 0.0;
    for (int i = 0; i < 3; i++) {
        float fi = float(i);
        vec2 c = vec2(
            sin(u_time * 0.07 + fi * 2.1) * 0.55,
            cos(u_time * 0.05 + fi * 1.7) * 0.35
        );
        float d = length(p - c);
        g += 0.18 / (d * d + 0.06);
    }
    g *= 0.18;

    vec3 col = u_bg;

    col = mix(col, u_glow, smoothstep(0.4, 0.9, fog) * -0.08);
    col += u_glow * g * -0.07;
    float vig = smoothstep(1.3, 0.6, length(uv - 0.5));

    col *= mix(0.92, 1.0, vig);

    float grain = (hash(gl_FragCoord.xy + u_time) - 0.5) * 0.008;
    col += grain;

    gl_FragColor = vec4(col, 1.0);
}
