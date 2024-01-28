let rowData = document.getElementById("rowData");
let searchContent = document.getElementById("searchContent");

$(document).ready(() => {
  searchByName("").then(() => {
    $(".loading-screen").fadeOut(500);
  });
});

/** side menu */
closeSideMenu();
function openSideMenu() {
  $(".side-menu").animate({ left: 0 }, 500);
  $(".open-menu").removeClass("fa-bars");
  $(".open-menu").addClass("fa-xmark");

  for (let i = 0; i < 5; i++) {
    $(".menu-links li")
      .eq(i)
      .animate({ top: 0 }, (i + 5) * 100);
  }
}

function closeSideMenu() {
  let boxWidth = $(".side-menu .menu-links").outerWidth();
  $(".side-menu").animate({ left: -boxWidth }, 500);
  $(".open-menu").removeClass("fa-xmark");
  $(".open-menu").addClass("fa-bars");

  $(".menu-links li").animate(
    {
      top: 300,
    },
    500
  );
}

$(".side-menu .open-menu").click(() => {
  if ($(".side-menu").css("left") == "0px") {
    closeSideMenu();
  } else {
    openSideMenu();
  }
});

$(".menu-links li").click(function () {
  $(".menu-links li").removeClass("active");
  $(this).addClass("active");
});

/////// get data /////

async function getMealCategory(category) {
  rowData.innerHTML = "";
  $(".loading-screen").fadeIn(300);

  let response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`
  );
  response = await response.json();

  displayMeals(response.meals.slice(0, 20));
  $(".loading-screen").fadeOut(300);
}

async function getMealArea(area) {
  rowData.innerHTML = "";
  $(".loading-screen").fadeIn(300);
  let response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/filter.php?a=${area}`
  );
  response = await response.json();

  displayMeals(response.meals.slice(0, 20));
  $(".loading-screen").fadeOut(300);
}

async function getsMealIngredient(ingredients) {
  rowData.innerHTML = "";
  $(".loading-screen").fadeIn(300);
  let response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredients}`
  );
  response = await response.json();

  displayMeals(response.meals.slice(0, 20));
  $(".loading-screen").fadeOut(300);
}

async function getMealDetails(id) {
  rowData.innerHTML = "";
  $(".loading-screen").fadeIn(300);

  //searchContainer.innerHTML = "";
  let response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`
  );
  response = await response.json();
  console.log(response.meals[0]);

  displayMealDetails(response.meals[0]);
  $(".loading-screen").fadeOut(300);
}

// /// show data ///////

function displayMeals(data) {
  closeSideMenu();
  let mealBox = "";

  for (let i = 0; i < data.length; i++) {
    mealBox += `
    <div class="col-md-3">
    <div onclick="getMealDetails('${data[i].idMeal}')" class="meal position-relative rounded-2 overflow-hidden" role="button">
      <img src="${data[i].strMealThumb}" alt="" class="w-100" />
      <div class="meal-details position-absolute d-flex align-items-center px-2">
        <h3>${data[i].strMeal}</h3>
      </div>
    </div>
  </div>
    `;
  }
  rowData.innerHTML = mealBox;
}

function displayCategories(data) {
  closeSideMenu();
  searchContent.innerHTML = "";
  let categoryBox = "";

  for (let i = 0; i < data.length; i++) {
    categoryBox += `
      <div class="col-md-3">
      <div  onclick="getMealCategory('${
        data[i].strCategory
      }')" class="meal position-relative rounded-2 overflow-hidden" role="button">
                  <img src="${
                    data[i].strCategoryThumb
                  }" alt="..." class="w-100" >
                  <div class="meal-details position-absolute text-center p-2">
                      <h3>${data[i].strCategory}</h3>
                      <p>${data[i].strCategoryDescription
                        .split(" ")
                        .slice(0, 20)
                        .join(" ")}</p>
                  </div>
              </div>
      </div>
      `;
  }
  rowData.innerHTML = categoryBox;
}

function displayArea(data) {
  closeSideMenu();
  searchContent.innerHTML = "";
  let areaBox = "";

  for (let i = 0; i < data.length; i++) {
    areaBox += `
    <div class="col-md-3">
    <div onclick="getMealArea('${data[i].strArea}')" class="text-center text-white" role="button">
            <i class="fa-solid fa-house-laptop fa-4x"></i>
            <h3>${data[i].strArea}</h3>
    </div>
</div>
      `;
  }
  rowData.innerHTML = areaBox;
}

