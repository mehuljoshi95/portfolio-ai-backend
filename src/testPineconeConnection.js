const { Pinecone } = require("@pinecone-database/pinecone");

require("dotenv").config();

const pinecone = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY
});

async function main() {
    try {
        console.log("\nConnecting to Pinecone...");

        const indexName = process.env.PINECONE_INDEX_NAME;

        if (!indexName) {
            throw new Error(
                "PINECONE_INDEX_NAME is missing from .env"
            );
        }

        console.log(`Index: ${indexName}`);

        const indexDescription =
            await pinecone.describeIndex(indexName);

        console.log("\nPinecone connection successful.\n");

        console.log("Index Details:");

        console.log(
            `Name: ${indexDescription.name}`
        );

        console.log(
            `Dimension: ${indexDescription.dimension}`
        );

        console.log(
            `Metric: ${indexDescription.metric}`
        );

        console.log(
            `Status: ${indexDescription.status?.state}`
        );
    } catch (error) {
        console.error(
            "\nPinecone connection failed:"
        );

        console.error(error.message);

        process.exit(1);
    }
}

main();