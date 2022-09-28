// import connection
import userDBModel from "../config/db.js";

// Get All Users
export const getUsers = (result) => {
    console.log("Get users called: ");
    userDBModel.find((err, data) => {
        if (err){
            console.log(err);
        }
        else{
            console.log(data);
            result(null, data);
        }
    });
}
