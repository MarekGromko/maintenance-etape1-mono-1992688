import { expect } from "chai";
import { IUserRepository } from "../../src/core/IUserRepository";
import Services, { ServicesHost } from "../../src/internal/Services";
import { User } from "../../src/model/User";
import {IUserService, UserServiceImpl} from "../../src/service/UserServiceImpl";

describe("service.UserServiceImpl", () => {
    let host: ServicesHost;
    class MockUserRepository {
        static last_method: string;
        static last_args: any[];
        constructor() {
            return new Proxy(this, this);
        }
        get(target: any, prop: string) {
            return async (...args: any[]) => {
                MockUserRepository.last_method = prop;
                MockUserRepository.last_args = args;
                switch(prop) {
                    case "exists": return true;
                    case "delete": return;
                    case "search": return [User.builder().name("John Doe").build()];
                }
                return User.builder().build();
            }
        }
    };
    before(()=>{
        host = Services.hostBuilder()
            .addScope(IUserService, UserServiceImpl)
            .addScope(IUserRepository, MockUserRepository as any)
            .build();
    });
    it("method getUser should return user when exists", async () => {
        // arrange
        const service = await host.make(IUserService);

        // act
        const result = await service.getUser(1);

        // assert
        expect(result.isOk()).to.be.true;
        expect(result.unwrap()).to.be.instanceOf(User);
        expect(MockUserRepository.last_method).to.equal("get");
        expect(MockUserRepository.last_args).to.deep.equal([1]);
    })
    it("method createUser should return user when created", async () => {
        // arrange
        const service = await host.make(IUserService);

        // act
        const result = await service.createUser(User.builder().name("John Doe").build());

        // assert
        expect(result.isOk()).to.be.true;
        expect(result.unwrap()).to.be.instanceOf(User);
        expect(MockUserRepository.last_method).to.equal("insert");
        expect(MockUserRepository.last_args).to.deep.equal([User.builder().name("John Doe").build()]);
    })
    it("method updateUser should return user when updated", async () => {
        // arrange
        const service = await host.make(IUserService);

        // act
        const result = await service.updateUser(User.builder().id(1).name("John Doe").build());

        // assert
        expect(result.isOk()).to.be.true;
        expect(result.unwrap()).to.be.instanceOf(User);
        expect(MockUserRepository.last_method).to.equal("update");
        expect(MockUserRepository.last_args).to.deep.equal([User.builder().id(1).name("John Doe").build()]);
    })
    it("method deleteUser should return no error when deleted", async () => {
        // arrange
        const service = await host.make(IUserService);

        // act
        const result = await service.deleteUser(1);

        // assert
        expect(result.isOk()).to.be.true;
        expect(MockUserRepository.last_method).to.equal("delete");
        expect(MockUserRepository.last_args).to.deep.equal([1]);
    })
    it("method searchUser should return users when found", async () => {
        // arrange
        const service = await host.make(IUserService);

        // act
        const result = await service.searchUsers("John");

        // assert
        expect(result.isOk()).to.be.true;
        expect(result.unwrap()).to.be.an("array").that.is.not.empty;
        expect(MockUserRepository.last_method).to.equal("search");
        expect(MockUserRepository.last_args).to.deep.equal(["John"]);
    })
})