const express = require("express");
const jwt = require("jsonwebtoken");
const app = express();
app.use(express.json());
const dotenv = require("dotenv");
const cors = require('cors');

dotenv.config();
// Enable CORS for all routes
app.use(cors());

const users = [{
        id: "1",
        username: "Kuldeep",
        password: "Kuldeep200",
        isAdmin: true,
    },
    {
        id: "2",
        username: "Sonara",
        password: "Sonara200",
        isAdmin: false,
    }
];
//refresh token

//store a refreshToken in list if you use database thane store there plase
let refreshTokens = []
app.post("/api/refresh", (req, res) => {
    //taken the refresh token form the user
    const refreshToken = req.body.token

    //send error if there is no taken or if token is invelide
    if (!refreshToken) return res.status(401).json("you are not authanticated!");
    else if (!refreshTokens.includes(refreshToken)) {
        return res.status(403).json("refresh token is not valid!");
    }
    jwt.verify(refreshToken, process.env.REFRESH_SECRET_KEY, (error, user) => {
        error && console.log(error);
        refreshTokens = refreshTokens.filter((token) => token !== refreshToken);

        const newAccessToken = generateAccessToken(user);
        const newRefreshToken = generateRefreshToken(user);

        refreshTokens.push(newRefreshToken);
        res.status(200).json({
            accessToken: newAccessToken,
            refreshToken: newRefreshToken
        })
    })

    //if evrything is okay, create new token or access token or refresh token and sand to user 
});


// generate an access token

const generateAccessToken = (user) => {
    return jwt.sign({ id: user.id, isAdmin: user.isAdmin },
        process.env.SECRET_KEY, { expiresIn: "15m" });
}


//generete refresh token

const generateRefreshToken = (user) => {
    return jwt.sign({ id: user.id, isAdmin: user.isAdmin },
        process.env.REFRESH_SECRET_KEY, );
}

// POST method
app.post("/api/login", (req, res) => {
    const { username, password } = req.body;
    const user = users.find((U) => {
        return U.username === username && U.password === password;
    });
    if (user) {
        //get Access token
        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);
        refreshTokens.push(refreshToken);

        res.json({
            username: user.username,
            isAdmin: user.isAdmin,
            accessToken,
            refreshToken
        });
    } else {
        res.status(400).json("Username or password incorrect!");
    }
});


const verify = (req, res, next) => {
    const authHeader = req.headers.authorization; // corrected typo
    if (authHeader) {
        const token = authHeader.split(" ")[1];

        jwt.verify(token, process.env.SECRET_KEY, (error, user) => {
            if (error) {
                return res.status(401).json("Token is not valid!");
            }
            req.user = user;
            next();
        });

    } else {
        res.status(401).json("You are not authenticated!");
    }
}

// DELETE method
app.delete("/api/users/:userId", verify, (req, res) => {
    if (req.user.id === req.params.userId || req.user.isAdmin) {
        // Instead of sending a plain string, return an object with a message property
        res.status(200).json("User has been deleted.");
    } else {
        res.status(403).json("You are not allowed to delete this user!");
    }
});

app.post("/api/logout", (req, res) => {
    const refreshToken = req.body.token;
    refreshTokens = refreshTokens.filter((token) => token !== refreshToken);
    res.status(200).json("You logout successfully.");
})


// Your other middleware and routes

const PORT = 5500;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
// app.listen(5500, () => {
//     console.log("app is running yepppppp!");
// });