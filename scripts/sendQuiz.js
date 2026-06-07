const fs = require("fs");
const axios = require("axios");

const quizzes = JSON.parse(fs.readFileSync("quizzes.json", "utf8"));
const current = JSON.parse(fs.readFileSync("currentDay.json", "utf8"));

const quiz = quizzes.find(q => q.day === current.currentDay);

if (!quiz) {
  console.log("No quiz found");
  process.exit(0);
}

const message =
`🔔 CONNECT SRMAP QUIZ REMINDER

DAY-${quiz.day}

${quiz.question}

A) ${quiz.optionA}
B) ${quiz.optionB}
C) ${quiz.optionC}
D) ${quiz.optionD}

✅ Answer: ${quiz.answer}`;

axios.post(
  `https://graph.facebook.com/v23.0/${process.env.PHONE_NUMBER_ID}/messages`,
  {
    messaging_product: "whatsapp",
    to: process.env.RECIPIENT_PHONE,
    type: "text",
    text: {
      body: message
    }
  },
  {
    headers: {
      Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
      "Content-Type": "application/json"
    }
  }
)
.then((response) => {
  console.log("================================");
  console.log("META RESPONSE");
  console.log(JSON.stringify(response.data, null, 2));
  console.log("================================");
})
.catch((err) => {
  console.log("================================");
  console.log("META ERROR");
  console.log(JSON.stringify(err.response?.data || err.message, null, 2));
  console.log("================================");
});
