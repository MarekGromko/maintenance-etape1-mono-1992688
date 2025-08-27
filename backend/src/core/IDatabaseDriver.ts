/**
 * Abstract class for any database driver.
 * these are the base methods that any database driver must implement.
 */
export abstract class IDatabaseDriver {
    /**
     * Query the database, return the result
     * @param query the sql query to execute
     * @param params optional - the params to bind to the query
     * @returns the result of the query
     */
    abstract query(query: string, params?: any[] | Record<string, any>): Promise<any[]>;
    /**
     * Execute a database query
     * @param query the sql query to execute
     * @param params optional - the params to bind to the query
     */
    abstract exec(query: string, params?: any[] | Record<string, any>): Promise<void>;
    /**
     * close the database connection
     */
    abstract close(): Promise<void>;
}