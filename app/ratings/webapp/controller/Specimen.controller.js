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
    "../model/formatter",
    'sap/m/GroupHeaderListItem',
    // "../controls/Cloudinary"
  ],

  function (UIComponent,
    Controller,
    JSONModel,
    Filter,
    FilterOperator,
    models,
    CalendarLegendItem,
    DateTypeRange,
    formatter,
    GroupHeaderListItem
    // Cloudinary
  ) {
    "use strict";

    return Controller.extend("blackseeds.ratings.controller.Specimen", {

      formatter: formatter,

      onInit() {

        this.getRouter().getRoute("specimen").attachPatternMatched(this._onObjectMatched, this);
        this.getView().setModel(new JSONModel($.extend(true, {}, {
          careTypes: [],
          water: models.initialWater,
          application: [],
          photoDate: new Date()
        })), 'dayDetailModel');

        this.getView().setModel(new JSONModel($.extend(true, {}, {
          careTypes: []
        })), 'careModel');

        this.getView().setModel(new JSONModel($.extend(true, {}, {
          parent: {},
          childs: []
        })), 'specimenModel');

      },

      getRouter() {
        return UIComponent.getRouterFor(this);
      },

      onBroBack: function () {
        this.getRouter().navTo("collection", {
        });

      },

      handleAppointmentSelect: function (oEvent) {

        var selectedDate = oEvent.getParameter("appointment").getProperty('startDate');

        let p1 = this._getDayApplications(selectedDate);
        let p2 = this._getDayWaterings(selectedDate);

        Promise.all([p1, p2])
          .then(results => {

            const [applications, waterings] = results;

            // this.getView().getModel('dayDetailModel').setProperty('/warerings', waterings.results)
            this.getView().getModel('dayDetailModel').setProperty('/applications', applications.results)

            // debugger;
            if (!this._pCareDetail) {
              this._pCareDetail = sap.ui.core.Fragment.load({
                id: this.getView().getId(),
                name: "blackseeds.ratings.view.fragments.CareDetailDialog",
                controller: this
              }).then(function name(oFragment) {
                this.getView().addDependent(oFragment);
                return oFragment;
              }.bind(this));
            }
            this._pCareDetail.then(function (oFragment) {
              oFragment.open();
            });

          }
          )

      },

      onStatusCancelPress: function () {
        this._pCareDetail.then(function (oFragment) {
          oFragment.close();
        });
      },

      onStatusConfirmPress: function () {
        var aItems = this.getView().getModel('collectionModel').getProperty("/selectedSpecimens");
        this.changeSpecimenStatus(aItems).then((result) => {
          sap.m.MessageToast.show('Specimens updated');
          this.onStatusCancelPress();
        })
      },

      onTakePhoto: async function (oEvent) {
        oEvent.getSource().setVisible(false);
        var that = this;
        // var path = this.getView().getObjectBinding().getPath();

        // const regex = /guid'([0-9a-fA-F-]{36})'/;
        // const specimen = path.match(regex)[1];

        var specimen = this.getView().getBindingContext().getObject()
        // var folder = specimen.strainAlias + specimen.seqNumber + pecimen.tagID;
        var folder = specimen.strainAlias + ' ' + specimen.seqNumber + ' ' + specimen.tagID;

        cloudinary.setCloudName('hgyusg0s0');
        cloudinary.setAPIKey('641639681197656');        
        cloudinary.openUploadWidget({
          uploadPreset: "xondth9e",
          showAdvancedOptions: true,
          sources: ['camera'],
          folder: folder,
        }, (error, result) => {
          oEvent.getSource().setVisible(true);
          if (result.info.secure_url !== undefined) {
            var p1 = that._createCare(specimen.ID, 'PH')
            var p2 = that._createPhoto(specimen.ID, result.info.secure_url)
            
            Promise.all([p1, p2])
              .then(results => {
                oEvent.getSource().setVisible(true);
                that._setSpecimenResults();
              })

          }

        });

      },

      _onObjectMatched(oEvent) {

        let sObjectId = oEvent.getParameter("arguments").objectId;
        this._bindView("/Specimens(guid'" + sObjectId + "')");

        // var oCalendar = this.byId('legend');
        // oCalendar.setStandardItems(['Today']);
        // this.onAddCare();
        this._setSpecimenResults()
      },


      _bindView(sObjectPath) {
        this.getView().bindElement({
          path: sObjectPath
        });
      },


      handleAppointmentSelect(oEvent) {
        var oAppointment = oEvent.getParameter("appointment");
        
        if (!this._pProductDialog) {
          this._pProductDialog = sap.ui.core.Fragment.load({
            id: this.getView().getId(),
            name: "blackseeds.ratings.view.fragments.ApplicationEditDialog",
            controller: this
          }).then(function name(oFragment) {
            this.getView().addDependent(oFragment);
            return oFragment;
          }.bind(this));
        }
        this._pProductDialog.then(function (oFragment) {
          oFragment.open();
        });

        // })
      },

      onLinkPress(oEvent) {

        // var oItem = oEvent.getSource().getText();
        // var result = oItem.substring(1);

        this.getRouter().navTo("specimen", {
          objectId: this.getView().getBindingContext().getObject().parentID
        });

      },


      onChildPress(oEvent) {

        var oItem = oEvent.getSource().getText();
        var result = oItem.substring(1);

        var aChilds = this.getView().getModel('specimenModel').getProperty('/childs').find((a) => a.tagID === result);

        this.getRouter().navTo("specimen", {
          objectId: aChilds.ID
        });

      },



      _setFamily(specimen) {
        this.byId('childs').setVisible(false)
        if (specimen.parentID) {
          this._getSpecimen(specimen.parentID).then((parent) => {
            this.getView().getModel('specimenModel').setProperty("/parent", parent);
          })
        }

        this._getChilds(specimen.ID).then((childs) => {
          if (childs.results.length > 0) {
            this.byId('childs').setVisible(true)
            this.getView().getModel('specimenModel').setProperty("/childs", childs.results);
          }
        })

      },

      getGroupHeader: function (oGroup){
        debugger;
        return new GroupHeaderListItem({
          title: oGroup.key
        });
      },

      _setCalendar(specimen, careTypes, cares, lifeCycles) {

        var aLifeCycles = lifeCycles.results.sort((a, b) => a.sequence - b.sequence);
        var sType;
        // var oLeg = this.byId("legend");
        // var oCal = this.byId("calendar");
        var oPla = this.byId("planing");

        oPla.setStartDate(specimen.plantedDate)
        // var index = 0;
        // oCal.removeAllSpecialDates();
        // oLeg.removeAllItems();
        // debugger; 
        oPla.removeAllAppointments();

        var calDayType;
        // oLeg.addItem(new CalendarLegendItem({
        //   type: sap.ui.unified.CalendarDayType.Type08,
        //   text: 'Planted on'
        // }));

        // oCal.addSpecialDate(new DateTypeRange({
        //   startDate: specimen.plantedDate,
        //   type: sap.ui.unified.CalendarDayType.Type08
        // }));
        careTypes.results.forEach((careType, index) => {

          var aCares = cares.results.filter((care) => care.careName === careType.name)
          aCares.forEach((care) => {

            oPla.addAppointment(new sap.ui.unified.CalendarAppointment({
              type: sap.ui.unified.CalendarDayType[care.dayType],
              startDate: care.date,
              endDate: care.date,
              icon: care.icon
            }));
          })


        })

        var startDate = null;
        var endDate = null;

        aLifeCycles.forEach((cycle, i) => {

          if (endDate === null) {
            startDate = new Date(specimen.plantedDate);
            endDate = new Date(specimen.plantedDate);
          }
          else {
            startDate = new Date(endDate);
            startDate.setDate(startDate.getDate() + 1);
            endDate = new Date(endDate);
          }

          endDate.setDate(endDate.getDate() + cycle.days);

          // startDate.setHours("1","0","0", "0")
          // endDate.setHours("1","0","0", "0")

          // debugger;
          sType = "Type08";
          calDayType = sap.ui.unified.CalendarDayType[sType]

          oPla.addAppointment(new sap.ui.unified.CalendarAppointment({
            // key: 'AA' + i,
            type: sap.ui.unified.CalendarDayType[cycle.calDayType],
            text: cycle.description,
            title: cycle.description,
            description: cycle.description,
            startDate: startDate,
            endDate: endDate
          }));

        })

      },

      // _setPhotos(photos){



      // },

      _setSpecimenResults() {
        let p0 = this._getSpecimen('');
        let p1 = this._getCareTypes();
        let p2 = this._getCares();

        let p4 = this._getLifeCycles();
        // let p5 = this._getPhotos();
        // let p2 = this._getApplications();
        // let p3 = this._getNotes();
        // let p1 = this._getWatering();

        Promise.all([p0, p1, p2, p4])
          .then(results => {

            const [specimen, careTypes, cares, lifeCycles] = results;

            this.getView().getModel('careModel').setProperty('/careTypes', careTypes.results)

            this._setCalendar(specimen, careTypes, cares, lifeCycles);

            this._setFamily(specimen);
            // this._setPhotos(photos.results);

          })
      },

      _getCareTypes() {
        return new Promise((res, rej) => {
          this.getView().getModel().read("/CareTypes", {
            success: res,
            error: rej
          })
        });
      },


      _getLifeCycles() {
        return new Promise((res, rej) => {
          this.getView().getModel().read("/LifeCycles", {
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

      // _getPhotos() {

      //   var sPath = this.getView().getObjectBinding().sPath + '/photos'
      //   return new Promise((res, rej) => {
      //     this.getView().getModel().read(sPath, {
      //       success: res,
      //       error: rej
      //     })
      //   });

      // },

      _getSpecimen(path) {
        var sPath;

        if (path) {
          sPath = "/Specimens(guid'" + path + "')";
        } else {
          sPath = this.getView().getObjectBinding().sPath
        }
        return new Promise((res, rej) => {
          this.getView().getModel().read(sPath, {
            success: res,
            error: rej
          })
        });

      },

      _getChilds(specimenID) {
        var aFilter = [new Filter("parentID", FilterOperator.EQ, specimenID)];
        return new Promise((res, rej) => {
          this.getView().getModel().read('/Specimens', {
            filters: aFilter,
            success: res,
            error: rej
          })
        });

      },

      _getDayApplications(date) {

        let midnightDate = new Date(date);
        midnightDate.setHours(0, 0, 0, 0);
        let endOfDayDate = new Date(date);
        endOfDayDate.setHours(23, 59, 59, 999);

        var aFilter = [new Filter("date", FilterOperator.BT, midnightDate, endOfDayDate)];
        aFilter.push(new Filter("specimen_ID", FilterOperator.EQ, this.getView().getBindingContext().getObject().ID));

        return new Promise((res, rej) => {
          this.getView().getModel().read('/Applications', {
            filters: aFilter,
            success: res,
            error: rej
          })
        });
      },

      _getDayWaterings(date) {
        // debugger;
        // return new Promise((res, rej) => {
        //   this.getView().getModel().read(sPath, {
        //     success: res,
        //     error: rej
        //   })
        // });
      },
      _createCare(specimen, careType) {
        var oData = this._formatCare(specimen, careType);
        return new Promise((resolve, reject) => {
          this.getView().getModel().create('/Cares', oData, {
            success: resolve,
            error: reject
          });
        });
      },
      _formatCare(specimen, careType) {

        return {
          specimen: { ID: specimen },
          date: this.getView().getModel('dayDetailModel').getProperty('/photoDate'),
          careType: { ID: this.getView().getModel("careModel").getProperty("/careTypes").find((a) => a.name === 'PH').ID },
          // description: this.getView().getModel("careModel").getProperty("/description")
        }
      },

      _createPhoto(specimen, publicId) {
        var oData = this._formatPhoto(specimen, publicId);
        return new Promise((resolve, reject) => {
          this.getView().getModel().create('/Photos', oData, {
            success: resolve,
            error: reject
          });
        });
      },

      _formatPhoto(specimen, publicId) {

        return {
          specimen: { ID: specimen },
          date: this.getView().getModel('dayDetailModel').getProperty('/photoDate'),
          publicId: publicId,
          // description: this.getView().getModel("careModel").getProperty("/description")
        }
      },

    });
  }
);
