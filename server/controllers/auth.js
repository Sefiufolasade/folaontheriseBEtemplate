const User = require("../models/user")

exports.createOrUpdateUser= async (req,res)=>{
    const { name, picture, email } = req.user
    
    const user  = await User.findOneAndUpdate(
        {email}, 
        { name: name || email.split("@")[0], picture }, 
        {new: true}
    );

    if(user) {
        console.log("User Updated");
        res.json(user)
    }else{
        const newUser = await new User({
            email,
            name: name || email.split('@')[0],
            picture,
        }).save()
        console.log("New User Created");
        res.json(newUser)
    }
}

exports.currentUser= async (req,res)=>{
    User.findOne({email: req.user.email}).then((user) => {
        res.json(user)
    }).catch((err) => {
        console.log(err);
    })
}