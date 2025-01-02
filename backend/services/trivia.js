const axios = require("axios");

const getQuestionsFromOpenTDB = async (amount = 10, category = "any", difficulty) => {
    try {
        const response = await axios.get(`https://opentdb.com/api.php?amount=${amount}&type=multiple${category !== "any" ?`&category=${category}` :''}${difficulty ? `&difficulty=${difficulty}` :''}`);
        return response.data.results.map((questionData) => ({
            question: questionData.question,
            options: [...questionData.incorrect_answers, questionData.correct_answer].sort(() => Math.random() - 0.5),
            answer: questionData.correct_answer,
            category: questionData.category,
            difficulty: questionData.difficulty,
        }));
    } catch (error) {
        console.error("Failed to fetch questions from OpenTDB:", error);
        console.log("Failed to fetch questions from OpenTDB:");
        return [];
    }
};

module.exports = { getQuestionsFromOpenTDB };
