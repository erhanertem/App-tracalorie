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

class Storage {
	// STATIC METHOD BECAUSE WE DO NOT NEED ANY INSTANTIATION ON THIS CLASS
	static setCalorieLimit(calorieLimit) {
		localStorage.setItem('caloriesLimit', calorieLimit);
	}
	static getCalorieLimit() {
		let calorieLimit = localStorage.getItem('caloriesLimit');
		// IF LOCALSTORAGE DO NOT HAVE ANY DATA, ASSIGN THE DEFAULT
		// IF LOCALSTORAGE GOT THE DATA, RETURN THIS TO THE APP
		return calorieLimit === null ? 2000 : Number(localStorage.getItem('caloriesLimit'));
	}
	static getTotalCalories() {
		let totalCalories = localStorage.getItem('totalCalories');
		return totalCalories === null ? 0 : Number(totalCalories);
	}
	// WHEN AN ITEM ADDED AMEND THE TOTAL CALORIES
	static updateTotalCalories(calories) {
		localStorage.setItem('totalCalories', calories);
	}
	static getMeals() {
		let meals = localStorage.getItem('meals');
		return meals === null ? [] : JSON.parse(meals);
	}
	static saveMeal(meal) {
		let meals = this.getMeals();
		meals.push(meal);
		console.log(meal);
		localStorage.setItem('meals', JSON.stringify(meals));
	}
	static getWorkouts() {
		let workouts = localStorage.getItem('workouts');
		return workouts === null ? [] : JSON.parse(workouts);
	}
	static saveWorkout(workout) {
		let workouts = this.getWorkouts();
		workouts.push(workout);
		console.log(workout);
		localStorage.setItem('workouts', JSON.stringify(workouts));
	}
	static removeMeal(id) {
		let meals = this.getMeals();
		meals = meals.filter((meal) => meal.id !== id);
		localStorage.setItem('meals', JSON.stringify(meals));
	}
	static removeWorkout(id) {
		let workouts = this.getWorkouts();
		workouts = workouts.filter((workout) => workout.id !== id);
		localStorage.setItem('workouts', JSON.stringify(workouts));
	}
	static resetApp() {
		// IMPORTANT!! CLEARS THE ENTIRE LOCALSTORAGE - NOT DESIRABLE IF NON-RELATED DATA EXISTS
		// localStorage.clear();
		// > INDIVIDUALLY CLEAR ITEMS
		localStorage.removeItem('totalCalories');
		localStorage.removeItem('meals');
		localStorage.removeItem('workouts');
		window.location.reload();
	}
}

class App {
	constructor() {
		// INITIALIZE CALORIE TRACKER UI
		this._tracker = new CalorieTracker();
		// LOAD ITEMS TO UI
		this._tracker.loadItems();
		// LOAD EVENT LISTENERS
		this._loadEventListeners();
	}
	_loadEventListeners() {
		document.getElementById('meal-form').addEventListener('submit', this._newItem.bind(this, 'meal'));
		document.getElementById('workout-form').addEventListener('submit', this._newItem.bind(this, 'workout'));
		document.getElementById('meal-items').addEventListener('click', this._removeItems.bind(this, 'meal'));
		document.getElementById('workout-items').addEventListener('click', this._removeItems.bind(this, 'workout'));
		document.getElementById('filter-meals').addEventListener('keyup', this._filterItems.bind(this, 'meal'));
		document.getElementById('filter-workouts').addEventListener('keyup', this._filterItems.bind(this, 'workout'));
		document.getElementById('reset').addEventListener('click', this._reset.bind(this));
		document.getElementById('limit-form').addEventListener('submit', this._setLimit.bind(this));
	}
	_setLimit(e) {
		e.preventDefault();
		// SOLICIT THE VALUE TYPED INTO LIMIT-FORM
		let limit = document.getElementById('limit').value;
		if (limit === '' || isNaN(Number(limit)) || Number(limit) < 2000) {
			alert('Please add a compliant limit 2000+');
			return;
		}

		// SET THE LIMIT TO STATS UI
		this._tracker.setLimit(Number(limit));
		// RESET FORM DATA
		limit = '';
		const modalEl = document.getElementById('limit-modal');

		// > #1.Bootstrap way for hiding modal
		// const modal = bootstrap.Modal.getInstance(modalEl);
		// modal.hide();
		// > #2.DOM manuplation Method for hiding modal
		modalEl.classList.remove('show');
		document.body.classList.remove('modal-open');
		document.querySelector('.modal-backdrop').remove();
	}
	_reset() {
		// RESET STATS UI
		this._tracker.reset();

		// UPDATE LOCALSTORAGE
		Storage.resetApp();
		// REMOVE ITEMS LISTS
		document.getElementById('meal-items').innerHTML = '';
		document.getElementById('workout-items').innerHTML = '';
		// CLEAR INPUT FIELDS
		document.getElementById('filter-meals').value = '';
		document.getElementById('filter-workouts').value = '';
	}
	_removeItems(type, e) {
		// IF CLICKED ONLY ON X ICON
		if (e.target.classList.contains('delete') || e.target.classList.contains('fa-xmark')) {
			// IF USER CONFIRMED DELETING
			if (confirm('Are you sure?')) {
				// TRAVERSE TO CLOSESTS PARENT TO RETRIEVE THE ID OF THE CLICKED ITEM
				const id = e.target.closest('.card').getAttribute('data-id');
				// DEPENDING ON WHAT REMOVED, REMOVE THE ITEM FROM STATS UI
				type === 'meal' ? this._tracker.removeMeal(id) : this._tracker.removeWorkout(id);
				// PHYSICALLY REMOVE FROM THE CORRESPONDING FORM LIST
				const item = e.target.closest('.card').remove();
				console.log(item);
			}
		}
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

	_filterItems(type, e) {
		// GET WHAT TYPED IN
		const text = e.target.value.toLowerCase();
		// TRAVERSE THRU THE ITEMS WHERE THE NAME OF THE MEAL/WORKOUT RESIDES
		document.querySelectorAll(`#${type}-items .card`).forEach((item) => {
			// const name = item.firstElementChild.firstElementChild.textContent;
			const name = item.childNodes[1].textContent;
			// IF NAME CONTAINS THE TYPED TEXT, SHOW IT
			if (name.toLowerCase().includes(text)) {
				item.style.display = 'block';
			} else {
				item.style.display = 'none';
			}
		});
	}
}

const app = new App();
