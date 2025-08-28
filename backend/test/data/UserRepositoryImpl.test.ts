import { UserRepositoryImpl, IUserRepository } from '../../src/data/UserRepositoryImpl';
import { IDatabaseDriver } from '../../src/core/IDatabaseDriver';
import { expect } from 'chai';
import Services, { ServicesHost } from '../../src/internal/Services';
import { User } from '../../src/data/User';

describe("data.UserRepositoryImpl", () => {
    let host: ServicesHost;
    let last_sql: string = "";
    let last_params: any[] = [];
    beforeEach(() => {
        last_sql = "";
        last_params = [];
        host = Services.hostBuilder()
            .addScope(IUserRepository, UserRepositoryImpl)
            .addSingleton(IDatabaseDriver, class {
                public sql!: string;
                async query(sql: string, params: any[]){
                    last_sql = sql;
                    last_params = params;
                    return [new User()];
                }
                async exec(sql: string, params: any[]){
                    last_sql = sql;
                    last_params = params;
                    return;
                }
            } as any)
            .build();
    })
    it("should check if user exists", async () => {
        // act
        const userRepository = host.make(IUserRepository);
        await userRepository.exists(10);

        // assert
        expect(last_sql).to.equal("SELECT 1 FROM user WHERE id = ?");
        expect(last_params).to.deep.equal([10]);

    });
    it("should get the users", async () => {
        // act
        const userRepository = host.make(IUserRepository);
        await userRepository.get(10);

        // assert
        expect(last_sql).to.equal("SELECT * FROM user WHERE id = ?");
        expect(last_params).to.deep.equal([10]);
    });
    it("should insert a user", async () => {
        // act
        const userRepository = host.make(IUserRepository);
        await userRepository.insert(User.builder()
            .name("abc")
            .age(20)
            .title("def")
            .build()
        );

        // assert
        expect(last_sql).to.equal("INSERT INTO user (name, age, title) VALUES (?, ?, ?) RETURNING *");
        expect(last_params).to.deep.equal(["abc", 20, "def"]);
    });
    it("should update a user", async () => {
        const userRepository = host.make(IUserRepository);
        await userRepository.update(User.builder()
            .id(1)
            .name("abc")
            .age(20)
            .title("def")
            .build()
        );

        // assert
        expect(last_sql).to.equal("UPDATE user SET name = ?, age = ?, title = ? WHERE id = ? RETURNING *");
        expect(last_params).to.deep.equal(["abc", 20, "def", 1]);
    })
    it("should upsert a user (update)", async () => {
        const userRepository = host.make(IUserRepository);
        await userRepository.upsert(User.builder()
            .id(1)
            .name("abc")
            .age(20)
            .title("def")
            .build()
        );

        // assert
        expect(last_sql).to.equal("UPDATE user SET name = ?, age = ?, title = ? WHERE id = ? RETURNING *");
        expect(last_params).to.deep.equal(["abc", 20, "def", 1]);
    });
    it("should delete a user", async () => {
        const userRepository = host.make(IUserRepository);
        await userRepository.delete(1);

        // assert
        expect(last_sql).to.equal("DELETE FROM user WHERE id = ?");
        expect(last_params).to.deep.equal([1]);
    });
    it("should search users", async () => {
        const userRepository = host.make(IUserRepository);
        await userRepository.search(" abc ");

        // assert
        expect(last_sql).to.equal("SELECT * FROM user WHERE instr(name, ?) > 0");
        expect(last_params).to.deep.equal(["abc"]);
    });
    it("shouldnt search if name is empty", async () => {
        const userRepository = host.make(IUserRepository);
        await userRepository.search("   ");

        // assert
        expect(last_sql).to.equal("");
        expect(last_params).to.deep.equal([]);
    });
});