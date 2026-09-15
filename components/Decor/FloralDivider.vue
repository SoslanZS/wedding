<script setup>
	// props
	const props = defineProps({
		label: {
			type: String,
			default: '',
		},
	});
</script>

<template>
	<div class="decor-floral-divider" aria-hidden="true">
		<svg class="decor-floral-divider__svg" viewBox="0 0 320 40" fill="none">
			<path class="decor-floral-divider__line" d="M4 20H128" stroke="#a5843e" stroke-width="1.4" stroke-linecap="round"/>
			<path class="decor-floral-divider__line" d="M316 20H192" stroke="#a5843e" stroke-width="1.4" stroke-linecap="round"/>
			<g class="decor-floral-divider__sprig" stroke="#9fb4c0" stroke-width="1.6" stroke-linecap="round">
				<path d="M160 6c0 10-4 18-4 28"/>
				<path d="M156 16c-6-2-10-6-11-12 6 0 10 4 11 12Z" fill="#9fb4c0"/>
				<path d="M156 26c6-2 10-6 11-12-6 0-10 4-11 12Z" fill="#7a94a4"/>
			</g>
			<circle class="decor-floral-divider__dot" cx="160" cy="34" r="2.4" fill="#a5843e"/>
		</svg>
		<span v-if="props.label" class="decor-floral-divider__label g-eyebrow">{{ props.label }}</span>
	</div>
</template>

<style lang="scss">
	.decor-floral-divider
	{
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 14px;
		padding: 8px 0;
	}

	.decor-floral-divider__svg
	{
		width: min(320px, 68vw);
		height: auto;
		overflow: visible;
	}

	.decor-floral-divider__line
	{
		stroke-dasharray: 124;
		stroke-dashoffset: 124;
		animation: decor-floral-divider-draw 1.6s $ease-out-soft forwards;
	}

	.decor-floral-divider__sprig,
	.decor-floral-divider__dot
	{
		opacity: 0;
		animation: decor-floral-divider-fade 0.9s $ease-out-soft 1s forwards;
	}

	@keyframes decor-floral-divider-draw
	{
		to { stroke-dashoffset: 0; }
	}

	@keyframes decor-floral-divider-fade
	{
		to { opacity: 1; }
	}

	@include reduced-motion
	{
		.decor-floral-divider__line
		{
			stroke-dashoffset: 0;
			animation: none;
		}

		.decor-floral-divider__sprig,
		.decor-floral-divider__dot
		{
			opacity: 1;
			animation: none;
		}
	}
</style>
