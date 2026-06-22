# Wanderlust — Full Project Instructions & Reference

---

## Module 1 — Project Setup & Folder Structure

### Goal
Create the skeleton of the project — the folders and files that hold everything together.

---

### What is MVC?

**MVC = Model + View + Controller**

Think of it like a restaurant:

- The **Menu** (what food exists) → **Model** — defines data shape in the database
- The **Waiter** (takes order, brings food) → **Controller** — handles requests, talks to Model, sends response
- The **Table/Plate** (what you see) → **View** — the HTML page the user sees (EJS templates)

In our Wanderlust app:
  - A user visits /listings (makes a request)
  - The Route sends it to the right Controller
  - The Controller asks the Model (database) for all listings
  - The Model returns the data
  - The Controller passes it to the View (EJS template)
  - The View renders it as HTML — the user sees the page

  Request → Route → Controller → Model (DB) → Controller → View → Response


**Data flow in every request:**
```
Request → Route → Controller → Model (DB) → Controller → View → Response
```

---

### Step 1 — Initialize the Project

```bash
npm init -y
```

Creates `package.json` — the identity card of your Node.js project.

---

### Step 2 — Install Core Dependencies

```bash
npm install express mongoose ejs method-override
```

- `express` — Web framework, handles routes and HTTP
- `mongoose` — Talks to MongoDB (ODM — Object Data Mapper)
- `ejs` — Templating engine, lets you write HTML with dynamic JS
- `method-override` — Lets HTML forms send PUT and DELETE requests (forms only support GET/POST natively)

---

### Step 3 — Folder Structure

```
AirBNB_Wanderlust/
│
├── models/              ← Mongoose schemas (Model in MVC)
├── controllers/         ← Request handlers (Controller in MVC)
├── routes/              ← Express routers
├── views/               ← EJS templates (View in MVC)
│   └── listings/        ← Listing-specific pages
├── public/              ← Static files (CSS, JS, images)
│   ├── css/
│   └── js/
├── utils/               ← Helper utilities (error class, async wrapper)
├── app.js               ← Entry point — sets up Express
└── package.json         ← Created by npm init
```

Terminal command to create all folders at once:
```bash
mkdir models controllers routes views views/listings public public/css public/js utils
touch app.js
```

---

### Step 4 — app.js (Entry Point)

```js
const express = require("express");
const app = express();
const path = require("path");
const methodOverride = require("method-override");

// Tell Express where to find EJS views
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middleware to parse form data and JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Middleware to support PUT and DELETE from HTML forms
app.use(methodOverride("_method"));

// Serve static files (CSS, JS) from /public
app.use(express.static(path.join(__dirname, "public")));

// Test route
app.get("/", (req, res) => {
  res.send("Wanderlust is running!");
});

// Start the server
app.listen(3000, () => {
  console.log("Server started on port 3000");
});
```

**Key lines explained:**

- `app.set("view engine", "ejs")` — Tells Express to use EJS to render HTML
- `app.set("views", path.join(__dirname, "views"))` — Tells Express where `.ejs` files live (`__dirname` = current folder)
- `express.urlencoded({ extended: true })` — Reads data sent from HTML form submissions
- `methodOverride("_method")` — Allows `?_method=DELETE` in form URLs
- `express.static(...)` — Makes your CSS/JS files accessible in the browser

---

### Runnable Checkpoint

```bash
node app.js
```

Visit: `http://localhost:3000`

- **What should work:** You see `"Wanderlust is running!"`
- **What is NOT built yet:** No database, no listings, no views

---

### Common Mistakes

- Forgetting `express.urlencoded(...)` → form data comes as `undefined`
- Wrong path in `app.set("views", ...)` → EJS templates not found
- Missing `method-override` → DELETE/PUT routes won't work later

---

<!-- Future modules will be appended below -->

---

## Module 2 — MongoDB Connection

### Goal
Our server runs but has no memory — data disappears on restart. We need a database to permanently store data. In this module we connect our Express app to MongoDB.

---

### What is MongoDB and why do we use it?

A database is just a place where your app saves data permanently.

MongoDB is a **NoSQL database** — meaning it does NOT store data in rows and columns like Excel (that would be SQL). Instead it stores data as **documents** that look exactly like JavaScript objects:

```js
{
  title: "Cozy Apartment in Goa",
  price: 1200,
  location: "Goa, India"
}
```

This is perfect for a Node.js app because JavaScript already works with objects — so there's no conversion needed.

**Why MongoDB over SQL for this project?**
- Flexible structure — each listing can have different fields
- Works naturally with JavaScript/Node.js
- Very popular in the industry for web apps — great for interviews

---

### What is Mongoose?

Mongoose is an **ODM (Object Data Mapper)**. It sits between your Express app and MongoDB.

Without Mongoose you'd write raw MongoDB queries which are complex. Mongoose lets you write clean JavaScript to talk to your database.

Think of it like this:
- MongoDB = the actual database (the storage room)
- Mongoose = the librarian who organizes and fetches things from that room for you

---

### Step 1 — Make sure MongoDB is running

**Option A — MongoDB installed locally on your laptop**

Run this in your terminal:
```bash
mongod
```
If it says `waiting for connections on port 27017` — you're good.

**Option B — Use MongoDB Atlas (cloud database)**

We'll stick with local MongoDB for now. If `mongod` doesn't work, ask for help setting it up.

---

### Step 2 — Connect Mongoose in app.js

Open your `app.js` and update it to look like this:

```js
const express = require("express");
const app = express();
const path = require("path");
const methodOverride = require("method-override");
const mongoose = require("mongoose");

// Connect to MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/wanderlust")
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log("MongoDB connection error:", err);
  });

// Tell Express where to find EJS views
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

// Test route
app.get("/", (req, res) => {
  res.send("Wanderlust is running!");
});

app.listen(3000, () => {
  console.log("Server started on port 3000");
});
```

**Key lines explained:**

- `mongoose.connect("mongodb://127.0.0.1:27017/wanderlust")` — this is the connection string
  - `127.0.0.1` means your own laptop (localhost)
  - `27017` is the default port MongoDB runs on
  - `wanderlust` is the database name — MongoDB creates it automatically if it doesn't exist
- `.then(...)` — if connection is successful, print "Connected to MongoDB"
- `.catch(...)` — if something goes wrong, print the error so you can debug it

---

### Runnable Checkpoint

```bash
node app.js
```

Your terminal should show **both** of these lines:
```
Server started on port 3000
Connected to MongoDB
```

- **What should work:** Server runs and MongoDB connects successfully
- **What is NOT built yet:** No models, no data, no listings page

---

### Common Mistakes

- `mongod` not running → you'll see a connection error in terminal. MongoDB must be running before your app starts
- Wrong connection string (e.g. `localhost` instead of `127.0.0.1`) → can cause issues on Windows, always use `127.0.0.1`
- Calling `mongoose.connect()` after `app.listen()` → won't crash but is bad practice. Always connect DB before starting the server

---

### Interview Tip

If asked *"how do you connect to MongoDB in a Node.js app?"*, say:

> "We use Mongoose, which is an ODM. We call `mongoose.connect()` with the connection string, and it returns a Promise — so we use `.then()` and `.catch()` to handle success and errors."

---

## Module 3 — Models (Mongoose Schema)

### Goal
We need to tell MongoDB what a Listing looks like — what fields it has, what type of data each field holds. That's what a **Model** is. It's the blueprint for your data.

---

### What is a Schema?

Right now MongoDB will accept literally anything you throw at it — which is dangerous. What if someone saves a listing without a price? Or saves a number where the title should be?

A **Schema** is a set of rules that says:

> "Every listing MUST have a title (string), a price (number), a location (string)..."

Mongoose uses the schema to validate your data before saving it to the database.

**Real world analogy:**
A schema is like a job application form. It defines exactly what fields must be filled, and what type of information goes in each field. You can't submit it with missing required fields.

---

### Step 1 — Create the Listing Model

Inside the `models/` folder, create a new file called `listing.js`:

```
models/
└── listing.js    ← create this file
```

Write this inside `models/listing.js`:

```js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  image: {
    type: String,
    default: "https://images.unsplash.com/photo-1501785888041-af3ef285b470",
  },
  price: {
    type: Number,
  },
  location: {
    type: String,
  },
  country: {
    type: String,
  },
});

const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;
```

**Key lines explained:**

- `new Schema({...})` — defines the shape of the data. Each field has a `type` and optional rules like `required`
- `required: true` on title — if you try to save a listing without a title, Mongoose throws a validation error and does NOT save it
- `default: "..."` on image — if no image is provided, this URL is used automatically
- `mongoose.model("Listing", listingSchema)` — creates the actual Model from the schema. MongoDB will store documents in a collection called `listings` (Mongoose automatically lowercases and pluralizes the name)
- `module.exports = Listing` — exports the model so other files (controllers, routes) can use it

---

### Step 2 — Test the Model with sample data

Add this temporarily to `app.js`, after the mongoose.connect block and before app.listen:

```js
const Listing = require("./models/listing");

app.get("/testlisting", async (req, res) => {
  let sampleListing = new Listing({
    title: "My First Listing",
    description: "A beautiful place to stay",
    price: 1200,
    location: "Goa",
    country: "India",
  });

  await sampleListing.save();
  console.log("Sample listing saved!");
  res.send("Test successful — listing saved to DB!");
});
```

**Key lines explained:**

- `new Listing({...})` — creates a new listing object in memory (not saved yet)
- `await sampleListing.save()` — actually saves it to MongoDB
- `async (req, res)` — we use `async` because `.save()` is a Promise (it takes time to talk to the DB)

---

### Runnable Checkpoint

```bash
node app.js
```

Visit: `http://localhost:3000/testlisting`

- Terminal should print: `Sample listing saved!`
- Browser should show: `Test successful — listing saved to DB!`

To verify it's in the database, open `mongosh` and run:
```bash
use wanderlust
db.listings.find()
```

You should see your listing document printed.

- **What should work:** Listing is saved to MongoDB and visible in mongosh
- **What is NOT built yet:** No UI, no real routes, no CRUD yet — just confirming the model works

---

### Common Mistakes

- Forgetting `module.exports = Listing` → you'll get `undefined` errors when importing in other files
- Forgetting `async/await` on the route → `.save()` won't complete before the response is sent
- Model name is capitalized `"Listing"` but MongoDB collection will be `listings` (lowercase plural) — this is automatic, Mongoose handles it

---

### Interview Tip

If asked *"what is a Mongoose Schema?"*, say:

> "A Schema defines the structure and rules for documents in a MongoDB collection. It specifies field names, data types, required fields, and default values. We then create a Model from the Schema, which gives us methods to read and write to the database."

---

## Module 4 — Routes (Express Routing)

---

### Goal (in simple terms)

Right now the app has just one route — `GET /`. We need to add proper routes for listings so users can view, create, edit, and delete them. This module is about organizing those routes cleanly.

---

### Why separate route files?

If all routes live in `app.js`, that one file becomes hundreds of lines long as the app grows. Listings, users, reviews, bookings all piled together — impossible to navigate.

So we create **separate route files**, one per resource:

```
routes/
├── listings.js    ← all listing routes live here
├── users.js       ← added later
└── reviews.js     ← added later
```

`app.js` stays clean — it just directs traffic. Think of it like:

> `app.js` is the reception desk. It doesn't handle everything — it just says "for /listings, go to that department."

This is **Separation of Concerns** — one of the core MVC principles.

---

### What is RESTful Routing?

REST is a standard naming convention for routes. Every real-world app follows it. You must know this for interviews.

For a resource called `listings`, the 7 standard REST routes are:

| Route Name | HTTP Method | URL                  | What it does             |
|------------|-------------|----------------------|--------------------------|
| Index      | GET         | `/listings`          | Show all listings        |
| Show       | GET         | `/listings/:id`      | Show one listing         |
| New        | GET         | `/listings/new`      | Show the "create" form   |
| Create     | POST        | `/listings`          | Save a new listing to DB |
| Edit       | GET         | `/listings/:id/edit` | Show the "edit" form     |
| Update     | PUT         | `/listings/:id`      | Save the edited listing  |
| Destroy    | DELETE      | `/listings/:id`      | Delete a listing         |

We'll build all 7 across this module and the next few.

---

### Step 1 — Create the router file

Inside your `routes/` folder, create a new file called `listings.js`:

```
routes/
└── listings.js    ← create this file
```

Write this inside `routes/listings.js`:

```js
const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.send("All listings will show here");
});

module.exports = router;
```

---

### Key lines explained

- `express.Router()` — creates a mini Express app dedicated only to listing routes. Think of it as a sub-application that handles just one resource
- `router.get("/")` — inside a router file, `/` means `/listings`. The `/listings` prefix is added by `app.js`, so here you only write the remainder of the path
- `module.exports = router` — exports the router so `app.js` can import and use it

---

### Step 2 — Connect the router to app.js

Open your `app.js` and make two changes:

**Add this at the top with your other require statements:**

```js
const listingRouter = require("./routes/listings");
```

- `require("./routes/listings")` — imports the router you just created. `./` means current folder, then it looks inside `routes/listings.js`

**Add this after your middleware lines, before `app.listen`:**

```js
app.use("/listings", listingRouter);
```

- `app.use("/listings", listingRouter)` — tells Express: *"For any request whose URL starts with `/listings`, hand it off to `listingRouter`"*

So when someone visits `/listings`:
1. Express sees the URL starts with `/listings`
2. Passes the request to `listingRouter`
3. The router matches the `/` portion (the part after `/listings`)
4. Runs the handler function
5. Sends the response

---

### Your app.js should now look like this:

```js
const express = require("express");
const app = express();
const path = require("path");
const methodOverride = require("method-override");
const mongoose = require("mongoose");
const listingRouter = require("./routes/listings");

mongoose.connect("mongodb://127.0.0.1:27017/wanderlust")
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log("MongoDB connection error:", err);
  });

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

app.use("/listings", listingRouter);

app.listen(3000, () => {
  console.log("Server started on port 3000");
});
```

---

### Runnable Checkpoint

Run:

```bash
node app.js
```

Your terminal should show:

```
Server started on port 3000
Connected to MongoDB
```

Now visit: `http://localhost:3000/listings`

Your browser should show:

```
All listings will show here
```

- **What should work:** The `/listings` route responds correctly
- **What is NOT built yet:** No real data from DB, no views, no other routes yet — just confirming routing is wired up

---

### Common Mistakes

- Writing `/listings` inside the router instead of `/` — this makes the actual URL `/listings/listings` which is wrong. The prefix comes from `app.js`, the router only handles the remainder
- Forgetting `module.exports = router` — `app.js` can't import it and you'll get an error
- Putting `app.use("/listings", listingRouter)` before the middleware lines — always put middleware first, routes below

---

### Interview Tip

If asked *"how do you organize routes in an Express app?"*, say:

> "We use Express Router to create separate router files for each resource. In `app.js` we mount each router with `app.use('/listings', listingRouter)` so the main file stays clean and each file has a single responsibility. This follows the Separation of Concerns principle."

---

## Module 5 — Controllers

---

### Goal (in simple terms)

Right now the route handler function sits directly inside `routes/listings.js`. As we add more logic — talking to the database, handling errors, processing data — that function will get very long and messy.

A **Controller** is a separate file that holds all those handler functions. The route just calls the function by name. This keeps routes clean and logic organized.

---

### Why separate controllers?

Right now your route looks like this:

```js
router.get("/", (req, res) => {
  res.send("All listings will show here");
});
```

That anonymous function `(req, res) => { ... }` is the controller logic — sitting right inside the route. Fine for one line. But when it becomes 20 lines of database queries and error handling, it turns into a mess.

With controllers, it becomes:

```js
router.get("/", listingController.index);
```

Clean. One line. The route just says *who* handles it. The controller says *how*.

Think of it like this:
> The **Route** is the road sign — it points you in the right direction.
> The **Controller** is the actual destination — it does the real work.

---

### Step 1 — Create the controllers folder and file

Inside your `controllers/` folder, create a new file called `listings.js`:

```
controllers/
└── listings.js    ← create this file
```

Write this inside `controllers/listings.js`:

```js
const Listing = require("../models/listing");

module.exports.index = async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index", { listings: allListings });
};
```

---

### Key lines explained

- `require("../models/listing")` — imports the Listing model. `../` means go one folder up (from `controllers/` to the root), then into `models/listing.js`
- `module.exports.index` — exports this function with the name `index`. Other files can call it as `listingController.index`
- `Listing.find({})` — fetches ALL documents from the listings collection. Empty `{}` means "no filter, give me everything"
- `await` — we wait for the database to respond before continuing. Always needed when talking to MongoDB
- `res.render("listings/index", { listings: allListings })` — renders the EJS view at `views/listings/index.ejs` and passes the data to it as `listings`

---

### Step 2 — Update the route to use the controller

Open `routes/listings.js` and update it:

```js
const express = require("express");
const router = express.Router();
const listingController = require("../controllers/listings");

router.get("/", listingController.index);

module.exports = router;
```

---

### Key lines explained

- `require("../controllers/listings")` — imports the controller file. `../` goes one level up from `routes/`, then into `controllers/listings.js`
- `listingController.index` — passes the `index` function as the handler. Notice there are **no parentheses** — we are passing the function itself, not calling it. Express calls it when the route is hit

---

### What the flow looks like now

```
GET /listings
  → app.js sends to listingRouter
  → listingRouter calls listingController.index
  → controller asks Listing model for all listings
  → model queries MongoDB
  → controller gets data back
  → controller renders views/listings/index.ejs with that data
  → user sees the page
```

This is the full MVC flow working together for the first time.

---

### Runnable Checkpoint

We don't have the EJS view yet — so the server will crash if you visit `/listings`. That's okay, we'll build views in the next module.

For now just confirm the server **starts without crashing**:

```bash
node app.js
```

Your terminal should show:

```
Server started on port 3000
Connected to MongoDB
```

No errors on startup = controller is wired up correctly.

- **What should work:** Server starts cleanly, no errors
- **What is NOT built yet:** The EJS view — so visiting `/listings` will error for now, that's expected

---

### Common Mistakes

- Adding `()` when passing the controller to the route — `listingController.index()` calls it immediately at startup instead of waiting for a request. Always pass without parentheses
- Using `./` instead of `../` in the require path — `controllers/` is not in the same folder as `routes/`, you need to go one level up first
- Forgetting `async` on the controller function — `await Listing.find({})` won't work without it

---

### Interview Tip

If asked *"what is a controller in MVC?"*, say:

