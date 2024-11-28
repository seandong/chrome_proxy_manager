chrome.runtime.onInstalled.addListener(() => {
  console.log("Proxy Manager Extension Installed");

  // 初始化代理设置
  chrome.storage.local.get(
    ["proxyHost", "proxyPort", "proxyType", "proxyUsername", "proxyPassword"],
    (items) => {
      // 如果没有设置代理配置，使用默认值
      if (!items.proxyHost || !items.proxyPort) {
        chrome.storage.local.set({
          proxyHost: "127.0.0.1",
          proxyPort: 8080,
          proxyType: "http",
          proxyUsername: null,
          proxyPassword: null
        });
      } else {
        setProxy(items);
      }
    }
  );
});

// 设置代理
function setProxy(items) {
  const { proxyHost, proxyPort, proxyType, proxyUsername, proxyPassword } = items;

  let proxyConfig = {
    mode: "fixed_servers",
    rules: {
      singleProxy: {
        scheme: proxyType,
        host: proxyHost,
        port: parseInt(proxyPort)
      },
      bypassList: []
    }
  };

  if (proxyUsername && proxyPassword) {
    // 如果有用户名和密码，使用认证
    proxyConfig.rules.singleProxy.username = proxyUsername;
    proxyConfig.rules.singleProxy.password = proxyPassword;
  }

  // 使用 chrome.proxy API 设置代理
  chrome.proxy.settings.set({ value: proxyConfig, scope: "regular" }, function () {
    console.log("Proxy is set to:", proxyConfig);
  });
}

// 监听代理设置变化
chrome.storage.onChanged.addListener((changes, areaName) => {
  if (areaName === "local" && changes.proxyHost || changes.proxyPort || changes.proxyType || changes.proxyUsername || changes.proxyPassword) {
    chrome.storage.local.get(
      ["proxyHost", "proxyPort", "proxyType", "proxyUsername", "proxyPassword"],
      (items) => {
        setProxy(items);
      }
    );
  }
});
