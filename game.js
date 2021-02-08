const question = document.getElementById('question');
const choices = Array.from(document.getElementsByClassName('choice-text'));
const progressText = document.getElementById('progressText');
const scoreText = document.getElementById('score');
const progressBarFull = document.getElementById('progressBarFull');
const loader = document.getElementById('loader');
const game = document.getElementById('game');

let currentQuestion = {};
let accpetingAnswers = false;
let score = 0;
let questionCounter = 0;
let availableQuestions = [];

let questions = [];
fetch('./question.json')
	.then((res) => res.json())
	.then((data) => {
		console.log(data);
		questions = data;
		startGame();
		// questions.push(data);
	});

// fetch('https://opentdb.com/api.php?amount=10&category=26&type=multiple')
// 	.then((res) => {
// 		return res.json();
// 	})
// 	.then((loadedQuestions) => {
// 		questions = loadedQuestions.results.map((loadedQuestion) => {
// 			const formattedQuestion = {
// 				question: loadedQuestion.question,
// 			};

// 			const answerChoices = [...loadedQuestion.incorrect_answers];
// 			formattedQuestion.answer = Math.floor(Math.random() * 3) + 1;

// 			answerChoices.splice(
// 				formattedQuestion.answer - 1,
// 				0,
// 				loadedQuestion.correct_answer
// 			);

// 			answerChoices.forEach((choice, index) => {
// 				formattedQuestion['choice' + (index + 1)] = choice;
// 			});
// 			console.log(loadedQuestion.correct_answer);
// 			return formattedQuestion;
// 		});

// 		startGame();
// 	})
// 	.catch((err) => {
// 		console.log(err);
// 	});

// Consteants
const CORRECT_BONUS = 10;
const MAX_QUESTION = 5;

startGame = () => {
	questionCounter = 0;
	score = 0;
	availableQuestions = [...questions];
	getNewQuestion();
	game.classList.remove('hidden');
	loader.classList.add('hidden');
};

getNewQuestion = () => {
	if (availableQuestions.length === 0 || questionCounter >= MAX_QUESTION) {
		localStorage.setItem('mostRecentScore', score);
		return window.location.assign('end.html');
	}
	questionCounter++;
	progressText.innerText = `Question ${questionCounter}/${MAX_QUESTION}`;
	// update the progress bar
	progressBarFull.style.width = `${(questionCounter / MAX_QUESTION) * 100}%`;

	const questionIndex = Math.floor(Math.random() * availableQuestions.length);
	currentQuestion = availableQuestions[questionIndex];
	question.innerText = currentQuestion.question;

	choices.forEach((choice) => {
		const number = choice.dataset['number'];
		choice.innerText = currentQuestion['choice' + number];
	});

	availableQuestions.splice(questionIndex, 1);
	accpetingAnswers = true;
};

choices.forEach((choice) => {
	choice.addEventListener('click', (e) => {
		if (!accpetingAnswers) return;

		accpetingAnswers = false;
		const selectedChoice = e.target;
		const selesctedAnswer = selectedChoice.dataset['number'];

		const classToApplay =
			selesctedAnswer == currentQuestion.answer ? 'correct' : 'incorrect';
		if (classToApplay === 'correct') {
			incrementScore(CORRECT_BONUS);
		}
		selectedChoice.parentElement.classList.add(classToApplay);
		setTimeout(() => {
			selectedChoice.parentElement.classList.remove(classToApplay);
			getNewQuestion();
		}, 1000);
	});
});

incrementScore = (num) => {
	score += num;
	scoreText.innerText = score;
};
