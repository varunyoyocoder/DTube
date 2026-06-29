// utils/updateModeration.js

const Reports = require("../models/Reports");
const Videos = require("../models/Videos");
const Comments = require("../models/Comments");

async function updateModeration(targetType, targetContentId) {
  const reportCount = await Reports.countDocuments({
    targetType,
    targetContentId,
    status: "pending",
  });

  let status = "active";

  if (targetType === "video") {
    if (reportCount >= 25) {
      status = "removed";
    } else if (reportCount >= 10) {
      status = "flagged";
    }

    await Videos.findByIdAndUpdate(targetContentId, {
      reportCount,
      status,
    });
  }

  if (targetType === "comment") {
    if (reportCount >= 15) {
      status = "removed";
    } else if (reportCount >= 5) {
      status = "flagged";
    }

    await Comments.findByIdAndUpdate(targetContentId, {
      reportCount,
      status,
    });
  }
}

module.exports = updateModeration;