function displayIngredients(data) {
  closeSideMenu();
  searchContent.innerHTML = "";
  let ingredientsBox = "";

  for (let i = 0; i < data.length; i++) {
    ingredientsBox += `
    <div class="col-md-3">
    <div onclick="getsMealIngredient('${
      data[i].strIngredient
    }')" class="text-center text-white" role="button">
                        <i class="fa-solid fa-drumstick-bite fa-4x"></i>
                        <h3>${data[i].strIngredient}</h3>
                        <p>${data[i].strDescription
                          .split(" ")
                          .slice(0, 20)
                          .join(" ")}</p>
                </div>
</div>
      `;
  }
  rowData.innerHTML = ingredientsBox;
}

function displayMealDetails(meal) {
  closeSideMenu();
  searchContent.innerHTML = "";
  let ingredients = ``;

  for (let i = 1; i <= 20; i++) {
    if (meal[`strIngredient${i}`]) {
      ingredients += `<li class="alert alert-info m-2 p-1">${
        meal[`strMeasure${i}`]
      } ${meal[`strIngredient${i}`]}</li>`;
    }
  }

  let tags = meal.strTags?.split(",");
  if (!tags) tags = [];

  let tagsStr = "";
  for (let i = 0; i < tags.length; i++) {
    tagsStr += `
      <li class="alert alert-danger m-2 p-1">${tags[i]}</li>`;
  }

  let mealDetails = `
<div class="col-md-4 text-white">
            <img class="w-100 rounded-3" src="${meal.strMealThumb}"
                alt="">
                <h2>${meal.strMeal}</h2>
        </div>
        <div class="col-md-8 text-white">
            <h2>Instructions</h2>
            <p>${meal.strInstructions}</p>
            <h3><span class="fw-bolder">Area : </span>${meal.strArea}</h3>
            <h3><span class="fw-bolder">Category : </span>${meal.strCategory}</h3>
            <h3>Recipes :</h3>
            <ul class="list-unstyled d-flex g-3 flex-wrap">
                ${ingredients}
            </ul>

            <h3>Tags :</h3>
            <ul class="list-unstyled d-flex g-3 flex-wrap">
                ${tagsStr}
            </ul>

            <a target="_blank" href="${meal.strSource}" class="btn btn-success">Source</a>
            <a target="_blank" href="${meal.strYoutube}" class="btn btn-danger">Youtube</a>
        </div>`;

  rowData.innerHTML = mealDetails;
}

////// on click menu ///////
$("#categories").on("click", async function () {
  closeSideMenu();
  rowData.innerHTML = "";
  searchContent.innerHTML = "";
  $(".loading-screen").fadeIn(300);

  let response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/categories.php`
  );
  response = await response.json();

  displayCategories(response.categories);
  $(".loading-screen").fadeOut(300);
});

$("#area").on("click", async function () {
  closeSideMenu();
  rowData.innerHTML = "";
  searchContent.innerHTML = "";
  $(".loading-screen").fadeIn(300);

  let response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/list.php?a=list`
  );
  response = await response.json();

  displayArea(response.meals);
  $(".loading-screen").fadeOut(300);
});

$("#ingredients").on("click", async function () {
  closeSideMenu();
  rowData.innerHTML = "";
  searchContent.innerHTML = "";
  $(".loading-screen").fadeIn(300);
  let response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/list.php?i=list`
  );
  response = await response.json();

  displayIngredients(response.meals.slice(0, 20));
  $(".loading-screen").fadeOut(300);
});

$("#contact").on("click", function () {
  showContacts();
});
////// search section *//////
$("#search").on("click", function () {
  closeSideMenu();
  searchContent.innerHTML = `
  <div class="row py-4 ">
      <div class="col-md-6 ">
          <input onkeyup="searchByName(this.value)" class="form-control bg-transparent text-white" type="text" placeholder="Search By Name">
      </div>
      <div class="col-md-6">
          <input onkeyup="searchByFLetter(this.value)" maxLength="1" class="form-control bg-transparent text-white" type="text" placeholder="Search By First Letter">
      </div>
  </div>`;

  rowData.innerHTML = "";
});

async function searchByName(name) {
  rowData.innerHTML = "";
  $(".loading-screen").fadeIn(300);

  let response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/search.php?s=${name}`
  );
  response = await response.json();

  response.meals ? displayMeals(response.meals) : displayMeals([]);
  $(".loading-screen").fadeOut(300);
}

