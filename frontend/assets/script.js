// === frontend/assets/script.js ===

let clientId = '';
let musicList = [];
let currentIndex = 0;
const audio = document.getElementById('audio');

async function registerClient() {
  const name = document.getElementById('client-name').value;
  if (!name) return alert('Zəhmət olmasa butik adını daxil edin');

  const res = await fetch('http://localhost:3000/api/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name })
  });

  const data = await res.json();
  clientId = data.clientId;

  document.getElementById('register-section').style.display = 'none';
  document.getElementById('player-section').style.display = 'block';
  document.getElementById('welcome').innerText = `${name} üçün seçilmiş musiqilər:`;

  loadMusicList();
}

async function loadMusicList() {
  const res = await fetch(`http://localhost:3000/api/music?client=${clientId}`);
  musicList = await res.json();

  const list = document.getElementById('music-list');
  list.innerHTML = '';
  musicList.forEach((music, i) => {
    const li = document.createElement('li');
    li.textContent = music.title;
    li.onclick = () => playTrack(i);
    list.appendChild(li);
  });

  if (musicList.length > 0) playTrack(0);
}

function playTrack(index) {
  if (!musicList[index]) return;
  currentIndex = index;
  const music = musicList[index];
  audio.src = `http://localhost:3000/audio/${music.fileName}`;
  audio.play();
  document.getElementById('play-btn').textContent = '⏸';
}

function togglePlay() {
  if (audio.paused) {
    audio.play();
    document.getElementById('play-btn').textContent = '⏸';
  } else {
    audio.pause();
    document.getElementById('play-btn').textContent = '▶️';
  }
}

function nextTrack() {
  currentIndex = (currentIndex + 1) % musicList.length;
  playTrack(currentIndex);
}

function prevTrack() {
  currentIndex = (currentIndex - 1 + musicList.length) % musicList.length;
  playTrack(currentIndex);
}
