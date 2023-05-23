// Code that depends on the DOM being loaded goes here
var logIn = document.getElementById("logIn");
logIn.addEventListener("click", logIns);
function logIns(e) {
  e.preventDefault();
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const userDetails = { email, password };
  //console.log(userDetails);
  axios
    .post("http://localhost:3000/user/login", userDetails)
    .then((res) => {
      console.log(res.data.user[0].ispremium);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("ispremium", res.data.user[0].ispremium);
      window.alert("login successfully!!");
      window.location.href = "http://127.0.0.1:5500/public/expense.html";
    })
    .catch((err) => {
      const OutputHTML = `<ul style="list-style-type: none; background-color: #f8d7da; color: #721c24; padding: 10px; border: 2px solid #f5c6cb; border-radius: 5px; box-shadow: 0 0 10px rgba(0,0,0,.2); text-align: center;"><li>please enter valid username ans password</li></ul>`;
      error.innerHTML += OutputHTML;
      console.log(err);
    });
}

// forgot mail form

function forgotMail() {
  window.location.href = "http://127.0.0.1:5500/public/forgotMail.html";
}
