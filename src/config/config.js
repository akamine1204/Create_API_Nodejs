module.exports = {
  development: {
    username: 'postgres',
    password: '123456',
    database: 'DucHoang',
    host: '127.0.0.1',
    dialect: 'postgres',
  },
  production: {
    username: 'root',
    password: null,
    database: 'database_production',
    host: '127.0.0.1',
    dialect: 'mysql',
  },
};
