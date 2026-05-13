<script lang="ts">
	import { onMount } from 'svelte';
	import { Renderer, Program, Mesh, Triangle } from 'ogl';

	import fragment from '$lib/shaders/bg.frag?raw';

	const vertex = /* glsl */ `
        attribute vec2 position;
        void main() { gl_Position = vec4(position, 0.0, 1.0); }
    `;

	let canvas: HTMLCanvasElement;

	function readVar(name: string): [number, number, number] {
		const tmp = document.createElement('div');
		tmp.style.color = `var(${name})`;
		tmp.style.display = 'none';
		document.body.appendChild(tmp);
		const rgb = getComputedStyle(tmp).color;
		document.body.removeChild(tmp);
		const m = rgb.match(/[\d.]+/g);
		if (!m) return [0, 0, 0];
		return [+m[0] / 255, +m[1] / 255, +m[2] / 255];
	}

	onMount(() => {
		const renderer = new Renderer({
			canvas,
			alpha: false,
			dpr: Math.min(window.devicePixelRatio, 2)
		});
		const gl = renderer.gl;

		const program = new Program(gl, {
			vertex,
			fragment,
			uniforms: {
				u_time: { value: 0 },
				u_resolution: { value: [1, 1] },
				u_bg: { value: readVar('--bg') },
				u_glow: { value: readVar('--primary') }
			}
		});

		const mesh = new Mesh(gl, { geometry: new Triangle(gl), program });

		function resize() {
			renderer.setSize(window.innerWidth, window.innerHeight);
			program.uniforms.u_resolution.value = [gl.canvas.width, gl.canvas.height];
		}
		resize();
		window.addEventListener('resize', resize);

		// refresh colors when the theme changes
		const observer = new MutationObserver(() => {
			program.uniforms.u_bg.value = readVar('--bg');
			program.uniforms.u_glow.value = readVar('--primary');
		});
		observer.observe(document.documentElement, {
			attributes: true,
			attributeFilter: ['data-theme']
		});

		let raf = 0;
		const start = performance.now();
		function loop(t: number) {
			program.uniforms.u_time.value = (t - start) / 1000;
			renderer.render({ scene: mesh });
			raf = requestAnimationFrame(loop);
		}
		raf = requestAnimationFrame(loop);

		return () => {
			cancelAnimationFrame(raf);
			window.removeEventListener('resize', resize);
			observer.disconnect();
		};
	});
</script>

<canvas bind:this={canvas} class="absolute inset-0 -z-10 h-full w-full"></canvas>