> "A controller is the middleman between the route and the model. When a request comes in, the route hands it to the controller. The controller talks to the model to get or save data, then decides what response to send back — usually rendering a view with that data."

---

## Module 6 — EJS Views (Index Page)

---

### Goal (in simple terms)

Right now the controller calls `res.render("listings/index")` but that file doesn't exist yet — so visiting `/listings` crashes. In this module we create the EJS view that displays all listings from the database.

---

### What is EJS?

EJS stands for **Embedded JavaScript**. It lets you write HTML with JavaScript mixed in — so you can display dynamic data like listing titles, prices, and locations on a page.

Think of it like this:
> Normal HTML is a printed flyer — it always says the same thing.
> EJS is a template — you fill in the blanks with real data each time.

There are three EJS tags you need to know:

| Tag            | What it does                                    |
|----------------|-------------------------------------------------|
| `<%= value %>` | Outputs the value to the page (displays it)     |
| `<% code %>`   | Runs JavaScript but does NOT display anything   |
| `<%- html %>`  | Outputs raw HTML (used later for includes)      |

---

### Step 1 — Create the index view

Inside `views/listings/`, create a new file called `index.ejs`:

```
views/
└── listings/
    └── index.ejs    ← create this file
```

Write this inside `views/listings/index.ejs`:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Wanderlust — All Listings</title>
</head>
<body>
  <h1>All Listings</h1>

  <ul>
    <% for (let listing of listings) { %>
      <li>
        <h3><%= listing.title %></h3>
        <p><%= listing.location %>, <%= listing.country %></p>
        <p>₹<%= listing.price %> / night</p>
      </li>
    <% } %>
  </ul>

</body>
</html>
```

---

### Key lines explained

- `<% for (let listing of listings) { %>` — loops through the `listings` array passed from the controller. The `<% %>` tag runs JavaScript without printing anything to the page
- `<%= listing.title %>` — prints the title of each listing onto the page. The `<%= %>` tag outputs a value
- `<% } %>` — closes the for loop. Every opening `{` in EJS needs a closing `<% } %>`
- The `listings` variable is what the controller passed: `res.render("listings/index", { listings: allListings })`

---

### How the data flows into this view

```
MongoDB → Listing.find({}) → controller gets allListings array
→ res.render("listings/index", { listings: allListings })
→ EJS receives listings variable
→ loops through it and prints each one as HTML
→ user sees the page
```

---

### Runnable Checkpoint

Make sure your MongoDB has at least one listing. If you deleted the test data earlier, open `mongosh` and check:

```bash
use wanderlust
db.listings.find()
```

If it's empty, visit `http://localhost:3000/testlisting` once to insert a sample listing.

Then run:

```bash
node app.js
```

Your terminal should show:

```
Server started on port 3000
Connected to MongoDB
```

Now visit: `http://localhost:3000/listings`

You should see something like:

```
All Listings

• My First Listing
  Goa, India
  ₹1200 / night
```

- **What should work:** All listings from MongoDB are displayed on the page
- **What is NOT built yet:** No styling, no create/edit/delete yet — just reading and displaying data

---

### Common Mistakes

- Forgetting to close the for loop with `<% } %>` — EJS will throw a syntax error
- Using `<% %>` instead of `<%= %>` when trying to display a value — the value won't show on screen
- Passing the wrong variable name — if the controller passes `{ listings: allListings }` then in EJS you must use `listings`, not `allListings` or anything else

---

### Interview Tip

If asked *"how does data get from the database to the HTML page?"*, say:

> "The controller fetches data from the database using the Model, then passes it to the EJS view via `res.render()`. In the view, we use EJS tags like `<%= %>` to embed that data into the HTML. The server renders the final HTML and sends it to the browser."

---

## Module 7 — CRUD Operations (Create, Read, Update, Delete)

---

### Goal (in simple terms)

Right now we can only **read** listings. In this module we build all the remaining operations — Create, Update, and Delete — so users can fully manage listings through the browser.

We'll build each operation one by one:
1. **New** — show a form to create a listing
2. **Create** — save that form data to MongoDB
3. **Show** — view a single listing
4. **Edit** — show a form to edit a listing
5. **Update** — save the edited data
6. **Delete** — remove a listing

---

### Part 1 — New & Create (Adding a listing)

---

### Step 1 — Add the New and Create routes

Open `routes/listings.js` and add two new routes:

```js
const express = require("express");
const router = express.Router();
const listingController = require("../controllers/listings");

router.get("/", listingController.index);
router.get("/new", listingController.renderNewForm);
router.post("/", listingController.createListing);

module.exports = router;
```

---

### Key lines explained

- `router.get("/new", listingController.renderNewForm)` — when the user visits `/listings/new`, show them the form to create a new listing
- `router.post("/", listingController.createListing)` — when the user submits that form, save the data to MongoDB. Forms submit via POST

---

### Step 2 — Add the controller functions

Open `controllers/listings.js` and add two new functions:

```js
const Listing = require("../models/listing");

module.exports.index = async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index", { listings: allListings });
};

module.exports.renderNewForm = (req, res) => {
  res.render("listings/new");
};

module.exports.createListing = async (req, res) => {
  const newListing = new Listing(req.body.listing);
  await newListing.save();
  res.redirect("/listings");
};
```

---

### Key lines explained

- `module.exports.renderNewForm` — just renders the form page. No database call needed, so no `async`
- `req.body.listing` — this is the form data sent by the user. We name all form fields like `listing[title]`, `listing[price]` etc. so they arrive as a neat object under `req.body.listing`
- `new Listing(req.body.listing)` — creates a new Listing object from that form data
- `await newListing.save()` — saves it to MongoDB
- `res.redirect("/listings")` — after saving, sends the user back to the all listings page

---

### Step 3 — Create the New form view

Inside `views/listings/`, create a new file called `new.ejs`:

```
views/
└── listings/
    ├── index.ejs
    └── new.ejs    ← create this file
```

Write this inside `views/listings/new.ejs`:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>New Listing</title>
</head>
<body>
  <h1>Create a New Listing</h1>

  <form action="/listings" method="POST">
    <div>
      <label>Title</label>
      <input type="text" name="listing[title]" required />
    </div>
    <div>
      <label>Description</label>
      <textarea name="listing[description]"></textarea>
    </div>
    <div>
      <label>Image URL</label>
      <input type="text" name="listing[image]" />
    </div>
    <div>
      <label>Price</label>
      <input type="number" name="listing[price]" />
    </div>
    <div>
      <label>Location</label>
      <input type="text" name="listing[location]" />
    </div>
    <div>
      <label>Country</label>
      <input type="text" name="listing[country]" />
    </div>
    <button type="submit">Create Listing</button>
  </form>

</body>
</html>
```

---

### Key lines explained

- `action="/listings"` — the form submits to `POST /listings`
- `method="POST"` — tells the browser to send a POST request
- `name="listing[title]"` — this naming convention is important. Express parses this into `req.body.listing.title` — a nested object. That's why in the controller we can do `new Listing(req.body.listing)` and it maps perfectly to the schema fields

---

### Runnable Checkpoint

Run:

```bash
node app.js
```

Your terminal should show:

```
Server started on port 3000
Connected to MongoDB
```

Visit: `http://localhost:3000/listings/new`

You should see a form with all the fields. Fill it in and click **Create Listing**.

You should be redirected to `http://localhost:3000/listings` and see your new listing appear in the list.

- **What should work:** Creating a new listing via the form and seeing it on the index page
- **What is NOT built yet:** Show, Edit, Update, Delete — coming next

---

### Common Mistakes

- Naming form fields `name="title"` instead of `name="listing[title]"` — the data won't arrive as a nested object and `req.body.listing` will be undefined
- Forgetting `express.urlencoded({ extended: true })` in `app.js` — form data won't be parsed at all and `req.body` will be empty
- Using `GET` instead of `POST` on the form — you can't save data with a GET request

---

### Part 2 — Show (Viewing a single listing)

---

### Goal

When a user clicks on a listing, they should see a dedicated page for just that one listing — with all its details. This is the **Show** route.

---

### Step 1 — Add the Show route

Open `routes/listings.js` and add one new route:

```js
const express = require("express");
const router = express.Router();
const listingController = require("../controllers/listings");

router.get("/", listingController.index);
router.get("/new", listingController.renderNewForm);
router.post("/", listingController.createListing);
router.get("/:id", listingController.showListing);

module.exports = router;
```

---

### Key lines explained

- `router.get("/:id", listingController.showListing)` — the `:id` is a **route parameter**. It's a placeholder that captures whatever value is in the URL. So `/listings/abc123` means `req.params.id = "abc123"`
- **Important:** `/:id` must come AFTER `/new`. If it came before, Express would treat `/new` as an id and never reach the new form route

---

### Step 2 — Add the showListing controller function

Open `controllers/listings.js` and add:

```js
module.exports.showListing = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/show", { listing });
};
```

---

### Key lines explained

- `req.params` — contains all route parameters. We destructure `id` from it
- `Listing.findById(id)` — fetches exactly one document from MongoDB by its `_id` field
- `res.render("listings/show", { listing })` — passes the single listing object to the show view. `{ listing }` is shorthand for `{ listing: listing }`

---

### Step 3 — Create the Show view

Inside `views/listings/`, create a new file called `show.ejs`:

```
views/
└── listings/
    ├── index.ejs
    ├── new.ejs
    └── show.ejs    ← create this file
```

Write this inside `views/listings/show.ejs`:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title><%= listing.title %></title>
</head>
<body>
  <h1><%= listing.title %></h1>
  <img src="<%= listing.image %>" alt="listing image" width="400" />
  <p><%= listing.description %></p>
  <p><strong>Location:</strong> <%= listing.location %>, <%= listing.country %></p>
  <p><strong>Price:</strong> ₹<%= listing.price %> / night</p>

  <a href="/listings">Back to all listings</a>
</body>
</html>
```

---

### Step 4 — Add links on the Index page

Open `views/listings/index.ejs` and update the listing items to include a link:

```html
<% for (let listing of listings) { %>
  <li>
    <h3><%= listing.title %></h3>
    <p><%= listing.location %>, <%= listing.country %></p>
    <p>₹<%= listing.price %> / night</p>
    <a href="/listings/<%= listing._id %>">View Details</a>
  </li>
<% } %>
```

---

### Key lines explained

- `listing._id` — every MongoDB document automatically gets a unique `_id` field. We use it to build the URL for that specific listing
- `/listings/<%= listing._id %>` — this generates a URL like `/listings/64abc123...` which matches the `/:id` route

---

### Runnable Checkpoint

Run:

```bash
node app.js
```

Your terminal should show:

```
Server started on port 3000
Connected to MongoDB
```

Visit: `http://localhost:3000/listings`

You should see a **View Details** link next to each listing. Click one — you should land on a page showing just that listing's full details.

- **What should work:** Clicking a listing opens its own dedicated page
- **What is NOT built yet:** Edit and Delete — coming next

---

### Common Mistakes

- Placing `/:id` before `/new` in the routes — Express matches routes top to bottom, so `/new` would be treated as an id and the new form would never load
- Using `listing.id` instead of `listing._id` — in EJS always use `listing._id` to get the MongoDB document id
- Forgetting `await` on `Listing.findById(id)` — you'll get a Promise object instead of the actual listing data

---

### Interview Tip

If asked *"how do you fetch a single document from MongoDB?"*, say:

> "We use `Model.findById(id)` where the id comes from `req.params`. The id is passed in the URL as a route parameter using `:id` syntax in the route definition."

---

### Part 3 — Edit & Update (Editing a listing)

---

### Goal

When a user wants to change a listing's details, they should see a form pre-filled with the existing data. When they submit it, the changes should be saved to MongoDB. That's Edit + Update.

---

### Step 1 — Add the Edit and Update routes

Open `routes/listings.js` and add two new routes:

```js
const express = require("express");
const router = express.Router();
const listingController = require("../controllers/listings");

router.get("/", listingController.index);
router.get("/new", listingController.renderNewForm);
router.post("/", listingController.createListing);
router.get("/:id", listingController.showListing);
router.get("/:id/edit", listingController.renderEditForm);
router.put("/:id", listingController.updateListing);

module.exports = router;
```

---

### Key lines explained

- `router.get("/:id/edit", listingController.renderEditForm)` — shows the pre-filled edit form for a specific listing
- `router.put("/:id", listingController.updateListing)` — handles the form submission and saves updated data. Uses PUT because we are replacing existing data
- HTML forms only support GET and POST natively — that's why we installed `method-override`. We'll use `?_method=PUT` in the form URL to fake a PUT request

---

### Step 2 — Add the controller functions

Open `controllers/listings.js` and add two new functions:

```js
module.exports.renderEditForm = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/edit", { listing });
};

module.exports.updateListing = async (req, res) => {
  const { id } = req.params;
  await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  res.redirect(`/listings/${id}`);
};
```

---

### Key lines explained

- `renderEditForm` — fetches the existing listing from DB so we can pre-fill the form with its current values
- `Listing.findByIdAndUpdate(id, { ...req.body.listing })` — finds the document by id and updates it with the new form data. The spread operator `...` unpacks the object
- `res.redirect(\`/listings/${id}\`)` — after updating, sends the user to that listing's show page

---

### Step 3 — Create the Edit form view

Inside `views/listings/`, create a new file called `edit.ejs`:

```
views/
└── listings/
    ├── index.ejs
    ├── new.ejs
    ├── show.ejs
    └── edit.ejs    ← create this file
```

Write this inside `views/listings/edit.ejs`:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Edit Listing</title>
</head>
<body>
  <h1>Edit Listing</h1>

  <form action="/listings/<%= listing._id %>?_method=PUT" method="POST">
    <div>
      <label>Title</label>
      <input type="text" name="listing[title]" value="<%= listing.title %>" required />
    </div>
    <div>
      <label>Description</label>
      <textarea name="listing[description]"><%= listing.description %></textarea>
    </div>
    <div>
      <label>Image URL</label>
      <input type="text" name="listing[image]" value="<%= listing.image %>" />
    </div>
    <div>
      <label>Price</label>
      <input type="number" name="listing[price]" value="<%= listing.price %>" />
    </div>
    <div>
      <label>Location</label>
      <input type="text" name="listing[location]" value="<%= listing.location %>" />
    </div>
    <div>
      <label>Country</label>
      <input type="text" name="listing[country]" value="<%= listing.country %>" />
    </div>
    <button type="submit">Update Listing</button>
  </form>

  <a href="/listings/<%= listing._id %>">Cancel</a>
</body>
</html>
```

---

### Key lines explained

- `action="/listings/<%= listing._id %>?_method=PUT"` — the form posts to this URL. The `?_method=PUT` tells `method-override` to treat this POST as a PUT request
- `value="<%= listing.title %>"` — pre-fills each input with the current value from the database so the user sees what they're editing
- `<textarea>` doesn't use a `value` attribute — the current value goes between the opening and closing tags: `<textarea><%= listing.description %></textarea>`

---

### Step 4 — Add an Edit link on the Show page

Open `views/listings/show.ejs` and add an edit link:

```html
<a href="/listings/<%= listing._id %>/edit">Edit Listing</a>
```

---

### Runnable Checkpoint

Run:

```bash
node app.js
```

Your terminal should show:

```
Server started on port 3000
Connected to MongoDB
```

Visit: `http://localhost:3000/listings`

Click **View Details** on any listing, then click **Edit Listing**. You should see the form pre-filled with that listing's existing data. Change something and click **Update Listing**.

You should be redirected to the show page and see your changes saved.

- **What should work:** Editing a listing and seeing the updated data on the show page
- **What is NOT built yet:** Delete — coming next

---

### Common Mistakes

- Forgetting `?_method=PUT` in the form action — the request will be treated as POST and won't match the PUT route
- Not pre-filling the form with `value="<%= listing.field %>"` — the form will be blank and submitting it will overwrite everything with empty values
- Using `Listing.findByIdAndUpdate(id, req.body.listing)` without the spread `...` — works fine actually, but spreading is a cleaner habit. Either way works here

---

### Interview Tip

If asked *"how do you handle PUT and DELETE requests from HTML forms?"*, say:

> "HTML forms only support GET and POST. We use the `method-override` package — it checks for a `?_method=PUT` or `?_method=DELETE` query parameter in the form's action URL and overrides the method accordingly, so Express can route it to the correct PUT or DELETE handler."

---

### Part 4 — Delete (Removing a listing)

---

### Goal

When a user wants to remove a listing entirely, clicking a Delete button should permanently remove it from MongoDB.

---

### Step 1 — Add the Delete route

Open `routes/listings.js` and add one final route:

```js
const express = require("express");
const router = express.Router();
const listingController = require("../controllers/listings");

router.get("/", listingController.index);
router.get("/new", listingController.renderNewForm);
router.post("/", listingController.createListing);
router.get("/:id", listingController.showListing);
router.get("/:id/edit", listingController.renderEditForm);
router.put("/:id", listingController.updateListing);
router.delete("/:id", listingController.destroyListing);

module.exports = router;
```

---

### Key lines explained

- `router.delete("/:id", listingController.destroyListing)` — listens for a DELETE request on `/listings/:id`. Since HTML forms can't send DELETE, we use `method-override` with `?_method=DELETE`

---

### Step 2 — Add the destroyListing controller function

Open `controllers/listings.js` and add:

```js
module.exports.destroyListing = async (req, res) => {
  const { id } = req.params;
  await Listing.findByIdAndDelete(id);
  res.redirect("/listings");
};
```

---

### Key lines explained

- `Listing.findByIdAndDelete(id)` — finds the document by id and permanently removes it from MongoDB in one step
- `res.redirect("/listings")` — after deleting, sends the user back to the index page since that listing no longer exists

---

### Step 3 — Add a Delete button on the Show page

Open `views/listings/show.ejs` and add a delete form:

```html
<form action="/listings/<%= listing._id %>?_method=DELETE" method="POST">
  <button type="submit">Delete Listing</button>
</form>
```

---

### Key lines explained

- We use a `<form>` instead of a plain link because DELETE must be sent as a request with a method — a plain `<a>` tag only sends GET requests
- `action="/listings/<%= listing._id %>?_method=DELETE"` — `method-override` sees `?_method=DELETE` and converts this POST into a DELETE request
- `method="POST"` — the actual HTTP method the browser sends (then overridden to DELETE by method-override)

---

