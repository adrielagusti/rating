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
        let p3 = this._getAttributes()

        Promise.all([p1, p2, p3])
          .then(results => {

            const [aRatings, aStrains, aAttributes] = results;
            const aStrainsProc = this.prepareSummarizedModel(aRatings.results, aStrains.results, aAttributes.results);
            const aHistory = this._setHistory(aRatings.results);

            var iFull = aStrainsProc.filter((item) => item.state === 'Success').length;
            var iPogress = aStrainsProc.filter((item) => item.state === 'Warning').length;
            var iTotal = aStrainsProc.length - iFull - iPogress;
            
            this.getOwnerComponent().setModel(new JSONModel({ strains: aStrainsProc, full: iFull, progress: iPogress, total: iTotal, history: aHistory }), 'dataModel');

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

      onSelectHist(oEvent) {
        let oItem = oEvent.getSource().getSelectedItem().getBindingContext('dataModel').getObject();
        this.getRouter().navTo("rating", {
          objectId: oItem.strainID
        });
      },

      onSelectNav(oEvent) {
        this.getRouter().navTo("rating", {
          objectId: oEvent.getParameters().selectedItem.getKey()
        });
      },

      toCollection(oEvent){
        this.getRouter().navTo("collection", {
          // objectId: oEvent.getParameters().selectedItem.getKey()
        });
      },

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

      _setHistory(aRatings) {

        const aHistory = [];

        aRatings.forEach(rating => {
          if (!aHistory.find(item => item.strainID === rating.strainID)) {
            aHistory.push(rating);
          }
        });

        return aHistory;

      },

      prepareSummarizedModel(aRatings, aStrains, aAttributes) {

        var iAttributes = aAttributes.length;
        iAttributes = iAttributes - 1; // Comments is not a valuable attribute

        let aSummarized = aStrains.map(strain => {
          let sum = 0;
      
          strain.state = 'None';
          strain.text = 'Not rated';
          strain.icon = 'sap-icon://e-care';
          strain.totalPoints = 0;

          aRatings.forEach(rating => {
            if (rating.strainID === strain.ID && rating.value > 0) {
              sum += 1;
              strain.totalPoints = rating.value + strain.totalPoints;
            }
          });

          strain.totalPoints =  parseInt(strain.totalPoints / iAttributes );
          if (sum === 0) {
            return {...strain}
          } else{
    
            return {
              ...strain,
              text: sum === iAttributes ?  'Full rated' : 'In process',
              state: sum === iAttributes ?  'Success' : 'Warning',
              icon: sum === iAttributes ?  'sap-icon://sys-enter-2' : 'sap-icon://warning2',
            };
          }

         
        });

        return aSummarized;

      }

    });
  }
);
