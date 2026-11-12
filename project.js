//api=79bf9fbb52644bb0b84fc7c4520f4631
const API_KEY = "79bf9fbb52644bb0b84fc7c4520f4631";
const API_URL = "https://newsapi.org/v2/everything";
const form = document.getElementById("formtxt");
const input = document.getElementById("inputtxt");
const newsContainer = document.getElementById("newsContainer");
const navButtons = document.querySelectorAll("#navbar button");
async function getNews(query = "tesla") {
    newsContainer.innerHTML = "<p>Loading news...</p>";
    const fromDate = new Date();
    fromDate.setDate(fromDate.getDate() - 7);
    const params = new URLSearchParams({
        q: query,
        from: fromDate.toISOString().split("T")[0],
        sortBy: "publishedAt",
        pageSize: "12",
        apiKey: API_KEY
    });
    const url = `${API_URL}?${params}`;
    const response = await fetch(url);
    const data = await response.json();
    if (!response.ok || data.status !== "ok") {
        newsContainer.textContent =
            data.message || "Unable to fetch news.";
        return;
    }
    displayNews(data.articles);
}
function displayNews(articles) {
    newsContainer.innerHTML = ""
    if (!articles || articles.length === 0) {
        newsContainer.textContent = "No news articles found.";
        return;
    }
    articles.forEach(article => {
        const card = document.createElement("div");
        card.className = "news-card";
        const img = document.createElement("img");
        img.src = article.urlToImage || "";
        img.alt = "News image";
        img.loading = "lazy";
        if (!article.urlToImage) {
            img.hidden = true;
        }
        img.onerror = () => {
            img.hidden = true;
        };
        const title = document.createElement("h3");
        title.textContent = article.title || "No title available";
        const description = document.createElement("p");
        description.textContent =
            article.description || "No description available.";
        const source = document.createElement("span");
        source.className = "source";
        source.textContent =
            article.source?.name || "Unknown source";
        const date = document.createElement("small");
        date.textContent = article.publishedAt
            ? new Date(article.publishedAt).toLocaleDateString()
            : "Date unavailable";
        const link = document.createElement("a");
        link.href = article.url || "#";
        link.textContent = "Read More →";
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        card.append(img, source, title, description, date, link);
        newsContainer.appendChild(card);
    });
}
form.addEventListener("submit", function(event) {
    event.preventDefault();
    const searchValue = input.value.trim();
    if (searchValue === "") {
        alert("Please enter a news topic!");
        return;
    }
    getNews(searchValue);
});
navButtons.forEach(button => {
    button.addEventListener("click", function() {
       const query = button.dataset.query;
        input.value = "";
        navButtons.forEach(btn => {
            btn.classList.remove("active");
        });
        button.classList.add("active");
        getNews(query);
    });
});
getNews("tesla");
