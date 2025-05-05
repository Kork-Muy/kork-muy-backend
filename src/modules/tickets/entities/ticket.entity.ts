import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToOne,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Event } from '../../events/entities/event.entity';
import { Auction } from '../../auctions/entities/auction.entity';

@Entity('tickets')
export class Ticket {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Event, (event) => event.tickets)
  event: Event;

  @Column()
  ticketTypeId: string;

  @Column({ type: 'jsonb' })
  ticketData: {
    name: string;
    price: number;
    description: string;
    seat?: string;
  };

  @Column({ type: 'text' })
  encryptedData: string;

  @Column({ default: false })
  isUsed: boolean;

  @Column({ nullable: true })
  usedAt: Date;

  @Column({ nullable: true })
  transferredFrom: string;

  @OneToOne(() => Auction, (auction) => auction.ticket, { nullable: true })
  auction: Auction;

  @Column({ default: false })
  isTransferable: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, any>;
} 