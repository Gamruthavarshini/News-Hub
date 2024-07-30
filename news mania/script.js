const API_KEY = "a97826ae6f30499daee55e6093564fe7"; 
const url = "https://newsapi.org/v2/everything?q=";

window.addEventListener("load", () => fetchNews("general"));

function reload() {
    window.location.reload();
}

function getDateRange(days) {
    const to = new Date();
    const from = new Date();
    from.setDate(from.getDate() - days);
    return { from: from.toISOString().split('T')[0], to: to.toISOString().split('T')[0] };
}

async function fetchNews(query) {
    const { from, to } = getDateRange(7); // Adjust the number of days as needed
    try {
        const res = await fetch(`${url}${query}&from=${from}&to=${to}&pageSize=50&apiKey=${API_KEY}`);
        if (!res.ok) {
            throw new Error("Network response was not ok" + res.statusText);
        }
        const data = await res.json();
        if (data.status !== "ok") {
            throw new Error("Error fetching news: " + data.message);
        }
        bindData(data.articles);
    } catch (error) {
        console.error("Fetching news failed:", error);
        alert("Fetching news failed, please try again later.");
    }
}

function bindData(articles) {
    const cardsContainer = document.getElementById("cards-container");
    const newsCardTemplate = document.getElementById("template-news-card");

    cardsContainer.innerHTML = "";

    articles.forEach((article) => {
        if (!article.urlToImage) return;
        const cardClone = newsCardTemplate.content.cloneNode(true);
        fillDataInCard(cardClone, article);
        cardsContainer.appendChild(cardClone);
    });
}

function fillDataInCard(cardClone, article) {
    const newsImg = cardClone.querySelector("#news-img");
    const newsTitle = cardClone.querySelector("#news-title");
    const newsSource = cardClone.querySelector("#news-source");
    const newsDesc = cardClone.querySelector("#news-desc");

    newsImg.src = article.urlToImage;
    newsTitle.innerHTML = article.title;
    newsDesc.innerHTML = article.description;

    const date = new Date(article.publishedAt).toLocaleString("en-US", {
        timeZone: "Asia/Jakarta",
    });

    newsSource.innerHTML = `${article.source.name} · ${date}`;

    cardClone.firstElementChild.addEventListener("click", () => {
        window.open(article.url, "_blank");
    });
}

let curSelectedNav = null;
function onNavItemClick(id) {
    fetchNews(id);
    const navItem = document.getElementById(id);
    curSelectedNav?.classList.remove("active");
    curSelectedNav = navItem;
    curSelectedNav.classList.add("active");
}

const searchButton = document.getElementById("search-button");
const searchText = document.getElementById("search-text");

searchButton.addEventListener("click", () => {
    const query = searchText.value;
    if (!query) return;
    fetchNews(query);
    curSelectedNav?.classList.remove("active");
    curSelectedNav = null;
});
