import User from "../models/user.model.js";
import WalletTransaction from "../models/wallet.model.js";
import { AppError } from "../middleware/errorHandler.js";

/**
 * Credit funds to user wallet
 */
export const creditWallet = async (userId, amount, description = "", orderId = null) => {
    const user = await User.findById(userId);
    if (!user) throw new AppError("User not found", 404);

    user.walletBalance += amount;
    await user.save({ validateBeforeSave: false });

    await WalletTransaction.create({
        user: userId,
        type: "CREDIT",
        amount,
        description,
        relatedOrder: orderId,
        balanceAfter: user.walletBalance,
    });

    return user.walletBalance;
};

/**
 * Debit funds from user wallet
 */
export const debitWallet = async (userId, amount, description = "", orderId = null) => {
    const user = await User.findById(userId);
    if (!user) throw new AppError("User not found", 404);
    if (user.walletBalance < amount) throw new AppError("Insufficient wallet balance", 400);

    user.walletBalance -= amount;
    await user.save({ validateBeforeSave: false });

    await WalletTransaction.create({
        user: userId,
        type: "DEBIT",
        amount,
        description,
        relatedOrder: orderId,
        balanceAfter: user.walletBalance,
    });

    return user.walletBalance;
};

/**
 * Hold funds in escrow (debit from customer, mark as ESCROW_HOLD)
 */
export const holdEscrow = async (userId, amount, orderId) => {
    const user = await User.findById(userId);
    if (!user) throw new AppError("User not found", 404);
    if (user.walletBalance < amount) throw new AppError("Insufficient wallet balance", 400);

    user.walletBalance -= amount;
    await user.save({ validateBeforeSave: false });

    await WalletTransaction.create({
        user: userId,
        type: "ESCROW_HOLD",
        amount,
        description: `Escrow hold for order`,
        relatedOrder: orderId,
        balanceAfter: user.walletBalance,
    });

    return user.walletBalance;
};

/**
 * Release escrow funds to vendor
 */
export const releaseEscrow = async (vendorUserId, amount, orderId) => {
    const user = await User.findById(vendorUserId);
    if (!user) throw new AppError("Vendor user not found", 404);

    user.walletBalance += amount;
    await user.save({ validateBeforeSave: false });

    await WalletTransaction.create({
        user: vendorUserId,
        type: "ESCROW_RELEASE",
        amount,
        description: `Escrow release for order`,
        relatedOrder: orderId,
        balanceAfter: user.walletBalance,
    });

    return user.walletBalance;
};

/**
 * Refund funds to customer wallet
 */
export const refundToWallet = async (userId, amount, orderId) => {
    const user = await User.findById(userId);
    if (!user) throw new AppError("User not found", 404);

    user.walletBalance += amount;
    await user.save({ validateBeforeSave: false });

    await WalletTransaction.create({
        user: userId,
        type: "REFUND",
        amount,
        description: `Refund for order`,
        relatedOrder: orderId,
        balanceAfter: user.walletBalance,
    });

    return user.walletBalance;
};

/**
 * Get wallet transaction history
 */
export const getWalletHistory = async (userId, page = 1, limit = 20) => {
    const skip = (page - 1) * limit;
    const transactions = await WalletTransaction.find({ user: userId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean();

    const total = await WalletTransaction.countDocuments({ user: userId });
    return { transactions, totalPages: Math.ceil(total / limit), currentPage: page };
};
