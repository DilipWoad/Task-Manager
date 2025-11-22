import { emailRegex, passwordRegex } from "../constant.js";

export const validateLoginForm=(form)=>{

    console.log("reached Here : ",form)
    const isValidEmail = emailRegex.test(form.email);
    // const isValidPassword = passwordRegex.test(form.password);
    console.log(isValidEmail)
    return isValidEmail;
}