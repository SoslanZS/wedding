<script setup>
	// props
	const props = defineProps({
		count: {
			type: Number,
			default: 18,
		},
		active: {
			type: Boolean,
			default: true,
		},
	});

	// variables
	const reducedMotion = useReducedMotion();
	const mounted = ref(false);

	const petals = computed(() => {
		return Array.from({ length: props.count }, (_, i) => {
			const rand = (min, max) => min + Math.random() * (max - min);

			return {
				id: i,
				style: {
					'--x': `${rand(0, 100)}vw`,
					'--drift': `${rand(-14, 14)}vw`,
					'--size': `${rand(10, 20)}px`,
					'--duration': `${rand(11, 22)}s`,
					'--delay': `${rand(-22, 0)}s`,
					'--spin': `${rand(-320, 320)}deg`,
					'--tilt': `${rand(-40, 40)}deg`,
					'--hue': i % 3,
				},
			};
		});
	});

	// functions
	onMounted(() => mounted.value = true);
</script>

<template>
	<div
		v-if="mounted && props.active && !reducedMotion"
		class="decor-petals"
		aria-hidden="true"
	>
		<span
			v-for="petal in petals"
			:key="petal.id"
			class="decor-petals__petal"
			:data-hue="petal.style['--hue']"
			:style="petal.style"
		/>
	</div>
</template>

<style lang="scss">
	.decor-petals
	{
		position: fixed;
		inset: 0;
		z-index: $z-petals;
		overflow: hidden;
		pointer-events: none;
	}

	.decor-petals__petal
	{
		position: absolute;
		top: -6vh;
		left: var(--x);
		width: var(--size);
		height: calc(var(--size) * 0.82);
		background: $hydrangea;
		border-radius: 100% 0 100% 0;
		opacity: 0;
		transform: rotate(var(--tilt));
		animation: decor-petals-fall var(--duration) linear var(--delay) infinite;

		&[data-hue='1'] { background: $blue-light; }
		&[data-hue='2'] { background: $sage; border-radius: 60% 60% 60% 0; }
	}

	@keyframes decor-petals-fall
	{
		0%
		{
			opacity: 0;
			transform: translate3d(0, 0, 0) rotate(var(--tilt));
		}

		8% { opacity: 0.9; }
		92% { opacity: 0.75; }

		100%
		{
			opacity: 0;
			transform: translate3d(var(--drift), 112vh, 0) rotate(calc(var(--tilt) + var(--spin)));
		}
	}
</style>
