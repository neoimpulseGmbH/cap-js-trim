module.exports = {
    branches: ["main", { name: "next", prerelease: true }],
    plugins: [
        [
            "@semantic-release/commit-analyzer",
            {
                preset: "default",
                releaseRules: [
                    { type: "feat", release: "minor" },
                    { type: "fix", release: "patch" },
                    { type: "docs", release: false },
                    { type: "style", release: false },
                    { type: "refactor", release: false },
                    { type: "perf", release: "patch" },
                    { type: "test", release: false }
                ]
            }
        ],
        "@semantic-release/release-notes-generator",
        "@semantic-release/npm",
        "@semantic-release/github"
    ]
};
