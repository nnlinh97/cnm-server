module.exports = (sequelize, DataTypes) => {
    const user = sequelize.define('USERS', {
        idKey: {
            type: DataTypes.STRING,
            primaryKey: true
        },
        balance: {
            type: DataTypes.BIGINT,
            allowNull: false,
            defaultValue: 0
        },
        sequence: {
            type: DataTypes.BIGINT,
            allowNull: false,
            defaultValue: 0,
        },
        bandwidth: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        bandwidthTime: {
            type: DataTypes.DATE,
        },
        avatar: {
            type: DataTypes.TEXT,
            allowNull: true
        }
    }, {
            charset: 'utf8',
            collate: 'utf8_unicode_ci',
            tableName: 'USERS',
            timestamps: false
        });
    return user;
};