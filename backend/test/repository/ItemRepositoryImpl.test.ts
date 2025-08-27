import { ItemRepositoryImpl, IItemRepository } from '../../src/repository/ItemRepositoryImpl';
import { IDatabaseDriver } from '../../src/core/IDatabaseDriver';
import { expect } from 'chai';
import Services, { ServicesHost } from '../../src/internal/Services';
import { Item } from '../../src/model/Item';

describe("repository.UserRepositoryImpl", () => {
    let host: ServicesHost;
    let last_sql: string = "";
    let last_params: any[] = [];
    beforeEach(() => {
        last_sql = "";
        last_params = [];
        host = Services.hostBuilder()
            .addScope(IItemRepository, ItemRepositoryImpl)
            .addSingleton(IDatabaseDriver, class {
                public sql!: string;
                async query(sql: string, params: any[]){
                    last_sql = sql;
                    last_params = params;
                    return [new Item()];
                }
                async exec(sql: string, params: any[]){
                    last_sql = sql;
                    last_params = params;
                    return;
                }
            } as any)
            .build();
    })
    it("should check if item exists", async () => {
        // act
        const userRepository = host.make(IItemRepository);
        await userRepository.exists(10);

        // assert
        expect(last_sql).to.equal("SELECT 1 FROM item WHERE id = ?");
        expect(last_params).to.deep.equal([10]);

    });
    it("should get the items", async () => {
        // act
        const itemRepository = host.make(IItemRepository);
        await itemRepository.get(10);

        // assert
        expect(last_sql).to.equal("SELECT * FROM item WHERE id = ?");
        expect(last_params).to.deep.equal([10]);
    });
    it("should insert an item", async () => {
        // act
        let lastLease = new Date();
        const itemRepository = host.make(IItemRepository);
        await itemRepository.insert(Item.builder()
            .name("abc")
            .weight(20)
            .lastLease(lastLease)
            .category("def")
            .build()
        );

        // assert
        expect(last_sql).to.equal("INSERT INTO item (weight, name, lastLease, category) VALUES (?, ?, ?, ?) RETURNING *");
        expect(last_params).to.deep.equal([20, "abc", lastLease, "def"]);
    });
    it("should update an item", async () => {
        // act
        let lastLease = new Date();
        const itemRepository = host.make(IItemRepository);
        await itemRepository.update(Item.builder()
            .id(1)
            .name("abc")
            .weight(20)
            .lastLease(lastLease)
            .category("def")
            .build()
        );

        // assert
        expect(last_sql).to.equal("UPDATE item SET weight = ?, name = ?, lastLease = ?, category = ? WHERE id = ? RETURNING *");
        expect(last_params).to.deep.equal([20, "abc", lastLease, "def", 1]);
    })
    it("should upsert a item (update)", async () => {
        // act
        let lastLease = new Date();
        const itemRepository = host.make(IItemRepository);
        await itemRepository.upsert(Item.builder()
            .id(1)
            .name("abc")
            .weight(20)
            .lastLease(lastLease)
            .category("def")
            .build()
        );

        // assert
        expect(last_sql).to.equal("UPDATE item SET weight = ?, name = ?, lastLease = ?, category = ? WHERE id = ? RETURNING *");
        expect(last_params).to.deep.equal([20, "abc", lastLease, "def", 1]);
    });
    it("should delete a item", async () => {
        const itemRepository = host.make(IItemRepository);
        await itemRepository.delete(1);

        // assert
        expect(last_sql).to.equal("DELETE FROM item WHERE id = ?");
        expect(last_params).to.deep.equal([1]);
    });
});