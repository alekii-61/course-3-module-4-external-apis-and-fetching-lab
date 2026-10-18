// index.js
const weatherApi = "https://api.weather.gov/alerts/active?area=";

const stateInput = document.getElementById("state-input");
const fetchButton = document.getElementById("fetch-alerts");
const alertsContainer = document.getElementById("alerts-display");
const errorDiv = document.getElementById("error-message");

function displayAlerts(data) {
  alertsContainer.innerHTML = "";
  errorDiv.textContent = "";
  errorDiv.classList.add("hidden");
  errorDiv.style.display = "none";

  const title = data.title;
  const count = data.features.length;

  const summary = document.createElement("h2");
  summary.textContent = `${title}: ${count}`;
  alertsContainer.appendChild(summary);

  const ul = document.createElement("ul");
  data.features.forEach(f => {
    const li = document.createElement("li");
    li.textContent = f.properties.headline;
    ul.appendChild(li);
  });
  alertsContainer.appendChild(ul);

  stateInput.value = "";
}

function showError(err) {
  alertsContainer.innerHTML = "";
  errorDiv.textContent = err.message;
  errorDiv.classList.remove("hidden");
  errorDiv.style.display = "block";
}

function fetchAlerts() {
  const state = stateInput.value.trim().toUpperCase();

  if (!state) {
    showError(new Error("State code cannot be empty"));
    return;
  }

  fetch(`${weatherApi}${state}`)
    .then(res => {
      if (!res.ok) throw new Error("Failed to fetch alerts");
      return res.json();
    })
    .then(data => displayAlerts(data))
    .catch(error => showError(error));
}

fetchButton.addEventListener("click", fetchAlerts);

const form = document.querySelector("form");
if (form) {
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    fetchAlerts();
  });
}