document.addEventListener('DOMContentLoaded', init)

function init() {
	handleHomePage()
	handleAboutPage()
	handleActiveLink()
}

function handleActiveLink() {
// get current URL path
	const currentPath = window.location.pathname.split("/").pop();

// loop all nav links
	document.querySelectorAll(".header .nav-item > a").forEach(parentLink => {
		const dropdown = parentLink.nextElementSibling;

		// check if parent link itself matches
		if (parentLink.getAttribute("href") && parentLink.getAttribute("href").includes(currentPath)) {
			parentLink.classList.add("active");
		}

		// check dropdown children
		if (dropdown && dropdown.matches(".dropdown-menu")) {
			const childLinks = dropdown.querySelectorAll("a");
			childLinks.forEach(child => {
				if (child.getAttribute("href") && child.getAttribute("href").includes(currentPath)) {
					child.classList.add("active");     // highlight child
					parentLink.classList.add("active"); // highlight parent
				}
			});
		}
	});


}

function handleHeroSlider(){
	const slidesInfo = document.querySelectorAll(".sliders-info .slide");
	const thumbsInfo = document.querySelectorAll(".thumbs-wrapper .slide-thumb");

	slidesInfo[0].classList.add("active");
	thumbsInfo[0].classList.add("active");

	thumbsInfo.forEach((thumb, index) => {
		thumb.addEventListener("click", () => {


			thumbsInfo.forEach(el => el.classList.remove("active"));
			slidesInfo.forEach(el => el.classList.remove("active"));

			thumb.classList.add("active");
			slidesInfo[index].classList.add("active");
		});
	});
}

function handleActivitiesCards() {
	const cards = document.querySelectorAll(".cards-container .card:not(.card-preview)");
	const cardPreview = document.querySelector(".card-preview");

	// init first active
	cards[0].classList.add("active");

	cards.forEach(card => {
		card.addEventListener("click", () => {
			cards.forEach(el => el.classList.remove("active"));
			card.classList.add("active");

			const previewDate = cardPreview.querySelector(".card-date");
			const previewTitle = cardPreview.querySelector(".card-title");
			const previewDesc = cardPreview.querySelector(".card-desc");
			const previewImage = cardPreview.querySelector(".card-image");

			// add fade-out
			[previewDate, previewTitle, previewDesc, previewImage].forEach(el => el.classList.add("fade-out"));

			setTimeout(() => {
				previewDate.innerHTML = card.querySelector(".card-date").innerHTML;
				previewTitle.innerHTML = card.querySelector(".card-title").innerHTML;
				previewDesc.innerHTML = card.querySelector(".card-desc").innerHTML;
				previewImage.innerHTML = card.querySelector(".card-image").innerHTML;

				// switch to fade-in
				[previewDate, previewTitle, previewDesc, previewImage].forEach(el => {
					el.classList.remove("fade-out");
					el.classList.add("fade-in");
				});

				setTimeout(() => {
					[previewDate, previewTitle, previewDesc, previewImage].forEach(el => el.classList.remove("fade-in"));
				}, 400);
			}, 400);
		});
	});
}

