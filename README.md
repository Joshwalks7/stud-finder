# Stud Finder

I absolutely love collection and building LEGO! One thing I have always wanted was to have a digitalized accurate inventory of my sets and keep track of ones I want. I also love interacting with the Rebrickable API for LEGO data. This mobile app uses a React frontend built with TypeScript and a simple express backend.

## Instructions for Build and Use

Steps to install, build, and/or run the software:

1. Install Node.js and npm.
2. Clone or download this repository and open a terminal in the project folder.
3. Install dependencies:

   ```powershell
   npm install
   ```

4. Create a `.env` file in the project root and add your Rebrickable API key:

   ```env
   REBRICKABLE_API_KEY=your_api_key_here
   ```

5. Start the backend in one terminal:

   ```powershell
   npm run server
   ```

6. Start the React development server in a second terminal:

   ```powershell
   npm run dev
   ```

7. Open the local URL shown by Vite, usually `http://localhost:5173`.

8. To create a production build, run:

   ```powershell
   npm run build
   ```

9. To check the project with ESLint, run:

   ```powershell
   npm run lint
   ```

   

Instructions for using the software:

1. Search for LEGO sets by name or set number on the Home page.
2. Add sets to My Collection or to the Wishlist.
3. Open My Collection to increase quantities, decrease quantities, or remove sets.
4. Open Wishlist to view saved sets, visit their Rebrickable pages, or remove them.
5. Collection and wishlist data currently persist in the browser's local storage.

## Development Environment

* React
* TypeScript
* Vite
* React Router
* Express
* Node.js and npm
* Rebrickable API v3
* ESLint

The frontend runs on Vite and the backend runs on Express. The Express server keeps
the Rebrickable API key out of the browser and forwards search requests to Rebrickable.
The frontend communicates with the backend through the `/api` proxy configured in
`vite.config.ts`.


## Useful Websites to Learn More

I found these websites useful in developing this software:

* [w3schools Tutorial](https://www.w3schools.com/typescript/index.php)
* [YouTube React Context Tutorial](https://youtu.be/HYKDUF8X3qI)

## Future Work

The following items I plan to fix, improve, and/or add to this project in the future:

* [ ] Add database-backed persistence with AWS
* [ ] Host the server and app on AWS Amplify
* [ ] Add user authentication
* [ ] Create the Explore feature
* [ ] Calculate the percentage of a set that could be built from the collection's pieces
* [ ] Add detailed set inventories and part-level collection tracking
* [ ] Add purchase prices, notes, condition, and wishlist priorities
