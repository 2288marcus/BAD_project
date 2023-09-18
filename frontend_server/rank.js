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
  const table = document.createElement("table");
  createTableElm(table, fiveCupdata, "cup");
  createTableElm(table, oneMinuteData, "minute");
  document.body.appendChild(table);
}
loadrankList();

function formateTime(time) {
  time = Number(time);
  var h = Math.floor(time / 3600);
  var m = Math.floor((time % 3600) / 60);
  var s = Math.floor((time % 3600) % 60);

  var hDisplay = h > 0 ? h + (h == 1 ? " Hour, " : " Hour, ") : "";
  var mDisplay = m > 0 ? m + (m == 1 ? " Min, " : " Min, ") : "";
  var sDisplay = s > 0 ? s + (s == 1 ? " Sec" : " Sec") : "";
  return hDisplay + mDisplay + sDisplay;
}

console.log(formateTime(100));

function createTableElm(table, data, tableName) {
  // Create table header
  const thead = document.createElement("thead");
  thead.classList.add("rank-header");
  const headerRow = document.createElement("tr");
  headerRow.classList.add("tr");
  const headerRow2 = document.createElement("tr");
  headerRow2.classList.add("tr2");
  if (tableName === "cup") {
    headerRow2.innerHTML = "<th>5 Cup</th>";
  } else {
    headerRow2.innerHTML = "<th>1 Min</th>";
  }
  thead.appendChild(headerRow2);
  if (tableName === "cup") {
    headerRow.innerHTML =
      "<th>No</th><th>Time Spending</td><td> ( User Name )</th>";
  } else {
    headerRow.innerHTML =
      "<th>No</th><th>User score</td><td> ( User Name ) </th>";
  }
  thead.appendChild(headerRow);
  thead.classList.add("thead");
  table.appendChild(thead);

  // Create table body
  const tbody = document.createElement("tbody");
  tbody.classList.add("rank-container");
  data.forEach((item) => {
    const row = document.createElement("tr");
    row.classList.add("tr3");
    if (tableName === "cup") {
      row.innerHTML = `<td>${item.no}</td><td>${item.time_spending}</td><td>(${item.username})</td>`;
    } else {
      row.innerHTML = `<td>${item.no}</td><td>${item.user_score}</td><td>(${item.username})</td>`;
    }

    tbody.appendChild(row);
  });
  table.appendChild(tbody);

  // Append table to the DOM
}
