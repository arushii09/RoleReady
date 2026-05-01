const API = "https://roleready-api.onrender.com"

// update character counter as user types
document.getElementById("jobDescription").addEventListener("input", function () {
  document.getElementById("charCount").textContent = this.value.length
})

// when user clicks the button
document.getElementById("analyzeBtn").addEventListener("click", async function () {
  const jd = document.getElementById("jobDescription").value.trim()

  // don't proceed if empty
  if (!jd) {
    alert("Please paste a job description first!")
    return
  }

  // show loading state
  this.disabled = true
  this.querySelector(".btn-label").textContent = "Analyzing..."

try{
    const analysisRes = await fetch(API + "/analyze-jd",{
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ job_description: jd })
    })
    if(!analysisRes.ok) throw new Error("Server error: " + analysisRes.status)
    const analysisData = await analysisRes.json()
       
    const questionsRes = await fetch(API + "/generate-questions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ job_description: jd })
    })
    if (!questionsRes.ok) throw new Error("Server error: " + questionsRes.status)
    const questionsData = await questionsRes.json()
    
  

  // save everything to localStorage so other pages can read it
  localStorage.setItem("analysis", JSON.stringify (analysisData))
  localStorage.setItem("questions", JSON.stringify(questionsData))
  localStorage.setItem("jd", jd)
  localStorage.setItem("evaluations", JSON.stringify([]))  // start with empty list

  // go to interview page
  window.location.href = "interview.html"
} catch (error) {
  console.error(error)
  alert("Something went wrong. Make sure the backend is running.")
   
  this.disabled = false
  this.querySelector(".btn-label").textContent = "Analyze & Start Interview"
}})