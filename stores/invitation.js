import { defineStore } from 'pinia';

/**
 * Single source of truth for the wedding invitation: the couple, the
 * schedule, the venue and the envelope open/closed state.
 */
export const useInvitationStore = defineStore('invitation', {
	state: () => ({
		// Envelope intro — true once the guest has broken the seal
		isOpened: false,

		couple: {
			bride: 'Ангелина',
			groom: 'Павел',
			initials: 'П & А',
			hashtag: '#ПавелИАнгелинаНавсегда'
		},

		hosts: {
			intro: 'С любовью и трепетом приглашают вас',
			line: 'разделить самый важный день нашей жизни'
		},

		event: {
			// ISO date used by the countdown
			datetime: '2026-10-02T15:30:00+03:00',
			dateLabel: '2 октября 2026',
			weekday: 'пятница',
			day: '02',
			month: 'Октябрь',
			timeLabel: '15:30'
		},

		venue: {
			name: 'Ресторан «Фермер»',
			address: 'Архонское шоссе, 10',
			note: 'Сбор гостей у входа в 15:30 — встречаем и провожаем к месту банкета',
			mapUrl: 'https://yandex.ru/maps/-/CTtByI4B'
		},

		schedule: [
			{
				time: '12:40',
				title: 'Церемония бракосочетания',
				text: 'Союз Архитекторов',
				icon: 'rings',
				locationAddress: 'ул. В. Баллаева, 7',
				mapUrl: 'https://yandex.ru/maps/-/CTtBNFLG'
			},
			{ time: '14:00', title: 'Свадебная речь', text: 'Тёплые слова от близких', icon: 'mic' },
			{ time: '15:30', title: 'Сбор гостей', icon: 'glasses' },
			{ time: '16:00', title: 'Банкет', text: 'Ужин, тосты и первый танец', icon: 'plate' },
			{ time: '19:30', title: 'Торт', text: 'Сладкий момент вечера', icon: 'cake' },
			{ time: '22:00', title: 'Завершение мероприятия', text: 'Прощаемся золотыми искрами', icon: 'sparkle' }
		],

		gallery: [
			{
				src: '/photos/couple-01.svg',
				caption: 'Там, где всё началось',
				video: '/video/hero-proposal.mp4',
				poster: '/video/hero-proposal-poster.jpg',
				song: '/audio/theme-song.m4a'
			},
			{ src: '/photos/couple-02.svg', caption: 'Первое путешествие вдвоём' },
			{ src: '/photos/couple-03.svg', caption: 'Тот самый «да»' },
			{ src: '/photos/couple-04.svg', caption: 'Каждое утро' }
		]
	}),

	getters: {
		coupleNames: (state) => `${state.couple.groom} & ${state.couple.bride}`
	},

	actions: {
		open() {
			this.isOpened = true;
		}
	}
});