### Your final show.ejs should look like this:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title><%= listing.title %></title>
</head>
<body>
  <h1><%= listing.title %></h1>
  <img src="<%= listing.image %>" alt="listing image" width="400" />
  <p><%= listing.description %></p>
  <p><strong>Location:</strong> <%= listing.location %>, <%= listing.country %></p>
  <p><strong>Price:</strong> ₹<%= listing.price %> / night</p>

  <a href="/listings/<%= listing._id %>/edit">Edit Listing</a>

  <form action="/listings/<%= listing._id %>?_method=DELETE" method="POST">
    <button type="submit">Delete Listing</button>
  </form>

  <a href="/listings">Back to all listings</a>
</body>
</html>
```

---

### Your final routes/listings.js should look like this:

```js
const express = require("express");
const router = express.Router();
const listingController = require("../controllers/listings");

router.get("/", listingController.index);
router.get("/new", listingController.renderNewForm);
router.post("/", listingController.createListing);
router.get("/:id", listingController.showListing);
router.get("/:id/edit", listingController.renderEditForm);
router.put("/:id", listingController.updateListing);
router.delete("/:id", listingController.destroyListing);

module.exports = router;
```

---

### Your final controllers/listings.js should look like this:

```js
const Listing = require("../models/listing");

module.exports.index = async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index", { listings: allListings });
};

module.exports.renderNewForm = (req, res) => {
  res.render("listings/new");
};

module.exports.createListing = async (req, res) => {
  const newListing = new Listing(req.body.listing);
  await newListing.save();
  res.redirect("/listings");
};

module.exports.showListing = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/show", { listing });
};

module.exports.renderEditForm = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/edit", { listing });
};

module.exports.updateListing = async (req, res) => {
  const { id } = req.params;
  await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req, res) => {
  const { id } = req.params;
  await Listing.findByIdAndDelete(id);
  res.redirect("/listings");
};
```

---

### Runnable Checkpoint

Run:

```bash
node app.js
```

Your terminal should show:

```
Server started on port 3000
Connected to MongoDB
```

Visit: `http://localhost:3000/listings`

Click **View Details** on any listing. You should now see both an **Edit Listing** link and a **Delete Listing** button. Click **Delete Listing** — you should be redirected to the index page and that listing should be gone.

- **What should work:** Full CRUD — create, read, update, and delete all work
- **What is NOT built yet:** Styling, authentication, error handling — coming in later modules

---

### Common Mistakes

- Using `<a href="...">Delete</a>` instead of a form — a link sends a GET request, not DELETE, so it won't match the route
- Forgetting `?_method=DELETE` in the form action — it will be treated as POST and won't match the DELETE route
- Calling `Listing.findByIdAndDelete()` without `await` — the deletion won't complete before the redirect fires

---

### Interview Tip

If asked *"how do you implement full CRUD in an Express + MongoDB app?"*, say:

> "We define 7 RESTful routes mapped to controller functions. Each controller function uses a Mongoose method — `find`, `findById`, `save`, `findByIdAndUpdate`, or `findByIdAndDelete` — to interact with the database. Since HTML forms don't support PUT or DELETE, we use the `method-override` package to simulate those methods via a query parameter."

---

## Module 8 — Authentication (Sessions, Passport, Password Hashing)

---

### Goal (in simple terms)

Right now anyone can create, edit, or delete any listing — there's no concept of "who is logged in." Authentication means adding **Register** and **Login** so users have accounts, and the app knows who is making each request.

---

### What is Authentication vs Authorization?

These two words are often confused in interviews — know the difference:

| Term               | What it means                          | Example                                      |
|--------------------|----------------------------------------|----------------------------------------------|
| **Authentication** | Verifying WHO you are                  | Logging in with email + password             |
| **Authorization**  | Verifying WHAT you're allowed to do    | Only the listing owner can edit it           |

This module covers Authentication. Authorization comes in the next module.

---

### How does login work in a web app?

HTTP is **stateless** — every request is independent, the server remembers nothing between requests. So after you log in, the server needs a way to remember that on the next request.

That's what a **session** does:

1. User logs in with correct password
2. Server creates a **session** — a small record stored server-side
3. Server sends the browser a **cookie** with a session ID
4. On every future request, the browser automatically sends that cookie
5. Server looks up the session ID and knows who is making the request

Think of it like a coat check token at a restaurant:
> You hand over your coat (credentials), they give you a token (session cookie). Every time you show that token, they know it's you.

---

### Packages we need

Install these:

```bash
npm install express-session passport passport-local passport-local-mongoose connect-mongo
```

- `express-session` — creates and manages sessions
- `passport` — authentication middleware, handles the login flow
- `passport-local` — a strategy for username/password authentication
- `passport-local-mongoose` — a Mongoose plugin that adds password hashing and passport methods directly to your User model
- `connect-mongo` — stores sessions in MongoDB so they survive server restarts

---

### Step 1 — Create the User model

Inside `models/`, create a new file called `user.js`:

```
models/
├── listing.js
└── user.js    ← create this file
```

Write this inside `models/user.js`:

```js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose").default;

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
});

userSchema.plugin(passportLocalMongoose);

const User = mongoose.model("User", userSchema);

module.exports = User;
```

---

### Key lines explained

 userSchema.plugin(passportLocalMongoose)

  Think of a plugin like installing an add-on to your phone. Your phone works fine on its own, but after installing
  WhatsApp you get new abilities — messaging, voice notes, etc.

  passportLocalMongoose is an add-on for your User schema. After this one line, your User model gets:

  - A username field — automatically added, you don't write it
  - A hash field — the scrambled version of the password
  - A salt field — a random string mixed into the password before scrambling (so two users with the same password don't end
   up with the same hash)
  - A register() method — saves a new user with a hashed password
  - An authenticate() method — checks if a entered password matches the stored hash

  You get all of that from one line. Without this plugin you'd have to write all that crypto code yourself.

  ---
  Why we only define email manually

  passportLocalMongoose automatically adds username, hash, and salt to the schema. So you only need to add the extra fields
   that the plugin doesn't handle. In our case, that's just email. If you tried to manually add username yourself AND use
  the plugin, you'd get a conflict.

  ---
  unique: true on email

  MongoDB doesn't enforce uniqueness by default — you could save 100 users all with the same email and it wouldn't
  complain. unique: true creates an index in MongoDB that rejects any document where the email already exists. Without it,
  two people could register with the same email and both would succeed.

---

### Step 2 — Configure sessions and passport in app.js

Open `app.js` and add the following. Your full `app.js` should now look like this:

```js
const express = require("express");
const app = express();
const path = require("path");
const methodOverride = require("method-override");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user");
const listingRouter = require("./routes/listings");

mongoose.connect("mongodb://127.0.0.1:27017/wanderlust")
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log("MongoDB connection error:", err);
  });

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

// Session configuration
const sessionOptions = {
  secret: "wanderlust-secret-key",
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  },
};
app.use(session(sessionOptions));

// Passport configuration
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Routes
app.use("/listings", listingRouter);

app.listen(3000, () => {
  console.log("Server started on port 3000");
});
```

---

### Key lines explained

- `secret: "wanderlust-secret-key"` — used to sign and encrypt the session cookie. In production this should be a long random string stored in an environment variable
- `resave: false` — don't re-save the session if nothing changed
- `saveUninitialized: true` — save a session even if nothing has been stored in it yet
- `cookie: { httpOnly: true }` — prevents JavaScript in the browser from reading the cookie (protects against XSS attacks)
- `cookie: { maxAge: 7 * 24 * 60 * 60 * 1000 }` — cookie expires in 7 days (value is in milliseconds)
- `passport.initialize()` — initializes passport on every request
- `passport.session()` — tells passport to use sessions to persist login state
- `passport.use(new LocalStrategy(User.authenticate()))` — tells passport to use the local strategy (username + password) with our User model's authenticate method (added by passport-local-mongoose)
- `passport.serializeUser(User.serializeUser())` — decides what data to store in the session (just the user id)
- `passport.deserializeUser(User.deserializeUser())` — uses the stored id to fetch the full user from DB on each request

---

### Step 3 — Create auth routes

Inside `routes/`, create a new file called `user.js`:

```
routes/
├── listings.js
└── user.js    ← create this file
```

Write this inside `routes/user.js`:

```js
const express = require("express");
const router = express.Router();
const userController = require("../controllers/user");
const passport = require("passport");

router.get("/register", userController.renderRegisterForm);
router.post("/register", userController.register);

router.get("/login", userController.renderLoginForm);
router.post("/login", passport.authenticate("local", {
  failureRedirect: "/login",
}), userController.login);

router.get("/logout", userController.logout);

module.exports = router;
```

---

### Key lines explained

- `passport.authenticate("local", { failureRedirect: "/login" })` — this is passport's built-in middleware. It checks the username and password. If wrong, it redirects to `/login`. If correct, it calls `next()` and moves to `userController.login`
- The login POST route has **two middlewares** — passport checks credentials first, then our controller runs

---

### Step 4 — Create the user controller

Inside `controllers/`, create a new file called `user.js`:

```
controllers/
├── listings.js
└── user.js    ← create this file
```

Write this inside `controllers/user.js`:

```js
const User = require("../models/user");

module.exports.renderRegisterForm = (req, res) => {
  res.render("users/register");
};

module.exports.register = async (req, res, next) => {
  const { username, email, password } = req.body;
  const newUser = new User({ email, username });
  const registeredUser = await User.register(newUser, password);
  req.login(registeredUser, (err) => {
    if (err) return next(err);
    res.redirect("/listings");
  });
};

module.exports.renderLoginForm = (req, res) => {
  res.render("users/login");
};

module.exports.login = (req, res) => {
  res.redirect("/listings");
};

module.exports.logout = (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    res.redirect("/listings");
  });
};
```

---

### Key lines explained

- `User.register(newUser, password)` — this method is added by passport-local-mongoose. It hashes the password and saves the user. You never store plain text passwords
- `req.login(registeredUser, callback)` — logs the user in immediately after registering so they don't have to log in again
- `req.logout(callback)` — destroys the session and logs the user out. Always use the callback form in newer versions of passport
- `module.exports.login` — just redirects. The actual credential check was already done by `passport.authenticate()` in the route

---

### Step 5 — Create auth views

Create a new folder `views/users/` and two files inside it:

```
views/
└── users/
    ├── register.ejs    ← create this
    └── login.ejs       ← create this
```

Write this inside `views/users/register.ejs`:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Register</title>
</head>
<body>
  <h1>Create an Account</h1>
  <form action="/register" method="POST">
    <div>
      <label>Username</label>
      <input type="text" name="username" required />
    </div>
    <div>
      <label>Email</label>
      <input type="email" name="email" required />
    </div>
    <div>
      <label>Password</label>
      <input type="password" name="password" required />
    </div>
    <button type="submit">Register</button>
  </form>
  <a href="/login">Already have an account? Log in</a>
</body>
</html>
```

Write this inside `views/users/login.ejs`:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Login</title>
</head>
<body>
  <h1>Log In</h1>
  <form action="/login" method="POST">
    <div>
      <label>Username</label>
      <input type="text" name="username" required />
    </div>
    <div>
      <label>Password</label>
      <input type="password" name="password" required />
    </div>
    <button type="submit">Log In</button>
  </form>
  <a href="/register">Don't have an account? Register</a>
</body>
</html>
```

---

### Step 6 — Mount the user router in app.js

Open `app.js` and add:

```js
const userRouter = require("./routes/user");
```

And below the listings route:

```js
app.use("/", userRouter);
```

---

### Runnable Checkpoint

Run:

```bash
node app.js
```

Your terminal should show:

```
Server started on port 3000
Connected to MongoDB
```

Test these one by one:

1. Visit `http://localhost:3000/register` — you should see the register form
2. Fill in a username, email, and password and submit — you should be redirected to `/listings`
3. Visit `http://localhost:3000/logout` — you should be logged out and redirected to `/listings`
4. Visit `http://localhost:3000/login` — you should see the login form
5. Log in with the credentials you just registered — you should be redirected to `/listings`

To verify the user was saved, open `mongosh` and run:

```bash
use wanderlust
db.users.find()
```

You should see your user document with a hashed password — never the plain text password.

- **What should work:** Register, login, and logout all work. Password is stored as a hash
- **What is NOT built yet:** Authorization (restricting who can edit/delete), flash messages for errors

---

### Common Mistakes

- Putting `app.use(session(...))` AFTER `app.use(passport.session())` — sessions must be set up before passport
- Putting `app.use(passport.initialize())` before `app.use(session(...))` — same issue, always session first
- Storing the plain password instead of using `User.register()` — always use `User.register()`, never save passwords manually
- `passport-local-mongoose` v9 is compiled from TypeScript and uses `exports.default` — so `require("passport-local-mongoose")` gives you `{ default: fn }` not the function itself. Fix: use `require("passport-local-mongoose").default`

---

### Interview Tip

If asked *"how does authentication work in your app?"*, say:

> "We use Passport.js with the local strategy for username and password authentication. Passwords are never stored in plain text — `passport-local-mongoose` automatically hashes them using salt and hash. Sessions are managed with `express-session`, and the session ID is stored in a cookie. On each request, Passport deserializes the user from the session so we know who is logged in."

---

## Module 9 — Authorization (Protecting Routes & Owner-Only Access)

---

### Goal (in simple terms)

Authentication told us **who you are**. Authorization decides **what you're allowed to do**.

Right now, a logged-in user can edit or delete **anyone's** listing. We need to fix two things:

1. Only **logged-in users** can create, edit, or delete listings
2. Only the **owner** of a listing can edit or delete **their own** listing

---

### What is Authorization vs Authentication? (quick recap)

| Term               | Question it answers          | Example in Wanderlust                        |
|--------------------|------------------------------|----------------------------------------------|
| **Authentication** | Who are you?                 | Are you logged in?                           |
| **Authorization**  | What are you allowed to do?  | Is this YOUR listing? Can you edit it?       |

---

### The plan for this module

We will build two **middleware functions**:

| Middleware    | What it checks                              | If it fails                        |
|---------------|---------------------------------------------|------------------------------------|
| `isLoggedIn`  | Is someone logged in?                       | Redirect to `/login`               |
| `isOwner`     | Is the logged-in user the listing's owner?  | Redirect to `/listings`            |

Then we will:
1. Add an `owner` field to the Listing model so each listing remembers who created it
2. Save `req.user._id` as the owner when a listing is created
3. Attach both middlewares to the right routes
4. Hide the Edit/Delete buttons in views for non-owners

---

### Step 1 — Add `owner` field to the Listing model

Open `models/listing.js` and add an `owner` field at the bottom of the schema:

```js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  image: {
    type: String,
    default: "https://images.unsplash.com/photo-1501785888041-af3ef285b470",
  },
  price: {
    type: Number,
  },
  location: {
    type: String,
  },
  country: {
    type: String,
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;
```

---

### Key lines explained

- `type: Schema.Types.ObjectId` — this field stores a MongoDB ID, not a string or number. Every User document has a unique `_id` — we store that here
- `ref: "User"` — this tells Mongoose that this ObjectId points to a document in the `users` collection. This is called a **reference** — it is how you link two collections together (like a foreign key in SQL)

---

### Step 2 — Create the middleware file

Create a new file called `middleware.js` in the project root:

```
AirBNB_Wanderlust/
├── middleware.js    ← create this file
├── app.js
├── models/
├── routes/
└── controllers/
```

Write this inside `middleware.js`:

```js
const Listing = require("./models/listing");

module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    return res.redirect("/login");
  }
  next();
};

module.exports.isOwner = async (req, res, next) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing.owner.equals(req.user._id)) {
    return res.redirect("/listings");
  }
  next();
};
```

---

### Key lines explained

- `req.isAuthenticated()` — this method is added by Passport on every request. It returns `true` if the user is logged in (session exists and `req.user` is set), `false` if not. This is the correct way to check login status in Passport — cleaner than checking `req.user` directly
- `return res.redirect("/login")` — the `return` stops the function immediately. Without `return`, the code would redirect AND still call `next()`, causing a "headers already sent" error
- `next()` — if the check passes, call `next()` to continue to the actual route handler
- `listing.owner.equals(req.user._id)` — both `listing.owner` and `req.user._id` are MongoDB ObjectIds, not plain strings. You cannot compare them with `===` because they are objects — `===` would always return `false` even if the values match. `.equals()` is the correct method for comparing ObjectIds

---

### Step 3 — Save the owner when creating a listing

Open `controllers/listings.js` and update the `createListing` function:

```js
module.exports.createListing = async (req, res) => {
  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  await newListing.save();
  res.redirect("/listings");
};
```

---

### Key lines explained

