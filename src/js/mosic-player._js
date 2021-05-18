import BaseComponent from '/js/base-component.js';
class MosicPlayer extends BaseComponent {

  ready = false;

  constructor() {
    super();
  }


  async mounted() {
    this.player = this.querySelector('audio');
    this.song = {};
    this.data._status = true;
    this.visible = true;
  }

  addBindings() {
    if (this.queue.currentSong) {
      this.ready = true;
      this.song = this.queue.currentSong;
    } else {
      this.queue.on('song-added', _ => {
        this.ready = true;
        this.song = this.queue.currentSong;
        this.updateMetadata();
      });
      this.queue.on('song-changed', _ => {
        this.ready = true;
        this.song = this.queue.currentSong;
        this.updateMetadata();
      });
    }

    this.querySelector('.mini-player__play').addEventListener('click', _ => {
      if (this.ready) {
        this.player.paused ? this.player.play() : this.player.pause();
        this.data._status = this.player.paused;
      }
    });

    this.querySelector('.mini-player__ff').addEventListener('click', async _ => {
      if (this.ready) {
        this.song = this.queue.nextSong;
      }
      // this.player.setAttribute('src', this.song.url.replace('/media/ander/music', '/music'));
      // console.log(this.data._status, this.song, this.player.src);
      // await this.player.play();
      this.updateMetadata();
    });

    this.player.addEventListener('pause', e => {
      if(e.target.currentTime != e.target.duration) {
        this.data._status = this.player.paused;
      }
    });

    this.player.addEventListener('play', _ => {
      this.data._status = this.player.paused;
    });

    this.player.addEventListener('ended', async _ => {
      this.data._song = this.queue.nextSong;
    });

    this.player.addEventListener('timeupdate', e => {
      const currentTime = e.target.currentTime;
      const duration = e.target.duration;
    });


    // document.addEventListener('visibilitychange', function(){
    //   this.visible = !document.hidden;
    // });

    if ('mediaSession' in navigator) {
      navigator.mediaSession.setActionHandler('nexttrack', _ => {
        this.queue.nextSong
      });
      navigator.mediaSession.setActionHandler('play', _ => {
        this.player.paused ? this.player.play() : this.player.pause();
      });
      navigator.mediaSession.setActionHandler('pause', _ => {
        this.player.paused ? this.player.play() : this.player.pause();
      });
    }

  }

  async updateMetadata() {
    const song = this.song;
    this.data._url = song.url.replace('/app/src/music', '/music');
    this.data._title = song.title;
    this.data._artist = song.artistName;

    if ('mediaSession' in navigator) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: song.title,
        artist: song.artistName,
        album: song.albumTitle,
        artwork: [
          { src: song.cover.replace('/app/src/music', '/music'), sizes: '512x512', type: 'image/jpg' }
        ]
      });
    }

    Promise.resolve().then(async _ => {
      this.data._status ? await this.player.pause() : await this.player.play();
      this.data._status = this.player.paused;
    });
  }

  get status() {
    const icon = this.data._status ? 'play' : 'pause';
    return `
      <svg class="icon">
        <use href="/img/sprite.svg#icon-${ icon }-fill"></use>
      </svg>
    `;
  }

  get title() {
    return this.data._title;
  }

  get artist() {
    return this.data._artist;
  }

  get duration() {
        
  }

  get html() {
    const html = `
      <div class="mini-player">
        <p class="mini-player__song" data-mosic-link data-target="/queue" bind-content="title"></p>
        <p class="mini-player__artist" data-mosic-link data-target="/queue" bind-content="artist"></p>
        <div class="mini-player__controls">
          <span class="mini-player__play group-events" bind-content="status"></span>
          <span class="mini-player__ff group-events">
            <svg class="icon">
              <use href="/img/sprite.svg#icon-fast-forward"></use>
            </svg>
          </span>
          <span class="duration"></span>
        </div>
      </div>
      <audio bind-attr="src:url" preload="none"></audio>
    `;

    return html;
  }

}

export default MosicPlayer;
