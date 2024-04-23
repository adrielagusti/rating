/* eslint-disable no-undef */
sap.ui.define(
  [
    "sap/ui/core/UIComponent",
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "../model/formatter",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
  ],

  function (UIComponent, Controller, JSONModel, formatter, Filter, FilterOperator) {
    "use strict";

    return Controller.extend("blackseeds.ratings.controller.Main", {

      formatter: formatter,

      onInit() {

        // this._setUserResults();

      },

      // _setUserResults() {
      //   let p1 = this._getRatings(this.getOwnerComponent().getModel('loggedUser').getProperty("/GUID"));
      //   let p2 = this._getStrains()
      //   let p3 = this._getAttributes()

      //   Promise.all([p1, p2, p3])
      //     .then(results => {

      //       const [aRatings, aStrains, aAttributes] = results;
        
      //       const result = this.prepareSummarizedModel(aRatings.results, aStrains.results, aAttributes.results);
      //       var iTested = result.filter((item) => item.value > 0).length;
      //       var iTotal = result.length;
      //       this.getView().setModel(new JSONModel({ strains: result, tested: iTested, total: iTotal }), 'dataModel');

      //     })

      // },

      // onUserChange() {
      //   this._setUserResults();
      // },

      getModel: function (sModelName) {
        return this.getView().getModel();
      },

      onSelectRow(oEvent) {
        // The source is the list item that got pressed
        let oItem = oEvent.getParameter("listItem");
        this._showObject(oItem);
      },

      _showObject(oItem) {
        this.getRouter().navTo("ratingChange", {
          objectId: oItem.getBindingContext().getObject().GUID
        });
      },

      getRouter() {
        return UIComponent.getRouterFor(this);
      },

      getName: function (oContext) {
        return oContext.getProperty('name');
      },

      _getRatings(user) {
        // var aFilter = [new Filter("user_GUID", FilterOperator.EQ, user)];

        return new Promise((res, rej) => {
          this.getOwnerComponent().getModel().read("/Ratings", {
            // filters: aFilter,
            success: res,
            error: rej
          })
        });
      },

      _getStrains(strain, user) {
        return new Promise((res, rej) => {
          this.getOwnerComponent().getModel().read("/Strains", {
            success: res,
            error: rej
          })
        });
      },

      _getAttributes() {
        return new Promise((res, rej) => {
          this.getOwnerComponent().getModel().read("/Attributes", {
            success: res,
            error: rej
          })
        });
      },

      // prepareSummarizedModel(aRatings, aStrains, aAttributes) {

      //   let iAttributes = aAttributes.length;


      //   let aSummarized = aStrains.map(strain => {
      //     // Initialize sum for each strain
      //     let sum = 0;

      //     aRatings.forEach(rating => {
      //       if (rating.strain_GUID === strain.GUID) {
      //         // Accumulate the value for the current strain
      //         sum += rating.value;
      //       }
      //     });

      //     return {
      //       ...strain,
      //       value: parseInt(sum / iAttributes)
      //     };
      //   });

      //   return aSummarized;

      // }

    });
  }
);
