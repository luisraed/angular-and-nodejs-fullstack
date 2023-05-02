import dotnev from 'dotenv';
dotnev.config();
import Hapi, { server } from '@hapi/hapi';
import admin from 'firebase-admin';
import routes from './routes/index.js';
import { db } from './database.js';
import credentials from '../credentials.json' assert { type: "json" };

admin.initializeApp({
    credential: admin.credential.cert(credentials)
});

let srv;

const start = async () => {
    srv = Hapi.server({
        port: 8080,
        host: '0.0.0.0'
    });

    routes.forEach(route => srv.route(route));

    db.connect();
    await srv.start();
    console.log(`Server is listening on ${srv.info.uri}`);
}

process.on('unhandledRejection', err => {
    console.log(err);
    process.exit(1);
});

process.on('SIGINT', async () => {
    console.log('Stopping server..');
    await srv.stop({ setTimeout: 10000});
    db.end();
    console.log('Server stopped');
});

start();