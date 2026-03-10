document.getElementById("btn").addEventListener("click", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.scripting.executeScript(
      {
        target: { tabId: tabs[0].id, allFrames: true },
        func: () => {
          const labels = document.querySelectorAll("label.sg-radio-label");
          const matched = Array.from(labels).filter(
            (el) => el.textContent.trim() === "符合",
          );
          matched.forEach((el) => el.click());
          return matched.length;
        },
      },
      (results) => {
        const total = results.reduce((sum, r) => sum + (r.result || 0), 0);
        const badge = document.getElementById("badge");
        const result = document.getElementById("result");

        badge.textContent = total;
        badge.classList.remove("hidden");

        if (total > 0) {
          result.className = "status success";
          result.innerHTML = `<span class="dot"></span><span>已成功點擊 ${total} 個元素</span>`;
        } else {
          result.className = "status error";
          result.innerHTML = `<span class="dot"></span><span>找不到任何符合元素</span>`;
        }
      },
    );
  });
});
