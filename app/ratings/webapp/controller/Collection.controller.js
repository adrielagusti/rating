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

    return Controller.extend("blackseeds.ratings.controller.Collection", {

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
            aAttributes.results.sort((a, b) => a.step - b.step);
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

    onSelectSpecimen(oEvent) {
      let oItem = oEvent.getSource().getSelectedItem().getBindingContext('dataModel').getObject();
      this.getRouter().navTo("specimen", {
        objectId: oItem.ID
      });
    },

      onAddSpecimen(oEvent) {
        this.getRouter().navTo("specimen", {
          objectId: '12312313'
        });
      },

    });
  }
);
