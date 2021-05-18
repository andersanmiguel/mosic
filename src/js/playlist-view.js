class PlaylistView extends BaseComponent {

  static tagName = 'playlist-view';
  properties = ['id'];
  components = ['/mosic/js/song-list.js'];

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
    this.data._songs = this.d.data.playlist.songs;
  }

  addBindings() {
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
        <song-list bind-attr="songs" playlist="${ this.data.playlist.id }"></song-list>
      </div>
    `;

    return html;
  }

}

export default PlaylistView;
