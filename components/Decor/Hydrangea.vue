<script setup>
	// props
	const props = defineProps({
		flip: {
			type: Boolean,
			default: false,
		},
		leaves: {
			type: Boolean,
			default: true,
		},
	});

	// variables — pre-computed floret layout for a watercolour hydrangea head
	const florets = [
		{ x: 66, y: 70, s: 1, t: 8 }, { x: 96, y: 58, s: 1.1, t: -14 },
		{ x: 126, y: 70, s: 1, t: 20 }, { x: 54, y: 100, s: 1.15, t: -6 },
		{ x: 86, y: 92, s: 1.2, t: 12 }, { x: 118, y: 92, s: 1.1, t: -18 },
		{ x: 146, y: 102, s: 1, t: 6 }, { x: 66, y: 128, s: 1.1, t: 16 },
		{ x: 98, y: 122, s: 1.25, t: -10 }, { x: 130, y: 126, s: 1.1, t: 22 },
		{ x: 82, y: 154, s: 1, t: -12 }, { x: 112, y: 152, s: 1.05, t: 10 },
		{ x: 98, y: 92, s: 0.7, t: 0 },
	];

	const shades = ['#8fa9cf', '#7f9bc7', '#6f8fbd', '#c0d0e6', '#7a94a4'];
</script>

<template>
	<div class="decor-hydrangea" :class="{ 'decor-hydrangea--flip': props.flip }" aria-hidden="true">
		<svg class="decor-hydrangea__svg" viewBox="0 0 200 210">
			<g v-if="props.leaves" class="decor-hydrangea__leaves">
				<path d="M40 120C18 108 8 84 12 58c24 6 40 30 40 62Z" fill="#7f9bc7"/>
				<path d="M150 96c26-6 44-28 46-56-26-2-48 18-52 52Z" fill="#5f7ea6"/>
				<path d="M96 190c-14-20-16-46-4-70 20 14 26 44 16 70Z" fill="#6f8fbd"/>
				<path d="M150 150c22 4 42-6 54-28-22-12-46-4-58 22Z" fill="#7f9bc7"/>
			</g>

			<g class="decor-hydrangea__head">
				<g
					v-for="(f, i) in florets"
					:key="i"
					:transform="`translate(${f.x} ${f.y}) rotate(${f.t}) scale(${f.s})`"
				>
					<path
						d="M0-9C5-9 9-5 9 0 9 5 5 9 0 9-5 9-9 5-9 0-9-5-5-9 0-9Z"
						:fill="shades[i % shades.length]"
						opacity="0.9"
						transform="translate(0 -7)"
					/>
					<path d="M0-9C5-9 9-5 9 0 9 5 5 9 0 9-5 9-9 5-9 0-9-5-5-9 0-9Z" :fill="shades[(i + 2) % shades.length]" opacity="0.85" transform="translate(6 3)"/>
					<path d="M0-9C5-9 9-5 9 0 9 5 5 9 0 9-5 9-9 5-9 0-9-5-5-9 0-9Z" :fill="shades[(i + 1) % shades.length]" opacity="0.85" transform="translate(-6 3)"/>
					<circle r="2.4" fill="#f0f5fc"/>
				</g>
			</g>
		</svg>
	</div>
</template>

<style lang="scss">
	.decor-hydrangea
	{
		width: 100%;
		height: 100%;
	}

	.decor-hydrangea--flip
	{
		transform: scaleX(-1);
	}

	.decor-hydrangea__svg
	{
		width: 100%;
		height: 100%;
		overflow: visible;
	}

	.decor-hydrangea__head
	{
		transform-box: fill-box;
		transform-origin: center;
		animation: decor-hydrangea-breathe 7s $ease-in-out-soft infinite;
	}

	.decor-hydrangea__leaves
	{
		transform-box: fill-box;
		transform-origin: 50% 100%;
		animation: decor-hydrangea-sway 9s $ease-in-out-soft infinite;
	}

	@keyframes decor-hydrangea-breathe
	{
		0%, 100% { transform: scale(1); }
		50% { transform: scale(1.03); }
	}

	@keyframes decor-hydrangea-sway
	{
		0%, 100% { transform: rotate(-2deg); }
		50% { transform: rotate(2deg); }
	}

	@include reduced-motion
	{
		.decor-hydrangea__head,
		.decor-hydrangea__leaves
		{
			animation: none;
		}
	}
</style>
