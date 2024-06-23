import express from "express";
import { cors, bodyParser } from "@/main/middlewares";

const app = express();
app.use(cors);
app.use(bodyParser);
export default app;
