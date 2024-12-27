// Event listener for 'Enter' key to trigger validation and calculation
document.querySelectorAll("input").forEach((input) => {
  input.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      // იმუშაოს როდესაც დავაჭერთ Enters
      validateAndCalculateTip();
    }
  });
});

// იმუშაოს პროცენტების ღილაკებმა ან ინფუთმა ,,sixth"
document.querySelectorAll(".mid-buttons button").forEach((button) => {
  button.addEventListener("click", function () {
    // Get the selected percentage based on the button clicked
    const percentage = parseFloat(this.textContent.replace("%", "").trim());
    document.getElementById("sixth").value = `${percentage}%`; // Update the custom input to reflect the selected percentage
    validateAndCalculateTip(); // Trigger calculation
  });
});

// ინფუთების საკალკულატორო გამოთვლისთვის
function validateAndCalculateTip() {
  // ინფუთებთან დაკავშირება
  const priceField = document.getElementById("price-field");
  const numberField = document.getElementById("number-field");
  const sixth = document.getElementById("sixth");

  // Values
  const priceValue = priceField.value.trim();
  const numberValue = numberField.value.trim();
  const sixthValue = sixth.value.trim();

  // გაასუფთაოს ერორები
  clearErrors();

  let hasError = false;

  // price-field ზე მუშაობა
  if (priceValue === "") {
    showError(priceField, "Can't be blank");
    hasError = true;
  } else if (!/^[0-9]+(\.[0-9]+)?$/.test(priceValue)) {
    showError(priceField, "Only numbers");
    hasError = true;
  }

  // sixth ზე მუშაობა ( იმუშაოს მხოლოდ იმ შემთხვევაში როცა ექნება %)
  if (sixthValue === "") {
    showError(sixth, "Can't be blank");
    hasError = true;
  } else if (!/^\d+(\.\d+)?%?$/.test(sixthValue)) {
    // Allow numbers and optional '%'
    showError(sixth, "Only numbers and an optional '%' at the end");
    hasError = true;
  }

  //  price-field ზე მუშაობა
  if (numberValue === "") {
    showError(numberField, "Can't be blank");
    hasError = true;
  } else if (!/^[0-9]+$/.test(numberValue)) {
    showError(numberField, "Only numbers");
    hasError = true;
  } else if (parseInt(numberValue, 10) === 0) {
    showError(numberField, "Can't be zero");
    hasError = true;
  }

  // თუ ერორი არ არსებობს გამოთვალოს
  if (!hasError) {
    calculateTip(priceValue, numberValue, sixthValue);
  }
}

// გამოთვალოს ამ ველებიდან (კალკულატორი)
function calculateTip(priceValue, numberValue, sixthValue) {
  // Extract percentage from the sixth input (remove "%" if it exists)
  let percentage = parseFloat(sixthValue.replace("%", "").trim());
  if (isNaN(percentage)) {
    alert("Please enter a valid percentage.");
    return;
  }

  // Step 1: გაიყოს ფასი ხალხის რაოდენობაზე
  const pricePerPerson = parseFloat(priceValue) / parseInt(numberValue, 10);

  // Step 2: გამოითვალოს ჩაი ერთ ადამიანზე პროცენტის მიხედვით
  const tipAmountPerPerson = (pricePerPerson * percentage) / 100;

  // Step 3: განაახლეთ ველი "Tip-mount-calculate" გამოთვლილი ჩაით ერთ ადამიანზე
  document.getElementById(
    "Tip-amount-calculate"
  ).value = `$${tipAmountPerPerson.toFixed(2)}`;

  // Step 4:  გამოთვალეთ ჯამური ჩაი ყველა ადამიანისთვის (ჩაი ადამიანზე * ხალხის რაოდენობა)
  const totalTipAmount = tipAmountPerPerson * parseInt(numberValue, 10);

  // Step 5: განაახლეთ ველი „Tip-amount-total“ ჯამური ჩაით ყველა ადამიანისთვის
  document.getElementById(
    "Tip-amount-total"
  ).value = `$${totalTipAmount.toFixed(2)}`;
}

// reset ღილაკი იმისთვის რომ ყველაფერი დაარესტარტოს
document.querySelector(".Reset").addEventListener("click", function () {
  // წვდომა ინფუთებთან
  const priceField = document.getElementById("price-field");
  const numberField = document.getElementById("number-field");
  const sixth = document.getElementById("sixth");

  // reset გაუკეთოს input ველებს.
  priceField.value = "";
  numberField.value = "";
  sixth.value = "";

  // ყველანაირი ერორი წაშალოს
  clearErrors();

  // ყველაფერი და reset ოს
  resetStyles();
});

// ფუნქციები გვიჩვენოს ერორები
function showError(inputField, message) {
  const errorElement = document.createElement("div");
  errorElement.className = "error-message";
  errorElement.textContent = message;

  inputField.parentElement.appendChild(errorElement);
}

// გაასუფთაოს ერორებისგან
function clearErrors() {
  const errorMessages = document.querySelectorAll(".error-message");
  errorMessages.forEach((message) => message.remove());
}

// Function to reset styles (e.g., remove any error styles or highlights)
function resetStyles() {
  const inputFields = document.querySelectorAll("input");
  inputFields.forEach((field) => {
    field.classList.remove("error"); // Assuming you add error class for styling
  });
}

// sixth შეყვანის ველს (პროცენტის მორგებული ველი) ავტომატურად მიემატოს „%“
document.getElementById("sixth").addEventListener("input", function () {
  let value = this.value.replace(/[^\d]/g, ""); // არ ჩააწერინოს რიცხვების გარდა სხვა რამ

  if (value) {
    value = Math.min(100, Math.max(1, parseInt(value, 10))); // ჩაწეროს 1-დან 100მდე
  }

  this.value = value ? value + "%" : ""; // ავტომატურად დაემატოს %
});
