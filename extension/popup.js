document.getElementById("extractBtn").addEventListener("click", async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  const url = tab.url;

  document.getElementById("status").textContent = "Processing...";

  try {
    const res = await fetch("http://127.0.0.1:5000/extract", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url }),
    });
    const data = await res.json();
    if (data.success) {
      document.getElementById("status").textContent = "Copied Markdown to clipboard!";
    } else {
      document.getElementById("status").textContent = data.error || "Failed.";
    }
  } catch (err) {
    document.getElementById("status").textContent = "Server not running.";
  }
});

