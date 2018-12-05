module.exports = (sequelize, DataTypes) => {
    const user = sequelize.define('USERS', {
        email: {
            type: DataTypes.STRING,
            validate: {
                isEmail: true
              }
        },
        password: {
            type: DataTypes.STRING
        }
    }, {
            charset: 'utf8',
            collate: 'utf8_unicode_ci',
            tableName: 'USERS',
            timestamps: false
        });
    return user;
};