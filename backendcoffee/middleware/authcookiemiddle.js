import { validatethetoken } from "../service/authcookie.js";
import { handleuserlogout } from "../controller/userauthcontroller.js";
function checkforauthcookie(cookiename) {
  return (req, res, next) => {
    const tokencookievalue = req.cookies[cookiename];
    if (!tokencookievalue) {
      console.log("no cookie");
      return next();
    }
    try {
      const usepayload = validatethetoken(tokencookievalue);
      req.user = usepayload;
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        handleuserlogout;
      } else {
        console.log("error", error);
        return next();
      }
    }
    return next();
  };
}
export { checkforauthcookie };
