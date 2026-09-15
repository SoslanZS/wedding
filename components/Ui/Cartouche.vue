<script setup>
	// props
	const props = defineProps({
		arch: {
			type: Boolean,
			default: true, // pointed-dome top like the reference cartouche
		},
		tone: {
			type: String,
			default: 'blue', // 'blue' | 'plain'
		},
	});
</script>

<template>
	<div
		class="ui-cartouche"
		:class="[`ui-cartouche--${props.tone}`, { 'ui-cartouche--arch': props.arch }]"
	>
		<div
			v-if="$slots['corner-start']"
			class="ui-cartouche__corner ui-cartouche__corner--start"
		>
			<slot name="corner-start" />
		</div>
		<div
			v-if="$slots['corner-end']"
			class="ui-cartouche__corner ui-cartouche__corner--end"
		>
			<slot name="corner-end" />
		</div>

		<div class="ui-cartouche__plate">
			<div class="ui-cartouche__inner">
				<slot />
			</div>
		</div>
	</div>
</template>

<style lang="scss">
	.ui-cartouche
	{
		position: relative;
		width: 100%;
		max-width: 440px;
		margin: 0 auto;
	}

	.ui-cartouche__plate
	{
		position: relative;
		border-radius: 14px;
		background: linear-gradient(180deg, #f2f7fd 0%, #e7eefa 60%, #dbe6f4 100%);
		box-shadow:
			0 0 0 1px rgba(122, 92, 44, 0.55),
			0 0 0 5px $paper,
			0 0 0 6px rgba(122, 92, 44, 0.35),
			$shadow-soft;
	}

	.ui-cartouche--arch .ui-cartouche__plate
	{
		border-radius: 48% 48% 16px 16px / 34% 34% 8px 8px;
	}

	.ui-cartouche--plain .ui-cartouche__plate
	{
		background: linear-gradient(180deg, #fbfaf6, #f1efe7);
	}

	.ui-cartouche__plate::before
	{
		content: '';
		position: absolute;
		inset: 10px;
		border: 1.4px dotted rgba(122, 92, 44, 0.5);
		border-radius: inherit;
		pointer-events: none;
	}

	.ui-cartouche__inner
	{
		position: relative;
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
		padding: clamp(46px, 9vw, 72px) clamp(26px, 7vw, 52px);
	}

	.ui-cartouche--arch .ui-cartouche__inner
	{
		padding-top: clamp(64px, 13vw, 104px);
	}

	.ui-cartouche__corner
	{
		position: absolute;
		z-index: 2;
		width: clamp(120px, 30vw, 190px);
		height: clamp(120px, 30vw, 190px);
		pointer-events: none;
	}

	.ui-cartouche__corner--start
	{
		top: -6%;
		left: -14%;
	}

	.ui-cartouche__corner--end
	{
		right: -14%;
		bottom: -6%;
	}

	.ui-cartouche__corner > *
	{
		width: 100%;
		height: 100%;
	}
</style>
