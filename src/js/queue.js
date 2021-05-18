class Queue {

  _songs = new Set();
  _songsArr = [];

  constructor(...songs) {
    [...songs].forEach(this._songs.add);
    this.cursor = 0;
    this.random = true;
    this.eventRegistry = {};
  }

  addSong(song) {
    this._songs.add(song);

    if (this.debounce) {
      window.cancelAnimationFrame(this.debounce);
    }

    this.debounce = window.requestAnimationFrame(_ => {
      this._songsArr = [...this._songs]
      this.emit('song-added', this._songsArr);
    });
  }

  shuffle() {
    const currentSong = this._songs.splice(this.cursor, 1);
    this._songs = this._songs.sort(() => Math.random() - 0.5);
    this._songs.unshift(currentSong);
  }

  next(cursor) {
    // if cursor received return it without change real cursor
    let c = cursor || this.cursor;
    c = c++ === (this._songs.size - 1) ? 0 : c;
    if (cursor) {
      return c;
    }
    this.cursor = c;

    // this.eventRegistry['song-changed'](this.currentSong);
    this.emit('song-changed', this.currentSong);
  }

  prev() {
    this.cursor--;
    this.cursor = this.cursor < 0 ? 0 : this.cursor;
  }

  get remainingSongs() {
    const start = this.cursor + 1;
    return this._songsArr.slice(start);
  }

  get currentSong() {
    return this._songsArr[this.cursor];
  }

  get nextSong() {
    if (this.random) {
      let idx = [...this.remainingSongs.keys()][Math.floor(Math.random() * this.remainingSongs.length)];
      if (idx === 0) {
        idx++;
      }
      const cursor = idx + this.cursor;
      const current = this._songsArr.splice(cursor, 1);
      this._songsArr.splice(this.cursor + 1, 0, current[0]);
    }
    this.next();
    return this.currentSong;
  }

  get previewNextSong() {
    return this._songs[this.next(this.cursor)];
  }

  on(event, callback) {

    if (!this.eventRegistry[event]) {
      this.eventRegistry[event] = [];
    }

    this.eventRegistry[event].push(callback);
  }

  emit(event, ...args) {
    if (event in this.eventRegistry) {
      this.eventRegistry[event].forEach(eventCallback => {
        eventCallback(...args);
      });
    }
  }

}

export default Queue;
