// import marquee from 'https://cdn.jsdelivr.net/npm/vanilla-marquee/dist/vanilla-marquee.js';
//
// document.addEventListener('DOMContentLoaded', () => {
// 	const el = document.querySelector('.hero-section .ticker-tape');
// 	const instance = new marquee(el, {
// 		pauseOnHover: true,
// 		gap:80,
// 		speed: 50,
// 		direction: 'rtl'
// 	});
// });


import marquee from 'https://cdn.jsdelivr.net/npm/vanilla-marquee/dist/vanilla-marquee.js';

document.addEventListener('DOMContentLoaded', () => {
	const el = document.querySelector('.ticker-container .ticker');
	if (el) {
		const instance = new marquee(el, {
			pauseOnHover: true,
			gap:80,
			speed: 20,
			duplicated: true,
			direction: 'rtl',
		});
	}

});
