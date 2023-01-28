import express from "express";
import { Router } from "express";

const router = Router();

router.get("/", (req, res) => res.send({ response: "HELLO" }).status(200));

export default router;
