import BaseComponent from '/js/base-component.js';
class MosicPlayer extends BaseComponent {

  ready = false;

  constructor() {
    super();
  }


  async mounted() {
    this.player = this.querySelector('audio');
    this.data._song = {};
    this.data._status = true;
    this.visible = true;
  }

  songChanged() {
    this.ready = true;
    this.data._song = this.queue.currentSong;
  }

  async addToCache() {
    const connection = navigator.connection;
    if (connection && connection.type == 'wifi' || window.apiRoute == 'http://192.168.1.37:5554/graphql') {
      const cache = await caches.open('music-v1');
      const item = await cache.match(this.data._url.replace('/app/src/music', '/music'))
      if (!item) {
        await cache.add(this.data._url.replace('/app/src/music', '/music'));
      }
    }
  }

  addBindings() {
    if (this.queue.currentSong) {
      this.ready = true;
      this.data._song = this.queue.currentSong;
    } else {
      this.queue.on('song-added', this.songChanged.bind(this));
      this.queue.on('song-changed', this.songChanged.bind(this));
      // this.queue.on('song-changed', _ => {
      //   console.log(this.queue.currentSong);
      //   this.ready = true;
      //   this.data._song = this.queue.currentSong || [];
      // });
    }

    this.querySelector('.mini-player__play').addEventListener('click', _ => {
      if (this.ready) {
        this.player.paused ? this.player.play() : this.player.pause();
      }
    });

    this.querySelector('.mini-player__ff').addEventListener('click', _ => {
      if (this.ready) {
        this.queue.nextSong;
      }
    });

    this.player.addEventListener('pause', e => {
      if(e.target.currentTime != e.target.duration) {
        this.data._status = this.player.paused;
      }
    });

    this.player.addEventListener('play', _ => {
      this.data._status = this.player.paused;
    });

    this.player.addEventListener('ended', _ => {
      this.queue.nextSong;
    });

    this.player.addEventListener('timeupdate', e => {
      const currentTime = e.target.currentTime;
      const duration = e.target.duration;
    });


    // document.addEventListener('visibilitychange', function(){
    //   this.visible = !document.hidden;
    // });

    this.on('prop-changed-song', null, async payload => {
      const song = payload.val;
      if (!song || song.length === 0) {
        this.data._url = '';
        this.data._title = '';
        this.data._artist = '';
        this.data._status = true;
        return;
      }
      const query = { query: `
        {
          song (id: ${ song.id }) {
            title
            url
            artistName
            albumTitle
            length
            album {
              cover
            }
          }
        }
      `};
      const response = await this.apiRequest(query);
      this.data._url = response.data.song.url.replace('/app/src/music', '/music');
      this.data._title = response.data.song.title;
      this.data._artist = response.data.song.artistName;

      // Promise.resolve().then(async _ => {
      window.queueMicrotask(async _ => {
        this.data._status ? await this.player.pause() : await this.player.play();
        this.data._status = this.player.paused;

        var t0 = performance.now();
        await this.addToCache();
        var t1 = performance.now();
        console.log("La llamada a hacerAlgo tardó " + (t1 - t0) + " milisegundos.");
      });

      if ('mediaSession' in navigator) {
        navigator.mediaSession.metadata = new MediaMetadata({
          title: response.data.song.title,
          artist: response.data.song.artistName,
          album: response.data.song.albumTitle,
          artwork: [
            { src: response.data.song.album.cover.replace('/app/src/music', '/music'), sizes: '512x512', type: 'image/jpg' }
          ]
        });

        navigator.mediaSession.setActionHandler('nexttrack', _ => { this.queue.nextSong });
        navigator.mediaSession.setActionHandler('play', _ => {
          this.player.paused ? this.player.play() : this.player.pause();
        });
        navigator.mediaSession.setActionHandler('pause', _ => {
          this.player.paused ? this.player.play() : this.player.pause();
        });
      }

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
