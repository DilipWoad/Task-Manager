import { emailRegex, passwordRegex } from "../constant.js";

export const validateLoginForm=(form)=>{
    if(!form.email) return false;
    const isValidEmail = emailRegex.test(form.email);
    // const isValidPassword = passwordRegex.test(form.password);
    return isValidEmail;
}