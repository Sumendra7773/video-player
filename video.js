'use-strict';

// @ts-check

const player = document.querySelector('.player');
const video = document.querySelector('video');
const progressRange = document.querySelector('.progress-range');
const progressBar = document.querySelector('.progress-bar');
const playBtn = document.getElementById('play-btn');
const volumeIcon = document.getElementById('volume-icon');
const VolumeRange = document.querySelector('.volume-range');
const VolumeBar = document.querySelector('.volume-bar');
const CurrentTime = document.querySelector('.time-elapsed');
const duration = document.querySelector('.time-duration');
const Speed = document.querySelector('.player-speed');
const FullscreenBtn = document.querySelector('.fullscreen');

// Play & Pause ----------------------------------- //
function showPlayIcon() {
	playBtn.classList.replace('fa-pause', 'fa-play');
	playBtn.setAttribute('title', 'play');
}
function togglePlay() {
	if (video.paused) {
		video.play();
		playBtn.classList.replace('fa-play', 'fa-pause');
		playBtn.setAttribute('title', 'pause');
	} else {
		video.pause();
		showPlayIcon();
	}
}

// On Video End, Show play button icon
video.addEventListener('ended', showPlayIcon);

// Progress Bar ---------------------------------- //

// Calculate display time formate
function displayTime(time) {
	const minutes = Math.floor(time / 60);
	let seconds = Math.floor(time % 60);
	seconds = seconds > 9 ? seconds : `0${seconds}`;
	return `${minutes}:${seconds}`;
}

// Update progress bar as video plays
function updateProgress() {
	progressBar.style.width = `${(video.currentTime / video.duration) * 100}%`;
	CurrentTime.textContent = `${displayTime(video.currentTime)}/`;
	duration.textContent = `${displayTime(video.duration)}`;
}

// Click to seek within the video
function setProgress(e) {
	const newTime = e.offsetX / progressRange.offsetWidth;
	progressBar.style.width = `${newTime * 100}%`;
	video.currentTime = newTime * video.duration;
}

// Volume Controls --------------------------- //
let lastVolume = 1;
// Volume Bar
function changeVolume(e) {
	let Volume = e.offsetX / VolumeRange.offsetWidth;
	// Rounding Volume up or down
	if (Volume < 0.1) Volume = 0;

	if (Volume > 0.9) Volume = 1;

	VolumeBar.style.width = `${Volume * 100}%`;
	video.volume = Volume;
	// change icon depending on volume
	volumeIcon.className = '';
	toggleVolumeIcon(Volume);

	lastVolume = Volume;
}

function toggleVolumeIcon(Volume) {
	if (Volume > 0.7) volumeIcon.classList.add('fas', 'fa-volume-up');
	else if (Volume < 0.7 && Volume > 0)
		volumeIcon.classList.add('fas', 'fa-volume-down');
	else if (Volume === 0) volumeIcon.classList.add('fas', 'fa-volume-off');
}

// Mute/Unmute
function toggleMute() {
	if (video.volume) {
		lastVolume = video.volume;
		video.volume = 0;
		VolumeBar.style.width = 0;
		volumeIcon.className = '';
		volumeIcon.classList.add('fas', 'fa-volume-mute');
		volumeIcon.setAttribute('title', 'unmute');
	} else {
		video.volume = lastVolume;
		VolumeBar.style.width = `${lastVolume * 100}%`;
		volumeIcon.className = '';
		toggleVolumeIcon(lastVolume);
		volumeIcon.setAttribute('title', 'mute');
	}
}

// Change Playback Speed -------------------- //

function changeSpeed(e) {
	video.playbackRate = Speed.value;
}

// Fullscreen ------------------------------- //

/* View in fullscreen */
function openFullscreen(elem) {
	if (elem.requestFullscreen) {
		elem.requestFullscreen();
	} else if (elem.webkitRequestFullscreen) {
		/* Safari */
		elem.webkitRequestFullscreen();
	} else if (elem.msRequestFullscreen) {
		/* IE11 */
		elem.msRequestFullscreen();
	}
	video.classList.add('video-fullscreen');
}

/* Close fullscreen */
function closeFullscreen() {
	if (document.exitFullscreen) {
		document.exitFullscreen();
	} else if (document.webkitExitFullscreen) {
		/* Safari */
		document.webkitExitFullscreen();
	} else if (document.msExitFullscreen) {
		/* IE11 */
		document.msExitFullscreen();
	}
	video.classList.remove('video-fullscreen');
}
let fullscreen = false;

// Toggle Fullscreen
function toggleFullscreen() {
	if (!fullscreen) {
		openFullscreen(player);
	} else {
		closeFullscreen();
	}
	fullscreen = !fullscreen;
}
// Event Listeners
playBtn.addEventListener('click', togglePlay);
video.addEventListener('click', togglePlay);
video.addEventListener('timeupdate', updateProgress);
video.addEventListener('canplay', updateProgress);
progressRange.addEventListener('click', setProgress);
VolumeRange.addEventListener('click', changeVolume);
volumeIcon.addEventListener('click', toggleMute);
Speed.addEventListener('change', changeSpeed);
FullscreenBtn.addEventListener('click', toggleFullscreen);
