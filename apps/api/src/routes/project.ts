import express from "express";
import * as schema from "../schema/schema";
import * as projectService from "../services/project";
import { authenticateToken } from "./middleware/auth";

export function StartProjectsController(app: express.Application) {

    app.get("/projects", authenticateToken, getProjects);

    app.post("/projects", authenticateToken, createProject);

    app.get("/projects/:id", authenticateToken, getProjectById);

    app.patch("/projects/:id", authenticateToken, updateProject);

    app.delete("/projects/:id", authenticateToken, deleteProject);
}

async function getProjectById(req: express.Request, res: express.Response) {
    try {

        if (req.userTokenData.role == "admin") {
            const result = await projectService.getProjectById(Number(req.params.id), req.userTokenData.id, true);
            if (result.hasOwnProperty("Error")) {
                res.status(404).json({
                    error: result.Error
                })
                return;
            }
            if (result.rowCount && result.rowCount > 0) {
                res.json(result.rows[0]);
                return;
            }

            res.status(404).json({
                status: "error",
                message: "Project not found",
            });
            return;
        }
        const result = await projectService.getProjectById(Number(req.params.id), req.userTokenData.id);

        if (result.rowCount && result.rowCount > 0) {
            res.json(result.rows[0]);
            return;
        }

        res.status(404).json({
            status: "error",
            message: "Project not found",
        });
    } catch (error) {
        console.error("Failed to fetch project:", error);
        res.status(500).json({
            status: "error",
            message: "Failed to fetch project",
        });
    }
}

async function getProjects(req: express.Request, res: express.Response) {
    try {

        if (req.userTokenData && req.userTokenData.role != "admin") {
            const result = await projectService.getProjectsForUser(req.userTokenData.id);
            if (result.rows.length == 0) {
                res.status(404).json({
                    status: "error",
                    message: "No projects found for user",
                });
                return;
            }
            res.json(result.rows);
            return;
        } else {
            const result = await projectService.getAllProjects();
            if (result.rows.length == 0) {
                res.status(404).json({
                    status: "error",
                    message: "No projects found",
                });
                return;
            }
            res.json(result.rows);
        }
    } catch (error) {
        console.error("Failed to fetch projects:", error);
        res.status(500).json({
            status: "error",
            message: "Failed to fetch projects",
        });
    }
}

async function createProject(req: express.Request, res: express.Response) {
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
            const errorMsg = schema.validateProjectReqData(reqBody);
            if (errorMsg !== undefined) {
                res.status(400).json(
                    errorMsg
                );
                return;
            }
        }

        var project: schema.Project = {
            id: null, // DB will create id
            name: reqBody.name,
            description: reqBody.description,
            ownerId: req.userTokenData.id,
        };

        var createdProject = await projectService.createProject(project);

        // if (createdProject.rowCount && createdProject.rowCount > 0) {
        //     res.status(404).json({
        //         status: "error",
        //         message: "Cannot create: Project already exists",
        //     });
        //     return
        // }


        res.status(201).json(
            createdProject.rows[0]
        )

    } catch (error) {
        console.error("Failed to create project:", error);
        res.status(500).json({
            status: "error",
            message: `Failed to create project`,
        });

    }
}

async function updateProject(req: express.Request, res: express.Response) {
    try {
        const reqBody = req.body;
        if (reqBody) {
            const errorMsg = schema.validateProjectReqData(reqBody);
            if (errorMsg !== undefined) {
                res.status(400).json(
                    errorMsg
                );
                return;
            }
        }
        var project: schema.Project = {
            id: req.params.id,
            name: reqBody.name,
            description: reqBody.description,
            ownerId: reqBody.ownerId,
        };

        if (req.userTokenData.role != "admin") {
            const result = await projectService.updateProject(project, req.userTokenData.id, false)

            if (result.hasOwnProperty("Error")) {
                res.status(result.statusCode).json({
                    error: result.Error
                })
                return;
            }

            if (result.rowCount == 0) {
                res.status(404).json({
                    status: "error",
                    message: "Project not found",
                });
                return
            }

            res.json({
                status: "success",
                message: result.rows[0]
            })
            return;
        }
        const result = await projectService.updateProject(project, req.userTokenData.id, true);

        if (result.rowCount == 0) {
            res.status(404).json({
                status: "error",
                message: "Project not found",
            });
            return
        }

        res.json({
            status: "success",
            message: result.rows[0]
        })
    } catch (error) {
        console.error("Failed to update project:", error);
        res.status(500).json({
            status: "error",
            message: "Failed to update project",
        });
    }
}

async function deleteProject(req: express.Request, res: express.Response) {
    try {
        if (req.userTokenData.role != "admin") {
            res.status(403).json({
                status: "error",
                message: "Forbidden: You do not have permission to delete a project"
            });
            return;
        }

        const result = await projectService.deleteProject(req.params.id);
        if (result.rowCount == 0) {
            res.status(404).json({
                status: "error",
                message: `Project ${req.params.id} not found`
            })
            return
        }
        res.status(204).json({
            status: "success",
            message: "project deleted successfully"
        })
    } catch (error) {
        console.error("Failed to delete project:", error);
        res.status(500).json({
            status: "error",
            message: "Failed to delete project",
        });
    }
}