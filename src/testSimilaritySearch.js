const { GoogleGenAI } = require("@google/genai");
const { similaritySearch } = require("./similaritySearch");

require("dotenv").config();

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

const EMBEDDING_MODEL = "gemini-embedding-001";
const EMBEDDING_DIMENSION = 768;

async function generateQueryEmbedding(query) {
    const response = await ai.models.embedContent({
        model: EMBEDDING_MODEL,
        contents: query,

        config: {
            taskType: "RETRIEVAL_QUERY",
            outputDimensionality: EMBEDDING_DIMENSION
        }
    });

    return response.embeddings[0].values;
}

async function main() {
    const query = "What AWS technologies has Mehul worked with?";

    console.log("\nUser Query:");
    console.log(query);

    console.log("\nGenerating query embedding...");

    const queryEmbedding = await generateQueryEmbedding(query);

    console.log(
        `Query embedding dimension: ${queryEmbedding.length}`
    );

    console.log("\nPerforming similarity search...");

    const results = similaritySearch(queryEmbedding, 26);

    console.log("\nTop 3 Results:\n");

    results.forEach((result, index) => {
        console.log(`----- Result ${index + 1} -----`);

        console.log(`ID: ${result.id}`);
        console.log(`Section: ${result.section}`);
        console.log(`Title: ${result.title}`);
        console.log(`Score: ${result.score.toFixed(4)}`);
        console.log(`Content: ${result.content}`);

        console.log();
    });
}

main().catch((error) => {
    console.error("\nSimilarity search failed:");
    console.error(error);
    process.exit(1);
});