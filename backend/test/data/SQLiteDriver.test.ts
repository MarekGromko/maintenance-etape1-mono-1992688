import { SQLiteDriver } from "../../src/data/SQLiteDriver";
import { expect, use } from "chai";

describe("data.SQLiteDriver", () => {

    const createTable = "CREATE TABLE test (id INTEGER PRIMARY KEY, name TEXT)";
    const insertData = "INSERT INTO test (name) VALUES ('test') RETURNING *";

    it("should run an exec", async () => {
        // arrange
        const driver = new SQLiteDriver();

        // act
        await driver.exec(createTable);
    });
    it("should run an query", async () => {
        // arrange
        const driver = new SQLiteDriver();

        // act
        await driver.exec(createTable);
        const result = await driver.query(insertData);

        // assert
        expect(result).to.deep.equal([{ id: 1, name: 'test' }]);
    });
    it("should close",async () =>{
        // arrange
        const driver = new SQLiteDriver();

        // act
        await driver.close();
    })
});