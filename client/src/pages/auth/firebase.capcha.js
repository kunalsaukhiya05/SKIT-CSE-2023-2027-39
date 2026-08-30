import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { auth } from "./firebase";

export const setUpRecaptcha = (number) => {
  // Agar pehle se recaptchaVerifier bana hai to use reuse karo
  if (!window.recaptchaVerifier) {
    window.recaptchaVerifier = new RecaptchaVerifier(
      auth,                     //  pehle auth dena hai
      "recaptcha-container",    //  phir container id
      { size: "visible" }     //  options
    );
  }

  return signInWithPhoneNumber(auth, number, window.recaptchaVerifier);
};