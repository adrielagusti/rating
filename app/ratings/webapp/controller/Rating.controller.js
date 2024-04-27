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

        this.getRouter().getRoute("rating").attachPatternMatched(this._onObjectMatched, this);
        // this.getRouter().getRoute("ratingChange").attachPatternMatched(this._onObjectMatched, this);

      },

      getRouter() {
        return UIComponent.getRouterFor(this);
      },

      onBroBack: function () {
        history.go(-1);
      },

      _onObjectMatched(oEvent) {
        let sObjectId = oEvent.getParameter("arguments").objectId;
        this._bindView("/Strains(guid'" + sObjectId + "')");
        this._setUserResults(sObjectId);

      },

      _setUserResults(objectId) {
        let p1 = this._getRatings(objectId);
        let p2 = this._getAttributes();

        // Wait for the answer of both entities to match existing ratings of attributes with all existing atts.
        Promise.all([p1, p2])
          .then(results => {

            const [aRatings, aAttributes] = results;

            const result = this.findCorrespondingEntries(aRatings.results, aAttributes.results);

            this.getView().setModel(new JSONModel({ ratings: result }), 'dataModel');

          })
      },

      _bindView(sObjectPath) {
        this.getView().bindElement({
          path: sObjectPath
        });
      },

      _getRatings(strain) {
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

      _getAttributes() {
        return new Promise((res, rej) => {
          this.getView().getModel().read("/Attributes", {
            success: res,
            error: rej
          })
        });
      },


      findCorrespondingEntries(aRatings, aAttributes) {
        let result = [];
        var strain = this.getView().getBindingContext().getObject();

        aAttributes.forEach(atribute => {
          let existingRating = aRatings.find(rating => rating.attributeID === atribute.ID);

          if (existingRating) {
            result.push({
              value: existingRating.value,
              strain: { ID: existingRating.strainID },
              attribute: { ID: atribute.ID },
              ID: existingRating.ID,
              userID: existingRating.userID,
              description: atribute.description,
              strainName: existingRating.strainName
            });
          } else {
            result.push({
              value: 0,
              strain: { ID: strain.ID, },
              attribute: { ID: atribute.ID },
              description: atribute.description,
            });
          }
        });

        return result;

      },


      onBroSave() {

        var oStrain = this.getView().getBindingContext().getObject();
        var aRatingsPayload = this.getView().getModel("dataModel").getProperty("/ratings");
        // this.getView().setBusy(true);
        this.getView().byId("vbox-atts").setBusy(true)
        this._saveRatings(aRatingsPayload)

      },

      _saveRatings(payloads) {

        var aPromises = [];

        payloads.forEach(payload => {
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
            this._onSuccess()
          })
          .catch(error => {
            console.error("ERROR", error);
          });

      },

      _onSuccess(payloads) {

        var oInfoModel = this.getOwnerComponent().getModel('dataModel');
        var oCurrentStrain = this.getView().getBindingContext().getObject();
        var vTested = parseInt(oInfoModel.getProperty("/tested")) + 1;
        var vTotal = oInfoModel.getProperty("/total");
        var aStrains = oInfoModel.getProperty("/strains");

        var aProcStrains = aStrains.map(strain => {
          if (strain.ID === oCurrentStrain.ID) {
            // Change the value of 'z' field to true if the condition is met
            return { ...strain, isRated: true };
          }
          return strain; // If the condition is not met, return the original item unchanged
        });

        this.getOwnerComponent().setModel(new JSONModel({ strains: aProcStrains, tested: vTested, total: vTotal }), 'dataModel');

        this.getView().byId("vbox-atts").setBusy(false)
        this.getRouter().navTo('main');
      }

    });
  }
);
