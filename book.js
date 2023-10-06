// Define global variables
let bookList = [];

// Function to fetch and display the book list
async function fetchAndDisplayBookList() {
  try {
    const response = await fetch("app/select.php");
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    displayBookList(data);
  } catch (error) {
    console.error("Error fetching book list:", error);
  }
}

// Display the book list
function displayBookList(data) {
  const bookListContainer = document.querySelector("#book-list");
  bookListContainer.innerHTML = "";

  data.forEach((book) => {
    const bookItem = document.createElement("div");
    bookItem.innerHTML = `
      <h3>${book.title}</h3>
      <p>Author: ${book.name}</p>
      <p>Publication Year: ${book.publication_year}</p>
      <button class="delete-button">Delete</button>
    `;
    bookListContainer.appendChild(bookItem);
  });
}

// Handle form submission to add a new book
async function handleAddBook(event) {
  event.preventDefault();
  const bookForm = document.querySelector("#book-form");
  const formData = new FormData(bookForm);
  const url = "app/insert_book.php";

  try {
    // Fetch the authorID based on the author's name
    const authorName = formData.get("author_name");
    const authorID = await getAuthorID(authorName);
    console.log(authorID);

    if (authorID !== null) {
      // Add authorID to formData
      formData.set("authorID", authorID);

      const response = await fetch(url, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const result = await response.json();
      console.log(JSON.stringify(result));
      if (result) {
        console.log("result");
      }

      if (result["success"]) {
        console.log("result.sucess");
      }

      if (result) {
        fetchAndDisplayBookList(); // Refresh the displayed book list
        document.querySelector("#book-form").reset(); // Clear the form fields
      } else if (result && result.error) {
        console.error("Error adding book:", result.error); // Log the specific error message
      } else {
        console.error("Unknown error occurred.");
      }
    } else {
      console.error("Author not found.");
    }
  } catch (error) {
    console.error("Error adding book:", error);
  }
}

// Function to fetch the authorID based on the author's name
async function getAuthorID(authorName) {
  const url = "app/get_author_id.php";
  const formData = new FormData();
  formData.append("authorName", authorName);

  try {
    const response = await fetch(url, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const result = await response.json();

    if (result && result.authorID) {
      return result.authorID;
    } else if (result && result.error) {
      console.error("Error fetching author ID:", result.error);
      return null;
    } else {
      console.error("Unknown error occurred.");
      return null;
    }
  } catch (error) {
    console.error("Error fetching author ID:", error);
    return null;
  }
}

// Add a new book to the database
async function addBook(data, url) {
  try {
    const response = await fetch(url, {
      method: "POST",
      body: data,
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const result = await response.json();

    console.log("Response from server:", result); // Log the response

    if (result && result.success) {
      fetchAndDisplayBookList(); // Refresh the displayed book list
      document.querySelector("#book-form").reset(); // Clear the form fields
    } else {
      console.error("Error adding book:", result && result.error);
    }
  } catch (error) {
    console.error("Error adding book:", error);
  }
}
// Initialize the page by fetching and displaying the book list
fetchAndDisplayBookList();

// Set up form submission event listener
const bookForm = document.querySelector("#book-form");
bookForm.addEventListener("submit", handleAddBook);
