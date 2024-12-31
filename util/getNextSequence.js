'use strict';

import CounterModel from '@/app/api/v1/(counter)/counter.model';

/**
 * Asynchronously fetches and increments a sequence value in the database.
 *
 * @param {string} sequenceName - The name or identifier of the sequence to be incremented.
 * @returns {Promise<Number>} A promise that resolves to the updated sequence number.
 */
const getNextSequence = async (sequenceName) => {
    const result = await CounterModel.findByIdAndUpdate(
        sequenceName,
        { $inc: { seq: 1 } },
        { new: true, upsert: true } // Create document if not exists
    );
    return result.seq;
};

export default getNextSequence;
