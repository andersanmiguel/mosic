class AlbumItem extends BaseComponent {

  static tagName = 'album-item';

  beforeMount() {
    this.d = {
      cover: this.getAttribute('cover').replace('/app/src/music', '/mosic/music'),
      title: this.getAttribute('title'),
      artist: this.getAttribute('artist'),
      id: this.getAttribute('album-id'),
    };
  }

  get html() {

    const { cover, title, artist, id } = this.d;

    return `

      <div class="album-info" data-mosic-link data-target="/album/${id}">
        <a class="album-info__cover" href="/album/${id}">
          <img loading="lazy" width="80" height="80" src="${cover}">
        </a>

        <p class="album-info__name">
          <span id="album-title">${title}</span>
        </p>
        <p class="album-info__group">
          <span id="album-group">${artist}</span>
        </p>
      </div>

    `;

  }

}
export default AlbumItem;
