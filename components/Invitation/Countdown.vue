<script setup>
	// props
	const props = defineProps({
		datetime: {
			type: String,
			required: true,
		},
		title: {
			type: String,
			default: 'До встречи осталось',
		},
	});

	// variables
	const mounted = ref(false);
	const now = ref(Date.now());
	let timer = null;

	const target = computed(() => new Date(props.datetime).getTime());

	const parts = computed(() => {
		const diff = Math.max(0, target.value - now.value);
		const total = Math.floor(diff / 1000);

		return [
			{ key: 'days', label: 'дней', value: Math.floor(total / 86400) },
			{ key: 'hours', label: 'часов', value: Math.floor((total % 86400) / 3600) },
			{ key: 'minutes', label: 'минут', value: Math.floor((total % 3600) / 60) },
			{ key: 'seconds', label: 'секунд', value: total % 60 },
		];
	});

	const isPast = computed(() => target.value - now.value <= 0);

	// functions
	const pad = (n) => String(n).padStart(2, '0');

	onMounted(() => {
		mounted.value = true;
		timer = setInterval(() => now.value = Date.now(), 1000);
	});

	onBeforeUnmount(() => clearInterval(timer));
</script>

<template>
	<section class="invitation-countdown">
		<div class="invitation-countdown__inner g-container">
			<p class="invitation-countdown__title g-eyebrow" data-reveal="fade">
				{{ isPast ? 'Сегодня тот самый день' : props.title }}
			</p>

			<div class="invitation-countdown__grid" data-reveal>
				<div
					v-for="part in parts"
					:key="part.key"
					class="invitation-countdown__unit"
				>
					<span class="invitation-countdown__value-wrap">
						<Transition name="invitation-countdown-flip" mode="out-in">
							<span :key="part.value" class="invitation-countdown__value">
								{{ mounted ? pad(part.value) : '—' }}
							</span>
						</Transition>
					</span>
					<span class="invitation-countdown__label">{{ part.label }}</span>
				</div>
			</div>
		</div>
	</section>
</template>

<style lang="scss">
	.invitation-countdown
	{
		padding: clamp(60px, 11vw, 120px) 0;
		text-align: center;
	}

	.invitation-countdown__inner
	{
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 30px;
	}

	.invitation-countdown__grid
	{
		display: grid;
		grid-template-columns: repeat(4, minmax(0, 1fr));
		gap: 10px;
		width: 100%;
		max-width: 480px;
	}

	.invitation-countdown__unit
	{
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 10px;
		padding: 22px 6px;
		background: $white;
		border: 1px solid rgba(122, 92, 44, 0.26);
		border-radius: 4px;
	}

	.invitation-countdown__value-wrap
	{
		display: block;
		overflow: hidden;
	}

	.invitation-countdown__value
	{
		display: block;
		font-family: $font-display;
		font-size: clamp(1.6rem, 7vw, 2.4rem);
		font-weight: 500;
		line-height: 1;
		color: $blue-deep;
		font-variant-numeric: tabular-nums;
	}

	.invitation-countdown__label
	{
		font-size: 0.62rem;
		letter-spacing: 0.22em;
		text-transform: uppercase;
		color: $ink-soft;
	}

	.invitation-countdown-flip-enter-active,
	.invitation-countdown-flip-leave-active
	{
		transition: transform 0.4s $ease-out-soft, opacity 0.4s $ease-out-soft;
	}

	.invitation-countdown-flip-enter-from
	{
		opacity: 0;
		transform: translateY(-60%);
	}

	.invitation-countdown-flip-leave-to
	{
		opacity: 0;
		transform: translateY(60%);
	}

	@include reduced-motion
	{
		.invitation-countdown-flip-enter-active,
		.invitation-countdown-flip-leave-active
		{
			transition: none;
		}
	}
</style>
