window.addEventListener("load", () => {
  showSummary();
});

const studentList = {};
const summaryBtn = document.querySelector("#getSummary");
const form = document.querySelector("form");

function searchStudentId(event) {
  const searchValue = event.target.value;
  const studentId = document.querySelector(`#${searchValue}`);
  if (studentId) studentId.style.color = "red";
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(form);
  fetch("https://zoom-attendance-management.herokuapp.com/api/upload", {
    method: "POST",
    body: formData,
  })
    .then((response) => response.json())
    .then((result) => {
      form.reset();
      const uploadStatus = document.querySelector("#uploadStatus");
      uploadStatus.style.display = "block";
      setTimeout(() => {
        uploadStatus.style.display = "none";
      }, 800);
    })
    .catch((error) => console.log(error));
});

summaryBtn.addEventListener("click", () => {
  const evalData = JSON.parse(localStorage.getItem("evaluation"));
  if (evalData) return;
  fetch("https://zoom-attendance-management.herokuapp.com/api/getSummary", {
    method: "GET",
  })
    .then((response) => response.json())
    .then((summary) => storeDate(summary))
    .then(() => showSummary())
    .catch(({ error }) => console.log("File not found"));
});

function storeDate(summary) {
  localStorage.setItem("evaluation", JSON.stringify(summary));
}

function showSummary() {
  const steps = document.querySelector("#steps");
  const table = document.querySelector("table");
  const evalData = JSON.parse(localStorage.getItem("evaluation"));

  // show the steps message when eval data in localStorage is empty;
  // show table when eval data is available;
  if (evalData) {
    steps.style.display = "none";
    table.style.visibility = "visible";
  } else {
    return;
  }
  // to avoid adding rows to existing body we are cleaning up before next click;
  const tableBody = document.querySelector("table > tbody");
  tableBody.innerHTML = "";

  const {
    ["FT-AD-3"]: ft_ad_3,
    ["FT-WEB-10"]: ft_web_10,
    ["Ninjas II"]: ninjas_2,
    ["Samurai II"]: samurai_2,
    ["Spartans II"]: spartans_2,
  } = evalData;

  [
    ["Spartans II", spartans_2, "sp_2"],
    ["Samurai II", samurai_2, "sm_2"],
    ["Ninjas II", ninjas_2, "nj2"],
    ["FT-AD-3", ft_ad_3, "fa3"],
    ["FT-WEB-10", ft_web_10, "fw10"],
  ].forEach((data) => {
    const table = document.querySelector("#evalSummaryTable tbody");
    const batchName = data[0];
    const totalStudents = Object.keys(data[1]).length;
    const [codingPresent, dsaPresent, dsaFlag, codingFlag] = findTotalPresent(
      data[1],
      data[2]
    );
    const template = `<tr>
          <td style="cursor: default; color: black;">${batchName}</td>
          <td id=${data[2]}_t onclick="showList(event)">${totalStudents}</td>
          <td id=${data[2]}_ca onclick="showList(event)">${
      totalStudents - codingPresent
    }</td>
          <td id=${data[2]}_cp onclick="showList(event)">${codingPresent}</td>
          <td id=${data[2]}_da onclick="showList(event)">${
      totalStudents - dsaPresent
    }</td>
          <td id=${data[2]}_dp onclick="showList(event)">${dsaPresent}</td>
          <td id=${data[2]}_rd onclick="showList(event)">${dsaFlag}</td>
          <td id=${data[2]}_rc onclick="showList(event)">${codingFlag}</td>
        </tr>`;
    table.innerHTML += template;
  });
}

function showList(event) {
  const bottomContainer = document.querySelector("#studentListContainer");
  const heading = document.querySelector("#bottomContainer > div > h2");
  const input = document.querySelector("#bottomContainer > div > input");
  heading.style.display = "inline";
  input.style.display = "block";
  input.value = "";
  bottomContainer.innerHTML = "";
  const studentIds = studentList[event.target.id]
    .sort()
    .map((studentId) => {
      return `<div class="studentId" id=${studentId}>${studentId}</div>`;
    })
    .join("");
  bottomContainer.innerHTML = studentIds;
}

function findTotalPresent(batchObject, batchCode) {
  let codingTotal = 0;
  let dsaTotal = 0;
  let redFlagDSATotal = 0;
  let redFlagCodingTotal = 0;

  // da: dsa absent; dp: dsa present; ca: coding absent; cp: coding present; rd: red flag DSA; rc: red flag coding;

  let da = [],
    dp = [],
    ca = [],
    cp = [],
    rd = [],
    rc = [];

  for (const studentId in batchObject) {
    const { dsa, c1, c2 } = batchObject[studentId];
    if (dsa["attend"]) {
      dsaTotal += dsa["attend"];
      dp.push(studentId);
    } else {
      da.push(studentId);
    }

    if (c1["attend"] || c2["attend"]) {
      codingTotal += c1["attend"] || c2["attend"];
      cp.push(studentId);
    } else {
      ca.push(studentId);
    }

    if (dsa["flag"]) {
      rd.push(studentId);
      redFlagDSATotal += dsa["flag"];
    }

    if (c1["flag"] || c2["flag"]) {
      rc.push(studentId);
      redFlagCodingTotal += c1["flag"] || c2["flag"];
    }
  }

  const t = Object.keys(batchObject);
  [
    ["_t", t],
    ["_ca", ca],
    ["_cp", cp],
    ["_da", da],
    ["_dp", dp],
    ["_rd", rd],
    ["_rc", rc],
  ].forEach(([tag, data], idx) => {
    studentList[batchCode + tag] = data;
  });

  return [codingTotal, dsaTotal, redFlagDSATotal, redFlagCodingTotal];
}
