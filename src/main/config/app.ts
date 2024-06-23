import express from "express";
import { cors, bodyParser, contentType } from "@/main/middlewares";

const app = express();
app.use(cors);
app.use(bodyParser);
app.use(contentType);
export default app;
