/**
 * Quiz and Assessment Module
 * Handles interactive quizzes and knowledge checks
 */

class QuizController {
  constructor() {
    this.quizzes = {};
    this.scores = {};
    
    this.init();
  }
  
  init() {
    this.defineQuizzes();
    this.attachEventListeners();
  }
  
  defineQuizzes() {
    // PHI Identification Quiz
    this.quizzes.phiIdentification = {
      question: "Which of the following are considered PHI (Protected Health Information)?",
      type: "multiple",
      options: [
        { id: "name", text: "Patient's full name", correct: true },
        { id: "color", text: "Favorite color", correct: false },
        { id: "bp", text: "Blood pressure reading", correct: true },
        { id: "movie", text: "Favorite movie", correct: false },
        { id: "email", text: "Email address (when linked to health data)", correct: true },
        { id: "city", text: "City of residence (population > 20,000)", correct: false }
      ]
    };
    
    // Best Practices Quiz9
    this.quizzes.bestPractices = {
      question: "What is the BEST practice for storing patient health records?",
      type: "single",
      options: [
        { id: "a", text: "Encrypt PHI at rest and in transit with AES-256", correct: true },
        { id: "b", text: "Store PHI in plain text if inside a VPC", correct: false },
        { id: "c", text: "Share PHI with any analytics vendor", correct: false },
        { id: "d", text: "Encryption is optional if you have good access controls", correct: false }
      ]
    };
    
    // BAA Quiz
    this.quizzes.baaRequired = {
      question: "Which scenarios require a Business Associate Agreement (BAA)?",
      type: "multiple",
      options: [
        { id: "aws", text: "Using AWS S3 to store patient X-rays", correct: true },
        { id: "zoom", text: "Using Zoom for telehealth appointments", correct: true },
        { id: "internal", text: "Internal employee accessing own company's patient database", correct: false },
        { id: "analytics", text: "Third-party analytics processing de-identified data", correct: false },
        { id: "billing", text: "Outsourced medical billing service", correct: true }
      ]
    };
    
    // Access Control Quiz
    this.quizzes.accessControl = {
      question: "A nurse wants to view all patient records in the hospital. What should the system do?",
      type: "single",
      options: [
        { id: "allow", text: "Allow access - nurses need patient information", correct: false },
        { id: "deny", text: "Deny access - nurses should only see assigned patients (Minimum Necessary)", correct: true },
        { id: "log", text: "Allow but log the access for later review", correct: false },
        { id: "ask", text: "Ask for supervisor approval each time", correct: false }
      ]
    };
    
    // Incident Response Quiz
    this.quizzes.incidentResponse = {
      question: "You discover unauthorized access to 600 patient records. What must you do?",
      type: "single",
      options: [
        { id: "wait", text: "Wait to see if any harm occurs before notifying", correct: false },
        { id: "notify", text: "Notify affected individuals within 60 days and report to HHS", correct: true },
        { id: "fix", text: "Fix the vulnerability and move on", correct: false },
        { id: "internal", text: "Only inform internal management", correct: false }
      ]
    };
  }
  
  attachEventListeners() {
    // Listen for slide changes
    window.addEventListener('slideChange', (event) => {
      this.initQuizzesOnSlide(event.detail.slide);
    });
    
    // Initialize for current slide
    setTimeout(() => {
      const activeSlide = document.querySelector('.slide.active');
      if (activeSlide) {
        this.initQuizzesOnSlide(activeSlide);
      }
    }, 100);
  }
  
