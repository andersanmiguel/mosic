import BaseComponent from '/js/base-component.js';
class PlaylistView extends BaseComponent {

  static tagName = 'playlist-view';
  properties = ['id'];
  components = ['/js/song-list.js'];

  beforeMount() {
    this.queryString = { query: `
     {
        playlist (id: ${this.id} ){
          name
          id
          songs {
            id
            title
            artistName
            cover
            albumTitle
            url
          }
        }
      }
    `
    };
  }

  async mounted() {
    this.d = await this.apiRequest();
    this.data.playlist = this.d.data.playlist;
    this.data._songs = this.d.data.playlist.songs;
  }

  addBindings() {
    this.$evt.addEventListener('playlist-updated', _ => {
      this.mounted();
    });

    this.querySelector('#playlist-to-queue').addEventListener('click', _ => {
      this.queue.clear();
      this.data._songs.forEach(this.queue.addSong.bind(this.queue));
    });
  }

  get html() {

    const html = `
      <div class="album-view">
        <div class="side-to-side">
          <p class="album-info__name">
            <svg class="icon"><use xlink:href="/img/sprite.svg#icon-list"></use></svg>
            ${ this.data.playlist.name }
          </p>
          <p id="playlist-to-queue" class="group-events">
            <svg class="icon"><use xlink:href="/img/sprite.svg#icon-play"></use></svg>
            Play this list
          </p>
        </div>
        <h3>Tracks:</h3>
        <song-list bind-attr="songs" playlist="${ this.data.playlist.id }"></song-list>
      </div>
    `;

    return html;
  }

}

export default PlaylistView;
