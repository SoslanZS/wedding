<script setup>
	// props
	const props = defineProps({
		photos: {
			type: Array,
			default: () => [],
		},
		title: {
			type: String,
			default: 'Мы вдвоём',
		},
		hashtag: {
			type: String,
			default: '',
		},
	});

	// variables
	const root = ref(null);
	const reducedMotion = useReducedMotion();
	let frames = [];
	let ticking = false;

	// functions
	const update = () => {
		ticking = false;
		const vh = window.innerHeight;

		for (const frame of frames) {
			const rect = frame.getBoundingClientRect();

			if (rect.bottom < 0 || rect.top > vh)
				continue;

			// -1 (entering bottom) .. 1 (leaving top)
			const ratio = (rect.top + rect.height / 2 - vh / 2) / (vh / 2 + rect.height / 2);
			frame.style.setProperty('--shift', (ratio * 14).toFixed(2) + '%');
		}
	};

	const onScroll = () => {
		if (ticking)
			return;

		ticking = true;
		requestAnimationFrame(update);
	};

	onMounted(() => {
		if (reducedMotion.value)
			return;

		frames = [...root.value.querySelectorAll('.invitation-gallery__media')];
		update();
		window.addEventListener('scroll', onScroll, { passive: true });
		window.addEventListener('resize', onScroll);
	});

	onBeforeUnmount(() => {
		window.removeEventListener('scroll', onScroll);
		window.removeEventListener('resize', onScroll);
	});
</script>

<template>
	<section ref="root" class="invitation-gallery">
		<div class="invitation-gallery__head g-container">
			<DecorFloralDivider data-reveal="fade" />
			<h2 class="invitation-gallery__title" data-reveal>{{ props.title }}</h2>
		</div>

		<div class="invitation-gallery__list g-container g-container--wide">
			<figure
				v-for="(photo, index) in props.photos"
				:key="photo.src"
				class="invitation-gallery__figure"
				:class="index % 2 === 0 ? 'invitation-gallery__figure--left' : 'invitation-gallery__figure--right'"
				:data-reveal="index % 2 === 0 ? 'left' : 'right'"
			>
				<div class="invitation-gallery__media">
					<img
						class="invitation-gallery__img"
						:src="photo.src"
						:alt="photo.caption || 'Фотография пары'"
						loading="lazy"
						decoding="async"
					>
				</div>
				<figcaption v-if="photo.caption" class="invitation-gallery__caption">
					<span class="invitation-gallery__caption-index">0{{ index + 1 }}</span>
					{{ photo.caption }}
				</figcaption>
			</figure>
		</div>

		<p v-if="props.hashtag" class="invitation-gallery__hashtag g-container" data-reveal>
			{{ props.hashtag }}
		</p>
	</section>
</template>

<style lang="scss">
	.invitation-gallery
	{
		padding: clamp(70px, 12vw, 130px) 0;
	}

	.invitation-gallery__head
	{
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 30px;
		margin-bottom: clamp(40px, 8vw, 80px);
	}

	.invitation-gallery__title
	{
		font-size: clamp(1.8rem, 6vw, 2.8rem);
		font-style: italic;
		text-align: center;
	}

	.invitation-gallery__list
	{
		display: flex;
		flex-direction: column;
		gap: clamp(56px, 12vw, 130px);
	}

	.invitation-gallery__figure
	{
		display: flex;
		flex-direction: column;
		gap: 16px;
		width: min(560px, 100%);
	}

	.invitation-gallery__figure--left
	{
		align-self: flex-start;
	}

	.invitation-gallery__figure--right
	{
		align-self: flex-end;
		text-align: right;
	}

	.invitation-gallery__media
	{
		position: relative;
		overflow: hidden;
		border-radius: 3px;
		aspect-ratio: 4 / 5;
		box-shadow: $shadow-card;
	}

	.invitation-gallery__img
	{
		position: absolute;
		inset: -8% 0;
		width: 100%;
		height: 116%;
		object-fit: cover;
		transform: translate3d(0, var(--shift, 0), 0) scale(1.02);
		will-change: transform;
	}

	.invitation-gallery__caption
	{
		display: flex;
		align-items: baseline;
		gap: 12px;
		font-family: $font-script;
		font-size: 1.7rem;
		color: $blue-deep;
	}

	.invitation-gallery__figure--right .invitation-gallery__caption
	{
		justify-content: flex-end;
	}

	.invitation-gallery__caption-index
	{
		font-family: $font-body;
		font-size: 0.7rem;
		letter-spacing: 0.28em;
		color: $ink-soft;
	}

	.invitation-gallery__hashtag
	{
		margin-top: clamp(50px, 10vw, 100px);
		font-size: 0.8rem;
		letter-spacing: 0.32em;
		text-transform: uppercase;
		color: $blue-deep;
		text-align: center;
	}

	@include mq($tablet)
	{
		.invitation-gallery__figure--left,
		.invitation-gallery__figure--right
		{
			align-self: center;
			text-align: center;
		}

		.invitation-gallery__figure--right .invitation-gallery__caption
		{
			justify-content: center;
		}
	}
</style>
