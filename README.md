# Reading Tracker Project

## Project Description
This project is a modern web application designed for users who want to remember what they read and improve their overall reading experience. It allows users to maintain a secure account, curate a "Want to Read" list, and update books to "Currently Reading" status. This Minimum Viable Product (MVP) establishes the core technical foundation and authentication workflow before introducing more complex features like rich-text note-taking and search functionalities.

## System Architecture & Design Patterns
This application utilizes a modern web development stack with React for the frontend and Node.js/Express for the backend. 

The system follows the **Model-View-Controller (MVC)** architectural design pattern to ensure a clear separation of concerns:
* **Model (`backend/models/db.js`):** Manages the data layer. For this Sprint 1 MVP, an in-memory data store (arrays) is utilized for rapid development and testing, ensuring the core logic is sound before connecting a persistent database in future sprints.
* **View (React Frontend):** Handles the dynamic user interface and data presentation. React was chosen for its dynamic performance capabilities. 
* **Controller (`backend/controllers/`):** The Express backend serves as the bridge between the client interface and the data layer. It handles business logic, processing incoming requests, and secure user authentication via JWT and bcrypt.

## Setup Instructions

### Prerequisites
* Node.js installed on your local machine.
* Git for version control.

### Installation
1.  **Clone the repository:**
    ```
    git clone [https://github.com/YOUR_GITHUB_USERNAME/fppb-reading-tracker-mvp.git](https://github.com/YOUR_GITHUB_USERNAME/fppb-reading-tracker-mvp.git)
    cd fppb-reading-tracker-mvp
    ```

2.  **Backend Setup:**
    ```
    cd backend
    npm install
    npm start
    ```
    *The backend will run on `http://localhost:5000`.*

3.  **Frontend Setup:**
    ```
    cd ../frontend
    npm install
    npm run dev
    ```
    *The frontend will run on the local Vite port provided in the terminal (usually `http://localhost:5173`).*

## Usage Examples
1.  **Authentication:** Upon loading the app, create a new account by entering a username and password. The system will securely hash your password and grant you access.
2.  **Building a Library:** Enter a book title and click "Add Book" to place it in your "Want to Read" list.
3.  **Updating Status:** Click the "Start Reading" button next to a book in your list to transition it to "Currently Reading" status.

*(Note: Replace this section with actual screenshots of your application interfaces prior to final submission.)*
* `[Screenshot of Login Screen]`
* `[Screenshot of User Dashboard with a populated list]`

## Troubleshooting Guidance
* **CORS Errors:** If the frontend cannot communicate with the backend, ensure your backend `server.js` includes `app.use(cors())` and that the frontend axios requests are pointing to the correct backend port.
* **Port Conflicts:** If port `5000` is already in use, change the `PORT` variable in the backend `.env` file or `server.js` to `5001` or another available port, and update the frontend API calls accordingly.
* **Nodemon/Vite not recognized:** Ensure you have run `npm install` in both the `frontend` and `backend` directories to install all necessary dependencies.

## Known Limitations & Planned Future Enhancements
* **Data Persistence:** The current MVP uses an in-memory database. If the backend server restarts, user accounts and book lists will reset. A persistent database will be implemented in Sprint 2.
* **Rich Text Notes:** Currently, the system only supports tracking titles and status. Future iterations will include rich text functionality (bold, italics, bullet points) for detailed chapter note-taking.
* **Search & Filtering:** Sprint 3 will introduce the ability to search the library by title or author to easily find past reads.
* **Post-Book Summaries & Ratings:** Future updates will allow users to mark a book as finished, provide a star rating, and write a final summary.

-----------------------------------------------------
**Author:** Alex Baker
