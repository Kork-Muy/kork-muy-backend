import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Event } from "./entities/event.entity";
import { EventsController } from "./events.controller";
import { EventsService } from "./events.service";
import { TicketSlot } from "../tickets/entities/ticket-slot.entity";
import { AuthModule } from "../auth/auth.module";
import { ConfigModule } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { Ticket } from "../tickets/entities/ticket.entity";

@Module({
  imports: [
    AuthModule,
    ConfigModule,
    TypeOrmModule.forFeature([Event, TicketSlot, Ticket])
  ],
  controllers: [EventsController],
  providers: [EventsService, JwtService],
})
export class EventsModule {}
