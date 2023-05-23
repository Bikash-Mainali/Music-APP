// let now_playing = document.querySelector(".now-playing");
// let song_art = document.querySelector(".song-art");
// let song_name = document.querySelector(".song-name");
// let song_artist = document.querySelector(".song-artist");

// let playpause_btn = document.querySelector(".playpause-song");
// let next_btn = document.querySelector(".next-song");
// let prev_btn = document.querySelector(".prev-song");

// let seek_slider = document.querySelector(".seek_slider");
// let volume_slider = document.querySelector(".volume_slider");
// let curr_time = document.querySelector(".current-time");
// let total_duration = document.querySelector(".total-duration");

// let song_index = 0;
// let isPlaying = false;
// let updateTimer;

// // Create new audio element
// let current_song = document.createElement('audio');

// // Define the songs that have to be played
// let song_list = [
//   {
//     name: "Night Owl",
//     artist: "Broke For Free",
//     image: "https://images.pexels.com/photos/2264753/pexels-photo-2264753.jpeg?auto=compress&cs=tinysrgb&dpr=3&h=250&w=250",
//     path: "https://files.freemusicarchive.org/storage-freemusicarchive-org/music/WFMU/Broke_For_Free/Directionless_EP/Broke_For_Free_-_01_-_Night_Owl.mp3"
//   },
//   {
//     name: "Enthusiast",
//     artist: "Tours",
//     image: "https://images.pexels.com/photos/3100835/pexels-photo-3100835.jpeg?auto=compress&cs=tinysrgb&dpr=3&h=250&w=250",
//     path: "https://files.freemusicarchive.org/storage-freemusicarchive-org/music/no_curator/Tours/Enthusiast/Tours_-_01_-_Enthusiast.mp3"
//   },
//   {
//     name: "Shipping Lanes",
//     artist: "Chad Crouch",
//     image: "https://images.pexels.com/photos/1717969/pexels-photo-1717969.jpeg?auto=compress&cs=tinysrgb&dpr=3&h=250&w=250",
//     path: "https://files.freemusicarchive.org/storage-freemusicarchive-org/music/ccCommunity/Chad_Crouch/Arps/Chad_Crouch_-_Shipping_Lanes.mp3",
//   },
// ];

// function random_bg_color() {

// //   // Get a number between 64 to 256 (for getting lighter colors)
// //   let red = Math.floor(Math.random() * 256) + 64;
// //   let green = Math.floor(Math.random() * 256) + 64;
// //   let blue = Math.floor(Math.random() * 256) + 64;

// //   // Construct a color withe the given values
// //   let bgColor = "rgb(" + red + "," + green + "," + blue + ")";

// //   // Set the background to that color
// //   document.body.style.background = bgColor;
// }

// function loadSong(song_index) {
//   clearInterval(updateTimer);
//   resetValues();
//   current_song.src = song_list[song_index].path;
//   current_song.load();

//   song_art.style.backgroundImage = "url(" + song_list[song_index].image + ")";
//   song_name.textContent = song_list[song_index].name;
//   song_artist.textContent = song_list[song_index].artist;
//   now_playing.textContent = "PLAYING " + (song_index + 1) + " OF " + song_list.length;

//   updateTimer = setInterval(seekUpdate, 1000);
//   current_song.addEventListener('ended', nextSong);
//   random_bg_color();
// }

// function resetValues() {
//   curr_time.textContent = "00:00";
//   total_duration.textContent = "00:00";
//   seek_slider.value = 0;
// }

// // Load the first song in the songlist
// loadSong(song_index);

// function playpauseSong() {
//   if (!isPlaying) playSong();
//   else pauseSong();
// }

// function playSong() {
//   current_song.play();
//   isPlaying = true;
//   playpause_btn.innerHTML = '<i class="fa fa-pause-circle fa-5x"></i>';
// }

// function pauseSong() {
//   current_song.pause();
//   isPlaying = false;
//   playpause_btn.innerHTML = '<i class="fa fa-play-circle fa-5x"></i>';;
// }

// function nextSong() {
//   if (song_index < song_list.length - 1)
//     song_index += 1;
//   else song_index = 0;
//   loadSong(song_index);
//   playSong();
// }

// function prevSong() {
//   if (song_index > 0)
//     song_index -= 1;
//   else song_index = song_list.length;
//   loadSong(song_index);
//   playSong();
// }

// function seekTo() {
//   let seekto = current_song.duration * (seek_slider.value / 100);
//   current_song.currentTime = seekto;
// }

// function setVolume() {
//   current_song.volume = volume_slider.value / 100;
// }

// function seekUpdate() {
//   let seekPosition = 0;

//   if (!isNaN(current_song.duration)) {
//     seekPosition = current_song.currentTime * (100 / current_song.duration);

//     seek_slider.value = seekPosition;

//     let currentMinutes = Math.floor(current_song.currentTime / 60);
//     let currentSeconds = Math.floor(current_song.currentTime - currentMinutes * 60);
//     let durationMinutes = Math.floor(current_song.duration / 60);
//     let durationSeconds = Math.floor(current_song.duration - durationMinutes * 60);

//     if (currentSeconds < 10) { currentSeconds = "0" + currentSeconds; }
//     if (durationSeconds < 10) { durationSeconds = "0" + durationSeconds; }
//     if (currentMinutes < 10) { currentMinutes = "0" + currentMinutes; }
//     if (durationMinutes < 10) { durationMinutes = "0" + durationMinutes; }

//     curr_time.textContent = currentMinutes + ":" + currentSeconds;
//     total_duration.textContent = durationMinutes + ":" + durationSeconds;
//   }
// }


