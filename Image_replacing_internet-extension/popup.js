const input = document.getElementById("thing");
const button = document.getElementById("save");

// Load previously saved value
chrome.storage.sync.get(["thing"], data => {
  if (data.thing) {
    input.value = data.thing;
  }
});

// Save new value and reload the current tab
button.addEventListener("click", () => {
  const value = input.value.trim();
  if (!value) return;

  chrome.storage.sync.set({ thing: value }, () => {
    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
      chrome.tabs.reload(tabs[0].id);
    });
  });
});
