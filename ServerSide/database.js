let Mysqli = require('mysqli')

// one config
let conn = new Mysqli({
  host: '127.0.0.1', // IP/domain  
  post: 3306, //port, default 3306  
  user: 'root', // username
  passwd: '', // password
  charset: '', // CHARSET of database, default to utf8 【optional】
  db: 'uhrTracker' // the default database name  【optional】
})

let db = conn.emit()

module.exports = db;