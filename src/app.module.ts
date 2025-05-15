import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { RedisModule } from "./shared/redis/redis.module";
import { MinioClientModule } from "./shared/minio/minio.module";
import { AuthModule } from "./modules/auth/auth.module";
import { UsersModule } from "./modules/users/users.module";
import { EventsModule } from "./modules/events/events.module";
import { TicketsModule } from "./modules/tickets/tickets.module";
import { AuctionsModule } from "./modules/auctions/auctions.module";
import { QuestsModule } from "./modules/quests/quests.module";
import configuration from "./config/configuration";

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),

    // Database
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        ...configService.get("database"),
        autoLoadEntities: true,
      }),
      inject: [ConfigService],
    }),

    // Redis
    RedisModule,

    // MinIO
    MinioClientModule,

    // Feature modules
    AuthModule,
    UsersModule,
    EventsModule,
    TicketsModule,
    AuctionsModule,
    QuestsModule,
  ],
})
export class AppModule {}
