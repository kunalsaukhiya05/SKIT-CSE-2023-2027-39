import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { auth } from "./firebase";
import { toast } from "react-hot-toast";

export const setUpRecaptcha = async (number) => {
  const isRealKey =
    import.meta.env.VITE_API_KEY &&
    import.meta.env.VITE_API_KEY.length > 20 &&
    !import.meta.env.VITE_API_KEY.includes("Dummy");

  if (isRealKey && auth) {
    try {
      if (!window.recaptchaVerifier) {
        window.recaptchaVerifier = new RecaptchaVerifier(
          auth,
          "recaptcha-container",
          { size: "invisible" }
        );
      }
      return await signInWithPhoneNumber(auth, number, window.recaptchaVerifier);
    } catch (err) {
      console.warn("Firebase Phone Auth failed, switching to local development OTP mode:", err.message);
    }
  }

  // Local / Rural College Demo Mode fallback (works offline without external SMS billing)
  const defaultOtp = "123456";
  toast.success(`Demo Mode: Use OTP ${defaultOtp}`, { duration: 6000 });

  return {
    confirm: async (enteredOtp) => {
      if (enteredOtp === defaultOtp) {
        return { user: { phoneNumber: number } };
      }
      throw new Error(`Invalid OTP. In demo mode, enter ${defaultOtp}`);
    },
  };
};