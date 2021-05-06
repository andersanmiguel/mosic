import {jest} from '@jest/globals';
import 'regenerator-runtime/runtime';
import MosicRouter from '../../src/js/router.js';


describe('Router test', () => {

  customElements.define('mosic-router', MosicRouter);
  delete window.location;

  const mockAddEventListener = jest.fn();
  window.addEventListener = mockAddEventListener;

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
    document.body.innerHTML = '<a href="/album/33" data-mosic-link>Mock link</a><mosic-router></mosic-router>';
    expect(document.querySelector('album-list')).not.toBeNull();
    document.querySelector('a').click();
    expect(document.querySelector('album-list')).toBeNull();
    expect(document.querySelector('album-full')).not.toBeNull();
  });

  test('Back button should return to previous page', () => {
    window.location = new URL('http://example.com/');
    document.body.innerHTML = '<a href="/album/33" data-mosic-link>Mock link</a><mosic-router></mosic-router>';
    expect(document.querySelector('album-list')).not.toBeNull();
    document.querySelector('a').click();
    expect(document.querySelector('album-list')).toBeNull();
    expect(document.querySelector('album-full')).not.toBeNull();
    


    // do your action here which will trigger useEffect
    window.history.back();
    // here the first [0] of calls denotes the first call of the mock
    // the second [0] denotes the index of arguments passed to that call
    expect(mockAddEventListener.mock.calls[0][0]).toBe('popstate');

    // so we can trigger handleBrowserBtn by calling [1] index
    mockAddEventListener.mock.calls[0][1]({ preventDefault: function() { return null; } });

    // now assert here what was being done in handleBrowserBtn callback
    expect(document.querySelector('album-list')).not.toBeNull();
    expect(document.querySelector('album-full')).toBeNull();

  });
});
