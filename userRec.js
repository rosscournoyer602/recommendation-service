// Step 1: Build user-product mapping
function buildUserProductMap(data) {
  let userProductMap = {};
  data.forEach(({ userId, productId }) => {
    if (!userProductMap[userId]) {
      userProductMap[userId] = new Set();
    }
    userProductMap[userId].add(productId);
  });
  return userProductMap;
}
// Step 2: Find similar users
function findSimilarUsers(targetUser, userProductMap) {
  const targetProducts = userProductMap[targetUser] || new Set();
  let similarityScores = {};
  for (let user in userProductMap) {
    if (parseInt(user) !== targetUser) {
      const commonProducts = [...userProductMap[user]].filter((p) =>
        targetProducts.has(p)
      ).length;
      if (commonProducts > 0) {
        similarityScores[user] = commonProducts;
      }
    }
  }
  return Object.keys(similarityScores)
    .map((user) => ({ userId: parseInt(user), score: similarityScores[user] }))
    .sort((a, b) => b.score - a.score);
}
// Step 3: Recommend products based on similar users
export function recommendProductsForUser(
  targetUser,
  jsonData,
  numRecommendations = 5
) {
  const userProductMap = buildUserProductMap(jsonData);
  const similarUsers = findSimilarUsers(targetUser, userProductMap);
  let recommendedProducts = new Set();
  const targetProducts = userProductMap[targetUser] || new Set();
  for (let { userId } of similarUsers) {
    for (let product of userProductMap[userId]) {
      if (!targetProducts.has(product)) {
        recommendedProducts.add(product);
        if (recommendedProducts.size >= numRecommendations) break;
      }
    }
    if (recommendedProducts.size >= numRecommendations) break;
  }
  return Array.from(recommendedProducts);
}
