const fs = require("fs");
const path = require("path");

const embeddingsPath = path.join(
  __dirname,
  "knowledge",
  "portfolio-embeddings.json"
);

function cosineSimilarity(vectorA, vectorB) {
  if (vectorA.length !== vectorB.length) {
    throw new Error("Vectors must have the same dimensions");
  }

  let dotProduct = 0;
  let magnitudeA = 0;
  let magnitudeB = 0;

  for (let i = 0; i < vectorA.length; i++) {
    dotProduct += vectorA[i] * vectorB[i];

    magnitudeA += vectorA[i] * vectorA[i];
    magnitudeB += vectorB[i] * vectorB[i];
  }

  magnitudeA = Math.sqrt(magnitudeA);
  magnitudeB = Math.sqrt(magnitudeB);

  if (magnitudeA === 0 || magnitudeB === 0) {
    return 0;
  }

  return dotProduct / (magnitudeA * magnitudeB);
}

function loadEmbeddings() {
  const fileContent = fs.readFileSync(embeddingsPath, "utf-8");

  return JSON.parse(fileContent);
}

function similaritySearch(queryEmbedding, topK = 3) {
  const embeddings = loadEmbeddings();

  const results = embeddings.map((item) => {
    const score = cosineSimilarity(
      queryEmbedding,
      item.embedding
    );

    return {
      id: item.id,
      section: item.section,
      title: item.title,
      content: item.content,
      metadata: item.metadata,
      score,
    };
  });

  results.sort((a, b) => b.score - a.score);

  return results.slice(0, topK);
}

module.exports = {
  cosineSimilarity,
  similaritySearch,
};