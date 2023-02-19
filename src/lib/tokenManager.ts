
import Token from "../models/Token.model.js";
import {v4 as uuidv4}from 'uuid'
import { APIError, PermissionError } from "./Error.js";

class TokenManager {

    /**
     * Fetch the token if it exists. If it does not, return false.
     * @param token The string token received from the user.
     * @returns {Token|false} Either a token or false
     */
    async getToken(token:string):Promise<Token|false> {
        const tok:Token = await Token.findOne({where: {
            token: token
        }})
        if(!tok) return false;
        return tok;
    }

    /**
     * Create a new token
     * @param {string} ownerId The owner of the token
     * @param {Ipermissions} permissions The permissions needed for the token
     * @param {Token} token The token of the user attempting to create a token
     * @returns Promise<Token|APIError> Either the token or an APIError
     */
    async createToken(ownerIdentifier:string, token:Token):Promise<Token|APIError> {

        const tok = await Token.create({
            ownerIdentifier: ownerIdentifier,
            token: uuidv4(),
        })

        return tok;
    }

    
}


export default new TokenManager();