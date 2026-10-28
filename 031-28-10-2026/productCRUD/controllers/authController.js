const authModel = require("../models/authModel");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const ACCESS_TOKEN_TTL = process.env.JWT_ACCESS_TOKEN_TTL || '15m';
const REFRESH_TOKEN_TTL_MS = 30 * 24 * 60 * 60 * 1000;

const signup = (req, res) => {
    
    authModel.checkUserNameDuplication(req.body.userName)
        .then(oneUser => {
            if (oneUser.length != 0) {
                return res.status(409).json({ errors: 'user name reserved .' });
            }
            else {
                authModel.signup(req.body)
                    .then(err => {
                        //
                    });
                return res.status(200).json({ register: 'done' });
            }
        });
}


const createAccessToken = user => {
    const payload = {
        userId: user._id,
        fullname: user.fullName,
        role: user.role
    };

    return jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: ACCESS_TOKEN_TTL });
};

const hashRefreshToken = token => crypto.createHash('sha256').update(token).digest('hex');

const signin = async (req, res) => {
    try {
        const users = await authModel.signin(req.body);
        if (users.length === 0) {
            return res.status(401).json({ login: 'failed, no user name valid' });
        }

        const passwordValid = await bcrypt.compare(req.body.password, users[0].password);
        if (!passwordValid) {
            return res.status(401).json({ login: 'failed, no password valid' });
        }

        const refreshToken = crypto.randomBytes(64).toString('hex');
        const refreshTokenExpiresAt = new Date(Date.now() + REFRESH_TOKEN_TTL_MS);
        const token = createAccessToken(users[0]);

        await authModel.saveRefreshToken(
            users[0]._id,
            hashRefreshToken(refreshToken),
            refreshTokenExpiresAt
        );

        return res.status(200).json({
            login: 'done',
            token,
            refreshToken,
            role: users[0].role
        });
    } catch (error) {
        console.error('Sign-in failed:', error);
        return res.status(500).json({ login: 'failed, server error' });
    }
};

const refresh = async (req, res) => {
    const { refreshToken } = req.body;
    if (typeof refreshToken !== 'string' || refreshToken.length === 0) {
        return res.status(400).json({ refresh: 'failed, refresh token is required' });
    }

    try {
        const nextRefreshToken = crypto.randomBytes(64).toString('hex');
        const refreshTokenExpiresAt = new Date(Date.now() + REFRESH_TOKEN_TTL_MS);
        const user = await authModel.rotateRefreshToken(
            hashRefreshToken(refreshToken),
            hashRefreshToken(nextRefreshToken),
            refreshTokenExpiresAt
        );

        if (!user) {
            return res.status(401).json({ refresh: 'failed, invalid or expired refresh token' });
        }

        const token = createAccessToken(user);
        return res.status(200).json({
            token,
            refreshToken: nextRefreshToken,
            role: user.role
        });
    } catch (error) {
        console.error('Token refresh failed:', error);
        return res.status(500).json({ refresh: 'failed, server error' });
    }
}


const verifySignin = (req, res, next) => {

    try {
        const authHeader = req.headers.authorization;
        const [scheme, token] = authHeader ? authHeader.split(' ') : [];
        if (scheme !== 'Bearer' || !token) {
            return res.status(401).json({ login: 'failed, no or Wrong token sent' });
        }
        var decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
    } catch (error) {
        return res.status(401).json({ login: 'failed, no or Wrong token sent' });
    }

    const id = decodedToken.userId;
    const fullname = decodedToken.fullname;
    const role = decodedToken.role;

    req.user = { id, fullname, role };

    authModel.verifySignin(id, role)
        .then(users => {
            if (users.length == 0) {
                return res.status(401).json({ login: 'failed, no user with this ID or Role' });
            }
            else {
                next();
            }
        })
        .catch(error => {
            console.error('Sign-in verification failed:', error);
            return res.status(500).json({ login: 'failed, server error' });
        });
}


module.exports = {
    signup,
    signin,
    refresh,
    verifySignin
}