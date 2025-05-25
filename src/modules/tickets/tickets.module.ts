import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Ticket } from "./entities/ticket.entity";
import { Event } from "../events/entities/event.entity";
import { TicketsController } from "./tickets.controller";
import { TicketsService } from "./tickets.service";
import { UsersModule } from "../users/users.module";
import { TicketSlot } from "./entities/ticket-slot.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Ticket, Event, TicketSlot]), UsersModule],
  controllers: [TicketsController],
  providers: [TicketsService],
  exports: [TicketsService],
})
export class TicketsModule {}
