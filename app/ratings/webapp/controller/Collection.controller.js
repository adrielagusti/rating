/* eslint-disable no-undef */
sap.ui.define(
  [
    "sap/ui/core/UIComponent",
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "../model/formatter",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "../model/models"
  ],

  function (UIComponent, Controller, JSONModel, formatter, Filter, FilterOperator, models) {
    "use strict";

    return Controller.extend("blackseeds.ratings.controller.Collection", {

      formatter: formatter,

      onInit() {
        this.getRouter().getRoute("collection").attachPatternMatched(this._onObjectMatched, this);

        this.getView().setModel(new JSONModel($.extend(true, {}, models.initialStatus)), 'statusModel');
        this.getView().setModel(new JSONModel($.extend(true, {}, models.initialSpecimen)), 'specimenCreationModel');
        this.getView().setModel(new JSONModel($.extend(true, {}, models.initialCollection)), 'collectionModel');
        this.getView().setModel(new JSONModel($.extend(true, {}, {
          careTypes: [],
          water: models.initialWater,
          application: models.initialApplication,
          description: '', date: new Date()
        })), 'careModel');
      },

      getRouter() {
        return UIComponent.getRouterFor(this);
      },

      onBroBack: function () {
        history.go(-1);
      },

      _onObjectMatched(oEvent) {
        this._setUserResults();
        // this.onApplication();

        // this._deletePhoto('bcbc4120-a7fc-4dbb-8bf4-7d058ca8e9d4').then((data) => { });
        // this._deletePhoto('cd6af24e-a68b-4a4b-bfe1-ade9750fe81e').then((data) => { });

        // this._getPhoto().then((data) => { debugger;});

      },

      // tagIDLiveChange(oEvent) {
      //   var _oInput = oEvent.getSource();
      //   var val = _oInput.getValue();
      //   val = val.replace(/[^\d]/g, '');
      //   _oInput.setValue(val);
      // },

      onLinkPress(oEvent) {

        var oList = oEvent.getSource().getParent().getParent().getParent();
        oList.removeSelections();
        var oItem = oEvent.getSource().getParent().getParent().getBindingContext().getObject();

        this.getRouter().navTo("specimen", {
          objectId: oItem.ID
        });

      },

      _setUserResults() {
        let p1 = this._getSpecimens();
        let p2 = this._getCares();

        Promise.all([p1, p2])
          .then(results => {

            const [specimens, careTypes] = results;

            function buildTree(items) {

              const map = [];

              // function concatAliasName(parent, child) {
              //   switch (parent.sequenceNumber) {
              //     case 0:
              //       return parent.strainAlias + '.' + child.breedType + child.sequenceNumber;
              //       break;

              //     default:
              //       return parent.nameAlias + '.' + child.breedType + child.sequenceNumber;
              //       break;
              //   }
              // }

              // Inicializa todos los elementos en un mapa
              items.forEach(item => {
                // debugger;

                var num = parseInt(item.seqNumber, 10); 
                // Increment the number by 1
                num += 1;
                // Convert the number back to a string and pad with leading zeros
                var nextSeq = num.toString().padStart(3, '0');

                map[item.ID] = {
                  ID: item.ID,
                  name: item.name,
                  strainAlias: item.strainAlias + nextSeq + ' - ' + item.tagID,
                  stateIcon: item.stateIcon, nodes: []
                };
              });

              // Construye la estructura de árbol
              items.forEach(item => {
                if (map[item.parentID]) {
                  // var oParent = map[item.parentID];
                  var oItem = map[item.ID];
                  // oItem.nameAlias = concatAliasName(oParent, oItem);
                  map[item.parentID].nodes.push(oItem);
                }
              });

              return map;

            }


            function getStrainsOfSpecimens(mothers) {

              const map = [];

              mothers.forEach(strain => {
                if (!map[strain.strainID]) {
                  map[strain.strainID] = { ID: strain.strainID, name: strain.strainName, treeSpecimens: [] };
                }
              });

              return map;
            }


            const aSpecimens = specimens.results;
            const mothers = aSpecimens.filter((mother) => (mother.seqNumber === 0));

            const strains = getStrainsOfSpecimens(mothers);

            const currentStrains = [];
            Object.values(strains).forEach(strain => {
              var strainMothers = mothers.filter((mother) => (mother.strainID === strain.ID));
              strainMothers.forEach(mother => {
                const tree = buildTree(aSpecimens)[mother.ID];
                mother.nameAlias = mother.strainAlias;
                strain.treeSpecimens = strain.treeSpecimens.concat([tree]);
              })
              currentStrains.push(strain);
            })
            // 
            this.getView().setModel(new JSONModel({ currentStrains: currentStrains }), 'dataModel');
            this.getView().getModel('careModel').setProperty('/careTypes', careTypes.results)
          }
          )

      },

      _getProducts() {
        return new Promise((res, rej) => {
          this.getView().getModel().read("/Products", {
            success: res,
            error: rej
          })
        });
      },

      _getSpecimens() {
        return new Promise((res, rej) => {
          this.getView().getModel().read("/Specimens", {
            success: res,
            error: rej
          })
        });
      },

      _getCares() {
        return new Promise((res, rej) => {
          this.getView().getModel().read("/CareTypes", {
            success: res,
            error: rej
          })
        });
      },

      _deleteSpecimen(path) {
        return new Promise((res, rej) => {
          this.getView().getModel().remove(path, {
            success: res,
            error: rej
          })
        });
      },

      onDisplay(oEvent) {
        let oItem = this.getView().getModel('collectionModel').getProperty('/selectedSpecimens')[0].getBindingContext().getObject()

        this.getRouter().navTo("specimen", {
          objectId: oItem.ID
        });
      },

      onSelectAction(mode, oEvent) {
        mode === 'all' ? oEvent.getSource().getParent().getParent().selectAll() : oEvent.getSource().getParent().getParent().removeSelections()
        this.getView().getModel('collectionModel').setProperty('/selectedSpecimens', oEvent.getSource().getParent().getParent().getSelectedItems());
      },

      onSelectionChange(oEvent) {
        this.getView().getModel('collectionModel').setProperty('/selectedSpecimens', oEvent.getSource().getSelectedItems());
      },

      onDeleteSpecimen(oEvent) {
        let sSpecimenPath = oEvent.getParameter("listItem").getBindingContext().getPath();
        this._deleteSpecimen(sSpecimenPath).then((res) => console.log(res))
      },

      // onMenuAction(oEvent) {

      //   var action = oEvent.getParameter('item').getKey();

      //   switch (action) {
      //     case 'product':
      //       this.onApplication();
      //       break;

      //     case 'status':
      //       this.onChangeStatus();
      //       break;
      //     default:
      //       break;
      //   }

      // },

      // Dialog logic

      onChangeStatus() {
        this.getOwnerComponent().getModel("view").setProperty("/busy", true)
        if (!this._pStatusDialog) {
          this._pStatusDialog = sap.ui.core.Fragment.load({
            id: this.getView().getId(),
            name: "blackseeds.ratings.view.fragments.StatusDialog",
            controller: this
          }).then(function name(oFragment) {
            this.getView().addDependent(oFragment);
            return oFragment;
          }.bind(this));
        }
        this._pStatusDialog.then(function (oFragment) {
          oFragment.open();
        });
      },

      onStatusCancelPress: function () {
        this.getOwnerComponent().getModel("view").setProperty("/busy", false)
        this.getOwnerComponent().getModel("view").setProperty("/busyDialog", false)
        
        this._pStatusDialog.then(function (oFragment) {
          oFragment.close();
        });
      },

      onStatusConfirmPress: function () {
        var aItems = this.getView().getModel('collectionModel').getProperty("/selectedSpecimens");
        this.getOwnerComponent().getModel("view").setProperty("/busyDialog", true)
        this.changeSpecimenStatus(aItems).then((result) => {
          sap.m.MessageToast.show('Specimens updated');
          this.onStatusCancelPress();
        })
      },

      changeSpecimenStatus(specimens) {

        var aPromises = [];
        var statusModel = this.getView().getModel("statusModel").getProperty("/");

        return new Promise((resolve, reject) => {
          specimens.forEach(specimen => {
            aPromises.push(
              this._updateSpecimen(specimen.getBindingContext().getObject(), statusModel)
            );
          });
          Promise.all(aPromises)
            .then(results => {
              resolve();
            })
            .catch(error => {
              console.error("ERROR", error);
            });
        })

      },


      ////////////////////////////////
      // watering & products
      /////////////////////////
      pruneSpecimens(specimens) {
        var aPromises = [];

        var addedProducts = this.getView().getModel("careModel").getProperty("/water").onlyWater === true ? [] :
          this.getView().getModel("careModel").getProperty("/application").products.filter((a) => parseFloat(a.amount) > 0)

        var careTypeName = 'PR'; // prunning

        return new Promise((resolve, reject) => {
          // debugger;
          specimens.forEach(specimenModel => {

            var specimen = specimenModel.getBindingContext().getObject()

            aPromises.push(
              this._createCare(specimen, careTypeName)
            );

          });

          Promise.all(aPromises)
            .then(results => {
              resolve();
            })
            .catch(error => {
              console.error("ERROR", error);
            });

        })

      },

      onPrune() {
        var aItems = this.getView().getModel('collectionModel').getProperty("/selectedSpecimens");
        var that = this;
        this.getOwnerComponent().getModel("view").setProperty("/busy", true)
        this.pruneSpecimens(aItems).then((result) => {
      
          sap.m.MessageToast.show('Pruned');
          that.byId('list').getBinding("items").refresh(true);
          this.getOwnerComponent().getModel("view").setProperty("/busy", false)
        });
      },

      ////////////////////////////////
      // watering & products
      /////////////////////////
      applicateToSpecimens(specimens) {
        var aPromises = [];

        var addedProducts = this.getView().getModel("careModel").getProperty("/water").onlyWater === true ? [] :
          this.getView().getModel("careModel").getProperty("/application").products.filter((a) => a.selected === true)

        var careTypeName = addedProducts.length > 0 ? 'WP' : 'OW'; // Water product or Only Water

        // var sDescription = this.getView().getModel("careModel").getProperty("/description");

        return new Promise((resolve, reject) => {
          // debugger;
          specimens.forEach(specimenModel => {

            var specimen = specimenModel.getBindingContext().getObject()

            aPromises.push(
              this._createCare(specimen, careTypeName)
            );
            aPromises.push(
              this._createWater(specimen)
            );

            addedProducts.forEach((product) => {
              aPromises.push(
                this._createApplication(specimen, product)
              );
            })
          });

          Promise.all(aPromises)
            .then(results => {
              resolve();
            })
            .catch(error => {
              console.error("ERROR", error);
            });

        })

      },

      onApplicationConfirmPress() {
        var aItems = this.getView().getModel('collectionModel').getProperty("/selectedSpecimens");
        this.getOwnerComponent().getModel("view").setProperty("/busyDialog", true)
        var that = this;
        this.applicateToSpecimens(aItems).then((result) => {
          sap.m.MessageToast.show('Specimens have ate');
          that.byId('list').getBinding("items").refresh(true);
          that.onApplicationCancelPress();
        });
      },

      // Product Dialog
      onApplication() {

        this.getView().getModel("careModel").setProperty("/application", models.initialApplication);

        this._getProducts().then((data) => {

          this.getView().getModel("careModel").setProperty("/application/products", data.results);

          if (!this._pProductDialog) {
            this._pProductDialog = sap.ui.core.Fragment.load({
              id: this.getView().getId(),
              name: "blackseeds.ratings.view.fragments.ProductWaterDialog",
              controller: this
            }).then(function name(oFragment) {
              this.getView().addDependent(oFragment);
              return oFragment;
            }.bind(this));
          }
          this._pProductDialog.then(function (oFragment) {
            oFragment.open();
          });

        })
      },

      onApplicationCancelPress: function () {

        this.getView().getModel("careModel").setProperty("/application", models.initialApplication);
        this.getOwnerComponent().getModel("view").setProperty("/busy", false)
        this.getOwnerComponent().getModel("view").setProperty("/busyDialog", false)

        this._pProductDialog.then(function (oFragment) {
          oFragment.close();
        });
      },


      // Add specimen
      onAddSpecimen(oEvent) {

        this.getOwnerComponent().getModel("view").setProperty("/busy", true)

        if (!this._pCreateDialog) {
          this._pCreateDialog = sap.ui.core.Fragment.load({
            id: this.getView().getId(),
            name: "blackseeds.ratings.view.fragments.CreateDialog",
            controller: this
          }).then(function name(oFragment) {
            this.getView().addDependent(oFragment);
            return oFragment;
          }.bind(this));
        }
        this._pCreateDialog.then(function (oFragment) {
          oFragment.open();
        });
      },

      onCreateCancelPress: function () {
        this.getView().setModel(new JSONModel($.extend(true, {}, models.initialSpecimen)), 'specimenCreationModel');
        this.getOwnerComponent().getModel("view").setProperty("/busy", false)
        this.getOwnerComponent().getModel("view").setProperty("/busyDialog", true)
        this._pCreateDialog.then(function (oFragment) {
          oFragment.close();
        });
      },

      onCreateConfirmPress: function () {
        
        this.getOwnerComponent().getModel("view").setProperty("/busyDialog", true)

        var aData = $.extend(true, {
        }, this.getView().getModel("specimenCreationModel").getProperty("/"));

        var that = this;

        if (!aData.plantedDate) {
          sap.m.MessageToast.show('Specify a date');
          return;
        }

        // Validations
        if (!aData.tagID || !/^\d{7,}$/.test(aData.tagID)) {
          sap.m.MessageToast.show('TAG ID must be a number with at least 7 digits');
          return;
      }

        if (aData.status === 'new') {

          if (!aData.strainName) {
            sap.m.MessageToast.show('Specify a name for the Strain');
            return;
          }

          delete aData.parentID;
          delete aData.strainID;

          this._createStrain(aData).then((result) => {

            aData.strainID = result.ID;
            this._saveSpecimens(aData).then((result) => {
              this._setUserResults();
              sap.m.MessageToast.show('Strain and specimens created');
              that.onCreateCancelPress();
            })
          })
        } else {

          // Validations
          if (!aData.strainID) {
            sap.m.MessageToast.show('Select a Strain');
            return;
          }



          this._saveSpecimens(aData).then((result) => {
            this._setUserResults();
            sap.m.MessageToast.show('Specimens created');
            that.onCreateCancelPress();
          })
        }


      },

      onSelectStrain: function (oEvent) {
        let strainID = oEvent.getSource().getSelectedKey();
        this._bindSpecimensToSelect(strainID);

      },

      _bindSpecimensToSelect: function (strainID) {
        var oControl = this.byId("select.specimens");

        if (strainID) {
          oControl.bindItems({
            path: "/Specimens",
            filters: new Filter("strainID", FilterOperator.EQ, strainID),
            template: new sap.ui.core.Item({
              key: "{ID}",
              text: "{name} - {tagID}"
            })
          });
        } else {
          oControl.unbindItems();
        }
      },

      createArray(structure) {
        const array = [];
        const { value, ...rest } = structure; // Destructure to separate the value field
        var tagID = parseInt(structure.tagID);

        for (let i = 0; i < value; i++) {
          array.push({ ...rest, tagID: tagID.toString(), name: structure.name + ` (${i + 1})` }); // Push a new object based on the rest of the structure
          tagID++;
        }

        return array;
      },

      _saveSpecimens(data) {

        var aPromises = [];

        return new Promise((resolve, reject) => {
          if (data.multiple === true && data.value > 1) {
            const payloads = this.createArray(data);
            payloads.forEach(payload => {
              aPromises.push(
                this._createSpecimen(payload)
              );
            });

          } else {
            aPromises.push(this._createSpecimen(data));
          }

          Promise.all(aPromises)
            .then(results => {

              // this._onSuccess(results)
              resolve();
            })
            .catch(error => {

              console.error("ERROR", error);
            });
        })

      },

      _updateSpecimen(data, statusModel) {
        var sPath = "/Specimens(guid'" + data.ID + "')"

        switch (true) {
          case statusModel.sexUpdate:
            data.sex = statusModel.sex;
            break;

          case statusModel.stateUpdate:
            data.state = { ID: statusModel.state };
            break;

          default:
            break;
        }

        return new Promise((resolve, reject) => {
          this.getView().getModel().update(sPath, data, {
            success: resolve,
            error: reject
          });
        });
      },



      _createStrain(data) {
        return new Promise((resolve, reject) => {

          this._getStrainsNumber().then((seqNumber) => {

            var num = parseInt(seqNumber, 10);
            // Increment the number by 1
            num += 1;
            // Convert the number back to a string and pad with leading zeros
            var nextSeq = num.toString().padStart(3, '0');

            let oData = { tagID: nextSeq, name: data.strainName, alias: (data.strainName).toUpperCase().substring(0, 2) };

            this.getView().getModel().create("/Strains", oData, {
              success: resolve,
              error: reject
            });
          });
        });
      },

      _createSpecimen(data) {

        var specimen = this._formatSpecimen(data)

        return new Promise((resolve, reject) => {
          this.getView().getModel().create("/Specimens", specimen, {
            success: resolve,
            error: reject
          });
        });
      },

      _createWater(specimen) {
        var water = this.getView().getModel("careModel").getProperty("/water");
        var oData = this._formatWatering(specimen, water);
        return new Promise((resolve, reject) => {
          this.getView().getModel().create('/Waterings', oData, {
            success: resolve,
            error: reject
          });
        });
      },

      _formatWatering(specimen, water) {
        var selected = this.getView().getModel('collectionModel').getProperty('/selectedSpecimens').length;
        return {
          specimen: { ID: specimen.ID },
          // product: {ID: product.ID},
          date: this.getView().getModel("careModel").getProperty("/date"),
          liters: parseFloat((water.liters / selected), 2).toFixed(2),
          method: water.method
          // ...water,
        }
      },

      _formatSpecimen(data) {
        delete data.status
        delete data.multiple
        delete data.value
        delete data.strainAlias
        delete data.strainName
        delete data.strainTagID
        delete data.comments

        data.state = { ID: 'e8c8bfd3-95de-498e-b4b1-aa591480db28' } // Alive

        data.strain = { ID: data.strainID };
        if (!data.parentID) {
          data.seqNumber = 0;
          delete data.parentID;
        } else {
          data.seqNumber = 1;
        }
        // debugger ;
        return data;
      },

      _createApplication(specimen, product) {
        var oData = this._formatApplication(specimen, product);
        return new Promise((resolve, reject) => {
          this.getView().getModel().create('/Applications', oData, {
            success: resolve,
            error: reject
          });
        });
      },

      _formatApplication(specimen, product) {
        var selected = this.getView().getModel('collectionModel').getProperty('/selectedSpecimens').length;

        return {
          specimen: { ID: specimen.ID },
          product: { ID: product.ID },
          date: this.getView().getModel("careModel").getProperty("/date"),
          amount: parseFloat((product.amount / selected), 2).toFixed(2),
          method: 'Water'
        }
      },

      _createCare(specimen, careTypeName) {
        var oData = this._formatCare(specimen, careTypeName);
        return new Promise((resolve, reject) => {
          this.getView().getModel().create('/Cares', oData, {
            success: resolve,
            error: reject
          });
        });
      },
      _formatCare(specimen, careTypeName) {
        return {
          specimen: { ID: specimen.ID },
          date: this.getView().getModel("careModel").getProperty("/date"),
          careType: { ID: this.getView().getModel("careModel").getProperty("/careTypes").find((a) => a.name === careTypeName).ID },
          description: this.getView().getModel("careModel").getProperty("/description")
        }
      },

      handleUploadComplete(oEvent) {
        var sResponse = oEvent.getParameter("response"),
          aRegexResult = /\d{4}/.exec(sResponse),
          iHttpStatusCode = aRegexResult && parseInt(aRegexResult[0]),
          sMessage;
        if (sResponse) {
          sMessage = iHttpStatusCode === 200 ? sResponse + " (Upload Success)" : sResponse + " (Upload Error)";
          // debugger

          sap.m.MessageToast.show(sMessage);
          // debugger
        }
      },

      // handleUploadPress: function () {
      //   var oFileUploader = this.byId("fileUploader");
      //   var that = this;
      //   oFileUploader.checkFileReadable().then(function () {
      //     // that._createPhoto().then((data) => { 
      //     // debugger;
      //     // oFileUploader.setProperty('name','TESTNAME');
      //     // oFileUploader.setName('asd');
      //     oFileUploader.upload();
      //     // debugger  
      //   // });
      //   }, function (error) {
      //     MessageToast.show("The file cannot be read. It may have changed.");
      //   }).then(function () {
      //     oFileUploader.clear();
      //   });
      // },

      _deletePhoto(guid) {
        // var oData = ({name: 'test' , content: 'AAAAAAAAA'});
        var sPath = "/SpecimenPhotos(guid'" + guid + "')"

        return new Promise((resolve, reject) => {
          this.getView().getModel().remove(sPath, {
            success: resolve,
            error: reject
          });
        });
      },

      _getStrainsNumber() {
        return new Promise((resolve, reject) => {
          this.getView().getModel().read("/Strains/$count", {
            success: resolve,
            error: reject
          });
        });

      }
    });
  }
);
