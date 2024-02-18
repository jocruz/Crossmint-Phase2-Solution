# README for Crossmint || Coding Challenge || Full Stack engineer

Hello CrossMint Engineers Challenge Reviewer(s)! My name is John, and here is my solution for challenge 2. Hopefully we get a chance to talk so I can ask some questions regarding a part of the challenge that kinda had my head scratching. without further ado:

This is the breakdown for my solution for phase 2. Phase 1 I called the api/map to get the map but I saved that into the solution. For this challenge I realized It was an object that had an array filled with other arrays. I noticed the object and realized it was best not to copy the object and hard code it.

Moving forward I made a call to the api/map and made sure to place it in its own file which exports a single function named getMap.

I ran into some trouble with the API calls to get the Cometh,Polyantes, and Soloons where it seemed to time out after making 10-11 calls. I thought perhaps I had something wrong in my solution and decided to use axios-retry to wait 5 seconds, I then experimented with it and found 3 seconds was good enough to complete the solution. I had originally everything in a single file, but broke it up into several parts as the email said to organize everything.

## Project Structure

### `config.js`

Centralizes configuration settings for the project, including the API's base URL, candidate ID, and Axios retry logic. Similar to a .env file, if something is wrong regarding credentials it's an easy find.

### `mapFetcher.js`

Responsible for fetching map data from the API. Instead of copying the entire object from the API and hard coding it locally, this makes the call applying to the automation part of the challenge.

### `dataOrganizer.js`

Similar to phase 1, what we want to do is iterate through the 2d array, finding our Polyanets, Soloons, and Comeths. 
I created 3 empty arrays for each web 3 space object, and when found I push the object into the array storing the space object, the row index in which it was found and the column index. The row index would be the index of the inner array, the column index is the index of the outter array. A little tricky, but when you see the object in its entirely it matches up with the megaverse map we see on the challenge site. 
What we export from this file are the arrays themselves since they will have the data we will send to the API's for posting.

### `api.js`

This function is  for interacting with the API's in the given documentation, allowing us to send data efficiently and handle responses or errors gracefully.

## Implementation Details

The postEntity function is designed to simplify the API interaction process. Here's how it works:

-Parameters: 
    It takes two parameters: entity and payload. entity refers to the specific endpoint we're targeting aka our web 3 space objects('polyanets', 'soloons', 'cometh'), and payload is the data we're sending which is the data in our arrays we constructed earlier.

-URL Construction:
    It constructs the request URL dynamically based on the baseUrl and the entity parameter, so if we get an error here we just look in our .config file

Posting Data: Utilizing Axios, it sends a POST request to the constructed URL.

-Success and Error Handling: 
    Upon a successful post, it logs the entity and payload to the console admittingly, yes our console will be cluttered, but in my experience building web3 projects it aint all that bad especially if you want to have a log on what is being sent to the API locally, being no stranger to errors anything information is useful, this provides us back with  immediate feedback about the operations we are running. If an error occurs, it logs a detailed error message, including the error response from the server if available.

### `main.js`

This is where everything comes together. Serves as the entry point to the application, orchestrating the overall process. We make an individual function for each web 3 space object and call the API's pushing whatever is that was filled with the respective array. Other tricky situation is just getting that first part of either the color or direction, so using object.value.split("_")[0].toLowerCase() is what did the trick here, since the format is the same for Cometh and Soloon, we can extract that first part and use it in our API call. Again reading the documentation provided to us we see it says :
    - Additionally you should provide a 'color' argument which can be "blue", "red", "purple" or "white"
    - Additionally you should provide a 'direction' argument which can be "up", "down", "right" or "left"

Take note of that lowercase, the object we get back from our mapFetcher.js we get everything in upper-case format so we gotta use toLowerCase().

## Issue Encountered: Too Many Requests

During the development process of this challenge, an issue was encountered when posting data to the API endpoints for polyantes, soloons, and cometh. I was getting an error when posting to different API's. At first I thought perhaps I had something missing or was utilizing the calls wrong but some of my web 3 space objects were posting. I tested this out with Comeths, and noticed it posted some of them and for the other they got skipped due to an error. After utilizing axios-retry I noticed after about every 10-11 posts, the API would respond with a "Too Many Requests" error, causing the process to time out. The error details were as follows, simplified for clarity:

