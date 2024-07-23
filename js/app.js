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
		const state = Math.max(Math.min(progress, 100), 0);
		caloriesProgressEl.style.width = `${state}%`;
		caloriesProgressEl.ariaValueNow = `${state}`;
	}

	_displayNewMeal(meal) {
		const mealsList = document.querySelector('#meal-items');

		const newMealEl = document.createElement('div');
		newMealEl.classList.add('card', 'my-2');
		newMealEl.setAttribute('data-id', meal.id);
		newMealEl.innerHTML = `
      <div class="card-body">
         <div class="d-flex align-items-center justify-content-between">
            <h4 class="mx-1">${meal.name}</h4>
            <div class="fs-1 bg-primary text-white text-center rounded-2 px-2 px-sm-5">${meal.calories}</div>
            <button class="delete btn btn-danger btn-sm mx-2">
               <i class="fa-solid fa-xmark"></i>
            </button>
         </div>
      </div>`;
		mealsList.appendChild(newMealEl);
	}
	_displayNewWorkout(workout) {
		const workoutsList = document.querySelector('#workout-items');

		const newWorkoutEl = document.createElement('div');
		newWorkoutEl.classList.add('card', 'my-2');
		newWorkoutEl.setAttribute('data-id', workout.id);
		newWorkoutEl.innerHTML = `
      <div class="card-body">
         <div class="d-flex align-items-center justify-content-between">
            <h4 class="mx-1">${workout.name}</h4>
            <div class="fs-1 bg-secondary text-white text-center rounded-2 px-2 px-sm-5">${workout.calories}</div>
            <button class="delete btn btn-danger btn-sm mx-2">
               <i class="fa-solid fa-xmark"></i>
            </button>
         </div>
      </div>`;
		workoutsList.appendChild(newWorkoutEl);
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

		// DISPLAY THE MEAL
		this._displayNewMeal(meal);
		// TRIGGER RE-RENDER
		this._render();
	}
	addWorkout(workout) {
		this._workouts.push(workout);
		this._totalCalories -= workout.calories;

		// DISPLAY THE WORKOUT
		this._displayNewWorkout(workout);
		// TRIGGER RE-RENDER
		this._render();
	}
}

class Meal {
	constructor(name, calories) {
		this.id = Math.random().toString(16).slice(2);
		this.name = name;
		this.calories = Number(calories);
	}
}
class Workout {
	constructor(name, calories) {
		this.id = Math.random().toString(16).slice(2);
		this.name = name;
		this.calories = Number(calories);
	}
}

class App {
	constructor() {
		// INITIALIZE CALORIE TRACKER UI
		this._tracker = new CalorieTracker();

		// CREATE FORM EVENT LISTENERS UPON APP INITIALIZATION
		document.getElementById('meal-form').addEventListener('submit', this._newItem.bind(this, 'meal'));
		document.getElementById('workout-form').addEventListener('submit', this._newItem.bind(this, 'workout'));
	}

	// ADD-NEW-MEAL|ADD-WORKOUT FORM
	_newItem(type, e) {
		e.preventDefault();

		const name = document.getElementById(`${type}-name`).value;
		const calories = document.getElementById(`${type}-calories`).value;

		// GUARD CLAUSE - Validate Inputs
		if (!name || isNaN(calories) || calories < 0) {
			alert('Please provide a valid name and positive calorie count.');
			return;
		}

		// CREATE MEAL AND ADD IT TO TRACKER
		if (type === 'meal') {
			const meal = new Meal(name, calories);
			this._tracker.addMeal(meal);
		}
		if (type === 'workout') {
			const workout = new Workout(name, calories);
			this._tracker.addWorkout(workout);
		}

		// CLEAR FORM INPUTS
		document.getElementById(`${type}-form`).reset();

		// COLLAPSE FORM
		const collapseForm = document.getElementById(`collapse-${type}`);
		new bootstrap.Collapse(collapseForm, { toggle: true });
	}
}

const app = new App();
