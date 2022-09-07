export default function planRoutes(planData) {
  async function displayHome(req, res, next) {
    try {
      res.render("index");
    } catch (err) {
      next(err);
    }
  }
  async function allocate(req, res, next) {
    try {
      let username = req.body.user;
      let planType = req.body.plans;
      await planData.allocateUser(username, planType);
      res.redirect("/link_user");
    } catch (err) {
      next(err);
    }
  }
  function displayPlans(req, res, next) {
    res.render("plans");
  }
  function displayAllocate(req, res) {
    res.render("allocate");
  }
  //return
  return {
    displayHome,
    displayAllocate,
    displayPlans,
    allocate,
  };
}
