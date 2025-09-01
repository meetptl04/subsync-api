import { Router } from "express";
import authorize from "../middleware/auth.middleware.js";
import {
    createSubscription,
    getUserSubscriptions,
    getSubscriptionById,
    updateSubscription,
    deleteSubscription,
    cancelSubscription,
    getUpcomingRenewals,
} from "../controllers/subscription.controller.js";

const subscriptionRouter = Router();

// Create a subscription
subscriptionRouter.post("/", authorize, createSubscription);

// Get all subscriptions for a specific user
subscriptionRouter.get("/user/:id", authorize, getUserSubscriptions);

// Get a single subscription by ID
subscriptionRouter.get("/:id", authorize, getSubscriptionById);

// Update a subscription
subscriptionRouter.put("/:id", authorize, updateSubscription);

// Delete a subscription
subscriptionRouter.delete("/:id", authorize, deleteSubscription);

// Cancel a subscription
subscriptionRouter.put("/:id/cancel", authorize, cancelSubscription);

// Get upcoming renewals
subscriptionRouter.get('/:id/upcoming-renewals', authorize, getUpcomingRenewals);

export default subscriptionRouter;
