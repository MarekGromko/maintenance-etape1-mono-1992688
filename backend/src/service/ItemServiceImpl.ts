import { IItemRepository } from "../core/IItemRepository";
import { IItemService, ItemServiceErr } from "../core/IItemService";
import { Result } from "../internal/Result";
import Services from "../internal/Services";
import { Item } from "../data/Item";

export class ItemServiceImpl extends IItemService {
    private itemRepo: IItemRepository;
    constructor() {
        super();
        this.itemRepo = Services.infer(IItemRepository);
    }
    async getItem(id: number): Promise<Result<Item, ItemServiceErr>> {
        try {
            let item = await this.itemRepo.get(id);
            if(!item) {
                return Result.err('ITEM_NOT_FOUND');
            }
            return Result.ok(item);
        /* c8 ignore next 3*/
        } catch (error) {
            return Result.err('INTERNAL_ERROR');
        }
    }
    async createItem(item: Item): Promise<Result<Item, ItemServiceErr>> {
        try {
            let createdItem = await this.itemRepo.insert(item);
            return Result.ok(createdItem);
        /* c8 ignore next 3*/
        } catch (error) {
            return Result.err('INTERNAL_ERROR');
        }
    }
    async updateItem(item: Item): Promise<Result<Item, ItemServiceErr>> {
        try {
            let updatedItem = await this.itemRepo.update(item);
            if (!updatedItem) {
                return Result.err('ITEM_NOT_FOUND');
            }
            return Result.ok(updatedItem);
        /* c8 ignore next 3*/
        } catch (error) {
            return Result.err('INTERNAL_ERROR');
        }
    }
    async deleteItem(id: number): Promise<Result<void, ItemServiceErr>> {
        try {
            await this.itemRepo.delete(id);
            return Result.ok(undefined);
        /* c8 ignore next 3*/
        } catch (error) {
            return Result.err('INTERNAL_ERROR');
        }
    }

}

export {
    IItemService
}