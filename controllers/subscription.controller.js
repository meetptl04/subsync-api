import Subscription from "../models/subscription.model.js";
import workflowClient from './../config/upstash.js';
import { SERVER_URL } from "../config/env.js"

const createSubscription = async (req, res, next) => {
    try {
        const subscription = await Subscription.create({
            ...req.body,
            user: req.user._id,
        });

        let workflowRunId = null;
        try {
            const response = await workflowClient.trigger({
                url: `${SERVER_URL}/api/v1/workflows/subscription/reminder`,
                body: { subscriptionId: subscription.id },
                headers: {
                    'Content-Type': 'application/json',
                    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36  ',
                },
                retries: 0,
            });
            workflowRunId = response.workflowRunId;
        } catch (workflowError) {
            console.warn('⚠️ Workflow trigger failed:', workflowError.message);
            // console.warn('⚠️ Workflow trigger failed:', workflowError);
        }

        res.status(201).json({ success: true, data: { subscription, workflowRunId } });
    } catch (e) {
        next(e);
    }
};

const getUserSubscriptions = async (req, res, next) => {
    try {
        const { id } = req.params;

        if (req.user.id !== id) {
            const error = new Error("You are not the owner of this account");
            error.statusCode = 401;
            throw error;
        }

        const subscription = await Subscription.find({ user: id });

        res.status(200).json({ success: true, data: subscription });
    } catch (error) {
        next(error);
    }
};

export { createSubscription, getUserSubscriptions };
