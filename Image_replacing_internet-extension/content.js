const PEXELS_API_KEY = "bm8Q8jPgaq7CiJxFkyHSq53KXSlEkEcOg8sP6eyqqpDxjzUOemcDxGz5";


async function getPexelsImage(query) {
    try {
        const response = await fetch(
            `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=15`,
            {
                headers: {
                    Authorization: PEXELS_API_KEY
                }
            }
        );

        const data = await response.json();

        if (!data.photos || data.photos.length === 0) {
            return null;
        }

        const randomPhoto =
            data.photos[Math.floor(Math.random() * data.photos.length)];

        return randomPhoto.src.medium;
    }   catch (err) {
        console.error("Pexels API error:", err);
        return null;
    }
}
let cachedURL = null;
async function replaceImages(thing) {
    if (!cachedURL) {
        cachedURL = await getPexelsImage(thing);
    }
    if (!cachedURL) return;

    document.querySelectorAll("img").forEach(img =>{
        if (img.dataset.replaced) return;
        if (img.width < 60 || img.height < 50) return;

        img.dataset.replaced = "true";
        img.src = cachedURL;
        img.srcset= "";
    });
}
chrome.storage.sync.get(["thing"], data => {
    const thing = data.thing || "cat";
    replaceImages(thing);

    const observer = new MutationObserver(() => replaceImages(thing));
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
});