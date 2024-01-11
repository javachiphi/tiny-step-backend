# Tiny-step Backend 

## Overview
The Diary Backend serves as a RESTful API for the Tiny Step frontend application. It manages diary entries and tags data.

## Technologies Used

- Express.js / Sequelize
- Auth0 & JWT Tokens
- PostgreSQL

## API Endpoints

### User
- POST /user: Creates or finds a user upon login via Auth0. Records only jwtSub. User management is primarily handled by Auth0. Seeds data for new users.
- DELETE /user/:userId: Deletes a user record.
- Entry Endpoints:

### Entries 
- GET /entries: Retrieves a list of entries by a user.
- GET /entries/tagFilter: Filters entries by tags.
- POST /entries: Creates a new entry.
- DELETE /entries/:entryId: Deletes an entry.

### Tags
- GET /tags/combined: Retrieves user tags and associated entry tags.
- GET /tags: Lists all tags associated with a user.
- GET /tags/:tagId: Retrieves a specific tag.
- PUT /tags/:tagId: Updates a tag.
- DELETE /tags/:tagId: Deletes a tag.


## Environment Variables
- For development, provide DB related credentials 
Example. 
DB_USERNAME=dev_user
DB_NAME=diary_development
DB_HOST=localhost
DB_DIALECT=postgres
NODE_ENV=development
FRONT_URL=http://localhost:3000


## Deploymnet 
This app is containerized and deployed on fly.io.
- Ensure dockerfile and fly.toml are properly set up.
- Deploy using `flyctl deploy`
- Set up a PostgreSQL database and configure environment variables on fly.io.

## Contact Information
For any inquiries or support, please contact me at javachiphi@gmail.com
