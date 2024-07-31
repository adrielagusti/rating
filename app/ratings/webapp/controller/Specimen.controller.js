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

    return Controller.extend("blackseeds.ratings.controller.Specimen", {

      onInit() {

        this.getRouter().getRoute("specimen").attachPatternMatched(this._onObjectMatched, this);
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
        this.createSpecimenModel();

      },


      _bindView(sObjectPath) {
        this.getView().bindElement({
          path: sObjectPath
        });
      },

      createSpecimenModel: function () {

        var oModel = new JSONModel({
          ID: '1a8ecb79-b3bc-40ec-82db-61bea5c3ccf1',
          tagID: '0000000001',
          name: 'Snowie Peaks',
          bornDate: (new Date(2024, 5, 10)).toDateString(),
          daysAlive: this.getDifferenceOfDays(new Date(2024, 5, 10), new Date()),
          photos: [{
            date: new Date(2024, 5, 11),
            daysAlive: this.getDifferenceOfDays( new Date(2024, 5, 10), new Date(2024, 5, 11) ),
            url: "https://www.johnlennon.com/wp-content/uploads/2024/05/250xNxJYMG-B-800a.jpg.pagespeed.ic.E9NGOhL7K3.webp"
          }, {
            date: new Date(2024, 5, 28),
            daysAlive: this.getDifferenceOfDays( new Date(2024, 5, 10), new Date(2024, 5, 20) ),
            url: "https://www.johnlennon.com/wp-content/uploads/2024/05/250xNxJYMG-B-800a.jpg.pagespeed.ic.E9NGOhL7K3.webp"
          }, {
            date: new Date(2024, 6, 5),
            daysAlive: this.getDifferenceOfDays( new Date(2024, 5, 10), new Date(2024, 6, 5) ),
            url: "https://www.johnlennon.com/wp-content/uploads/2024/05/250xNxJYMG-B-800a.jpg.pagespeed.ic.E9NGOhL7K3.webp"
          }]
        });
        this.getView().setModel(oModel , 'specimenModel');
      },

      getDifferenceOfDays: function (olderDate, newestDate) {
        const diffTime = Math.abs(newestDate - olderDate);
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)); 
        return(diffDays);
      }

    });
  }
);
