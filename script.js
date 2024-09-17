const questions = [
    {
        question: "What's your favorite color?",
        answers: ["Red", "Blue", "Green", "Yellow", "Others"]
    },
    {
        question: "What's your favorite animal?",
        answers: ["Cat", "Dog", "Bird", "Fish", "Others"]
    },
    {
        question: "What's your favorite season?",
        answers: ["Spring", "Summer", "Fall", "Winter", "Others"]
    }
];

const questionElement = document.getElementById("question-container");
const prevButton = document.getElementById("prev-btn");
const nextButton = document.getElementById("next-btn");
const progressElement = document.getElementById("progress");

let currentQuestionIndex = 0;
let userAnswers = [];

// Start the survey
function startSurvey() {
    currentQuestionIndex = 0;
    showQuestion();
    updateProgress();
}

// Show the current question
function showQuestion() {
    const currentQuestion = questions[currentQuestionIndex];
    questionElement.innerHTML = `
        <div class="question">${currentQuestion.question}</div>
        <div class="answers">
            ${currentQuestion.answers.map((answer, idx) => `
                <div>
                    <input type="checkbox" id="answer${idx}" name="answer" value="${answer}">
                    <label for="answer${idx}">${answer}</label>
                    ${answer === "Others" ? '<input type="text" id="other-input" placeholder="Please specify..." style="display:none;">' : ''}
                </div>
            `).join('')}
        </div>
    `;

    // Pre-select previous answers if available
    if (userAnswers[currentQuestionIndex]) {
        userAnswers[currentQuestionIndex].forEach(value => {
            const checkbox = document.querySelector(`input[value="${value}"]`);
            if (checkbox) checkbox.checked = true;
            if (value === "Others") {
                document.getElementById('other-input').value = userAnswers[currentQuestionIndex].find(v => v !== "Others");
            }
        });
    }

    // Update buttons
    prevButton.disabled = currentQuestionIndex === 0;
    nextButton.textContent = currentQuestionIndex === questions.length - 1 ? "Submit" : "Next";
}

function updateProgress() {
    const totalQuestions = questions.length;
    const answeredQuestions = userAnswers.filter(ans => ans && ans.length > 0).length;
    const percentage = (answeredQuestions / totalQuestions) * 100;

    // Update the progress bar width
    const progressBar = document.getElementById("progress-bar");
    progressBar.style.width = `${percentage}%`;

    // Update the progress text
    const progressText = document.getElementById("progress-text");
    progressText.textContent = `Progress: ${Math.round(percentage)}% Completed`;
}


// Handle next button click
function handleNextButton() {
    const selectedAnswers = Array.from(document.querySelectorAll('input[name="answer"]:checked')).map(input => input.value);
    
    if (selectedAnswers.length > 0) {
        // Handle "Others" input
        const otherInput = document.getElementById('other-input');
        if (otherInput && otherInput.style.display !== 'none' && otherInput.value.trim() !== '') {
            selectedAnswers.push(otherInput.value.trim());
        }
        
        userAnswers[currentQuestionIndex] = selectedAnswers;
        if (currentQuestionIndex === questions.length - 1) {
            submitSurvey();
        } else {
            currentQuestionIndex++;
            showQuestion();
            updateProgress();
        }
    } else {
        alert("Please select at least one answer.");
    }
}

// Handle previous button click
function handlePrevButton() {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        showQuestion();
        updateProgress();
        nextButton.disabled = false;
    }
    if (currentQuestionIndex === 0) {
        prevButton.disabled = true;
    }
}

// Show or hide the "Others" input field
function toggleOtherInput() {
    const othersCheckbox = document.querySelector('input[value="Others"]');
    const otherInput = document.getElementById('other-input');
    if (othersCheckbox && otherInput) {
        otherInput.style.display = othersCheckbox.checked ? 'inline' : 'none';
    }
}

// Submit the survey using AJAX
function submitSurvey() {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "submit_survey.php", true);
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

    xhr.onload = function () {
        if (xhr.status === 200) {
            alert("Survey submitted successfully!");
            window.location.href = "thank_you.html"; 
        } else {
            alert("Failed to submit survey: " + xhr.responseText);
        }
    };

    xhr.onerror = function () {
        alert("Request failed. Please check your network connection.");
    };

    xhr.send(JSON.stringify({ answers: userAnswers }));
}

// Event listeners
nextButton.addEventListener('click', handleNextButton);
prevButton.addEventListener('click', handlePrevButton);
document.addEventListener('change', toggleOtherInput);

// Initialize the survey
startSurvey();
