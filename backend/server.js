const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });

const cors = require("cors");
const express = require("express");

const app = express();
const port = Number(process.env.PORT) || 5000;
const allowedOrigins = new Set([
	"http://localhost:3000",
	"http://127.0.0.1:3000",
	...(process.env.CORS_ORIGINS ?? "").split(",").map((origin) => origin.trim()).filter(Boolean),
]);

app.use(cors({
	credentials: true,
	origin(origin, callback) {
		if (!origin || allowedOrigins.has(origin)) {
			callback(null, true);
			return;
		}
		callback(new Error(`CORS origin is not allowed: ${origin}`));
	},
}));
app.use(express.json());

app.get("/api/health", (_request, response) => {
	response.json({ status: "ok", service: "cms-backend" });
});

app.get("/health", (_request, response) => {
	response.json({ status: "ok", service: "cms-backend" });
});

app.listen(port, "0.0.0.0", () => {
	console.log(`CMS backend listening on port ${port}`);
});
