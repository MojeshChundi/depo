const leader = document.getElementById("rzp1");

let isprem = localStorage.getItem("ispremium");
console.log("ispremium:", isprem);
if (isprem === "true") {
  document.getElementById("premuser").style.display = "block";
  document.getElementById("rzp1").style.display = "block";
  document.getElementById("download").style.display = "block";
} else {
  document.getElementById("rzp").style.display = "block";
}

// BACKEND DATA RENDER ON FRONT END

let resultDiv = document.getElementById("result");
let OutputHTML;
function showOutput(data) {
  data.forEach((data) => {
    OutputHTML = `
  <ul class="product-list">
    <li class="product-name">cost: ${data.spentAmount}</li>
    <li class="selling-price">description: ${data.Description}</li>
    <li class="product-desc">category: ${data.category}</li>
    <li class="product-actions">
    <button class="delete-button" onclick="deleteData('${data.id}','${data.spentAmount}')">Delete</button>
   <button class="edit-button" onclick="updateData('${data.spentAmount}','${data.Description}',' ${data.category}')">Edit</button>
   <button class="update-button" onclick="updatedData('${data.id}','${data.spentAmount}')">Update</button>
    </li>
  </ul>`;
    resultDiv.innerHTML += OutputHTML;
  });
}

//POST REQUEST

const form = document
  .getElementById("expense-form")
  .addEventListener("submit", networkCall);

function networkCall(event) {
  event.preventDefault();
  const token = localStorage.getItem("token");
  const spentAmount = document.getElementById("name").value;
  const Description = document.getElementById("email").value;
  const category = document.getElementById("phone").value;
  const data = { spentAmount, Description, category };
  axios
    .post("http://localhost:3000/user/add-Expense", data, {
      headers: { Auth: token },
    })
    .then(function (res) {
      showOutput(res.data.data);
      console.log(res.data.data);
      console.log("user created!");
    })
    .catch(function (err) {
      console.log(err.name);
    });

  document.getElementById("name").value = "";
  document.getElementById("email").value = "";
  document.getElementById("phone").value = "";
}

//DELETE REQUEST

function deleteData(id, amount) {
  const token = localStorage.getItem("token");
  axios
    .post(
      "http://localhost:3000/user/delete-Expense",
      {
        id: id,
        spentAmount: amount,
      },
      { headers: { Auth: token } }
    )
    .then(function (res) {
      console.log("user deleted!");
    })
    .catch((err) => console.log(err));

  location.reload();
}

// RAZORPAY
document.getElementById("rzp").onclick = async (e) => {
  const token = localStorage.getItem("token");
  const response = await axios.get(
    "http://localhost:3000/user/purchasePremium",
    { headers: { Auth: token } }
  );
  console.log("success response", response.data);
  //console.log(response.data.order.id);
  var options = {
    key: response.data.key_id,
    order_id: response.data.order.id,
    handler: async function (response) {
      await axios
        .post(
          "http://localhost:3000/user/status",
          {
            order_id: options.order_id,
            payment_id: response.razorpay_payment_id,
          },
          { headers: { Auth: token } }
        )
        .then((res) => {
          console.log(res.data.user);
          localStorage.setItem("ispremium", res.data.user.ispremium);
          let isprem = localStorage.getItem("ispremium");
          console.log("ispremium:", isprem);
          location.reload();
        })
        .catch((err) => console.log(err));
      window.alert("you are a premium member!");
    },
  };
  const rzp1 = new Razorpay(options);
  rzp1.open();
  e.preventDefault();
  rzp1.on("payment.failed", async function (response) {
    await axios.post(
      "http://localhost:3000/user/status",
      {
        order_id: options.order_id,
        payment_id: response.razorpay_payment_id,
        pf: "fail",
      },
      { headers: { Auth: token } }
    );
    console.log("payment failed response", response);
    window.alert("something went wrong!");
  });
};
// LOAD DATA

window.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token");
  axios
    .get("http://localhost:3000/user/get-Expense", {
      headers: { Auth: token },
    })
    .then((res) => {
      let data = res.data.data;
      console.log(res.data.data);
      showOutput(data);
      updatePagination(res.data);
    })
    .catch((err) => {
      console.log(err);
    });
});

