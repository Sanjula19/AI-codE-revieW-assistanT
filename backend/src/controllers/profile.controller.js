const { getProfile, updateProfile, upgradeToPro } = require('../services/user.service');

const me = async (req, res) => {
  const user = await getProfile(req.userId);
  res.json({ user });
};

const update = async (req, res) => {
  const user = await updateProfile(req.userId, req.body);
  res.json({ user });
};

const upgrade = async (req, res) => {
  const user = await upgradeToPro(req.userId);
  res.json({ message: "Upgraded to Pro!", user });
};

module.exports = { me, update, upgrade };