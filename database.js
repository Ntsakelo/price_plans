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
    let results = await db.manyOrNone("select id,plan_name from price_plan");
    return results;
  }
  async function planUsers(planId) {
    let listNames = await db.manyOrNone(
      "select username from users where plan_id = $1",
      [planId]
    );
    console.log(listNames);
    return listNames;
  }
  return {
    allocateUser,
    planUsers,
    plans,
  };
}
