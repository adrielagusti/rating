// const { parse } = require("dotenv");

sap.ui.define([], function () {
    "use strict";

    return {
        rating: function (value) {
            // return parse(value);
            return parseInt(value);
        }

    };
});