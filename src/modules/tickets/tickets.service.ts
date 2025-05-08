import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ticket } from './entities/ticket.entity';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { Event } from '../events/entities/event.entity';

@Injectable()
export class TicketsService {
  constructor(
    @InjectRepository(Ticket)
    private readonly ticketRepository: Repository<Ticket>,
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
  ) {}

  async create(createTicketDto: CreateTicketDto): Promise<Ticket> {
    const event = await this.eventRepository.findOne({ 
      where: { id: createTicketDto.eventId } 
    });
    if (!event) {
      throw new NotFoundException(`Event with ID ${createTicketDto.eventId} not found`);
    }

    const ticket = this.ticketRepository.create({
      ...createTicketDto,
      event,
    });
    return this.ticketRepository.save(ticket);
  }

  async findAll(): Promise<Ticket[]> {
    return this.ticketRepository.find({ relations: ['event'] });
  }

  async findOne(id: string): Promise<Ticket> {
    const ticket = await this.ticketRepository.findOne({ 
      where: { id },
      relations: ['event'],
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
        where: { id: updateTicketDto.eventId } 
      });
      if (!event) {
        throw new NotFoundException(`Event with ID ${updateTicketDto.eventId} not found`);
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