- `newListing.owner = req.user._id` — `req.user` is the logged-in user object (set by Passport's deserializeUser on every request). We grab their `_id` and store it on the listing before saving. This links the listing to the user who created it

---

### Step 4 — Protect routes with middleware

Open `routes/listings.js` and update it:

```js
const express = require("express");
const router = express.Router();
const listingController = require("../controllers/listings");
const { isLoggedIn, isOwner } = require("../middleware");

router.get("/", listingController.index);
router.get("/new", isLoggedIn, listingController.renderNewForm);
router.post("/", isLoggedIn, listingController.createListing);
router.get("/:id", listingController.showListing);
router.get("/:id/edit", isLoggedIn, isOwner, listingController.renderEditForm);
router.put("/:id", isLoggedIn, isOwner, listingController.updateListing);
router.delete("/:id", isLoggedIn, isOwner, listingController.destroyListing);

module.exports = router;
```

---

### Key lines explained

- `{ isLoggedIn, isOwner } = require("../middleware")` — destructures both functions from the middleware file in one line
- `isLoggedIn` sits before the controller on protected routes — Express runs middleware left to right. If `isLoggedIn` fails (not logged in), it redirects and the controller never runs
- `isLoggedIn, isOwner` together on edit/update/delete — first we check if you are logged in, then we check if you own the listing. Both must pass
- Index and Show routes have **no middleware** — anyone (even guests) can browse listings

---

### Step 5 — Populate the owner on the Show page

Right now `listing.owner` is just an ObjectId (a raw ID number). To display the owner's username, we need to **populate** it — replace the ID with the actual User document.

Open `controllers/listings.js` and update `showListing`:

```js
module.exports.showListing = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id).populate("owner");
  res.render("listings/show", { listing });
};
```

---

### Key lines explained

- `.populate("owner")` — tells Mongoose: instead of just storing the ObjectId in `listing.owner`, go fetch the full User document and put it there. After this, `listing.owner` is the full user object, so you can access `listing.owner.username` in the view

---

### Step 6 — Show Edit/Delete buttons only to the owner

Open `views/listings/show.ejs` and update it:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title><%= listing.title %></title>
</head>
<body>
  <h1><%= listing.title %></h1>
  <img src="<%= listing.image %>" alt="listing image" width="400" />
  <p><%= listing.description %></p>
  <p><strong>Location:</strong> <%= listing.location %>, <%= listing.country %></p>
  <p><strong>Price:</strong> Rs.<%= listing.price %> / night</p>
  <% if (listing.owner) { %>
    <p><strong>Listed by:</strong> <%= listing.owner.username %></p>
  <% } %>

  <% if (currentUser && listing.owner && listing.owner._id.equals(currentUser._id)) { %>
    <a href="/listings/<%= listing._id %>/edit">Edit Listing</a>
    <form action="/listings/<%= listing._id %>?_method=DELETE" method="POST">
      <button type="submit">Delete Listing</button>
    </form>
  <% } %>

  <a href="/listings">Back to all listings</a>
</body>
</html>
```

---

### Key lines explained

- `currentUser` — set via `res.locals` in `app.js` (next step), automatically available in every EJS view
- `listing.owner._id.equals(currentUser._id)` — ObjectId comparison using `.equals()`. We check in the view too so buttons do not appear for non-owners. The middleware is still the real protection — hiding the button is just a UX improvement
- The `if` block means: if someone is logged in AND they own this listing, show the edit/delete controls. Otherwise show nothing

---

### Step 7 — Make `currentUser` available in all views

`req.user` exists in routes and controllers but **not in EJS views**. We use `res.locals` to make it available everywhere automatically.

Open `app.js` and add this middleware after the passport lines:

```js
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
});
```

---

### Key lines explained

- `res.locals` — a special object in Express. Anything stored here is automatically available in every EJS view rendered during that request. No need to pass it manually in every `res.render()`
- `res.locals.currentUser = req.user` — after passport's `deserializeUser` runs, `req.user` is either the logged-in user object or `undefined`. We copy it to `res.locals` so every view can check `currentUser`
- This middleware must go **after** `passport.session()` — because that is what sets `req.user`. If it goes before, `req.user` will not be set yet

---

### Runnable Checkpoint

Run:

```bash
node app.js
```

Your terminal should show:

```
Server started on port 3000
Connected to MongoDB
```

Test these one by one:

1. Log out, then try visiting `http://localhost:3000/listings/new` — you should be redirected to `/login`
2. Log in, then create a new listing — you should see **Edit** and **Delete** buttons on the show page
3. Log in as a **different user** (register a second account), then visit the first user's listing — Edit and Delete should **not appear**
4. Try directly visiting `/listings/<id>/edit` while logged in as the non-owner — you should be redirected to `/listings`

- **What should work:** Guests cannot create listings. Non-owners cannot edit or delete. Owner sees their own controls
- **What is NOT built yet:** Flash messages to tell the user why they were redirected — coming in the next module

---

### Common Mistakes

- Using `===` to compare ObjectIds — always use `.equals()` for MongoDB ObjectId comparisons, never `===`
- Forgetting `return` before `res.redirect()` in middleware — without `return`, the redirect fires AND `next()` is called, causing a crash
- Putting `res.locals.currentUser = req.user` BEFORE `passport.session()` — `req.user` will not be set yet, always after passport
- Forgetting `.populate("owner")` on showListing — `listing.owner` will be a raw ID and `listing.owner.username` will be undefined

---

### Interview Tip

If asked *"how do you implement authorization in your app?"*, say:

> "We use two custom middleware functions — `isLoggedIn` checks `req.isAuthenticated()` which Passport sets on every request, and `isOwner` fetches the listing from the database and compares its `owner` field to `req.user._id` using `.equals()` because they are MongoDB ObjectIds. These middlewares are applied directly in the route definitions, so the controller only runs if both checks pass. We also use `res.locals` to pass the current user to all EJS views so we can conditionally show edit and delete controls."

---

## Module 10 — Flash Messages

---

### Goal (in simple terms)

Right now when something goes wrong — wrong password, not the owner, not logged in — the user just gets silently redirected with no explanation. Flash messages fix that. They are one-time messages that appear once and disappear on the next request.

Examples:
- After login → "Welcome back, ekta!"
- After logout → "You have been logged out"
- Trying to edit someone else's listing → "You do not have permission to do that"
- Trying to access a protected page → "You must be logged in first"

---

### How flash messages work

Flash messages are stored in the **session** and cleared as soon as they are read — so they show exactly once:

```
1. Action happens (login, error, redirect)
2. req.flash("success", "Welcome back!") — stores message in session
3. User lands on next page
4. res.locals reads the flash and passes it to the view
5. EJS displays it
6. Flash is cleared — gone on next refresh
```

---

### Package we need

```bash
npm install connect-flash
```

- `connect-flash` — middleware that adds `req.flash()` to every request, using the session to store one-time messages

---

### Step 1 — Set up connect-flash in app.js

Open `app.js` and add:

```js
const flash = require("connect-flash");
```

Then after `app.use(session(...))`, add:

```js
app.use(flash());
```

And update the `res.locals` middleware to also pass flash messages to all views:

```js
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});
```

Your full `app.js` should now look like this:

```js
const express = require("express");
const app = express();
const path = require("path");
const methodOverride = require("method-override");
const mongoose = require("mongoose");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user");
const listingRouter = require("./routes/listings");
const userRouter = require("./routes/user");

mongoose.connect("mongodb://127.0.0.1:27017/wanderlust")
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log("MongoDB connection error:", err);
  });

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

const sessionOptions = {
  secret: "wanderlust-secret-key",
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  },
};
app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

app.use("/listings", listingRouter);
app.use("/", userRouter);

app.listen(3000, () => {
  console.log("Server started on port 3000");
});
```

---

### Key lines explained

- `app.use(flash())` — must go **after** `app.use(session(...))` because flash uses the session to store messages. If you put it before, there is no session yet and it will crash
- `req.flash("success")` — reads all success messages from the session and clears them at the same time. Returns an array
- `res.locals.success = req.flash("success")` — makes the flash messages available in every EJS view automatically, same way we did `currentUser`
- We do this in one central place in `app.js` so every view gets it — you never have to pass it manually in `res.render()`

---

### Step 2 — Add flash messages in the user controller

Open `controllers/user.js` and update it:

```js
const User = require("../models/user");

module.exports.renderRegisterForm = (req, res) => {
  res.render("users/register");
};

module.exports.register = async (req, res, next) => {
  const { username, email, password } = req.body;
  const newUser = new User({ email, username });
  const registeredUser = await User.register(newUser, password);
  req.login(registeredUser, (err) => {
    if (err) return next(err);
    req.flash("success", "Welcome to Wanderlust!");
    res.redirect("/listings");
  });
};

module.exports.renderLoginForm = (req, res) => {
  res.render("users/login");
};

module.exports.login = (req, res) => {
  req.flash("success", `Welcome back, ${req.user.username}!`);
  res.redirect("/listings");
};

module.exports.logout = (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    req.flash("success", "You have been logged out");
    res.redirect("/listings");
  });
};
```

---

### Key lines explained

- `req.flash("success", "Welcome to Wanderlust!")` — stores a success message in the session. First argument is the type (`"success"` or `"error"`), second is the message text
- `` `Welcome back, ${req.user.username}!` `` — template literal that personalises the message using the logged-in username. `req.user` is available here because passport already authenticated before this controller runs
- `req.flash()` before `res.redirect()` — always set the flash **before** redirecting. The redirect goes to a new request, and that new request reads the flash from the session

---

### Step 3 — Add flash messages in the listings controller

Open `controllers/listings.js` and update it:

```js
const Listing = require("../models/listing");

module.exports.index = async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index", { listings: allListings });
};

module.exports.renderNewForm = (req, res) => {
  res.render("listings/new");
};

module.exports.createListing = async (req, res) => {
  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  await newListing.save();
  req.flash("success", "New listing created!");
  res.redirect("/listings");
};

module.exports.showListing = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id).populate("owner");
  res.render("listings/show", { listing });
};

module.exports.renderEditForm = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/edit", { listing });
};

module.exports.updateListing = async (req, res) => {
  const { id } = req.params;
  await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  req.flash("success", "Listing updated!");
  res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req, res) => {
  const { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("success", "Listing deleted!");
  res.redirect("/listings");
};
```

---

### Step 4 — Add flash messages in middleware.js

Open `middleware.js` and update it:

```js
const Listing = require("./models/listing");

module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.flash("error", "You must be logged in first");
    return res.redirect("/login");
  }
  next();
};

module.exports.isOwner = async (req, res, next) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing.owner.equals(req.user._id)) {
    req.flash("error", "You do not have permission to do that");
    return res.redirect("/listings");
  }
  next();
};
```

---

### Key lines explained

- `req.flash("error", "...")` before redirect — stores an error message so the next page can display it. The user now knows why they were redirected instead of just silently landing somewhere

---

### Step 5 — Create the flash partial view

Create a new folder and file: `views/includes/flash.ejs`

```
views/
├── includes/
│   └── flash.ejs    ← create this
├── listings/
└── users/
```

Write this inside `views/includes/flash.ejs`:

```html
<% if (success && success.length > 0) { %>
  <div style="background: #d4edda; color: #155724; padding: 10px; margin: 10px 0; border-radius: 4px;">
    <%= success %>
  </div>
<% } %>

<% if (error && error.length > 0) { %>
  <div style="background: #f8d7da; color: #721c24; padding: 10px; margin: 10px 0; border-radius: 4px;">
    <%= error %>
  </div>
<% } %>
```

---

### Key lines explained

- `success && success.length > 0` — `success` is an array (flash returns an array). We only render the div if the array is not empty — otherwise an empty green box would appear on every page
- Inline styles are used here for simplicity since we have no CSS framework yet
- This is a **partial** — a reusable chunk of HTML included in any view with one line

---

### Step 6 — Include the flash partial in views

Add `<%- include("../includes/flash") %>` inside the `<body>` at the top of these four files:

Updated `views/listings/index.ejs`:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Wanderlust — All Listings</title>
</head>
<body>
  <%- include("../includes/flash") %>

  <h1>All Listings</h1>

  <ul>
    <% for (let listing of listings) { %>
      <li>
        <h3><%= listing.title %></h3>
        <p><%= listing.location %>, <%= listing.country %></p>
        <p>₹<%= listing.price %> / night</p>
        <a href="/listings/<%= listing._id %>">View Details</a>
      </li>
    <% } %>
  </ul>

</body>
</html>
```

Updated `views/listings/show.ejs`:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title><%= listing.title %></title>
</head>
<body>
  <%- include("../includes/flash") %>

  <h1><%= listing.title %></h1>
  <img src="<%= listing.image %>" alt="listing image" width="400" />
  <p><%= listing.description %></p>
  <p><strong>Location:</strong> <%= listing.location %>, <%= listing.country %></p>
  <p><strong>Price:</strong> Rs.<%= listing.price %> / night</p>
  <% if (listing.owner) { %>
    <p><strong>Listed by:</strong> <%= listing.owner.username %></p>
  <% } %>

  <% if (currentUser && listing.owner && listing.owner._id.equals(currentUser._id)) { %>
    <a href="/listings/<%= listing._id %>/edit">Edit Listing</a>
    <form action="/listings/<%= listing._id %>?_method=DELETE" method="POST">
      <button type="submit">Delete Listing</button>
    </form>
  <% } %>

  <a href="/listings">Back to all listings</a>
</body>
</html>
```

Updated `views/users/login.ejs`:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Login</title>
</head>
<body>
  <%- include("../includes/flash") %>

  <h1>Log In</h1>
  <form action="/login" method="POST">
    <div>
      <label>Username</label>
      <input type="text" name="username" required />
    </div>
    <div>
      <label>Password</label>
      <input type="password" name="password" required />
    </div>
    <button type="submit">Log In</button>
  </form>
  <a href="/register">Don't have an account? Register</a>
</body>
</html>
```

Updated `views/users/register.ejs`:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Register</title>
</head>
<body>
  <%- include("../includes/flash") %>

  <h1>Create an Account</h1>
  <form action="/register" method="POST">
    <div>
      <label>Username</label>
      <input type="text" name="username" required />
    </div>
    <div>
      <label>Email</label>
      <input type="email" name="email" required />
    </div>
    <div>
      <label>Password</label>
      <input type="password" name="password" required />
    </div>
    <button type="submit">Register</button>
  </form>
  <a href="/login">Already have an account? Log in</a>
</body>
</html>
```

---

### Key lines explained

- `<%- include("../includes/flash") %>` — the `-` in `<%-` outputs raw HTML (not escaped). `include()` pulls in the content of another EJS file. `../includes/flash` goes one level up from `listings/` or `users/` then into `includes/flash.ejs`
- Add this to every view where you want feedback to appear — at minimum index, show, login, and register

---

### Runnable Checkpoint

Run:

```bash
node app.js
```

Your terminal should show:

```
Server started on port 3000
Connected to MongoDB
```

Test these one by one:

1. Log in → you should see **"Welcome back, username!"** on the listings page
2. Log out → you should see **"You have been logged out"** on the listings page
3. Log out and visit `/listings/new` → redirected to `/login` with **"You must be logged in first"**
4. Create a listing → you should see **"New listing created!"**
5. Delete a listing → you should see **"Listing deleted!"**

- **What should work:** Flash messages appear once and disappear on refresh
- **What is NOT built yet:** Styling with Bootstrap — coming in the next module

---

### Common Mistakes

- Putting `app.use(flash())` before `app.use(session(...))` — flash needs the session to store messages, this will crash
- Setting flash AFTER `res.redirect()` — the redirect fires first and the message is never stored. Always `req.flash()` before `res.redirect()`
- Using `<%= include(...) %>` instead of `<%- include(...) %>` — the `=` escapes HTML so your div tags will print as plain text instead of rendering

---

### Interview Tip

If asked *"how do you show feedback messages to users in your app?"*, say:

> "We use `connect-flash` which stores one-time messages in the session. In controllers we call `req.flash('success', 'message')` before redirecting. In `app.js` we read those messages into `res.locals` so every view has access automatically. In the view we use an EJS partial that checks if a message exists and renders a styled div. The message is cleared from the session as soon as it is read, so it only appears once."

---

## Module 11 — Error Handling

### Goal

Build a proper safety net so that when things go wrong — a bad database ID, a page that doesn't exist, an unexpected server crash — the user sees a helpful error page instead of a hanging browser or a raw crash log. This module covers three things:

1. **`wrapAsync`** — a utility that catches errors in async route handlers and forwards them to Express
2. **`ExpressError`** — a custom error class for intentional errors (like "404 Not Found") that carry a status code
3. **Global error handler + 404 handler** — two pieces added to `app.js` that catch everything

---

### The Problem — Why Async Routes Fail Silently

All your controller functions use `async/await`:

```js
module.exports.showListing = async (req, res) => {
  const listing = await Listing.findById(req.params.id);
  res.render("listings/show", { listing });
};
```

If `findById` throws (e.g., the ID is malformed or the document doesn't exist), the promise rejects. **Express does NOT automatically catch async rejections.** The result is one of:

- The browser hangs forever (no response is ever sent)
- The server logs an `UnhandledPromiseRejection` and may crash

The fix is `try/catch` in every function — but that means writing the same boilerplate dozens of times. Instead, we write a single `wrapAsync` helper once and use it everywhere.

---

### Concept — The Error Flow in Express

Express has a built-in error pipeline. When any middleware or route calls `next(err)` — passing a value to `next` — Express skips all normal routes and jumps straight to the **error handler** (a special middleware with 4 arguments). This is the foundation everything else is built on.

```
Request → Route → Controller (async error thrown)
                          ↓
                    .catch(next)      ← wrapAsync does this
                          ↓
               next(err) called
                          ↓
          Error handler (4-arg middleware) runs
                          ↓
               res.status(500).render("error")
```

---

### Step 1 — Create `utils/wrapAsync.js`

**File:** `utils/wrapAsync.js`

```js
module.exports = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};
```

**Line by line:**

- `module.exports = (fn) => {` — exports a function that takes another function (`fn`) as input. `fn` will be your async route handler (e.g., `listingController.index`).
- `return (req, res, next) => {` — returns a NEW function with the standard Express signature `(req, res, next)`. This is what Express actually registers and calls.
- `fn(req, res, next).catch(next);` — calls your original async function. If it throws, `.catch(next)` catches the rejected promise and calls `next(err)`, which triggers Express's error pipeline.

**Mental model — think of it like a try/catch factory:**

Without `wrapAsync`:
```js
// If findById throws, Express never knows. Browser hangs.
module.exports.showListing = async (req, res) => {
  const listing = await Listing.findById(req.params.id);
  res.render("listings/show", { listing });
};
```

With `wrapAsync` (in the route):
```js
router.get("/:id", wrapAsync(listingController.showListing));
// Now if findById throws → .catch(next) → error handler runs
```

---

### Step 2 — Create `utils/ExpressError.js`

Some errors are intentional — a user visits a URL that doesn't exist (404), or accesses something they shouldn't (403). We want to throw errors that carry both a **status code** and a **message**.

**File:** `utils/ExpressError.js`

```js
class ExpressError extends Error {
  constructor(statusCode, message) {
    super();
    this.statusCode = statusCode;
    this.message = message;
  }
}

module.exports = ExpressError;
```

**Line by line:**

- `class ExpressError extends Error {` — creates a custom class that inherits from JavaScript's built-in `Error`. It IS a real error object, but with two extra properties.
- `constructor(statusCode, message)` — when you create one you pass two things: the HTTP status code (like `404`) and a human-readable message.
- `super();` — required when extending a built-in class. Calls the parent `Error` constructor.
- `this.statusCode = statusCode;` — attaches the status code to the error so the error handler can read it.
- `this.message = message;` — attaches the message so the view can display it.

**Usage — you throw it like any error:**
```js
throw new ExpressError(404, "Listing not found");
// or
next(new ExpressError(403, "You are not the owner"));
```

---

### Step 3 — Add Error Handlers to `app.js`

Two things get added to `app.js` **after all your routes**. Order matters — Express reads middleware top to bottom.

**Add the `ExpressError` import at the top:**
```js
const ExpressError = require("./utils/ExpressError");
```

**404 handler — catches any request that didn't match any route:**
```js
app.use((req, res, next) => {
  next(new ExpressError(404, "Page not found"));
});
```

**Global error handler — the final safety net for ALL errors:**
```js
app.use((err, req, res, next) => {
  const { statusCode = 500, message = "Something went wrong" } = err;
  res.status(statusCode).render("error", { message });
});
```

**Line by line — 404 handler:**

- `app.use((req, res, next) => {` — plain middleware, no path. Only runs if NO route above it matched (because routes are checked first, in order).
- `next(new ExpressError(404, "Page not found"))` — creates a custom error with status 404 and passes it into Express's error pipeline.

**Line by line — global error handler:**

- `app.use((err, req, res, next) => {` — the **4-argument signature** is the special syntax Express uses to identify an error handler. Normal middleware has 3 args; error handlers have 4. Express will only call this when `next(err)` was called somewhere.
- `const { statusCode = 500, message = "Something went wrong" } = err;` — destructures the error. If it's an `ExpressError`, we get its `statusCode` and `message`. If it's an unexpected error (no `statusCode`), we default to 500.
- `res.status(statusCode).render("error", { message })` — sets the HTTP status code and renders the error view, passing the message into it.

**Important — `app.all("*")` does NOT work in Express 5.** Use plain `app.use()` instead for the 404 handler. Express 5 uses a newer version of `path-to-regexp` that rejects bare wildcards.

---

### Step 4 — Create `views/error.ejs`

**File:** `views/error.ejs`

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Error — Wanderlust</title>
</head>
<body>
  <h1>Something went wrong!</h1>
  <p><%= message %></p>
  <a href="/listings">Go back to listings</a>
</body>
</html>
```

- `<%= message %>` — prints the error message that was passed in from the error handler. It's escaped (no raw HTML), so it's safe.

---

### Step 5 — Wrap Routes with `wrapAsync`

**File:** `routes/listings.js`

```js
const express = require("express");
const router = express.Router();
const listingController = require("../controllers/listings");
const { isLoggedIn, isOwner } = require("../middleware");
const wrapAsync = require("../utils/wrapAsync");

router.get("/", wrapAsync(listingController.index));
router.get("/new", isLoggedIn, listingController.renderNewForm);
router.post("/", isLoggedIn, wrapAsync(listingController.createListing));
router.get("/:id", wrapAsync(listingController.showListing));
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm));
router.put("/:id", isLoggedIn, isOwner, wrapAsync(listingController.updateListing));
router.delete("/:id", isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));

