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
  table.appendChild(thead);

  // Create table body
  const tbody = document.createElement("tbody");
  data.forEach((item) => {
    const row = document.createElement("tr");
    if (tableName === "cup") {
      row.innerHTML = `<td>${item.no}</td><td>${item.username}</td><td>${item.time_spending}</td>`;
    } else {
      row.innerHTML = `<td>${item.no}</td><td>${item.username}</td><td>${item.user_score}</td>`;
    }

    tbody.appendChild(row);
  });
  table.appendChild(tbody);

  // Append table to the DOM
  document.body.appendChild(table);
}