async function searchByFLetter(letter) {
  rowData.innerHTML = "";
  $(".loading-screen").fadeIn(300);

  let response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/search.php?f=${letter}`
  );
  response = await response.json();

  response.meals ? displayMeals(response.meals) : displayMeals([]);
  $(".loading-screen").fadeOut(300);
}

///// contact ///

function showContacts() {
  closeSideMenu();
  rowData.innerHTML = `
   <div class="col-md-6">
                <input id="nameInput"  type="text" class="form-control" placeholder="Enter Your Name">
                <div id="nameAlert" class="text-danger w-100 mt-2 d-none">
                    Special characters and numbers not allowed
                </div>
            </div>
            <div class="col-md-6">
                <input id="emailInput"  type="email" class="form-control " placeholder="Enter Your Email">
                <div id="emailAlert" class="text-danger w-100 mt-2 d-none">
                    Email not valid *exemple@yyy.zzz
                </div>
            </div>
            <div class="col-md-6">
                <input id="phoneInput"  type="text" class="form-control " placeholder="Enter Your Phone">
                <div id="phoneAlert" class="text-danger w-100 mt-2 d-none">
                    Enter valid Phone Number
                </div>
            </div>
            <div class="col-md-6">
                <input id="ageInput"  type="number" class="form-control " placeholder="Enter Your Age">
                <div id="ageAlert" class="text-danger w-100 mt-2 d-none">
                    Enter valid age
                </div>
            </div>
            <div class="col-md-6">
                <input  id="passwordInput"  type="password" class="form-control " placeholder="Enter Your Password">
                <div id="passwordAlert" class="text-danger  w-100 mt-2 d-none">
                    Enter valid password *Minimum eight characters, at least one letter and one number:*
                </div>
            </div>
            <div class="col-md-6">
                <input  id="rePasswordInput"  type="password" class="form-control " placeholder="RePassword">
                <div id="rePasswordAlert" class="text-danger w-100 mt-2 d-none">
                    Enter valid rePassword 
                </div>
            </div>
        </div>
<button id="submitBtn" disabled class="btn btn-outline-danger px-2 mt-3 w-25 m-auto">Submit</button>
   `;
  function submit() {
    if (
      nameValidation() &&
      emailValidation() &&
      phoneValidation() &&
      ageValidation() &&
      passwordValidation() &&
      rePasswordValidation()
    ) {
      document.getElementById("submitBtn").removeAttribute("disabled");
    } else {
      document.getElementById("submitBtn").setAttribute("disabled", true);
    }
  }

  let nameInput = document.getElementById("nameInput");
  let emailInput = document.getElementById("emailInput");
  let phoneInput = document.getElementById("phoneInput");
  let ageInput = document.getElementById("ageInput");
  let passwordInput = document.getElementById("passwordInput");
  let rePasswordInput = document.getElementById("rePasswordInput");

  nameInput.addEventListener("input", function () {
    alertError(nameInput, nameValidation(), "nameAlert");
    submit();
  });
  emailInput.addEventListener("input", function () {
    alertError(emailInput, emailValidation(), "emailAlert");
    submit();
  });
  phoneInput.addEventListener("input", function () {
    alertError(phoneInput, phoneValidation(), "phoneAlert");
    submit();
  });
  ageInput.addEventListener("input", function () {
    alertError(ageInput, ageValidation(), "ageAlert");
    submit();
  });
  passwordInput.addEventListener("input", function () {
    alertError(passwordInput, passwordValidation(), "passwordAlert");
    submit();
  });
  rePasswordInput.addEventListener("input", function () {
    alertError(rePasswordInput, rePasswordValidation(), "rePasswordAlert");
    submit();
  });

  function alertError(element, res, error) {
    if (res) {
      element.classList.add("is-valid");
      element.classList.remove("is-invalid");
      document.getElementById(error).classList.replace("d-block", "d-none");
    } else {
      element.classList.add("is-invalid");
      element.classList.remove("is-valid");
      document.getElementById(error).classList.replace("d-none", "d-block");
    }
  }

  function nameValidation() {
    return /^[a-zA-Z]+$/.test(document.getElementById("nameInput").value);
  }

  function emailValidation() {
    return /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
      document.getElementById("emailInput").value
    );
  }

  function phoneValidation() {
    return /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/.test(
      document.getElementById("phoneInput").value
    );
  }

  function ageValidation() {
    return /^(0?[1-9]|[1-9][0-9]|[1][1-9][1-9]|200)$/.test(
      document.getElementById("ageInput").value
    );
  }

  function passwordValidation() {
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[ -/:-@\[-`{-~]).{6,64}$/.test(
      document.getElementById("passwordInput").value
    );
  }

  function rePasswordValidation() {
    return (
      document.getElementById("rePasswordInput").value ==
      document.getElementById("passwordInput").value
    );
  }
}