module.exports = router;
```

**Which handlers get wrapped and why:**

| Handler             | Async? | Wrapped?    | Why                                              |
|---------------------|--------|-------------|--------------------------------------------------|
| `index`             | Yes    | `wrapAsync` | Calls `Listing.find()` — DB call can throw       |
| `renderNewForm`     | No     | Plain       | Just renders a view, no DB call                  |
| `createListing`     | Yes    | `wrapAsync` | Calls `newListing.save()` — DB call can throw    |
| `showListing`       | Yes    | `wrapAsync` | Calls `findById()` — DB call can throw           |
| `renderEditForm`    | Yes    | `wrapAsync` | Calls `findById()` — DB call can throw           |
| `updateListing`     | Yes    | `wrapAsync` | Calls `findByIdAndUpdate()` — DB call can throw  |
| `destroyListing`    | Yes    | `wrapAsync` | Calls `findByIdAndDelete()` — DB call can throw  |

**File:** `routes/user.js`

```js
const express = require("express");
const router = express.Router();
const userController = require("../controllers/user");
const passport = require("passport");
const wrapAsync = require("../utils/wrapAsync");

router.get("/register", userController.renderRegisterForm);
router.post("/register", wrapAsync(userController.register));

router.get("/login", userController.renderLoginForm);
router.post("/login", passport.authenticate("local", {
  failureRedirect: "/login",
}), userController.login);

router.get("/logout", userController.logout);

module.exports = router;
```

- `register` is async (calls `User.register()` which hits the DB) — wrapped.
- Everything else is synchronous or uses callbacks (passport handles its own errors) — not wrapped.

---

### Step 6 — Protect `isOwner` in `middleware.js`

`isOwner` is an async middleware that calls `Listing.findById()`. Without protection, a DB error here also goes unhandled. Wrap it with `wrapAsync`:

**File:** `middleware.js`

```js
const Listing = require("./models/listing");
const wrapAsync = require("./utils/wrapAsync");

module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.flash("error", "You must be logged in first");
    return res.redirect("/login");
  }
  next();
};

module.exports.isOwner = wrapAsync(async (req, res, next) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing.owner.equals(req.user._id)) {
    req.flash("error", "You do not have permission to do that");
    return res.redirect("/listings");
  }
  next();
});
```

- `isLoggedIn` is NOT async — it doesn't touch the database, so no wrapping needed.
- `isOwner` IS async — wrapping it means any DB error during the ownership check gets forwarded to the error handler instead of crashing.

---

### Final `app.js` (complete file)

```js
const express = require("express");
const app = express();
const path = require("path");
const methodOverride = require("method-override");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user");
const listingRouter = require("./routes/listings");
const userRouter = require("./routes/user");
const flash = require("connect-flash");
const ExpressError = require("./utils/ExpressError");

mongoose.connect("mongodb://127.0.0.1:27017/wanderlust")
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.log("MongoDB connection error:", err));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

const sessionOptions = {
  secret: "wanderlust-secret-key",
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  },
};
app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

app.use("/listings", listingRouter);
app.use("/", userRouter);

// 404 — no route matched
app.use((req, res, next) => {
  next(new ExpressError(404, "Page not found"));
});

// Global error handler
app.use((err, req, res, next) => {
  const { statusCode = 500, message = "Something went wrong" } = err;
  res.status(statusCode).render("error", { message });
});

app.listen(3000, () => {
  console.log("Server started on port 3000");
});
```

---

### Runnable Checkpoint

Start your server and test the following:

```bash
node app.js
```

**Expected terminal output:**
```
Server started on port 3000
Connected to MongoDB
```

**Test 1 — Normal page still works:**
Open `http://localhost:3000/listings`

Expected: All listings display normally ✅

**Test 2 — Unknown route gets 404:**
Open `http://localhost:3000/randompage`

Expected: You see the error page with **"Page not found"** ✅

**Test 3 — Bad database ID gets 500:**
Open `http://localhost:3000/listings/badid123`

Expected: You see the error page with a CastError message (MongoDB says the ID format is invalid) ✅

**Action list:**
1. Run `node app.js` in your terminal
2. Visit `/listings` — confirm it works
3. Visit `/randompage` — confirm the error page appears
4. Visit `/listings/badid123` — confirm the error page appears
5. Tell me what you see!

---

### Common Mistakes

- **Forgetting to import `wrapAsync` in the route file** — the route will register without it, but async errors will still be unhandled. No error is thrown on startup, which makes it easy to miss.
- **Wrapping non-async handlers** — `wrapAsync` calls `.catch()` which only works on Promises. If you pass a sync function, it will return `undefined` and `.catch()` will throw. Only wrap `async` functions.
- **Putting the error handler before routes** — Express reads middleware top-to-bottom. If the error handler is above the routes, it will never be reached. It must go last.
- **Using `app.all("*")` in Express 5** — Express 5 uses a newer `path-to-regexp` that rejects bare wildcards. Use `app.use()` instead for the 404 catch-all.
- **Writing the error handler with 3 args instead of 4** — `app.use((req, res, next) => {...})` is treated as normal middleware, not an error handler. It will never be called when `next(err)` is called. The 4th argument `err` is mandatory.

---

### Interview Tip

If asked *"how do you handle errors in an Express application?"*, say:

> "We use a two-layer approach. For async route handlers, we wrap them with a `wrapAsync` utility that calls `.catch(next)` on the returned promise — this forwards any async error into Express's error pipeline. We also have a custom `ExpressError` class that extends the built-in Error with a `statusCode` property, so we can throw intentional errors like 404s. At the bottom of `app.js`, after all routes, we have a 404 catch-all middleware and a 4-argument global error handler that reads the status code and renders an error view. This means all errors — planned or unexpected — are caught in one place."

---

## Module 12 — Image Uploads (Multer + Cloudinary)

### Goal

Right now, listings can only store an image URL — a plain text string pointing to some image on the internet. If a user wants to upload their own photo, there is nowhere for it to go. In this module we add real file upload support:

- **Multer** intercepts the file from the browser form before it reaches your controller
- **Cloudinary** stores the image permanently in the cloud and returns a URL
- We save that URL + a filename to the database so we can delete the image later
- On **edit**, the old image is deleted from Cloudinary and replaced with the new one
- On **delete**, the listing's image is also deleted from Cloudinary

---

### Why Cloudinary? Why not just save to a local folder?

When you deploy your app to a server like Render or Railway, your server's file system is **ephemeral** — it resets every time the server restarts. Any files you save to a local folder will disappear. Cloudinary is a cloud-based media storage service that:

- Gives each uploaded image a permanent URL
- Stores a `filename` (called a public ID) you can use to delete it later
- Has a free tier that is more than enough for a learning project

---

### The Upload Flow (end to end)

```
User selects a file in the browser form
        ↓
Browser sends multipart/form-data request to POST /listings
        ↓
Multer middleware intercepts the file (before controller runs)
        ↓
multer-storage-cloudinary uploads the file directly to Cloudinary
        ↓
Cloudinary stores the image and returns: { path: "https://...", filename: "wanderlust_DEV/abc123" }
        ↓
Multer attaches the result to req.file
        ↓
Controller reads req.file.path (URL) and req.file.filename
        ↓
Saves { url, filename } into the listing's image field in MongoDB
        ↓
User sees the image in the browser via the stored URL
```

---

### Packages we need

```bash
npm install multer cloudinary multer-storage-cloudinary dotenv
```

- `multer` — middleware that reads `multipart/form-data` (the encoding used when forms contain files) and makes the file available on `req.file`
- `cloudinary` — official Cloudinary SDK for Node.js. Lets us configure our account and call the API (e.g., to delete images)
- `multer-storage-cloudinary` — a Multer storage engine that, instead of saving files to disk, uploads them directly to Cloudinary. It connects Multer and Cloudinary together
- `dotenv` — loads environment variables from a `.env` file into `process.env` so you can keep secrets (API keys) out of your code

---

### Step 1 — Create a `.env` file

In the root of your project (same level as `app.js`), create a file called `.env`:

```
CLOUD_NAME=your_cloud_name
CLOUD_API_KEY=your_api_key
CLOUD_API_SECRET=your_api_secret
```

You get these values from your **Cloudinary dashboard** → Settings → API Keys.

**Key lines explained:**

- These are **environment variables** — variables that live outside your code so secrets are never hardcoded in files that get pushed to GitHub
- `CLOUD_NAME` — your Cloudinary account name (appears in your dashboard URL)
- `CLOUD_API_KEY` — public identifier for your Cloudinary account
- `CLOUD_API_SECRET` — private key used to authenticate API calls. Never share this or commit it to git

**Important:** Add `.env` to your `.gitignore` file so this file is never committed:

```
# .gitignore
.env
node_modules/
```

---

### Step 2 — Load `.env` in `app.js`

At the very top of `app.js`, before any other code, add:

```js
if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}
```

**Line by line:**

- `process.env.NODE_ENV` — a standard environment variable that tells Node.js what environment the app is running in: `"development"`, `"production"`, `"test"`, etc.
- `!= "production"` — we only load `.env` in development. In production (on a real server), environment variables are set directly in the hosting platform's dashboard, not from a file
- `require("dotenv").config()` — reads your `.env` file and injects each line into `process.env`. After this runs, `process.env.CLOUD_NAME` will equal whatever you put in the file

**Why this has to be first:** Every line below it in `app.js` may use `process.env`. If you load dotenv after those lines, the variables are undefined when they are first read.

---

### Step 3 — Create `utils/cloudConfig.js`

Create a new file: `utils/cloudConfig.js`

```
utils/
├── wrapAsync.js       ← already exists
├── ExpressError.js    ← already exists
└── cloudConfig.js     ← create this file
```

Write this inside it:

```js
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "wanderlust_DEV",
    allowedFormats: ["png", "jpg", "jpeg"],
  },
});

module.exports = {
  cloudinary,
  storage,
};
```

**Line by line:**

- `require("cloudinary").v2` — imports version 2 of the Cloudinary SDK. Always use `.v2` — it is the current stable API
- `cloudinary.config({...})` — authenticates your Cloudinary account using the 3 values from your `.env` file. This runs once when the file is first `require()`-d
- `process.env.CLOUD_NAME` etc. — reads from environment variables (which dotenv loaded in step 2)
- `new CloudinaryStorage({...})` — creates a Multer-compatible storage engine that uploads files to Cloudinary instead of saving them to disk
- `cloudinary: cloudinary` — tells CloudinaryStorage which configured cloudinary instance to use
- `folder: "wanderlust_DEV"` — all uploaded images go into this folder in your Cloudinary Media Library. Keeps uploads organized
- `allowedFormats: ["png", "jpg", "jpeg"]` — rejects uploads of any other file type at the storage level (an extra safety layer)
- `module.exports = { cloudinary, storage }` — exports both. `storage` is used by Multer in the route file. `cloudinary` is used by the controller to delete images

---

### Step 4 — Update the Listing Model

Open `models/listing.js`. The `image` field was previously a plain `String`. Change it to an object with two fields:

**Before:**
```js
image: {
  type: String,
}
```

**After:**
```js
image: {
  url: {
    type: String,
    default: "https://images.unsplash.com/photo-1501785888041-af3ef285b470",
  },
  filename: {
    type: String,
    default: "listingimage",
  },
},
```

**Full updated `models/listing.js`:**

```js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  image: {
    url: {
      type: String,
      default: "https://images.unsplash.com/photo-1501785888041-af3ef285b470",
    },
    filename: {
      type: String,
      default: "listingimage",
    },
  },
  price: {
    type: Number,
  },
  location: {
    type: String,
  },
  country: {
    type: String,
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;
```

**Why two fields?**

- `url` — the full Cloudinary URL like `https://res.cloudinary.com/...`. This is what goes into `<img src="...">` in your view
- `filename` — the Cloudinary public ID like `wanderlust_DEV/abc123xyz`. This is what you pass to `cloudinary.uploader.destroy()` to delete the image later
- `default: "listingimage"` — for listings that were created before this module (with no real Cloudinary image), we set the filename to `"listingimage"` as a sentinel value. The controller uses this to know NOT to try deleting a non-existent Cloudinary image

---

### Step 5 — Update the Routes

Open `routes/listings.js`. Add Multer setup at the top, then wire it into the `POST` (create) and `PUT` (update) routes:

```js
const express = require("express");
const router = express.Router();
const multer = require("multer");
const { storage } = require("../utils/cloudConfig");
const upload = multer({ storage });
const listingController = require("../controllers/listings");
const { isLoggedIn, isOwner } = require("../middleware");
const wrapAsync = require("../utils/wrapAsync");

router.get("/", wrapAsync(listingController.index));
router.get("/new", isLoggedIn, listingController.renderNewForm);
router.post("/", isLoggedIn, upload.single("listing[image]"), wrapAsync(listingController.createListing));
router.get("/:id", wrapAsync(listingController.showListing));
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm));
router.put("/:id", isLoggedIn, isOwner, upload.single("listing[image]"), wrapAsync(listingController.updateListing));
router.delete("/:id", isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));

module.exports = router;
```

**Key lines explained:**

- `const { storage } = require("../utils/cloudConfig")` — imports the CloudinaryStorage engine we built in Step 3
- `const upload = multer({ storage })` — creates a Multer instance configured to use Cloudinary as its storage. `upload` is now a middleware factory
- `upload.single("listing[image]")` — generates a one-file upload middleware. The string `"listing[image]"` must match the `name` attribute on the `<input type="file">` in your HTML form exactly. Multer reads that field, uploads the file to Cloudinary, and attaches the result to `req.file`
- This middleware is inserted **between** the auth check and the controller function — so the file is uploaded before the controller reads it, but only if the user is logged in

**Why is `upload.single` only on POST and PUT?**

Only create and update involve file uploads. The GET routes (show, edit form, index) just render pages — no files involved. The DELETE route deletes the record but uses the stored `filename` to call the Cloudinary API directly — no Multer needed.

---

### Step 6 — Update the Controller

Open `controllers/listings.js`. Three functions need changes: `createListing`, `updateListing`, and `destroyListing`.

```js
const Listing = require("../models/listing");
const { cloudinary } = require("../utils/cloudConfig");

module.exports.index = async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index", { listings: allListings });
};

module.exports.renderNewForm = (req, res) => {
  res.render("listings/new");
};

module.exports.createListing = async (req, res) => {
  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  if (req.file) {
    newListing.image = { url: req.file.path, filename: req.file.filename };
  }
  await newListing.save();
  req.flash("success", "New listing created!");
  res.redirect("/listings");
};

module.exports.showListing = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id).populate("owner");
  res.render("listings/show", { listing });
};

module.exports.renderEditForm = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/edit", { listing });
};

module.exports.updateListing = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  if (req.file) {
    if (listing.image.filename !== "listingimage") {
      await cloudinary.uploader.destroy(listing.image.filename);
    }
    listing.image = { url: req.file.path, filename: req.file.filename };
    await listing.save();
  }
  req.flash("success", "Listing updated!");
  res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findByIdAndDelete(id);
  if (listing.image.filename !== "listingimage") {
    await cloudinary.uploader.destroy(listing.image.filename);
  }
  req.flash("success", "Listing deleted!");
  res.redirect("/listings");
};
```

**Key lines explained — `createListing`:**

- `const { cloudinary } = require("../utils/cloudConfig")` — imports the configured cloudinary instance (needed for `.uploader.destroy()` later)
- `if (req.file)` — checks whether a file was actually uploaded. If the user submitted the form without choosing a file, `req.file` is `undefined`. The `if` guard prevents a crash in that case
- `req.file.path` — the full Cloudinary URL (e.g., `https://res.cloudinary.com/dcti1pvsn/image/upload/v.../wanderlust_DEV/abc.jpg`). Confusingly named `path` even though it is a URL — this is how `multer-storage-cloudinary` names it
- `req.file.filename` — the Cloudinary public ID (e.g., `wanderlust_DEV/abc123`). This is what you need for deletion later
- We set `newListing.image = { url, filename }` directly instead of going through `req.body.listing`, because the file comes from `req.file`, not from the form body

**Key lines explained — `updateListing`:**

