<script setup>
	// props
	const props = defineProps({
		groom: {
			type: String,
			required: true,
		},
		bride: {
			type: String,
			required: true,
		},
		weekday: {
			type: String,
			default: '',
		},
		day: {
			type: String,
			default: '',
		},
		month: {
			type: String,
			default: '',
		},
		year: {
			type: String,
			default: '2026',
		},
	});

	// variables
	const root = ref(null);
	const reducedMotion = useReducedMotion();
	const { load } = useAnime();
	let played = false;

	// functions
	const runIntro = async () => {
		if (played || reducedMotion.value)
			return;

		played = true;

		const stagger = root.value.querySelectorAll('[data-hero-stagger]');
		const flowers = root.value.querySelectorAll('.invitation-hero__flower');

		const anime = await load();

		if (!anime) {
			[...stagger, ...flowers].forEach((el) => el.style.opacity = 1);
			return;
		}

		anime.set(stagger, { opacity: 0, translateY: 26 });
		anime.set(flowers, { opacity: 0, scale: 0.82, translateY: 26 });

		anime({
			targets: root.value.querySelector('.invitation-hero__cartouche'),
			opacity: [0, 1],
			scale: [0.94, 1],
			duration: 1200,
			easing: 'cubicBezier(0.22, 1, 0.36, 1)',
		});

		anime({
			targets: flowers,
			opacity: [0, 1],
			scale: [0.82, 1],
			translateY: [26, 0],
			delay: anime.stagger(160, { start: 260 }),
			duration: 1500,
			easing: 'easeOutCubic',
		});

		anime({
			targets: stagger,
			opacity: [0, 1],
			translateY: [26, 0],
			delay: anime.stagger(130, { start: 460 }),
			duration: 1000,
			easing: 'cubicBezier(0.22, 1, 0.36, 1)',
		});
	};

	onMounted(() => {
		if (reducedMotion.value || !('IntersectionObserver' in window)) {
			runIntro();
			return;
		}

		const observer = new IntersectionObserver((entries, obs) => {
			for (const entry of entries) {
				if (!entry.isIntersecting)
					continue;

				runIntro();
				obs.disconnect();
			}
		}, { threshold: 0.3 });

		observer.observe(root.value);
		onBeforeUnmount(() => observer.disconnect());
	});
</script>

<template>
	<section ref="root" class="invitation-hero">
		<div class="invitation-hero__inner g-container">
			<UiCartouche class="invitation-hero__cartouche" arch>
				<template #corner-start>
					<div class="invitation-hero__flower">
						<DecorHydrangea />
					</div>
				</template>
				<template #corner-end>
					<div class="invitation-hero__flower">
						<DecorHydrangea flip />
					</div>
				</template>

				<span class="invitation-hero__eyebrow g-eyebrow" data-hero-stagger>Приглашаем на свадьбу</span>

				<h1 class="invitation-hero__names">
					<span class="invitation-hero__name" data-hero-stagger>{{ props.groom }}</span>
					<span class="invitation-hero__amp" data-hero-stagger>&amp;</span>
					<span class="invitation-hero__name" data-hero-stagger>{{ props.bride }}</span>
				</h1>

				<div class="invitation-hero__date" data-hero-stagger>
					<span class="invitation-hero__date-word">{{ props.weekday }}</span>
					<span class="invitation-hero__date-rule" aria-hidden="true" />
					<span class="invitation-hero__date-day">{{ props.day }}</span>
					<span class="invitation-hero__date-rule" aria-hidden="true" />
					<span class="invitation-hero__date-word">{{ props.month }}</span>
				</div>

				<span class="invitation-hero__year" data-hero-stagger>{{ props.year }}</span>
			</UiCartouche>
		</div>

		<div class="invitation-hero__scroll" aria-hidden="true">
			<span class="invitation-hero__scroll-line" />
		</div>
	</section>
</template>

<style lang="scss">
	.invitation-hero
	{
		position: relative;
		min-height: 100svh;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 60px 0;
		overflow: hidden;
	}

	.invitation-hero__inner
	{
		position: relative;
		z-index: $z-content;
	}

	.invitation-hero__flower
	{
		width: 100%;
		height: 100%;
	}

	.invitation-hero__eyebrow
	{
		font-size: 0.68rem;
		letter-spacing: 0.36em;
	}

	.invitation-hero__names
	{
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 2px;
		margin: 14px 0 10px;
		font-family: $font-script;
		font-weight: 400;
		color: $blue-ink;
	}

	.invitation-hero__name
	{
		font-size: clamp(3rem, 13vw, 5rem);
		line-height: 1.05;
	}

	.invitation-hero__amp
	{
		font-family: $font-display;
		font-style: italic;
		font-size: clamp(1.6rem, 6vw, 2.4rem);
		color: $blue-deep;
	}

	.invitation-hero__date
	{
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 12px;
		margin-top: 6px;
		font-family: $font-body;
		font-size: 0.66rem;
		letter-spacing: 0.24em;
		text-transform: uppercase;
		color: $ink-soft;
	}

	.invitation-hero__date-day
	{
		font-family: $font-display;
		font-size: 1.7rem;
		letter-spacing: 0;
		color: $blue-deep;
	}

	.invitation-hero__date-rule
	{
		width: 1px;
		height: 28px;
		background: rgba(122, 92, 44, 0.45);
	}

	.invitation-hero__year
	{
		margin-top: 10px;
		font-family: $font-body;
		font-size: 0.7rem;
		letter-spacing: 0.42em;
		color: $ink-soft;
	}

	.invitation-hero__scroll
	{
		position: absolute;
		bottom: 24px;
		left: 50%;
		width: 1px;
		height: 58px;
		transform: translateX(-50%);
		overflow: hidden;
		background: rgba(122, 92, 44, 0.2);
	}

	.invitation-hero__scroll-line
	{
		position: absolute;
		inset: 0;
		background: $blue-deep;
		animation: invitation-hero-scroll 2.4s $ease-in-out-soft infinite;
	}

	@keyframes invitation-hero-scroll
	{
		0% { transform: translateY(-100%); }
		60%, 100% { transform: translateY(100%); }
	}

	.has-js .invitation-hero__flower,
	.has-js [data-hero-stagger]
	{
		opacity: 0;
	}

	@include reduced-motion
	{
		.has-js .invitation-hero__flower,
		.has-js [data-hero-stagger]
		{
			opacity: 1;
		}

		.invitation-hero__scroll-line
		{
			animation: none;
		}
	}
</style>
