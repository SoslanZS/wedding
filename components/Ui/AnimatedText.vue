<script setup>
	// props
	const props = defineProps({
		text: {
			type: String,
			default: '',
		},
		tag: {
			type: String,
			default: 'p',
		},
		mode: {
			type: String,
			default: 'words', // 'words' | 'chars'
		},
		stagger: {
			type: Number,
			default: 34,
		},
		duration: {
			type: Number,
			default: 900,
		},
		delay: {
			type: Number,
			default: 0,
		},
		once: {
			type: Boolean,
			default: true,
		},
	});

	// variables
	const root = ref(null);
	const { load } = useAnime();
	const reducedMotion = useReducedMotion();
	const hasPlayed = ref(false);

	const units = computed(() => {
		const source = props.text;

		if (props.mode === 'chars')
			return [...source].map((ch) => (ch === ' ' ? ' ' : ch));

		// words — keep the trailing space so the line wraps naturally
		return source.split(/(\s+)/).filter((part) => part.length > 0);
	});

	const isSpace = (unit) => /^\s+$/.test(unit) || unit === ' ';

	// functions
	const play = async () => {
		if (hasPlayed.value)
			return;

		hasPlayed.value = true;

		const targets = root.value?.querySelectorAll('.ui-animated-text__unit:not(.ui-animated-text__unit--space)');

		if (!targets?.length)
			return;

		const anime = await load();

		if (!anime) {
			targets.forEach((el) => el.style.opacity = 1);
			return;
		}

		anime.set(targets, { opacity: 0, translateY: '0.9em', rotateZ: props.mode === 'chars' ? '6deg' : '2deg' });

		anime({
			targets,
			opacity: [0, 1],
			translateY: ['0.9em', 0],
			rotateZ: [props.mode === 'chars' ? '6deg' : '2deg', 0],
			duration: props.duration,
			delay: anime.stagger(props.stagger, { start: props.delay }),
			easing: 'cubicBezier(0.22, 1, 0.36, 1)',
		});
	};

	onMounted(() => {
		if (reducedMotion.value || !('IntersectionObserver' in window))
			return;

		// Hide units up front so there is no visible→hidden flash on scroll-in.
		root.value
			?.querySelectorAll('.ui-animated-text__unit:not(.ui-animated-text__unit--space)')
			.forEach((el) => el.style.opacity = 0);

		const observer = new IntersectionObserver((entries, obs) => {
			for (const entry of entries) {
				if (!entry.isIntersecting)
					continue;

				play();

				if (props.once)
					obs.disconnect();
			}
		}, { threshold: 0.35, rootMargin: '0px 0px -6% 0px' });

		observer.observe(root.value);
		onBeforeUnmount(() => observer.disconnect());
	});
</script>

<template>
	<component
		:is="props.tag"
		ref="root"
		class="ui-animated-text"
		:class="`ui-animated-text--${props.mode}`"
	>
		<span
			v-for="(unit, index) in units"
			:key="index"
			class="ui-animated-text__unit"
			:class="{ 'ui-animated-text__unit--space': isSpace(unit) }"
			>{{ unit }}</span>
	</component>
</template>

<style lang="scss">
	.ui-animated-text
	{
		// Units animate in via anime.js; visible by default for no-JS / SSR.
	}

	.ui-animated-text__unit
	{
		display: inline-block;
		white-space: pre;
		will-change: transform, opacity;
	}

	.ui-animated-text__unit--space
	{
		white-space: pre;
	}
</style>
