import CounterModel from "@/app/api/v1/(counter)/counter.model";

// Function to get the next sequence number
const getNextSequence = async (sequenceName) => {
    const result = await CounterModel.findByIdAndUpdate(
        sequenceName,
        { $inc: { seq: 1 } },
        { new: true, upsert: true } // Create document if not exists
    );
    return result.seq;
};

export default getNextSequence;
