export default function planRoutes(planData) {
  let cost = 0;
  async function displayHome(req, res, next) {
    try {
      res.render("index", {
        cost: "R" + cost,
      });
    } catch (err) {
      next(err);
    }
  }
  async function allocate(req, res, next) {
    try {
      let username = req.body.user;
      let planType = req.body.plans;
      if (!username || !planType) {
        res.redirect("/link_user");
      }
      await planData.allocateUser(username, planType);
      let planId = await planData.getUserPlanId(username);
      req.flash("info", "user has been added");
      res.redirect("/price_plans/" + planId);
    } catch (err) {
      next(err);
    }
  }
  async function displayPlans(req, res, next) {
    try {
      await planData.plans();
      res.render("plans", {
        plans: await planData.plans(),
      });
    } catch (err) {
      next(err);
    }
  }
  async function getPlanUsers(req, res, next) {
    try {
      let planId = req.params.id;
      res.render("usersPlans", {
        users: await planData.planUsers(planId),
      });
    } catch (err) {
      next(err);
    }
  }
  function displayAllocate(req, res) {
    res.render("allocate");
  }
  async function calculateBill(req, res, next) {
    try {
      let user = req.body.username;
      let billString = req.body.usageString;
      cost = await planData.calcBill(user, billString);
      res.redirect("/");
    } catch (err) {
      next(err);
    }
  }
  //return
  return {
    displayHome,
    displayAllocate,
    displayPlans,
    allocate,
    getPlanUsers,
    calculateBill,
  };
}
