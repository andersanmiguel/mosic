class Queue {

  _songs = [];

  constructor(...songs) {
    this._songs = [...songs];
    this.cursor = 0;
    this.random = false;
    this.eventResgistry = {};
  }

  addSong(song) {
    this._songs.push(song);
  }

  shuffle() {
    const currentSong = this._songs.splice(this.cursor, 1);
    this._songs = this._songs.sort(() => Math.random() - 0.5);
    this._songs.unshift(currentSong);
  }

  next(cursor) {
    // if cursor received return it without change real cursor
    let c = cursor || this.cursor;
    c = c++ === this._songs.length ? 0 : c;
    if (cursor) {
      return c;
    }
    this.cursor = c;

    this.eventResgistry['song-changed'](this.currentSong);
  }

  prev() {
    this.cursor--;
    this.cursor = this.cursor < 0 ? 0 : this.cursor;
  }

  get currentSong() {
    return this._songs[this.cursor];
  }

  get nextSong() {
    this.next();
    return this.currentSong;
  }

  get previewNextSong() {
    return this._songs[this.next(this.cursor)];
  }

  on(event, callback) {
    this.eventResgistry[event] = callback;
  }

}

export default Queue;
