class CalorieTracker {
	constructor() {
		this._calorieLimit = 2000;
		this._totalCalories = 0;
		this._meals = [];
		this._workouts = [];

		// RAN @ INTIALIZATION
		this._displayCaloriesLimit();
		this._displayCaloriesTotal();
		this._displayCaloriesConsumed();
		this._displayCaloriesBurned();
		this._displayClaoriesRemaining();
		this._displayCaloriesProgress();
	}
	// PRIVATE METHODS
	_displayCaloriesTotal() {
		const totalCaloriesEl = document.querySelector('#calories-total');
		console.log(this._totalCalories);
		totalCaloriesEl.textContent = this._totalCalories;
	}
	_displayCaloriesLimit() {
		const calorieLimitEl = document.querySelector('#calories-limit');
		calorieLimitEl.textContent = this._calorieLimit;
	}
	_displayCaloriesConsumed() {
		const caloriesConsumedEl = document.querySelector('#calories-consumed');
		caloriesConsumedEl.textContent = this._meals.reduce((acc, meal) => acc + meal.calories, 0);
	}
	_displayCaloriesBurned() {
		const caloriesBurnedEl = document.querySelector('#calories-burned');
		caloriesBurnedEl.textContent = this._workouts.reduce((acc, workout) => acc + workout.calories, 0);
	}
	_displayClaoriesRemaining() {
		const caloriesRemainingEl = document.querySelector('#calories-remaining');

		const remaining = this._calorieLimit - this._totalCalories;
		caloriesRemainingEl.textContent = remaining;

		const parentEl = caloriesRemainingEl.parentElement.parentElement;
		if (remaining <= 0) {
			parentEl.classList.remove('bg-light');
			parentEl.classList.add('bg-danger');
			document.querySelector('#calorie-progress').classList.add('bg-danger');
		} else {
			parentEl.classList.remove('bg-danger');
			parentEl.classList.add('bg-light');
			document.querySelector('#calorie-progress').classList.remove('bg-danger');
		}
	}
	_displayCaloriesProgress() {
		const caloriesProgressEl = document.querySelector('#calorie-progress');
		const progress = (this._totalCalories / this._calorieLimit) * 100;
		const width = Math.min(progress, 100);
		caloriesProgressEl.style.width = `${width}%`;
		caloriesProgressEl.ariaValueNow = `${width}`;
	}

	// RENDER AFTERFACT THE CHANGES ON WORKOUT OR HAVE MEAL
	_render() {
		this._displayCaloriesTotal();
		this._displayCaloriesConsumed();
		this._displayCaloriesBurned();
		this._displayClaoriesRemaining();
		this._displayCaloriesProgress();
	}

	// PUBLIC API
	addMeal(meal) {
		this._meals.push(meal);
		this._totalCalories += meal.calories;
		// TRIGGER RE-RENDER
		this._render();
	}
	addWorkout(workout) {
		this._workouts.push(workout);
		this._totalCalories -= workout.calories;
		// TRIGGER RE-RENDER
		this._render();
	}
}

class Meal {
	constructor(name, calories) {
		this.id = Math.random().toString(16).slice(2);
		this.name = name;
		this.calories = calories;
	}
}
class Workout {
	constructor(name, calories) {
		this.id = Math.random().toString(16).slice(2);
		this.name = name;
		this.calories = calories;
	}
}

const tracker = new CalorieTracker();

const breakfast = new Meal('Breakfast', 1000);
const lunch = new Meal('Lunch', 175);
tracker.addMeal(breakfast);
tracker.addMeal(lunch);

const run = new Workout('Run', 300);
const yoga = new Workout('Run', 50);
tracker.addWorkout(run);
tracker.addWorkout(yoga);

console.log(tracker._meals);
console.log(tracker._workouts);
console.log(tracker._totalCalories);
