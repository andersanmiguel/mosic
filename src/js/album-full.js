import BaseComponent from '/js/base-component.js';
class AlbumFull extends BaseComponent {

  static tagName = 'album-full';
  properties = ['id'];
  noRender = true;
  components = ['/js/song-options.js', '/js/song-item.js', '/js/song-list.js'];

  beforeMount() {
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

    // console.log(this.d.songs);

    this.d = await this.apiRequest();
    this.d.album = this.d.data.album;
    this.d.songs = this.d.album.songs;
    this.render();
    this.$evt.addEventListener('toggle-options', e => {
      this.d.songs = this.d.songs.map(song => { 
        if (song.id == e.detail.id) {
          song.active = !song.active;
        } else {
          song.active = false;
        }
        return song;
      });
      this.bindAttrs();
    });

    
  }


  get html() {

    const html = `

      <div class="album-view">
        <h3>Album:</h3>

        <div class="album-info">
          <img class="album-info__cover" src="${ this.d.album.cover?.replace('/media/ander/music', '/music') || '' }">

          <p class="album-info__name">
            <svg class="icon"><use xlink:href="/img/sprite.svg#icon-disc"></use></svg>
            ${ this.d.album.title }
          </p>
          <p class="album-info__group">
            ${ this.d.album.artist?.name || '' }
          </p>
        </div>

        <h3>Tracks:</h3>

        <song-list bind bind-songs="songs" test="other"></song-list>
        
      </div>
    `;

    return html;
  }

}

export default AlbumFull;
