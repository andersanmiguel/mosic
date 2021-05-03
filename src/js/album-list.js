import BaseComponent from '/js/base-component.js';
class AlbumList extends BaseComponent {

  static tagName = 'album-list';
  components = ['/js/album-item.js'];
  noRender = true;

  beforeMount() {
    this.d = [];
    this.filter = '';
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
    this.d = await this.apiRequest();
    this.render();

    this.listContainer = this.querySelector('.album-grid-list');
    this.render(this.listHtml, this.listContainer);

    this.filterTrigger = this.querySelector('.big-box');
    this.addBindings();
  }

  addBindings() {
    let debounceTrigger;
    this.filterTrigger.addEventListener('keydown', e => {
      if (debounceTrigger) {
        window.clearInterval(debounceTrigger);
      }

      debounceTrigger = window.setTimeout(_ => {
        this.filter = e.target.value.toLowerCase();
        this.render(this.listHtml, this.listContainer);
      }, 500);
    });
  }

  destroyed() {
    this.filterTrigger.removeEventListener('keydown');
  }

  get html() {

    return `
      <input type="text" class="big-box" value="${this.filter}" name="filter" placeholder="Search..." autofocus="autofocus">
      <div class="album-grid-list">
      </div>
    `;

  }

  get listHtml() {
    if (!this.d) {
      return;
    }

    /*
    if (!this.filter) {
      return this.d.data.albums.slice(-5).map(item => {
        if (this.filter && (!item.title.toLowerCase().includes(this.filter) && !item.artist.name.toLowerCase().includes(this.filter))) {
          return;
        }
        return `
          <album-item cover="${item.cover}" artist="${item.artist.name}" title="${item.title}" album-id="${item.id}"></album-item>
        `;
      }).join('');
    }
    */

    return this.d.data.albums.map(item => {
      if (this.filter && (!item.title.toLowerCase().includes(this.filter) && !item.artist.name.toLowerCase().includes(this.filter))) {
        return;
      }
      return `
        <album-item cover="${item.cover}" artist="${item.artist.name}" title="${item.title}" album-id="${item.id}"></album-item>
      `;
    }).join('');

  }

}

export default AlbumList;
