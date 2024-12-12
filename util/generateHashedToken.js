import SHA256 from 'crypto-js/sha256';

const generateHashedToken = async (token) => {
    return SHA256(token).toString();
};

export default generateHashedToken;