- `Listing.findByIdAndUpdate(id, { ...req.body.listing })` — spreads the form fields (title, description, price, location, country) into the update. This does NOT update the image yet — image is handled separately
- `if (req.file)` — only runs the image update block if the user chose a new image. If they left the file input blank, `req.file` is `undefined` and the existing image is kept as-is
- `listing.image.filename !== "listingimage"` — guard that prevents calling `cloudinary.uploader.destroy("listingimage")` which would fail, because `"listingimage"` is not a real Cloudinary public ID — it is just our sentinel value for old/default listings
- `cloudinary.uploader.destroy(listing.image.filename)` — deletes the OLD image from Cloudinary before saving the new one. `listing` here is the document BEFORE the update (returned by `findByIdAndUpdate`), so `listing.image.filename` is still the old filename
- `listing.image = { url: req.file.path, filename: req.file.filename }` — sets the new image on the in-memory document
- `await listing.save()` — persists the new image fields to the database (the `findByIdAndUpdate` call above did not update the image, so we need an extra `.save()`)

**Key lines explained — `destroyListing`:**

- `Listing.findByIdAndDelete(id)` — deletes the listing from MongoDB AND returns the deleted document (so we still have access to `listing.image.filename` after deletion)
- `listing.image.filename !== "listingimage"` — same guard as in update: skip Cloudinary deletion for listings with no real uploaded image
- `cloudinary.uploader.destroy(listing.image.filename)` — deletes the image from Cloudinary after the listing is deleted from MongoDB. If this fails, the listing is already gone from DB — but the orphaned Cloudinary image is a low-risk outcome for a learning project

---

### Step 7 — Update the EJS Forms

Two views need `enctype="multipart/form-data"` added to their forms, plus an `<input type="file">` field.

**`views/listings/new.ejs`** — the create form:

```html
<form action="/listings" method="POST" enctype="multipart/form-data">
  <div>
    <label>Title</label>
    <input type="text" name="listing[title]" required />
  </div>
  <div>
    <label>Description</label>
    <textarea name="listing[description]"></textarea>
  </div>
  <div>
    <label>Image</label>
    <input type="file" name="listing[image]" accept="image/*" />
  </div>
  <div>
    <label>Price</label>
    <input type="number" name="listing[price]" />
  </div>
  <div>
    <label>Location</label>
    <input type="text" name="listing[location]" />
  </div>
  <div>
    <label>Country</label>
    <input type="text" name="listing[country]" />
  </div>
  <button type="submit">Create Listing</button>
</form>
```

**`views/listings/edit.ejs`** — the update form:

```html
<form action="/listings/<%= listing._id %>?_method=PUT" method="POST" enctype="multipart/form-data">
  <div>
    <label>Title</label>
    <input type="text" name="listing[title]" value="<%= listing.title %>" required />
  </div>
  <div>
    <label>Description</label>
    <textarea name="listing[description]"><%= listing.description %></textarea>
  </div>
  <div>
    <label>Image (leave blank to keep current image)</label>
    <input type="file" name="listing[image]" accept="image/*" />
  </div>
  <div>
    <label>Price</label>
    <input type="number" name="listing[price]" value="<%= listing.price %>" />
  </div>
  <div>
    <label>Location</label>
    <input type="text" name="listing[location]" value="<%= listing.location %>" />
  </div>
  <div>
    <label>Country</label>
    <input type="text" name="listing[country]" value="<%= listing.country %>" />
  </div>
  <button type="submit">Update Listing</button>
</form>
```

**Key lines explained:**

- `enctype="multipart/form-data"` — this is the most important change. Without it, file inputs are completely ignored by the browser. The default form encoding (`application/x-www-form-urlencoded`) can only send text. `multipart/form-data` splits the request body into multiple parts — one per field — and can include binary file data
- `<input type="file" name="listing[image]" accept="image/*" />` — renders a file picker. The `name` attribute (`listing[image]`) must match the string passed to `upload.single()` in the route exactly
- `accept="image/*"` — tells the browser's file picker to only show image files. This is a UI hint only — it does not block non-images from being submitted. The `allowedFormats` in `cloudConfig.js` is the actual server-side enforcement
- The edit form label says `"leave blank to keep current image"` — this reminds users that skipping the file input is valid and will not delete their existing image (because `if (req.file)` in the controller is the guard)

**Also update `views/listings/show.ejs`** to use `listing.image.url` instead of the old `listing.image`:

```html
<img src="<%= listing.image.url %>" alt="listing image" width="400" />
```

And update `views/listings/index.ejs` the same way:

```html
<img src="<%= listing.image.url %>" alt="<%= listing.title %>" width="200" />
```

---

### Final folder structure after Module 12

```
AirBNB_Wanderlust/
│
├── controllers/
│   └── listings.js       ← createListing, updateListing, destroyListing updated
├── models/
│   └── listing.js        ← image field changed to { url, filename }
├── routes/
│   └── listings.js       ← upload.single() added to POST and PUT routes
├── utils/
│   ├── wrapAsync.js
│   ├── ExpressError.js
│   └── cloudConfig.js    ← NEW: Cloudinary + Multer storage setup
├── views/
│   └── listings/
│       ├── new.ejs        ← enctype + file input added
│       ├── edit.ejs       ← enctype + file input added
│       └── show.ejs       ← listing.image.url instead of listing.image
├── .env                   ← NEW: Cloudinary credentials (never commit this)
└── app.js                 ← dotenv loaded at the very top
```

---

### Runnable Checkpoint

**Test 1 — Create a listing with an image upload:**

1. Run `node app.js`
2. Log in and go to `http://localhost:3000/listings/new`
3. Fill in the form, choose a photo from your computer, and submit

Expected terminal output:
```
Server started on port 3000
Connected to MongoDB
```

Expected browser: You are redirected to `/listings` with a flash message "New listing created!" and the listing shows your uploaded photo.

Expected Cloudinary: Go to your Cloudinary dashboard → Media Library → `wanderlust_DEV` folder. You should see the uploaded image there.

---

**Test 2 — Edit a listing and replace the image:**

1. Open any listing that has a real uploaded photo
2. Click **"Edit Listing"**
3. Choose a **different** photo file and submit

Expected browser: You are redirected to the show page with "Listing updated!" and the new photo is displayed.

Expected Cloudinary: The **old** image is gone from the `wanderlust_DEV` folder. Only the new one remains.

---

**Test 3 — Delete a listing:**

1. Open a listing that has an uploaded photo
2. Click **"Delete Listing"**

Expected browser: You are redirected to `/listings` with "Listing deleted!"

Expected Cloudinary: The image that belonged to that listing is **gone** from the `wanderlust_DEV` folder.

---

**Action list:**
1. Run `node app.js`
2. Create a new listing with a real photo — confirm image appears in Cloudinary
3. Edit that listing with a new photo — confirm old image gone, new one appears in Cloudinary
4. Delete that listing — confirm the image disappears from Cloudinary too
5. Tell me what you see!

---

### Common Mistakes

- **Forgetting `enctype="multipart/form-data"` on the form** — this is the single most common mistake. Without it, `req.file` is always `undefined`, Multer never runs, and no error is thrown — the upload silently does nothing
- **`upload.single()` field name not matching the form's `name` attribute** — if the form has `name="listing[image]"` but you write `upload.single("image")`, Multer cannot find the field and `req.file` is `undefined`
- **Not guarding with `if (req.file)` in the controller** — if the user submits the form without choosing a file, `req.file` is `undefined`. Accessing `req.file.path` without the guard throws a TypeError and crashes the request
- **Reading the Cloudinary URL from `req.file.url` instead of `req.file.path`** — `multer-storage-cloudinary` puts the Cloudinary URL in `req.file.path`, not `req.file.url`. This is counterintuitive but it is how the library works
- **Not loading dotenv at the very top of `app.js`** — if any `require()` that reads `process.env` runs before `dotenv.config()`, those values are `undefined`. Cloudinary will reject every upload with an authentication error
- **Committing `.env` to git** — this exposes your Cloudinary API secret publicly. Always add `.env` to `.gitignore` before doing your first commit
- **Forgetting `listing.image.url` in EJS after changing the model** — the old views used `listing.image` (a plain string). After the model change, the URL is at `listing.image.url`. If you forget to update the views, every `<img>` tag will show a broken image

---

### Interview Tip

If asked *"how do you handle image uploads in your app?"*, say:

> "We use Multer as the file upload middleware and Cloudinary as the cloud storage provider. We created a `cloudConfig.js` utility that configures the Cloudinary SDK with our credentials from environment variables and sets up a `multer-storage-cloudinary` storage engine. In the route file, we use `upload.single()` as middleware on the create and update routes — it intercepts the multipart form data, uploads the file to Cloudinary, and attaches the result to `req.file`. In the controller, we read `req.file.path` for the URL and `req.file.filename` for the public ID and save both to the database. On update, before saving the new image, we call `cloudinary.uploader.destroy()` with the old filename to delete the old image. On delete, we do the same — delete the Cloudinary image first, then delete the database record. The model stores image as an object with `url` and `filename` fields so we always have both pieces of information available."

---

## Module 13 — Reviews

### Goal

Right now users can browse listings and create their own — but they cannot interact with other people's listings at all. In this module we add a full review system: logged-in users can leave a star rating and comment on any listing, only the review's author can delete their own review, and when a listing is deleted all its reviews are automatically deleted too.

---

### Concept — What is a nested route?

So far every route has been flat:

```
GET  /listings
POST /listings
GET  /listings/:id
```

Reviews belong **to a specific listing** — you cannot have a review without a listing to attach it to. So review routes are nested inside the listing route:

```
POST   /listings/:id/reviews             ← create a review on listing :id
DELETE /listings/:id/reviews/:reviewId   ← delete review :reviewId from listing :id
```

The listing's `_id` is always in the URL so the controller always knows which listing the review belongs to.

---

### Concept — How is the data stored?

Reviews are stored in their **own MongoDB collection** (their own model). The Listing document holds an **array of ObjectId references** pointing to its reviews:

```
Listing document:
{
  title: "Cozy Goa Beach House",
  reviews: [ ObjectId("abc"), ObjectId("def"), ObjectId("ghi") ]
}

Review documents (separate collection):
{ _id: ObjectId("abc"), comment: "Amazing!", rating: 5, author: ObjectId("user1") }
{ _id: ObjectId("def"), comment: "Good location", rating: 4, author: ObjectId("user2") }
```

This is a **one-to-many relationship** — one listing has many reviews. To load the full review objects from a listing, you call `.populate("reviews")`.

---

### Step 1 — Create `models/review.js`

Create a new file: `models/review.js`

```js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
  comment: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: true,
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;
```

**Line by line:**

- `comment: { type: String, required: true }` — the text body of the review. Required so users cannot submit an empty comment
- `rating: { type: Number, min: 1, max: 5, required: true }` — a star rating between 1 and 5. Mongoose enforces `min` and `max` at the schema level — values outside this range fail validation and the document is not saved
- `author: { type: Schema.Types.ObjectId, ref: "User" }` — stores a reference to the User who wrote this review. The same pattern as `listing.owner`. The `ref: "User"` tells Mongoose which collection to look in when you call `.populate("author")`

---

### Step 2 — Update `models/listing.js`

Add a `reviews` array to the Listing schema, and add a **cascade delete hook** so that when a listing is deleted, all its reviews are deleted too.

**Full updated `models/listing.js`:**

```js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review");

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  image: {
    url: {
      type: String,
      default: "https://images.unsplash.com/photo-1501785888041-af3ef285b470",
    },
    filename: {
      type: String,
      default: "listingimage",
    },
  },
  price: {
    type: Number,
  },
  location: {
    type: String,
  },
  country: {
    type: String,
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
});

listingSchema.post("findOneAndDelete", async (listing) => {
  if (listing) {
    await Review.deleteMany({ _id: { $in: listing.reviews } });
  }
});

const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;
```

**New parts explained:**

- `reviews: [{ type: Schema.Types.ObjectId, ref: "Review" }]` — an array of ObjectId references. Each time someone writes a review, its `_id` gets pushed into this array. The square brackets `[...]` around the object tell Mongoose this field holds an array. The `ref: "Review"` is used by `.populate("reviews")` to know which collection to load from
- `const Review = require("./review")` — imported at the top because the cascade hook needs it
- `listingSchema.post("findOneAndDelete", async (listing) => {...})` — a Mongoose **post middleware** (also called a hook). It runs automatically **after** any `findOneAndDelete` call completes. `findByIdAndDelete` (used in `destroyListing`) calls `findOneAndDelete` under the hood, so this hook fires whenever a listing is deleted
- The first argument to the callback is the deleted document — Mongoose passes it automatically. So `listing` here is the listing that was just removed, including its `reviews` array
- `if (listing)` — guard in case the document was not found (e.g., the ID did not exist)
- `Review.deleteMany({ _id: { $in: listing.reviews } })` — `$in` is a MongoDB operator meaning "where `_id` is in this array". This deletes every Review whose `_id` appears in `listing.reviews` — all in a single database query

---

### Step 3 — Create `routes/reviews.js`

Create a new file: `routes/reviews.js`

```js
const express = require("express");
const router = express.Router({ mergeParams: true });
const reviewController = require("../controllers/reviews");
const { isLoggedIn, isReviewAuthor } = require("../middleware");
const wrapAsync = require("../utils/wrapAsync");

router.post("/", isLoggedIn, wrapAsync(reviewController.createReview));
router.delete("/:reviewId", isLoggedIn, isReviewAuthor, wrapAsync(reviewController.destroyReview));

module.exports = router;
```

**Line by line:**

- `express.Router({ mergeParams: true })` — this is critical for nested routes. By default a child router cannot see params from the parent router. Without `mergeParams: true`, `req.params.id` (the listing ID from `/listings/:id/reviews`) would be `undefined` inside this router. `mergeParams: true` merges parent and child params so both `:id` and `:reviewId` are available on `req.params`
- `router.post("/")` — the full path will be `POST /listings/:id/reviews`. The `/listings/:id/reviews` prefix is added when we mount this router in `app.js`
- `router.delete("/:reviewId")` — the full path will be `DELETE /listings/:id/reviews/:reviewId`
- `isReviewAuthor` — middleware added in Step 5 that checks the review was written by the current user before allowing deletion

---

### Step 4 — Create `controllers/reviews.js`

Create a new file: `controllers/reviews.js`

```js
const Review = require("../models/review");
const Listing = require("../models/listing");

module.exports.createReview = async (req, res) => {
  const listing = await Listing.findById(req.params.id);
  const newReview = new Review(req.body.review);
  newReview.author = req.user._id;
  listing.reviews.push(newReview);
  await newReview.save();
  await listing.save();
  req.flash("success", "Review added!");
  res.redirect(`/listings/${listing._id}`);
};

module.exports.destroyReview = async (req, res) => {
  const { id, reviewId } = req.params;
  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);
  req.flash("success", "Review deleted!");
  res.redirect(`/listings/${id}`);
};
```

**Line by line — `createReview`:**

- `Listing.findById(req.params.id)` — loads the listing this review belongs to. `req.params.id` comes from the URL (`/listings/:id/reviews`). We need the listing so we can push the new review's ID into its `reviews` array
- `new Review(req.body.review)` — creates a Review document from form data. The form sends `review[comment]` and `review[rating]` which Express parses as `req.body.review = { comment: "...", rating: "..." }`
- `newReview.author = req.user._id` — attaches the logged-in user's ID as the review's author. `req.user` is set by Passport on every request when the user is logged in
- `listing.reviews.push(newReview)` — pushes the new review's `_id` into the listing's `reviews` array in memory. Mongoose is smart enough to extract just the `_id` from the full document
- `await newReview.save()` — saves the Review to the `reviews` collection in MongoDB
- `await listing.save()` — saves the updated `reviews` array back into the Listing document. Both saves are necessary because they are two separate documents in two separate collections

**Line by line — `destroyReview`:**

- `const { id, reviewId } = req.params` — destructures both IDs from the URL. `id` is the listing ID, `reviewId` is the review ID. `mergeParams: true` on the router is what makes both available here
- `Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } })` — MongoDB's `$pull` operator removes all matching elements from an array. This removes the review's ID from the listing's `reviews` array without loading the full listing document first
- `Review.findByIdAndDelete(reviewId)` — deletes the actual Review document from the `reviews` collection
- Both operations are required: `$pull` cleans up the reference in the Listing, and `findByIdAndDelete` removes the Review document itself

---

### Step 5 — Add `isReviewAuthor` to `middleware.js`

Open `middleware.js` and add `isReviewAuthor`. You also need to import the Review model at the top:

```js
const Listing = require("./models/listing");
const Review = require("./models/review");
const wrapAsync = require("./utils/wrapAsync");

module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.flash("error", "You must be logged in first");
    return res.redirect("/login");
  }
  next();
};

module.exports.isOwner = wrapAsync(async (req, res, next) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing.owner.equals(req.user._id)) {
    req.flash("error", "You do not have permission to do that");
    return res.redirect("/listings");
  }
  next();
});

module.exports.isReviewAuthor = wrapAsync(async (req, res, next) => {
  const { reviewId, id } = req.params;
  const review = await Review.findById(reviewId);
  if (!review.author.equals(req.user._id)) {
    req.flash("error", "You do not have permission to do that");
    return res.redirect(`/listings/${id}`);
  }
  next();
});
```

**New `isReviewAuthor` explained:**

- `Review.findById(reviewId)` — loads the review to check who wrote it. We need the full document because only the Review model has the `author` field
- `review.author.equals(req.user._id)` — compares ObjectIds using `.equals()`. Never use `===` for MongoDB ObjectIds — they are objects, not strings, so `===` always returns false even when the values are the same
- `return res.redirect(\`/listings/${id}\`)` — if the user is not the author, redirect back to the listing page (not to `/listings` as in `isOwner` — the user was already on that specific listing)

---

### Step 6 — Mount the review router in `app.js`

Open `app.js`. Add the import near the top with the other router imports:

```js
const reviewRouter = require("./routes/reviews");
```

Then mount it after the listings router:

```js
app.use("/listings/:id/reviews", reviewRouter);
```

**Why this path matters:** When Express receives `POST /listings/abc123/reviews`, it matches `/listings/:id/reviews`, strips that prefix, and forwards the remaining path (`/`) to `reviewRouter`. The `:id` value (`abc123`) is preserved in `req.params` because of `mergeParams: true`.

Your full `app.js` router section should now look like:

```js
app.use("/listings", listingRouter);
app.use("/", userRouter);
app.use("/listings/:id/reviews", reviewRouter);
```

---

### Step 7 — Update `showListing` in `controllers/listings.js`

