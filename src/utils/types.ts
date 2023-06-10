import { UserType } from 'src/typeorm/entities/User';

export type CreateUserParams = {
    username: string;
    password: string;
    email: string;
    role: UserType;
};

export type UpdateUserParams = {
    username: string;
    password: string;
    email: string;
    role: UserType;
};

export type GetUserByIdParams = {
    id: number;
};
