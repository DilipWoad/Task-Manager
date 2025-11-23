import { emailRegex, passwordRegex } from "../constant.js";

export const validateSignupForm=(formData)=>{
    const isValidEmail = emailRegex.test(formData.email);
    const isValidPassword = passwordRegex.test(formData.password);
    return {isValidEmail,isValidPassword};
}