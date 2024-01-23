const apiUrl = "https://run.mocky.io/v3/ca6344d4-bf83-4daa-af2f-2e4999b89296";
const userDataContainer = document.getElementById("userData");
const searchInput = document.getElementById("searchInput");

const userData = [];
async function fetchData() {
  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    data.forEach((element) => userData.push(element));
  } catch (error) {
    console.error("Error fetching data:", error.message);
  }
}

function displayUserData(data) {
  userDataContainer.innerHTML = "";
  data.forEach((user) => {
    const userCard = document.createElement("div");
    userCard.classList.add("userCard");

    const userInfo = `
    <p>Name: ${user.name}</p>
    <p>Age: ${user.age}</p>
    <p>Gender: ${user.gender}</p>
    <p>Email: ${user.email}</p>
    <p>Address: ${user.address}</p>
  `;

    userCard.innerHTML = userInfo;
    userDataContainer.appendChild(userCard);
  });
}

searchInput.addEventListener("input", () => {
  setTimeout(() => {
    const searchTerm = searchInput.value.toLowerCase();
    if (searchTerm) {
      const filteredUsers = userData.filter((user) =>
        user.name.toLowerCase().includes(searchTerm)
      );
      displayUserData(filteredUsers);
    } else {
      displayUserData("");
    }
  }, 500);
});

window.onload = fetchData();
