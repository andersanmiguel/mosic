class QueueView extends BaseComponent {

  static tagName = 'playlist-view';
  properties = ['id'];
  components = ['/mosic/js/song-list.js'];

  async mounted() {
    this.data._songs = this.queue.remainingSongs;
    this.data._song = [this.queue.currentSong];
  }

  addBindings() {
    this.queue.on('song-changed', _ => {
      this.data._song = [this.queue.currentSong];
      this.data._songs = this.queue.remainingSongs;
    });
  }

  get html() {

    const html = `
      <div class="album-view">
        <h3>Currently playing</h3>
        <song-list bind-attr="songs:song"></song-list>
        <h3>Tracks:</h3>
        <song-list bind-attr="songs"></song-list>
      </div>
    `;

    return html;
  }

}

export default QueueView;
