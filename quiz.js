const db = require('../services/db');

class Quiz {
    id;
    name;

    constructor(id) {
        this.id = id;
    }

    // Fetch quiz name from the database
    async getQuizName() {
        var sql = "SELECT * FROM Quizzes WHERE id = ?";
        const results = await db.query(sql, [this.id]);
        this.name = results[0].name;
    }

    // Fetch all questions related to this quiz
    async getQuestions() {
        var sql = "SELECT * FROM Questions WHERE quiz_id = ?";
        const results = await db.query(sql, [this.id]);
        return results;
    }
}

module.exports = { Quiz };