- **Error Code**: `ERR_BAD_REQUEST`
- **Status**: 429 (Too Many Requests)
- **Response**: Indicates the server is rejecting requests due to too many requests being sent in a short amount of time.
- **Note**: No retry header was included in the response, it was a big error and I know sometimes in the error response it tells us how long to wait until we make another call, I couldn't find the header making it difficult to implement a straightforward retry logic based on the API's instructions.

## Solution: Managing API Rate Limits with `axios-retry`

To mitigate the issue of receiving "Too Many Requests" responses from the API, the `axios-retry` library was utilized. This library enhances Axios by introducing automatic retry functionality for failed requests under certain conditions, such as rate limit errors or network issues. I do not know if this is something the challenge accepts but decided to use it for the solution.

### Implementation of `axios-retry`

The `axios-retry` library was configured with specific parameters to address our needs effectively. Below is the configuration used:

```javascript
axiosRetry(axios, {
  retries: 3, // Number of retry attempts
  retryDelay: (retryCount, error) => {
    // Retry delay logic
    if (error.response && error.response.status === 429) {
      // If the error is due to rate limiting (HTTP 429), wait for 3 seconds
      return 3000;
    }
    // For other retryable errors, use an exponential backoff delay
    return axiosRetry.exponentialDelay(retryCount);
  },
  retryCondition: (error) => {
    // Conditions for retrying a request
    return axiosRetry.isNetworkOrIdempotentRequestError(error) || error.response.status === 429;
  },
});
```


###Key Points of the `axios-retry` Configuration

- **Retries**: The library is set to retry failed requests up to 3 times, although this number is arbitrary one can set it to whatever they want, just used this number since usually third time is a charm. This gives errors or temporary rate limit issues a chance to resolve before the request is considered truly failed.

- **Retry Delay**: A custom function is used to determine the delay before retrying a failed request. For rate limit errors (HTTP status 429 which is what I was getting in the error in its full message), it waits for a fixed delay of 3 seconds (again as above this is the number of seconds needed, if its shorter than 3 seconds it fails and shoots the 429 at us). For other retryable errors, it employs an exponential backoff strategy, increasing the delay with each retry attempt. This approach helps in efficiently managing the retry attempts while respecting the API's rate limits.
- **Retry Condition**: The retry logic is triggered not just for network errors or idempotent request errors, but also explicitly for HTTP 429 responses. This ensures that the retry mechanism is activated specifically for rate limit issues, in addition to the general retryable errors.

- **exponentialDelay**: This was if we get anything else that is not a 429 error, I wanted to include this on here because I noticed that 3 seconds had to pass before it worked on posting again however in the event that 3 seconds was not enough due to another error we use axios-retry exponentialDelay function. All that is, is a way to wait longer before trying again each time something goes wrong. Imagine you're playing a video game and you fail a level. The first time you fail, you wait 1 minute before you can try again. If you fail again, you wait 2 minutes, then 4 minutes, and so on. Realistically speaking no one is going to wait a whole minute+ but something cool that is included in the axios retry.

By integrating `axios-retry` with the above configuration, the overall strategy significantly improves the reliability of API interactions, ensuring that temporary issues do not immediately halt the data fetching and posting processes.

## Conclusion - After Thoughts

The use of `axios-retry` has proven to be an effective solution for managing API rate limits and ensuring the smooth execution of the challenge. By addressing the "Too Many Requests" issue with a thoughtful approach to retry logic we got our Megaverse map to complete with the Crossmint logo. 

This was a fun challenge to do, I thought I had it figured out since it was very similar to the first challenge but the curve ball of the 429 error is what got me, the different directions and color, and making sure I wasn't over doing it with the API calls. I kept trying to see where my web 3 space objects landed on the map and the page was slow to reload so I was worried I might have over done it :D

Thank you for the chance to do a challenge I hope we can move forward with future steps.