  initQuizzesOnSlide(slide) {
    if (!slide) return;
    
    // PHI Identification Quiz
    const phiQuizContainer = slide.querySelector('#phiQuiz');
    if (phiQuizContainer && !phiQuizContainer.dataset.initialized) {
      this.renderQuiz(phiQuizContainer, this.quizzes.phiIdentification, 'phiIdentification');
      phiQuizContainer.dataset.initialized = 'true';
    }
    
    // Best Practices Quiz
    const bestPracticesContainer = slide.querySelector('#bestPracticesQuiz');
    if (bestPracticesContainer && !bestPracticesContainer.dataset.initialized) {
      this.renderQuiz(bestPracticesContainer, this.quizzes.bestPractices, 'bestPractices');
      bestPracticesContainer.dataset.initialized = 'true';
    }
    
    // BAA Quiz
    const baaContainer = slide.querySelector('#baaQuiz');
    if (baaContainer && !baaContainer.dataset.initialized) {
      this.renderQuiz(baaContainer, this.quizzes.baaRequired, 'baaRequired');
      baaContainer.dataset.initialized = 'true';
    }
    
    // Access Control Quiz
    const accessContainer = slide.querySelector('#accessControlQuiz');
    if (accessContainer && !accessContainer.dataset.initialized) {
      this.renderQuiz(accessContainer, this.quizzes.accessControl, 'accessControl');
      accessContainer.dataset.initialized = 'true';
    }
    
    // Incident Response Quiz
    const incidentContainer = slide.querySelector('#incidentResponseQuiz');
    if (incidentContainer && !incidentContainer.dataset.initialized) {
      this.renderQuiz(incidentContainer, this.quizzes.incidentResponse, 'incidentResponse');
      incidentContainer.dataset.initialized = 'true';
    }
    
    // Final Assessment
    const finalAssessment = slide.querySelector('#finalAssessment');
    if (finalAssessment && !finalAssessment.dataset.initialized) {
      this.renderFinalAssessment(finalAssessment);
      finalAssessment.dataset.initialized = 'true';
    }
  }
  
  renderQuiz(container, quiz, quizId) {
    let optionsHTML = '';
    
    if (quiz.type === 'multiple') {
      optionsHTML = quiz.options.map(opt => `
        <div class="quiz-option">
          <label>
            <input type="checkbox" name="${quizId}" value="${opt.id}" data-correct="${opt.correct}">
            <span>${opt.text}</span>
          </label>
        </div>
      `).join('');
    } else {
      optionsHTML = quiz.options.map(opt => `
        <div class="quiz-option">
          <label>
            <input type="radio" name="${quizId}" value="${opt.id}" data-correct="${opt.correct}">
            <span>${opt.text}</span>
          </label>
        </div>
      `).join('');
    }
    
    const html = `
      <div class="quiz-container">
        <h3 class="quiz-question">${quiz.question}</h3>
        <div class="quiz-options" id="${quizId}-options">
          ${optionsHTML}
        </div>
        <button class="btn-primary" onclick="window.quizController.checkAnswer('${quizId}')">
          Check Answer
        </button>
        <div class="quiz-result" id="${quizId}-result"></div>
      </div>
    `;
    
    container.innerHTML = html;
  }
  
  checkAnswer(quizId) {
    const quiz = this.quizzes[quizId];
    if (!quiz) return;
    
    const optionsContainer = document.getElementById(`${quizId}-options`);
    const resultContainer = document.getElementById(`${quizId}-result`);
    
    if (!optionsContainer || !resultContainer) return;
    
    const inputs = optionsContainer.querySelectorAll('input');
    const selected = Array.from(inputs).filter(input => input.checked);
    
    if (selected.length === 0) {
      resultContainer.innerHTML = '<p style="color: var(--warning);">⚠️ Please select at least one option.</p>';
      return;
    }
    
    let correct = 0;
    let incorrect = 0;
    const correctAnswers = quiz.options.filter(opt => opt.correct).map(opt => opt.id);
    
    // Check each selected answer
    selected.forEach(input => {
      const isCorrect = input.dataset.correct === 'true';
      if (isCorrect) {
        correct++;
        input.parentElement.parentElement.style.backgroundColor = 'var(--brand-lighter)';
        input.parentElement.parentElement.style.borderLeft = '4px solid var(--success)';
      } else {
        incorrect++;
        input.parentElement.parentElement.style.backgroundColor = '#ffebee';
        input.parentElement.parentElement.style.borderLeft = '4px solid var(--danger)';
      }
    });
    
    // Check for missed correct answers
    const selectedIds = selected.map(input => input.value);
    const missed = correctAnswers.filter(id => !selectedIds.includes(id));
    
    // Calculate score
    const totalCorrect = correctAnswers.length;
    const score = Math.max(0, (correct - incorrect) / totalCorrect * 100);
    
    this.scores[quizId] = score;
    
    // Display result
    let feedback = '';
    if (score === 100 && missed.length === 0) {
      feedback = `<p style="color: var(--success); font-weight: bold;">✅ Perfect! You got it right!</p>`;
    } else if (score >= 50) {
      feedback = `<p style="color: var(--info);">✓ Partially correct. Score: ${score.toFixed(0)}%</p>`;
      if (missed.length > 0) {
        feedback += `<p style="color: var(--text-secondary); font-size: 14px;">You missed some correct answers.</p>`;
      }
      if (incorrect > 0) {
        feedback += `<p style="color: var(--text-secondary); font-size: 14px;">You selected ${incorrect} incorrect option(s).</p>`;
      }
    } else {
      feedback = `<p style="color: var(--danger);">❌ Not quite right. Score: ${score.toFixed(0)}%</p>`;
      feedback += `<p style="color: var(--text-secondary); font-size: 14px;">Review the material and try again.</p>`;
    }
    
    // Show explanations for correct answers
    if (score < 100) {
      feedback += '<div style="margin-top: 16px; padding: 12px; background: var(--brand-lighter); border-radius: 8px;">';
      feedback += '<strong>Correct answers:</strong><ul style="margin: 8px 0; padding-left: 20px;">';
      quiz.options.filter(opt => opt.correct).forEach(opt => {
        feedback += `<li>${opt.text}</li>`;
      });
      feedback += '</ul></div>';
    }
    
    resultContainer.innerHTML = feedback;
    
    // Log to audit
    if (window.demoController) {
      window.demoController.logAudit('QUIZ_COMPLETED', 'user', `${quizId}: ${score.toFixed(0)}%`);
    }
  }
  