function handleStatistics() {
	const statisticsList = document.querySelector(".statistics-list");

	if (statisticsList) {
		const items = statisticsList.querySelectorAll(".statistic-item");

		// Create swiper structure
		const newSwiper = document.createElement("div");
		newSwiper.classList.add("swiper");

		const swiperWrapper = document.createElement("div");
		swiperWrapper.classList.add("swiper-wrapper");
		newSwiper.appendChild(swiperWrapper);

		// Add navigation buttons
		const btnNext = document.createElement("div");
		btnNext.classList.add("swiper-button-next");

		const btnPrev = document.createElement("div");
		btnPrev.classList.add("swiper-button-prev");

		newSwiper.appendChild(btnNext);
		newSwiper.appendChild(btnPrev);

		// Group each 2 items into one slide
		for (let i = 0; i < items.length; i += 2) {
			const swiperSlide = document.createElement("div");
			swiperSlide.classList.add("swiper-slide");

			const slideContent = document.createElement("div");
			slideContent.classList.add("statistics-slide-group");

			[items[i], items[i + 1]].forEach(item => {
				if (item) {
					const title = item.querySelector(".stat-title")?.textContent || "";
					const desc = item.querySelector(".stat-desc")?.textContent || "";
					const label = item.querySelector(".stat-label")?.textContent || "";
					const values = [...item.querySelectorAll(".chart-value")];

					// Extract chart data
					const labels = values.map(v => v.dataset.label);
					const data = values.map(v => parseFloat(v.dataset.value));
					const colors = values.map(v => v.dataset.color);

					const total = data.reduce((sum, val) => sum + val, 0);

					// Build new structure
					const newItem = document.createElement("div");
					newItem.classList.add("statistic-item");

					// Left column (info + legend)
					const colInfo = document.createElement("div");
					colInfo.classList.add("statistic-item__col");

					const statTitle = document.createElement("h3");
					statTitle.classList.add("stat-title");
					statTitle.textContent = title;

					const statDesc = document.createElement("p");
					statDesc.classList.add("stat-desc");
					statDesc.textContent = desc;

					const legendWrapper = document.createElement("div");
					legendWrapper.classList.add("stat-legend");

					labels.forEach((lbl, idx) => {
						const legend = document.createElement("span");
						legend.classList.add("legend");

						const legendLabel = document.createElement("span");
						legendLabel.classList.add("legend-label");
						legendLabel.textContent = lbl;

						const legendColor = document.createElement("span");
						legendColor.classList.add("legend-color");
						legendColor.style.backgroundColor = colors[idx];

						legend.appendChild(legendLabel);
						legend.appendChild(legendColor);
						legendWrapper.appendChild(legend);
					});

					colInfo.appendChild(statTitle);
					colInfo.appendChild(statDesc);
					// colInfo.appendChild(legendWrapper);

					// Right column (chart + total)
					const colChart = document.createElement("div");
					colChart.classList.add("statistic-item__col");

					const canvasWrapper = document.createElement("div");
					canvasWrapper.classList.add("canvas-wrapper");

					const statTotal = document.createElement("div");
					statTotal.classList.add("stat-total");

					const statLabel = document.createElement("span");
					statLabel.classList.add("stat-label");
					statLabel.textContent = label;

					const totalDiv = document.createElement("div");
					totalDiv.classList.add("total");
					totalDiv.textContent = total;

					statTotal.appendChild(statLabel);
					statTotal.appendChild(totalDiv);

					const canvas = document.createElement("canvas");
					canvas.classList.add("stat-chart");

					canvasWrapper.appendChild(statTotal);
					canvasWrapper.appendChild(canvas);
					colChart.appendChild(canvasWrapper);

					// Append cols
					newItem.appendChild(colInfo);
					newItem.appendChild(colChart);

					// Add to slide
					slideContent.appendChild(newItem);

					// Init chart
					new Chart(canvas, {
						type: "doughnut",
						data: {
							labels,
							datasets: [{
								data,
								backgroundColor: colors
							}]
						},
						options: {
							responsive: true,
							cutout: "70%",
							plugins: {
								legend: { display: true }
							}
						}
					});
				}
			});

			swiperSlide.appendChild(slideContent);
			swiperWrapper.appendChild(swiperSlide);
		}

		statisticsList.replaceWith(newSwiper);
	}

	// Init Swiper
	const statisticsSwiper = new Swiper(".swiper", {
		slidesPerView: 1,
		spaceBetween: 20,
		effect: "fade",
		loop:true,
		fadeEffect: {
			crossFade: true,
		},
		speed: 600,
		navigation: {
			nextEl: ".swiper-button-next",
			prevEl: ".swiper-button-prev"
		}
	});
}

