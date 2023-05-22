
const BASE_URL = 'http://localhost:3000/api/';
const TOKEN = localStorage.getItem('token');
const USERNAME = localStorage.getItem('username');
const HEADERS = {
    'Authorization': `Bearer ${TOKEN}`,
    'Content-Type': 'application/json'
}

window.onload = function () {
    //apply http interceptor
    if (!TOKEN) {
        location.href = 'login.html';
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
    location.href = 'login.html';
}

async function getAllSongs() {
    const response = await fetch(BASE_URL + '/music', {
        headers: HEADERS
    })
    const songs = await response.json();
    populateToMusicTable(songs);
}
async function getAllPlayListSongs() {
    const response = await fetch(BASE_URL + '/playlist', {
        headers: HEADERS
    })
    const playList = await response.json();
    populateToPlayListTable(playList);
    if(isPlayListEmpty){
        debugger
        document.getElementById("empty-table").innerHTML = `<small>Songs not added yet</small>`;
        document.getElementById('song-play-section').innerHTML = ''
    }else{
        document.getElementById("empty-table").innerHTML = `<small>${playList.length} songs in your play list</small>`;
    }

}

populateToMusicTable = (songs) => {
    let tBody = ''
    songs.forEach((song, index) => {
        tBody += `
        <tr id="row${index}">
        <td>
            <span>${index}</span>
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
        tBody += `<tr id="row${index}"}>
        <td>${song.songId}</td>
        <td>${song.title}</td>
        <td><button class="fa fa-minus-circle add-to-play-list" aria-hidden="true" value=${song.songId} onclick="removeFromPlayList(this)"></button></td>
        <td><button class="fa fa-play"  value=${song.urlPath} onclick="playSong(this)"></button></td>
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

function playSong(currentSong){
    const urlPath = currentSong.value;
    document.getElementById('song-play-section').innerHTML = 
    `<audio controls>
        <source id="audio-source" src="http://localhost:3000/${urlPath}" type="audio/mp3">
    </audio>`
}

async function addToPlayList(currentRow) {
    console.log("adding song to the playlist");
    const response = await fetch(`${BASE_URL}/playlist/add`, {
        method: 'POST',
        body: JSON.stringify({
            "songId": currentRow.value
        }),
        headers: HEADERS
    });
    //refresh play list
    if(response.status){
    //document.getElementById("myBtn").disabled = true;
    getAllPlayListSongs();
    }
}

async function removeFromPlayList(currentRow) {
    // const rowId = current.parentNode.parentNode.id;
    // const targetRow = document.getElementById(rowId);
    // const songId = targetRow.getElementsByTagName('td')[0].innerHTML;

    console.log("removing song from the playlist");
    const response = await fetch(`${BASE_URL}/playlist/remove`, {
        method: 'POST',
        body: JSON.stringify({
            "songId": currentRow.value
        }),
        headers: HEADERS
    });
    //refresh play list
    getAllPlayListSongs();
}

function isPlayListEmpty(playList) {
return playList.length != 0;
}



