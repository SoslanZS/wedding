<script setup>
	// props
	const props = defineProps({
		items: {
			type: Array,
			default: () => [],
		},
		title: {
			type: String,
			default: 'Программа дня',
		},
	});

	// variables
	const root = ref(null);
	const track = ref(null);
	const reducedMotion = useReducedMotion();
	let raf = 0;

	const iconMap = {
		glasses: resolveComponent('IconsGlasses'),
		rings: resolveComponent('IconsRing'),
		plate: resolveComponent('IconsPlate'),
		sparkle: resolveComponent('IconsSparkle'),
		heart: resolveComponent('IconsHeart'),
		mic: resolveComponent('IconsMic'),
		cake: resolveComponent('IconsCake'),
	};

	// functions
	const iconFor = (name) => iconMap[name] || iconMap.heart;

	// A heart that rides down the wavy line as the section scrolls past.
	const update = () => {
		raf = 0;

		const el = root.value;
		const tr = track.value;

		if (!el || !tr)
			return;

		const rect = el.getBoundingClientRect();
		const vh = window.innerHeight;

		// 0 when the section top reaches ~72% of the viewport,
		// 1 when its bottom reaches ~34% of the viewport.
		const span = rect.height + vh * 0.38;
		const progress = Math.min(1, Math.max(0, (vh * 0.72 - rect.top) / span));

		// follow the wave (one full period every 240px, ~30px amplitude)
		const posPx = progress * tr.offsetHeight;
		const waveX = Math.sin((posPx / 240) * Math.PI * 2) * 30;

		tr.style.setProperty('--progress', progress.toFixed(4));
		tr.style.setProperty('--wave-x', `${waveX.toFixed(1)}px`);
	};

	const onScroll = () => {
		if (!raf)
			raf = requestAnimationFrame(update);
	};

	onMounted(() => {
		if (reducedMotion.value)
			return;

		update();
		window.addEventListener('scroll', onScroll, { passive: true });
		window.addEventListener('resize', onScroll);
	});

	onBeforeUnmount(() => {
		cancelAnimationFrame(raf);
		window.removeEventListener('scroll', onScroll);
		window.removeEventListener('resize', onScroll);
	});
</script>

<template>
	<section ref="root" class="invitation-timeline">
		<div class="invitation-timeline__inner g-container">
			<div class="invitation-timeline__flower" data-reveal="zoom" aria-hidden="true">
				<DecorHydrangea flip />
			</div>

			<h2 class="invitation-timeline__title" data-reveal>{{ props.title }}</h2>

			<ol ref="track" class="invitation-timeline__track">
				<span class="invitation-timeline__trail" aria-hidden="true" />
				<span class="invitation-timeline__runner" aria-hidden="true">
					<IconsHeart class="invitation-timeline__runner-heart" />
				</span>

				<li
					v-for="(item, index) in props.items"
					:key="item.time"
					class="invitation-timeline__item"
					:class="index % 2 === 0 ? 'invitation-timeline__item--left' : 'invitation-timeline__item--right'"
					:data-reveal="index % 2 === 0 ? 'left' : 'right'"
				>
					<div class="invitation-timeline__content">
						<span class="invitation-timeline__time">{{ item.time }}</span>
						<h3 class="invitation-timeline__item-title">{{ item.title }}</h3>
						<p v-if="item.text" class="invitation-timeline__text">{{ item.text }}</p>
						<span v-if="item.locationAddress" class="invitation-timeline__location">{{ item.locationAddress }}</span>
						<a
							v-if="item.mapUrl"
							class="invitation-timeline__map-link"
							:href="item.mapUrl"
							target="_blank"
							rel="noopener"
						>
							Посмотреть на карте
						</a>
					</div>

					<span class="invitation-timeline__node" aria-hidden="true">
						<component :is="iconFor(item.icon)" class="invitation-timeline__icon" />
					</span>
				</li>
			</ol>
		</div>
	</section>
</template>

