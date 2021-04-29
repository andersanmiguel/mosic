import {jest} from '@jest/globals';
import 'regenerator-runtime/runtime';
import MosicRouter from '../../src/js/router.js';


describe('Router test', () => {

  customElements.define('mosic-router', MosicRouter);
  delete window.location;

  test('Home page should display list of albums', () => {
    window.location = new URL('http://example.com/');
    document.body.innerHTML = '<mosic-router></mosic-router>';
    expect(document.querySelector('album-list')).not.toBeNull();
  });

  test('Album page should display albums', () => {
    window.location = new URL('http://example.com/album/22');
    document.body.innerHTML = '<mosic-router></mosic-router>';
    expect(document.querySelector('album-full')).not.toBeNull();
  });

  test('Click on album should move to album page', () => {
    window.location = new URL('http://example.com/');
    document.body.innerHTML = '<a href="/album/33" data-mosic-link data-target="/album/33">Mock link</a><mosic-router></mosic-router>';
    expect(document.querySelector('album-list')).not.toBeNull();
    document.querySelector('a').click();
    expect(document.querySelector('album-list')).toBeNull();
    expect(document.querySelector('album-full')).not.toBeNull();
  });
});
