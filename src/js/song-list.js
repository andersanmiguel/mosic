class SongList extends BaseComponent {

  static tagName = 'song-list';
  static properties = ['songs', 'playlist', 'type'];
  components = ['/js/song-item.js', '/js/components/current-song.js'];

  get html() {
    let songs = [];
    try {
      songs = JSON.parse(this.getAttribute('songs')) || [];
    } catch (e) {
    }
    return `
      <div class="song-list">
      ${ songs.map(song => {
        if (this.data.type === 'cover') {
          return `<current-song title="${ song.title }" id="${ song.id }" cover="${ song.cover }" artist-name="${ song.artistName }" album-title="${ song.albumTitle }"></current-song>`;
        }
        return `
          <song-item title="${ song.title }" id="${ song.id }" ${ song.active ? '' : 'hidden-options' } ${ this.hasAttribute('playlist') ? `playlist="${ this.getAttribute('playlist') }"` : '' }></song-item>
        `;
      }).join('') }
      </div>
    `;
  }

}

export default SongList;
