import express from "express";
import { env } from "./config/env";
import * as query from "./db/query";
import * as schema from "./schema/schema";
import { StartTasksController } from "./routes/task";

const handleServerErrors = (err, req, res, next) =>{
            if(err){
                if (err instanceof SyntaxError){

                    if(/JSON/i.test(err.message)){

                        res.status(400).json({ error: `Bad JSON format: ${err.message}` })
                    } else{
						res.status(500).json(err.message)
                    }
                    console.log(err.message)
					return
                }
          }
          next(err);
}

const app = express();

app.use(express.json());

app.get("/health", (_req, res) => {
	res.json({
		status: "ok",
		service: "cs453-api",
	});
});

app.get("/db-health", async (_req, res) => {
	try {
		const result = await query.getDBTime();
		res.json({
			status: "ok",
			database: "connected",
			currentTime: result.rows[0].current_time,
		});
	} catch (error) {
		console.error("Database health check failed:", error);
		res.status(500).json({
			status: "error",
			database: "disconnected",
		});
	}
});

StartTasksController(app)

app.use((req, res) => {
  res.status(404).json({ error: "Not found" });
});

app.use(handleServerErrors)

app.listen(env.port, () => {
	console.log(`Server running at http://localhost:${env.port}`);
});
