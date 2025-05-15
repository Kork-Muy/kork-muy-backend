import { DataSource } from "typeorm";
import { ConfigService } from "@nestjs/config";
import { config } from "dotenv";
import { join } from "path";

config();

const configService = new ConfigService();
console.log("configService", configService);
export default new DataSource({
  type: "postgres",
  host: configService.get("DB_HOST"),
  port: configService.get("DB_PORT"),
  username: configService.get("DB_USERNAME"),
  password: String(configService.get("DB_PASSWORD")),
  database: configService.get("DB_DATABASE"),
  entities: [join(__dirname, "..", "**", "*.entity.{ts,js}")],
  migrations: [join(__dirname, "..", "migrations", "*.{ts,js}")],
  synchronize: false,
});
