const { GoogleGenAI } = require("@google/genai");
const { Pinecone } = require("@pinecone-database/pinecone");

const { buildContext } = require("./utils/contextBuilder");

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

    const indexName =
        process.env.PINECONE_INDEX_NAME;

    const index = pinecone.index(indexName);

    console.log("\nSearching Pinecone...");

    const searchResponse = await index.query({
        vector: queryEmbedding,
        topK: 3,
        includeMetadata: true
    });

    console.log(
        `Retrieved ${searchResponse.matches.length} chunks`
    );

    const context =
        buildContext(searchResponse.matches);

    console.log("\n==============================");
    console.log("RETRIEVED CONTEXT");
    console.log("==============================\n");

    console.log(context);

    console.log("\n==============================");
}

main().catch((error) => {
    console.error("\nContext builder test failed:");
    console.error(error);

    process.exit(1);
});