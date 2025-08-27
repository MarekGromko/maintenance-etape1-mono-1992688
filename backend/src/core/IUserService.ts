import { Result } from "../internal/Result";
import { User } from "../model/User";

export abstract class IUserService {
    abstract getUser(id: number): Promise<Result<User, UserServiceErr>>;
    abstract createUser(user: User): Promise<Result<User, UserServiceErr>>;
    abstract updateUser(user: User): Promise<Result<User, UserServiceErr>>;
    abstract deleteUser(id: number): Promise<Result<void, UserServiceErr>>;
    abstract searchUsers(name: string): Promise<Result<User[], UserServiceErr>>;
}

export type UserServiceErr = 'USER_NOT_FOUND' | 'USER_ALREADY_EXISTS' | 'INVALID_USER_DATA' | 'INTERNAL_ERROR';
