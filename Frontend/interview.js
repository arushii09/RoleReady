const API = "https://roleready-api.onrender.com"
const jd = localStorage.getItem("jd")
const questionsRaw = JSON.parse(localStorage.getItem("questions"))
if (!jd || !questionsRaw) {
    window.location.href = "index.html"
}

const questions = JSON.parse(questionsRaw.questions)
let currentIndex = 0
let evaluations = []
const qText = document.getElementById("qText")
const qNumber = document.getElementById("qNumber")
const progressBar = document.getElementById("progressBar")
const progressTag = document.getElementById("progressTag")
const answerInput = document.getElementById("answerInput")
const nextBtn = document.getElementById("nextBtn")
const nextBtnLabel = document.getElementById("nextBtnLabel")

function showQuestion(index) {
  qText.textContent = questions[index]
  qNumber.textContent = "Question " + String(index + 1).padStart(2, "0")
  progressTag.textContent = "Q " + (index + 1) + " / 10"
  progressBar.style.width = ((index + 1) / 10 * 100) + "%"  
  answerInput.value = ""
  answerInput.focus()
}
showQuestion(0)

const loader = document.getElementById("loader")
loader.style.opacity = "0"
setTimeout(() => loader.style.display = "none", 400)

nextBtn.addEventListener("click", async function () {
  const answer = answerInput.value.trim()
  if (!answer) {
    alert("Please type an answer before continuing!")
    return
  }
  nextBtn.disabled = true
  nextBtnLabel.textContent = "Evaluating..."

  try {
    const evalRes = await fetch(API + "/evaluate-answer", {  
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        question: questions[currentIndex],
        answer: answer,
        role_level: "mid"
      })
    })  
    if (!evalRes.ok) throw new Error("Server error: " + evalRes.status)
    const evalData = await evalRes.json()

    evaluations.push({
      question: questions[currentIndex],
      answer: answer,
      score: evalData.score,
      feedback: evalData.feedback,  
      better_answer: evalData.better_answer
    })

    localStorage.setItem("evaluations", JSON.stringify(evaluations))
    currentIndex++

    if (currentIndex >= 10) {
      window.location.href = "results.html"
    } else {
      nextBtn.disabled = false
      nextBtnLabel.textContent = currentIndex === 9 ? "Submit Final Answer" : "Submit & Next"
      showQuestion(currentIndex)
    }

  } catch (error) {
    console.error(error)
    alert("Evaluation failed. Please try again.")
    nextBtn.disabled = false
    nextBtnLabel.textContent = "Submit & Next"
  }
})