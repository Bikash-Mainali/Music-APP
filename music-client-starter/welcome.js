
const BASE_URL = 'http://localhost:3000';
// const TOKEN = localStorage.getItem('token');
const USERNAME = localStorage.getItem('username');

let nowPlaying = document.querySelector(".now-playing");
let songTitle = document.querySelector(".song-title");
let playpauseBtn = document.querySelector(".playpause-song");
let nextBtn = document.querySelector(".next-song");
let prevBtn = document.querySelector(".prev-song");
let playMode = document.querySelector(".play-mode");
let seekSlider = document.querySelector(".seek-slider");
let volumeSlider = document.querySelector(".volume-slider");
let currTime = document.querySelector(".current-time");
let totalDuration = document.querySelector(".total-duration");


let currentSongIndex = 0;
let isPlaying = false;
let suffleMode = false;
let repeatMode = false;
let defaultMode = true;
let setModeCount = 0;

let playModeMap = new Map();
playModeMap.set('defualt', 0);
playModeMap.set('repeat', 1);
playModeMap.set('suffle', 2);

let updateTimer;
let playListBackUp;

// Create new audio element
let currentSong = document.createElement('audio');

window.onload = function () {
    //apply http interceptor
    if (!TOKEN) {
        //location.href = 'login.html';
        document.getElementById('music-section').style.display = 'none';
    }
    init();
    document.getElementById('logoutBtn').onclick = logout;

    getAllSongs();
    getAllPlayListSongs();
}

function init() {
    document.getElementById('username').innerText = USERNAME;
}

function logout() {
    localStorage.removeItem('username');
    localStorage.removeItem('token');
    //can be made single plage with css
    //location.href = 'login.html';
    
}

async function getAllSongs() {
    const response = await fetch(BASE_URL + '/api/music', {
        headers: HEADERS
    })
    const songs = await response.json();
    populateToMusicTable(songs);
}
async function getAllPlayListSongs() {
    const response = await fetch(BASE_URL + '/api/playlist', {
        headers: HEADERS
    })
    const playList = await response.json();
    playListBackUp = playList;
    populateToPlayListTable(playList);
    if (isPlayListEmpty(playList)) {
        document.getElementById("empty-table").innerHTML = `<small>Songs not added yet</small>`;
        document.querySelector('.player').style.display = 'none';
    } else {
        document.getElementById("empty-table").innerHTML = `<small>${playList.length} songs in your play list</small>`;
    }
}

populateToMusicTable = (songs) => {
    let tBody = ''
    songs.forEach((song, index) => {
        tBody += `
        <tr id="row${index + 1}">
        <td>
            <span>${index + 1}</span>
            <span style="display:none">${song.id}</span>
        </td>
        <td>${song.title}</td>
        <td>${song.releaseDate}</td>
        <td>
            <button 
                class="fa fa-plus-circle add-to-play-list" 
                value= ${song.id} 
                aria-hidden="true" 
                onclick="addToPlayList(this)">
            </button>
        </td>
        </tr>`
    });

    let musicTable = `<h2>Songs For You</h2>
                        <table class="table">
                          <thead>
                            <tr>
                              <th>ID</th>
                              <th>Title</th>
                              <th>Release Date</th>
                              <th>Action</th>
                            </tr>
                          </thead>
                          <tbody> ${tBody}</tBody>
                        </table>`
    document.getElementById('musiclist-table-container').innerHTML = musicTable;
}

populateToPlayListTable = (playList) => {
    let tBody = ''
    playList.forEach((song, index) => {
        tBody += `
        <tr id="row${index + 1}">
        <td>
            <span>${index + 1}</span>
            <span style="display:none">${song.songId}</span>
        </td>
        <td>${song.title}</td>
        <td><button class="fa fa-minus-circle add-to-play-list" aria-hidden="true" value=${song.songId} onclick="removeFromPlayList(this)"></button></td>
        <td><button value='${index}' onclick="playpauseSong(this)"><i class="fa fa-play-circle fa-2x"></button></td>
        </tr>`
    });
    let playListTable = `<h2>Your Playlist</h2>
    <table class="table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Title</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody> ${tBody}</tBody>
    </table>`
    document.getElementById('playlist-table-container').innerHTML = playListTable;

}


// function playSong(currentBtn){
//     debugger
//     const urlPath = JSON.parse(currentBtn.value).urlPath;
//     const runningSongId = JSON.parse(currentBtn.value).songId;
//     const title = JSON.parse(currentBtn.value).title;
//     let audioContent = `
//                     <p id="playing-song">${title}</p>
//                     <audio id="${runningSongId}" controls>
//                         <source id="audio-source" 
//                                 src="${BASE_URL +'/'}${urlPath}" 
//                                 type="audio/mp3">
//                         </source>
//                     </audio>
//                     <button id="prev-btn">Prev</button>
//                     <button id="next-btn">Next</button>

//                     `

//     document.getElementById('song-play-section').innerHTML = audioContent;

//     currentBtn.className = 'fa fa-pause';
//     currentBtn.value = currentBtn.value;
//     document.getElementById(runningSongId).play();
//     currentBtn.setAttribute('onclick', `pauseSong(this)`);
// }

// function pauseSong(currentBtn){
//     currentBtn.className = 'fa fa-play';
//     currentBtn.value = currentBtn.value;
//     document.getElementById(JSON.parse(currentBtn.value).songId).pause();
//     currentBtn.setAttribute('onclick', `playSong(this)`);
// }

//to do
//set all other songs in stopped mode
// function setOthersIdle(){

// }

