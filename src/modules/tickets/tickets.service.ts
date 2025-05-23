import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Ticket } from "./entities/ticket.entity";
import { CreateTicketDto } from "./dto/create-ticket.dto";
import { UpdateTicketDto } from "./dto/update-ticket.dto";
import { Event } from "../events/entities/event.entity";
import { UsersService } from "../users/users.service";
import { BuyTicketDto } from "./dto/buy-ticket.dto";
import { TicketBuilder } from "./builders/ticket-builder.builder";

@Injectable()
export class TicketsService {
  constructor(
    @InjectRepository(Ticket)
    private readonly ticketRepository: Repository<Ticket>,
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
    private readonly usersService: UsersService,
  ) {}

  async create(createTicketDto: CreateTicketDto): Promise<Ticket> {
    const event = await this.eventRepository.findOne({
      where: { id: createTicketDto.eventId },
    });
    if (!event) {
      throw new NotFoundException(
        `Event with ID ${createTicketDto.eventId} not found`,
      );
    }

    const ticket = this.ticketRepository.create({
      ...createTicketDto,
      event,
    });
    return this.ticketRepository.save(ticket);
  }

  async buyTicket(buyTicketDto: BuyTicketDto, request: any): Promise<any> {
    Logger.log(buyTicketDto, "buyTicketDto");
    console.log("user", request.user);
    const event = await this.eventRepository.findOne({
      where: { id: buyTicketDto.eventId },
    });
    if (!event) {
      throw new NotFoundException(
        `Event with ID ${buyTicketDto.eventId} not found`,
      );
    }
    const user = await this.usersService.findById(request.user.id);
    if (!user) {
      throw new NotFoundException(
        `User with ID ${request.user.id} not found`,
      );
    }
    const ticketBuilder = new TicketBuilder();
    ticketBuilder.setEvent(event);
    ticketBuilder.setUser(user);
    ticketBuilder.setTicketData(buyTicketDto.ticketData);
    const ticket = ticketBuilder.build();
    const savedTicket = await this.ticketRepository.save(ticket);
    return {
      message: "Ticket bought successfully",
      event,
      user,
      ticket: savedTicket,
    };
  }

  async findAll(): Promise<Ticket[]> {
    return this.ticketRepository.find({ relations: ["event"] });
  }

  async findOne(id: string): Promise<Ticket> {
    const ticket = await this.ticketRepository.findOne({
      where: { id },
      relations: ["event"],
    });
    if (!ticket) {
      throw new NotFoundException(`Ticket with ID ${id} not found`);
    }
    return ticket;
  }

  async update(id: string, updateTicketDto: UpdateTicketDto): Promise<Ticket> {
    const ticket = await this.findOne(id);

    if (updateTicketDto.eventId) {
      const event = await this.eventRepository.findOne({
        where: { id: updateTicketDto.eventId },
      });
      if (!event) {
        throw new NotFoundException(
          `Event with ID ${updateTicketDto.eventId} not found`,
        );
      }
      ticket.event = event;
    }

    this.ticketRepository.merge(ticket, updateTicketDto);
    return this.ticketRepository.save(ticket);
  }

  async remove(id: string): Promise<void> {
    const ticket = await this.findOne(id);
    await this.ticketRepository.remove(ticket);
  }
}
