const db = require('../services/db');

class Question {
    id;
    questionText;
    options = [];
    correctAnswer;

    constructor(id) {
        this.id = id;
    }

    // Fetch the question along with options and the correct answer
    async getQuestion() {
        var sql = "SELECT * FROM Questions WHERE id = ?";
        const results = await db.query(sql, [this.id]);
        this.questionText = results[0].question;
        this.options = [
            results[0].option_a,
            results[0].option_b,
            results[0].option_c,
            results[0].option_d
        ];
        this.correctAnswer = results[0].correct_answer; // Now fetching the correct answer
    }
}

module.exports = { Question };
