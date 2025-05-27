import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToOne,
  JoinColumn,
  OneToMany,
} from "typeorm";
import { User } from "../../auth/entities/user.entity";
import { Ticket } from "../../tickets/entities/ticket.entity";

@Entity("auctions")
export class Auction {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column("decimal", { precision: 10, scale: 2 })
  startingPrice: number;

  @Column("decimal", { precision: 10, scale: 2, nullable: true })
  reservePrice: number;

  @Column("decimal", { precision: 10, scale: 2, nullable: true })
  currentPrice: number;

  @Column()
  startTime: Date;

  @Column()
  endTime: Date;

  @Column({ default: "active" })
  status: "active" | "completed" | "cancelled";

  @Column({ nullable: true })
  winnerId: string;

  @Column({ type: "jsonb", default: [] })
  bids: {
    userId: string;
    amount: number;
    timestamp: Date;
  }[];

  @Column({ default: false })
  isInstantBuyEnabled: boolean;

  @Column("decimal", { precision: 10, scale: 2, nullable: true })
  instantBuyPrice: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
