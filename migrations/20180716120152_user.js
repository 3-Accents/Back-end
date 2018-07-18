
exports.up = function(knex, Promise) {
  return knex.schema.createTable('users', (table) => {
      table.increments(); 
      table.text('facebookId').unique().notNullable();
      table.text('email').unique().notNullable();
      table.text('profilePic').notNullable();
      table.text('displayName').notNullable();
      table.text('accessToken').notNullable();  
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('users');
};
