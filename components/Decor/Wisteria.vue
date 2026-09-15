<script setup>
	// props
	const props = defineProps({
		flip: {
			type: Boolean,
			default: false,
		},
	});

	// variables — tapering teardrop cluster of blossoms (deterministic jitter
	// so server and client render identical markup)
	const jitter = (n) => {
		const s = Math.sin(n * 12.9898) * 43758.5453;
		return s - Math.floor(s); // 0..1
	};

	const blossoms = Array.from({ length: 22 }, (_, i) => {
		const row = Math.floor(i / 2);
		const spread = Math.max(2, 26 - row * 2.4);
		const side = i % 2 === 0 ? -1 : 1;

		return {
			x: +(60 + side * (spread * (0.4 + jitter(i + 1) * 0.6))).toFixed(2),
			y: +(26 + row * 18 + jitter(i + 7) * 6).toFixed(2),
			r: +Math.max(3.2, 8 - row * 0.5).toFixed(2),
			shade: ['#8fa9cf', '#7f9bc7', '#c0d0e6', '#6f8fbd'][i % 4],
		};
	});
</script>

<template>
	<div class="decor-wisteria" :class="{ 'decor-wisteria--flip': props.flip }" aria-hidden="true">
		<svg class="decor-wisteria__svg" viewBox="0 0 120 250">
			<g class="decor-wisteria__cluster">
				<path d="M60 6C58 40 60 70 60 110" fill="none" stroke="#5f7ea6" stroke-width="2.4" stroke-linecap="round"/>
				<path d="M60 20c-14-2-24-12-26-28 16 0 26 12 26 28Z" fill="#7f9bc7"/>
				<path d="M60 20c14-2 24-12 26-28-16 0-26 12-26 28Z" fill="#5f7ea6"/>
				<circle
					v-for="(b, i) in blossoms"
					:key="i"
					:cx="b.x"
					:cy="b.y"
					:r="b.r"
					:fill="b.shade"
					opacity="0.9"
				/>
			</g>
		</svg>
	</div>
</template>

<style lang="scss">
	.decor-wisteria
	{
		width: 100%;
		height: 100%;
	}

	.decor-wisteria--flip
	{
		transform: scaleX(-1);
	}

	.decor-wisteria__svg
	{
		width: 100%;
		height: 100%;
		overflow: visible;
	}

	.decor-wisteria__cluster
	{
		transform-box: fill-box;
		transform-origin: 50% 0;
		animation: decor-wisteria-sway 6s $ease-in-out-soft infinite;
	}

	@keyframes decor-wisteria-sway
	{
		0%, 100% { transform: rotate(-3deg); }
		50% { transform: rotate(3deg); }
	}

	@include reduced-motion
	{
		.decor-wisteria__cluster
		{
			animation: none;
		}
	}
</style>
