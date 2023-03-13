// Import nodemail transporter
import transporter from "../config/email.js";

// Import function from password reset request Model
import { createPasswordResetRequest, findPasswordResetRequest, deletePasswordResetRequest, modifyPasswordResetRequest } from "../models/passwordResetRequestModel.js";
import {getUserByEmail} from "../models/userModel.js";

// Create a new password reset request for email
export const addPasswordResetRequest = (req, res) => {
    getUserByEmail(req.body.email, (err, results) => {
        if (err){
            res.send(err);
        }else{

            // Put retrieved user_id in data
            const data = {user_id : results[0]._id}

            // Add a code
            data.code = "";
            const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
            for (let i = 0; i < 6; i++) {
                data.code += characters.charAt(Math.floor(Math.random() * 6));
            }

            createPasswordResetRequest(data, (err, results) => {
                if (err){
                    res.send(err);
                }else{
                    res.json(results);

                    // If Successful, send email to User
                    const mailData = {
                        from: 'ikumailer@gmail.com',  // sender address
                        to: req.body.email,   // list of receivers
                        subject: 'Iku Password Reset Request',
                        text: '',
                        html: `<b>A request was done to reset your Iku password</b><br>Here is your code: ${data.code}`,
                    };

                    transporter.sendMail(mailData, function (err, info) {
                        if(err)
                            console.log(err);
                        else
                            console.log(info);
                    });
                }
            });
        }
    });
}

// Attempt to get password reset request by user_id and code
export const getPasswordResetRequest = (req, res) => {
    const data = req.body;
    findPasswordResetRequest(data, (err, results) => {
        if (err){
            res.send(err);
        }else{
            res.json(results);
        }
    });
}

// Update a password reset request by user_id
export const updatePasswordResetRequest = (req, res) => {
    const data = req.body;

    // Add a new code
    data.code = "";
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    for (let i = 0; i < 6; i++) {
        data.code += characters.charAt(Math.floor(Math.random() * 6));
    }

    modifyPasswordResetRequest(data, (err, results) => {
        if (err){
            res.send(err);
        }else{
            res.json(results);

            // If Successful, send email to User
            const mailData = {
                from: 'ikumailer@gmail.com',  // sender address
                to: req.body.email,   // list of receivers
                subject: 'Iku Password Reset Request',
                text: '',
                html: `<b>A request was done to reset your Iku password</b><br>Here is your code: ${data.code}`,
            };

            transporter.sendMail(mailData, function (err, info) {
                if(err)
                    console.log(err);
                else
                    console.log(info);
            });
        }
    });
}

// Remove a password reset request by _id
export const removePasswordResetRequest = (req, res) => {
    const data = req.body;
    deletePasswordResetRequest(data._id, (err, results) => {
        if (err){
            res.send(err);
        }else{
            res.json(results);
        }
    });
}