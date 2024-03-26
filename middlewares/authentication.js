const {validateToken} = require('../service/authentication');
function checkForAuthenticationCookie(cookieName) {
    return function(req, res, next) {
        const token = req.cookies[cookieName];
        // console.log('token',token);
        if (!token) {
            // console.log('No token found');
            return next();
        }
        try {
            const user = validateToken(token);
            req.user = user;
        } catch (error) {
           
        }
        return next();  
    }
}

module.exports = {
    checkForAuthenticationCookie
};