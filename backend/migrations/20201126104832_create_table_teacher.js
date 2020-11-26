
exports.up = function(knex) {
    return knex.schema.createTable("teacher", table => {
        table.increments("teacher_id").primary();
        table.string("teacher_name").notNull();
        table.string("teacher_email").notNull();
        table.string("teacher_password").notNull();
        table.string("teacher_department").notNull();
        table.string("teacher_collegiate").notNull();
        table.string("teacher_size").nullable();
        table.string("teacher_key").nullable();
        table.string("teacher_url").nullable();
    })
};

exports.down = function(knex) {
    return knex.schema.dropTable("teacher")
};

