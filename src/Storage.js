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
		localStorage.removeItem('caloriesLimit');
		window.location.reload();
	}
}

export default Storage;
