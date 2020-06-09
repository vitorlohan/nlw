import  Knex from 'knex';

export async function up(knex: Knex) {
    return knex.schema.createTable('point_items', table => {
        table.increments('id').primary();


        table.integer('point_id')
        .notNullable()
        .references('id')
        .inTable('points'); // CRIAR CHAVE ESTRANGEIRA NA TABLE POINTS NO CAMPO ID
        
        table.integer('item_id')
        .notNullable()
        .references('id')
        .inTable('items'); // CRIAR CHAVE ESTRANGEIRA NA TABLE ITEMS NO CAMPO ID
    });
}

export async function down(knex: Knex) {
    return knex.schema.dropTable('point_items');
}