import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const verifyAdmin = asyncHandler(async (req, res, next) => {
  // verifyJWT must run before this middleware
  // so req.user is already set

  if (!req.user) {
    throw new ApiError(401, "Unauthorized request");
  }

  if (req.user.role !== "admin") {
    throw new ApiError(
      403,
      "Access denied! Only admins can perform this action"
    );
  }

  next();
});