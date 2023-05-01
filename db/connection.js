const mysql = require('mysql2');

//Connection to the Database
const db = mysql.createConnection(
    {
      host: '127.0.0.1',
      user: 'root',
      password:'',
      database: 'company_db'
    },
    console.log(`Connected to the company_db database.`)
   
  );

module.exports = db