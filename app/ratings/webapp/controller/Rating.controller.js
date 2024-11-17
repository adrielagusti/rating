/* eslint-disable no-undef */
sap.ui.define(
  [
    "sap/ui/core/UIComponent",
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
  ],

  function (UIComponent, Controller, JSONModel, Filter, FilterOperator) {
    "use strict";

    return Controller.extend("blackseeds.ratings.controller.Rating", {

      onInit() {

        this._getRouter().getRoute("ratingStrain").attachPatternMatched(this._onObjectMatchedStrain, this);
        this._getRouter().getRoute("ratingSpecimen").attachPatternMatched(this._onObjectMatchedSpecimen, this);
        // this.getRouter().getRoute("ratingChange").attachPatternMatched(this._onObjectMatched, this);

      },

      _getRouter() {
        return UIComponent.getRouterFor(this);
      },

      onBroBack: function () {
        history.go(-1);
      },

      _onObjectMatchedSpecimen(oEvent) {
        let sObjectId = oEvent.getParameter("arguments").objectId;
        this._bindView("/Specimens(guid'" + sObjectId + "')");
        this._setUserResultsSpecimen(sObjectId);
      },

      _onObjectMatchedStrain(oEvent) {
        let sObjectId = oEvent.getParameter("arguments").objectId;
        this._bindView("/Strains(guid'" + sObjectId + "')");
        this._setUserResultsStrain(sObjectId);
      },


      _setUserResultsStrain(objectId) {
        let p1 = this._getRatingsStrain(objectId);
        let p2 = this._getAttributes();

        // Wait for the answer of both entities to match existing ratings of attributes with all existing atts.
        Promise.all([p1, p2])
          .then(results => {

            const [aRatings, aAttributes] = results;
            aAttributes.results.sort((a, b) => a.step - b.step);
            const result = this.findCorrespondingEntriesStrain(aRatings.results, aAttributes.results);

            this.getView().setModel(new JSONModel({ ratings: result }), 'dataModel');

          })
      },
      _setUserResultsSpecimen(objectId) {
        let p1 = this._getRatingsSpecimen(objectId);
        let p2 = this._getAttributes();

        // Wait for the answer of both entities to match existing ratings of attributes with all existing atts.
        Promise.all([p1, p2])
          .then(results => {

            const [aRatings, aAttributes] = results;
            aAttributes.results.sort((a, b) => a.step - b.step);
            const result = this.findCorrespondingEntriesSpecimen(aRatings.results, aAttributes.results);

            this.getView().setModel(new JSONModel({ ratings: result }), 'dataModel');

          })
      },
      
      _bindView(sObjectPath) {
        this.getView().bindElement({
          path: sObjectPath
        });
      },

      _getRatingsStrain(strain) {
        var aFilter = [new Filter("strainID", FilterOperator.EQ, strain)];
        // aFilter.push(new Filter("strain_GUID", FilterOperator.EQ, strain));

        return new Promise((res, rej) => {
          this.getView().getModel().read("/Ratings", {
            filters: aFilter,
            success: res,
            error: rej
          })
        });
      },

      _getRatingsSpecimen(specimen) {
        var aFilter = [new Filter("specimenID", FilterOperator.EQ, specimen)];
        // aFilter.push(new Filter("strain_GUID", FilterOperator.EQ, strain));

        return new Promise((res, rej) => {
          this.getView().getModel().read("/Ratings", {
            filters: aFilter,
            success: res,
            error: rej
          })
        });
      },

      _getAttributes() {
        return new Promise((res, rej) => {
          this.getView().getModel().read("/Attributes", {
            success: res,
            error: rej
          })
        });
      },


      findCorrespondingEntriesStrain(aRatings, aAttributes) {
        let result = [];
        var strain = this.getView().getBindingContext().getObject();

        aAttributes.forEach(atribute => {
          let existingRating = aRatings.find(rating => rating.attributeID === atribute.ID && rating.specimenID === null);

          if (existingRating) {
            result.push({
              value: existingRating.value,
              strain: { ID: existingRating.strainID },
              attribute: { ID: atribute.ID },
              ID: existingRating.ID,
              userID: existingRating.userID,
              comments: existingRating.comments,
              description: atribute.description,
              type: atribute.type,
              step: atribute.step,
              strainName: existingRating.strainName
            });
          } else {
            result.push({
              value: 0,
              strain: { ID: strain.ID, },
              attribute: { ID: atribute.ID },
              description: atribute.description,
              type: atribute.type,
              step: atribute.step,
              comments: ''
            });
          }
        });

        return result;

      },

      findCorrespondingEntriesSpecimen(aRatings, aAttributes) {
        let result = [];
        var specimen = this.getView().getBindingContext().getObject();

        aAttributes.forEach(atribute => {
          let existingRating = aRatings.find(rating => rating.attributeID === atribute.ID);

          if (existingRating) {
            result.push({
              value: existingRating.value,
              strain: { ID: existingRating.strainID },
              attribute: { ID: atribute.ID },
              ID: existingRating.ID,
              userID: existingRating.userID,
              comments: existingRating.comments,
              description: atribute.description,
              type: atribute.type,
              step: atribute.step,
              strainName: existingRating.strainName,
              specimen: { ID: existingRating.specimenID }
            });
          } else {
            result.push({
              value: 0,
              strain: { ID: specimen.strainID, },
              attribute: { ID: atribute.ID },
              description: atribute.description,
              type: atribute.type,
              step: atribute.step,
              comments: '',
              specimen : {ID: specimen.ID}
            });
          }
        });

        return result;

      },


      onBroSave(oEvent) {
        oEvent.getSource().setBusy(true);
        var oStrain = this.getView().getBindingContext().getObject();
        var aRatingsPayload = this.getView().getModel("dataModel").getProperty("/ratings");

        this.getView().byId("vbox-atts").setBusy(true)
        this._saveRatings(aRatingsPayload)
        oEvent.getSource().setBusy(false);

      },

      _saveRatings(payloads) {

        var aPromises = [];

        payloads.forEach(payload => {
          delete payload.description;
          delete payload.type;
          delete payload.step;
          aPromises.push(

            new Promise((resolve, reject) => {
              if (payload.ID !== undefined) {
                var sPath = this.getView().getModel().createKey('/Ratings', { ID: payload.ID })
                this.getView().getModel().update(sPath, payload, {
                  success: resolve,
                  error: reject
                });
              } else {
                this.getView().getModel().create("/Ratings", payload, {
                  success: resolve,
                  error: reject
                });
              }

            }));
        });

        Promise.all(aPromises)
          .then(results => {
            this._onSuccess(results)
          })
          .catch(error => {
            console.error("ERROR", error);
          });

      },

      _onSuccess(payloads) {

        // var oInfoModel = this.getOwnerComponent().getModel('dataModel');
        // var oCurrentStrain = this.getView().getBindingContext().getObject();
        // var vTested = oInfoModel.getProperty("/tested");
        // var iFull = oInfoModel.getProperty("/full");
        // var iTotal = oInfoModel.getProperty("/total");
        // var aStrains = oInfoModel.getProperty("/strains");
        

        // var aZeros = payloads.filter(function (pay) { return pay.value === 0 });
       

        // oCurrentStrain.totalPoints = ( payloads.reduce(function (a, item) { return a + item.value }, 0) / payloads.length);
        
        // if (aZeros.length === 0) {
        //   oCurrentStrain.state = 'Success',
        //     oCurrentStrain.icon = 'sap-icon://sys-enter-2'
        // } else {
        //   oCurrentStrain.state = 'Warning',
        //     oCurrentStrain.icon = 'sap-icon://warning2'
        // }

        // var aStrainsProc = aStrains.map(strain => {
        //   if (strain.ID === oCurrentStrain.ID) {
        //     return { ...oCurrentStrain };
        //   }
        //   return strain; // If the condition is not met, return the original item unchanged
        // });

        // var vCompleted = aStrainsProc.filter(function (strain) { return strain.state === 'Success' }).length;
        // var vProgress = aStrainsProc.filter(function (strain) { return strain.state === 'Warning' }).length;
        // var vLeft = aStrainsProc.filter(function (strain) { return strain.state === 'None' }).length;

        // var aHistory = oInfoModel.getProperty("/history");
        // aHistory.push({
        //   strainName: oCurrentStrain.name,
        //   tagID: oCurrentStrain.tagID,
        //   modifiedAt: new Date()
        // })

        // this.getOwnerComponent().setModel(new JSONModel({ strains: aStrainsProc, full: vCompleted, progress: vProgress, total: vLeft, history: aHistory }), 'dataModel');


        this.getView().byId("vbox-atts").setBusy(false)
        this._getRouter().navTo('main');
      }

    });
  }
);
