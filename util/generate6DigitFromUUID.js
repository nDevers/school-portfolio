import {v4 as uuidv4} from 'uuid';
import SHA256 from 'crypto-js/sha256';

const generate6DigitFromUUID = () => {
    const uuid = uuidv4();
    const hash = SHA256(uuid).toString();

    return parseInt(hash.slice(0, 6), 16).toString().padStart(6, '0').slice(0, 6);
};

export default generate6DigitFromUUID;
