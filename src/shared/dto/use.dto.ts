import { User } from "src/modules/users/entities/user.entity";

export class UserDto {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    avatar: string;
    
    constructor(user: User) {
        this.id = user.id;
        this.email = user.email;
        this.firstName = user.firstName;
        this.lastName = user.lastName;
        this.avatar = user.avatar;
    }

    toResponseObject() {
        return {
            id: this.id,
            email: this.email,
            firstName: this.firstName,
            lastName: this.lastName,
            avatar: this.avatar,
        }
    }
}