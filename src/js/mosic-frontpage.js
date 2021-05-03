import BaseComponent from '/js/base-component.js';
class MosicFrontpage extends BaseComponent {

  static tagName = 'mosic-frontpage';
  components = ['/js/album-list.js'];
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
    this.d = await this.apiRequest();
    this.filter = '';
    this.render();

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
      }, 500);
    });
  }

  destroyed() {
    this.filterTrigger.removeEventListener('keydown');
  }

  get filter() {
    return this._filter;
  }
  set filter(val) {
    this._filter = val;        
    if (!this.d.data) {
      return;
    }
    this.d.albums = this.d.data.albums.map(item => {
      if (
        val &&
        (!item.title.toLowerCase().includes(val) &&
        !item.artist.name.toLowerCase().includes(val))
      ) {
        return;
      }

      return {
        cover: item.cover,
        name: item.artist.name,
        title: item.title
      };

    });
  }

  get html() {

    return `
      <input type="text" class="big-box" value="${this.filter}" name="filter" placeholder="Search..." autofocus="autofocus">
      <album-list bind bind-albums="albums"></album-list>
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


  }

}

export default MosicFrontpage;
