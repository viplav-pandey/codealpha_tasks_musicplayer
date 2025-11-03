document.addEventListener('DOMContentLoaded', () => {
    const musicContainer = document.querySelector('.player-container');
    const playBtn = document.getElementById('play');
    const prevBtn = document.getElementById('prev');
    const nextBtn = document.getElementById('next');
    const audio = document.getElementById('audio-source');
    const progress = document.getElementById('progress');
    const progressContainer = document.getElementById('progress-container');
    const title = document.getElementById('title');
    const artist = document.getElementById('artist');
    const albumArt = document.getElementById('album-art');
    const currentTimeEl = document.getElementById('current-time');
    const durationEl = document.getElementById('duration');
    const volumeSlider = document.getElementById('volume-slider');
    const songListElement = document.getElementById('song-list');
    const backgroundContainer = document.querySelector('.background-container');

    const songs = [
        {
            title: 'Naseeb',
            artist: 'Kontra',
            src: 'naseeb.mp3',
            albumArt: 'naseeb.jpg',
        },
        {
            title: 'Bang-Bird',
            artist: 'thebirdbrand',
            src: 'bang-bang.mp3',
            albumArt: 'bang.jpg',
        },
        {
            title: 'Illegal',
            artist: 'Allexandroleens',
            src: 'illegal.mp3',
            albumArt: 'control.jpg',
        },
    ];

    let songIndex = 0;
    
    // Function to load song details and update UI
    function loadSong(song) {
        title.textContent = song.title;
        artist.textContent = song.artist;
        audio.src = song.src;
        albumArt.src = song.albumArt;
        backgroundContainer.style.backgroundImage = `url('${song.albumArt}')`;
        updateSongListUI();
    }

    // Play song
    function playSong() {
        musicContainer.classList.add('play');
        albumArt.style.animationPlayState = 'running';
        playBtn.querySelector('i.fas').classList.remove('fa-play');
        playBtn.querySelector('i.fas').classList.add('fa-pause');
        audio.play();
    }

    // Pause song
    function pauseSong() {
        musicContainer.classList.remove('play');
        albumArt.style.animationPlayState = 'paused';
        playBtn.querySelector('i.fas').classList.remove('fa-pause');
        playBtn.querySelector('i.fas').classList.add('fa-play');
        audio.pause();
    }

    // Previous song
    function prevSong() {
        songIndex = (songIndex - 1 + songs.length) % songs.length;
        loadSong(songs[songIndex]);
        playSong();
    }

    // Next song
    function nextSong() {
        songIndex = (songIndex + 1) % songs.length;
        loadSong(songs[songIndex]);
        playSong();
    }

    // Update progress bar
    function updateProgress(e) {
        const { duration, currentTime } = e.srcElement;
        const progressPercent = (currentTime / duration) * 100;
        progress.style.width = `${progressPercent}%`;

        const min = Math.floor(currentTime / 60);
        const sec = Math.floor(currentTime % 60);
        currentTimeEl.textContent = `${min}:${sec < 10 ? '0' : ''}${sec}`;
    }

    // Set duration
    function setDuration() {
        const duration = audio.duration;
        const min = Math.floor(duration / 60);
        const sec = Math.floor(duration % 60);
        durationEl.textContent = `${min}:${sec < 10 ? '0' : ''}${sec}`;
    }

    // Set progress bar on click
    function setProgress(e) {
        const width = this.clientWidth;
        const clickX = e.offsetX;
        const duration = audio.duration;
        audio.currentTime = (clickX / width) * duration;
    }

    // Update volume
    function setVolume() {
        audio.volume = volumeSlider.value;
    }

    // Render song list
    function renderSongList() {
        songListElement.innerHTML = '';
        songs.forEach((song, index) => {
            const songItem = document.createElement('li');
            songItem.classList.add('song-item');
            if (index === songIndex) {
                songItem.classList.add('active');
            }
            songItem.dataset.index = index;

            songItem.innerHTML = `
                <img src="${song.albumArt}" alt="${song.title}" class="song-item-album-art">
                <div class="song-item-info">
                    <span class="song-item-title">${song.title}</span>
                    <span class="song-item-artist">${song.artist}</span>
                </div>
            `;
            songItem.addEventListener('click', () => {
                songIndex = index;
                loadSong(songs[songIndex]);
                playSong();
            });
            songListElement.appendChild(songItem);
        });
    }

    // Update active class in song list
    function updateSongListUI() {
        const allSongItems = document.querySelectorAll('.song-item');
        allSongItems.forEach((item, index) => {
            if (index === songIndex) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    }

    // Event Listeners
    playBtn.addEventListener('click', () => {
        const isPlaying = musicContainer.classList.contains('play');
        if (isPlaying) {
            pauseSong();
        } else {
            playSong();
        }
    });

    prevBtn.addEventListener('click', prevSong);
    nextBtn.addEventListener('click', nextSong);
    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('loadedmetadata', setDuration);
    progressContainer.addEventListener('click', setProgress);
    audio.addEventListener('ended', nextSong);
    volumeSlider.addEventListener('input', setVolume);

    // Initial load
    loadSong(songs[songIndex]);
    renderSongList();
    setVolume();
});