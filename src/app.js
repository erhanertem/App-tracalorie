// Instead of HTML, we import in the CSS files here
import './css/bootstrap.css';
import './css/style.css';
import '@fortawesome/fontawesome-free/js/all';
import { Modal, Collapse } from 'bootstrap';

import CalorieTracker from './Tracker';
import { Workout, Meal } from './Item';
import Storage from './Storage';

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
		// const modal = Modal.getInstance(modalEl);
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
		new Collapse(collapseForm, { toggle: true });
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
