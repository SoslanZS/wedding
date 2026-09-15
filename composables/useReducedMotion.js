/**
 * Reactive flag for the user's "prefers-reduced-motion" setting.
 * @returns {import('vue').Ref<boolean>} true when the user asked for reduced motion
 */
export const useReducedMotion = () => {
	const reduced = ref(false);

	onMounted(() => {
		const query = window.matchMedia('(prefers-reduced-motion: reduce)');
		reduced.value = query.matches;

		const onChange = (event) => reduced.value = event.matches;
		query.addEventListener('change', onChange);

		onBeforeUnmount(() => query.removeEventListener('change', onChange));
	});

	return reduced;
};
