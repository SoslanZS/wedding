<script setup>
	// variables
	const invitation = useInvitationStore();
	const { couple, hosts, event, venue, schedule, gallery } = storeToRefs(invitation);

	const introOpen = ref(false); // flap opened — start revealing the page
	const introDone = ref(false); // envelope fully gone
	const fireworksActive = ref(false);
	const fireworks = ref(null);
	const photo = ref(null);
	const heroVideoLoad = ref(false); // start fetching the hero video only from here

	const coverPhoto = computed(() => gallery.value[0]);

	// functions
	const onIntroTap = () => {
		// the guest's own tap on the envelope — the one real user gesture we
		// get. Used immediately to (a) ask for the hero song's sound, before
		// any browser decides too much time has passed since the gesture,
		// and (b) start loading the heavy hero video in the background while
		// the envelope animation still has several seconds left to run.
		photo.value?.unlockSound?.();
		heroVideoLoad.value = true;
	};

	const onIntroOpen = () => {
		// The gates are parting — the salute erupts.
		fireworksActive.value = true;
	};

	const onIntroReveal = () => {
		// The gate scene clears — fade the invitation up underneath.
		introOpen.value = true;
	};

	// The envelope is now halfway through fading away — safe to scroll.
	const onIntroScrollable = () => {
		document.body.classList.remove('is-sealed');
	};

	const onIntroDone = () => {
		introDone.value = true;
	};

	const celebrate = () => {
		const canvas = fireworks.value;

		if (!canvas)
			return;

		// a short volley spread across the whole sky
		const shots = [
			[0, 0.5, 0.22], [180, 0.22, 0.3], [340, 0.78, 0.28],
			[560, 0.38, 0.18], [760, 0.64, 0.36], [980, 0.12, 0.34],
			[1180, 0.88, 0.24], [1400, 0.5, 0.32],
		];

		for (const [delay, x, y] of shots)
			setTimeout(() => canvas.burst(x, y), delay);
	};

	// Lock scrolling behind the sealed envelope (client + JS only).
	let unlockTimer = null;

	onMounted(() => {
		if (introDone.value)
			return;

		document.body.classList.add('is-sealed');

		// Safety net — never trap the guest if the intro animation fails.
		unlockTimer = setTimeout(() => document.body.classList.remove('is-sealed'), 12000);
	});

	onBeforeUnmount(() => {
		clearTimeout(unlockTimer);
		document.body.classList.remove('is-sealed');
	});

	// Reveal-on-scroll for every [data-reveal] node on the page.
	useScrollReveal();
</script>

<template>
	<div class="invitation-page" :class="{ 'invitation-page--intro': !introOpen }">
		<div class="invitation-page__veil" aria-hidden="true" />

		<ClientOnly>
			<IntroEnvelope
				@tap="onIntroTap"
				@open="onIntroOpen"
				@reveal="onIntroReveal"
				@scrollable="onIntroScrollable"
				@done="onIntroDone"
			/>
		</ClientOnly>

		<ClientOnly>
			<FireworksCanvas ref="fireworks" :active="fireworksActive" />
			<DecorPetals :active="introDone" :count="16" />
		</ClientOnly>

		<main class="invitation-page__main">
			<InvitationPhoto
				ref="photo"
				:src="coverPhoto.src"
				:video="coverPhoto.video"
				:poster="coverPhoto.poster"
				:song="coverPhoto.song"
				:load="heroVideoLoad"
				:caption="coverPhoto.caption"
				:play="introOpen"
			/>

			<InvitationHero
				:groom="couple.groom"
				:bride="couple.bride"
				:weekday="event.weekday"
				:day="event.day"
				:month="event.month"
				year="2026"
			/>

			<InvitationHosts
				:intro="hosts.intro"
				:line="hosts.line"
				:groom="couple.groom"
				:bride="couple.bride"
			/>

			<InvitationDetails
				:date-label="event.dateLabel"
				:weekday="event.weekday"
				:time-label="event.timeLabel"
				:venue-name="venue.name"
				:venue-address="venue.address"
				:venue-note="venue.note"
				:map-url="venue.mapUrl"
			/>

			<InvitationCountdown :datetime="event.datetime" />

			<InvitationTimeline :items="schedule" />

			<InvitationDateBlock
				:datetime="event.datetime"
				:month="event.month"
				year="2026"
			/>

			<InvitationClosing
				:groom="couple.groom"
				:bride="couple.bride"
				:initials="couple.initials"
				:date-label="event.dateLabel"
				:venue-name="venue.name"
				:hashtag="couple.hashtag"
				@celebrate="celebrate"
			/>
		</main>
	</div>
</template>

<style lang="scss">
	.invitation-page__main
	{
		position: relative;
		z-index: $z-content;
	}

	// Covers the un-hydrated page for the split second before the envelope
	// mounts on top. JS only — a no-JS visitor sees the invitation directly.
	.invitation-page__veil
	{
		display: none;
		position: fixed;
		inset: 0;
		z-index: $z-envelope - 1;
		background:
			radial-gradient(90% 60% at 50% 16%, rgba(246, 250, 255, 0.9), rgba(246, 250, 255, 0) 60%),
			radial-gradient(120% 100% at 50% 40%, #fbfdff 0%, $paper 46%, $paper-deep 100%);
	}

	.has-js .invitation-page--intro .invitation-page__veil
	{
		display: block;
	}
</style>
