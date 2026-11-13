# Stud Finder

I absolutely love collection and building LEGO! One thing I have always wanted was to have a digitalized accurate inventory of my sets and keep track of ones I want. I also love interacting with the Rebrickable API for LEGO data. This mobile app uses a React frontend built with TypeScript and a simple express backend. The project is hosted on AWS Elastic Beanstalk utilizing Cognito and DynamoDB. 

## Instructions for Build and Use

Steps to install, build, and run the software locally:

1. Install Node.js and npm.
2. Clone or download this repository and open a terminal in the project folder.
3. Install dependencies:

   ```powershell
   npm install
   ```

4. Create a `.env` file in the project root. Add the Rebrickable API key and Cognito frontend configuration:

   ```env
   REBRICKABLE_API_KEY=your_api_key_here
   VITE_COGNITO_USER_POOL_ID=your_user_pool_id
   VITE_COGNITO_CLIENT_ID=your_app_client_id
   VITE_COGNITO_REGION=us-east-1
   ```

   Never commit `.env` or share its secret values.

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

9. To run the production server locally after building, run:

   ```powershell
   npm start
   ```

10. To check the project with ESLint, run:

   ```powershell
   npm run lint
   ```

For Elastic Beanstalk deployment, upload a ZIP containing `dist`, `server`,
`package.json`, and `package-lock.json`. Configure these backend environment
variables in Elastic Beanstalk instead of placing `.env` in the ZIP:

```text
REBRICKABLE_API_KEY=your_api_key_here
COGNITO_USER_POOL_ID=your_user_pool_id
COGNITO_CLIENT_ID=your_app_client_id
```

The DynamoDB table names default to `StudFinderCollection` and
`StudFinderWishlist`. The AWS environment must have permission to access those
tables.

## Instructions for Using the Software

1. Search for LEGO sets by name or set number on the Home page.
2. Create an account or sign in through the Account page.
3. Add sets to My Collection or to the Wishlist.
4. Open My Collection to increase quantities, decrease quantities, or remove sets.
5. Open Wishlist to view saved sets, visit their Rebrickable pages, or remove them.
6. Collection and wishlist data are stored in DynamoDB and associated with the
   signed-in user's Cognito ID.
7. Sign out from the Account page when finished.

## Development Environment

* React
* TypeScript
* Vite
* React Router
* Express
* Node.js and npm
* Rebrickable API v3
* Amazon Cognito
* Amazon DynamoDB
* AWS Elastic Beanstalk
* ESLint

During development, Vite serves the React frontend on port 5173 and proxies
`/api` requests to the Express server on port 3001. The Express server keeps the
Rebrickable API key out of the browser and forwards search requests to Rebrickable.

In production, Express serves the built files from `dist` and handles the API
routes. Elastic Beanstalk supplies the server's `PORT` value and provides the
AWS environment in which the application accesses DynamoDB.


## Useful Websites to Learn More

I found these websites useful in developing this software:

* [w3schools Tutorial](https://www.w3schools.com/typescript/index.php)
* [YouTube React Context Tutorial](https://youtu.be/HYKDUF8X3qI)

## Future Work

The following items I plan to fix, improve, and/or add to this project in the future:

* [ ] Create the Explore Page
* [ ] Calculate the percentage of a set that could be built from the collection's pieces
* [ ] Add detailed set inventories and part-level collection tracking
* [ ] Add purchase prices, notes, condition, and wishlist priorities
* [ ] Create a more user-friendly URL for the project
