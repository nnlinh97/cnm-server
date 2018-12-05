const setting = {
    databaseConfig: {
        uri: 'postgres://dlxxnbcpeipclq:583510bab933793a1c56a6155512e17252b3f117181e71f398c37122f9ab3d11@ec2-107-21-125-209.compute-1.amazonaws.com:5432/d25rvvkde88ola',
        database: 'd25rvvkde88ola',
        username: 'dlxxnbcpeipclq',
        password: '583510bab933793a1c56a6155512e17252b3f117181e71f398c37122f9ab3d11',
        host: 'ec2-107-21-125-209.compute-1.amazonaws.com',
        dialect: 'postgres',
        operatorsAliases: false,
        protocol: 'postgres',
        dialectOptions: {
            ssl: true
        },
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        }
    }
}

module.exports = setting;
