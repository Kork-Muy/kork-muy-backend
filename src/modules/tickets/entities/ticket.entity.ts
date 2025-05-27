import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToOne,
} from "typeorm";
import { User } from "../../auth/entities/user.entity";
import { Event } from "../../events/entities/event.entity";

@Entity("tickets")
export class Ticket {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  qrcode: string;

  @ManyToOne(() => Event, (event) => event.tickets)
  event: Event;

  @ManyToOne(() => User, (user) => user.tickets)
  user: User;

  @Column({ type: "jsonb" })
  ticketData: Record<string, any>;

  @Column({ default: false })
  isUsed: boolean;

  @Column({ nullable: true })
  usedAt: Date;

  @Column({ nullable: true })
  transferredFrom: string;

  @Column({ default: false })
  isTransferable: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
