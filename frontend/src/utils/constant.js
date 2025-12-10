export const CLOSE_EYE ='https://cdn-icons-png.flaticon.com/32/8442/8442580.png';
export const OPEN_EYE = 'https://cdn-icons-png.flaticon.com/32/16116/16116622.png';
export const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
export const passwordRegex =/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{8,}$/gm;
export const BASE_URL = "http://localhost:8080/api/v1";

export const getFirstLastNameLetters=(fullName)=>{
    const d = fullName.split(" ");
    
    const fi = d[0].charAt(0).toUpperCase();
    const se = !d[d.length-1] ?"": d[d.length-1]?.charAt(0)?.toUpperCase();

    return `${fi}${se}`
}
