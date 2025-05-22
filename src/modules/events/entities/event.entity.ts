import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  ManyToMany,
  JoinTable,
} from "typeorm";
import { User } from "../../users/entities/user.entity";
import { Ticket } from "../../tickets/entities/ticket.entity";

@Entity("events")
export class Event {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  title: string;

  @Column()
  coverImageUrl: string;

  @Column()
  bannerImageUrl: string;

  @Column("text")
  description: string;

  @Column()
  date: Date;

  @Column()
  location: string;

  @Column({ type: "jsonb", nullable: true })
  coordinates: { lat: number; lng: number };

  @Column({ default: false })
  isPrivate: boolean;

  @Column({ default: 0 })
  minLevel: number;

  @Column({ type: "int", default: 0 })
  maxAttendees: number;

  @Column({ type: "jsonb", nullable: true })
  ticketTypes: {
    id: string;
    name: string;
    price: number;
    quantity: number;
    description: string;
  }[];

  @Column({ type: "text", array: true, default: [] })
  imageUrls: string[];

  @ManyToMany(() => User)
  @JoinTable({ name: "event_coordinators" })
  coordinators: User[];

  @OneToMany(() => Ticket, (ticket) => ticket.event)
  tickets: Ticket[];

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
