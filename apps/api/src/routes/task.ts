import express from "express";
import * as schema from "../schema/schema";
import * as taskService from "../services/task";
import { authenticateToken } from "./middleware/auth";

export function StartTasksController(app: express.Application) {

    app.get("/tasks", authenticateToken, getTasks);

    app.post("/tasks", authenticateToken, createTask);

    app.get("/tasks/:id", authenticateToken, getTasksById);

    app.patch("/tasks/:id", authenticateToken, updateTask);

    app.delete("/tasks/:id", authenticateToken, deleteTask);
}

async function getTasksById(req: express.Request, res: express.Response) {
    try {
        const result = await taskService.getTaskById(Number(req.params.id), req.userTokenData.id, req.userTokenData.role);

        if (result.hasOwnProperty("Error")) {
            res.status(result.statusCode).json({
                error: result.Error
            })
            return;
        }
        
        if (result.rowCount && result.rowCount > 0) {
            res.status(201).json({
                status: "success",
                task: result.rows[0]
            })
            return;
        }

        res.status(404).json({
            status: "error",
            message: "Task not found",
        });
    } catch (error) {
        console.error("Failed to fetch task:", error);
        res.status(500).json({
            status: "error",
            message: "Failed to fetch task",
        });
    }
};

async function getTasks(req: express.Request, res: express.Response) {
    try {

        if (req.userTokenData && req.userTokenData.role != "admin") {
            const result = await taskService.getTasksForUser(req.userTokenData.id);
            if (result.rows.length == 0) {
                res.status(404).json({
                    status: "error",
                    message: "No tasks found for user",
                });
                return;
            }
            res.json(result.rows);
            return;
        } else {
            const result = await taskService.getAllTasks();
            if (result.rows.length == 0) {
                res.status(404).json({
                    status: "error",
                    message: "No tasks found",
                });
                return;
            }
            res.json(result.rows);
        }


    } catch (error) {
        console.error("Failed to fetch tasks:", error);
        res.status(500).json({
            status: "error",
            message: "Failed to fetch tasks",
        });
    }
}

async function createTask(req: express.Request, res: express.Response) {
    try {

        if (!req.body) {
            console.error("No request body");
            res.status(400).json({
                status: "error",
                message: "No request body",
            });
            return;
        }
        const reqBody = req.body;
        if (reqBody) {
            const errorMsg = schema.validateTaskReqData(reqBody);
            if (errorMsg !== undefined) {
                res.status(400).json(
                    errorMsg
                );
                return;
            }
        }
        var task: schema.Task = {
            id: null, // DB will create id
            title: reqBody.title?.trim(),
            status: reqBody.status?.trim() || "",
            description: reqBody.description?.trim() || "",
            assignedTo: req.userTokenData.id,
            projectID: reqBody.project_id,
        };

        var createdTask = await taskService.createTask(task, req.userTokenData.role == 'admin');
        if (createdTask.hasOwnProperty("Error")) {
            res.status(createdTask.statusCode).json({
                error: createdTask.Error
            })
            return;
        }

        res.status(201).json({
            status: "success",
            task: createdTask.rows[0]
        })

    } catch (error) {
        console.error("Failed to create task:", error);
        res.status(500).json({
            status: "error",
            message: `Failed to create task`,
        });

    }
}

async function updateTask(req: express.Request, res: express.Response) {
    try {
        const reqBody = req.body;
        if (!req.body) {
            console.error("No request body");
            res.status(400).json({
                status: "error",
                message: "No request body",
            });
            return;
        }
        var task: schema.Task = {
            id: req.params.id,
            title: reqBody.title,
            status: reqBody.status,
            description: reqBody.description,
            projectID: reqBody.project_id,
            assignedTo: reqBody.assigned_to,
        };

        const result = await taskService.updateTask(task, req.userTokenData.id, req.userTokenData.role == 'admin')

        if (result.hasOwnProperty("Error")) {
            res.status(result.statusCode).json({
                error: result.Error
            })
            return;
        }

        if (result.rowCount == 0) {
            res.status(404).json({
                status: "error",
                message: "Task not found",
            });
            return;
        }

        res.json({
            status: "success",
            task: result.rows[0]
        });
    } catch (error) {
        console.error("Failed to update task:", error);
        res.status(500).json({
            status: "error",
            message: "Failed to update task",
        });
    }
}

async function deleteTask(req: express.Request, res: express.Response) {
    try {

        if (req.userTokenData.role != "admin") {
            const result = await taskService.deleteTask(req.params.id, req.userTokenData.id, true);
            if (result.rowCount == 0) {
                res.status(404).json({
                    status: "error",
                    message: `Task ${req.params.id} not found`
                })
                return;
            }
            res.status(204).json({
                status: "success",
                message: "task deleted successfully"
            })
            return;
        }

        const result = await taskService.deleteTask(req.params.id, req.userTokenData.id);
        if (result.rowCount == 0) {
            res.status(404).json({
                status: "error",
                message: `Task ${req.params.id} not found`
            })
            return;
        }

        res.status(204).json({
            status: "success",
            message: "task deleted successfully"
        });

    } catch (error) {
        console.error("Failed to delete task:", error);
        res.status(500).json({
            status: "error",
            message: "Failed to delete task",
        });
    }
}