import BaseComponent from '/js/base-component.js';
class SongItem extends BaseComponent {
  static tagName = 'song-item';
  properties = ['title', 'id', 'hidden-options'];
  components = ['/js/song-options.js'];

  async mounted() {
    if (this.querySelector('.song-list__item__options')) {
      this.querySelector('.song-list__item__options').addEventListener('click', _ => {
        const evt = new CustomEvent('toggle-options', { detail: { id : this.getAttribute('id') } });
        this.$evt.dispatchEvent(evt);
      });
    }

    if (this.querySelector('.song-list__item__delete')) {
      this.querySelector('.song-list__item__delete').addEventListener('click', async _ => {
        const queryString = { query:  `mutation {
          removeSongFromPlaylist (id: ${ this.getAttribute('id') }, playlistId: ${ this.getAttribute('playlist') }) {
            success
          }
        }` };

        await this.apiRequest(queryString);      
        const evt = new CustomEvent('playlist-updated', { detail: { id : this.getAttribute('playlist') } });
        this.$evt.dispatchEvent(evt);
      });
    }
  }

  get html() {
      return `
        <div class="song-list__item song-list__item--album">

          <p class="song-list__item__name">
            <svg class="icon"><use xlink:href="/img/sprite.svg#icon-music"></use></svg>
            ${ this.getAttribute('title') }
          </p>

          ${ this.hasAttribute('playlist') ? 
            `<p class="song-list__item__delete group-events" index="">
              <svg class="icon"><use xlink:href="/img/sprite.svg#icon-delete"></use></svg>
            </p>` :
            `<p class="song-list__item__options" index="">
              <svg class="icon"><use xlink:href="/img/sprite.svg#icon-more-horizontal"></use></svg>
            </p>`
          }

          ${ this.hasAttribute('hidden-options') ? '' : `
          <song-options title="${ this.getAttribute('title') }" id="${ this.getAttribute('id') }"></song-options>
          `}

      </div>

    `;
  }
}

export default SongItem;
