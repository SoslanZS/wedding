/**
 * Reveals elements tagged with `data-reveal` as they scroll into view by
 * toggling the `.is-revealed` class. One shared IntersectionObserver watches
 * every tagged node inside the given root.
 *
 * Usage: call once from a page/layout after the DOM is mounted.
 *
 * @param {import('vue').Ref<HTMLElement|null>} [root] - scope to observe; defaults to document
 * @param {Object} [options]
 * @param {number} [options.threshold=0.16] - visible ratio that triggers the reveal
 * @param {string} [options.rootMargin='0px 0px -8% 0px'] - viewport inset
 * @returns {{ refresh: () => void }} refresh re-scans the root for new nodes
 */
export const useScrollReveal = (root, options = {}) => {
	const {
		threshold = 0.16,
		rootMargin = '0px 0px -8% 0px'
	} = options;

	let observer = null;
	const seen = new WeakSet();

	const revealNow = (el) => {
		el.classList.add('is-revealed');
		seen.add(el);
	};

	const scan = () => {
		const scope = root?.value ?? document;
		const nodes = scope.querySelectorAll('[data-reveal]');

		for (const node of nodes) {
			if (seen.has(node))
				continue;

			if (observer)
				observer.observe(node);
			else
				revealNow(node);
		}
	};

	onMounted(() => {
		const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

		if (prefersReduced || !('IntersectionObserver' in window)) {
			scan();
			return;
		}

		observer = new IntersectionObserver((entries) => {
			for (const entry of entries) {
				if (!entry.isIntersecting)
					continue;

				revealNow(entry.target);
				observer.unobserve(entry.target);
			}
		}, { threshold, rootMargin });

		scan();
	});

	onBeforeUnmount(() => {
		observer?.disconnect();
		observer = null;
	});

	return { refresh: scan };
};
