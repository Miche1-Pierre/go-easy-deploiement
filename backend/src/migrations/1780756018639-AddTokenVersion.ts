import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddTokenVersion1780756018639 implements MigrationInterface {
  async up(queryRunner: QueryRunner): Promise<void> {
    if (!(await queryRunner.hasColumn("users", "tokenVersion"))) {
      await queryRunner.addColumn("users", new TableColumn({
        name: "tokenVersion",
        type: "int",
        default: 0,
      }));
    }
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    if (await queryRunner.hasColumn("users", "tokenVersion")) {
      await queryRunner.dropColumn("users", "tokenVersion");
    }
  }
}