//PAGINATION

let pagesizeInput = document.querySelector("#pagesize");
pagesizeInput.addEventListener("change", () => {
  const pagesize = pagesizeInput.value;
  localStorage.setItem("pagesize", pagesize);
  getProducts();
});

const pagination = document.getElementById("pagination");
function updatePagination({
  currentPage,
  hasNextPage,
  nextPage,
  hasPrevousPage,
  previousPage,
  lastPage,
}) {
  pagination.innerHTML = "";
  const btn1 = document.createElement("button");
  btn1.id = "btn";
  btn1.innerHTML = currentPage;
  btn1.addEventListener("click", () => getProducts(currentPage));
  pagination.appendChild(btn1);
  if (hasNextPage) {
    const btn2 = document.createElement("button");
    btn2.id = "btn";
    btn2.innerHTML = nextPage;
    btn2.addEventListener("click", () => getProducts(nextPage));
    pagination.appendChild(btn2);
  }
  if (hasPrevousPage) {
    const btn3 = document.createElement("button");
    btn3.id = "btn";
    btn3.innerHTML = previousPage;
    btn3.addEventListener("click", () => getProducts(previousPage));
    pagination.appendChild(btn3);
  }
}

const getProducts = (page) => {
  const token = localStorage.getItem("token");
  const limit = localStorage.getItem("pagesize");
  axios
    .get(`http://localhost:3000/user/get-Expense?page=${page}&limit=${limit}`, {
      headers: {
        Auth: token,
        page: page,
        "Cache-Control": "no-store",
        Pragma: "no-cache",
      },
    })
    .then((res) => {
      resultDiv.innerHTML = "";
      let data = res.data.data;
      showOutput(data);
      updatePagination(res.data);
      pagesizeInput.value = limit;
    })
    .catch((err) => {
      console.log(err);
    });
};

// LEADER BOARD
let leaderDetails = document.getElementById("leaderDetails");
let heading = document.getElementById("heading");
//console.log(heading);
function leaderBoardDetails(data) {
  heading.innerHTML = "<h1>Leaderboard</h1>";
  const outputHTML = `
    <ul>
      <li>
        <span>Name:</span>
        <span>${data.name}</span>
        <span>Total expense:</span>
        <span>${data.totalExpense}</span>
      </li>
    </ul>
  `;
  leaderDetails.innerHTML += outputHTML;
}

// LEADER BOARD

leader.addEventListener("click", leaderBoard);

async function leaderBoard() {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get("http://localhost:3000/user/premuser", {
      headers: { Auth: token },
    });
    console.log(response.data);
    response.data.userDetails.forEach((data) => {
      leaderBoardDetails(data);
    });
  } catch (err) {
    console.log("premuser error::", err);
  }
}

function updateData(amount, des, cat) {
  // populate the input fields
  const inputAmount = document.getElementById("name");
  const inputDescription = document.getElementById("email");
  const inputCategory = document.getElementById("phone");
  inputAmount.value = amount;
  inputDescription.value = des;
  inputCategory.value = cat;
}

//UPDATE DATA IN DATABASE
function updatedData(id, amount) {
  const token = localStorage.getItem("token");
  const spentAmount = document.getElementById("name").value;
  const Description = document.getElementById("email").value;
  const category = document.getElementById("phone").value;

  //const editedAmount = Math.abs(amount - spentAmount);
  const data = { id, spentAmount, Description, category, amount };

  //post data to the back end
  axios
    .post("http://localhost:3000/user/update-Expense", data, {
      headers: { Auth: token },
    })
    .then(function (res) {
      console.log("user updated!");
    })
    .catch((err) => console.log(err));
}

// downlod expenses file

const download = document.getElementById("download");
download.addEventListener("click", downloadExpense);

async function downloadExpense() {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(
      "http://localhost:3000/user/downloadfile",
      {
        headers: { Auth: token },
      }
    );
    if (response.status === 200) {
      const a = document.createElement("a");
      a.href = response.data.fileURl;
      a.download = "myexpense.esv";
      a.click();
    }
  } catch (err) {
    console.log(err);
  }
}
