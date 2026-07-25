import dotenv from "dotenv";
import express from "express";

import Controller from "./src/controllers/controller.js";
import Service from "./src/services/service.js";
import createRoutes from "./src/routes/route.js";

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
app.use("/", createRoutes(controller));

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});