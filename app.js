import dotenv from "dotenv";
import express from "express";

import Controller from "./src/controllers/controller.js";
import Service from "./src/services/service.js";
import createRoutes from "./src/routes/route.js";
import logger from "./src/middlewares/logger.js";
import errorHandle from "./src/middlewares/errorHandle.js";

dotenv.config();

const app = express();
const port = 3000;

// Middleware
app.use(express.json());

function initializeDependencies() {
    const service = new Service();
    const controller = new Controller(service);

    return { controller };
}

const { controller } = initializeDependencies();

// Routes
app.use(logger)
app.get("/test", (req, res) => {
    console.log("TEST ROUTE");
    res.send("OK");
});
app.use("/", createRoutes(controller));
app.use(errorHandle)

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});