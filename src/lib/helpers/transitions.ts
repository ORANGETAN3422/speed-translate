import { cubicOut } from 'svelte/easing';
import { cubicIn } from 'svelte/easing';
import { fly as svelteFly, fade as svelteFade } from 'svelte/transition';
import type { FlyParams, FadeParams } from 'svelte/transition';
import { config } from '$lib/helpers/config.svelte';

export function fly(node: Element, params?: FlyParams) {
	if (config.disableAnimations) return { duration: 0, delay: 0 };
	return svelteFly(node, params);
}

export function fade(node: Element, params?: FadeParams) {
	if (config.disableAnimations) return { duration: 0, delay: 0 };
	return svelteFade(node, params);
}

export function flyRotate(
	node: Element,
	{
		delay = 0,
		duration = 400,
		easing = cubicOut,
		x = 0,
		y = 0,
		opacity = 0,
		rotate = 0
	}: {
		delay?: number;
		duration?: number;
		easing?: (t: number) => number;
		x?: number;
		y?: number;
		opacity?: number;
		rotate?: number;
	} = {}
) {
	if (config.disableAnimations) return { duration: 0, delay: 0 };
	const style = getComputedStyle(node);
	const target_opacity = +style.opacity;
	const transform = style.transform === 'none' ? '' : style.transform;
	const od = target_opacity - opacity;

	return {
		delay,
		duration,
		easing,
		css: (t: number, u: number) =>
			`transform: ${transform} translate(${(1 - t) * x}px, ${(1 - t) * y}px) rotate(${(1 - t) * rotate}deg);` +
			`opacity: ${target_opacity - od * u};`
	};
}

export function osuDeath(
	node: Element,
	{
		delay = 0,
		duration = 400,
		easing = cubicIn,
		x = 0,
		y = 0,
		opacity = 0,
		rotate = 25
	}: {
		delay?: number;
		duration?: number;
		easing?: (t: number) => number;
		x?: number;
		y?: number;
		opacity?: number;
		rotate?: number;
	} = {}
) {
	if (config.disableAnimations) return { duration: 0, delay: 0 };
	const style = getComputedStyle(node);
	const target_opacity = +style.opacity;
	const transform = style.transform === 'none' ? '' : style.transform;
	const od = target_opacity - opacity;

	const rotation = Math.random() * (2 * rotate) - rotate;

	return {
		delay,
		duration,
		easing,
		css: (t: number, u: number) =>
			`transform: ${transform} translate(${(1 - t) * x}px, ${(1 - t) * y}px) rotate(${(1 - t) * rotation}deg);` +
			`opacity: ${target_opacity - od * u};`
	};
}
