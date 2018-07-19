
exports.up = function(knex) {
  return knex.schema.createTable('bets',(table)=>{
    table.increments();
    table.integer('creatorId').unsigned().notNullable().references('id').inTable('users').onDelete('cascade');
    table.integer('receiverId').unsigned().notNullable().references('id').inTable('users').onDelete('cascade');
    table.text('title').notNullable();
    table.text('description').notNullable();
    table.datetime('startDate').notNullable();
    table.datetime('endDate').notNullable();
    table.text('wager').notNullable();
    table.text('creatorVoteWinner');
    table.text('receiverVoteWinner');
    table.boolean('receiverAccepted').default(false);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('bets');
};
