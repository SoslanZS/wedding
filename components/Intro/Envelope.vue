<script setup>
	// emits
	const emit = defineEmits(['tap', 'open', 'reveal', 'scrollable', 'done']);

	// variables
	const reducedMotion = useReducedMotion();

	const state = ref('closed'); // 'closed' | 'opening' | 'done'
	const started = ref(false); // true once the guest has tapped the envelope

	const root = ref(null);
	const video = ref(null);

	// functions
	const finish = () => {
		state.value = 'done';
		emit('done');
	};

	// video is done (or unavailable) — salute, then hand straight off to the
	// invitation. No name plate in between. Scrolling stays locked until the
	// envelope is halfway through fading out (900ms `finish()` + half of its
	// own 450ms opacity transition), not the moment the content peeks through.
	const handOff = () => {
		emit('open');
		setTimeout(() => emit('reveal'), 450);
		setTimeout(() => emit('scrollable'), 1125);
		setTimeout(finish, 900);
	};

	// video unavailable / reduced motion — skip straight to the invitation
	const fallbackOpen = () => {
		if (video.value)
			video.value.style.display = 'none';

		handOff();
	};

	const runOpen = async () => {
		if (state.value !== 'closed')
			return;

		state.value = 'opening';

		if (reducedMotion.value || !video.value) {
			fallbackOpen();
			return;
		}

		let advanced = false;
		const advance = () => {
			if (advanced)
				return;

			advanced = true;
			video.value.pause();
			handOff();
		};

		video.value.addEventListener('ended', advance, { once: true });
		video.value.addEventListener('error', () => {
			if (!advanced)
				fallbackOpen();
		}, { once: true });

		try {
			await video.value.play();
		}
		catch {
			// autoplay blocked — don't strand the guest in front of a paused video
			if (!advanced)
				fallbackOpen();

			return;
		}

		// safety net in case `ended` never fires (codec/loop quirk)
		setTimeout(advance, 9000);
	};

	// the guest taps the envelope to begin — that same tap is a genuine user
	// gesture, so the hero section's music can autoplay with sound right
	// after, instead of waiting on a browser's autoplay-blocked fallback
	const beginIntro = () => {
		if (started.value)
			return;

		started.value = true;

		// fire synchronously, inside the click itself — the hero section's
		// music unlocks off this same gesture, before any `await` below
		// gives a strict mobile browser a reason to say the gesture expired
		emit('tap');
		runOpen();
	};

	onMounted(() => {
		if (reducedMotion.value)
			setTimeout(beginIntro, 220);
	});
</script>

<template>
	<div
		ref="root"
		class="intro-envelope"
		:class="`intro-envelope--${state}`"
	>
		<video
			ref="video"
			class="intro-envelope__video"
			src="/video/envelope-intro.mp4"
			poster="/video/envelope-intro-poster.jpg"
			muted
			playsinline
			preload="auto"
			aria-hidden="true"
		/>

		<button
			v-if="!started"
			type="button"
			class="intro-envelope__enter"
			@click="beginIntro"
		>
			<span class="intro-envelope__enter-hint">Нажмите на конверт</span>
		</button>
	</div>
</template>

<style lang="scss">
	.intro-envelope
	{
		position: fixed;
		inset: 0;
		z-index: $z-envelope;
		overflow: hidden;
		background: $paper-deep;
	}

	.intro-envelope--done
	{
		opacity: 0;
		visibility: hidden;
		pointer-events: none;
		transition: opacity 0.45s $ease-out-soft, visibility 0s linear 0.45s;
	}

	// the envelope-and-butterfly video — full-bleed on phone, hands off
	// straight to the invitation once it ends. `mq($tablet)` defaults to
	// max-width, so cover is the base (phone) rule and the tablet-and-up
	// override needs the `min` variant — cover on a wide desktop window
	// would crop this portrait clip to a sliver.
	.intro-envelope__video
	{
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		object-fit: cover;
		object-position: center;
		background: $paper-deep;

		@include mq($tablet, min) { object-fit: contain; }
	}

	// covers the whole envelope so any tap on it starts the video — the
	// hint text just tells the guest where to look
	.intro-envelope__enter
	{
		position: absolute;
		inset: 0;
		z-index: 1;
		display: flex;
		align-items: flex-end;
		justify-content: center;
		padding-bottom: max(64px, 8vh);
		background: none;
		border: 0;
		cursor: pointer;
	}

	.intro-envelope__enter-hint
	{
		padding: 10px 22px;
		font-family: $font-body;
		font-size: 0.72rem;
		letter-spacing: 0.36em;
		text-transform: uppercase;
		color: $white;
		text-shadow: 0 1px 10px rgba(30, 40, 62, 0.5);
		border: 1px solid rgba(255, 255, 255, 0.55);
		border-radius: 999px;
		backdrop-filter: blur(2px);
		animation: intro-envelope-hint 2.2s $ease-in-out-soft infinite;
	}

	@keyframes intro-envelope-hint
	{
		0%, 100% { opacity: 0.65; }
		50% { opacity: 1; }
	}

	@include reduced-motion
	{
		.intro-envelope__enter-hint { animation: none; }
		.intro-envelope__video { display: none; }
	}
</style>
