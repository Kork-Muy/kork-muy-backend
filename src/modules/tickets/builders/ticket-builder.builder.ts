import { Event } from "src/modules/events/entities/event.entity";
import { User } from "src/modules/users/entities/user.entity";
import { Ticket } from "../entities/ticket.entity";
import { TicketDataDto } from "../dto/buy-ticket.dto";
import { TicketSlot } from "../entities/ticket-slot.entity";
export class TicketBuilder {
  private _event: Event;
  private _user: User;
  private _ticketData: TicketDataDto[];
  private _ticketSlot: TicketSlot;

  setEvent(event: Event): TicketBuilder {
    this._event = event;
    return this;
  }

  setUser(user: User): TicketBuilder {
    this._user = user;
    return this;
  }

  setTicketData(ticketData: TicketDataDto[]): TicketBuilder {
    this._ticketData = ticketData;
    return this;
  }

  private _buildTicketData(): Record<string, any> {
    const ticketData: Record<string, any> = {};
    this._ticketData.forEach((data) => {
      ticketData[data.key] = data.value;
    });
    return ticketData;
  }

  setTicketSlot(ticketSlot: TicketSlot): TicketBuilder {
    this._ticketSlot = ticketSlot;
    return this;
  }

  build(): Ticket {
    const ticket = new Ticket();
    ticket.event = this._event;
    ticket.user = this._user;
    ticket.ticketData = this._buildTicketData();
    ticket.qrcode = this.generateQrcode();
    return ticket;
  }

  private generateQrcode(): string {
    return `${this._event.id}-${this._user.id}-${this._ticketSlot.id}`;
  }
} 