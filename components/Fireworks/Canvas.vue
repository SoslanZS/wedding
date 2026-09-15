<script setup>
	// props
	const props = defineProps({
		active: {
			type: Boolean,
			default: false,
		},
		// How long, in ms, to keep launching shells once activated.
		showDuration: {
			type: Number,
			default: 4200,
		},
	});

	// variables
	const canvas = ref(null);
	const night = ref(0);
	const reducedMotion = useReducedMotion();

	// Firework palette — icy whites and blues with warm champagne accents.
	const palette = [
		'#ffffff', '#cfe2ff', '#9dbcff', '#7f9bff',
		'#ffe6b0', '#ffc663', '#ffb8c9', '#cbb6ff',
	];

	let ctx = null;
	let trail = null;      // offscreen accumulator that gives particles their tails
	let tctx = null;
	const sprites = new Map();

	let rafId = 0;
	let running = false;
	let dpr = 1;
	let viewW = 0;
	let viewH = 0;

	let shells = [];
	let sparks = [];

	let launchUntil = 0;
	let nextLaunch = 0;
	let nightTimer = null;

	const MAX_SPARKS = 3200;

	// functions
	const rand = (min, max) => min + Math.random() * (max - min);
	const pick = (list) => list[(Math.random() * list.length) | 0];

	/**
	 * Pre-render one soft glow disc per palette colour — far cheaper than
	 * shadowBlur and it gives the particles a believable bloom.
	 */
	const buildSprites = () => {
		const size = 48;
		const mid = size / 2;

		for (const color of palette) {
			const s = document.createElement('canvas');
			s.width = s.height = size;
			const c = s.getContext('2d');
			const g = c.createRadialGradient(mid, mid, 0, mid, mid, mid);

			g.addColorStop(0, '#ffffff');
			g.addColorStop(0.22, color);
			g.addColorStop(0.55, `${color}55`);
			g.addColorStop(1, `${color}00`);

			c.fillStyle = g;
			c.fillRect(0, 0, size, size);
			sprites.set(color, s);
		}
	};

	const resize = () => {
		if (!canvas.value)
			return;

		dpr = Math.min(window.devicePixelRatio || 1, 2);
		viewW = window.innerWidth;
		viewH = window.innerHeight;

		canvas.value.width = viewW * dpr;
		canvas.value.height = viewH * dpr;
		ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

		trail.width = viewW * dpr;
		trail.height = viewH * dpr;
		tctx.setTransform(dpr, 0, 0, dpr, 0, 0);
	};

	const addSpark = (spark) => {
		if (sparks.length < MAX_SPARKS)
			sparks.push(spark);
	};

	/** A rising shell that trails sparks and bursts at its apex. */
	const launchShell = (fx, fy) => {
		const x = viewW * (fx ?? rand(0.06, 0.94));
		const apex = viewH * (fy ?? rand(0.12, 0.5));
		const rise = viewH - apex;

		shells.push({
			x,
			y: viewH + 8,
			vx: rand(-0.5, 0.5),
			vy: -Math.sqrt(2 * 0.14 * rise),   // just enough to reach the apex
			color: pick(palette),
			type: pick(['peony', 'peony', 'chrysanthemum', 'willow', 'ring', 'crackle']),
		});
	};

	const explode = (x, y, color, type) => {
		const second = Math.random() < 0.45 ? pick(palette) : color;

		if (type === 'willow') {
			// few particles, heavy, very long glowing droop
			const count = 62;

			for (let i = 0; i < count; i++) {
				const a = (Math.PI * 2 * i) / count + rand(-0.05, 0.05);
				const sp = rand(2.2, 4.4);

				addSpark({
					x, y,
					vx: Math.cos(a) * sp,
					vy: Math.sin(a) * sp,
					life: 1,
					decay: rand(0.0035, 0.0055),
					drag: 0.994,
					grav: 0.052,
					size: rand(2.6, 4),
					color: Math.random() < 0.75 ? color : second,
					flick: 0,
				});
			}
		}
		else if (type === 'ring') {
			// a flat ring seen slightly edge-on
			const count = 108;
			const tilt = rand(0.25, 0.55);
			const rot = rand(0, Math.PI);
			const sp = rand(4.6, 6.2);

			for (let i = 0; i < count; i++) {
				const a = (Math.PI * 2 * i) / count;
				const px = Math.cos(a) * sp;
				const py = Math.sin(a) * sp * tilt;

				addSpark({
					x, y,
					vx: px * Math.cos(rot) - py * Math.sin(rot),
					vy: px * Math.sin(rot) + py * Math.cos(rot),
					life: 1,
					decay: rand(0.009, 0.014),
					drag: 0.978,
					grav: 0.035,
					size: rand(2, 3),
					color,
					flick: Math.random() < 0.3 ? rand(0.1, 0.25) : 0,
				});
			}
		}
		else {
			// peony / chrysanthemum / crackle — a full sphere of sparks
			const count = type === 'chrysanthemum' ? 210 : 170;
			const power = type === 'chrysanthemum' ? rand(5.4, 7.2) : rand(4.4, 6.4);
			const decay = type === 'chrysanthemum' ? rand(0.006, 0.009) : rand(0.009, 0.015);

			for (let i = 0; i < count; i++) {
				const a = rand(0, Math.PI * 2);
				// sqrt keeps the sphere shell dense at its rim, like the real thing
				const sp = power * Math.sqrt(Math.random());

				addSpark({
					x, y,
					vx: Math.cos(a) * sp,
					vy: Math.sin(a) * sp,
					life: 1,
					decay: decay * rand(0.8, 1.25),
					drag: 0.976,
					grav: 0.042,
					size: rand(1.8, 3.2),
					color: Math.random() < 0.72 ? color : second,
					flick: Math.random() < 0.28 ? rand(0.12, 0.3) : 0,
				});
			}

			if (type === 'crackle') {
				// tight cloud of fast, hard-twinkling crackle stars
				for (let i = 0; i < 70; i++) {
					const a = rand(0, Math.PI * 2);
					const sp = rand(0.6, 2.6);

					addSpark({
						x, y,
						vx: Math.cos(a) * sp,
						vy: Math.sin(a) * sp,
						life: 1,
						decay: rand(0.006, 0.011),
						drag: 0.97,
						grav: 0.03,
						size: rand(1.2, 2.2),
						color: '#ffffff',
						flick: rand(0.3, 0.55),
					});
				}
			}
		}

		// bright flash at the heart of the burst
		for (let i = 0; i < 10; i++) {
			addSpark({
				x, y,
				vx: rand(-0.7, 0.7),
				vy: rand(-0.7, 0.7),
				life: 1,
				decay: rand(0.05, 0.08),
				drag: 0.9,
				grav: 0,
				size: rand(9, 16),
				color: '#ffffff',
				flick: 0,
			});
		}
	};

	const draw = (spark, alpha) => {
		const sprite = sprites.get(spark.color) || sprites.get('#ffffff');
		const s = spark.size;

		tctx.globalAlpha = alpha;
		tctx.drawImage(sprite, spark.x - s, spark.y - s, s * 2, s * 2);
	};

	const tick = (now) => {
		if (!running)
			return;

		// fade the accumulated trails by chipping away at their alpha
		tctx.globalAlpha = 1;
		tctx.globalCompositeOperation = 'destination-out';
		tctx.fillStyle = 'rgba(0, 0, 0, 0.11)';
		tctx.fillRect(0, 0, viewW, viewH);
		tctx.globalCompositeOperation = 'lighter';

		const launching = now < launchUntil;

		if (launching && now >= nextLaunch) {
			launchShell();

			if (Math.random() < 0.55)
				launchShell();

			nextLaunch = now + rand(240, 520);
		}

		for (let i = shells.length - 1; i >= 0; i--) {
			const sh = shells[i];

			sh.x += sh.vx;
			sh.y += sh.vy;
			sh.vy += 0.14;

			// sparkling exhaust trail
			tctx.globalAlpha = 0.85;
			tctx.drawImage(sprites.get(sh.color) || sprites.get('#ffffff'), sh.x - 3, sh.y - 3, 6, 6);

			if (Math.random() < 0.6) {
				addSpark({
					x: sh.x + rand(-1.5, 1.5),
					y: sh.y + rand(0, 4),
					vx: rand(-0.35, 0.35),
					vy: rand(0.1, 0.8),
					life: 0.7,
					decay: rand(0.04, 0.07),
					drag: 0.95,
					grav: 0.02,
					size: rand(1.4, 2.4),
					color: '#ffe6b0',
					flick: 0,
				});
			}

			if (sh.vy >= -0.6) {
				explode(sh.x, sh.y, sh.color, sh.type);
				shells.splice(i, 1);
			}
		}

		for (let i = sparks.length - 1; i >= 0; i--) {
			const p = sparks[i];

			p.vx *= p.drag;
			p.vy *= p.drag;
			p.vy += p.grav;
			p.x += p.vx;
			p.y += p.vy;
			p.life -= p.decay;

			if (p.life <= 0) {
				sparks.splice(i, 1);
				continue;
			}

			// life^1.6 gives a long, soft tail instead of a linear cut-off
			let alpha = Math.pow(Math.max(0, p.life), 1.6);

			if (p.flick)
				alpha *= 0.45 + 0.55 * Math.abs(Math.sin(now * p.flick + p.x));

			draw(p, alpha);
		}

		tctx.globalAlpha = 1;

		ctx.clearRect(0, 0, viewW, viewH);
		ctx.globalAlpha = 1;
		ctx.drawImage(trail, 0, 0, viewW, viewH);

		if (!launching && shells.length === 0 && sparks.length === 0) {
			running = false;
			ctx.clearRect(0, 0, viewW, viewH);
			tctx.clearRect(0, 0, viewW, viewH);
			return;
		}

		rafId = requestAnimationFrame(tick);
	};

	const wake = () => {
		if (running)
			return;

		running = true;
		rafId = requestAnimationFrame(tick);
	};

	/** Public: fire a single shell (used by the "light the salute" button). */
	const burst = (fx, fy) => {
		if (reducedMotion.value)
			return;

		night.value = 1;
		clearTimeout(nightTimer);
		nightTimer = setTimeout(() => night.value = 0, 2800);

		launchShell(fx, fy);
		wake();
	};

	const start = () => {
		if (reducedMotion.value)
			return;

		const now = performance.now();

		launchUntil = now + props.showDuration;
		nextLaunch = now;

		night.value = 1;
		clearTimeout(nightTimer);
		nightTimer = setTimeout(() => night.value = 0, 3400);

		// an immediate opening volley spread across the sky
		launchShell(0.5, 0.24);
		setTimeout(() => launchShell(0.2, 0.32), 160);
		setTimeout(() => launchShell(0.8, 0.3), 300);

		wake();
	};

	watch(() => props.active, (isActive) => {
		if (isActive)
			start();
	});

	onMounted(() => {
		ctx = canvas.value.getContext('2d');
		trail = document.createElement('canvas');
		tctx = trail.getContext('2d');

		buildSprites();
		resize();
		window.addEventListener('resize', resize);

		if (props.active)
			start();
	});

	onBeforeUnmount(() => {
		running = false;
		cancelAnimationFrame(rafId);
		clearTimeout(nightTimer);
		window.removeEventListener('resize', resize);
	});

	defineExpose({ burst });
</script>

<template>
	<div class="fireworks-canvas" aria-hidden="true">
		<div class="fireworks-canvas__night" :style="{ opacity: night }" />
		<canvas ref="canvas" class="fireworks-canvas__layer" />
	</div>
</template>

<style lang="scss">
	.fireworks-canvas
	{
		position: fixed;
		inset: 0;
		z-index: $z-fireworks;
		pointer-events: none;
	}

	// a soft twilight sky so the salute actually reads on a light page
	.fireworks-canvas__night
	{
		position: absolute;
		inset: 0;
		background:
			radial-gradient(120% 90% at 50% 14%, rgba(46, 66, 110, 0.5) 0%, rgba(24, 38, 70, 0.72) 100%);
		opacity: 0;
		transition: opacity 1.1s $ease-in-out-soft;
	}

	.fireworks-canvas__layer
	{
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
	}
</style>
