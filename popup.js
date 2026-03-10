const GITHUB_REPO = "Satoshi0975/law-trako-auto-click";

(async function checkLatestVersion() {
  const manifest = chrome.runtime.getManifest();
  const currentVersion = "v" + manifest.version;
  const badge = document.getElementById("ssdlc-version-badge");
  badge.textContent = currentVersion;

  try {
    const res = await fetch(
      `https://api.github.com/repos/${GITHUB_REPO}/releases/latest`,
    );
    const data = await res.json();
    const latest = data.tag_name;

    if (latest && latest !== currentVersion) {
      badge.innerHTML = `<a href="${data.html_url}" target="_blank" style="color:#f9e2af;text-decoration:none;font-size:10px;">🔔 新版本 ${latest}</a>`;

      // 顯示更新彈窗
      const modal = document.getElementById("update-modal");
      const modalTitle = document.getElementById("modal-title");
      const modalBody = document.getElementById("modal-body");
      const modalDownload = document.getElementById("modal-download");
      const modalClose = document.getElementById("modal-close");

      modalTitle.textContent = `新版本 ${latest} 可用`;
      modalBody.innerHTML = `<h3>更新內容</h3>${data.body ? data.body.replace(/\n/g, "<br>") : "請前往 GitHub 查看詳情。"}`;
      modalDownload.href = data.html_url;
      modal.classList.remove("hidden");

      modalClose.addEventListener("click", () => modal.classList.add("hidden"));
      modal.addEventListener("click", (e) => {
        if (e.target === modal) modal.classList.add("hidden");
      });
    } else {
      badge.textContent = currentVersion + " ✓";
    }
  } catch {
    // 網路失敗就顯示目前版本
  }
})();

document.getElementById("btn").addEventListener("click", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.scripting.executeScript(
      {
        target: { tabId: tabs[0].id, allFrames: true },
        func: () => {
          const labels = document.querySelectorAll("label.sg-radio-label");
          const matched = Array.from(labels).filter(
            (el) =>
              el.textContent.trim() === "符合" &&
              !el.closest(".formfield-disable"),
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
