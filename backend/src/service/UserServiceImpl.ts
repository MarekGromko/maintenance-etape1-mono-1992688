import { IUserRepository } from "../core/IUserRepository";
import { IUserService, UserServiceErr } from "../core/IUserService";
import { Result } from "../internal/Result";
import Services from "../internal/Services";
import { User } from "../model/User";

export class UserServiceImpl extends IUserService {
    private userRepo: IUserRepository;
    constructor() {
        super();
        this.userRepo = Services.infer(IUserRepository);
    }
    async getUser(id: number): Promise<Result<User, UserServiceErr>> {
        try {
            let user = await this.userRepo.get(id);
            if (!user) {
                return Result.err('USER_NOT_FOUND');
            }
            return Result.ok(user);
        /* c8 ignore next 3*/
        } catch (error) {
            return Result.err('INTERNAL_ERROR')
        }
    }
    async createUser(user: User): Promise<Result<User, UserServiceErr>> {
        try {
            let createdUser = await this.userRepo.insert(user);
            return Result.ok(createdUser);
        /* c8 ignore next 3*/
        } catch {
            return Result.err('INTERNAL_ERROR');
        }
    }
    async updateUser(user: User): Promise<Result<User, UserServiceErr>> {
        try {
            let updatedUser = await this.userRepo.update(user);
            if (!updatedUser) {
                return Result.err('USER_NOT_FOUND');
            }
            return Result.ok(updatedUser);
        /* c8 ignore next 3*/
        } catch {
            return Result.err('INTERNAL_ERROR');
        }
    }
    async deleteUser(id: number): Promise<Result<void, UserServiceErr>> {
        try {
            let deletedUser = await this.userRepo.delete(id);
            return Result.ok();
        /* c8 ignore next 3*/
        } catch {
            return Result.err('INTERNAL_ERROR');
        }
    }
    async searchUsers(name: string): Promise<Result<User[], UserServiceErr>> {
        try {
            let users = await this.userRepo.search(name);
            return Result.ok(users);
        /* c8 ignore next 3*/
        } catch {
            return Result.err('INTERNAL_ERROR');
        }
    }

}

export {
    IUserService
}
