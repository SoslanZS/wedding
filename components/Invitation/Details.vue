<script setup>
	// props
	const props = defineProps({
		dateLabel: {
			type: String,
			required: true,
		},
		weekday: {
			type: String,
			default: '',
		},
		timeLabel: {
			type: String,
			required: true,
		},
		venueName: {
			type: String,
			required: true,
		},
		venueAddress: {
			type: String,
			required: true,
		},
		venueNote: {
			type: String,
			default: '',
		},
		mapUrl: {
			type: String,
			default: '',
		},
	});
</script>

<template>
	<section class="invitation-details">
		<div class="invitation-details__inner g-container g-container--wide">
			<DecorFloralDivider data-reveal="fade" />
			<h2 class="invitation-details__title" data-reveal>Когда и где</h2>

			<div class="invitation-details__grid">
				<article class="invitation-details__card" data-reveal data-reveal-delay="1">
					<IconsCalendar class="invitation-details__card-icon" />
					<span class="invitation-details__card-label">Дата</span>
					<span class="invitation-details__card-value">{{ props.dateLabel }}</span>
					<span v-if="props.weekday" class="invitation-details__card-note">{{ props.weekday }}</span>
				</article>

				<article class="invitation-details__card" data-reveal data-reveal-delay="2">
					<IconsClock class="invitation-details__card-icon" />
					<span class="invitation-details__card-label">Начало</span>
					<span class="invitation-details__card-value">{{ props.timeLabel }}</span>
					<span class="invitation-details__card-note">Сбор гостей</span>
				</article>

				<article class="invitation-details__card" data-reveal data-reveal-delay="3">
					<IconsPin class="invitation-details__card-icon" />
					<span class="invitation-details__card-label">Место</span>
					<span class="invitation-details__card-value">{{ props.venueName }}</span>
					<span class="invitation-details__card-note">{{ props.venueAddress }}</span>
					<a
						v-if="props.mapUrl"
						class="invitation-details__card-link"
						:href="props.mapUrl"
						target="_blank"
						rel="noopener"
					>
						Посмотреть на карте
					</a>
				</article>
			</div>

			<p v-if="props.venueNote" class="invitation-details__note" data-reveal>
				{{ props.venueNote }}
			</p>
		</div>
	</section>
</template>

<style lang="scss">
	.invitation-details
	{
		padding: clamp(70px, 12vw, 130px) 0;
		background: linear-gradient(180deg, $paper 0%, $paper-deep 100%);
	}

	.invitation-details__inner
	{
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 34px;
	}

	.invitation-details__title
	{
		font-family: $font-script;
		font-weight: 400;
		font-size: clamp(2.2rem, 8vw, 3.4rem);
		color: $blue-ink;
	}

	.invitation-details__grid
	{
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 22px;
		width: 100%;
	}

	.invitation-details__card
	{
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 10px;
		padding: 40px 26px;
		text-align: center;
		background: $white;
		border: 1px solid rgba(122, 92, 44, 0.26);
		border-radius: 4px;
		box-shadow: $shadow-soft;
	}

	.invitation-details__card-icon
	{
		width: 40px;
		height: 40px;
		margin-bottom: 6px;
		color: $blue-deep;
	}

	.invitation-details__card-label
	{
		font-size: 0.64rem;
		letter-spacing: 0.34em;
		text-transform: uppercase;
		color: $blue-deep;
	}

	.invitation-details__card-value
	{
		font-family: $font-display;
		font-size: 1.35rem;
		color: $ink;
	}

	.invitation-details__card-note
	{
		font-size: 0.86rem;
		color: $ink-soft;
	}

	.invitation-details__card-link
	{
		margin-top: 6px;
		padding-bottom: 2px;
		font-size: 0.76rem;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: $blue-deep;
		border-bottom: 1px solid $blue;
		@include transition(border-color, 0.3s);

		&:hover { border-color: transparent; }
	}

	.invitation-details__note
	{
		max-width: 40ch;
		font-style: italic;
		color: $ink-soft;
		text-align: center;
	}

	@include mq($tablet)
	{
		.invitation-details__grid
		{
			grid-template-columns: 1fr;
			max-width: 420px;
			margin: 0 auto;
		}

		.invitation-details__card
		{
			padding: 32px 24px;
		}
	}
</style>
