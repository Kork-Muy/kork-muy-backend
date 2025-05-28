// src/modules/events/events.service.ts
import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Event } from "./entities/event.entity";
import { CreateEventDto } from "./dto/create-event.dto";
import { UpdateEventDto } from "./dto/update-event.dto";
import { TicketSlot } from "../tickets/entities/ticket-slot.entity";
import { Ticket } from "../tickets/entities/ticket.entity";
import { CheckInTicketDto } from "./dto/check-in-ticket.dto";
import { User } from "../auth/entities/user.entity";
import { UsersService } from "../auth/users.service";

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
    @InjectRepository(Ticket)
    private readonly ticketRepository: Repository<Ticket>,
    @InjectRepository(TicketSlot)
    private readonly ticketSlotRepository: Repository<TicketSlot>,
    private readonly usersService: UsersService,
  ) {}

  async create(createEventDto: CreateEventDto): Promise<Event> {
    let event = this.eventRepository.create(createEventDto);
    event = await this.eventRepository.save(event);
    const ticketSlots = [];
    for (let i = 0; i < createEventDto.ticketSlots; i++) {
      const ticketSlot = this.ticketSlotRepository.create({
        eventId: event.id,
        status: "available",
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      ticketSlots.push(ticketSlot);
    }
      
    await this.ticketSlotRepository.save(ticketSlots);
    return event;
  }

  async checkInTicket(checkInTicketDto: CheckInTicketDto, userDto: User) {
    const user = await this.usersService.findById(userDto.id);
    if (!user) {
      throw new NotFoundException(`User with ID ${userDto.id} not found`);
    }
    const ticket = await this.ticketRepository.findOne({
      where: { 
        event: { id: checkInTicketDto.eventId },
        qrcode: checkInTicketDto.qrcode 
      },
      relations: ["event"],
    });
    if (!ticket) {
      throw new NotFoundException(`Invalid QR code`);
    }
    ticket.isUsed = true;
    ticket.usedAt = new Date();
    ticket.isTransferable = false;
    await this.ticketRepository.save(ticket);
    return {
      message: "Ticket checked in successfully",
      ticket: ticket,
    };
  }

  async findAll(): Promise<Event[]> {
    return this.eventRepository.find();
  }

  async findOne(id: string): Promise<Event> {
    const event = await this.eventRepository.findOne({ where: { id } });
    if (!event) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }
    return event;
  }

  async update(id: string, updateEventDto: UpdateEventDto): Promise<Event> {
    const event = await this.findOne(id);
    this.eventRepository.merge(event, updateEventDto);
    return this.eventRepository.save(event);
  }

  async remove(id: string): Promise<void> {
    const event = await this.findOne(id);
    await this.eventRepository.remove(event);
  }
}
