const sendTokenResponse = (user, statusCode, res) => {
    // Create token
    const token = user.getSignedJwtToken();

    const options = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
        httpOnly: true,
        sameSite: 'none',
        secure: process.env.NODE_ENV === 'production',
    };

    res
        .status(statusCode)
        .cookie('token', token, options)
        .json({
            success: true,
            token,
        });
};

module.exports = sendTokenResponse;