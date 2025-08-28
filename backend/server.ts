import {makeItemServices, makeUserServices} from './src/main'
import express from 'express'
import { User } from './src/data/User';

const app = express();
const itemService = makeItemServices();
const userService = makeUserServices();

app.use(express.json());

app.post('/users/:id', async (req, res) => {
    const user = await userService.createUser(user.body);
});

export default app;
