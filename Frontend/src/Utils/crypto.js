import CryptoJS from "crypto-js";

const SECRET = import.meta.env.VITE_MSG_SECRET;

  export const safeDecrypt = (cipher) => {
  try {
    if (!cipher) return "";
    const bytes = CryptoJS.AES.decrypt(cipher, SECRET);
    const text = bytes.toString(CryptoJS.enc.Utf8);
    return text || cipher; 
  } catch {
    return cipher;
  }
};