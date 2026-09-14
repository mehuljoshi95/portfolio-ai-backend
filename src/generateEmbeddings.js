const fs = require("fs");
const path = require("path");
const { GoogleGenAI } = require("@google/genai");

require("dotenv").config();

const inputPath = path.join(
    __dirname,
    "./knowledge/portfolio-chunks.json"
);

const outputPath = path.join(
    __dirname,
    "./knowledge/portfolio-embeddings.json"
);

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

const EMBEDDING_MODEL = "gemini-embedding-001";
const EMBEDDING_DIMENSION = 768;

async function generateEmbedding(text, title) {
    const response = await ai.models.embedContent({
        model: EMBEDDING_MODEL,
        contents: text,

        config: {
            taskType: "RETRIEVAL_DOCUMENT",
            title,
            outputDimensionality: EMBEDDING_DIMENSION
        }
    });

    return response.embeddings[0].values;
}

async function main() {
    if (!fs.existsSync(inputPath)) {
        console.error("Chunks file not found:");
        console.error(inputPath);
        process.exit(1);
    }

    const chunks = JSON.parse(
        fs.readFileSync(inputPath, "utf-8")
    );

    console.log(`Found ${chunks.length} chunks`);

    const embeddedChunks = [];

    for (let i = 0; i < chunks.length; i++) {
        const chunk = chunks[i];

        console.log(
            `Generating embedding ${i + 1}/${chunks.length}: ${chunk.id}`
        );

        try {
            const embedding = await generateEmbedding(
                chunk.content,
                chunk.title
            );

            embeddedChunks.push({
                id: chunk.id,
                section: chunk.section,
                title: chunk.title,
                content: chunk.content,
                metadata: chunk.metadata,
                embedding
            });

            console.log(
                `  ✓ Dimension: ${embedding.length}`
            );
        } catch (error) {
            console.error(
                `  ✗ Failed for chunk: ${chunk.id}`
            );

            console.error(error.message);

            process.exit(1);
        }
    }

    fs.writeFileSync(
        outputPath,
        JSON.stringify(embeddedChunks, null, 2),
        "utf-8"
    );

    console.log("\nEmbeddings generated successfully.");
    console.log(`Chunks: ${embeddedChunks.length}`);
    console.log(`Dimension: ${EMBEDDING_DIMENSION}`);
    console.log(`Output: ${outputPath}`);
}

main();