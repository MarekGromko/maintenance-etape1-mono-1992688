export class Item {
    private id: number;
    private weight: number;
    private name: string;
    private lastLease: Date | null;
    private category: string;

    static builder() {
        let _id: number,
            _weight: number,
            _name: string,
            _lastLease: Date | null,
            _category: string;

        return {
            id(id: number){ _id = id; return this; },
            weight(weight: number){ _weight = weight; return this; },
            name(name: string){ _name = name; return this; },
            lastLease(lastLease: Date | null){ _lastLease = lastLease; return this; },
            category(category: string){ _category = category; return this; },
            build(){ return new Item(_id, _weight, _name, _lastLease, _category); }
        };
    }
    static fromJson(json: any): Item {
        return Item.builder()
            .id(json.id)
            .category(json.category)
            .lastLease(new Date(json.lastLease))
            .name(json.name)
            .weight(json.weight)
            .build();
    }
    constructor(id?: number, weight?: number, name?: string, lastLease?: Date | null, category?: string) {
        this.id = id || 0;
        this.weight = weight || 0;
        this.name = name || "";
        this.lastLease = lastLease || null;
        this.category = category || "";
    }
    public getId(): number {
        return this.id;
    }
    public getWeight(): number {
        return this.weight;
    }
    public getName(): string {
        return this.name;
    }
    public getLastLease(): Date | null {
        return this.lastLease;
    }
    public getCategory(): string {
        return this.category;
    }
    public setId(id: number): void {
        this.id = id;
    }
    public setWeight(weight: number): void {
        this.weight = weight;
    }
    public setName(name: string): void {
        this.name = name;
    }
    public setLastLease(lastLease: Date | null): void {
        this.lastLease = lastLease;
    }
    public setCategory(category: string): void {
        this.category = category;
    }
    public toJson(): Object {
        const {id, weight, name, lastLease, category} = this;
        return {
            id, 
            weight, 
            name, 
            lastLease: lastLease?.toString() || null, 
            category
        };
    }
}