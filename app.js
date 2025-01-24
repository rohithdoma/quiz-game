require("dotenv").config();
const express = require("express");

// Initialize Express app
const app = express();
const db = require("./services/db");
const { Question } = require("./models/question");
const { Quiz } = require("./models/quiz");
const { Result } = require("./models/result");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.set("view engine", "pug");
app.set("views", "./app/views");

// Route to render the homepage
app.get("/", (req, res) => {
    res.redirect("/quizzes"); // Redirect to quizzes page
});

// Route to fetch all quizzes
app.get("/quizzes", function (req, res) {
    var sql = "SELECT * FROM quizzes";
    db.query(sql)
        .then((results) => {
            res.render("quizzes", { quizzes: results });
        })
        .catch((err) => {
            console.error("Error fetching quizzes:", err);
            res.status(500).send("Error fetching quizzes");
        });
});

// Route to display quiz and its questions
app.get("/quiz/:id", async (req, res) => {
    try {
        const quizId = req.params.id;
        const sql = "SELECT * FROM Quizzes WHERE id = ?";
        const quizzes = await db.query(sql, [quizId]);

        if (quizzes.length > 0) {
            const quiz = quizzes[0];
            const questionsSql = "SELECT * FROM Questions WHERE quiz_id = ?";
            const questions = await db.query(questionsSql, [quizId]);
            res.render("quiz", { quiz: quiz, questions: questions });
        } else {
            res.status(404).send("Quiz not found");
        }
    } catch (error) {
        console.error("Error fetching quiz by ID:", error);
        res.status(500).send("Error loading quiz");
    }
});
// Route to submit quiz answers
app.post("/quiz/:id/submit", async (req, res) => {
    try {
        const quizId = req.params.id;
        const answers = req.body;

        console.log("Received answers: ", answers); // Log the answers to debug

        // Fetch the questions for the quiz
        const sql = "SELECT * FROM Questions WHERE quiz_id = ?";
        const questions = await db.query(sql, [quizId]);

        let score = 0;

        // Loop through each question and check the answers
        questions.forEach((question) => {
            const correctAnswer = question.correct_answer;
            const userAnswer = answers[`answer_${question.id}`]; // Access the answer from the form

            // If user's answer matches the correct answer, increment score
            if (userAnswer === correctAnswer) {
                score++;
            }
        });

        // Calculate the total score out of 100
        const totalQuestions = questions.length;
        const totalScore = Math.round((score / totalQuestions) * 100);

        // Render the result page with the score
        res.render("result", { score: totalScore, total: totalQuestions });

    } catch (err) {
        console.error("Error submitting quiz:", err);
        res.status(500).send("Error submitting quiz");
    }
});


// Start the server on port 3000
app.listen(3000, () => {
    console.log("Server running at http://127.0.0.1:3000/");
});
