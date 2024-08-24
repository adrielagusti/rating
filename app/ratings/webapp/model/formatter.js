// const { parse } = require("dotenv");

sap.ui.define([], function () {
    "use strict";

    return {
        rating: function (value) {
            // return parse(value);
            return parseInt(value);

        },

        showWarning: function (lastCare, icon) {

            if (lastCare !== null) {
                var today = new Date();
                // var delta = Math.abs(today - lastCare) / 1000;
                var delta = Math.abs(today - lastCare) / 1000;
                // calculate (and subtract) whole days
                var days = Math.floor(delta / 86400);

                if (days >= 4){
                    return 'sap-icon://warning'
                } else {
                    // return icon
                }
            }
            else {
                return 'sap-icon://warning';
            }
        }, 
        showWarningColor: function (lastCare, color) {

            if (lastCare !== null) {
                var today = new Date();
                // var delta = Math.abs(today - lastCare) / 1000;
                var delta = Math.abs(today - lastCare) / 1000;
                // calculate (and subtract) whole days
                var days = Math.floor(delta / 86400);

                if (days >= 4){
                    return 'Warning'
                } else {
                    // return color
                }
            }
            else {
                return 'Warning';
            }
        }, 
        getDifferenceOfDays: function (olderDate, newestDate) {
            // debugger;
            const diffTime = Math.abs(newestDate - olderDate);
            const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
            return (diffDays + ' Days') ;
        },

    };
});