/* eslint-disable no-undef */
sap.ui.define(
  [
    "sap/ui/core/UIComponent",
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel"
  ],

  function (UIComponent, Controller, JSONModel) {
    "use strict";

    return Controller.extend("blackseeds.ratings.controller.Rating", {

      onInit() {
        // let p1 = this._getStrains();
        // let p2 = this._getAttributes();

        // Promise.all([p1, p2])
        //   .then(results => {

        //     const [strainsArray, attributesArray] = results;

        //     this.getView().setModel(new JSONModel({ strains: strainsArray, attributes: attributesArray }), 'dataModel');

        //   })

        this.getRouter().getRoute("rating").attachPatternMatched(this._onObjectMatched, this);

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
      },

      _bindView(sObjectPath) {
        this.getView().bindElement({
          path: sObjectPath
        });
      },

      onBroSave() {
        var oItems = this.getView().byId('vbox-atts');
        oItems.getItems().forEach(item => {
          debugger;
        })
      }
    });
  }
);
