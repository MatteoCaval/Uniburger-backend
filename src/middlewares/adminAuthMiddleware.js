const authMiddleware = require('./authMiddleware')
const UserRoleTypes = require('../common/userRoles')

const adminAuthMiddleware = async (req, res, next) => {
    try {
        await authMiddleware(req, res, () => {

            if (req.user.role !== UserRoleTypes.ADMIN) {
                res.status(403).send({ description: 'User not and admin' })
            } else {
                next()
            }
        })

    } catch (error) {
        res.status(400).send({ description: 'Auth error' })
    }

}

module.exports = adminAuthMiddleware