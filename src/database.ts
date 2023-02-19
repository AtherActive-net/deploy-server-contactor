import { Sequelize, Model } from "sequelize";
import { IDatabaseOptions } from "./lib/interfaces.js";
import { DatabaseError } from "./lib/Error.js";
import dotenv from 'dotenv'
dotenv.config()

/**
 * The database class. Used to connect to the database and run queries.
 * Discoda uses Sequelize to connect to the database under the hood for management.
 */
class Database {
    public db: Sequelize
    public models: Array<any> = [];

    /**
     * Set up and start the database connection.
     * @param {string} username The username for the database
     * @param {string} password The password for the database
     * @param {string} database The name of the database
     * @param {string} host The host of the database (default: localhost)
     * @param {number} port The port of the database (default: 3306)
     */
    public async start(opts: IDatabaseOptions) {

        // Initialize the database connection.
        // If memory is true, use sqlite. Otherwise, use mysql.
        if(opts.useMemoryDatabase) {
            this.db = new Sequelize({
                dialect: 'mysql',
                storage: ':memory:',
                logging: true
            });

        } else {
            this.db = new Sequelize(opts.database, opts.username, opts.password, {
                host: opts.host || 'localhost',
                port: opts.port || 3306,
                dialect: 'mysql',
                logging: true
            })
        }

        this.models = opts.models

        await this.db.authenticate();
        await this.loadModels();
        await this.setRelations();

        await this.sync({force: false, alter:true});
        return;
    }

    /**
     * Sync the database with the models. You can choose wether or not it needs to force sync or alter.
     */
    public async sync(opts?: { force: boolean, alter: boolean }) {
        if(!opts) opts = { force: false, alter: false };
        await this.db.sync(opts);
        return;
    }

    /**
     * Load the models from a folder. This will load all the models in a folder and add them to the database.
     * @param {string} folderPath The path to the folder containing the models
     */
    public async loadModels() {
        this.models.forEach(element => {
            if(!element.load) throw new DatabaseError(`Model ${element} does not have a load function`);
            element.load(this.db);
        });

        // await this.setRelations();
        return;
    }

    public async setRelations() {
        for(const model of this.models) {
            if(model.setRelations) {
                await model.setRelations();
            }
        }
        return;
    }

}

const db = new Database()
export default db