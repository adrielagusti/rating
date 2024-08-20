sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "cloudinary"
], function (
    Controller,
    Cloudinary
) {
    "use strict";

    return Controller.extend("blackseeds.ratings.controls.Cloudinary", {

        // import { v2 as cloudinary } from 'cloudinary';

        // /**
        //  * @override
        //  * @param {string} [sId] 
        //  * @param {object} [mSettings] 
        //  * @param {object} [oScope] 
        //  * @returns {sap.ui.base.ManagedObject}
        //  */
        // constructor: function(sId, mSettings, oScope) {
        //     var vReturn = ManagedObject.prototype.constructor.apply(this, arguments);
            
        
        //     return vReturn;
        // },

        // (async function() {
        uploadImage: async function() {
            debugger;
            // Configuration
            Cloudinary.config({
                cloud_name: 'hgyusg0s0',
                api_key: '641639681197656',
                api_secret: process.env.CLOUDINARY_API_SECRET
            });

            // Upload an image
            const uploadResult = await cloudinary.uploader
                .upload(
                    'https://res.cloudinary.com/demo/image/upload/getting-started/shoes.jpg', {
                    public_id: 'shoes',
                }
                )
                .catch((error) => {
                    console.log(error);
                });

            console.log(uploadResult);

            // Optimize delivery by resizing and applying auto-format and auto-quality
            const optimizeUrl = cloudinary.url('shoes', {
                fetch_format: 'auto',
                quality: 'auto'
            });

            console.log(optimizeUrl);

            // Transform the image: auto-crop to square aspect_ratio
            const autoCropUrl = cloudinary.url('shoes', {
                crop: 'auto',
                gravity: 'auto',
                width: 500,
                height: 500,
            });

            console.log(autoCropUrl);
        }
});
});
// ();
