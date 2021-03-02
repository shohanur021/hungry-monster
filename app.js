const searchBtn = document.getElementById('submit');
const mealsNotFound = document.getElementById('wrong-search');
const mealsContainer = document.getElementById('showing-meals');
const mealsCart = document.getElementById('single-meal-details');

searchBtn.addEventListener('click', function () {
    const mealsName = document.getElementById('meal-name').value;
    document.getElementById('single-meal-details').innerHTML= '';
    mealsContainer.innerHTML = '';
    if (mealsName === '') {
        mealsNotFound.style.display = 'block';
    }
    if (mealsName.length >= 1) {
        fetchMealsData(mealsName);
        mealsNotFound.style.display = 'none';
    }
});

const fetchMealsData = mealsName => {
    const url = `https://www.themealdb.com/api/json/v1/1/search.php?s=${mealsName}`;
    try{
        fetch(url)
        .then(res => res.json())
        .then(data => {
            if(data.meals === null || data.meals === undefined || data.meals === ''){
                mealsNotFound.style.display = 'block';
            } else{
                displayMealsData(data.meals)
            }
        })
    }
    catch(error){
        console.log(error);
    }
}

const displayMealsData = (mealsInfo) => {
    const mealsCart = document.getElementById('showing-meals');
    mealsInfo.forEach(meal => {
        const mealDiv = document.createElement('div');
        const mealInfo = `
        <div class="col">
        <div class="card h-100 text-center" onClick="singleMealDeatils(${meal.idMeal});">
          <img src="${meal.strMealThumb}" class="card-img-top" alt="${meal.strMeal}">
          <div class="card-footer">
            <small class="text-muted"><b>${meal.strMeal}</b></small>
          </div>
        </div>
        </div>`;
        mealDiv.innerHTML = mealInfo;
        mealsCart.appendChild(mealDiv);
    });
}

const singleMealDeatils = idMeal =>{
    const url = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${idMeal}`;
    try{
        fetch(url)
        .then(res => res.json())
        .then(data => renderMealInfo(data.meals[0]))
    }
    catch(error){
        console.log(error);
    }
}

const renderMealInfo = (mealsId) =>{
    let ingredientAndMeasures = [];
    for (let item = 1; item <= 20; item++) {
        if (mealsId[`strIngredient${item}`]) {
            ingredientAndMeasures.push(`${mealsId[`strMeasure${item}`]}`);
        } else {
            break;
        }
    }
    mealsCart.innerHTML = `
        <div class="food_deatails">
        <img src="${mealsId.strMealThumb}" class="rounded img-fluid w-75 mx-auto d-block p-5" alt="...">
        <h2 class="py-3">${mealsId.strMeal}</h2>
        <h5 class="py-3">Ingredients</h5>
        ${ingredientAndMeasures.map((ingredientAndMeasure) =>`
        <div class="form-check">
          <input class="form-check-input" type="checkbox" value="" id="flexCheckChecked" checked>
          <label class="form-check-label" for="flexCheckChecked">
          ${ingredientAndMeasure}
          </label>
        </div>`).join('')}
        </div>`;
}