import { expect } from "chai";
import { IItemRepository } from "../../src/core/IItemRepository";
import Services, { ServicesHost } from "../../src/internal/Services";
import { Item } from "../../src/model/Item";
import { IItemService, ItemServiceImpl } from "../../src/service/ItemServiceImpl";

describe("service.ItemServiceImpl", () => {
    let host: ServicesHost;
    class MockItemRepository {
        static last_method: string;
        static last_args: any[];
        constructor() {
            return new Proxy(this, this);
        }
        get(target: any, prop: string) {
            return async (...args: any[]) => {
                MockItemRepository.last_method = prop;
                MockItemRepository.last_args   = args;
                switch(prop) {
                    case "exists": return true;
                    case "delelte": return;
                }
                return Item.builder().build();
            }
        }
    }

    before(()=>{
        host = Services.hostBuilder()
            .addScope(IItemService, ItemServiceImpl)
            .addScope(IItemRepository, MockItemRepository as any)
            .build();
    })

    it("method getItem should return an item", async () => {
        // arrange
        const itemService = host.make(IItemService);

        // act
        const result = await itemService.getItem(1);

        //
        expect(result.isOk()).to.be.true;
        expect(result.unwrap()).to.be.instanceOf(Item);
        expect(MockItemRepository.last_method).to.equal("get");
        expect(MockItemRepository.last_args).to.deep.equal([1]);
    });

    it("method createItem should return item when created", async () => {
        // arrange
        const itemService = host.make(IItemService);

        // act
        const result = await itemService.createItem(Item.builder().name("Item 1").build());

        // assert
        expect(result.isOk()).to.be.true;
        expect(result.unwrap()).to.be.instanceOf(Item);
        expect(MockItemRepository.last_method).to.equal("insert");
        expect(MockItemRepository.last_args).to.deep.equal([Item.builder().name("Item 1").build()]);
    })

    it("method updateItem should return item when updated", async () => {
        // arrange
        const itemService = host.make(IItemService);

        // act
        const result = await itemService.updateItem(Item.builder().id(1).name("Item 1 Updated").build());

        // assert
        expect(result.isOk()).to.be.true;
        expect(result.unwrap()).to.be.instanceOf(Item);
        expect(MockItemRepository.last_method).to.equal("update");
        expect(MockItemRepository.last_args).to.deep.equal([Item.builder().id(1).name("Item 1 Updated").build()]);
    })

    it("method deleteItem should return void when deleted", async () => {
        // arrange
        const itemService = host.make(IItemService);

        // act
        const result = await itemService.deleteItem(1);

        // assert
        expect(result.isOk()).to.be.true;
        expect(MockItemRepository.last_method).to.equal("delete");
        expect(MockItemRepository.last_args).to.deep.equal([1]);
    })
});