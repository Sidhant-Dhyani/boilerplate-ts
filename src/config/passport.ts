import passport from "passport";
import { ExtractJwt, Strategy as JwtStrategy } from "passport-jwt";
import { env } from "./env";
import { IJwtPayload } from "../interfaces";
import { User } from "../models";

passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: env.JWT_ACCESS_SECRET,
    },
    async (payload: IJwtPayload, done) => {
      try {
        const user = await User.findById(payload.id).select("-password");

        if (!user) {
          return done(null, false, { message: "User no longer exists" });
        }

        return done(null, user);
      } catch (error) {
        return done(error, false);
      }
    },
  ),
);

export default passport;
