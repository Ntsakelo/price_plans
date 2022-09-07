export default function planData(db) {
  async function allocateUser(username, planType) {
    try {
      if (!username && !planType) {
        return;
      }
      let count = await db.oneOrNone(
        "select count(*) from users where username =$1",
        [username]
      );
      let plan = await db.oneOrNone(
        "select id from price_plan where plan_name = $1",
        [planType]
      );
      if (Number(count.count > 0)) {
        await db.none("update users set plan_id = $1 where username = $2", [
          plan.id,
          username,
        ]);
      } else if (Number(count.count <= 0)) {
        await db.none("insert into users (username,plan_id) values ($1,$2)", [
          username,
          plan.id,
        ]);
      }
    } catch (err) {
      console.log(err);
    }
  }
  async function plans() {
    try {
      let results = await db.manyOrNone("select id,plan_name from price_plan");
      return results;
    } catch (err) {
      console.log(err);
    }
  }
  async function planUsers(planId) {
    try {
      let listNames = await db.manyOrNone(
        "select username from users where plan_id = $1",
        [planId]
      );
      return listNames;
    } catch (err) {
      console.log(err);
    }
  }
  async function getUserPlanId(username) {
    try {
      let userPlanId = await db.oneOrNone(
        "select plan_id from users where username = $1",
        [username]
      );

      return userPlanId.plan_id;
    } catch (err) {
      console.log(err);
    }
  }
  async function getCosts(username) {
    try {
      let planId = await getUserPlanId(username);
      let costs = await db.oneOrNone(
        "select sms_price,call_price from price_plan where id = $1",
        [planId]
      );
      return costs;
    } catch (err) {
      console.log(err);
    }
  }
  async function calcBill(username, billString) {
    try {
      let costs = await getCosts(username);
      let cost = 0;
      let smsCost = Number(costs.sms_price);
      let callCost = Number(costs.call_price);
      console.log(callCost);
      let billList = billString.split(",");
      for (let i = 0; i < billList.length; i++) {
        let billType = billList[i].trim();
        if (billType.toLowerCase() === "sms") {
          cost += smsCost;
        } else if (billType.toLowerCase() === "call") {
          cost += callCost;
        }
      }

      return cost.toFixed(2);
    } catch (err) {
      console.log(err);
    }
  }
  return {
    allocateUser,
    planUsers,
    plans,
    calcBill,
    getUserPlanId,
  };
}
