import BaseComponent from '/js/base-component.js';
class AlbumList extends BaseComponent {

  static tagName = 'album-list';
  components = ['/js/album-item.js', '/js/test-test.js'];
  noRender = true;

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
    this.props.filter = '';
    // this.render();

    // this.listContainer = this.querySelector('.album-grid-list');
    // this.render(this.listHtml, this.listContainer);
    window.requestAnimationFrame(_ => {
      this.filterTrigger = this.querySelector('.big-box');
      this.addBindings();
    });
  }

  addBindings() {

    let debounceTrigger;
    this.filterTrigger.addEventListener('keydown', e => {
      if (debounceTrigger) {
        window.clearInterval(debounceTrigger);
      }

      debounceTrigger = window.setTimeout(_ => {
        this.props.filter = e.target.value.toLowerCase();
        // this.render(this.listHtml, this.listContainer);
      }, 500);
    });
  }

  destroyed() {
    this.filterTrigger.removeEventListener('keydown');
  }

  get html() {

    return `
      <input type="text" class="big-box" bind bind-value="filter" name="filter" placeholder="Search..." autofocus="autofocus">


      <div class="album-grid-list" bind-content content="listHtml">
      </div>
    `;

  }

  get listHtml() {
    if (!this.d) {
      return;
    }

    if (!this.filter) {
      return `
        
        ${ this.props.filter ? 

            this.data.albums.map(item => {
              if (!item.title.toLowerCase().includes(this.props.filter) && !item.artist.name.toLowerCase().includes(this.props.filter)) {
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
