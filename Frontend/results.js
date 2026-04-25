const API = "http://localhost:8000"
const evaluations = JSON.parse(localStorage.getItem("evaluations"))
const jd = localStorage.getItem("jd")

async function loadReport() {
  try {  
    const reportRes = await fetch(API + "/generate-report", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ evaluations: evaluations, job_description: jd })
    })
    if (!reportRes.ok) throw new Error("Server error: " + reportRes.status)
    const report = await reportRes.json()

    document.getElementById("overallScore").textContent = report.overall_score
    const score = report.overall_score
    let verdict = ""
    if (score >= 8) verdict = "Strong candidate — well prepared."
    else if (score >= 6) verdict = "Decent showing — a few gaps to address."
    else if (score >= 4) verdict = "Needs more prep before the interview."
    else verdict = "Significant preparation required."
    document.getElementById("scoreVerdict").textContent = verdict

    const strengthsList = document.getElementById("strengthsList")
    report.strengths.forEach(item => {
      const li = document.createElement("li")
      li.textContent = item
      strengthsList.appendChild(li)
    })

    const weakAreasList = document.getElementById("weakAreasList")
    report.weak_areas.forEach(item => {
      const li = document.createElement("li")
      li.textContent = item
      weakAreasList.appendChild(li)
    })

    const studyPlanList = document.getElementById("studyPlanList")
    report.study_plan.forEach(item => {  
      const li = document.createElement("li")
      li.textContent = item
      studyPlanList.appendChild(li)
    })

    const qaList = document.getElementById("qaList")
    evaluations.forEach((item, index) => {
      const div = document.createElement("div")
      div.className = "qa-item"
      div.innerHTML = `
        <div class="qa-item-header">
          <span class="qa-q-num">Question ${String(index + 1).padStart(2, "0")}</span>
          <span class="qa-score">${item.score}/10</span>
        </div>
        <div class="qa-question">${item.question}</div>
        <div class="qa-feedback">${item.feedback}</div>
        <div class="qa-better"><strong>Better answer:</strong> ${item.better_answer}</div>
      `
      qaList.appendChild(div)
    })

  } catch (error) {
    console.error(error)
    document.getElementById("overallScore").textContent = "!"
    document.getElementById("scoreVerdict").textContent = "Failed to load report. Please try again."
  }
}

loadReport()