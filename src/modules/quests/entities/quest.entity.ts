import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
} from "typeorm";
import { User } from "../../users/entities/user.entity";

@Entity("quests")
export class Quest {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  title: string;

  @Column("text")
  description: string;

  @Column()
  xpReward: number;

  @Column({ type: "jsonb" })
  requirements: {
    type:
      | "event_attendance"
      | "create_event"
      | "ticket_purchase"
      | "auction_participation";
    count: number;
    eventType?: string;
    timeFrame?: {
      start: Date;
      end: Date;
    };
  }[];

  @Column({ default: true })
  isActive: boolean;

  @Column({ nullable: true })
  startDate: Date;

  @Column({ nullable: true })
  endDate: Date;

  @ManyToMany(() => User)
  @JoinTable({ name: "user_quests" })
  participants: User[];

  @Column({ type: "jsonb", default: {} })
  userProgress: Record<
    string,
    {
      completed: boolean;
      progress: number;
      completedAt?: Date;
    }
  >;

  @Column({ type: "text", array: true, default: [] })
  tags: string[];

  @Column({ default: 0 })
  requiredLevel: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
