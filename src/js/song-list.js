class SongList extends BaseComponent {

  static tagName = 'song-list';
  static properties = ['songs', 'playlist'];
  components = ['/mosic/js/song-item.js'];

  get html() {
    let songs = [];
    try {
      songs = JSON.parse(this.getAttribute('songs')) || [];
    } catch (e) {
    }
    return `
      <div class="song-list">
      ${ songs.map(song => {
        return `
          <song-item title="${ song.title }" id="${ song.id }" ${ song.active ? '' : 'hidden-options' } ${ this.hasAttribute('playlist') ? `playlist="${ this.getAttribute('playlist') }"` : '' }></song-item>
        `;
      }).join('') }
      </div>
    `;
  }

}

export default SongList;
