<script setup>
	// props
	const props = defineProps({
		src: {
			type: String,
			required: true,
		},
		video: {
			type: String,
			default: '',
		},
		poster: {
			type: String,
			default: '',
		},
		song: {
			type: String,
			default: '',
		},
		// the hero video is heavy — don't fetch it until the guest has tapped
		// the envelope, so the very first paint stays fast. The song and the
		// envelope's own intro video are unaffected by this (loaded eagerly).
		load: {
			type: Boolean,
			default: false,
		},
		caption: {
			type: String,
			default: '',
		},
		play: {
			type: Boolean,
			default: true,
		},
	});

	// variables
	const root = ref(null);
	const media = ref(null);
	const audio = ref(null);
	const reducedMotion = useReducedMotion();
	const { load } = useAnime();

	const soundOn = ref(false);
	let unlockEvents = [];

	// functions

	// muted autoplay is always allowed — the video must never sit paused
	// waiting on the sound-permission dance below
	const startVideo = () => {
		if (media.value)
			media.value.play().catch(() => {});
	};

	// browsers refuse unmuted autoplay without a user gesture — clear any
	// pending "wake on first tap" listeners once sound is settled one way
	// or the other, so a later stray tap can't flip it back
	const clearUnlock = () => {
		unlockEvents.forEach(({ evt, fn }) => window.removeEventListener(evt, fn));
		unlockEvents = [];
	};

	const trySound = async () => {
		if (!audio.value)
			return false;

		try {
			await audio.value.play();
			soundOn.value = true;
			return true;
		}
		catch {
			// autoplay-with-sound blocked — the video (silent, muted+loop) is
			// unaffected, only the separate song element stays paused
			soundOn.value = false;
			return false;
		}
	};

	// the guest's very first tap/scroll/keypress anywhere on the page — not
	// necessarily the sound button — unlocks the music immediately
	const armUnlock = () => {
		clearUnlock();

		const fn = () => {
			trySound();
			clearUnlock();
		};

		['pointerdown', 'keydown', 'touchstart', 'wheel'].forEach((evt) => {
			window.addEventListener(evt, fn, { once: true, passive: true });
			unlockEvents.push({ evt, fn });
		});
	};

	const toggleSound = () => {
		if (!audio.value)
			return;

		clearUnlock();

		if (soundOn.value) {
			audio.value.pause();
			soundOn.value = false;
		}
		else {
			audio.value.play()
				.then(() => { soundOn.value = true; })
				.catch(() => {});
		}
	};

	// the fade/scale reveal — separate from playback, which starts on mount
	// regardless of whether this has run yet
	const runVisualIntro = async () => {
		if (reducedMotion.value)
			return;

		const cue = root.value.querySelector('.invitation-photo__cue');
		const cap = root.value.querySelector('.invitation-photo__caption');

		const anime = await load();

		if (!anime) {
			[media.value, cue, cap].forEach((el) => el && (el.style.opacity = 1));
			return;
		}

		anime.set([media.value, cue, cap], { opacity: 0 });

		anime({
			targets: media.value,
			opacity: [0, 1],
			scale: [1.12, 1],
			duration: 1600,
			easing: 'easeOutCubic',
		});

		anime({
			targets: [cap, cue],
			opacity: [0, 1],
			translateY: [16, 0],
			delay: anime.stagger(160, { start: 700 }),
			duration: 900,
			easing: 'easeOutCubic',
		});
	};

	watch(() => props.play, (value) => {
		if (value)
			runVisualIntro();
	});

	// the hero video only starts fetching (and playing, muted+loop) once the
	// guest has tapped the envelope — see the `load` prop above
	watch(() => props.load, (value) => {
		if (value)
			startVideo();
	});

	onMounted(() => {
		if (props.video && props.load)
			startVideo();

		// arm the fallback listeners now, but don't attempt to play the song
		// yet — it should only start off the guest's own tap (see
		// `unlockSound`, called from the envelope's click handler), never on
		// its own at page load
		if (props.song)
			armUnlock();

		if (props.play)
			runVisualIntro();
	});

	onBeforeUnmount(clearUnlock);

	// called from the envelope's own tap handler — the most direct shot at
	// unlocking sound, made synchronously inside that same click (some
	// mobile browsers won't honour a gesture relayed through a later,
	// unrelated listener)
	defineExpose({
		unlockSound: async () => {
			const ok = await trySound();

			if (ok)
				clearUnlock();

			return ok;
		},
	});
