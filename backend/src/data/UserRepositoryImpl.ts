import { IDatabaseDriver } from "../core/IDatabaseDriver";
import { IUserRepository } from "../core/IUserRepository";
import Services from "../internal/Services";
import { User } from "../data/User";

function mapRow(row: any): User {
    return User.builder()
        .id(row.id)
        .name(row.name)
        .age(row.age)
        .title(row.title)
        .build();
}
export class UserRepositoryImpl extends IUserRepository {
    private db: IDatabaseDriver;
    constructor() {
        super();
        this.db = Services.infer(IDatabaseDriver);
    }
    async exists(id: number): Promise<boolean> {
        let rows = await this.db.query("SELECT 1 FROM user WHERE id = ?", [id]);
        return rows.length > 0;
    }
    async get(id: number): Promise<User | null> {
        const rows = await this.db.query("SELECT * FROM user WHERE id = ?", [id]);
        return rows.length === 0 ? null : mapRow(rows[0]);
    }
    async insert(user: User): Promise<User> {
        const rows = await this.db.query("INSERT INTO user (name, age, title) VALUES (?, ?, ?) RETURNING *", [user.getName(), user.getAge(), user.getTitle()]);
        return mapRow(rows[0]);
    }
    async update(user: User): Promise<User | null> {
        const rows = await this.db.query("UPDATE user SET name = ?, age = ?, title = ? WHERE id = ? RETURNING *", [user.getName(), user.getAge(), user.getTitle(), user.getId()]);
        return rows.length === 0 ? null : mapRow(rows[0]);
    }
    async upsert(user: User): Promise<User> {
        const exists = await this.exists(user.getId());
        if (exists) {
            return this.update(user) as Promise<User>;
        } else {
            return this.insert(user);
        }
    }
    async delete(id: number): Promise<void> {
        await this.db.exec("DELETE FROM user WHERE id = ?", [id]);
    }
    async search(name: string): Promise<User[]> {
        name = name.trim();
        if(!name) return [];
        
        const rows = await this.db.query("SELECT * FROM user WHERE instr(name, ?) > 0", [name]);
        return rows.map(mapRow);
    }
    
}
export {
    IUserRepository
};