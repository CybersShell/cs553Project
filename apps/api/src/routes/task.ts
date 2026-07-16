import express from "express";
import * as query from "../db/query";
import * as schema from "../schema/schema";
import * as taskService from "../services/task";

export function StartTasksController(app: express.Application) {

    app.get("/tasks", async (_req, res) => {
        try {
            
            const result = await query.getAllTasks()
            
            res.json(result.rows);
        } catch (error) {
            console.error("Failed to fetch tasks:", error);
            res.status(500).json({
                status: "error",
                message: "Failed to fetch tasks",
            });
        }
    });
    
    app.post("/tasks", async (req, res) => {
        try {
            if (!req.body) {
                console.error("No request body");
                res.status(400).json({
                    status: "error",
                    message: "No request body",
                });
                
            }
            console.log(req.body);
            const reqBody = req.body;
            if (reqBody) {
                const errorMsg = schema.validateTaskReqData(reqBody);
                if (errorMsg !== undefined) {
                    res.status(400).json(
                        errorMsg
                    );
                }
            }
            var task: schema.Task = {
                id: reqBody.id,
                title: reqBody.title,
                status: reqBody.status
            };
            
            var createdTask = (await taskService.createTask(task)).rows;
            res.status(201).json(
                createdTask
            )
            
        } catch (error) {
            console.error("Failed to create task:", error);
            res.status(500).json({
                status: "error",
                message: `Failed to create task`,
            });
            
        }
    })
    
    app.get("/tasks/:id", async (req, res) => {
        try {
            const result = await taskService.getTask(Number(req.params.id))
                
            if (result.rowCount) {
                res.json(result.rows[0]);
                return
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
    });
    
    app.patch("/tasks/:id", async (req, res) => {
        try {
            const reqBody = req.body;
            if (reqBody) {
                const errorMsg = schema.validateTaskReqData(reqBody);
                if (errorMsg !== undefined) {
                    res.status(400).json(
                        errorMsg
                    );
                }
            }
            var task: schema.Task = {
                id: req.params.id,
                title: reqBody.title,
                status: reqBody.status
            };
            const result = await taskService.updateTask(task)
                
            if (result.rowCount) {
                res.json({
                    status: "success",
                    message: result.rows[0]
                })
                return
            }
            
            res.status(404).json({
                status: "error",
                message: "Task not found",
            });
        } catch (error) {
            console.error("Failed to update task:", error);
            res.status(500).json({
                status: "error",
                message: "Failed to update task",
            });
        }
    });

    app.delete("/tasks/:id", async (req, res) => {
        try {
            await taskService.deleteTask(req.params.id)
            res.status(204).json({
                status: "success",
                message: "task deleted successfully"
            })
        } catch (error) {
            console.error("Failed to delete task:", error);
            res.status(500).json({
                status: "error",
                message: "Failed to delete task",
            });
        }
    })
}