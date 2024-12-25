import mongoose from 'mongoose';

/**
 * Converts the given value into a MongoDB ObjectId.
 *
 * @param {string} id - The string representation of the ObjectId to be converted.
 * @returns {ObjectId} - A new instance of mongoose.Types.ObjectId based on the provided id.
 */
const convertToObjectId = (id) => new mongoose.Types.ObjectId(id);

export default convertToObjectId;
