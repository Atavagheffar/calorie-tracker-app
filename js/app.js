class CalorieTracker {
  constructor() {
    this._calorieLimit = Storage.getCalorieLimit();
    this._totalCalories = Storage.getTotalCalories();
    this._meals = Storage.getMeals();
    this._workouts = Storage.getWorkouts();
    this._displayCaloriesTotal();
    this._displayCalorieLimit();
    this._renderStats();
  }
  // ********* public methods ***********
  addMeal(meal) {
    this._meals.push(meal);
    this._totalCalories += meal.calories;
    Storage.updateTotalCalories(this._totalCalories);
    Storage.saveMeal(meal);
    this._displayCaloriesTotal();
    this._renderStats();
    this._displayNewMeal(meal);
  }

  addWorkout(workout) {
    this._workouts.push(workout);
    this._totalCalories -= workout.calories;
    Storage.updateTotalCalories(this._totalCalories);
    Storage.saveWorkout(workout);
    this._displayCaloriesTotal();
    this._renderStats();
    this._displayNewWorkout(workout);
  }

  removeWorkout(id) {
    const indexOfWorkout = this._workouts.findIndex(
      (workout) => workout.id === id
    );

    if (indexOfWorkout !== -1) {
      const workout = this._workouts[indexOfWorkout];
      this._totalCalories += workout.calories;
      Storage.updateTotalCalories(this._totalCalories);
      Storage.removeWorkout(id);
      this._workouts.splice(indexOfWorkout, 1);
      this._renderStats();
    }
  }

  removeMeal(id) {
    const indexOfMeal = this._meals.findIndex((meal) => meal.id === id);

    if (indexOfMeal !== -1) {
      const meal = this._meals[indexOfMeal];
      this._totalCalories -= meal.calories;
      Storage.updateTotalCalories(this._totalCalories);
      Storage.removeMeal(id);
      this._meals.splice(indexOfMeal, 1);
      this._renderStats();
    }
  }
  reset() {
    this._totalCalories = 0;
    this._workouts = [];
    this._meals = [];
    Storage.updateTotalCalories(this._totalCalories);
    Storage.clearAll();
    this._renderStats();
  }

  setLimit(calorieLimit) {
    this._calorieLimit = calorieLimit;
    Storage.setCalorieLimit(calorieLimit);
    this._displayCalorieLimit();
    this._renderStats();
  }
  loadItems(){
    this._meals.forEach(meal => this._displayNewMeal(meal))
    this._workouts.forEach(workout => this._displayNewWorkout(workout))

    // const meals = Storage.getMeals();
    // meals.forEach(meal => this._displayNewMeal(meal))

    // const workouts = Storage.getWorkouts();
    // workouts.forEach(workout => this._displayNewWorkout(workout))
  }
  // ********* private methods ***********
  _displayCaloriesTotal() {
    const caloriesTotalEle = document.getElementById("calories-total");
    caloriesTotalEle.innerHTML = this._totalCalories;
  }

  _displayCalorieLimit() {
    const caloriesLimitEle = document.getElementById("calories-limit");
    caloriesLimitEle.innerHTML = this._calorieLimit;
  }

  _displayCaloriesConsumed() {
    const caloriesConsumedEle = document.getElementById("calories-consumed");
    const consumed = this._meals.reduce((total, currentValue) => {
      return currentValue.calories + total;
    }, 0);
    caloriesConsumedEle.innerHTML = consumed;
  }

  _displayCaloriesBurned() {
    const caloriesBurnedEle = document.getElementById("calories-burned");
    const burned = this._workouts.reduce((total, currentValue) => {
      return currentValue.calories + total;
    }, 0);
    caloriesBurnedEle.innerHTML = burned;
  }

  _displayCalorieRemaining() {
    const progressBarEle = document.getElementById(`calorie-progress`);
    const caloriesRemainingEle = document.getElementById("calories-remaining");
    const remaining = this._calorieLimit - this._totalCalories;
    caloriesRemainingEle.innerHTML = remaining;

    if (remaining <= 0) {
      caloriesRemainingEle.parentElement.parentElement.classList.remove(
        "bg-light"
      );
      caloriesRemainingEle.parentElement.parentElement.classList.add(
        "bg-danger"
      );
      progressBarEle.classList.remove("bg-success");
      progressBarEle.classList.add("bg-danger");
    } else {
      caloriesRemainingEle.parentElement.parentElement.classList.remove(
        "bg-danger"
      );
      caloriesRemainingEle.parentElement.parentElement.classList.add(
        "bg-light"
      );
      progressBarEle.classList.replace("bg-danger", "bg-success");
    }
  }

  _displayCaloriesProgress() {
    const progressBarEle = document.getElementById(`calorie-progress`);
    const percentage = (this._totalCalories / this._calorieLimit) * 100;
    const width = Math.min(percentage, 100);
    progressBarEle.style.width = `${width}%`;
  }

  _displayNewMeal(meal) {
    const mealsEle = document.getElementById("meal-items");
    const mealEle = document.createElement("div");
    mealEle.classList.add("card", "my-2");
    mealEle.innerHTML = `
    <div class="card-body" data-id=${meal.id}>
      <div class="d-flex align-items-center justify-content-between">
        <h4 class="mx-1">${meal.name}</h4>
        <div
          class="fs-1 bg-primary text-white text-center rounded-2 px-2 px-sm-5"
        >
          ${meal.calories}
        </div>
        <button class="delete btn btn-danger btn-sm mx-2">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </div>
    </div>`;
    mealsEle.appendChild(mealEle);
  }

  _displayNewWorkout(workout) {
    const workoutsEle = document.getElementById("workout-items");
    const workoutEle = document.createElement("div");
    workoutEle.classList.add("card", "my-2");
    workoutEle.innerHTML = `
  <div class="card-body" data-id=${workout.id}>
    <div class="d-flex align-items-center justify-content-between">
      <h4 class="mx-1">${workout.name}</h4>
      <div
        class="fs-1 lg bg-secondary text-white text-center rounded-2 px-2 px-sm-5"
      >
        ${workout.calories}
      </div>
      <button class="delete btn btn-danger btn-sm mx-2">
        <i class="fa-solid fa-xmark"></i>
      </button>
    </div>
  </div>`;
    workoutsEle.appendChild(workoutEle);
  }

  _renderStats() {
    this._displayCaloriesTotal();
    this._displayCaloriesConsumed();
    this._displayCaloriesBurned();
    this._displayCalorieRemaining();
    this._displayCaloriesProgress();
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

class Storage {
  static getCalorieLimit(defaultLimit = 3000) {
    let calorieLimit;
    if (localStorage.getItem('calorieLimit') === null) {
      calorieLimit = defaultLimit;
    } else {
      calorieLimit = localStorage.getItem('calorieLimit') * 1;
    }
    return calorieLimit;
  }

  static setCalorieLimit(calorieLimit) {
    localStorage.setItem('calorieLimit', calorieLimit);
  }

  static getTotalCalories(defaultTotalCalories = 0) {
    let totalCalories;
    if (localStorage.getItem('totalCalories') === null) {
      totalCalories = defaultTotalCalories;
    } else {
      totalCalories = localStorage.getItem('totalCalories') * 1;
    }
    return totalCalories;
  }
  static updateTotalCalories(calories){
    localStorage.setItem('totalCalories',calories);
  }

  static getMeals(){
    let meals;
    if(localStorage.getItem('meals')=== null){
      meals = [];
    }else {
      meals = JSON.parse(localStorage.getItem('meals'));
    }
    return meals;
  }
  static saveMeal(meal){
    const meals = Storage.getMeals();
    meals.push(meal);
    localStorage.setItem('meals',JSON.stringify(meals))
  }
  static removeMeal(id){
    const meals = Storage.getMeals();
    meals.forEach((meal,index)=>{
      if(meal.id === id){
        meals.splice(index,1);
      }
    })
    localStorage.setItem('meals',JSON.stringify(meals))
  }

  static getWorkouts(){
    let workouts;
    if(localStorage.getItem('workouts')=== null){
      workouts = [];
    }else {
      workouts = JSON.parse(localStorage.getItem('workouts'));
    }
    return workouts;
  }
  static saveWorkout(workout){
    const workouts = Storage.getWorkouts();
    workouts.push(workout);
    localStorage.setItem('workouts',JSON.stringify(workouts))
  }
  static removeWorkout(id){
    const workouts = Storage.getWorkouts();
    workouts.forEach((workout,index)=>{
      if(workout.id === id){
        workouts.splice(index,1);
      }
    })
    localStorage.setItem('workouts',JSON.stringify(workouts))
  }

  static clearAll(){
    const remove_list = [ 'workouts' , 'meals' , 'totalCalories']
    for(const value of remove_list){
      localStorage.removeItem(value)
    }
    // for deleting everything include calorie limit
    //localStorage.clear();
  }
}

class App {
  constructor() {
    this._tracker = new CalorieTracker();
    document
      .getElementById("meal-form")
      .addEventListener("submit", this._newMeal.bind(this));
    document
      .getElementById("workout-form")
      .addEventListener("submit", this._newWorkout.bind(this));

    document
      .getElementById("meal-items")
      .addEventListener("click", this._removeItems.bind(this, "meal"));

    document
      .getElementById("workout-items")
      .addEventListener("click", this._removeItems.bind(this, "workout"));

    document
      .getElementById("filter-meals")
      .addEventListener("input", this._filterItems.bind(this, "meal"));

    document
      .getElementById("filter-workouts")
      .addEventListener("input", this._filterItems.bind(this, "workout"));

    document
      .getElementById("reset")
      .addEventListener("click", this._reset.bind(this));

    document
      .getElementById("limit-form")
      .addEventListener("submit", this._setLimit.bind(this));

      this._tracker.loadItems();
  }

  // private method
  _newMeal(evt) {
    evt.preventDefault();

    const name = document.getElementById("meal-name");
    const calories = document.getElementById("meal-calories");
    // validation
    if (name.value === "" || calories.value === "") {
      alert("fill all inputs");
      return 0;
    }
    const meal = new Meal(name.value, calories.value * 1);
    console.log(this);
    this._tracker.addMeal(meal);

    name.value = "";
    calories.value = "";
  }

  _newWorkout(evt) {
    evt.preventDefault();

    const name = document.getElementById("workout-name");
    const calories = document.getElementById("workout-calories");
    // validation
    if (name.value === "" || calories.value === "") {
      alert("fill all inputs");
      return 0;
    }
    const workout = new Workout(name.value, calories.value * 1);
    console.log(this);
    this._tracker.addWorkout(workout);

    name.value = "";
    calories.value = "";
  }
  _removeItems(type, evt) {
    if (
      evt.target.classList.contains("delete") ||
      evt.target.classList.contains("fa-solid")
    ) {
      if (confirm("Are You Sure?")) {
        const id = evt.target.closest(".card-body").getAttribute("data-id");
        if (type === "meal") {
          this._tracker.removeMeal(id);
        } else if (type === "workout") {
          this._tracker.removeWorkout(id);
        }
        evt.target.closest(".card").remove();
      }
    }
  }
  _filterItems(type, evt) {
    const searchValue = evt.target.value.toLowerCase();
    document.querySelectorAll(`#${type}-items .card`).forEach((item) => {
      const name =
        item.firstElementChild.firstElementChild.textContent.toLowerCase();

      if (name.indexOf(searchValue) !== -1) {
        item.style.display = "block";
      } else {
        item.style.display = "none";
      }
    });
  }
  _reset() {
    if (confirm("Are you sure you want to reset day?")) {
      this._tracker.reset();
      document.getElementById("workout-items").innerHTML = "";
      document.getElementById("meal-items").innerHTML = "";
      document.getElementById("filter-meals").value = "";
      document.getElementById("filter-workouts").value = "";
    }
  }
  _setLimit(evt) {
    evt.preventDefault();
    const limit = document.getElementById("limit");
    if (limit.value === "") {
      alert("please fill the input");
      return 0;
    }
    this._tracker.setLimit(limit.value * 1);
    limit.value = "";

    const limitModal = bootstrap.Modal.getInstance(
      document.getElementById("limit-modal")
    );
    limitModal.hide();
  }
}

const app = new App();

const calTracker = new CalorieTracker();

// const run = new Workout("Morning Run", 800);
// const breakfast = new Meal("Breakfast", 2800);

calTracker.addMeal(breakfast);
calTracker.addWorkout(run);

//  console.log(calTracker._meals);
//  console.log(calTracker._workouts);

// const meals = [{ calorie: 200 }, { calorie: 600 }];
// const num = meals.reduce((total, currentValue) => {
//   return total + currentValue.calorie;
// }, 0);
// console.log(num)
