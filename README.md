# IREM Test Project

A responsive, dynamic web application that demonstrates a slider, dropdown menu, dynamic flavor browsing, and a contact form. This project was built as part of a test assignment and includes a focus on both backend and frontend development.

---

## Project Features

### 1. **Homepage**
- Contains a responsive image slider showcasing capabilities (`Design`, `Production`, `Certification`).
- A dynamic "Get a Quote" form integrated with the backend.
- Dropdown menus for navigation (`Capabilities`, `Flavors`).

### 2. **Flavors Page**
- Dynamically loads flavor categories from the database.
- Each category links to its own dedicated page.

### 3. **Flavor Category Page**
- Displays all flavors under the selected category in a well-styled list.
- Includes a "Get a Quote" form on the right side.

---

## Technologies Used

### Backend
- **Node.js**: Server-side JavaScript runtime.
- **Express.js**: Web framework for routing and API handling.
- **SQLite**: Lightweight database for storing capabilities, categories, flavors, and quotes.

### Frontend
- **HTML5**: Structure of the web pages.
- **CSS3**: Styling with responsive design.
- **JavaScript**: Interactivity, dynamic content loading, and API calls.

---

## Installation

1. **Clone the Repository**
   ```bash
   git clone https://github.com/thehiddengem/IREM.git
   cd IREM
2. **Install Dependencies**
   npm install
3. **Database Setup**
   Ensure flavors.db exists in the project root. If 
   starting fresh, import flavors.csv by running the 
   server (step 4).
4. **Run the Server**
   node server.js
