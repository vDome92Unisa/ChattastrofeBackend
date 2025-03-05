import pg from 'pg';

const pool = new pg.Pool({
    user: 'postgres',
    host: '192.168.125.187',
    database: 'social',
    password: 'usergesan',
    port: 5432,
});

pool.connect(function (err, done) {
    if (err) {
            done();
            console.log(err);
            return json({ success: false, data : err
        });
    } else {
        console.log('Connesso al database');
    }
});

export default pool;