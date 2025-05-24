import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class UserAuth {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    userId: number;

    @Column()
    provider: string;

    @Column()
    accessToken: string;

    @Column()
    refreshToken: string;

    @Column()
    accessTokenExpiresAt: Date;

    @Column()
    refreshTokenExpiresAt: Date;

    @Column()
    createdAt: Date;
}