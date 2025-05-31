const RoleApplication = require("../models/applications")
const User = require("../models/user")

exports.createRoleApplication = async(req,res) => {
    // 
    // console.log(req.body)
    // console.log(req.user)
    try{
        // 
        const user = await User.findOne({email: req.user.email}).exec()
        // debugging only
        // console.log(user)
        if(user){
            const userId = user._id
            req.body.user = userId
            const newApplication = await new RoleApplication(req.body).save()
            if(newApplication){
                res.send(newApplication)
            }
        }
    }
    catch(err){
        // 
        // console.log("Error Error Error")
        res.status(401).send({message: "Application Submission Failed..."})
    }
}

exports.applicationDecision = async(req, res) => {
    // 
    console.log(req.body)
}