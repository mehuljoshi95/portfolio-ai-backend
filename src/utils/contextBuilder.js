function buildContext(results) {
    if (!results || results.length === 0) {
        return "No relevant portfolio information was found.";
    }

    return results
        .map((result, index) => {
            return [
                `[Context ${index + 1}]`,
                `Section: ${result.metadata?.section || ""}`,
                `Title: ${result.metadata?.title || ""}`,
                `Content: ${result.metadata?.content || ""}`
            ].join("\n");
        })
        .join("\n\n");
}

module.exports = {
    buildContext
};