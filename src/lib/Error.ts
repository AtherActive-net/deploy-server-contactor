import Token from "../models/Token.model.js"

export class ModelError extends Error {
    constructor(message:string) {
        super(message)
        this.name = 'ModelError'
    }
}

export class DatabaseError extends Error {
    constructor(message:string) {
        super(message)
        this.name = 'DatabaseError'
    }
}

export class APIError {
    constructor(public message, public statuscode:number){};
}

export class PermissionError extends APIError {
    constructor(permission:string, key:string) {
        const message = `Missing ${permission} on key ${key}`
        super(message,403)
    }
}