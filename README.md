**Clone this repo**

`git clone git@github.com:yell66w/express-ade.git`

`cd express-ade `

**Install Packages**

`npm i `

**Environmental Variables**

1. Create a .env file inside the root folder
2. Copy the contents of .env.sample inside .env

`cp .env.sample .env`

3. Create a database for this project

   ```
   //connect to your database with `mysql -u user -p`
   CREATE DATABASE demo;
   //You can also create a database using phpmyadmin
   ```

4. Update the environmental variables based on your database configuration
   `mysql://USER:PASSWORD@HOST:PORT/DATABASE `

**Run the development server**

`npx prisma generate`

`npm run dev`

Server will run at http://localhost:6000

**Migrate and seed**

`npx prisma migrate reset`

```
//in another terminal, run prisma studio to view the seeded data at localhost:5555
npx prisma studio
```

**Testing the API**

Stop the server (Ctrl+C or Ctrl+Z on your terminal)

`npm run test`
