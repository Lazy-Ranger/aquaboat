import { Types } from "mongoose";

export const generateId = () => new Types.ObjectId().toString();
