class CurrentSong extends BaseComponent {
  static tagName = 'current-song';
  static properties = ['title', 'id', 'cover', 'artist-name', 'album-title'];
  
  get html() {
    return `
      <div class="album-info">

        <img class="album-info__cover" src="${ this.data.cover?.replace('/app/src/music', '/music') || '' }">
        <p>
          <svg class="icon"><use xlink:href="/img/sprite.svg#icon-music"></use></svg>
          ${ this.data.title }
        </p>
        <p>
          <svg class="icon"><use xlink:href="/img/sprite.svg#icon-disc"></use></svg>
          ${ this.data['album-title'] } - ${ this.data['artist-name'] }
        </p>

      </div>
    `;
  }
}

export default CurrentSong;
