import { Router } from "express";
const router = Router();
import { createUser, getAllUser, banUserByID, updateUserByID, getUserByID } from "../Controllers/UserControllers.js";

router.post('/v1/snippet/createUser', createUser);
router.get('/v1/snippet/GetAllUser', getAllUser);
router.get('/v1/snippet/getUserByID/:id',getUserByID)
router.put('/v1/snippet/updateUserByID/:id',updateUserByID)
router.put('/v1/snippet/panUserByID/:id',banUserByID)

export default router;
