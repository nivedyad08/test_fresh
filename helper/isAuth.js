const User = require("../models/userMdl");
const Category = require("../models/categoryMdl");

module.exports = async (sessionid) => {
  let isLogged = false;
  if (sessionid) {
    isLogged = true;
  }
  const user = await User.findOne(
    { email: sessionid },
    { password: 0, status: 0, is_verified: 0 }
  ).lean();

  const categories = await Category.find({ status: true }).lean();
  const cartCount = await User.aggregate([
    { $match: { email: sessionid } },
    { $project: { _id: 0, count: { $size: "$cart" } } },
  ]);

  return {
    user,
    categories,
    cartCount,
    isLogged,
  };
};
