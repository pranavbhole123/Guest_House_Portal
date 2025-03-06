import Reservation from "../models/Reservation.js";

export async function getAggregatedData(matchCriteria, groupFields, sortCriteria) {
    try {
      const pipeline = [];
  
      // Build the $match stage from matchCriteria array.
      if (Array.isArray(matchCriteria) && matchCriteria.length > 0) {
        // Convert the array of { field, value } into an object.
        // You can expand this to support different operators as needed.
        const matchQuery = {};
        matchCriteria.forEach((crit) => {
          matchQuery[crit.field] = crit.value;
        });
        pipeline.push({ $match: matchQuery });
      }
  
      // Build the $group stage using the groupFields array.
      if (Array.isArray(groupFields) && groupFields.length > 0) {
        const _id = {};
        groupFields.forEach((field) => {
          _id[field] = `$${field}`;
        });
        pipeline.push({
          $group: {
            _id,
            count: { $sum: 1 } // count documents in each group
          }
        });
      }
  
      // Build the $sort stage from sortCriteria array.
      if (Array.isArray(sortCriteria) && sortCriteria.length > 0) {
        const sortQuery = {};
        sortCriteria.forEach((sortObj) => {
          // Map "asc" to 1 and "desc" to -1.
          sortQuery[sortObj.field] = sortObj.order === "asc" ? 1 : -1;
        });
        pipeline.push({ $sort: sortQuery });
      }
  
      console.log("Aggregation pipeline:", JSON.stringify(pipeline, null, 2));
      const data = await Reservation.aggregate(pipeline);
      console.log("Aggregation Result:", data);
      return data;
    } catch (error) {
      console.error("Error in aggregation:", error);
      throw error;
    }
  }

