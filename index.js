// index.js
const weatherApi = "https://api.weather.gov/alerts/active?area="

// Your code here!


/**
 * Makes a GET request to the NWS alerts endpoint for the given state abbreviation.
 * On success, hands the parsed JSON off to displayAlerts.
 * On failure (network error or bad response), hands the error message off to displayError.
 * @param {string} state - two-letter state abbreviation, e.g. "NY"
 * @returns {Promise<object|void>}
 */
function fetchWeatherAlerts(state) {
  return fetch(`${weatherApi}${state}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error(
          `Could not fetch alerts for "${state}". Please check the state abbreviation and try again.`
        );
      }
      return response.json();
    })
    .then((data) => {
      displayAlerts(data);
      return data;
    })
    .catch((errorObject) => {
      displayError(errorObject.message);
    });
}

/**
 * Renders the fetched alert data into the DOM: a summary line followed by
 * a bulleted list of individual alert headlines.
 * @param {object} data - GeoJSON FeatureCollection returned by the NWS API
 */
function displayAlerts(data) {
  clearError();

  const alertsDisplay = document.getElementById("alerts-display");
  alertsDisplay.innerHTML = "";

  const features = (data && data.features) || [];

  const summary = document.createElement("p");
  summary.id = "alerts-summary";
  summary.textContent = `${data.title}: ${features.length}`;
  alertsDisplay.appendChild(summary);

  const list = document.createElement("ul");
  features.forEach((feature) => {
    const item = document.createElement("li");
    item.textContent = feature.properties.headline;
    list.appendChild(item);
  });
  alertsDisplay.appendChild(list);
}

/**
 * Displays an error message in the dedicated error div.
 * @param {string} message
 */
function displayError(message) {
  const errorDiv = document.getElementById("error-message");
  errorDiv.textContent = message;
  errorDiv.classList.remove("hidden");
}

/**
 * Hides and clears the error message div. Called before rendering a
 * fresh, successful set of alerts.
 */
function clearError() {
  const errorDiv = document.getElementById("error-message");
  errorDiv.textContent = "";
  errorDiv.classList.add("hidden");
}

/**
 * Clears the alerts display, ready for new data.
 */
function clearAlerts() {
  document.getElementById("alerts-display").innerHTML = "";
}

/**
 * Handles the "Get Weather Alerts" button click: reads the input,
 * resets the UI, clears the field, and kicks off the fetch.
 */
function handleFetchClick() {
  const input = document.getElementById("state-input");
  const state = input.value.trim().toUpperCase();

  clearAlerts();
  clearError();
  input.value = "";

  fetchWeatherAlerts(state);
}

// Wire up the button only when running in a browser (guards against
// errors when this file is required in a non-DOM test/Node context).
if (typeof document !== "undefined") {
  const button = document.getElementById("fetch-alerts");
  if (button) {
    button.addEventListener("click", handleFetchClick);
  }
}

// CommonJS export for Jest tests.
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    fetchWeatherAlerts,
    displayAlerts,
    displayError,
    clearError,
    clearAlerts,
    handleFetchClick,
  };
}