async function addToPlayList(currentRow) {
    console.log("adding song to the playlist");
    const response = await fetch(`${BASE_URL}/api/playlist/add`, {
        method: 'POST',
        body: JSON.stringify({
            "songId": currentRow.value
        }),
        headers: HEADERS
    });
    //refresh play list
    if (response.status) {
        getAllPlayListSongs();
    }
}

async function removeFromPlayList(currentRow) {
    console.log("removing song from the playlist");
    const response = await fetch(`${BASE_URL}/api/playlist/remove`, {
        method: 'POST',
        body: JSON.stringify({
            "songId": currentRow.value
        }),
        headers: HEADERS
    });
    if (currentSong.value === currentRow.value) {
        //clear song from current player section
        resetPlayerSection();
    }
    //refresh play list

    getAllPlayListSongs();
}
function resetPlayerSection() {
    currentSong.src = '';
    songTitle.textContent = ''
    nowPlaying.textContent = ''
    playpauseBtn.innerHTML = '<i class="fa fa-play-circle fa-5x"></i>';;
    clearInterval(updateTimer);
    resetValues();
}

function isPlayListEmpty(playList) {
    return playList.length == 0;
}

function loadSong(songIndex) {
    currentSongIndex = parseInt(songIndex);
    document.querySelector(".player").style.display = 'block';
    clearInterval(updateTimer);
    resetValues();
    currentSong.src = BASE_URL + "/" + playListBackUp[currentSongIndex].urlPath;
    currentSong.value = playListBackUp[currentSongIndex].songId;
    //currentSong.load();
    nowPlaying.textContent = `PLAYING ${parseInt(currentSongIndex) + 1}  OF ${playListBackUp.length}`;
    songTitle.textContent = playListBackUp[currentSongIndex].title;
    updateTimer = setInterval(seekUpdate, 1000);
    currentSong.addEventListener('ended', nextSong);
    // random_bg_color();

}

function resetValues() {
    currTime.textContent = "00:00";
    totalDuration.textContent = "00:00";
    seekSlider.value = 0;
}

// Load the first song in the songlist
//loadSong(songIndex);

function playpauseSong(currentBtn) {
    if (!isPlaying) playSong(currentBtn);
    else pauseSong(currentBtn);
}

function playSong(currentBtn) {
    if (currentBtn) {
        loadSong(currentBtn.value);
        currentBtn.innerHTML = '<i class="fa fa-pause-circle fa-2x"></i>';
    }
    currentSong.play(); 
    isPlaying = true;
    playpauseBtn.innerHTML = '<i class="fa fa-pause-circle fa-5x"></i>';
}

function pauseSong(currentBtn) {
    if(currentBtn){
        currentBtn.innerHTML = '<i class="fa fa-play-circle fa-2x"></i>';
    }
    currentSong.pause();
    isPlaying = false;
    playpauseBtn.innerHTML = '<i class="fa fa-play-circle fa-5x"></i>';;
}

function nextSong() {
    //it is not needed to write tho
    if (repeatMode) {
        currentSongIndex = currentSongIndex;
    }
    if (suffleMode) {
        currentSongIndex = Math.floor(Math.random() * playListBackUp.length)
    }
    if (defaultMode) {
        if (currentSongIndex < playListBackUp.length - 1) {
            currentSongIndex += 1;
        }
        else {
            currentSongIndex = 0;
        }
    }
    debugger
    loadSong(currentSongIndex);
    playSong();
}

function prevSong() { 
    if (repeatMode) {
        currentSongIndex = currentSongIndex;
    }
    if (suffleMode) {
        currentSongIndex = Math.floor(Math.random() * playListBackUp.length)
    }
    if (defaultMode) {
        if (currentSongIndex > 0) {
            currentSongIndex -= 1;
        }
        else {
            currentSongIndex = playListBackUp.length - 1;
        }
    }

    loadSong(currentSongIndex);
    playSong();
}

function seekTo() {
    let seekto = currentSong.duration * (seekSlider.value / 100);
    currentSong.currentTime = seekto;
}

function setVolume() {
    currentSong.volume = volumeSlider.value / 100;
}

function seekUpdate() {
    let seekPosition = 0;

    if (!isNaN(currentSong.duration)) {
        seekPosition = currentSong.currentTime * (100 / currentSong.duration);

        seekSlider.value = seekPosition;

        let currentMinutes = Math.floor(currentSong.currentTime / 60);
        let currentSeconds = Math.floor(currentSong.currentTime - currentMinutes * 60);
        let durationMinutes = Math.floor(currentSong.duration / 60);
        let durationSeconds = Math.floor(currentSong.duration - durationMinutes * 60);

        if (currentSeconds < 10) { currentSeconds = "0" + currentSeconds; }
        if (durationSeconds < 10) { durationSeconds = "0" + durationSeconds; }
        if (currentMinutes < 10) { currentMinutes = "0" + currentMinutes; }
        if (durationMinutes < 10) { durationMinutes = "0" + durationMinutes; }

        currTime.textContent = currentMinutes + ":" + currentSeconds;
        totalDuration.textContent = durationMinutes + ":" + durationSeconds;
    }
}


function setPlayMode() {
    setModeCount++;
    switch (setModeCount) {
        case 1: {
            defaultMode = false;
            repeatMode = true;
            suffleMode = false;
            playMode.innerHTML = '<i class="fa fa-repeat fa-2x"></i>'
            break;
        }
        case 2: {
            defaultMode = false;
            repeatMode = false;
            suffleMode = true;
            playMode.innerHTML = '<i class="fa fa-random fa-2x"></i>';
            break;
        }
        default:
            {
                playMode.innerHTML = '<i class="fas fa-circle fa-2x"></i>';
                defaultMode = true;
                repeatMode = false;
                suffleMode = false;
                setModeCount = 0;
            }
    }
}





