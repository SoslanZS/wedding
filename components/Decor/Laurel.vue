<script setup>
	// A dusty-blue lace garland that dips to the centre — sits along the top
	// edge of the invitation / envelope flap, framing the wax seal.

	// variables — daisy + leaf placements along each half of the swag.
	// t: 0 near the centre dip .. 1 at the outer tip.
	const spots = [0.08, 0.17, 0.26, 0.35, 0.44, 0.53, 0.62, 0.71, 0.8, 0.88, 0.95];

	// A point on the swag guide for a given side (dir = -1 left / 1 right) and t.
	const pointAt = (dir, t) => {
		const x = 200 + dir * (18 + t * 178);
		const y = 96 - Math.pow(t, 1.5) * 70;
		return { x: +x.toFixed(2), y: +y.toFixed(2) };
	};

	const leafTransform = (dir, t) => {
		const p = pointAt(dir, t);
		const rot = dir * (24 + t * 44);
		return `translate(${p.x} ${p.y}) rotate(${rot}) scale(${dir} 1)`;
	};

	const daisyTransform = (dir, t) => {
		const p = pointAt(dir, t);
		// alternate a little up/down off the guide so the trim looks hand-made
		const wobble = (t * 100 % 2 < 1 ? -4 : 3);
		return `translate(${p.x} ${(p.y + wobble).toFixed(2)}) scale(${(0.72 + (1 - t) * 0.55).toFixed(2)})`;
	};
</script>

<template>
	<div class="decor-laurel" aria-hidden="true">
		<svg class="decor-laurel__svg" viewBox="0 0 400 150">
			<defs>
				<g id="decor-laurel-daisy">
					<g fill="#d6e0f0">
						<ellipse rx="4.4" ry="8.6" transform="rotate(0)"/>
						<ellipse rx="4.4" ry="8.6" transform="rotate(72)"/>
						<ellipse rx="4.4" ry="8.6" transform="rotate(144)"/>
						<ellipse rx="4.4" ry="8.6" transform="rotate(216)"/>
						<ellipse rx="4.4" ry="8.6" transform="rotate(288)"/>
					</g>
					<circle r="3.4" fill="#9fb3d2"/>
				</g>
				<g id="decor-laurel-leaf">
					<path d="M0 0C9-4 17-2 22-12C13-16 3-11 0 0Z" fill="#aebccf"/>
					<path d="M0 0C3-8 10-13 20-15" fill="none" stroke="#93a4bd" stroke-width="1.2"/>
				</g>
			</defs>

			<!-- swag ribbon -->
			<path
				d="M14 34C86 34 168 54 200 100C232 54 314 34 386 34"
				fill="none"
				stroke="#aab9d2"
				stroke-width="3"
				stroke-linecap="round"
				opacity="0.7"
			/>
			<path
				d="M14 34C86 34 168 54 200 100C232 54 314 34 386 34"
				fill="none"
				stroke="#ffffff"
				stroke-width="1"
				stroke-linecap="round"
				opacity="0.5"
			/>

			<!-- picot / scalloped lace edge under the swag -->
			<g fill="none" stroke="#b7c5dd" stroke-width="1.6" opacity="0.75">
				<path d="M40 40q7 12 14 0M68 44q7 12 14 0M96 50q7 12 14 0M124 58q7 12 14 0M152 68q7 12 14 0M178 82q7 12 14 0" />
				<path d="M360 40q-7 12-14 0M332 44q-7 12-14 0M304 50q-7 12-14 0M276 58q-7 12-14 0M248 68q-7 12-14 0M222 82q-7 12-14 0" />
			</g>

			<!-- leaves along both halves -->
			<g class="decor-laurel__leaves">
				<template v-for="(t, i) in spots" :key="`lv${i}`">
					<use href="#decor-laurel-leaf" :transform="leafTransform(-1, t)"/>
					<use href="#decor-laurel-leaf" :transform="leafTransform(1, t)"/>
				</template>
			</g>

			<!-- daisies along both halves -->
			<g class="decor-laurel__florets">
				<template v-for="(t, i) in spots" :key="`d${i}`">
					<use href="#decor-laurel-daisy" :transform="daisyTransform(-1, t)"/>
					<use href="#decor-laurel-daisy" :transform="daisyTransform(1, t)"/>
				</template>

				<!-- fuller cluster cradling the seal at the centre -->
				<use href="#decor-laurel-daisy" transform="translate(182 96) scale(1.15)"/>
				<use href="#decor-laurel-daisy" transform="translate(218 96) scale(1.15)"/>
				<use href="#decor-laurel-daisy" transform="translate(200 108) scale(1)"/>
				<use href="#decor-laurel-daisy" transform="translate(192 82) scale(0.8)"/>
				<use href="#decor-laurel-daisy" transform="translate(210 82) scale(0.8)"/>
			</g>
		</svg>
	</div>
</template>

<style lang="scss">
	.decor-laurel
	{
		width: 100%;
		height: 100%;
	}

	.decor-laurel__svg
	{
		width: 100%;
		height: 100%;
		overflow: visible;
	}

	.decor-laurel__florets
	{
		transform-box: fill-box;
		transform-origin: center;
		animation: decor-laurel-breathe 6s $ease-in-out-soft infinite;
	}

	@keyframes decor-laurel-breathe
	{
		0%, 100% { transform: scale(1); }
		50% { transform: scale(1.04); }
	}

	@include reduced-motion
	{
		.decor-laurel__florets
		{
			animation: none;
		}
	}
</style>
