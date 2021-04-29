import BaseComponent from '/js/base-component.js';
class AlbumFull extends BaseComponent {

  static tagName = 'album-full';
  properties = ['id'];
  noRender = true;
  components = ['/js/song-options.js', '/js/song-item.js'];

  beforeMount() {
    this.data = [];
    this.queryString = { query: `
     {
        album (id: ${this.id} ){
          title
          id
          cover
          artist {
            name
          }
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
    const data = await this.apiRequest();
    this.data = data.data.album;
    this.songs = this.data.songs;
    this.render();
    this.listContainer = this.querySelector('.song-list')
    this.render(this.listHtml, this.listContainer);
    this.$evt.addEventListener('toggle-options', e => {
      this.songs = this.songs.map(song => { 
        if (song.id == e.detail.id) {
          song.active = !song.active;
        } else {
          song.active = false;
        }
        return song;
      });
      this.render(this.listHtml, this.listContainer);
    });
  }

  get html() {

    const html = `

      <div class="album-view">
        <h3>Album:</h3>

        <div class="album-info">
          <img class="album-info__cover" src="${ this.data.cover?.replace('/media/ander/music', '/music') || '' }">

          <p class="album-info__name">
            <svg class="icon"><use xlink:href="/img/sprite.svg#icon-disc"></use></svg>
            ${ this.data.title }
          </p>
          <p class="album-info__group">
            ${ this.data.artist?.name || '' }
          </p>
        </div>

        <h3>Tracks:</h3>

        <div class="song-list">
        </div>
        
      </div>
    `;

    return html;
  }

  get listHtml() {

    return `
      ${ this.songs?.map(song => {
        return `
          <song-item title="${ song.title }" id="${ song.id }" ${ song.active ? '' : 'hidden-options' }></song-item>
        `;
      }).join('') }
    `;
  }

}

export default AlbumFull;
