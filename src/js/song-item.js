import BaseComponent from '/js/base-component.js';
class SongItem extends BaseComponent {
  static tagName = 'song-item';
  properties = ['title', 'id', 'hidden-options'];

  async mounted() {
    this.querySelector('.song-list__item__options').addEventListener('click', _ => {
      const evt = new CustomEvent('toggle-options', { detail: { id : this.getAttribute('id') } });
      this.$evt.dispatchEvent(evt);
    });
  }

  get html() {
      return `
        <div class="song-list__item song-list__item--album">

          <p class="song-list__item__name">
            <svg class="icon"><use xlink:href="/img/sprite.svg#icon-music"></use></svg>
            ${ this.getAttribute('title') }
          </p>

          <p class="song-list__item__options" index="">
            <svg class="icon"><use xlink:href="/img/sprite.svg#icon-more-horizontal"></use></svg>
          </p>

          ${ this.hasAttribute('hidden-options') ? '' : `
          <song-options id="${ this.getAttribute('id') }"></song-options>
          `}

      </div>

    `;
  }
}

export default SongItem;
