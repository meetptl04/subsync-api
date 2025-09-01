import User from "../models/user.model.js";

// Get all users
const getUsers = async (req, res, next) => {
    try {
        const users = await User.find().select('-password'); // don’t expose passwords
        res.status(200).json({ success: true, data: users });
    } catch (error) {
        next(error);
    }
};

// Get single user by ID
const getUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) {
            const error = new Error('User not found');
            error.statusCode = 404;
            throw error;
        }
        res.status(200).json({ success: true, data: user });
    } catch (error) {
        next(error);
    }
};

// Create new user
// const createUser = async (req, res, next) => {
//     try {
//         const user = await User.create(req.body);
//         res.status(201).json({ success: true, data: user });
//     } catch (error) {
//         next(error);
//     }
// };

// Update user by ID
const updateUser = async (req, res, next) => {
    try {
        const user = await User.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        ).select('-password');

        if (!user) {
            const error = new Error('User not found');
            error.statusCode = 404;
            throw error;
        }

        res.status(200).json({ success: true, message: "User Data updated successfully", data: user });
    } catch (error) {
        next(error);
    }
};

// Delete user by ID
const deleteUser = async (req, res, next) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            const error = new Error('User not found');
            error.statusCode = 404;
            throw error;
        }
        res.clearCookie("token");
        res.status(200).json({ success: true, message: "User deleted successfully" });
    } catch (error) {
        next(error);
    }
};

// export { getUsers, getUser, createUser, updateUser, deleteUser };
export { getUsers, getUser, updateUser, deleteUser };
