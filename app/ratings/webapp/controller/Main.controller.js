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
        this._setUserResults();
        this.getView().setModel(new JSONModel({ mode: "rate" }), 'appModel');
      },

      _setUserResults() {
        let p1 = this._getRatings();
        let p2 = this._getStrains()
        // let p3 = this._getAttributes()

        Promise.all([p1, p2])
          .then(results => {

            const [aRatings, aStrains] = results;
    
            // const result = this.prepareSummarizedModel(aRatings.results, aStrains.results, aAttributes.results);
            const result = this._setRatedFlags(aRatings.results, aStrains.results);
            
            var iTested = result.filter((item) => item.isRated === true ).length;

            var iTotal = result.length;

            this.getOwnerComponent().setModel(new JSONModel({ strains: result, tested: iTested, total: iTotal }), 'dataModel');

          })

      },

      
      getModel: function (sModelName) {
        return this.getView().getModel();
      },

      onSelectRow(oEvent) {
        let oItem = oEvent.getSource().getSelectedItem().getBindingContext("dataModel").getObject();
        this._showObject(oItem);
      },
      
      onSelectRowTop(oEvent) {
        let oItem = oEvent.getSource().getSelectedItem().getBindingContext().getObject();
        this._showObject(oItem);
      },

      onSelectNav(oEvent) {
        // The source is the list item that got pressed
        // let oItem = oEvent.getParameter("listItem");
        this.getRouter().navTo("rating", {
          objectId: oEvent.getParameters().selectedItem.getKey()
        });
      },
      // 
      _showObject(oItem) {
        this.getRouter().navTo("rating", {
          objectId: oItem.ID
        });
      },

      getRouter() {
        return UIComponent.getRouterFor(this);
      },

      getName: function (oContext) {
        return oContext.getProperty('name');
      },

      _getRatings() {
        return new Promise((res, rej) => {
          this.getOwnerComponent().getModel().read("/Ratings", {
            success: res,
            error: rej
          })
        });
      },

      _getStrains() {
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

      _setRatedFlags(aRatings, aStrains) {

        let aFlaggedRatings = aStrains.map(strain => {
          strain.isRated = false;
          aRatings.forEach(rating => {
            if (rating.strainID === strain.ID) {
              strain.isRated = true;
            }
          });

          return strain;

        });

        return aFlaggedRatings;

      }

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
