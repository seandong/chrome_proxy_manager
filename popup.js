// 初始化表单时获取之前保存的代理设置
chrome.storage.local.get(
  ["proxyHost", "proxyPort", "proxyType", "proxyUsername", "proxyPassword"],
  (items) => {
    document.getElementById("proxyHost").value = items.proxyHost || "";
    document.getElementById("proxyPort").value = items.proxyPort || "";
    document.getElementById("proxyType").value = items.proxyType || "http";
    document.getElementById("proxyUsername").value = items.proxyUsername || "";
    document.getElementById("proxyPassword").value = items.proxyPassword || "";
  }
);

// 当用户点击 "Apply Proxy" 按钮时
document.getElementById("applyProxy").addEventListener("click", () => {
  const proxyHost = document.getElementById("proxyHost").value;
  const proxyPort = document.getElementById("proxyPort").value;
  const proxyType = document.getElementById("proxyType").value;
  const proxyUsername = document.getElementById("proxyUsername").value;
  const proxyPassword = document.getElementById("proxyPassword").value;

  // 保存代理设置
  chrome.storage.local.set({
    proxyHost,
    proxyPort,
    proxyType,
    proxyUsername: proxyUsername || null,  // 如果没有填则保存为 null
    proxyPassword: proxyPassword || null    // 如果没有填则保存为 null
  }, () => {
    document.getElementById("status").textContent = "Proxy settings applied!";
  });
});

// 当用户点击 "Clear Proxy" 按钮时
document.getElementById("clearProxy").addEventListener("click", () => {
  chrome.storage.local.remove(["proxyHost", "proxyPort", "proxyType", "proxyUsername", "proxyPassword"], () => {
    document.getElementById("status").textContent = "Proxy settings cleared.";
  });
});
