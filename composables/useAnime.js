/**
 * Lazily loads anime.js on the client only, so it never runs during SSR.
 * @returns {{ load: () => Promise<Function> }} load resolves to the `anime` factory
 */
export const useAnime = () => {
	let promise = null;

	const load = () => {
		if (!import.meta.client)
			return Promise.resolve(null);

		if (!promise)
			promise = import('animejs').then((mod) => mod.default ?? mod);

		return promise;
	};

	return { load };
};