</script>

<template>
	<section ref="root" class="invitation-photo">
		<div class="invitation-photo__frame">
			<video
				v-if="props.video"
				ref="media"
				class="invitation-photo__media"
				:src="props.load ? props.video : undefined"
				:poster="props.poster || undefined"
				:preload="props.load ? 'auto' : 'none'"
				muted
				loop
				playsinline
			/>
			<img
				v-else
				ref="media"
				class="invitation-photo__media"
				:src="props.src"
				alt="Фотография пары"
				decoding="async"
			>
			<div class="invitation-photo__veil" aria-hidden="true" />
		</div>

		<audio
			v-if="props.song"
			ref="audio"
			:src="props.song"
			preload="auto"
		/>

		<button
			v-if="props.song"
			type="button"
			class="invitation-photo__sound"
			:aria-label="soundOn ? 'Выключить музыку' : 'Включить музыку'"
			@click="toggleSound"
		>
			<IconsSoundOn v-if="soundOn" />
			<IconsSoundOff v-else />
		</button>

		<p v-if="props.caption" class="invitation-photo__caption">{{ props.caption }}</p>

		<div class="invitation-photo__cue" aria-hidden="true">
			<span class="invitation-photo__chev" />
			<span class="invitation-photo__chev" />
			<span class="invitation-photo__chev" />
		</div>
	</section>
</template>

<style lang="scss">
	.invitation-photo
	{
		position: relative;
		min-height: 100svh;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: flex-end;
		padding-bottom: 54px;
		overflow: hidden;
	}

	.invitation-photo__frame
	{
		position: absolute;
		inset: 0;
		overflow: hidden;
	}

	.invitation-photo__media
	{
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.invitation-photo__veil
	{
		position: absolute;
		inset: 0;
		background: linear-gradient(180deg, rgba(58, 74, 100, 0.1) 0%, rgba(58, 74, 100, 0) 42%, rgba(58, 74, 100, 0.32) 100%);
	}

	// discreet sound toggle for the separate song element — silent by
	// default (browser autoplay policy); the guest opts in with one tap
	.invitation-photo__sound
	{
		position: absolute;
		top: max(22px, env(safe-area-inset-top));
		right: 22px;
		z-index: $z-content;
		display: grid;
		place-items: center;
		width: 42px;
		height: 42px;
		padding: 10px;
		color: $white;
		background: rgba(58, 74, 100, 0.32);
		border: 1px solid rgba(255, 255, 255, 0.4);
		border-radius: 50%;
		backdrop-filter: blur(6px);
		@include transition(background-color, 0.3s);

		&:hover { background: rgba(58, 74, 100, 0.48); }
	}

	.invitation-photo__caption
	{
		position: relative;
		z-index: $z-content;
		margin-bottom: 26px;
		font-family: $font-script;
		font-size: clamp(1.9rem, 7vw, 2.8rem);
		color: $white;
		text-shadow: 0 2px 16px rgba(58, 74, 100, 0.42);
	}

	.invitation-photo__cue
	{
		position: relative;
		z-index: $z-content;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 6px;
	}

	.invitation-photo__chev
	{
		width: 16px;
		height: 16px;
		border-right: 2px solid rgba(255, 255, 255, 0.85);
		border-bottom: 2px solid rgba(255, 255, 255, 0.85);
		transform: rotate(45deg);
		animation: invitation-photo-chev 2s $ease-in-out-soft infinite;
	}

	.invitation-photo__chev:nth-child(2) { animation-delay: 0.15s; }
	.invitation-photo__chev:nth-child(3) { animation-delay: 0.3s; }

	@keyframes invitation-photo-chev
	{
		0%, 100% { opacity: 0.25; }
		50% { opacity: 1; }
	}

	.has-js .invitation-photo__media,
	.has-js .invitation-photo__caption,
	.has-js .invitation-photo__cue
	{
		opacity: 0;
	}

	@include reduced-motion
	{
		.has-js .invitation-photo__media,
		.has-js .invitation-photo__caption,
		.has-js .invitation-photo__cue
		{
			opacity: 1;
		}

		.invitation-photo__chev
		{
			animation: none;
			opacity: 0.7;
		}
	}
</style>
