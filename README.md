# WTWR (What to Wear?): Back End

This project is the backend for the WTWR (What to Wear?) application. It provides a RESTful API for managing users and clothing items, including features for creating, retrieving, deleting, and liking/unliking clothing items. The backend is built with Node.js, Express, and MongoDB, and follows best practices for error handling, validation, and project structure.

## Project Functionality

- User management: create users, get all users, get a user by ID.
- Clothing item management: create, get, and delete clothing items.
- Like/unlike functionality for clothing items.
- All data is stored in a MongoDB database.
- Error handling for invalid data, invalid IDs, and not found resources.
- Linting and code style enforced with ESLint and Prettier.

## Technologies and Techniques Used

- **Node.js** and **Express** for building the server and API.
- **MongoDB** and **Mongoose** for database and schema modeling.
- **Validator** package for validating URLs.
- **ESLint** with the Airbnb base config and Prettier for code style and linting.
- **RESTful API** design.
- **Error handling** with custom error codes and messages.
- **Environment variables** for configuration.
- **Modular project structure** with separate folders for controllers, routes, models, and utilities.

## Running the Project

- `npm run start` — to launch the server
- `npm run dev` — to launch the server with hot reload

## Testing

Before committing your code, make sure you edit the file `sprint.txt` in the root folder. The file `sprint.txt` should contain the number of the sprint you're currently working on. For ex. 12
