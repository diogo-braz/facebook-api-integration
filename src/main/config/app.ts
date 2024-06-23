import express from "express";
import { cors } from "@/main/middlewares";

const app = express();
app.use(cors);
export default app;
