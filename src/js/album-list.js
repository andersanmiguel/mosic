class AlbumList extends HTMLElement {

  constructor() {
    super();
    this.data = [];
    this.filter = '';
    this.queryString = { query: `
      {
        albums {
          title
          id
          cover
          artist {
            name
          }
          songs {
            title
          }
        }
      }
    `
    };

    this.init();

  }

  async init() {
    this.data = await this.getAlbumList();
    this.render();
    this.renderList();
  }

  async getAlbumList() {
    const response = await fetch('http://192.168.1.37:8888/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(this.queryString)
    });

    return response.json();
  }

  addBindings() {
    var filterTrigger = document.querySelector('.big-box');
    let debounceTrigger;
    filterTrigger.addEventListener('keydown', e => {
      if (debounceTrigger) {
        window.clearInterval(debounceTrigger);
      }

      debounceTrigger = window.setTimeout(_ => {
        this.filter = e.target.value.toLowerCase();
        this.renderList();
      }, 500);
    });
  }

  render() {

    const template = `
      <input type="text" class="big-box" value="${this.filter}" name="filter" placeholder="Search..." autofocus="autofocus">
      <div class="playlist">
      </div>
    `;

    this.innerHTML = template;
    this.addBindings();
  }

  renderList() {
    const albums = this.data.data.albums.map(item => {
      if (this.filter && !item.title.toLowerCase().includes(this.filter)) {
        return;
      }
      return `
        <album-item cover="${item.cover}" artist="${item.artist.name}" title="${item.title}"></album-item>
      `;
    }).join(''); 

    this.querySelector('.playlist').innerHTML = albums;

  }

}

customElements.define('album-list', AlbumList);
