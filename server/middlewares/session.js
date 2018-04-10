module.exports = (req, res, next) => {
        if(!req.session.user) {
            req.session.user = {
                messages: []
            };
        }
        next();
        //If they don't have a user property, we'll add one then call next.
        //If they do, we'll skip it and call next.
    }