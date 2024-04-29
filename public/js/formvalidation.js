const form = document.getElementById('form');
const email = document.getElementById('email');
const designation = document.getElementById('designation');
const password = document.getElementById('password');
const password2 = document.getElementById('password2');
const username = document.getElementById('fname');
const lname = document.getElementById('lname');
const form_alert = document.getElementById('form_alert');

// Show input error messages
function showError(input, message) {
    const formControl = input.parentElement;
    formControl.className = 'col error';
    const small = formControl.querySelector('.small');
    small.innerText = message;
}

// Show success color
function showSuccess(input) {
    const formControl = input.parentElement;
    formControl.className = 'col success';
}

// Check email is valid
function checkEmail(input) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (re.test(input.value.trim())) {
        showSuccess(input)
    } else {
        showError(input, 'Email is invalid');
    }
}

// Check required fields
function checkRequired(inputArr) {
    inputArr.forEach(function (input) {
        if (input.value.trim() === '') {
            showError(input, `${getFieldName(input)} is required`)
        } else {
            showSuccess(input);
        }
    });
}

// Check input length
function checkLength(input, min, max) {
    // const alphabeticRegex = /^[a-zA-Z]+$/;
    // if (!alphabeticRegex.test(input.value)) {
    //     showError(input, `${getFieldName(input)} must contain only alphabet characters`);
    // } else 
    if (input.value.length < min) {
        showError(input, `${getFieldName(input)} must be at least ${min} characters`);
    } else if (input.value.length > max) {
        showError(input, `${getFieldName(input)} must be less than ${max} characters`);
    } else {
        showSuccess(input);
    }
}

// Get field name
function getFieldName(input) {
    return input.id.charAt(0).toUpperCase() + input.id.slice(1);
}

// Check passwords match
function checkPasswordMatch(input1, input2) {
    if (input1.value !== input2.value) {
        showError(input2, 'Passwords Do Not Match');
    }
}
function showFormSubmittedMessage() {
    form_alert.innerText = 'Form submitted successfully!';
    form_alert.className = 'alert alert-success';
}
// Event Listeners for Real-time Validation
email.addEventListener('input', function () {
    checkEmail(email);
});

designation.addEventListener('input', function () {
    checkLength(designation, 3, 15);
});

password.addEventListener('input', function () {
    checkLength(password, 6, 25);
});

password2.addEventListener('input', function () {
    checkLength(password2, 6, 25);
    checkPasswordMatch(password, password2);
});

username.addEventListener('input', function () {
    checkLength(username, 3, 15);
});

lname.addEventListener('input', function () {
    checkLength(lname, 3, 15);
});

// Event Listener for Submit Button
form.addEventListener('submit', function (e) {
    e.preventDefault();

    checkRequired([email, designation, password, username, lname]);
    checkLength(password, 6, 25);
    checkLength(password2, 6, 25);
    checkPasswordMatch(password, password2);
    checkLength(username, 3, 15);
    checkLength(lname, 3, 15);
    checkLength(designation, 3, 15);
    checkEmail(email);

    if (!document.querySelector('.error')) {
        showFormSubmittedMessage();
    }
});