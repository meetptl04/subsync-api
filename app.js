import express from "express";
import cookieParser from "cookie-parser";
import { PORT } from './config/env.js';

import userRouter from "./routes/user.routes.js";
import authRouter from "./routes/auth.routes.js";
import subscriptionRouter from "./routes/subscription.routes.js";
import connectDB from "./database/mongodb.js";
import errorMiddleware from "./middleware/error.middleware.js";
import arcjetMiddleware from "./middleware/arcjet.middleware.js";
import workflowRouter from "./routes/workflow.routes.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// app.use(arcjetMiddleware);
if (process.env.NODE_ENV === 'production') {
	app.use(arcjetMiddleware); // Only apply in production
}


app.use('/api/v1/auth', authRouter)
app.use('/api/v1/users', userRouter)
app.use('/api/v1/subscriptions', subscriptionRouter)
app.use('/api/v1/workflows', workflowRouter);

app.get('/', (req, res) => {
	res.send("This is my REST API project server");
});

app.listen(PORT, async () => {
	console.log(`Server is running on port: ${PORT}`);
	await connectDB();
});

app.use(errorMiddleware)
export default app;
