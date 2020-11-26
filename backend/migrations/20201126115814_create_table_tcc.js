
exports.up = function(knex) {
    return knex.schema.createTable("tcc", table => {
        table.increments("tcc_id").primary();
        table.integer("teacher_id").unsigned().notNull();
        table.foreign("teacher_id").references("teacher_id").inTable("teacher").onDelete('CASCADE');
        table.string("tcc_title").notNull();
        table.string("tcc_author").notNull();
        table.string("tcc_comments").notNull();
        table.string("tcc_summary").notNull();
        table.string("tcc_specialization").notNull();
        table.string("tcc_year").notNull();
        table.string("tcc_area").notNull();
        table.string("tcc_status").notNull();
        table.string("tcc_size").notNull();
        table.string("tcc_key").notNull();
        table.string("tcc_url").notNull();
        table.string("tcc_cover_size").nullable();
        table.string("tcc_cover_key").nullable();
        table.string("tcc_cover_url").nullable();
    })
};

exports.down = function(knex) {
    return knex.schema.dropTable("tcc")
};

