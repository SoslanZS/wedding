<script setup>
	// props
	const props = defineProps({
		initials: {
			type: String,
			default: 'П & А',
		},
	});
</script>

<template>
	<div class="decor-wax-seal" aria-hidden="true">
		<svg class="decor-wax-seal__svg" viewBox="0 0 210 232">
			<defs>
				<radialGradient id="decor-wax-body" cx="0.4" cy="0.32" r="0.85">
					<stop offset="0" stop-color="#a9b578"/>
					<stop offset="0.4" stop-color="#8b975b"/>
					<stop offset="0.72" stop-color="#6a7642"/>
					<stop offset="0.9" stop-color="#515c31"/>
					<stop offset="1" stop-color="#3c4626"/>
				</radialGradient>

				<radialGradient id="decor-wax-rim" cx="0.5" cy="0.5" r="0.5">
					<stop offset="0" stop-color="#26301a" stop-opacity="0"/>
					<stop offset="0.66" stop-color="#26301a" stop-opacity="0"/>
					<stop offset="0.9" stop-color="#242d16" stop-opacity="0.45"/>
					<stop offset="0.97" stop-color="#161c0d" stop-opacity="0.2"/>
					<stop offset="1" stop-color="#242d16" stop-opacity="0.55"/>
				</radialGradient>

				<filter id="decor-wax-drop" x="-45%" y="-45%" width="190%" height="190%">
					<feDropShadow dx="0" dy="7" stdDeviation="8" flood-color="#241d10" flood-opacity="0.32"/>
					<feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="#241d10" flood-opacity="0.4"/>
				</filter>

				<!-- raised gold relief: a beaded oval frame + the script monogram -->
				<g id="decor-wax-relief">
					<ellipse cx="105" cy="116" rx="72" ry="84" fill="none" stroke="currentColor" stroke-width="2"/>
					<ellipse cx="105" cy="116" rx="66" ry="78" fill="none" stroke="currentColor"
						stroke-width="4.4" stroke-linecap="round" stroke-dasharray="0.3 7.4"/>
					<g transform="translate(105 30)" fill="currentColor">
						<path d="M0-7C4-7 7-4 7 0 7 4 4 7 0 7-4 7-7 4-7 0-7-4-4-7 0-7Z"/>
						<path d="M0 0C-3-9-10-13-19-14 -14-6-8-2 0 0Z"/>
						<path d="M0 0C3-9 10-13 19-14 14-6 8-2 0 0Z"/>
					</g>
					<g transform="translate(105 202)" fill="currentColor">
						<path d="M0 0C-3 9-10 13-19 14 -14 6-8 2 0 0Z"/>
						<path d="M0 0C3 9 10 13 19 14 14 6 8 2 0 0Z"/>
						<circle cx="0" cy="10" r="3.2"/>
					</g>
					<text x="105" y="120" text-anchor="middle" dominant-baseline="middle"
						font-family="'Great Vibes', 'Snell Roundhand', cursive"
						font-size="72" fill="currentColor">{{ props.initials }}</text>
				</g>
			</defs>

			<g filter="url(#decor-wax-drop)" transform="rotate(-4 105 116)">
				<!-- molten olive-wax blob -->
				<path
					d="M105 8C132 6 150 20 168 34C186 48 198 68 200 96C202 122 194 140 196 168C194 198 172 214 144 222C124 228 108 226 90 224C64 220 40 214 24 190C12 168 14 146 12 120C10 88 22 60 40 42C58 24 78 10 105 8Z"
					fill="url(#decor-wax-body)"
				/>
				<path
					d="M105 8C132 6 150 20 168 34C186 48 198 68 200 96C202 122 194 140 196 168C194 198 172 214 144 222C124 228 108 226 90 224C64 220 40 214 24 190C12 168 14 146 12 120C10 88 22 60 40 42C58 24 78 10 105 8Z"
					fill="url(#decor-wax-rim)"
				/>

				<!-- gold relief — three offset copies fake the pressed emboss -->
				<use href="#decor-wax-relief" color="#7c5f24" transform="translate(1.6 2.1)"/>
				<use href="#decor-wax-relief" color="#f0dca4" transform="translate(-1.2 -1.5)"/>
				<use href="#decor-wax-relief" color="#c8a45a"/>

				<!-- broad satin highlight on the wax -->
				<ellipse cx="72" cy="52" rx="40" ry="26" fill="#c9d29a" opacity="0.28"
					transform="rotate(-24 72 52)"/>
				<!-- light catching the raised outer lip -->
				<path d="M40 42C58 24 78 10 105 8C132 6 150 20 168 34"
					fill="none" stroke="#d9e0ad" stroke-width="2.6" stroke-linecap="round" opacity="0.45"/>
			</g>
		</svg>
	</div>
</template>

<style lang="scss">
	.decor-wax-seal
	{
		width: 100%;
		height: 100%;
	}

	.decor-wax-seal__svg
	{
		width: 100%;
		height: 100%;
		overflow: visible;
	}
</style>
