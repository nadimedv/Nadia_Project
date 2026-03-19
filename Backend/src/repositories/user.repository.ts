import { User, CreateUserDto, UpdateUserDto } from "../dtos/user.dto.js";

let users: User[] = [];
let nextId = 1;

export const userRepository = {
    getAll(): User[] {
        return users;
    },

    getById(id: number): User | undefined {
        return users.find(u => u.id === id);
    },
    findByEmail(email: string) {
        return users.find((u) => u.email === email);
    },
    create(dto: CreateUserDto): User {
        const newUser: User = {
            id: nextId++,
            ...dto
        };

        users.push(newUser);
        return newUser;
    },

    update(id: number, dto: UpdateUserDto): User | null {
        const user = users.find(u => u.id === id);
        if (!user) return null;

        Object.assign(user, dto);
        return user;
    },

    delete(id: number): boolean {
        const index = users.findIndex(u => u.id === id);
        if (index === -1) return false;

        users.splice(index, 1);
        return true;
    }
};