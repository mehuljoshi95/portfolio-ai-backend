const fs = require("fs");
const path = require("path");
const { Pinecone } = require("@pinecone-database/pinecone");

require("dotenv").config();

const embeddingsPath = path.join(
    __dirname,
    "knowledge",
    "portfolio-embeddings.json"
);

const pinecone = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY
});

const indexName = process.env.PINECONE_INDEX_NAME;

async function main() {
    try {
        console.log("\nLoading embeddings...");

        if (!fs.existsSync(embeddingsPath)) {
            throw new Error(
                `Embeddings file not found: ${embeddingsPath}`
            );
        }

        const embeddings = JSON.parse(
            fs.readFileSync(embeddingsPath, "utf-8")
        );

        console.log(
            `Found ${embeddings.length} embeddings`
        );

        console.log(
            `Connecting to index: ${indexName}`
        );

        const index = pinecone.index(indexName);

        const vectors = embeddings.map((item) => ({
            id: item.id,
            values: item.embedding,
            metadata: {
                section: item.section,
                title: item.title,
                content: item.content,
                source: item.metadata?.source || "portfolio",
                type: item.metadata?.type || item.section
            }
        }));

        console.log(
            `Preparing ${vectors.length} vectors for upload...`
        );

        await index.upsert({
            records: vectors
        });

        console.log("\n✓ Embeddings uploaded successfully.");
        console.log(`Vectors uploaded: ${vectors.length}`);
    } catch (error) {
        console.error(
            "\nFailed to upload embeddings:"
        );

        console.error(error.message);

        process.exit(1);
    }
}

main();