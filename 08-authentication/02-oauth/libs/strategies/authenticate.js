const User = require('../../models/User');

module.exports = async function authenticate(strategy, email, displayName, done) {
  try {
    if (email) {
      const user = await User.findOne({email});
      if (user) {
        done(null, user);
      } else {
        const u = new User({email, displayName});
        await u.save();
        done(null, u);
      }
    } else {
      done(null, false, 'Не указан email');
    }
  } catch (err) {
    done(err);
  }
};
