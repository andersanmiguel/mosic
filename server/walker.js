const yargs = require('yargs');
const db = require('better-sqlite3')('../data/music.db');
// var iterate = require('dir-iterate-recursive');
const fs = require('fs');
const path = require('path');
const NodeID3 = require('node-id3');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach( f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? 
      walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

function convertToUTF8(string) {
  var encodedString = Buffer.from(string, 'ascii').toString();
  return encodedString;
}


const argv = yargs
  .command('init', 'Initialize the database.', {
    confirm: {
      description: '[WARNING] This will erase all previous data',
      alias: 'c',
      type: 'boolean',
    }
  })
  .command('walk', 'Populate database', {
    confirm: {
      alias: 'w',
      description: 'Populate the database',
      type: 'boolean',
    }
  })
  .demandCommand(1, '')
  .help()
  .alias('help', 'h')
  .argv;

if (argv._.includes('init')) {

  const confirm = argv.c || false;
  if (!confirm) {
    console.log('Execute with -c');
  }



  let sql = `
  CREATE TABLE IF NOT EXISTS "songs" (
    "id"	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "url"	TEXT NOT NULL UNIQUE,
    "title"	TEXT NOT NULL,
    "artistName"	TEXT,
    "albumTitle"	TEXT,
    "track"	NUMERIC,
    "cover"	TEXT,
    "length"	TEXT,
    "genre"	TEXT,
    "album_id" INTEGER,
    "artist_id" INTEGER,
    UNIQUE(title, artistName, albumTitle)
  );
  CREATE TABLE IF NOT EXISTS "albums" (
    "id"	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title"	TEXT NOT NULL,
    "cover"	TEXT,
    "artist_id" INTEGER,
    UNIQUE(title, artist_id)
  );
  CREATE TABLE IF NOT EXISTS "artists" (
    "id"	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name"	TEXT NOT NULL,
    UNIQUE(name)
  );
  CREATE TABLE IF NOT EXISTS "playlists" (
    "id"	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name"	TEXT NOT NULL,
    "songsList" TEXT,
    UNIQUE(name)
  );
  CREATE TABLE IF NOT EXISTS "playlists_songs" (
    "id"	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "playlist_id"	INTEGER NOT NULL,
    "song_id" INTEGER NOT NULL,
    UNIQUE(playlist_id, song_id)
  );
  `;

  db.exec(sql);

}


if (argv._.includes('walk')){



  // const dirname = "/media/ander/music";
  const dirname = "/app/src/music";

  console.log(dirname);


  walkDir(dirname, (file) => {
    if (!file.endsWith('mp3')) {
      return;
    }

    // Check if exists
    const selectSongSql = db.prepare('SELECT id FROM songs WHERE url = ?');
    const selectSongResult = selectSongSql.get(file);
    if (selectSongResult) {
      return;
    }

    let tags = NodeID3.read(file);
    let cover = fs.existsSync(path.dirname(file) + '/cover.jpg') ? path.dirname(file) + '/cover.jpg' : path.dirname(file) + '/albumart.jpg';
    var doc = {
      url: file,
      title: tags.title,
      artist: tags.artist,
      album: tags.album,
      cover: cover || null,
      track: tags.trackNumber || null,
      length: tags.length || null
    };
    
    let artistId = 0;
    const selectArtistSql = db.prepare('SELECT id FROM artists WHERE name = ?');
    const selectArtistResult = selectArtistSql.get([doc.artist]);
    if (selectArtistResult) {
      artistId = selectArtistResult.id;    
    }
    
    if (!artistId) {
      const insertArtistSql = db.prepare('INSERT INTO artists(name) VALUES(?)');
      try {
        const insertArtistResult = insertArtistSql.run([doc.artist]);
        artistId = insertArtistResult.lastInsertRowid;
      } catch (error) {
        console.log(error);
      }
    }

    let albumId = 0;
    const selectAlbumSql = db.prepare('SELECT id FROM albums WHERE title = ? AND artist_id = ?');
    const selectAlbumResult = selectAlbumSql.get([doc.album, artistId]);
    if (selectAlbumResult) {
      albumId = selectAlbumResult.id;    
    }
    
    if (!albumId) {
      const insertAlbumSql = db.prepare('INSERT INTO albums(title, cover, artist_id) VALUES(?, ?, ?)');
      try {
        const insertAlbumResult = insertAlbumSql.run([doc.album, doc.cover, artistId]);
        albumId = insertAlbumResult.lastInsertRowid;
      } catch (error) {
        console.log(error);
      }
    }

    const insertSongSql = db.prepare('INSERT INTO songs(url, title, artistName, albumTitle, track, cover, length, album_id, artist_id) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)');
    try {
      const insertSongResult = insertSongSql.run([doc.url, doc.title, doc.artist, doc.album, doc.track, doc.cover, doc.length, albumId, artistId]);
      console.log(insertSongResult);
    } catch(error) {
      console.log(error);
    }
  });

}
console.log(argv);
