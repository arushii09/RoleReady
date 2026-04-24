const API = "http://localhost:8000"

// update character counter live
document.getElementById("jobDescription").addEventListener("input", function() {
    document.getElementById("charCount").textContent = this.value.length
})

document.getElementById("analyzeBtn").addEventListener("click", async function() {
    const jd = document.getElementById("jobDescription").value.trim()
    
    if (!jd) {
        alert("Please paste a job description first!")
        return
    }

    this.textContent = "Analyzing..."
    this.disabled = true

    // call both endpoints
    const analysisRes = await fetch(API + "/analyze-jd", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({job_description: jd})
    })
    const analysisData = await analysisRes.json()

    const questionsRes = await fetch(API + "/generate-questions", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({job_description: jd})
    })
    const questionsData = await questionsRes.json()

    // save everything to localStorage
    localStorage.setItem("analysis", JSON.stringify(analysisData))
    localStorage.setItem("questions", JSON.stringify(questionsData))
    localStorage.setItem("jd", jd)

    // go to next page
    window.location.href = "interview.html"
})