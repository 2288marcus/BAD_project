async function loadrankList() {
  let res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/gameRank`);
  let json = await res.json();

  let fiveCupdata = json.fiveCupdata.map((record, index) => {
    return {
      no: index + 1,
      username: record.username,
      time_spending: formateTime(record.time_spending),
    };
  });

  let oneMinuteData = json.oneMinuteData.map((record, index) => {
    return {
      no: index + 1,
      username: record.username,
      user_score: record.user_score,
    };
  });
  //   renderTemplate(articleList, { fiveCupdata }, { oneMinuteData });
  createTableElm(fiveCupdata, "cup");
  createTableElm(oneMinuteData, "minute");
}
loadrankList();

function formateTime(time) {
  time = Number(time);
  var h = Math.floor(time / 3600);
  var m = Math.floor((time % 3600) / 60);
  var s = Math.floor((time % 3600) % 60);

  var hDisplay = h > 0 ? h + (h == 1 ? " hour, " : " hours, ") : "";
  var mDisplay = m > 0 ? m + (m == 1 ? " minute, " : " minutes, ") : "";
  var sDisplay = s > 0 ? s + (s == 1 ? " second" : " seconds") : "";
  return hDisplay + mDisplay + sDisplay;
}

console.log(formateTime(100));

function createTableElm(data, tableName) {
  const table = document.createElement("table");
<<<<<<< HEAD
  const table2 = document.createElement("table2");

  // Create table header
  const thead = document.createElement("thead");
  thead.classList.add("rank-header");
  const headerRow = document.createElement("tr");
  headerRow.classList.add("tr");
  const headerRow2 = document.createElement("tr2");
  headerRow2.classList.add("tr2");
  if (tableName === "cup") {
    headerRow2.innerHTML = "<tr2>5 Cup</tr2>";
  } else {
    headerRow2.innerHTML = "<tr2>1 Min</tr2>";
  }
  thead.appendChild(headerRow2);
  if (tableName === "cup") {
    headerRow.innerHTML = "<th>No</th><th>Time Spending ( User Name )</th>";
  } else {
    headerRow.innerHTML = "<th>No</th><th>User score ( User Name ) </th>";
  }
  thead.appendChild(headerRow);
  thead.classList.add("thead");
=======
  table.classList.add("rank-container");

  // Create table header
  const thead = document.createElement("thead");
  const headerRow = document.createElement("tr");
  if (tableName === "cup") {
    headerRow.innerHTML = "<th>No</th><th>User Name</th><th>Time Spending</th>";
  } else {
    headerRow.innerHTML = "<th>No</th><th>User Name</th><th>User score</th>";
  }
  thead.appendChild(headerRow);
>>>>>>> b3fea18166f3293e61fa174e7faf5455531d01a8
  table.appendChild(thead);

  // Create table body
  const tbody = document.createElement("tbody");
<<<<<<< HEAD
  tbody.classList.add("rank-container");
  data.forEach((item) => {
    const row = document.createElement("tr");
    row.classList.add("tr3");
    if (tableName === "cup") {
      row.innerHTML = `<td>${item.no}</td><td>${item.time_spending} (${item.username})</td>`;
    } else {
      row.innerHTML = `<td>${item.no}</td><td>${item.user_score} (${item.username})</td>`;
=======
  data.forEach((item) => {
    const row = document.createElement("tr");
    if (tableName === "cup") {
      row.innerHTML = `<td>${item.no}</td><td>${item.username}</td><td>${item.time_spending}</td>`;
    } else {
      row.innerHTML = `<td>${item.no}</td><td>${item.username}</td><td>${item.user_score}</td>`;
>>>>>>> b3fea18166f3293e61fa174e7faf5455531d01a8
    }

    tbody.appendChild(row);
  });
  table.appendChild(tbody);

  // Append table to the DOM
  document.body.appendChild(table);
}
