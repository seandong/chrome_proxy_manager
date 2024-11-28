let proxyCredentials = null;

// Base64 编码用户名和密码
const encodeCredentials = (username, password) => {
  return btoa(`${username}:${password}`);
};

// 监听消息，设置代理或清除代理
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "set-proxy") {
    proxyCredentials = {
      username: message.proxyUsername,
      password: message.proxyPassword,
    };

    const config = {
      mode: "fixed_servers",
      rules: {
        singleProxy: {
          scheme: message.proxyType,
          host: message.proxyHost,
          port: parseInt(message.proxyPort, 10),
        },
      },
    };

    chrome.proxy.settings.set({ value: config, scope: "regular" }, () => {
      sendResponse({ status: "success" });
    });

    return true; // 异步响应
  }

  if (message.type === "clear-proxy") {
    chrome.proxy.settings.clear({ scope: "regular" }, () => {
      proxyCredentials = null; // 清除缓存的认证信息
      sendResponse({ status: "success" });
    });

    return true;
  }
});

// 拦截代理请求并注入认证信息
chrome.webRequest.onAuthRequired.addListener(
  (details, callback) => {
    if (proxyCredentials) {
      callback({
        authCredentials: {
          username: proxyCredentials.username,
          password: proxyCredentials.password,
        },
      });
    } else {
      callback(); // 无认证信息时不处理
    }
  },
  { urls: ["<all_urls>"] },
  ["blocking"]
);
