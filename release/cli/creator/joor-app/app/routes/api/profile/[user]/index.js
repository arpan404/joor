export async function get(req) {
    return {
        body: [
            {
                userID: req.param,
                username: "@joor",
                email: "joor@domain.com",
            },
        ],
    };
}
//# sourceMappingURL=index.js.map