The show listing controller needs to populate reviews AND the author of each review (nested populate):

```js
module.exports.showListing = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: { path: "author" },
    })
    .populate("owner");
  res.render("listings/show", { listing });
};
```

**Line by line:**

- `.populate({ path: "reviews", populate: { path: "author" } })` — nested populate. The outer `populate` loads the full Review documents for every ID in `listing.reviews`. The inner `populate: { path: "author" }` then loads the full User document for `review.author` inside each review. This is what makes `review.author.username` work in the EJS view
- `.populate("owner")` — also populates the listing's owner (was already there from Module 9)
- Both `.populate()` calls are chained — Mongoose runs both before returning the listing

---

### Step 8 — Update `views/listings/show.ejs`

Add the review form (for logged-in users) and the reviews list below the listing details:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title><%= listing.title %></title>
</head>
<body>
  <%- include("../includes/flash") %>

  <h1><%= listing.title %></h1>
  <img src="<%= listing.image.url %>" alt="listing image" width="400" />
  <p><%= listing.description %></p>
  <p><strong>Location:</strong> <%= listing.location %>, <%= listing.country %></p>
  <p><strong>Price:</strong> Rs.<%= listing.price %> / night</p>
  <% if (listing.owner) { %>
    <p><strong>Listed by:</strong> <%= listing.owner.username %></p>
  <% } %>

  <% if (currentUser && listing.owner && listing.owner._id.equals(currentUser._id)) { %>
    <a href="/listings/<%= listing._id %>/edit">Edit Listing</a>
    <form action="/listings/<%= listing._id %>?_method=DELETE" method="POST">
      <button type="submit">Delete Listing</button>
    </form>
  <% } %>

  <hr />

  <% if (currentUser) { %>
    <h2>Leave a Review</h2>
    <form action="/listings/<%= listing._id %>/reviews" method="POST">
      <div>
        <label>Rating (1–5)</label>
        <input type="number" name="review[rating]" min="1" max="5" required />
      </div>
      <div>
        <label>Comment</label>
        <textarea name="review[comment]" required></textarea>
      </div>
      <button type="submit">Submit Review</button>
    </form>
  <% } else { %>
    <p><a href="/login">Log in</a> to leave a review.</p>
  <% } %>

  <hr />

  <h2>Reviews</h2>
  <% if (listing.reviews.length === 0) { %>
    <p>No reviews yet. Be the first!</p>
  <% } else { %>
    <% for (let review of listing.reviews) { %>
      <div>
        <p><strong><%= review.author.username %></strong> — Rating: <%= review.rating %>/5</p>
        <p><%= review.comment %></p>
        <% if (currentUser && review.author._id.equals(currentUser._id)) { %>
          <form action="/listings/<%= listing._id %>/reviews/<%= review._id %>?_method=DELETE" method="POST">
            <button type="submit">Delete Review</button>
          </form>
        <% } %>
      </div>
      <hr />
    <% } %>
  <% } %>

  <a href="/listings">Back to all listings</a>
