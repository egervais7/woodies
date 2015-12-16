var LocalStrategy = require('passport-local').Strategy;
var PinterestStrategy = require('passport-pinterest').Strategy;
var db = require('./../models');

module.exports = {
  localStrategy: new LocalStrategy ({
    usernameField : 'email'
  },
  function(email, password, done){
    db.user.find({where: {email: email}}).then(function(user){
      if (user) {
        user.checkPassword(password, function(err, result) {
          if (err) return done(err);
          if (result) {
            done(null, user.get());
          } else {
            done(null, false, {message: "Invalid Password"});
          }
        });
      } else {
        done(null, false, {message: "Unknown User"});
      }
    });
  }),
  pinterestStrategy: new PinterestStrategy({
    clientID : process.env.PINTEREST_APP_ID,
    clientSecret : process.env.PINTEREST_APP_SECRET,
    scope: ['read_public', 'read_relationships'],
    callbackURL : process.env.BASE_URL + '/auth/pinterest/callback',
    profileFields : ['email', 'displayName']
  },
  function(accessToken, refreshToken, profile, done){
    db.provider.find({where: {
      pinterestId: profile.id,
      type: profile.provider
    }, include: [db.user]}).then(function(provider){
      if (provider && provider.user) {
        provider.token = accessToken;
        provider.save().then(function(){
          done(null, provider.user.get());
        });
      } else {
        var email = profile.emails[0].value;
        db.user.findOrCreate({
          where : {email: email},
          defaults: {name: profile.displayName}
        }).spread(function(user, created){
          if (created) {
            user.createProvider({
              pid: profile.id,
              token: accessToken,
              type: profile.provider
            }).then(function(){
              done(null, user.get);
            });
          } else {
            done(null, false, {message: 'You already signed up with this email. Please log in'});
          }
        });
      }
    });
  }),
  serializeUser: function(user, done){
    done(null, user.id);
  },
  deserializeUser: function(id, done){
    db.user.findById(id).then(function(user){
      done(null, user.get());
    }).catch(done);
  }
};
