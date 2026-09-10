const fs = require("fs");
const path = require("path");
const cheerio = require("cheerio");

const inputPath = path.join(
    __dirname,
    "./knowledge/portfolio.html"
    // "../knowledge/portfolio.html"
);

const outputPath = path.join(
    __dirname,
    "./knowledge/portfolio-knowledge.json"
    // "../knowledge/portfolio-knowledge.json"
);

function cleanText(text) {
    return text
        .replace(/\s+/g, " ")
        .trim();
}

function extractSection($, selector, sectionName) {
    const element = $(selector);

    if (!element.length) {
        return null;
    }

    const text = cleanText(element.text());

    return {
        section: sectionName,
        content: text
    };
}

function main() {
    if (!fs.existsSync(inputPath)) {
        console.error("Portfolio HTML file not found:");
        console.error(inputPath);
        process.exit(1);
    }

    const html = fs.readFileSync(inputPath, "utf-8");
    const $ = cheerio.load(html);

    const knowledge = [];

    const sections = [
        {
            selector: "#about",
            name: "about"
        },
        {
            selector: "#skills",
            name: "skills"
        },
        {
            selector: "#journey",
            name: "journey"
        },
        {
            selector: "#experience",
            name: "experience"
        },
        {
            selector: "#projects",
            name: "projects"
        },
        {
            selector: ".architecture",
            name: "architecture"
        },
        {
            selector: '[aria-labelledby="ai-title"]',
            name: "ai-engineering"
        },
        {
            selector: "#contact",
            name: "contact"
        }
    ];

    for (const section of sections) {
        const result = extractSection(
            $,
            section.selector,
            section.name
        );

        if (result) {
            knowledge.push(result);
        }
    }

    fs.writeFileSync(
        outputPath,
        JSON.stringify(knowledge, null, 2),
        "utf-8"
    );

    console.log(
        `Knowledge extracted successfully: ${knowledge.length} sections`
    );

    console.log(`Output: ${outputPath}`);
}

main();