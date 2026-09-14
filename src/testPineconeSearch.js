const { GoogleGenAI } = require("@google/genai");
const { Pinecone } = require("@pinecone-database/pinecone");

require("dotenv").config();

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

const pinecone = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY
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
    const query =
        "What AWS technologies has Mehul worked with?";

    console.log("\nUser Query:");
    console.log(query);

    console.log("\nGenerating query embedding...");

    const queryEmbedding =
        await generateQueryEmbedding(query);

    console.log(
        `Query embedding dimension: ${queryEmbedding.length}`
    );

    const indexName =
        process.env.PINECONE_INDEX_NAME;

    const index = pinecone.index(indexName);

    console.log(
        `\nSearching Pinecone index: ${indexName}`
    );

    const searchResponse = await index.query({
        vector: queryEmbedding,
        topK: 3,
        includeMetadata: true
    });

    console.log("\nTop 3 Pinecone Results:\n");

    searchResponse.matches.forEach((match, index) => {
        console.log(
            `----- Result ${index + 1} -----`
        );

        console.log(`ID: ${match.id}`);
        console.log(
            `Score: ${match.score.toFixed(4)}`
        );

        console.log(
            `Section: ${match.metadata?.section}`
        );

        console.log(
            `Title: ${match.metadata?.title}`
        );

        console.log(
            `Content: ${match.metadata?.content}`
        );

        console.log();
    });
}

main().catch((error) => {
    console.error("\nPinecone search failed:");
    console.error(error);

    process.exit(1);
});