import BaseComponent from '/js/base-component.js';
class AlbumFull extends BaseComponent {

  static tagName = 'album-full';
  properties = ['id'];
  components = ['/js/song-list.js'];

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

    this.d = await this.apiRequest();
    this.data.album = this.d.data.album;
    this.props.songs = this.data.album.songs;
    this.$evt.addEventListener('toggle-options', e => {
      this.props.songs = this.props.songs.map(song => { 
        if (song.id == e.detail.id) {
          song.active = !song.active;
        } else {
          song.active = false;
        }
        return song;
      });
    });

    requestAnimationFrame(_ => {
      this.querySelector('#play-songs').addEventListener('click', _ => {
        this.props.songs.forEach(this.queue.addSong.bind(this.queue));
        console.log(this.queue._songs);
      });
    });
    
  }


  get html() {

    const html = `

      <div class="album-view">
        <h3>Album:</h3>

        <div class="album-info">
          <img class="album-info__cover" src="${ this.data.album.cover?.replace('/media/ander/music', '/music') || '' }">

          <p class="album-info__name">
            <svg class="icon"><use xlink:href="/img/sprite.svg#icon-disc"></use></svg>
            ${ this.data.album.title }
          </p>
          <p class="album-info__group">
            ${ this.data.album.artist?.name || '' }
          </p>

          <div class="song-options album-options">
            <span id="play-songs" class="group-events">
              <svg class="icon"><use xlink:href="/img/sprite.svg#icon-play"></svg>
              Play all songs
            </span>
            <span>
              <svg class="icon"><use xlink:href="/img/sprite.svg#icon-heart"></svg>
              Like all songs
            </span>
            <span class="end-list">
              <svg class="icon"><use xlink:href="/img/sprite.svg#icon-trash"></svg>
              Remove from my collection
            </span>
          </div>
        </div>

        <h3>Tracks:</h3>

        <song-list bind-data bind-songs="songs"></song-list>
        
      </div>
    `;

    return html;
  }

}

export default AlbumFull;
