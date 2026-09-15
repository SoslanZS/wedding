<script setup>
	// props
	const props = defineProps({
		intro: {
			type: String,
			required: true,
		},
		line: {
			type: String,
			required: true,
		},
		groom: {
			type: String,
			required: true,
		},
		bride: {
			type: String,
			required: true,
		},
	});
</script>

<template>
	<section class="invitation-hosts">
		<div class="invitation-hosts__inner g-container">
			<UiCartouche data-reveal="zoom">
				<template #corner-start>
					<DecorWisteria />
				</template>

				<p class="invitation-hosts__eyebrow g-eyebrow">Дорогие гости</p>

				<UiAnimatedText
					class="invitation-hosts__intro"
					tag="h2"
					:text="props.intro"
					:stagger="44"
				/>

				<UiAnimatedText
					class="invitation-hosts__line"
					tag="p"
					:text="props.line"
					:stagger="22"
					:duration="720"
				/>

				<div class="invitation-hosts__couple">
					<span class="invitation-hosts__couple-name">{{ props.groom }}</span>
					<span class="invitation-hosts__couple-amp">и</span>
					<span class="invitation-hosts__couple-name">{{ props.bride }}</span>
				</div>
			</UiCartouche>
		</div>
	</section>
</template>

<style lang="scss">
	.invitation-hosts
	{
		padding: clamp(80px, 16vw, 160px) 0;
		text-align: center;
	}

	.invitation-hosts__inner
	{
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 44px;
	}

	.invitation-hosts__intro
	{
		max-width: 18ch;
		margin-top: 12px;
		font-size: clamp(1.6rem, 5.6vw, 2.6rem);
		font-style: italic;
		font-weight: 400;
		color: $ink;
	}

	.invitation-hosts__line
	{
		max-width: 32ch;
		margin-top: 14px;
		color: $ink-soft;
	}

	.invitation-hosts__couple
	{
		display: flex;
		align-items: baseline;
		justify-content: center;
		gap: 16px;
		margin-top: 20px;
	}

	.invitation-hosts__couple-name
	{
		font-family: $font-script;
		font-size: clamp(2.2rem, 8vw, 3.4rem);
		line-height: 1;
		color: $blue-ink;
	}

	.invitation-hosts__couple-amp
	{
		font-family: $font-display;
		font-style: italic;
		font-size: clamp(0.9rem, 3vw, 1.3rem);
		color: $ink-soft;
	}
</style>
