import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Ticket } from "./entities/ticket.entity";
import { Event } from "../events/entities/event.entity";
import { TicketsController } from "./tickets.controller";
import { TicketsService } from "./tickets.service";
import { TicketSlot } from "./entities/ticket-slot.entity";
import { AuthModule } from "../auth/auth.module";
import { ConfigModule } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";

@Module({
  imports: [
    TypeOrmModule.forFeature([Ticket, Event, TicketSlot]), 
    AuthModule,
    ConfigModule,
  ],
  controllers: [TicketsController],
  providers: [TicketsService, JwtService],
  exports: [TicketsService],
})
export class TicketsModule {}
