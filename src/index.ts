import express from 'express';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

import db from './database.js';
dotenv.config();

const app = express();
let routers = [];
// Routing
function mountRouters() {
	console.log("\n==== Mounting Routers ===");
	let routerfolder = fs.readdirSync(path.join(process.cwd(), "dist/routers"));
	routerfolder.forEach(async element => {
		if(element.endsWith('.d.ts')) return;

		let router = await import(`./routers/${element}`);
		console.log(`Loaded Router: '${element}' on '${router.mount}'`);
		app.use(router.mount, router.router);
		routers.push(router);
	});
	console.log("==== Routers Mounted ====\n");
}


mountRouters();
// app start
app.listen(process.env.PORT, async () => {
    await db.start({
        useMemoryDatabase: false,
        database: 'deploy-server-tokens',
        username: process.env.DB_USER,
        password: process.env.DB_PASS,
        host: process.env.DB_HOST,
        models: [
            await import('./models/Token.model.js')
        ]
    })
})