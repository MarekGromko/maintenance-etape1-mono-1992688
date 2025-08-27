/**
 * Result class the return either a successful result or an error in the form of an enum
 * Avoid using exception, since some "error" are actually part of the functionnality
 */
export class Result<T, E>{
    private __ok!: T;
    private __isOk!: boolean;
    private __err!: E;
    /**
     * Create a successful Result instance 
     * @param value optional - the successfull result
     */
    static ok<T>(value?: T): Result<T, any> {
        let result = new Result<T, any>();
        result.__ok = value as any;
        result.__isOk = true;
        return result;
    }
    /**
     * Create a erroneous Result instance 
     * @param error optional - the error result
     */
    static err<E>(error: E): Result<any, E> {
        let result = new Result<any, E>();
        result.__err = error;
        result.__isOk = false;
        return result;
    }
    /**
     * Check if the result is a success
     * @returns true if the result is a success, false otherwise
     */
    isOk(): boolean {
        return this.__isOk;
    }
    /**
     * Check if the result is an error
     * @returns true if the result is an error, false otherwise
     */
    isErr(): boolean {
        return this.__err !== undefined;
    }
    /**
     * Return the successful result
     * @returns the successful result
     * @throws Error if the result is an error
     */
    unwrap(): T {
        if (this.isOk()) {
            return this.__ok;
        }
        throw new Error("Result is an error");
    }
    /**
     * Return the error result
     * @returns the error result
     * @throws Error if the result is a success
     */
    unwrapErr(): E {
        if (this.isErr()) {
            return this.__err;
        }
        throw new Error("Result is ok");
    }
    /**
     * Call if its ok
     * @param callback function that take the error in parameter
     * @returns itself
     */
    ok(callback: (value: T) => void): Result<T, E> {
        if (this.isOk()) {
            callback(this.__ok);
        }
        return this;
    }
    /**
     * Call if its err
     * @param callback function that take the error in parameter
     * @returns itself
     */
    err(callback: (error: E) => void): Result<T, E> {
        if (this.isErr()) {
            callback(this.__err);
        }
        return this;
    }
}
