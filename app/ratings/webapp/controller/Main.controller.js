/* eslint-disable no-undef */
sap.ui.define(
  [
    "sap/ui/core/UIComponent",
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel"
  ],

  function (UIComponent, Controller, JSONModel) {
    "use strict";

    return Controller.extend("blackseeds.ratings.controller.Main", {

      onInit() {
        // let p1 = this._getStrains();
        // let p2 = this._getAttributes();

        // Promise.all([p1, p2])
        //   .then(results => {

        //     const [strainsArray, attributesArray] = results;

        //     this.getView().setModel(new JSONModel({ strains: strainsArray, attributes: attributesArray }), 'dataModel');

        //   })

      },

      getModel: function (sModelName) {

      },

      onBroSave() {

        //     this.getModel().callFunction("/stopSession", {
        //       method: "POST",
        //       success: () => {
        //           this.getModel().invalidateEntry("Sessions('CURRENT_SESSION')");

        //           this.getView().unbindElement()
        //           this.getView().setBindingContext(null);

        //           this._rebindSession();

        //           MessageToast.show("Session Stopped.")
        //           this.getView().setBusy(false)
        //       },
        //       error: (oResponse) => {
        //           this._showError(oResponse);
        //           this.getView().setBusy(false)
        //       }
        //   });


        //   this.getModel().callFunction("/startSession", {
        //     method: "POST",
        //     urlParameters: this.getModel("view").getProperty("/startSessionParams"),
        //     success: () => {
        //         this._rebindSession();
        //         MessageToast.show("Session Started!")
        //         oStartSessionDialog.setBusy(false);
        //         oStartSessionDialog.close();
        //     },
        //     error: (oResponse) => {
        //         this._showError(oResponse);
        //         oStartSessionDialog.setBusy(false)
        //     }
        // });

      },
      onSelectRow(oEvent) {
        // The source is the list item that got pressed
        let oItem = oEvent.getParameter("listItem");

        this._showObject(oItem);
      },

      _showObject(oItem) {
        this.getRouter().navTo("rating", {
          objectId: oItem.getBindingContext().getObject().GUID
        });
      },

      getRouter() {
        return UIComponent.getRouterFor(this);
      }

    });
  }
);
