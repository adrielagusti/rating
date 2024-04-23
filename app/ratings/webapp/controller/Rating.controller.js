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
        this.getRouter().getRoute("ratingChange").attachPatternMatched(this._onObjectMatched, this);

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

        // this._setUserResults(sObjectId);

      },

      _setUserResults(objectId){
        let p1 = this._getRatings(objectId, this.getOwnerComponent().getModel('loggedUser').getProperty("/GUID"));
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

      _getRatings(strain, user) {
        var aFilter = [new Filter("user_GUID", FilterOperator.EQ, user)];
        aFilter.push(new Filter("strain_GUID", FilterOperator.EQ, strain));

        return new Promise((res, rej) => {
          this.getView().getModel().read("/Ratings", {
            filters: aFilter,
            success: res,
            error: rej
          })
        });
      },

      _getAttributes(strain, user) {
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
        var userGUID = this.getOwnerComponent().getModel('loggedUser').getProperty("/GUID");

        aAttributes.forEach(atribute => {

          let existingRating = aRatings.find(rating => rating.attribute_GUID === atribute.GUID );

          if (existingRating) {
            result.push({
              value: existingRating.value,
              strain_GUID: existingRating.strain_GUID,
              attribute_GUID: atribute.GUID,
              GUID: existingRating.GUID,
              user_GUID: existingRating.user_GUID,
              attributeDescription: atribute.description,
              strainName: existingRating.strainName,
              userName: existingRating.userName
            });
          } else {
            result.push({
              value: 0,
              strain_GUID: strain.GUID,
              attribute_GUID: atribute.GUID,
              user_GUID: userGUID,
              attributeDescription: atribute.description,
              strainName: strain.name
            });
          }
        });

        return result;

      },

      onUserChange(oEvent) {
        var oItem = oEvent.getSource().getSelectedKey();
        this._setUserResults();
      },

      onBroSave() {

        var oStrain = this.getView().getBindingContext().getObject();
        var aRatingsPayload = this.getView().getModel("dataModel").getProperty("/ratings");
        
       debugger;

        this._saveRatings(aRatingsPayload[1]).then( history.go(-1) );

        // var aRatings = aRatingsPayload.map((rating) => {
        //   var oAttribute = attribute.getObject();
        //   var oRating = {
        //     value: oAttribute.value,
        //     strain_GUID: oStrain.GUID,
        //     attribute_GUID: oAttribute.GUID
        //   }
        // })

      },

      _saveRatings(payload){

        return new Promise((res, rej) => {
          this.getView().getModel().create("/Ratings", payload,{
            success: res,
            error: rej
          })
        });


      }
    });
  }
);
