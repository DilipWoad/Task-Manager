
export const CLOSE_EYE =
  "https://cdn-icons-png.flaticon.com/32/8442/8442580.png";
export const OPEN_EYE =
  "https://cdn-icons-png.flaticon.com/32/16116/16116622.png";
export const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
export const passwordRegex =
  /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{8,}$/gm;
// export const BASE_URL = "http://localhost:8080/api/v1";
export const BASE_URL = "https://task-manager-production-c519.up.railway.app/api/v1";

export const getFirstLastNameLetters = (fullName) => {
  const d = fullName.split(" ");

  const fi = d[0].charAt(0).toUpperCase();
  if (d.length == 1) {
    return fi;
  }
  const se = d[d.length - 1]?.charAt(0)?.toUpperCase();
  return `${fi}${se}`;
};

export const isTasksPastDue = (taskDeadlineDate) => {
  // let deadline = `2025-12-27T00:00:00.000Z`;

  const deadline = taskDeadlineDate.split("T")[0];

  const deadlineYearMonthDate = deadline.split("-");

  const currentDate = new Date();
  const formattedDate = currentDate.toISOString().split("T")[0];

  const currentYearMonthDate = formattedDate.split("-");

  // console.log("Deadline :: ",deadlineYearMonthDate , " :: Current :: ",currentYearMonthDate)
  //check if it has reached deadline
  if (parseInt(deadlineYearMonthDate[0]) < parseInt(currentYearMonthDate[0])) {
    return true;
  } else if (parseInt(deadlineYearMonthDate[1]) < parseInt(currentYearMonthDate[1])) {
    return true;
  } else if (parseInt(deadlineYearMonthDate[2]) < parseInt(currentYearMonthDate[2]) && parseInt(deadlineYearMonthDate[1]) < parseInt(currentYearMonthDate[1])) {
    return true;
  } else {
    return false;
  }
};

export const localStorageForGroupMembers=(apiGroupMemberData,setGroupMembers)=>{
   //here we need to do localStorage here
      let isMembersExists = localStorage.getItem("groupMembers");
      if (isMembersExists===undefined ||isMembersExists===null) {
        // create a localStorage
        console.log("Creating localStorage as storage not exists ::");
        localStorage.setItem(
          "groupMembers",
          JSON.stringify(apiGroupMemberData),
        );
      } else {
        //check if size has changed or not
        const fromStorage = JSON.parse(isMembersExists);
        if (fromStorage.length !== apiGroupMemberData.length) {
          //update the localStorage
          //rewrite the localStorage with new data
          localStorage.setItem(
            "groupMembers",
            JSON.stringify(apiGroupMemberData),
          );
        }
        setGroupMembers(apiGroupMemberData);
      }
      //
}
