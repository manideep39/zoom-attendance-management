const readCSV = require("./readCSV.js");
const removeFile = require("./removeFile.js");

const dsaStudentSegregation = {};
const c1StudentSegregation = {};
const c2StudentSegregation = {};

function generateSummary() {}

function timeSlotStudentSegregation() {
  const data = readCSV(`../uploads/zoomRecord.csv`);
  const mapping = readCSV(`../uploads/batchRecord.csv`);

  for (const record of data) {
    const studentId = getStudentId(record);
    if (studentId) {
      const timeSlot = findTimeSlot(record);
      switch (timeSlot) {
        case "DSA SLOT":
          {
            const isValid = validateRecord(record, "DSA SLOT");
            if (isValid) {
              if (!dsaStudentSegregation[studentId])
                dsaStudentSegregation[studentId] = 1;
              dsaStudentSegregation[studentId]++;
            }
          }
          break;
        case "C1 SLOT":
          {
            const isValid = validateRecord(record, "C1 SLOT");
            if (isValid) {
              if (!c1StudentSegregation[studentId])
                c1StudentSegregation[studentId] = 1;
              c1StudentSegregation[studentId]++;
            }
          }
          break;
        case "C2 SLOT":
          {
            const isValid = validateRecord(record, "C2 SLOT");
            if (isValid) {
              if (!c2StudentSegregation[studentId])
                c2StudentSegregation[studentId] = 1;
              c2StudentSegregation[studentId]++;
            }
          }
          break;
      }
    }
  }

  const isCorrect = checkUniqueEntryWithSegregatedData(data, {
    ...dsaStudentSegregation,
    ...c1StudentSegregation,
    ...c2StudentSegregation,
  });
  if (isCorrect) {
    return {
      dsaStudentSegregation,
      c1StudentSegregation,
      c2StudentSegregation,
    };
  }
}

// Testing
function checkUniqueEntryWithSegregatedData(data, combinedSegregatedData) {
  const uniqueStudentIds = {};
  for (const record of data) {
    const studentId = getStudentId(record);
    if (studentId) {
      if (!uniqueStudentIds[studentId]) uniqueStudentIds[studentId] = 1;
    }
  }
  console.log(
    Object.keys(uniqueStudentIds).length,
    Object.keys(combinedSegregatedData).length
  );
  return (
    Object.keys(uniqueStudentIds).length ===
    Object.keys(combinedSegregatedData).length
  );
}

// exam time slots
function createTimeSlots(record) {
  const joinTime = record["Join Time"];
  const leaveTime = record["Leave Time"];

  const date = `${
    joinTime.getUTCMonth() + 1
  }/${joinTime.getUTCDate()}/${joinTime.getUTCFullYear()}`;

  const dsaStartTime = new Date(date + " " + "09:30:00 AM");
  const dsaEndTime = new Date(date + " " + "10:30:00 AM");
  const c1StartTime = new Date(date + " " + "11:30:00 AM");
  const c1EndTime = new Date(date + " " + "02:15:00 PM");
  const c2StartTime = new Date(date + " " + "03:00:00 PM");
  const c2EndTime = new Date(date + " " + "05:45:00 PM");

  return {
    joinTime,
    leaveTime,
    dsaEndTime,
    c1EndTime,
    c2EndTime,
    dsaStartTime,
    c1StartTime,
    c2StartTime,
  };
}

function findTimeSlot(record) {
  const { joinTime, dsaEndTime, c1EndTime, c2EndTime } =
    createTimeSlots(record);

  if (joinTime < dsaEndTime) {
    return "DSA SLOT";
  } else if (joinTime < c1EndTime) {
    return "C1 SLOT";
  } else if (joinTime < c2EndTime) {
    return "C2 SLOT";
  }
}

function validateRecord(record, timeSlot) {
  const {
    joinTime,
    leaveTime,
    dsaEndTime,
    c1EndTime,
    c2EndTime,
    dsaStartTime,
    c1StartTime,
    c2StartTime,
  } = createTimeSlots(record);

  // one minute === 60000 milliseconds
  const threshold = 60000 * 4;

  switch (timeSlot) {
    case "DSA SLOT":
      if (joinTime <= dsaStartTime) {
        const timeSpent = leaveTime.getTime() - dsaStartTime.getTime();
        return timeSpent >= threshold;
      } else if (joinTime > dsaStartTime) {
        const timeSpent = leaveTime.getTime() - joinTime.getTime();
        return timeSpent >= threshold;
      }
      break;
    case "C1 SLOT":
      if (joinTime <= c1StartTime) {
        const timeSpent = leaveTime.getTime() - c1StartTime.getTime();
        return timeSpent >= threshold;
      } else if (joinTime > c1StartTime) {
        const timeSpent = leaveTime.getTime() - joinTime.getTime();
        return timeSpent >= threshold;
      }
      break;
    case "C2 SLOT":
      if (joinTime <= c2StartTime) {
        const timeSpent = leaveTime.getTime() - c2StartTime.getTime();
        return timeSpent >= threshold;
      } else if (joinTime > c2StartTime) {
        const timeSpent = leaveTime.getTime() - joinTime.getTime();
        return timeSpent >= threshold;
      }
      break;
  }
}

function getStudentId(record) {
  let email = record["User Email"];
  let [user, domain] = email.split("@");
  if (domain === "masai.school") {
    const studentId = user.split("_").slice(1).join("_");
    return studentId;
  }
}

generateSummary();

module.exports = generateSummary;
