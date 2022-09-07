import express from "express";
import handlebars from "express-handlebars";
import bodyParser from "body-parser";
import session from "express-session";
import flash from "express-flash";
import pgPromise from "pg-promise";
import PlanRoutes from "./routes/planRoutes.js";
import PlanData from "./database.js";
// import Waiters from "./waiters.js";

const pgp = pgPromise();

const DATABASE_URL =
  process.env.DATABASE_URL ||
  "postgresql://coder:pg123@localhost:5432/phone_bill";

const config = {
  connectionString: DATABASE_URL,
};

if (process.env.NODE_ENV == "production") {
  config.ssl = {
    rejectUnauthorized: false,
  };
}

const db = pgp(config);

const app = express();

app.use(
  session({
    secret: "<add a secret string here>",
    resave: false,
    saveUninitialized: true,
  })
);
app.use(flash());
app.engine("handlebars", handlebars.engine({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

app.use(express.static("public"));

//const waiters = Waiters();
const planData = PlanData(db);
const planRoutes = PlanRoutes(planData);
app.get("/", planRoutes.displayHome);
app.get("/link_user", planRoutes.displayAllocate);
app.get("/price_plans/:id", planRoutes.getPlanUsers);
app.post("/link_user", planRoutes.allocate);
app.get("/price_plans", planRoutes.displayPlans);
var PORT = process.env.PORT || 3030;
app.listen(PORT, function () {
  console.log("app started on port: ", PORT);
});
