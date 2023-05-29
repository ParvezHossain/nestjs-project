export type CreateUserParams = {
    username: string;
    password: string;
    email: string;
    role: string;
};

export type UpdateUserParams = {
    username: string;
    password: string;
    email: string;
    role: string;
};

export type GetUserByIdParams = {
    id: number;
};
