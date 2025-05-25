import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("ticket_slots")
export class TicketSlot {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ nullable: true })
  ticketId: string;

  @Column({ nullable: true })
  eventId: string;

  @Column({ nullable: false, default: "available", enum: ["available", "used", "transferred", "bought","deleted"] })
  status: string;

  @Column({ nullable: true })
  createdAt: Date;

  @Column({ nullable: true })
  updatedAt: Date;
}
