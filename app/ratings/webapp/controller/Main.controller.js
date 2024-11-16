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
        this.getView().setModel(new JSONModel({ mode: "rate", list: "strains" }), 'appModel');
        this._setUserResults();
        this.getRouter().getRoute("main").attachPatternMatched(this._onObjectMatched, this);
      },

      _setUserResults() {

        //What are we raiting?
        var listMode = this.getView().getModel('appModel').getProperty('/list')
        // debugger;
        // Get the data
        let p1 = this._getRatings();
        let p2 = this._getStrains()
        let p3 = this._getAttributes()
        let p4 = this._getSpecimens()

        Promise.all([p1, p2, p3, p4])
          .then(results => {

            const [aRatings, aStrains, aAttributes, aSpecimens] = results;

            // var ratedEntity = ( listMode === 'strains' ? aStrains.results : aSpecimens.results )

            const aProcessed = listMode === 'strains' ?
              this.prepareSummarizedModelStrains(aRatings.results, aStrains.results, aAttributes.results) :
              this.prepareSummarizedModelSpecimens(aRatings.results, aSpecimens.results, aAttributes.results)

            const aHistory = listMode === 'strains' ?
              this.prepareHistoryStrains(aRatings.results) :
              this.prepareHistorySpecimens(aRatings.results)

            const aTopTier = listMode === 'strains' ?
              this.prepareTopTierStrains(aStrains.results) :
              this.prepareTopTierSpecimens(aSpecimens.results)

            // Calculation of totals 
            var iFull = aProcessed.filter((item) => item.state === 'Success').length;
            var iPogress = aProcessed.filter((item) => item.state === 'Warning').length;
            var iTotal = aProcessed.length - iFull - iPogress;

            this.getOwnerComponent().setModel(new JSONModel({
              list: aProcessed,
              full: iFull,
              progress: iPogress,
              total: iTotal,
              history: aHistory,
              topTier: aTopTier,
              // filters: aFilters 
            }), 'dataModel');

          })

      },


      getModel: function (sModelName) {
        return this.getView().getModel();
      },

      _onObjectMatched(oEvent) {
        this._setUserResults();
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

      onChangeListModel() {
        this._setUserResults();
      },

      toCollection(oEvent) {
        this.getRouter().navTo("collection");
      },

      _showObject(oItem) {
        var path = this.getView().getModel('appModel').getProperty('/list') === 'strains' ? 'ratingStrain' : 'ratingSpecimen';

        this.getRouter().navTo(path, {
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

      _getSpecimens() {
        return new Promise((res, rej) => {
          this.getOwnerComponent().getModel().read("/Specimens", {
            success: res,
            error: rej
          })
        });
      },

      prepareHistoryStrains(aRatings) {

        const aHistory = [];

        aRatings.filter((a) => a.specimenID === null).forEach(rating => {
          if (!aHistory.find(item => item.strainID === rating.strainID)) {
            aHistory.push(rating);
          }
        });

        return aHistory;

      },

      prepareHistorySpecimens(aRatings) {

        const aHistory = [];

        aRatings.filter((a) => a.specimenID !== null).forEach(rating => {
          if (!aHistory.find(item => item.specimenID === rating.specimenID)) {
            aHistory.push(rating);
          }
        });

        return aHistory;

      },

      prepareTopTierSpecimens(Specimens) {

        return Specimens.filter(a => a.totalPoints > 0).map(a => {
          return {
              ...a,       
              name: a.strainName
          }
        })
      },

      prepareTopTierStrains(Strains) {

        return Strains.filter(a => a.totalPoints > 0);

      },

      prepareSummarizedModelStrains(aRatings, aStrains, aAttributes) {

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

          strain.totalPoints = parseInt(strain.totalPoints / iAttributes);
          if (sum === 0) {
            return { ...strain }
          } else {

            return {
              ...strain,
              text: sum === iAttributes ? 'Full rated' : 'In process',
              state: sum === iAttributes ? 'Success' : 'Warning',
              icon: sum === iAttributes ? 'sap-icon://sys-enter-2' : 'sap-icon://warning2',
            };
          }


        });

        return aSummarized;

      },
      prepareSummarizedModelSpecimens(aRatings, aSpecimens, aAttributes) {

        var iAttributes = aAttributes.length;
        iAttributes = iAttributes - 1; // Comments is not a valuable attribute

        let aSummarized = aSpecimens.filter(a => a.stateDescription === 'Harvested').map(specimen => {
          let sum = 0;

          specimen.state = 'None';
          specimen.text = 'Not rated';
          specimen.icon = 'sap-icon://tag';
          specimen.totalPoints = 0;

          aRatings.forEach(rating => {
            if (rating.specimenID === specimen.ID && rating.value > 0) {
              sum += 1;
              specimen.totalPoints = rating.value + specimen.totalPoints;
            }
          });

          specimen.totalPoints = parseInt(specimen.totalPoints / iAttributes);
          if (sum === 0) {
            return {
              ...specimen,
              name: specimen.strainName
            }
          } else {

            return {
              ...specimen,
              name: specimen.strainName,
              text: sum === iAttributes ? 'Full rated' : 'In process',
              state: sum === iAttributes ? 'Success' : 'Warning',
              icon: sum === iAttributes ? 'sap-icon://sys-enter-2' : 'sap-icon://warning2',
            };
          }

        });

        return aSummarized;

      }

    });
  }
);