function handleVideo() {
	const videoWrapper = document.querySelector(".video-wrapper")
	const videoElement = videoWrapper.querySelector("video");
	const buttonPlay = videoWrapper.querySelector(".button-play");
	const muteBtn = videoWrapper.querySelector(".mute-sound");

	// lottie.loadAnimation({
	// 	container: buttonPlay.querySelector(".icon[data-icon=play-pause-button]"),
	// 	renderer: 'svg',
	// 	loop: true,
	// 	autoplay: true,
	// 	path: `assets/lottie_icons/play-pause-button.json`
	// });

	function toggleVideo() {
		if (videoElement.paused) {
			videoElement.play();


			buttonPlay.classList.add("button-active");   // ensure active
		} else {
			videoElement.pause();
			buttonPlay.classList.remove("button-active"); // ensure inactive
		}
	}

	//button click
	buttonPlay.addEventListener("click", toggleVideo);

	videoElement.addEventListener("click", toggleVideo);


	muteBtn.addEventListener("click", () => {
		videoElement.muted = !videoElement.muted;
		if (videoElement.muted) {
			muteBtn.classList.add("muted");
		} else {
			muteBtn.classList.remove("muted");
		}
	});


	// if (buttonPlay) buttonPlay.classList.add("button-active");
	if (muteBtn) muteBtn.classList.add("muted");

}

function handleHomePageAnimations() {
	gsap.set([".circle", ".phone", ".logo", ".login", ".section-app__side"], {
		opacity: 0,
	});


	// GSAP fade-in for each section
	gsap.utils.toArray(".section:not(.section-apps)").forEach((section, i) => {
		gsap.fromTo(section,
			{ opacity: 0 },
			{
				opacity: 1,
				duration: 1,
				delay: i * 0.1, // stagger by index
				ease: "power2.out",
				scrollTrigger: {
					trigger: section,
					start: "top 80%", // animate when section enters viewport
					toggleActions: "play none none none"
				}
			}
		);
	});



	let tl = gsap.timeline({
		scrollTrigger: {
			trigger: ".section-apps",
			start: "top 50%",
		}
	});

	tl
		.to(".section-app__side", { opacity: 1, duration: 1, ease: "sine.out" })
		.to(".circle", { opacity: 1, duration: 0.6, ease: "sine.out" },"-=0.4")
		.to(".phone", { y: "1%", opacity: 1, duration: 1, ease: "back.out(1.3)" },)
		.to(".logo", { opacity: 1, duration: 0.7, ease: "sine.out" }, "-=0.1")
		.to(".login", { opacity: 1, duration: 0.7, ease: "sine.out" }, "-=0.1")

}


