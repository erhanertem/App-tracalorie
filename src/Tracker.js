import Storage from './Storage';

class CalorieTracker {
	constructor() {
		// this._calorieLimit = 2000;
		this._calorieLimit = Storage.getCalorieLimit();
		// this._totalCalories = 0;
		this._totalCalories = Storage.getTotalCalories();
		// this._meals = [];
		this._meals = Storage.getMeals();
		// this._workouts = [];
		this._workouts = Storage.getWorkouts();

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
	setLimit(calorieLimit) {
		this._calorieLimit = calorieLimit;
		// WRITE TO LOCAL STORAGE
		Storage.setCalorieLimit(calorieLimit);

		this._displayCaloriesLimit();
		this._displayClaoriesRemaining();
	}
	reset() {
		this._totalCalories = 0;
		this._meals = [];
		this._workouts = [];
		this._displayCaloriesTotal();
		this._displayCaloriesLimit();
		this._displayCaloriesConsumed();
		this._displayCaloriesBurned();
		this._displayClaoriesRemaining();
		this._displayCaloriesProgress();
	}
	removeMeal(id) {
		// FIND WHERE THIS ID IN THE ARRAY OF MEALS
		const index = this._meals.findIndex((meal) => meal.id === id);
		if (index !== -1) {
			const meal = this._meals[index];
			// DEDUCT CAL OF THE MEAL FROM THE TOTAL CALORIE
			this._totalCalories -= meal.calories;
			// UPDATE STORAGE DATA
			Storage.updateTotalCalories(this._totalCalories);
			Storage.removeMeal(id);
			// REMOVE THE MEAL FROM THE ARRAY
			this._meals.splice(index, 1);
			this._render();
		}
	}
	removeWorkout(id) {
		// FIND WHERE THIS ID IN THE ARRAY OF MEALS
		const index = this._workouts.findIndex((workout) => workout.id === id);
		if (index !== -1) {
			const workout = this._workouts[index];
			// DEDUCT CAL OF THE WORKOUT FROM THE TOTAL CALORIE
			this._totalCalories += workout.calories;
			// UPDATE STORAGE DATA
			Storage.updateTotalCalories(this._totalCalories);
			Storage.removeWorkout(id);
			// REMOVE THE WORKOUT FROM THE ARRAY
			this._workouts.splice(index, 1);
			this._render();
		}
	}

	addMeal(meal) {
		this._meals.push(meal);
		this._totalCalories += meal.calories;

		// UPDATE STORAGE DATA
		Storage.saveMeal(meal);
		Storage.updateTotalCalories(this._totalCalories);
		// DISPLAY THE MEAL
		this._displayNewMeal(meal);
		// TRIGGER RE-RENDER
		this._render();
	}
	addWorkout(workout) {
		this._workouts.push(workout);
		this._totalCalories -= workout.calories;

		// UPDATE STORAGE DATA
		Storage.saveWorkout(workout);
		Storage.updateTotalCalories(this._totalCalories);
		// DISPLAY THE WORKOUT
		this._displayNewWorkout(workout);
		// TRIGGER RE-RENDER
		this._render();
	}
	loadItems() {
		this._meals.forEach((meal) => this._displayNewMeal(meal));
		this._workouts.forEach((workout) => this._displayNewWorkout(workout));
	}
}

export default CalorieTracker;
