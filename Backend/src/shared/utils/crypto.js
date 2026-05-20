import CryptoJS from "crypto-js";

export const encryptMessage = (text) => {
  return CryptoJS.AES.encrypt(text, process.env.MSG_SECRET).toString();
};

export const decryptMessage = (cipher) => {
  const bytes = CryptoJS.AES.decrypt(cipher, process.env.MSG_SECRET);
  return bytes.toString(CryptoJS.enc.Utf8);
};
