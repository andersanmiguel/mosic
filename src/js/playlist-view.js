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
          }
        }
      }
    `
    };
  }

  async mounted() {
    this.d = await this.apiRequest();
    this.data.playlist = this.d.data.playlist;
    this.props.songs = this.d.data.playlist.songs;
    this.$evt.addEventListener('playlist-updated', _ => {
      this.mounted();
    });
  }

  get html() {

    const html = `
      <div class="album-view">
        <h3>Playlist</h3>
        <div class="album-info">
          <p class="album-info__name">
            <svg class="icon"><use xlink:href="/img/sprite.svg#icon-list"></use></svg>
            ${ this.data.playlist.name }
          </p>
        </div>
        <h3>Tracks:</h3>
        <song-list bind-data bind-songs="songs" playlist="${ this.data.playlist.id }"></song-list>
      </div>
    `;

    return html;
  }

}

export default PlaylistView;