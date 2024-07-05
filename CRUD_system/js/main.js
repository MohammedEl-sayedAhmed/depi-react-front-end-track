document.addEventListener("DOMContentLoaded", function () {
  // Initialize variables and get DOM elements
  const itemForm = document.getElementById("itemForm");
  const itemTableBody = document.getElementById("itemTableBody");
  const searchBar = document.getElementById("searchBar");
  const submitButton = document.getElementById("submitButton");
  const updateButton = document.getElementById("updateButton");
  const filterCriteria = document.getElementById("filterCriteria");
  let items = JSON.parse(localStorage.getItem("items")) || []; // Retrieve items from localStorage or initialize an empty array
  let currentEditIndex = -1; // Track the index of the item being edited

  // Function to render items to the table
  function renderItems(itemsToRender) {
    itemTableBody.innerHTML = ""; // Clear the table body
    itemsToRender.forEach((item, index) => {
      const row = document.createElement("tr");
      row.innerHTML = `
          <td>${item.name}</td>
          <td>${item.price}</td>
          <td>${item.category}</td>
          <td>${item.description}</td>
          <td>
              <button class="btn btn-info btn-sm" onclick="editItem(${index})">Edit</button>
              <button class="btn btn-danger btn-sm" onclick="deleteItem(${index})">Delete</button>
          </td>
      `;
      itemTableBody.appendChild(row); // Append the row to the table body
    });
  }

  // Function to add a new item
  function addItem(item) {
    items.push(item); // Add item to the array
    localStorage.setItem("items", JSON.stringify(items)); // Save items to localStorage
    renderItems(items); // Render items to the table
  }

  // Function to update an existing item
  function updateItem(index, newItem) {
    items[index] = newItem; // Update the item in the array
    localStorage.setItem("items", JSON.stringify(items)); // Save items to localStorage
    renderItems(items); // Render items to the table
  }

  // Function to delete an item
  function deleteItem(index) {
    items.splice(index, 1); // Remove item from the array
    localStorage.setItem("items", JSON.stringify(items)); // Save items to localStorage
    renderItems(items); // Render items to the table
  }

  // Function to edit an item
  window.editItem = function (index) {
    const item = items[index];
    // Populate form with item details
    document.getElementById("itemName").value = item.name;
    document.getElementById("itemPrice").value = item.price;
    document.getElementById("itemCategory").value = item.category;
    document.getElementById("itemDescription").value = item.description;
    currentEditIndex = index; // Set the current edit index
    submitButton.classList.add("d-none"); // Hide submit button
    updateButton.classList.remove("d-none"); // Show update button
  };

  // Function to handle form submission for adding a new item
  function addNewItem(e) {
    e.preventDefault(); // Prevent default form submission
    const newItem = {
      name: document.getElementById("itemName").value,
      price: document.getElementById("itemPrice").value,
      category: document.getElementById("itemCategory").value,
      description: document.getElementById("itemDescription").value,
    };
    addItem(newItem); // Add the new item
    itemForm.reset(); // Reset the form
  }

  // Function to handle updating an existing item
  function updateExistingItem(e) {
    e.preventDefault(); // Prevent default form submission
    const updatedItem = {
      name: document.getElementById("itemName").value,
      price: document.getElementById("itemPrice").value,
      category: document.getElementById("itemCategory").value,
      description: document.getElementById("itemDescription").value,
    };
    updateItem(currentEditIndex, updatedItem); // Update the item
    itemForm.reset(); // Reset the form
    submitButton.classList.remove("d-none"); // Show submit button
    updateButton.classList.add("d-none"); // Hide update button
    currentEditIndex = -1; // Reset the current edit index
  }

  // Function to filter items based on search input
  function filterItems() {
    const query = searchBar.value.trim().toLowerCase();
    const criteria = filterCriteria.value;

    const filteredItems = items.filter((item) => {
      let itemValue = item[criteria].toString().toLowerCase();

      // Handle specific validation for numeric fields like price
      if (criteria === "price") {
        // Check if query is not empty and is numeric
        if (query && !isNaN(query)) {
          return parseFloat(itemValue) === parseFloat(query);
        }
        return true; // Return true to show all items if query is empty or not numeric
      }

      // Default behavior for non-numeric fields
      return itemValue.includes(query);
    });

    renderItems(filteredItems); // Render filtered items
  }

  // Event listeners
  searchBar.addEventListener("input", function () {
    const criteria = filterCriteria.value;
    if (criteria === "price") {
      // Remove non-numeric characters from input
      searchBar.value = searchBar.value.replace(/[^\d.]/g, "");
    }
    filterItems(); // Filter items based on search input
  });

  filterCriteria.addEventListener("change", function () {
    // Reset search bar value when criteria changes
    searchBar.value = "";
    filterItems(); // Re-filter items based on new criteria
  });

  itemForm.addEventListener("submit", addNewItem); // Handle form submission for adding a new item
  updateButton.addEventListener("click", updateExistingItem); // Handle form submission for updating an item

  // Initial render of items
  renderItems(items);
});
