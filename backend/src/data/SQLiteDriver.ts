import sqlite3 from "sqlite3";
import fs from "fs";
import { IDatabaseDriver } from "../core/IDatabaseDriver";

export class SQLiteDriver implements IDatabaseDriver {
    private db: Promise<sqlite3.Database>;

    constructor() {
        const {SQLITE_PATH, SQLITE_SCHEMA, SQLITE_DATA} = process.env;
        this.db = new Promise((resolve, reject)=>{
            /* c8 ignore next */
            const isNew = SQLITE_PATH && !fs.existsSync(SQLITE_PATH);
            const db = new sqlite3.Database(SQLITE_PATH || ':memory:', (err) => {
                /* c8 ignore next 2 */
                if (err)
                    reject(err);
            });
            /* c8 ignore start */
            Promise.all([
                async () => {
                    if (SQLITE_SCHEMA && isNew) {
                        const schema = await fs.promises.readFile(SQLITE_SCHEMA, 'utf-8');
                        db.exec(schema);
                    }
                },
                async () => {
                    if (SQLITE_DATA && isNew) {
                        const data = await fs.promises.readFile(SQLITE_DATA, 'utf-8');
                        db.exec(data);
                    }
                }
            ]).catch((err)=>{
                reject(err);
            }).then(()=>{
                resolve(db)
            });
            /* c8 ignore stop */
        });
    }
    async query<T extends any>(query: string, params?: any[] | Record<string, any>): Promise<T[]> {
        const db = await this.db;
        return await new Promise<T[]>((res, rej) => {
            db.all(query, params || [], (err, row) => {
                /* c8 ignore next 2 */
                if (err) {
                    rej(err);
                } else {
                    res(row);
                }
            });
        });
    }
    async exec(query: string, params?: any[] | Record<string, any>): Promise<void> {
        const db = await this.db;
        return await new Promise<void>((res, rej) => {
            db.run(query, params || [], (err) => {
                /* c8 ignore next 2 */
                if (err) {
                    rej(err);
                } else {
                    res();
                }
            });
        });
    }
    async close(): Promise<void> {
        const db = await this.db;
        return await new Promise<void>((res, rej) => {
            db.close((err) => {
                /* c8 ignore next 2 */
                if (err) {
                    rej(err);
                } else {
                    res();
                }
            });
        });
    }
}   