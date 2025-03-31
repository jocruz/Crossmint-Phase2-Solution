# Crossmint Coding Challenge | Full Stack Engineer

## Project Overview

This outlines my approach to solving the Crossmint Coding Challenge (Phase 2), highlighting the key steps taken, structure of the solution, and challenges encountered. The objective was to interact with a provided API to automate the retrieval, processing, and posting of data representing a "Megaverse" map.

## Technical Approach

Initially, the API (`api/map`) returned complex data structured as nested arrays. Rather than hard-coding this data, I automated its retrieval by creating dedicated modules, ensuring dynamic interaction and efficient handling of API responses.

I encountered issues with API request limitations, particularly rate-limiting errors (HTTP 429). To address this, I utilized the `axios-retry` library, implementing a robust retry mechanism with appropriate delays to ensure successful data posting.

## Project Structure

### `config.js`
- Centralized configuration file, including API base URL, candidate ID, and Axios retry configurations. Simplifies adjustments and ensures maintainability.

### `mapFetcher.js`
- Dedicated module to fetch dynamic map data from the API. Avoids static data hardcoding, enhancing flexibility and scalability.

### `dataOrganizer.js`
- Processes map data to categorize and organize entities (Polyanets, Soloons, Comeths) by their positions on the map. Exports structured arrays containing entity data for further processing.

### `api.js`
- Handles interactions with the API endpoints, encapsulating Axios requests. Includes detailed logging for debugging and verification purposes.

## Detailed Implementation

### API Interaction (`api.js`)
- The `postEntity` function dynamically constructs API URLs based on entity type (`polyanets`, `soloons`, `cometh`) and payload data.
- Implements thorough logging of successful posts and detailed error handling, providing clear and immediate feedback on API interactions.

### Main Application (`main.js`)
- Integrates all components into a coherent application flow, handling entity-specific logic for posting data.
- Uses string manipulation techniques (such as `.split()` and `.toLowerCase()`) to correctly format entity attributes (e.g., colors, directions) according to API requirements.

## Challenge Encountered: API Rate Limiting

While implementing the solution, I frequently encountered HTTP 429 "Too Many Requests" errors from the API. The server response lacked retry headers, complicating the implementation of retry logic.

### Solution: Utilizing `axios-retry`
- Configured `axios-retry` to handle rate-limiting gracefully, with custom retry logic to pause for 3 seconds upon encountering a 429 status code.
- Implemented exponential backoff as a fallback mechanism for other potential request failures, enhancing overall reliability.

#### Axios-Retry Configuration

```javascript
axiosRetry(axios, {
  retries: 3,
  retryDelay: (retryCount, error) => {
    if (error.response && error.response.status === 429) {
      return 3000; // Wait 3 seconds for rate-limit errors
    }
    return axiosRetry.exponentialDelay(retryCount); // Exponential backoff for other errors
  },
  retryCondition: (error) => {
    return axiosRetry.isNetworkOrIdempotentRequestError(error) || error.response.status === 429;
  },
});
```

## Conclusion

By systematically addressing the rate-limit challenges and carefully structuring the solution, I successfully automated the completion of the Megaverse map with the Crossmint logo. This challenge provided valuable experience in managing API interactions, error handling, and designing robust retry mechanisms.

Thank you for the opportunity to undertake this challenge. I look forward to discussing my solution further and answering any questions.

