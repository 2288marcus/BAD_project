function formateTime(time) {
  if (!time) return "";

  time = Number(time);
  var h = Math.floor(time / 3600);
  var m = Math.floor((time % 3600) / 60);
  var s = Math.floor((time % 3600) % 60);

  var hDisplay = h > 0 ? h + (h == 1 ? " Hour, " : " Hour, ") : "";
  var mDisplay = m > 0 ? m + (m == 1 ? " Min, " : " Min, ") : "";
  var sDisplay = s > 0 ? s + (s == 1 ? " Sec" : " Sec") : "";
  return hDisplay + mDisplay + sDisplay;
}

getJSON("/gameRank", (json) => {
  let n = Math.max(json.fiveCupdata.length, json.oneMinuteData.length);
  // json.fiveCupdata.pop();
  let rows = [];
  for (let i = 0; i < n; i++) {
    rows.push({
      no: i + 1,
      time_spending_value: formateTime(json.fiveCupdata[i]?.time_spending),
      time_spending_player: json.fiveCupdata[i]?.username || "",
      score_value: json.oneMinuteData[i]?.user_score || "",
      score_player: json.oneMinuteData[i]?.username || "",
    });
  }
  renderTemplate(rankTBody, { rows });
});
