
import { Sequelize, Model, DataTypes } from "sequelize";

class Token extends Model {
    declare id: number;
    declare token: string;
    declare ownerIdentifier: string;
}

export function load(database: Sequelize) {
    Token.init({
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        token: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        ownerIdentifier: {
            type: DataTypes.STRING,
            allowNull: false
        }
    
    }, {
        sequelize: database
    })
}

export function setRelations() {
}

export default Token;