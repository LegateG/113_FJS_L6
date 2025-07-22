/**
 * Simulates fetching a user profile.
 * @param {number} userId - The ID of the user to fetch.
 * @returns {Promise<object>} A Promise that resolves with the user profile object.
 */
function fetchUserProfile(userId) {
  console.log("Fetching user profile...");
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve({ id: userId, name: "John Doe", email: "john.doe@example.com" });
    }, 1000); // 1-second delay
  });
}

/**
 * Simulates fetching posts for a user.
 * @param {number} userId - The ID of the user whose posts to fetch.
 * @returns {Promise<Array<object>>} A Promise that resolves with an array of post objects.
 */
function fetchUserPosts(userId) {
  console.log(`Fetching posts for user ${userId}...`);
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve([
        { id: 1, title: "All About Promises" },
        { id: 2, title: "How to Use Async/Await" }
      ]);
    }, 1500); // 1.5-second delay
  });
}

/**
 * Simulates fetching comments for a post.
 * @param {number} postId - The ID of the post whose comments to fetch.
 * @returns {Promise<Array<object>>} A Promise that resolves with an array of comment objects.
 */
function fetchComments(postId) {
  console.log(`Fetching comments for post ${postId}...`);
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve([
        { id: 101, text: "This is a great article!" },
        { id: 102, text: "Very informative, thank you." }
      ]);
    }, 2000); // 2-second delay
  });
}

function fetchSequentially() {
  console.log("--- Sequential Fetching Started ---");
  const startTime = Date.now();
  
  fetchUserProfile(1)
    .then(user => {
      console.log("User profile retrieved:", user);
      return fetchUserPosts(user.id);
    })
    .then(posts => {
      console.log("Posts retrieved:", posts);
      // Let's just fetch comments for the first post
      return fetchComments(posts[0].id);
    })
    .then(comments => {
      console.log("Comments retrieved:", comments);
      const endTime = Date.now();
      console.log(`Sequential fetch took ${endTime - startTime}ms.`);
      console.log("--- Sequential Fetching Finished ---\n");
    })
    .catch(error => {
      console.error("Error during sequential fetch:", error);
    });
}

// Let's call the function
// fetchSequentially();

function fetchInParallel() {
  console.log("--- Parallel Fetching Started ---");
  const startTime = Date.now();
  
  const userProfilePromise = fetchUserProfile(1);
  const userPostsPromise = fetchUserPosts(1);
  const commentsPromise = fetchComments(1); // Fetching comments for post 1 as an example

  Promise.all([userProfilePromise, userPostsPromise, commentsPromise])
    .then(([user, posts, comments]) => {
      console.log("All data retrieved in parallel!");
      console.log("User:", user);
      console.log("Posts:", posts);
      console.log("Comments:", comments);
      
      const endTime = Date.now();
      console.log(`Parallel fetch took ${endTime - startTime}ms.`);
      console.log("--- Parallel Fetching Finished ---");
    })
    .catch(error => {
      console.error("Error during parallel fetch:", error);
    });
}

// Let's call the function
// fetchInParallel();

/**
 * Simulates fetching comments, with a 50% chance of failure.
 * @param {number} postId - The ID of the post whose comments to fetch.
 * @returns {Promise<Array<object>>} A Promise that resolves with an array of comment objects.
 */
function fetchCommentsWithErrors(postId) {
  console.log(`Fetching comments for post ${postId} (may fail)...`);
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Create an error 50% of the time
      if (Math.random() > 0.5) {
        resolve([
          { id: 101, text: "This is a great article!" },
          { id: 102, text: "Very informative, thank you." }
        ]);
      } else {
        reject(new Error("Failed to fetch comments. Server error!"));
      }
    }, 2000);
  });
}

/**
 * Fetches all content for a user (profile, posts, comments) sequentially.
 * Logs each step to the console and handles errors.
 */
async function getUserContent() {
  console.log("\n--- Sequential Fetching with Async/Await Started ---");
  const startTime = Date.now();
  let combinedData = {};

  try {
    // 1. Fetch the user profile
    const user = await fetchUserProfile(1);
    console.log("✅ User profile retrieved.");
    combinedData.user = user;

    // 2. Fetch the posts
    const posts = await fetchUserPosts(user.id);
    console.log("✅ Posts retrieved.");
    combinedData.posts = posts;

    // 3. Fetch the comments (this might fail!)
    const comments = await fetchCommentsWithErrors(posts[0].id);
    console.log("✅ Comments retrieved.");
    combinedData.comments = comments;

    console.log("\n--- ALL DATA RETRIEVED SUCCESSFULLY ---");
    console.log(combinedData);

  } catch (error) {
    console.error("❌ ERROR: Something went wrong!");
    console.error(`Error Message: ${error.message}`);
    console.log("\nCurrently retrieved data:", combinedData);
  } finally {
    const endTime = Date.now();
    console.log(`\nAsync/Await operation took ${endTime - startTime}ms.`);
    console.log("--- Sequential Fetching with Async/Await Finished ---");
  }
}

// Run the main function
getUserContent();
