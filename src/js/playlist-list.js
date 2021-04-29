class PlaylistList extends BaseComponent {
  
  static tagName = 'playlist-list';
  properties = ['song-id'];

  beforeMount() {
    this.data = [];

    this.queryString = { query: `
      {
        playlists {
          id
          name
        }
      }
    `};
  }

  async mounted() {
    this.listContainer = this.querySelector('.playlist-list');
    this.addBindings();
    await this.createTree();
  }

  async createTree() {
    const data = await this.apiRequest();
    this.data = data.data.playlists;
    this.render(this.listHtml, this.listContainer);
  }

  addBindings() {
    const form = this.querySelector('#new-playlist');
    form.addEventListener('submit', async e => {
      e.preventDefault();
      const queryString = { query:  `mutation {
        createPlaylist (name: "${ form.elements['playlist-name'].value }") {
          name
        }
      }` };

      await this.apiRequest(queryString);      
      this.createTree();
    });

    this.addEventListener('click', async e => {
      if ( !e.target.classList.contains('playlist-item') ) {
        return;
      }

      const queryString = { query:  `mutation {
        addSongToPlaylist (id: ${ this.getAttribute('song-id') }, playlistId: ${ e.target.dataset.id }) {
          success
        }
      }` };

      await this.apiRequest(queryString);
    });
  }

  get html() {
    const html = `

      <div class="song-options--vertical">

      <h3>Playlists:</h3>

      <div class="playlist-list">
      </div>

      <span class="new-playlist">
        <form id="new-playlist">
          <svg class="icon"><use xlink:href="/img/sprite.svg#icon-plus-square"></svg>
          Add new <input type="text" id="playlist-name"> <input type="submit" value="Create">
        </form>
      </span>

      </div>
    `;
    return html;
  }

  get listHtml() {
    return `
      ${ this.data.map(playlist => {
        return `<span class="playlist-item group-events" data-id="${ playlist.id }">${ playlist.name }</span>`
      }).join('') }
    `;
  }

}

export default PlaylistList;
