const knex = require('knex');

//defining a variable env either gives us the value of the NODE_ENV or the default string 'development'
const env = process.env.NODE_ENV || 'development'; 

//defining a variable knexConfig to bring in the object that is exported from the knexfile
const knexConfig = require('../knexfile');

//defining a variable config that is equal to the connection information for the current environment
const config = knexConfig[env];

//defining a variable connection that is equal to the connection to the database 
const connection = knex(config);

module.exports = connection;