  renderFinalAssessment(container) {
    const html = `
      <div class="final-assessment">
        <h2>📊 Final Assessment</h2>
        <p>Complete all quizzes throughout the presentation to see your overall score.</p>
        
        <div class="assessment-stats" id="assessmentStats">
          <div class="stat-item">
            <div class="stat-value" id="quizzesCompleted">0</div>
            <div class="stat-label">Quizzes Completed</div>
          </div>
          <div class="stat-item">
            <div class="stat-value" id="averageScore">0%</div>
            <div class="stat-label">Average Score</div>
          </div>
          <div class="stat-item">
            <div class="stat-value" id="passingStatus">-</div>
            <div class="stat-label">Status</div>
          </div>
        </div>
        
        <button class="btn-primary" onclick="window.quizController.calculateFinalScore()">
          Calculate Final Score
        </button>
        
        <div id="certificateSection" style="display: none; margin-top: 24px;">
          <div class="certificate">
            <h3>🎓 Certificate of Completion</h3>
            <p>You have successfully completed the HIPAA for Developers training.</p>
            <p><strong>Score: <span id="finalScoreDisplay"></span></strong></p>
            <p style="font-size: 14px; color: var(--text-secondary); margin-top: 16px;">
              Date: ${new Date().toLocaleDateString()}<br>
              Keep practicing HIPAA compliance in your daily development work!
            </p>
          </div>
        </div>
      </div>
    `;
    
    container.innerHTML = html;
  }
  
  calculateFinalScore() {
    const quizIds = Object.keys(this.scores);
    const completed = quizIds.length;
    
    document.getElementById('quizzesCompleted').textContent = completed;
    
    if (completed === 0) {
      alert('Please complete at least one quiz first!');
      return;
    }
    
    const totalScore = quizIds.reduce((sum, id) => sum + this.scores[id], 0);
    const average = totalScore / completed;
    
    document.getElementById('averageScore').textContent = average.toFixed(1) + '%';
    
    const statusEl = document.getElementById('passingStatus');
    if (average >= 80) {
      statusEl.textContent = '✅ Passed';
      statusEl.style.color = 'var(--success)';
      
      // Show certificate
      document.getElementById('certificateSection').style.display = 'block';
      document.getElementById('finalScoreDisplay').textContent = average.toFixed(1) + '%';
    } else if (average >= 60) {
      statusEl.textContent = '⚠️ Review Needed';
      statusEl.style.color = 'var(--warning)';
    } else {
      statusEl.textContent = '❌ More Study Needed';
      statusEl.style.color = 'var(--danger)';
    }
    
    // Log completion
    if (window.demoController) {
      window.demoController.logAudit('ASSESSMENT_COMPLETE', 'user', `Final score: ${average.toFixed(1)}%`);
    }
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.quizController = new QuizController();
});

