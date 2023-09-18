import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  if (!(await knex.schema.hasTable("game"))) {
    await knex.schema.createTable("game", (table) => {
      table.increments("id");
      // table.enum("mode", [""]).notNullable();
      table.timestamps(false, true);
    });
  }

  if (!(await knex.schema.hasTable("game_record"))) {
    await knex.schema.createTable("game_record", (table) => {
      table.increments("id");
      table.text("username").notNullable();
      table.integer("user_score").notNullable();
      table.integer("game_id").unsigned().notNullable().references("game.id");
      table.timestamps(false, true);
    });
  }
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("game_record");
  await knex.schema.dropTableIfExists("game");
}
