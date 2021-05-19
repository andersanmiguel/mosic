class Queue {

  _songs = new Set();
  _songsArr = [];

  constructor(...songs) {
    this.renderStack = [];
    [...songs].forEach(this._songs.add);
    this.cursor = 0;
    this.random = true;
    this.eventRegistry = {};
    window.requestAnimationFrame(() => {
      this.load();
    });
  }

  addSong(song) {
    this._songs.add(song);

    this.renderStack.push(song);

    // this.debounce = window.requestAnimationFrame(_ => {
    if (this.renderStack.length === 1) {
      queueMicrotask(() => {
        this._songsArr = [...this._songs]
        this.emit('song-added', this._songsArr);
        this.renderStack.length = 0;
        this.save();
      });
    }
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
    queueMicrotask(() => {
      this.emit('song-changed', this.currentSong);
    });
  }

  prev() {
    this.cursor--;
    this.cursor = this.cursor < 0 ? 0 : this.cursor;
  }

  save() {
    window.localStorage.setItem('mosic-queue', JSON.stringify(this._songsArr));
  }

  load() {
    const songs = window.localStorage.getItem('mosic-queue');
    if (songs) {
      JSON.parse(songs).forEach(this.addSong.bind(this));
    }
  }

  clear() {
    this._songs.clear();
    this._songsArr = [];
    window.localStorage.removeItem('mosic-queue');
    this.emit('song-changed', this.currentSong);
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
