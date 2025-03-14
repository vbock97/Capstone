const {Client} = require ('pg');

const client = new Client({
    host: 'localhost',
    user: 'victoria',
    password: 'whatsup',
    database: 'movie_rental',
    port: 5432,
});

client.connect((err) => {
    if (err) {
        console.error('Database connection error', err.stack);
    }else{
        console.log('Connected to the PostgreSQL database');
    }
});

module.exports = client;