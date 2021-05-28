const readCSV = require("./readCSV.js");
const removeFile = require("./removeFile.js");

function processData() {
  const data = readCSV(`../uploads/zoomRecord.csv`);
  const dsaStudentData = {};
  const c1StudentData = {};
  const c2StudentData = {};
  for (const record of data) {
    const studentId = getStudentId(record);
    if (studentId) {
      const timeSlot = findTimeSlot(record);
      switch (timeSlot) {
        case "DSA SLOT":
          {
            const isValid = validateRecord(record, "DSA SLOT");
            if (isValid) {
              if (!dsaStudentData[studentId]) dsaStudentData[studentId] = 1;
              dsaStudentData[studentId]++;
            }
          }
          break;
        case "C1 SLOT":
          {
            const isValid = validateRecord(record, "C1 SLOT");
            if (isValid) {
              if (!c1StudentData[studentId]) c1StudentData[studentId] = 1;
              c1StudentData[studentId]++;
            }
          }
          break;
        case "C2 SLOT":
          {
            const isValid = validateRecord(record, "C2 SLOT");
            if (isValid) {
              if (!c2StudentData[studentId]) c2StudentData[studentId] = 1;
              c2StudentData[studentId]++;
            }
          }
          break;
      }
    }
  }

  console.log(
    Object.keys(dsaStudentData).length,
    Object.keys(c1StudentData).length,
    Object.keys(c2StudentData).length
  );
}

function calculateTimeSlots(record) {
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
    calculateTimeSlots(record);

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
  } = calculateTimeSlots(record);

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

processData();

module.exports = processData;