<style lang="scss">
	.invitation-timeline
	{
		position: relative;
		padding: clamp(70px, 13vw, 140px) 0;
		background: linear-gradient(180deg, $paper-deep 0%, $paper 42%);
		overflow: hidden;
	}

	.invitation-timeline__inner
	{
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 44px;
	}

	.invitation-timeline__flower
	{
		position: absolute;
		top: -18px;
		right: -30px;
		width: clamp(150px, 32vw, 240px);
		height: clamp(150px, 32vw, 240px);
	}

	.invitation-timeline__title
	{
		font-family: $font-script;
		font-weight: 400;
		font-size: clamp(2.4rem, 9vw, 3.6rem);
		color: $blue-ink;
	}

	.invitation-timeline__track
	{
		--progress: 0;
		--wave-x: 0px;
		position: relative;
		width: 100%;
		max-width: 640px;
		list-style: none;
		padding: 12px 0;
		background: url('/pattern/timeline-wave.svg') repeat-y center top / 120px 240px;
	}

	// the line "fills in" behind the travelling heart
	.invitation-timeline__trail
	{
		position: absolute;
		left: 0;
		right: 0;
		top: 0;
		height: calc(var(--progress) * 100%);
		overflow: hidden;
		background: url('/pattern/timeline-wave-lit.svg') repeat-y center top / 120px 240px;
		pointer-events: none;
	}

	.invitation-timeline__runner
	{
		position: absolute;
		left: 50%;
		top: calc(var(--progress) * 100%);
		z-index: 4;
		display: flex;
		width: 34px;
		height: 34px;
		align-items: center;
		justify-content: center;
		color: $blue-deep;
		background: $paper;
		border-radius: 50%;
		box-shadow: 0 4px 14px -4px rgba(70, 92, 128, 0.5);
		transform: translate(calc(-50% + var(--wave-x)), -50%);
		will-change: transform, top;
	}

	.invitation-timeline__runner-heart
	{
		width: 18px;
		height: 18px;
		fill: $blue-deep;
		animation: invitation-timeline-beat 1.6s $ease-in-out-soft infinite;
	}

	@keyframes invitation-timeline-beat
	{
		0%, 100% { transform: scale(1); }
		45% { transform: scale(1.22); }
	}

	.invitation-timeline__item
	{
		position: relative;
		display: grid;
		grid-template-columns: 1fr 64px 1fr;
		align-items: center;
		min-height: 128px;
	}

	.invitation-timeline__content
	{
		display: flex;
		flex-direction: column;
		gap: 5px;
	}

	.invitation-timeline__item--left .invitation-timeline__content
	{
		grid-column: 1;
		text-align: right;
		align-items: flex-end;
	}

	.invitation-timeline__item--right .invitation-timeline__content
	{
		grid-column: 3;
		text-align: left;
	}

	.invitation-timeline__node
	{
		grid-column: 2;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 56px;
		height: 56px;
		margin: 0 auto;
		color: $blue-deep;
		background: $paper;
		border: 1px solid rgba(95, 127, 174, 0.4);
		border-radius: 50%;
	}

	.invitation-timeline__icon
	{
		width: 26px;
		height: 26px;
	}

	.invitation-timeline__time
	{
		font-family: $font-display;
		font-size: 1.15rem;
		letter-spacing: 0.14em;
		color: $blue-deep;
	}

	.invitation-timeline__item-title
	{
		font-size: 1.2rem;
		color: $ink;
	}

	.invitation-timeline__text
	{
		max-width: 22ch;
		font-size: 0.88rem;
		color: $ink-soft;
	}

	.invitation-timeline__location
	{
		max-width: 22ch;
		font-size: 0.8rem;
		font-style: italic;
		color: $ink-soft;
	}

	.invitation-timeline__map-link
	{
		margin-top: 2px;
		padding-bottom: 1px;
		font-size: 0.7rem;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: $blue-deep;
		border-bottom: 1px solid $blue;
		@include transition(border-color, 0.3s);

		&:hover { border-color: transparent; }
	}

	@include mq($tablet)
	{
		.invitation-timeline__track
		{
			background-position: -32px top;
		}

		.invitation-timeline__trail
		{
			background-position: -32px top;
		}

		.invitation-timeline__runner
		{
			left: 28px;
		}

		.invitation-timeline__item,
		.invitation-timeline__item--left,
		.invitation-timeline__item--right
		{
			grid-template-columns: 56px 1fr;
			min-height: 108px;
		}

		.invitation-timeline__item--left .invitation-timeline__content,
		.invitation-timeline__item--right .invitation-timeline__content
		{
			grid-column: 2;
			text-align: left;
			align-items: flex-start;
		}

		.invitation-timeline__node
		{
			grid-column: 1;
		}
	}

	@include reduced-motion
	{
		.invitation-timeline__runner
		{
			display: none;
		}

		.invitation-timeline__trail
		{
			height: 0;
		}
	}
</style>
