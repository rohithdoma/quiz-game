const db = require('../services/db');

class Result {
    quizId;
    score;

    constructor(quizId, score) {
        this.quizId = quizId;
        this.score = score;
    }

    // Method to save the result into the database
    async saveResult() {
        const sql = "INSERT INTO Results (quiz_id, score) VALUES (?, ?)";
        await db.query(sql, [this.quizId, this.score]);
    }

    // Method to fetch the result for a specific quiz (optional)
    static async getResultByQuizId(quizId) {
        const sql = "SELECT * FROM Results WHERE quiz_id = ?";
        const results = await db.query(sql, [quizId]);
        return results;
    }
}

module.exports = { Result };
