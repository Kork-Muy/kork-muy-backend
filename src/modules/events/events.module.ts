import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Event } from "./entities/event.entity";
import { EventsController } from "./events.controller";
import { EventsService } from "./events.service";
import { TicketSlot } from "../tickets/entities/ticket-slot.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Event, TicketSlot])],
  controllers: [EventsController],
  providers: [EventsService],
})
export class EventsModule {}
