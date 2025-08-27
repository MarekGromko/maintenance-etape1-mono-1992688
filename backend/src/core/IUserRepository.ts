import { User } from "../model/User";

/**
 * Interface fot the user repository.
 * Introduce the basic CRUD functions to access the table
 */
export abstract class IUserRepository {
    /**
     * Check if an user exists
     * @param id id of the user
     * @returns true if the user exists, otherwise false
     */
    abstract exists(id: number): Promise<boolean>;
    /**
     * Get the user from its id
     * @param id id of the user
     * @returns the user if found, otherwise null
     */
    abstract get(id: number): Promise<User | null>;
    /**
     * Insert a new user inside the database
     * @param user full user; minus the id
     * @returns the inserted user; useful if you need generated field
     */
    abstract insert(user: User): Promise<User>;
    /**
     * Update an existing user in the database
     * @param user the entire user
     * @returns the updated user, null if it does not exist
     */
    abstract update(user: User): Promise<User | null>;
    /**
     * Update an item in the database if it exists, otherwise insert it
     * @param user the entire user
     * @returns the upserted user
     */
    abstract upsert(user: User): Promise<User>;
    /**
     * Delete an user from the database
     * @param id 
     */
    abstract delete(id: number): Promise<void>;
    /**
     * Search the database for a name containg the hint
     * @param hint name hint, will be trimmed
     */
    abstract search(hint: string): Promise<User[]>;
}