</body>
</html>
```

**Key parts explained:**

- `<% if (currentUser) { %>` — only logged-in users see the review form. Guests see a "Log in to leave a review" message. This is a UI guard — the route also has `isLoggedIn` as a server-side guard, so even if someone bypasses the UI they are blocked
- `name="review[rating]"` and `name="review[comment]"` — form field names use bracket notation. Express parses these into `req.body.review = { rating: "4", comment: "Great!" }`, which maps directly to how the controller reads the data with `new Review(req.body.review)`
- `listing.reviews.length === 0` — checks whether there are any reviews to display
- `for (let review of listing.reviews)` — iterates over the populated review objects. Works because `showListing` calls `.populate({ path: "reviews", populate: { path: "author" } })`
- `review.author.username` — available because of the nested populate on `author`
- `review.author._id.equals(currentUser._id)` — shows the "Delete Review" button only to the user who wrote that review. `.equals()` is required for ObjectId comparison

---

### Final folder structure after Module 13

```
AirBNB_Wanderlust/
│
├── controllers/
│   ├── listings.js     ← showListing updated with nested populate
│   └── reviews.js      ← NEW: createReview, destroyReview
├── models/
│   ├── listing.js      ← reviews array + cascade delete hook added
│   ├── review.js       ← NEW: comment, rating, author fields
│   └── user.js
├── routes/
│   ├── listings.js
│   ├── reviews.js      ← NEW: POST / and DELETE /:reviewId (mergeParams: true)
│   └── user.js
├── middleware.js        ← isReviewAuthor added
├── views/
│   └── listings/
│       └── show.ejs    ← review form + reviews list added
└── app.js              ← reviewRouter imported and mounted
```

---

### Runnable Checkpoint

**Test 1 — Add a review:**

1. Run `node app.js`
2. Log in and open any listing's show page
3. Fill in a rating (1–5) and a comment, submit

Expected terminal:
```
Server started on port 3000
Connected to MongoDB
```

Expected browser: Redirected back to the same listing's show page with flash message "Review added!" and your review appears below with your username and rating.

---

**Test 2 — Guest cannot review:**

1. Log out
2. Open any listing

Expected: Review form is not visible. You see "Log in to leave a review." instead.

---

**Test 3 — Only author can delete their review:**

1. Log in as User A and add a review
2. Log out, log in as User B
3. Open that same listing

Expected: User B does NOT see a "Delete Review" button next to User A's review.

---

**Test 4 — Author can delete their own review:**

1. Log in as the user who wrote a review
2. Click "Delete Review" on your own review

Expected: Redirected back to the listing with "Review deleted!" flash message. The review is gone from the page.

---

**Test 5 — Cascade delete:**

1. Add at least one review to a listing
2. Delete that listing (you must be the listing's owner)
3. Open MongoDB Compass → `reviews` collection (or run `db.reviews.find({})` in mongosh)

Expected: The reviews that belonged to that listing are gone from the reviews collection.

---

**Action list:**
1. Create `models/review.js`
2. Update `models/listing.js` — add `reviews` array + cascade delete hook
3. Create `routes/reviews.js`
4. Create `controllers/reviews.js`
5. Update `middleware.js` — add `isReviewAuthor`
6. Update `app.js` — import and mount `reviewRouter`
7. Update `controllers/listings.js` — nested populate in `showListing`
8. Update `views/listings/show.ejs` — review form + reviews list
9. Restart server (`node app.js`) and run all 5 tests
10. Tell me what you see!

---

### Common Mistakes

- **Forgetting `mergeParams: true` on the review router** — without it, `req.params.id` is `undefined` inside the review controller, and `Listing.findById(undefined)` returns `null`, causing a crash
- **Only calling `newReview.save()` but not `listing.save()`** — the review is saved to the database but the listing's `reviews` array is never updated. The review exists but is not connected to any listing and never appears on the show page
- **Using `===` to compare ObjectIds** — `review.author === req.user._id` is always `false` because they are objects, not strings. Always use `.equals()`
- **Not importing `Review` in `listing.js`** — the cascade delete hook uses `Review.deleteMany(...)`. If Review is not imported, the hook throws a ReferenceError when any listing is deleted
- **Mounting the review router at `/reviews` instead of `/listings/:id/reviews`** — the listing ID will not be in the URL and `req.params.id` will be undefined in the controller
- **Forgetting to update `showListing` with nested populate** — without `.populate({ path: "reviews", populate: { path: "author" } })`, the `listing.reviews` array contains raw ObjectIds instead of full review objects. The EJS view crashes when trying to access `review.comment` or `review.author.username`

---

### Interview Tip

If asked *"how do you implement reviews in your app?"*, say:

> "Reviews are stored as a separate Mongoose model with a comment, a rating between 1 and 5, and an author reference. Each Listing document has a `reviews` field which is an array of ObjectId references to Review documents — a classic one-to-many relationship. The review routes are nested under listings (`/listings/:id/reviews`) using an Express Router with `mergeParams: true` so the listing ID is available in the review controller. When creating a review, we load the listing, create the Review document, push its ID into the listing's reviews array, and save both documents separately. To show reviews on the listing page, we use nested populate — first populating the reviews array, then populating the author inside each review. For authorization, we have an `isReviewAuthor` middleware that loads the review and compares its author field to `req.user._id` using `.equals()`. For cleanup, we use a Mongoose post middleware hook on the Listing schema that automatically calls `Review.deleteMany()` with `$in` whenever a listing is deleted."


---

## Module 15 — Styling with Bootstrap

### Goal

Transform every plain HTML view into a polished, responsive UI using Bootstrap 5. Introduce a shared **boilerplate layout** (`views/layouts/boilerplate.ejs`) so the navbar, footer, and CSS are defined once and inherited by every page. Use the `ejs-mate` package to enable the layout system.

---

### Why a Shared Layout?

Without a layout, every `.ejs` file repeats the full `<!DOCTYPE html>`, `<head>`, and navbar. That means:
- Adding Bootstrap to every page = editing 7+ files
- Changing the navbar = editing 7+ files
- Risk of pages getting out of sync

With `ejs-mate`, one file (`boilerplate.ejs`) wraps all pages. Each page just provides its unique content via `<%- body %>`. Everything else — navbar, flash messages, footer, Bootstrap CDN links — is defined once.

---

### The Flow (MVC lens)

```
Request -> Route -> Controller -> res.render("listings/index", { listings })
                                          |
                                 ejs-mate intercepts
                                          |
                             views/layouts/boilerplate.ejs
                                          |
                                 <%- body %> <- index.ejs content injected here
                                          |
                              Full HTML response sent to browser
```

---

### Package Installed

```bash
npm install ejs-mate
```

- `ejs-mate` — adds layout support to EJS. Without it, EJS has no concept of a layout file; every view is standalone.

---

### Step 1 — Wire ejs-mate in app.js

Two lines added near the top of `app.js`:

```js
const ejsMate = require("ejs-mate");   // import ejs-mate

app.engine("ejs", ejsMate);            // use ejs-mate as the EJS renderer
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
```

- `require("ejs-mate")` — loads the package
- `app.engine("ejs", ejsMate)` — replaces the default EJS renderer with ejs-mate. This is what enables the layout feature. Without this line, `<% layout(...) %>` tags are silently ignored and `<%- body %>` outputs nothing.
- This line must come **before** `app.set("view engine", "ejs")`.

---

### Step 2 — Create the Shared Layout

**New file: `views/layouts/boilerplate.ejs`**

This is the outer shell every page shares. It contains:
- Bootstrap 5 CSS and Icons CDN links in `<head>`
- Responsive navbar that reads `currentUser` from `res.locals`
- Flash message display (removed from all individual views)
- `<%- body %>` slot where each page injects its content
- Footer
- Bootstrap JS bundle at the bottom of `<body>`

**Key lines:**

```html
<%- body %>
```
- The slot where each page's unique content is injected. Remove it and all pages render blank.

```html
<%- include("../includes/flash") %>
```
- Flash messages are now defined once in the layout, so they appear on every page automatically. This line is removed from all individual view files.

```html
<% if (currentUser) { %>
  <!-- Show username + Logout -->
<% } else { %>
  <!-- Show Login + Sign Up -->
<% } %>
```
- `currentUser` is available via `res.locals` (set up in Module 9). The navbar uses it to show different buttons based on auth state.

```html
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
```
- `bootstrap.bundle.min.js` includes Popper.js — required for the mobile hamburger menu (`navbar-toggler`).

---

### Step 3 — Update flash.ejs to Use Bootstrap Alerts

**File: `views/includes/flash.ejs`**

Before (plain inline styles):
```html
<div style="background: #d4edda; color: #155724; padding: 10px;">
  <%= success %>
</div>
```

After (Bootstrap alert component):
```html
<% if (success && success.length > 0) { %>
  <div class="alert alert-success alert-dismissible fade show" role="alert">
    <i class="bi bi-check-circle-fill me-2"></i><%= success %>
    <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
  </div>
<% } %>

<% if (error && error.length > 0) { %>
  <div class="alert alert-danger alert-dismissible fade show" role="alert">
    <i class="bi bi-exclamation-triangle-fill me-2"></i><%= error %>
    <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
  </div>
<% } %>
```

- `alert-dismissible fade show` — makes the alert animate in and shows a close button
- `data-bs-dismiss="alert"` — Bootstrap JS listens for this attribute and hides the alert when X is clicked
- `bi bi-check-circle-fill` / `bi-exclamation-triangle-fill` — Bootstrap Icons for success/error

---

### Step 4 — Update Every View File

The rule for every view is the same:
1. **Remove** the full `<!DOCTYPE html>`, `<head>`, `<body>` boilerplate
2. **Remove** any `<%- include("../includes/flash") %>` line (now handled by the layout)
3. **Add** `<% layout("../layouts/boilerplate") %>` as the very first line
4. Keep only the page's unique content, now with Bootstrap classes

**Layout path rules:**
- Files inside `views/listings/` or `views/users/` use: `layout("../layouts/boilerplate")`
- Files directly inside `views/` (e.g. `error.ejs`) use: `layout("layouts/boilerplate")`

---

#### views/listings/index.ejs — Bootstrap Card Grid

```ejs
<% layout("../layouts/boilerplate") %>

<div class="d-flex justify-content-between align-items-center mb-4">
  <h2 class="fw-bold mb-0">All Listings</h2>
  <a href="/listings/new" class="btn btn-danger">+ Add Listing</a>
</div>

<div class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
  <% for (let listing of listings) { %>
    <div class="col">
      <div class="card h-100 shadow-sm border-0">
        <img src="<%= listing.image.url %>" class="card-img-top"
             style="height: 200px; object-fit: cover;" />
        <div class="card-body">
          <h5 class="card-title fw-bold"><%= listing.title %></h5>
          <p class="text-muted mb-1">
            <i class="bi bi-geo-alt-fill text-danger"></i>
            <%= listing.location %>, <%= listing.country %>
          </p>
          <p class="mb-0">
            <span class="fw-semibold">&#8377;<%= listing.price.toLocaleString("en-IN") %></span>
            <span class="text-muted"> / night</span>
          </p>
        </div>
        <div class="card-footer bg-white border-0 pb-3">
          <a href="/listings/<%= listing._id %>" class="btn btn-outline-danger btn-sm w-100">
            View Details
          </a>
        </div>
      </div>
    </div>
  <% } %>
</div>
```

**Key Bootstrap classes:**
- `row-cols-1 row-cols-md-2 row-cols-lg-3` — responsive grid: 1 column on mobile, 2 on tablet, 3 on desktop
- `g-4` — gap between grid items (gutters)
- `card h-100 shadow-sm border-0` — equal-height cards, subtle shadow, no default border
- `object-fit: cover` — crops the image to fill the fixed height without distortion
- `listing.price.toLocaleString("en-IN")` — formats price with Indian comma notation (e.g. 1,00,000)

---

#### views/listings/show.ejs — Two Column Layout

Left column (col-lg-8): image, title, price, description, owner name, edit/delete buttons
Right column (col-lg-4): review form card, then existing reviews as cards

**Key Bootstrap classes:**
- `col-lg-8` / `col-lg-4` — two columns on large screens; stacks vertically on mobile
- `d-flex gap-2` — puts Edit and Delete buttons side by side with a gap
- `badge bg-danger` — red pill badge for the star rating display

---

#### views/listings/new.ejs and edit.ejs — Centered Form Card

```ejs
<% layout("../layouts/boilerplate") %>

<div class="row justify-content-center">
  <div class="col-md-7">
    <div class="card border-0 shadow-sm">
      <div class="card-body p-4">
        <h2 class="fw-bold mb-4">Create a New Listing</h2>
        <form ...>
          <div class="mb-3">
            <label class="form-label fw-semibold">Title</label>
            <input type="text" class="form-control" name="listing[title]" required />
          </div>
          ...other fields follow same pattern...
          <button type="submit" class="btn btn-danger w-100">Create Listing</button>
        </form>
      </div>
    </div>
  </div>
</div>
```

**Key Bootstrap classes:**
- `row justify-content-center` — horizontally centers the form on the page
- `col-md-7` — 7/12 columns wide on medium+ screens, full width on mobile
- `form-label` + `form-control` — Bootstrap-styled labels and inputs with padding, border, focus ring
- `w-100` on submit button — full-width button

---

#### views/users/login.ejs and register.ejs — Centered Auth Card

Same pattern as the form pages but narrower (`col-md-5`). Includes a link at the bottom to switch between login and register.

---

#### views/error.ejs — Centered Error State

```ejs
<% layout("layouts/boilerplate") %>

<div class="row justify-content-center mt-5">
  <div class="col-md-6 text-center">
    <i class="bi bi-exclamation-triangle-fill text-danger" style="font-size: 3rem;"></i>
    <h2 class="fw-bold mt-3">Something went wrong!</h2>
    <p class="text-muted"><%= message %></p>
    <a href="/listings" class="btn btn-danger mt-2">Back to Listings</a>
  </div>
</div>
```

Note: `error.ejs` lives directly in `views/`, not a subfolder. Its layout path is `"layouts/boilerplate"` without `../`.

---

### Final Folder Structure After Module 15

```
AirBNB_Wanderlust/
|
+-- views/
|   +-- layouts/
|   |   +-- boilerplate.ejs    <- NEW: shared layout (navbar, footer, Bootstrap CDN)
|   +-- includes/
|   |   +-- flash.ejs          <- UPDATED: now uses Bootstrap alert classes
|   +-- listings/
|   |   +-- index.ejs          <- UPDATED: Bootstrap card grid, layout tag
|   |   +-- show.ejs           <- UPDATED: two-column layout, Bootstrap cards
|   |   +-- new.ejs            <- UPDATED: centered form card, Bootstrap inputs
|   |   +-- edit.ejs           <- UPDATED: centered form card, Bootstrap inputs
|   +-- users/
|   |   +-- login.ejs          <- UPDATED: centered auth card
|   |   +-- register.ejs       <- UPDATED: centered auth card
|   +-- error.ejs              <- UPDATED: centered error state with icon
+-- app.js                     <- UPDATED: ejsMate imported, app.engine() added
```

---

### Runnable Checkpoint

**Action list:**
1. Run `node app.js`
2. Open `http://localhost:3000/listings`

**Expected terminal:**
```
Server started on port 3000
Connected to MongoDB
```

**Expected browser — Index page:**
- Wanderlust navbar at top with red logo, Login / Sign Up / New Listing buttons
- Listing cards in a 3-column grid on desktop (stacks on mobile)
- Each card has an image, title, location with pin icon, price, and View Details button
- Footer at the bottom

**Expected browser — Show page:**
- Left: large image, title, price, description, owner name
- Right: review form (if logged in) or login prompt, then existing reviews in cards with star badge
- Edit/Delete buttons only appear if you are the listing owner

**Expected browser — New/Edit pages:**
- Centered card with clean Bootstrap form inputs

**Expected browser — Login/Register pages:**
- Narrow centered card, red submit button, link to switch between forms

**Expected browser — Flash messages:**
- Green Bootstrap alert with check icon for success (dismissible with X)
- Red Bootstrap alert with warning icon for errors (dismissible with X)

3. Test every page and tell me what you see!

---

### Common Mistakes

- **`app.engine("ejs", ejsMate)` missing or placed after `app.set("view engine", "ejs")`** — ejs-mate is not used and the layout system silently fails. Pages render without navbar or CSS.
- **Wrong layout path in error.ejs** — `error.ejs` is in `views/`, not a subfolder. Its layout path must be `"layouts/boilerplate"` not `"../layouts/boilerplate"`. The `../` would look outside the views directory.
- **Leaving `<%- include("../includes/flash") %>` in individual view files** — flash messages render twice: once from the layout and once from the view.
- **Forgetting `bootstrap.bundle.min.js`** — the navbar hamburger button on mobile does not work. CSS features (cards, buttons) still work, but JS-powered components (collapse, dismiss) break.
- **Using `<%=` instead of `<%-` for body** — `<%=` HTML-escapes the output. `<%- body %>` must use `<%-` (the raw output tag) — otherwise the injected HTML is escaped and renders as raw text on the page.

---

### Interview Tip

If asked *"how do you manage shared UI across multiple pages in your Node/Express app?"*, say:

> "I use the `ejs-mate` package which adds layout support to EJS. I define a single `boilerplate.ejs` layout file that contains the navbar, footer, Bootstrap CDN links, and flash message display. Every page registers itself as using that layout with `<% layout('../layouts/boilerplate') %>` at the top, and its unique content is automatically injected into the `<%- body %>` slot in the layout. This means changes to the navbar or global styles only need to happen in one file. Bootstrap 5 is loaded via CDN so there is no build step — it is just a link tag in the layout head."

---

## Post-Module 15 Tweaks

### Tweak 1 — Remove duplicate "New Listing" button from navbar

**Problem:** There were two buttons pointing to `/listings/new`:
- "New Listing" in the navbar (`boilerplate.ejs`) — visible on every page
- "Add Listing" on the index page (`index.ejs`) — visible only on the listings page

Having both is redundant. The "Add Listing" button on the index page is more prominent and contextually placed, so the navbar "New Listing" button was removed.

**File changed:** `views/layouts/boilerplate.ejs`

**What was removed:**
```html
<li class="nav-item">
  <a class="btn btn-outline-dark btn-sm" href="/listings/new">
    <i class="bi bi-plus-lg"></i> New Listing
  </a>
</li>
```

This `<li>` block was deleted from the `<ul class="navbar-nav ...">` section in the navbar. The "Add Listing" button in `index.ejs` remains untouched.

---

### Tweak 2 — Update footer copyright year to 2026

**File changed:** `views/layouts/boilerplate.ejs`

**Before:**
```html
&copy; 2024 Wanderlust &mdash; Find your perfect stay.
```

**After:**
```html
&copy; 2026 Wanderlust &mdash; Find your perfect stay.
```

The `&copy;` is an HTML entity for the © symbol. The year was updated from 2024 to 2026 to reflect the current year.

---

### Tweak 3 — Welcome / Landing Page

**Goal:** When the user opens `http://localhost:3000/`, instead of jumping straight into listings, they land on a branded full-screen welcome page with three entry options.

---

#### Why a separate welcome page?

The boilerplate layout (`boilerplate.ejs`) has a light background, navbar, and footer — it's built for content pages. A welcome/landing page needs its own full-screen look. So this page is a **standalone EJS file** — it does NOT use `<% layout(...) %>`. It includes Bootstrap via CDN directly, just like boilerplate does.

---

#### Step 1 — Create `views/home.ejs`

This file is a complete HTML document on its own. Key design decisions:

```html
<div class="welcome-page">  <!-- full-screen maroon gradient container -->
  <div class="welcome-card"> <!-- centered content block, max 600px wide -->
    <!-- globe icon, brand name, divider, tagline, buttons -->
  </div>
</div>
```

**Background gradient:**
```css
background: linear-gradient(135deg, #6b0f1a 0%, #b5172c 50%, #dc3545 100%);
```
- `#6b0f1a` — deep maroon (matches the brand's dark anchor)
- `#b5172c` — mid crimson
- `#dc3545` — Bootstrap's `danger` red (the logo color)
- `135deg` — diagonal gradient for visual depth

**Three entry buttons:**

| Button      | Destination  | Style                       |
|-------------|-------------|------------------------------|
| Sign Up     | `/register` | Solid white, red text        |
| Login       | `/login`    | Transparent, white border    |
| Browse as Guest | `/listings` | Ghost (underlined text link) |

The buttons use custom CSS classes (`btn-welcome-primary`, `btn-welcome-outline`, `btn-welcome-ghost`) with `border-radius: 50px` for a pill shape. On hover they invert — the solid goes hollow and vice versa.

**Tagline text:**
```
From cozy mountain homestays to beachside retreats — discover handpicked stays
that feel like home, wherever in the world you wander.
```

**Note on brand name styling:** The brand name "Wanderlust" uses mixed case (not all-caps). The font is **Cormorant Garamond** (loaded from Google Fonts), weight 300, with `letter-spacing: 10px`. This gives it a thin, posh, luxury-brand feel rather than the heavy look of Bootstrap's default system font at `font-weight: 800`.

```html
<!-- In <head>, after Bootstrap Icons link -->
<link
  href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400&display=swap"
  rel="stylesheet"
/>
```

```css
.brand-name {
  font-family: 'Cormorant Garamond', serif;
  font-size: 4rem;
  font-weight: 300;
  color: #ffffff;
  letter-spacing: 10px;
}
```

- `font-family: 'Cormorant Garamond', serif` — elegant thin serif font; `serif` is the fallback if Google Fonts fails to load
- `font-weight: 300` — light weight, gives it a refined, airy look instead of heavy
- `letter-spacing: 10px` — wide spacing is a hallmark of luxury brand typography

---

#### Step 2 — Add root route in `app.js`

```js
app.get("/", (req, res) => {
  res.render("home");
});
```

- `"/"` — matches when user opens `http://localhost:3000/` with no path
- `res.render("home")` — renders `views/home.ejs`
- No data needs to be passed — this page is purely static HTML/CSS
- This route is placed **before** `app.use("/listings", ...)` so it is matched first

**Key line:**
- `res.render("home")` — `home` maps to `views/home.ejs` because Express knows to look in the `views/` folder (set via `app.set("views", ...)` in app.js)

---

#### Files changed

| File             | Change                                            |
|------------------|---------------------------------------------------|
| `views/home.ejs` | NEW — standalone welcome page                     |
| `app.js`         | Added `app.get("/", ...)` root route above listings router |

---

#### Runnable Checkpoint

1. Restart server: `node app.js`
2. Open `http://localhost:3000/`

**Expected browser:**
- Full-screen deep maroon-to-red gradient background
- Globe icon at top center
- "Wanderlust" in large bold white text (mixed case, not all-caps)
- A short white horizontal divider line
- Tagline in soft white text below
- Two pill-shaped buttons side by side: "Sign Up" (white) and "Login" (outlined)
- "Browse as Guest →" as a ghost link below the buttons
- Footer note at the bottom in faint white text: © 2026 Wanderlust

3. Click each button and confirm it takes you to the right page.

---

#### Common Mistakes

- **Using `<% layout(...) %>` in home.ejs** — don't. This page is standalone. Adding the layout would inject the navbar and footer, breaking the full-screen design.
- **Placing the `/` route after `app.use("/", userRouter)`** — Express matches routes in order. If userRouter is registered first and has any catch-all, the root route may never be reached. Always put `app.get("/", ...)` before the router registrations.

---

### Tweak 4 — Flash error on failed login (invalid username or password)

**Problem:** When a user tried to log in with a username that doesn't exist, the app crashed into the generic error page showing raw error codes — not user-friendly.

**Root cause:** `passport.authenticate()` on failure was only given `failureRedirect` but not told to flash a message. So Passport silently redirected but no flash was set — and in some cases the error propagated to the error handler instead.

**File changed:** `routes/user.js`

**Before:**
```js
router.post("/login", passport.authenticate("local", {
  failureRedirect: "/login",
}), userController.login);
```

**After:**
```js
router.post("/login", passport.authenticate("local", {
  failureRedirect: "/login",
  failureFlash: "Invalid username or password. Please try again.",
}), userController.login);
```

**Key line:**
- `failureFlash: "..."` — when login fails (wrong password or user not found), Passport sets this string as the `error` flash message and redirects to `/login`. The flash is already picked up by `res.locals.error` in `app.js` and displayed by `flash.ejs` as a red Bootstrap alert.
- One generic message for both "user not found" and "wrong password" — this is intentional. Telling the user which one failed lets attackers figure out which usernames exist (called username enumeration).

---

### Tweak 5 — Move "Continue with Google" to the welcome page

**Problem:** Both login and register pages had a "Continue with Google" button. Users were confused about which page to go to — and since Google OAuth does find-or-create automatically, the distinction was meaningless for Google users.

**Solution:** Move the Google button to the welcome page (`home.ejs`) where all three entry options are visible together. Remove it from login and register pages entirely.

**Files changed:**

| File | Change |
|------|--------|
| `views/home.ejs` | Added "Continue with Google" button + `.btn-welcome-google` CSS style |
| `views/users/login.ejs` | Removed Google button |
| `views/users/register.ejs` | Removed Google button |

**Why Google OAuth belongs on the welcome page:**
Our strategy does find-or-create — if the user exists, they're logged in; if not, an account is created. So there is no meaningful difference between "Login with Google" and "Sign Up with Google". Putting it on the welcome page alongside the two manual options makes the choice clear: use Google (one click), or use a form (login or register).

**New welcome page button order:**
```
[ Sign Up ]  [ Login ]        ← manual auth, two separate flows
[ Continue with Google ]      ← one click, handles both automatically
  Browse as Guest →           ← no account needed
```

---

### Tweak 6 — Navbar logo redirects to home page

**File changed:** `views/layouts/boilerplate.ejs`

**Before:**
```html
<a class="navbar-brand fw-bold text-danger fs-4" href="/listings">
```

**After:**
```html
<a class="navbar-brand fw-bold text-danger fs-4" href="/">
```

Clicking the Wanderlust logo now takes the user back to the welcome page (`/`) instead of the listings page.

---

## Module 16 — Google OAuth (Sign in with Google)

### Goal
Let users sign up and log in with their Google account — no password needed. One click and they're in.

---

### Concept — What is OAuth 2.0?

Right now your app handles authentication itself: stores a hashed password, checks it, creates a session. That is **local authentication**.

**OAuth 2.0** is different. Instead of your app verifying the user, you hand that job to a trusted third party — Google. The flow:

```
User clicks "Sign in with Google"
  → App redirects to Google
    → Google asks: "Allow Wanderlust to see your name and email?"
      → User approves
        → Google redirects back to your app with a temporary code
          → Your app exchanges that code for the user's profile info
            → App finds or creates the user in MongoDB
              → Session created, user is logged in
```

You **never see their Google password**. Google handles verification entirely.

---

### Why `passport-google-oauth20`?

Passport already handles local auth. `passport-google-oauth20` is a Passport **strategy** — it plugs into the same Passport system you already know, but uses Google's OAuth flow instead of username/password.

---

### Step 1 — Install the package

```bash
npm install passport-google-oauth20
```

- `passport-google-oauth20` — Passport strategy that handles the entire Google OAuth 2.0 handshake

---

### Step 2 — Get Google credentials (done in browser)

1. Go to [https://console.cloud.google.com](https://console.cloud.google.com)
2. Create a new project → name it `Wanderlust`
3. Go to **APIs & Services → OAuth consent screen**
   - User Type: **External**
   - Fill in app name and support email → save and continue
4. Go to **APIs & Services → Credentials**
   - Click **Create Credentials → OAuth 2.0 Client ID**
   - Application type: **Web application**
   - Under **Authorized redirect URIs**, add exactly:
     ```
     http://localhost:3000/auth/google/callback
     ```
   - Click **Create**
5. Copy the **Client ID** and **Client Secret**

---

### Step 3 — Add credentials to `.env`

```
GOOGLE_CLIENT_ID=paste_your_client_id_here
GOOGLE_CLIENT_SECRET=paste_your_client_secret_here
```

- These are secrets — never commit them to GitHub
- `dotenv` already loads this file on startup

---

### Step 4 — Update `models/user.js`

Added `googleId` field to the schema:

```js
googleId: {
  type: String,
},
```

- No `required: true` — local users don't have a Google ID, so it stays undefined for them
- When a user signs in with Google, we store `profile.id` here so we can recognise them on future logins without needing their email or password

---

### Step 5 — Configure Google Strategy in `app.js`

Added after `passport.deserializeUser(...)`:

```js
const GoogleStrategy = require("passport-google-oauth20").Strategy;

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "http://localhost:3000/auth/google/callback",
}, async (accessToken, refreshToken, profile, done) => {
  try {
    let user = await User.findOne({ googleId: profile.id });
    if (user) return done(null, user);

    const email = profile.emails[0].value;
    user = await User.findOne({ email });
    if (user) {
      user.googleId = profile.id;
      await user.save();
      return done(null, user);
    }

    const newUser = new User({
      googleId: profile.id,
      email,
      username: profile.displayName,
    });
    await newUser.save();
    return done(null, newUser);
  } catch (err) {
    return done(err, null);
  }
}));
```

**Key lines:**

- `new GoogleStrategy({...}, callback)` — registers the Google strategy with Passport, exactly like `new LocalStrategy(...)` for local auth
- `clientID`, `clientSecret` — pulled from `.env`, identifies your app to Google
- `callbackURL` — must exactly match what you entered in Google Cloud Console
- `async (accessToken, refreshToken, profile, done)` — Google calls this after the user approves. `profile` contains their name, email, and Google ID
- `User.findOne({ googleId: profile.id })` — returning user? Log them in immediately
- `User.findOne({ email })` — new to Google login but already registered normally? Link their Google ID to the existing account — so they can use either method going forward
- `new User({ googleId, email, username: profile.displayName })` — brand new user: create them from Google's data, no password needed
- `done(null, user)` — tells Passport "here's the verified user, create the session"

---

### Step 6 — Add routes in `routes/user.js`

```js
router.get("/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get("/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  userController.googleCallback
);
```

**Key lines:**

- `"/auth/google"` — when user clicks "Continue with Google", they hit this. Passport immediately redirects them to Google's login page — no controller needed
- `scope: ["profile", "email"]` — tells Google what data we want access to
- `"/auth/google/callback"` — Google redirects back here after user approves. Passport runs the strategy (Step 5), then calls `googleCallback`
- `failureRedirect: "/login"` — if Google auth fails, send them back to login

---

### Step 7 — Add `googleCallback` to `controllers/user.js`

```js
module.exports.googleCallback = (req, res) => {
  req.flash("success", `Welcome, ${req.user.username}!`);
  res.redirect("/listings");
};
```

- By the time this runs, Passport has already verified the user and set `req.user`
- Same pattern as the local `login` controller — flash a welcome, redirect to listings

---

### Step 8 — Add Google button to login and register views

Added to both `views/users/login.ejs` and `views/users/register.ejs`, between the form submit button and the `<hr>`:

```html
<div class="text-center text-muted small my-3">or</div>
<a href="/auth/google" class="btn btn-outline-secondary w-100 d-flex align-items-center justify-content-center gap-2">
  <img src="https://www.svgrepo.com/show/475656/google-color.svg" width="18" height="18" alt="Google" />
  Continue with Google
</a>
```

- `href="/auth/google"` — triggers the Passport Google redirect
- The Google logo SVG is loaded from a public CDN
- `d-flex align-items-center justify-content-center gap-2` — Bootstrap flex classes to center the logo and text side by side

---

### Files changed

| File                        | Change                                                    |
|-----------------------------|-----------------------------------------------------------|
| `models/user.js`            | Added `googleId` field                                    |
| `app.js`                    | Imported GoogleStrategy, configured passport.use()        |
| `routes/user.js`            | Added `/auth/google` and `/auth/google/callback` routes   |
| `controllers/user.js`       | Added `googleCallback` method                             |
| `views/users/login.ejs`     | Added "Continue with Google" button                       |
| `views/users/register.ejs`  | Added "Continue with Google" button                       |

---

### Runnable Checkpoint

**Before you test:** Make sure you have added `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` to your `.env` file.

1. Restart server: `node app.js`
2. Open `http://localhost:3000/login`

**Expected browser:**
- Login form with username and password
- "or" divider below the submit button
- "Continue with Google" button with the Google logo
- Clicking it redirects you to Google's account chooser
- After selecting your Google account, you land on `/listings` with a flash: "Welcome, [Your Name]!"

3. Check MongoDB — a new user document should exist with `googleId` set and no `hash`/`salt` fields

---

### Common Mistakes

- **Callback URL mismatch** — the URL in Google Cloud Console must be character-for-character identical to `callbackURL` in the strategy. Even a trailing slash difference causes a `redirect_uri_mismatch` error from Google.
- **Not adding `GOOGLE_CLIENT_ID` to `.env`** — the strategy silently gets `undefined` as the client ID and Google rejects the request with a `400` error.
- **Using `<%=` instead of `<%-` for SVG in views** — not applicable here since it's in an `<img>` tag, but a general reminder that raw HTML must use `<%-`.
- **Google consent screen stuck in "Testing" mode** — if your Google Cloud project's OAuth consent screen is in Testing mode, only test users you manually add can log in. Either add your own email as a test user, or publish the app.

---

### Interview Tip

If asked *"how does Google login work in your app?"*, say:

> "I use the `passport-google-oauth20` strategy alongside my existing Passport local auth setup. When a user clicks 'Continue with Google', they're redirected to Google's OAuth consent screen. After they approve, Google redirects back to my `/auth/google/callback` route with their profile info. My strategy callback then checks MongoDB in three steps: if a user with that Google ID already exists, log them in; if a user with the same email exists from a previous local registration, link the Google ID to that account; otherwise, create a new user. This means one person can use either method and always lands on the same account."
