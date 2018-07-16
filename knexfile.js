module.exports = {

    development: {
      client: 'pg',
      connection: 'postgres://localhost/ante-up'
    },
    production: {
      client: 'pg',
      connection: process.env.DATABASE_URL
    },
  
  };
  