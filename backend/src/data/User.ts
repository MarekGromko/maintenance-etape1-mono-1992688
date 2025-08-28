export class User {
    private id: number;
    private name: string;
    private age: number;
    private title: string;

    static builder() {
        let _id: number,
            _name: string,
            _age: number,
            _title: string;
        return {
            id(id: number){_id = id; return this},
            name(name: string){_name = name; return this},
            age(age: number){_age = age; return this},
            title(title: string){_title = title; return this},
            build(){ return new User(_id, _name, _age, _title); }
        };
    }
    static fromJson(json: any): User {
        return new User(
            json.id,
            json.name,
            json.age,
            json.title
        );
    }

    constructor(id?: number, name?: string, age?: number, title?: string) {
        this.id = id || 0;
        this.name = name || "";
        this.age = age || 0;
        this.title = title || "";
    }

    public getId(): number {
        return this.id;
    }
    public getName(): string {
        return this.name;
    }
    public getAge(): number {
        return this.age;
    }
    public getTitle(): string {
        return this.title;
    }
    public setId(id: number): void {
        this.id = id;
    }
    public setName(name: string): void {
        this.name = name;
    }
    public setAge(age: number): void {
        this.age = age;
    }
    public setTitle(title: string): void {
        this.title = title;
    }
    public toJson(): Object {
        return {
            id: this.id,
            name: this.name,
            age: this.age,
            title: this.title
        };
    }
}