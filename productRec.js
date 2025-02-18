export function recommendSimilarProducts(
  targetProductId,
  jsonData,
  numRecommendations = 5
) {
  // console.log('JSON DATA', jsonData);
  let userProductMap = {};
  let productCount = {};
  // Step 1: Build a user-to-products map
  jsonData.forEach(({ userId, productId }) => {
    if (!userProductMap[userId]) {
      userProductMap[userId] = new Set();
    }
    userProductMap[userId].add(productId);
  });
  // Step 2: Find users who purchased the target product
  let usersWhoBoughtTarget = new Set();
  for (let user in userProductMap) {
    if (userProductMap[user].has(targetProductId)) {
      usersWhoBoughtTarget.add(parseInt(user));
    }
  }
  // Step 3: Count occurrences of other products purchased by those users
  usersWhoBoughtTarget.forEach((userId) => {
    userProductMap[userId].forEach((productId) => {
      if (productId !== targetProductId) {
        // Exclude the target product itself
        productCount[productId] = (productCount[productId] || 0) + 1;
      }
    });
  });
  // Step 4: Sort products by frequency and return top recommendations
  let recommendedProducts = Object.entries(productCount)
    .sort((a, b) => b[1] - a[1]) // Sort descending by count
    .map(([productId]) => parseInt(productId)) // Extract productId
    .slice(0, numRecommendations); // Get top N recommendations
  return recommendedProducts;
}
// Example usage:
// const targetProduct = 10;
// const similarProducts = recommendSimilarProducts(targetProduct, jsonData, 3);
// console.log(`Products similar to ${targetProduct}:`, similarProducts);
