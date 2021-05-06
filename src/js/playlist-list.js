class PlaylistList extends BaseComponent {
  
  static tagName = 'playlist-list';
  properties = ['song-id'];

  beforeMount() {
    this.d = [];

    this.query = { query: `
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
    const data = await this.apiRequest(this.query);
    this.d = data.data.playlists;
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
      if ( !e.target.classList.contains('playlist-name') ) {
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
      ${ this.d.map(playlist => {
        return `
          <p class="playlist-item">
            <span class="playlist-name group-events" data-id="${ playlist.id }">
              <svg class="icon"><use xlink:href="/img/sprite.svg#icon-check"></use></svg>
              ${ playlist.name }
            </span>
            <span class="playlist-view end-list group-events" data-mosic-link data-target="/playlist/${ playlist.id }">
              <svg class="icon"><use xlink:href="/img/sprite.svg#icon-external-link"></use></svg>
            </span>
          </p>
        `
      }).join('') }
    `;
  }

}

export default PlaylistList;
