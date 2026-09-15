import { fileURLToPath } from 'node:url'

const baseStyles = fileURLToPath(new URL('./assets/styles/base', import.meta.url))

// Inject sass:color + our variables and mixins into every stylesheet, except
// the base partials themselves (they would otherwise @use themselves).
const injectScss = (source: string, filePath: string) => {
	const normalized = filePath.replace(/\\/g, '/')

	if (normalized.includes('/assets/styles/base/'))
		return source

	return `@use "sass:color";\n@use "${baseStyles}/variables" as *;\n@use "${baseStyles}/mixins" as *;\n\n${source}`
}

export default defineNuxtConfig({
	compatibilityDate: '2025-07-01',
	ssr: true,
	devtools: { enabled: false },

	modules: ['@pinia/nuxt'],

	css: ['@/assets/styles/index.scss'],

	pinia: {
		storesDirs: ['./stores/**']
	},

	vite: {
		css: {
			preprocessorOptions: {
				scss: {
					api: 'modern',
					additionalData: injectScss
				}
			}
		}
	},

	app: {
		head: {
			htmlAttrs: { lang: 'ru' },
			title: 'Павел и Ангелина — приглашение на свадьбу',
			meta: [
				{ charset: 'utf-8' },
				{ name: 'viewport', content: 'width=device-width, initial-scale=1, viewport-fit=cover' },
				{ name: 'description', content: 'Мы женимся! 2 октября 2026 года, ресторан «Фермер». Будем счастливы разделить этот день с вами.' },
				{ name: 'theme-color', content: '#f6f4ef' },
				{ property: 'og:type', content: 'website' },
				{ property: 'og:title', content: 'Павел и Ангелина — приглашение на свадьбу' },
				{ property: 'og:description', content: '2 октября 2026 · пятница · Ресторан «Фермер»' },
				{ property: 'og:image', content: '/og-image.png' },
				{ property: 'og:image:width', content: '1200' },
				{ property: 'og:image:height', content: '630' },
				{ property: 'og:image:alt', content: 'Павел и Ангелина — приглашение на свадьбу' },
				{ name: 'twitter:card', content: 'summary_large_image' },
				{ name: 'twitter:title', content: 'Павел и Ангелина — приглашение на свадьбу' },
				{ name: 'twitter:description', content: '2 октября 2026 · пятница · Ресторан «Фермер»' },
				{ name: 'twitter:image', content: '/og-image.png' }
			],
			link: [
				{ rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
				{ rel: 'preconnect', href: 'https://fonts.googleapis.com' },
				{ rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
				{
					rel: 'stylesheet',
					href: 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Great+Vibes&family=Jost:wght@300;400;500&display=swap'
				}
			],
			script: [
				{ innerHTML: "document.documentElement.classList.add('has-js')", tagPosition: 'head' }
			]
		}
	}
})
