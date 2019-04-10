function addTableElement(file) {
  let fileElement = document.createElement("DIV");
  fileElement.innerHTML = `<div class = ${"file-entries"}><div class = ${"filepath"}>${
    file[0]
  }</div><div class = ${"perms"}>${(file[2] & 0o777).toString(
    8
  )}</div><div class = ${"mod-date"}>${file[6]}</div><div>${
    file[3]
  }</div></div>`;
  document.getElementById("third-row").appendChild(fileElement);
}
