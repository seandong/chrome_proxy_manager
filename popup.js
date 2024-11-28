document.getElementById("applyProxy").addEventListener("click", () => {
  const proxyType = document.getElementById("proxyType").value;
  const proxyHost = document.getElementById("proxyHost").value;
  const proxyPort = document.getElementById("proxyPort").value;
  const proxyUsername = document.getElementById("proxyUsername").value;
  const proxyPassword = document.getElementById("proxyPassword").value;

  if (!proxyHost || !proxyPort || !proxyUsername || !proxyPassword) {
    updateStatus("Please fill in all fields.", "error");
    return;
  }

  chrome.runtime.sendMessage(
    {
      type: "set-proxy",
      proxyType,
      proxyHost,
      proxyPort,
      proxyUsername,
      proxyPassword,
    },
    (response) => {
      if (response.status === "success") {
        updateStatus("Proxy applied successfully!", "success");
      }
    }
  );
});

document.getElementById("clearProxy").addEventListener("click", () => {
  chrome.runtime.sendMessage({ type: "clear-proxy" }, (response) => {
    if (response.status === "success") {
      updateStatus("Proxy cleared!", "success");
    }
  });
});

function updateStatus(message, type) {
  const statusDiv = document.getElementById("status");
  statusDiv.textContent = message;
  statusDiv.style.color = type === "success" ? "green" : "red";
}
