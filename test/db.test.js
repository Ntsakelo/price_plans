import assert from "assert";
import PlanData from "../database.js";
import pgPromise from "pg-promise";

const pgp = pgPromise();
const connectionString =
  process.env.DATABASE_URL ||
  "postgres://coder:pg123@localhost:5432/phone_bill_tests";

const db = pgp({ connectionString });

describe("test the waiters database function", function () {
  this.beforeEach(async function () {
    try {
      await db.none("delete from users");
    } catch (err) {
      console.log(err);
    }
  });
  it("should be able to store names into the database users with a specific plan", async function () {
    try {
      const planData = PlanData(db);
      await planData.allocateUser("Ntsakelo", "sms100");
      await planData.allocateUser("Frank", "sms200");
      await planData.allocateUser("Simi", "weekly");
      let results = await planData.planUsers(1);
      assert.equal("Ntsakelo", results[0].username);
    } catch (err) {
      console.log(err);
    }
  });
  it("should be able to store names into the database and retrieve users with a specific plan", async function () {
    try {
      const planData = PlanData(db);
      await planData.allocateUser("Thuso", "sms100");
      await planData.allocateUser("Lufuno", "sms100");
      await planData.allocateUser("Mathews", "sms100");
      let results = await planData.planUsers(1);
      assert.deepEqual(
        [
          { username: "Thuso" },
          { username: "Lufuno" },
          { username: "Mathews" },
        ],
        results
      );
    } catch (err) {
      console.log(err);
    }
  });
  it("should be able to store names in the database and retrieve users with a specific plan", async function () {
    try {
      const planData = PlanData(db);
      await planData.allocateUser("Clement", "sms100");
      await planData.allocateUser("Thomas", "sms200");
      await planData.allocateUser("King", "sms200");
      let results = await planData.planUsers(2);
      assert.deepEqual([{ username: "Thomas" }, { username: "King" }], results);
    } catch (err) {
      console.log(err);
    }
  });
  it("should be able to return a plan based on the planId", async function () {
    try {
      const planData = PlanData(db);
      let results = await planData.getPlan(1);
      assert.equal("sms100", results.plan_name);
    } catch (err) {
      console.log(err);
    }
  });
  after(function () {
    db.$pool.end;
  });
});
