// Update with your config settings.

module.exports = {
    client: 'mysql',
    connection: {
      database: 'swat',
      user:     'root',
      password: ''
    },
    migrations: {
      tableName: 'knex_migrations'
    }
};
