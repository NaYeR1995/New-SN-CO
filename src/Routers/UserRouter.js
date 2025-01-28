import { Router } from "express";
const route = Router();
import { createUser, getAllUser } from "../Controllers/UserControllers.js";

route.post('/v1/snippet/createUser', createUser);
route.get('/v1/snippet/GetAllUser', getAllUser);


export default route;
