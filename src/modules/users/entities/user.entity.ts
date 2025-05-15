import { Ticket } from "../../tickets/entities/ticket.entity";
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, nullable: false })
  email: string;

  @Column({ nullable: true })
  password: string;

  @Column({ nullable: true })
  firstName: string;

  @Column({ nullable: true })
  lastName: string;

  @Column({ nullable: true })
  avatar: string;

  @Column({ default: false })
  isVerified: boolean;

  @Column({ nullable: true })
  googleId: string;

  @Column({ nullable: true })
  facebookId: string;

  @Column({ nullable: true })
  githubId: string;
  
  @OneToMany(() => Ticket, (ticket) => ticket.user)
  tickets: Ticket[];
}
