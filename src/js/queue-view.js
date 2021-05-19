import BaseComponent from '/js/base-component.js';
class QueueView extends BaseComponent {

  static tagName = 'playlist-view';
  properties = ['id'];
  components = ['/js/song-list.js'];

  async mounted() {
    this.populateList();
  }

  addBindings() {
    this.queue.on('song-changed', _ => {
      this.populateList();
    });
    this.queue.on('song-added', _ => {
      this.populateList();
    });

    this.querySelector('#clear-queue').addEventListener('click', _ => {
      this.queue.clear();
    });
  }

  populateList() {
    this.data._songs = this.queue.remainingSongs || [];
    this.data._song = this.queue.currentSong ? [this.queue.currentSong] : [];
  }

  get html() {

    const html = `
      <div class="album-view">

        <div style="display: flex; justify-content: space-between">
        <h3>Currently playing</h3>

        <p id="clear-queue" class="group-events">
          <svg class="icon"><use href="/img/sprite.svg#icon-x-square"></use></svg>
          Clear queue
        </p>
        </div>
        <song-list bind-attr="songs:song" type="cover"></song-list>

        <h3>Tracks:</h3>
        <song-list bind-attr="songs"></song-list>

      </div>
    `;

    return html;
  }

}

export default QueueView;
