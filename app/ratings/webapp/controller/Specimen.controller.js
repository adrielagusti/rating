/* eslint-disable no-undef */
sap.ui.define(
  [
    "sap/ui/core/UIComponent",
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "../model/models",
    'sap/ui/unified/CalendarLegendItem',
    'sap/ui/unified/DateTypeRange',
  ],

  function (UIComponent, Controller, JSONModel, Filter, FilterOperator, models, CalendarLegendItem, DateTypeRange) {
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
        this._bindView("/Specimens(guid'" + sObjectId + "')");

        var oCalendar = this.byId('legend');
        oCalendar.setStandardItems(['Today']);
        // this.onAddCare();
        this._setSpecimenResults()
      },


      _bindView(sObjectPath) {
        this.getView().bindElement({
          path: sObjectPath
        });
      },

      createCalendar: function () {

        var oCal = this.byId("calendar"),
          oLeg = this.byId("legend"),
          // oRefDate = UI5Date.getInstance(),
          sType;

        for (var i = 1; i <= 10; i++) {
          if (i < 10) {
            sType = "Type0" + i;
          } else {
            sType = "Type" + i;
          }

          oLeg.addItem(new CalendarLegendItem({
            type: sType,
            text: "Placeholder " + i
          }));

          // oRefDate.setDate(i);
          // oCal.addSpecialDate(new DateTypeRange({
          // 	// startDate: UI5Date.getInstance(oRefDate),
          // 	type: sType,
          // 	tooltip: "Placeholder " + i
          // }));

          // oRefDate.setDate(i + 12);
          // oCal.addSpecialDate(new DateTypeRange({
          // 	// startDate: UI5Date.getInstance(oRefDate),
          // 	type: sType,
          // 	tooltip: "Placeholder " + i
          // }));
        }
      },
      // onAddCare() {
      //   // 
      //   // this.getView().getModel("specimenCreationModel").setProperty("/", models.initialSpecimen);
      //   if (!this._pCreateDialog) {
      //     this._pCreateDialog = sap.ui.core.Fragment.load({
      //       id: this.getView().getId(),
      //       name: "blackseeds.ratings.view.fragments.StatusDialog",
      //       controller: this
      //     }).then(function name(oFragment) {
      //       this.getView().addDependent(oFragment);

      //       // oFragment.addStyleClass(this.getOwnerComponent().getContentDensityClass());
      //       return oFragment;
      //     }.bind(this));
      //   }
      //   this._pCreateDialog.then(function (oFragment) {
      //     oFragment.open();
      //   });
      // },

      _setSpecimenResults() {
        let p0 = this._getSpecimen();
        let p1 = this._getCareTypes();
        let p2 = this._getCares();
        // let p2 = this._getApplications();
        // let p3 = this._getNotes();
        // let p1 = this._getWatering();

        var oLeg = this.byId("legend");
        var oCal = this.byId("calendar");
        var index = 0;
        oCal.removeAllSpecialDates();
        oLeg.removeAllItems()

        var calDayType;

   

        Promise.all([p0, p1, p2])
          .then(results => {

            const [specimen, careTypes, cares] = results;

            // oRefDate = UI5Date.getInstance(),
            var sType;

            oLeg.addItem(new CalendarLegendItem({
              type: sap.ui.unified.CalendarDayType.Type08,
              text: 'Planted on'
            }));
            
            oCal.addSpecialDate(new DateTypeRange({
              startDate: specimen.plantedDate,
              type: sap.ui.unified.CalendarDayType.Type08
            }));

            careTypes.results.forEach((careType, index) => {

              var aCares = cares.results.filter((care) => care.careName === careType.name)

              if (aCares.length > 0) {
                sType = "Type0" + index;
                calDayType = sap.ui.unified.CalendarDayType[sType]
                oLeg.addItem(new CalendarLegendItem({
                  type: calDayType,
                  text: careType.description
                }));

              } else {
                calDayType = sap.ui.unified.CalendarDayType.Type09
              }

        
              aCares.forEach((care, i) => {
                oCal.addSpecialDate(new DateTypeRange({
                  startDate: care.date,
                  type: calDayType,
                  tooltip: careType.description
                }));

              })

            })

        

          }
          )

      },

      _getCareTypes() {
        return new Promise((res, rej) => {
          this.getView().getModel().read("/CareTypes", {
            success: res,
            error: rej
          })
        });
      },

      _getCares() {

        var sPath = this.getView().getObjectBinding().sPath + '/cares'
        return new Promise((res, rej) => {
          this.getView().getModel().read(sPath, {
            success: res,
            error: rej
          })
        });

      },

      _getSpecimen() {

        var sPath = this.getView().getObjectBinding().sPath
        return new Promise((res, rej) => {
          this.getView().getModel().read(sPath, {
            success: res,
            error: rej
          })
        });

      }

    });
  }
);
