import { IDatabaseDriver } from "../core/IDatabaseDriver";
import { IItemRepository } from "../core/IItemRepository";
import Services from "../internal/Services";
import { Item } from "../model/Item";

function mapRow(row: any): Item {
    return Item.builder()
        .id(row.id)
        .weight(row.weight)
        .name(row.name)
        .lastLease(row.lastLease)
        .category(row.category)
        .build();
}

export class ItemRepositoryImpl extends IItemRepository {
    private db: IDatabaseDriver;
    constructor() {
        super();
        this.db = Services.infer(IDatabaseDriver);
    }

    async exists(id: number): Promise<boolean> {
        const rows = await this.db.query("SELECT 1 FROM item WHERE id = ?", [id]);
        return rows.length > 0;
    }
    async get(id: number): Promise<Item | null> {
        const rows = await this.db.query("SELECT * FROM item WHERE id = ?", [id]);
        return rows.length === 0 ? null : mapRow(rows[0]);
    }
    async insert(item: Item): Promise<Item> {
        const rows = await this.db.query("INSERT INTO item (weight, name, lastLease, category) VALUES (?, ?, ?, ?) RETURNING *", [item.getWeight(), item.getName(), item.getLastLease(), item.getCategory()]);
        return mapRow(rows[0]);
    }
    async update(item: Item): Promise<Item | null> {
        const rows = await this.db.query("UPDATE item SET weight = ?, name = ?, lastLease = ?, category = ? WHERE id = ? RETURNING *", [item.getWeight(), item.getName(), item.getLastLease(), item.getCategory(), item.getId()]);
        return rows.length === 0 ? null : mapRow(rows[0]);
    }
    async upsert(item: Item): Promise<Item> {
        const existing = await this.get(item.getId());
        if (existing) {
            return this.update(item) as Promise<Item>;
        } else {
            return this.insert(item);
        }
    }
    async delete(id: number): Promise<void> {
        await this.db.query("DELETE FROM item WHERE id = ?", [id]);
    }
}

export {
    IItemRepository
}