function setupThumbnails() {
	document.querySelectorAll('.video-link').forEach(link => {
		const videoTag = link.querySelector('video');
		const iframe = link.querySelector('iframe');
		let thumb;


		if (videoTag) {
			if (videoTag.getAttribute('poster')) {
				thumb = videoTag.getAttribute('poster');

			} else {
				const canvas = document.createElement('canvas');
				videoTag.addEventListener('loadeddata', () => {
					canvas.width = videoTag.videoWidth;
					canvas.height = videoTag.videoHeight;
					canvas.getContext('2d').drawImage(videoTag, 0, 0);
					thumb = canvas.toDataURL('image/png');
					console.log({thumb})
					insertThumbnail(link, thumb);
				});
				return;
			}
		}

		// Case 2: YouTube iframe
		if (!videoTag && link.dataset.video.includes("youtube")) {
			const match = link.dataset.video.match(/youtube.*(?:\/|v=)([^"&?/\s]{11})/);
			if (match && match[1]) {
				const videoId = match[1];
				thumb = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
			}
		}

		// Insert the image
		insertThumbnail(link, thumb);
	});
}

function handleThumbnailVideo() {



	function insertThumbnail(link, src) {
		if (!src) return;
		if (!link.querySelector('img')) {
			const img = document.createElement('img');
			img.alt = "Video thumbnail";
			// link.appendChild(img);
		}
		// link.querySelector('img').src = src;
	}

// Run after DOM ready
	setupThumbnails();


	if (document.querySelector('.video-wrapper')) {
		lightGallery(document.querySelector('.video-wrapper'), {
			selector: 'a',
			plugins: [lgVideo],
			download: false,
			zoomFromOrigin: false,
			allowMediaOverlap: true,
		});
	}

	if (document.querySelector('.iframe-wrapper')) {
		lightGallery(document.querySelector('.iframe-wrapper'), {
			selector: 'a',
			plugins: [lgVideo],
			download: false,
			zoomFromOrigin: false,
			allowMediaOverlap: true,
		});
	}
}

function handleStatisticsPage() {
	const cards = document.querySelectorAll('.section-charts .cards-wrapper .card');
	cards.forEach(card => {
		const wrapper = card.querySelector('.canvas-wrapper');
		const ctx = card.querySelector('canvas');


		const labels = JSON.parse(wrapper.dataset.labels);
		const values = JSON.parse(wrapper.dataset.values);
		const colors = JSON.parse(wrapper.dataset.colors);

		new Chart(ctx, {
			type: 'doughnut',
			data: {
				labels: labels,
				datasets: [{
					data: values,
					backgroundColor: colors
				}]
			},
			options: {
				cutout: '70%',
				plugins: {
					legend: {
						position: 'bottom'
					}
				}
			}
		});
	})

}


function handleHomePage() {
	if (document.querySelector('.homepage')) {
		handleHomePageAnimations()
		handleHeroSlider();
		handleActivitiesCards();
		handleStatistics();
		handleThumbnailVideo()
		//handleVideo()
	}

	if (document.querySelector('.statistics-page')) {
		handleStatisticsPage()
	}

	const gallery = document.querySelector(".section-gallery.photos");
	if (gallery) {
		lightGallery(gallery, {
			selector: 'a',
			animateThumb: true,
			plugins: [lgVideo],
			zoomFromOrigin: false,
			allowMediaOverlap: true,
			toggleThumb: true,
		});
	}




	document.querySelectorAll(".card-link").forEach(link => {
		const url = link.getAttribute("href");

		// Check if the link is a YouTube URL
		if (/youtu(?:\.be|be\.com)/.test(url)) {
			const match = url.match(/(?:v=|\/)([0-9A-Za-z_-]{11})/);
			if (match) {
				const videoId = match[1];
				const img = link.querySelector("img");
				if (img) {
					// use maxresdefault.jpg if you want HD
					img.src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
					img.alt = "YouTube thumbnail";
				}
			}
		}
	});



	if (document.querySelector(".videos")) {
		lightGallery(document.querySelector(".videos"), {
			selector: 'a',
			animateThumb: true,
			plugins: [lgVideo],
			zoomFromOrigin: false,
			allowMediaOverlap: true,
			toggleThumb: true,
		});
	}



	if (document.querySelector(".agreements-details")) {
		lightGallery(document.querySelector(".agreements-details .img-wrapper"), {
			selector: 'a',
			animateThumb: true,
			zoomFromOrigin: false,
			allowMediaOverlap: true,
			toggleThumb: true,
		});
	}


	const newsGallery = document.querySelector(".news-details");

	if (newsGallery) {
		lightGallery(newsGallery, {
			selector: 'a',
			plugins: [lgZoom, lgThumbnail],
			speed: 500,
			download: false,
			getCaptionFromTitleOrAlt: false
		});
	}








}


function handleAboutPage() {
	if (document.querySelector('.section-achievements .item-achievement')) {
		gsap.to(".section-achievements .item-achievement", {
			opacity: 1,
			duration: 2,
			stagger: 0.2,
			ease: "power2.out",
			scrollTrigger: {
				trigger: ".section-achievements",
				start: "top 80%",
				toggleActions: "play none none none",
			}
		});
	}

}
