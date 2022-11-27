// Import function from global Model
import { getGlobals, updateGlobals } from "../models/globalModel.js";

// Get All globals
export const showGlobals = (req, res) => {
    getGlobals((err, results) => {
        if (err){
            res.send(err);
        }else{
            res.json(results);
        }
    });
}

// Modify globals
export const modifyGlobals = (req, res) => {
    updateGlobals(req.body, (err, results) => {
        if (err){
            res.send(err);
        }else{
            res.json(results);
        }
    });
}