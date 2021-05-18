class AlbumList extends BaseComponent {

  static tagName = 'album-list';
  components = ['/mosic/js/album-item.js', '/mosic/js/test-test.js'];

  beforeMount() {
    this.d = [];
    this.queryString = { query: `
      {
        albums (order: "id") {
          title
          id
          cover
          artist {
            name
          }
        }
      }
    `
    };
  }

  async mounted() {
    const data = await this.apiRequest();
    this.data.albums = data.data.albums;
    this.data._filter = '';
    this.data._placeholderText = 'Search...';
  }

  addBindings() {

    this.filterTrigger = this.querySelector('.big-box');
    let debounceTrigger;
    this.filterTrigger.addEventListener('keydown', e => {
      if (debounceTrigger) {
        window.clearInterval(debounceTrigger);
      }

      debounceTrigger = window.setTimeout(_ => {
        this.data._filter = e.target.value.toLowerCase();
      }, 500);
    });
  }

  destroyed() {
    this.filterTrigger.removeEventListener('keydown');
  }

  get html() {

    return `
      <input type="text" class="big-box" bind-attr="placeholder:placeholderText,value:filter" name="filter" autofocus="autofocus">

      <div class="album-grid-list" bind-content="listHtml"></div>

    `;

  }

  get listHtml() {
    if (!this.d) {
      return;
    }

    if (!this.filter) {
      return `
        
        ${ this.data._filter ? 

            this.data.albums.map(item => {
              if (!item.title.toLowerCase().includes(this.data._filter) && !item.artist.name.toLowerCase().includes(this.data._filter)) {
                return;
              }
              return `
              <album-item cover="${item.cover}" artist="${item.artist.name}" title="${item.title}" album-id="${item.id}"></album-item>
            `;
            }).join('')

        :

          `
          <h3>Latest albums added:</h3>
          ${ this.data.albums.slice(-10).map(item => {
            if (this.filter && (!item.title.toLowerCase().includes(this.filter) && !item.artist.name.toLowerCase().includes(this.filter))) {
              return;
            }
            return `
              <album-item cover="${item.cover}" artist="${item.artist.name}" title="${item.title}" album-id="${item.id}"></album-item>
            `;
          }).join('') }
          `

        }

      `
    }

  }

}

export default AlbumList;
