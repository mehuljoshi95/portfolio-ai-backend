const { GoogleGenAI } = require("@google/genai");
const { Pinecone } = require("@pinecone-database/pinecone");

const { buildContext } = require("./utils/contextBuilder");
const { buildRagPrompt } = require("./utils/ragPrompt");

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

    // --------------------------------------------------
    // STEP 1: Generate query embedding
    // --------------------------------------------------

    console.log("\nGenerating query embedding...");

    const queryEmbedding =
        await generateQueryEmbedding(query);

    // --------------------------------------------------
    // STEP 2: Search Pinecone
    // --------------------------------------------------

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

    // --------------------------------------------------
    // STEP 3: Build context
    // --------------------------------------------------

    const context =
        buildContext(searchResponse.matches);

    // --------------------------------------------------
    // STEP 4: Build RAG prompt
    // --------------------------------------------------

    const prompt =
        buildRagPrompt(query, context);

    console.log("\n==============================");
    console.log("RAG PROMPT");
    console.log("==============================\n");

    console.log(prompt);

    // --------------------------------------------------
    // STEP 5: Generate answer
    // --------------------------------------------------

    console.log("\nGenerating answer with Gemini...");

    const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt
    });

    console.log("\n==============================");
    console.log("FINAL ANSWER");
    console.log("==============================\n");

    console.log(response.text);
}

main().catch((error) => {
    console.error("\nRAG test failed:");
    console.error(error);

    process.exit(1);
});