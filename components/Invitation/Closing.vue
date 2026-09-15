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
		initials: {
			type: String,
			default: '',
		},
		dateLabel: {
			type: String,
			required: true,
		},
		venueName: {
			type: String,
			default: '',
		},
		hashtag: {
			type: String,
			default: '',
		},
	});

	// emits
	const emit = defineEmits(['celebrate']);

	// functions
	const handleCelebrate = () => emit('celebrate');
</script>

<template>
	<section class="invitation-closing">
		<div class="invitation-closing__inner g-container">
			<span v-if="props.initials" class="invitation-closing__monogram" data-reveal="zoom">
				{{ props.initials }}
			</span>

			<UiAnimatedText
				class="invitation-closing__line"
				tag="h2"
				text="Будем счастливы разделить этот день с вами"
				:stagger="42"
			/>

			<p class="invitation-closing__names" data-reveal>
				{{ props.groom }} <span class="invitation-closing__amp">&amp;</span> {{ props.bride }}
			</p>

			<p class="invitation-closing__meta" data-reveal data-reveal-delay="1">
				{{ props.dateLabel }}<template v-if="props.venueName"> · {{ props.venueName }}</template>
			</p>

			<button
				class="invitation-closing__button"
				type="button"
				data-reveal
				data-reveal-delay="2"
				@click="handleCelebrate"
			>
				Зажечь салют
			</button>

			<p v-if="props.hashtag" class="invitation-closing__hashtag" data-reveal data-reveal-delay="3">
				{{ props.hashtag }}
			</p>
		</div>
	</section>
</template>

<style lang="scss">
	.invitation-closing
	{
		position: relative;
		padding: clamp(90px, 18vw, 200px) 0;
		background: radial-gradient(130% 90% at 50% 0%, $paper 0%, $paper-deep 100%);
		text-align: center;
	}

	.invitation-closing__inner
	{
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 20px;
	}

	.invitation-closing__monogram
	{
		display: flex;
		align-items: center;
		justify-content: center;
		width: 74px;
		height: 74px;
		font-family: $font-display;
		font-size: 1rem;
		letter-spacing: 0.14em;
		color: $blue-deep;
		border: 1px solid rgba(122, 92, 44, 0.5);
		border-radius: 50%;
	}

	.invitation-closing__line
	{
		max-width: 20ch;
		font-family: $font-display;
		font-size: clamp(1.7rem, 6vw, 2.9rem);
		font-style: italic;
		font-weight: 400;
		color: $ink;
	}

	.invitation-closing__names
	{
		margin-top: 10px;
		font-family: $font-script;
		font-size: clamp(2.6rem, 10vw, 4.4rem);
		line-height: 1;
		color: $blue-ink;
	}

	.invitation-closing__amp
	{
		font-family: $font-display;
		font-style: italic;
		font-size: 0.4em;
		color: $ink-soft;
	}

	.invitation-closing__meta
	{
		font-size: 0.8rem;
		letter-spacing: 0.24em;
		text-transform: uppercase;
		color: $ink-soft;
	}

	.invitation-closing__button
	{
		margin-top: 18px;
		padding: 15px 38px;
		font-size: 0.72rem;
		letter-spacing: 0.32em;
		text-transform: uppercase;
		color: $gold-deep;
		border: 1px solid $gold;
		border-radius: 999px;
		background: transparent;
		@include transition(background-color color transform, 0.4s);

		&:hover
		{
			background: $gold;
			color: $white;
			transform: translateY(-2px);
		}
	}

	.invitation-closing__hashtag
	{
		margin-top: 14px;
		font-size: 0.76rem;
		letter-spacing: 0.3em;
		text-transform: uppercase;
		color: $blue-deep;
	}
</style>
