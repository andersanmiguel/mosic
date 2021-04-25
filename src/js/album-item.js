class AlbumItem extends HTMLElement {

  constructor() {
    super();
    this.render({
      cover: this.getAttribute('cover').replace('/media/ander/music', '/music'),
      title: this.getAttribute('title'),
      artist: this.getAttribute('artist')
    });
  }

  render(data) {

    const { cover, title, artist } = data;

    const template = `

      <div class="playlist__current">
        <img class="playlist__current__cover" src="${cover}">

        <p class="playlist__current__name">
          <span id="album-title">${title}</span>
        </p>
        <p class="playlist__current__group">
          <span id="album-group">${artist}</span>
          <!-- <svg class="icon"><use xlink:href="#icon-users"></use></svg> -->
        </p>
      </div>

    `;

    this.innerHTML = template;

  }

}

customElements.define('album-item', AlbumItem);
