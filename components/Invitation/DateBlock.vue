<script setup>
	// props
	const props = defineProps({
		datetime: {
			type: String,
			required: true,
		},
		month: {
			type: String,
			default: '',
		},
		year: {
			type: String,
			default: '',
		},
	});

	// variables
	const weekdays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

	const grid = computed(() => {
		// Parse the calendar date straight from the ISO string so server and
		// client agree regardless of timezone.
		const [y, m1, targetDay] = props.datetime.slice(0, 10).split('-').map(Number);
		const m = m1 - 1;

		const first = new Date(y, m, 1);
		// Monday-first offset
		const lead = (first.getDay() + 6) % 7;
		const daysInMonth = new Date(y, m + 1, 0).getDate();

		const cells = [];

		for (let i = 0; i < lead; i++)
			cells.push({ key: `x${i}`, day: null });

		for (let day = 1; day <= daysInMonth; day++)
			cells.push({ key: `d${day}`, day, isTarget: day === targetDay });

		return cells;
	});
</script>

<template>
	<section class="invitation-date-block">
		<div class="invitation-date-block__inner g-container">
			<h2 class="invitation-date-block__month" data-reveal>{{ props.month }}</h2>
			<span v-if="props.year" class="invitation-date-block__year g-eyebrow" data-reveal data-reveal-delay="1">
				{{ props.year }}
			</span>

			<div class="invitation-date-block__calendar" data-reveal data-reveal-delay="1">
				<span
					v-for="wd in weekdays"
					:key="wd"
					class="invitation-date-block__weekday"
				>{{ wd }}</span>

				<span
					v-for="cell in grid"
					:key="cell.key"
					class="invitation-date-block__day"
					:class="{ 'invitation-date-block__day--target': cell.isTarget }"
				>
					<IconsHeart
						v-if="cell.isTarget"
						class="invitation-date-block__heart"
						aria-hidden="true"
					/>
					<span class="invitation-date-block__num">{{ cell.day }}</span>
				</span>
			</div>

			<div class="invitation-date-block__bouquet" data-reveal="zoom" aria-hidden="true">
				<DecorHydrangea />
			</div>
		</div>
	</section>
</template>

<style lang="scss">
	.invitation-date-block
	{
		position: relative;
		padding: clamp(70px, 13vw, 130px) 0;
		background: linear-gradient(180deg, $paper 0%, $paper-deep 100%);
		overflow: hidden;
	}

	.invitation-date-block__inner
	{
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 12px;
	}

	.invitation-date-block__month
	{
		font-family: $font-script;
		font-weight: 400;
		font-size: clamp(2.8rem, 12vw, 4.6rem);
		line-height: 1;
		color: $blue-ink;
	}

	.invitation-date-block__year
	{
		letter-spacing: 0.42em;
	}

	.invitation-date-block__calendar
	{
		display: grid;
		grid-template-columns: repeat(7, 1fr);
		gap: 6px;
		width: 100%;
		max-width: 360px;
		margin-top: 22px;
	}

	.invitation-date-block__weekday
	{
		padding-bottom: 8px;
		font-size: 0.6rem;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: $blue-deep;
		text-align: center;
	}

	.invitation-date-block__day
	{
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
		aspect-ratio: 1;
		font-family: $font-display;
		font-size: 0.95rem;
		color: $ink-soft;
	}

	.invitation-date-block__day--target
	{
		color: $white;
		font-weight: 600;
	}

	.invitation-date-block__heart
	{
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		color: $hydrangea-deep;
		fill: $hydrangea-deep;
		animation: invitation-date-block-beat 3s $ease-in-out-soft infinite;
	}

	.invitation-date-block__num
	{
		position: relative;
		z-index: 1;
	}

	.invitation-date-block__bouquet
	{
		width: clamp(180px, 40vw, 300px);
		height: clamp(160px, 34vw, 260px);
		margin-top: 18px;
	}

	@keyframes invitation-date-block-beat
	{
		0%, 100% { transform: scale(1); }
		50% { transform: scale(1.12); }
	}

	@include reduced-motion
	{
		.invitation-date-block__heart
		{
			animation: none;
		}
	}
</style>
