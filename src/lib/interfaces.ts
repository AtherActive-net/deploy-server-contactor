import Token from "../models/Token.model";

export interface IDatabaseOptions {
    /**@param {string} username The username for this database. */
    username?: string;
    /**@param {string} password The password for this database. */
    password?: string;
    /**@param {string} database The database name. */
    database?: string;
    /**@param {string} host The host for this database. */
    host?: string;
    /**@param {number} port The port for this database. */
    port?: number;
    /**@param {Array<any>} models The models that should be loaded by this database. */
    models?: Array<any>
    /**@param {boolean} useMemoryDatabase Whether or not to use a memory database. This option disables every option EXCEPT `models`. */
    useMemoryDatabase?: boolean;
}