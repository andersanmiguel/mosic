class SongOptions extends BaseComponent {

  static tagName = 'song-options';
  properties = ['id'];
  components = ['/js/playlist-list.js'];

  mounted() {
    this.props.showPlaylists = false;
    this.addBindings();
  }

  addBindings() {
    this.querySelector('#add-to-playlist').addEventListener('click', e => {
      this.props.showPlaylists = !this.props.showPlaylists;      
      // this.render();
      // this.addBindings();
    });
  }

  get html() {
    return `
      <div class="song-options">
        <span>
          <svg class="icon"><use xlink:href="/img/sprite.svg#icon-list"></svg>
          Queue
        </span>
        <span id="add-to-playlist" class="group-events">
          <svg class="icon"><use xlink:href="/img/sprite.svg#icon-folder-plus"></svg>
          Add to playlist
        </span>
        <span>
          <svg class="icon"><use xlink:href="/img/sprite.svg#icon-heart"></svg>
          Like
        </span>
        <span class="end-list">
          <svg class="icon"><use xlink:href="/img/sprite.svg#icon-trash"></svg>
          Remove from my collection
        </span>
      </div>

      <playlist-list song-id="${ this.getAttribute('id') }" bind-show="showPlaylists"></playlist-list>
    `;

  }
}
// ${ this.showPlaylists ? `<playlist-list song-id="${ this.getAttribute('id') }" bind-show="showPlaylists"></playlist-list>` : '' }

export default SongOptions;
