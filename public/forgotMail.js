document.getElementById("forgotpwd").addEventListener("click", forgotPwd);

function forgotPwd(e) {
  e.preventDefault();
  const email = document.getElementById("email").value;
  //console.log(email);
  axios
    .post("http://34.229.93.168:3000/pwd", { email: email })
    .then((res) => {
      console.log(res);
    })
    .catch((err) => {
      console.log(err);
    });
}
