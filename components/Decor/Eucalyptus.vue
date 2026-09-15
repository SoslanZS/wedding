<script setup>
	// props
	const props = defineProps({
		flip: {
			type: Boolean,
			default: false,
		},
	});

	// variables — leaf offsets along the stem
	const leaves = [
		{ y: 40, dir: -1, s: 1 }, { y: 40, dir: 1, s: 1 },
		{ y: 72, dir: -1, s: 1.15 }, { y: 72, dir: 1, s: 1.15 },
		{ y: 108, dir: -1, s: 1.3 }, { y: 108, dir: 1, s: 1.3 },
		{ y: 146, dir: -1, s: 1.15 }, { y: 146, dir: 1, s: 1.15 },
		{ y: 182, dir: -1, s: 0.9 }, { y: 182, dir: 1, s: 0.9 },
	];
</script>

<template>
	<div class="decor-eucalyptus" :class="{ 'decor-eucalyptus--flip': props.flip }" aria-hidden="true">
		<svg class="decor-eucalyptus__svg" viewBox="0 0 140 230">
			<g class="decor-eucalyptus__stem">
				<path d="M70 230C70 170 66 120 62 20" fill="none" stroke="#5f7ea6" stroke-width="3" stroke-linecap="round"/>
				<g
					v-for="(leaf, i) in leaves"
					:key="i"
					:transform="`translate(${62 + leaf.dir * 2} ${leaf.y}) scale(${leaf.dir * leaf.s} ${leaf.s})`"
				>
					<ellipse
						cx="20"
						cy="0"
						rx="22"
						ry="13"
						:fill="i % 2 === 0 ? '#7f9bc7' : '#5f7ea6'"
						transform="rotate(-18)"
					/>
				</g>
				<circle cx="62" cy="20" r="5" fill="#7f9bc7"/>
			</g>
		</svg>
	</div>
</template>

<style lang="scss">
	.decor-eucalyptus
	{
		width: 100%;
		height: 100%;
	}

	.decor-eucalyptus--flip
	{
		transform: scaleX(-1);
	}

	.decor-eucalyptus__svg
	{
		width: 100%;
		height: 100%;
		overflow: visible;
	}

	.decor-eucalyptus__stem
	{
		transform-box: fill-box;
		transform-origin: 50% 100%;
		animation: decor-eucalyptus-sway 8s $ease-in-out-soft infinite;
	}

	@keyframes decor-eucalyptus-sway
	{
		0%, 100% { transform: rotate(-2.5deg); }
		50% { transform: rotate(2.5deg); }
	}

	@include reduced-motion
	{
		.decor-eucalyptus__stem
		{
			animation: none;
		}
	}
</style>
