import BaseComponent from '/js/base-component.js';
class MosicPlayer extends BaseComponent {

  constructor() {
    super();
  }


  mounted() {
    this.player = this.querySelector('audio');
    this.props.status = this.player.paused;
    this.props.song = [];

    this.querySelector('.mini-player__play').addEventListener('click', _ => {
      this.queue.next();
      this.player.paused ? this.player.play() : this.player.pause();
      this.props.status = this.player.paused;
    });

    this.queue.on('song-changed', async song => {
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
      this.props.src = response.data.song.url.replace('/media/ander/music', '/music');

      this.player.play();

    });


    // this.shadowRoot.querySelector('audio').play();
  }

  get status() {
    if (!this.player) {
      return '';
    }
    return this.player.paused ? 'Play' : 'Pause';
  }

  get html() {
    const html = `
      <div class="mini-player">
        <p class="mini-player__song" data-mosic-link data-target="/queue"> Cristales Rotos </p>
        <p class="mini-player__artist" data-mosic-link data-target="/queue"> Songs of Aguirre & Scila</p>
        <span class="mini-player__play group-events">
          <svg class="icon"><use xlink:href="/img/sprite.svg#icon-play-fill"></use></svg>
        </span>
      </div>
      <audio bind-data bind-src="src" preload="none"></audio>
    `;

    return html;
  }

}

export default MosicPlayer;
