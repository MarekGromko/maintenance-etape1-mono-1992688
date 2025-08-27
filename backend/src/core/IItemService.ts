import { Result } from "../internal/Result";
import { Item } from "../model/Item";
// TODO: Add methods for populating the leases
/**
 * Interface for the item-related service
 */
export abstract class IItemService {
    abstract getItem(id: string): Promise<Result<Item, ItemServiceErr>>;
    abstract createItem(item: Item): Promise<Result<Item, ItemServiceErr>>;
    abstract updateItem(item: Item): Promise<Result<Item, ItemServiceErr>>;
    abstract deleteItem(id: string): Promise<Result<void, ItemServiceErr>>;
}
export type ItemServiceErr = 'ITEM_NOT_FOUND' | 'ITEM_ALREADY_EXISTS' | 'INVALID_ITEM_DATA' | 'INTERNAL_ERROR';
