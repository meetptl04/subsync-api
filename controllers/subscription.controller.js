import Subscription from "../models/subscription.model.js";
import workflowClient from "./../config/upstash.js";
import { SERVER_URL } from "../config/env.js";

// Create subscription
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
                headers: { "Content-Type": "application/json" },
                retries: 0,
            });
            workflowRunId = response.workflowRunId;
        } catch (workflowError) {
            console.warn("⚠️ Workflow trigger failed:", workflowError.message);
        }

        res.status(201).json({ success: true, data: { subscription, workflowRunId } });
    } catch (e) {
        next(e);
    }
};

// Get subscriptions for a user
const getUserSubscriptions = async (req, res, next) => {
    try {
        const { id } = req.params;

        if (req.user.id !== id) {
            const error = new Error("You are not the owner of this account");
            error.statusCode = 401;
            throw error;
        }

        const subscriptions = await Subscription.find({ user: id });
        res.status(200).json({ success: true, data: subscriptions });
    } catch (error) {
        next(error);
    }
};

// Get subscription by ID
const getSubscriptionById = async (req, res, next) => {
    try {
        const subscription = await Subscription.findById(req.params.id);

        if (!subscription) {
            const error = new Error("Subscription not found");
            error.statusCode = 404;
            throw error;
        }

        // Ensure user owns subscription
        if (subscription.user.toString() !== req.user.id) {
            const error = new Error("Unauthorized access");
            error.statusCode = 401;
            throw error;
        }

        res.status(200).json({ success: true, data: subscription });
    } catch (error) {
        next(error);
    }
};

// Update subscription
const updateSubscription = async (req, res, next) => {
    try {
        const subscription = await Subscription.findById(req.params.id);

        if (!subscription) {
            const error = new Error("Subscription not found");
            error.statusCode = 404;
            throw error;
        }

        if (subscription.user.toString() !== req.user.id) {
            const error = new Error("Unauthorized access");
            error.statusCode = 401;
            throw error;
        }

        Object.assign(subscription, req.body);
        await subscription.save();

        res.status(200).json({ success: true, data: subscription });
    } catch (error) {
        next(error);
    }
};

// Delete subscription
const deleteSubscription = async (req, res, next) => {
    try {
        const subscription = await Subscription.findById(req.params.id);

        if (!subscription) {
            const error = new Error("Subscription not found");
            error.statusCode = 404;
            throw error;
        }

        if (subscription.user.toString() !== req.user.id) {
            const error = new Error("Unauthorized access");
            error.statusCode = 401;
            throw error;
        }

        await subscription.deleteOne();

        res.status(200).json({ success: true, message: "Subscription deleted successfully" });
    } catch (error) {
        next(error);
    }
};

// Cancel subscription
const cancelSubscription = async (req, res, next) => {
    try {
        const subscription = await Subscription.findById(req.params.id);

        if (!subscription) {
            const error = new Error("Subscription not found");
            error.statusCode = 404;
            throw error;
        }

        if (subscription.user.toString() !== req.user.id) {
            const error = new Error("Unauthorized access");
            error.statusCode = 401;
            throw error;
        }

        subscription.status = "cancelled";
        await subscription.save();

        res.status(200).json({ success: true, message: "Subscription cancelled successfully", data: subscription });
    } catch (error) {
        next(error);
    }
};

// Get upcoming renewals for a specific user
const getUpcomingRenewals = async (req, res, next) => {
    try {
        const { id } = req.params;

        const renewals = await Subscription.find({
            user: id, // works since stored as string in your docs
            status: "active",
            renewalDate: { $gte: new Date() } // corrected field
        });

        res.status(200).json({ success: true, data: renewals });
    } catch (error) {
        next(error);
    }
};


export {
    createSubscription,
    getUserSubscriptions,
    getSubscriptionById,
    updateSubscription,
    deleteSubscription,
    cancelSubscription,
    getUpcomingRenewals,
};
