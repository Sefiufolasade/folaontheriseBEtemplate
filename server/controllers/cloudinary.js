const cloudinary = require('cloudinary')

cloudinary.config({ 
    cloud_name: 'dvdy3c2af', 
    api_key: '445675953187966', 
    api_secret: 'zG2MvPeXBOvDKdLncvt9mcKw6Wk',
});

exports.upload = async (req,res) => {
    console.log("image:",req.body.image);
    cloudinary.v2.uploader.upload(req.body.image, {
        public_id: `${Date.now()}`,
        resource_type: 'auto',
        }, (err,result) => {
        if(err) return({success: false, err})
        res.json({
            public_id: result.public_id,
            url: result.secure_url,
        })
        console.log(result);
    });
};
exports.remove = async (req, res) => {
    let image_id = req.body.public_id

    cloudinary.v2.uploader.destroy(image_id, (err, result) => {
        if(err) return({success: false, err})
        res.send("ok")
    })
}