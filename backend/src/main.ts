import * as core from "./core/core";
import { hostBuilder } from "./internal/Services";
import { SQLiteDriver } from "./data/SQLiteDriver";
import { UserRepositoryImpl } from "./data/UserRepositoryImpl";
import { ItemRepositoryImpl } from "./data/ItemRepositoryImpl";
import { UserServiceImpl } from "./service/UserServiceImpl";
import { ItemServiceImpl } from "./service/ItemServiceImpl";

const host = hostBuilder()
    .addSingleton(core.IDatabaseDriver, SQLiteDriver)
    .addScope(core.IItemRepository, ItemRepositoryImpl)
    .addScope(core.IUserRepository, UserRepositoryImpl)
    .addScope(core.IUserService, UserServiceImpl)
    .addScope(core.IItemService, ItemServiceImpl)
    .build();

export const makeItemServices = () => host.make(core.IItemService);
export const makeUserServices = () => host.make(core.IUserService);