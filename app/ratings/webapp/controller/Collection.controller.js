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
        this.getView().setModel(new JSONModel($.extend(true, {}, models.multiplePhotos)), 'multiplePhotoModel');
        this.getView().setModel(new JSONModel($.extend(true, {}, models.initialSpecimen)), 'specimenCreationModel');
        this.getView().setModel(new JSONModel($.extend(true, {}, models.initialCollection)), 'collectionModel');
        this.getView().setModel(new JSONModel($.extend(true, {}, { filters: [] })), 'filtersModel');
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

      toRatings: function () {
        this.getRouter().navTo('main')
      },

      _onObjectMatched(oEvent) {
        this._setUserResults();
      },

      onChangeSpecimenNumber(oEvent) {
        var _oInput = oEvent.getSource();
        var qty = _oInput.getValue();
        var val = this.getView().getModel('specimenCreationModel').getProperty('/tagID');
        val = val.replace(/[^\d]/g, '');
        var result = parseInt(val) + qty - 1;

        var padded = result.toString().padStart(7, '0');
        this.byId('label-tag').setText('Last Tag ID : #' + padded);

      },

      onTagIDInputChange(oEvent) {
        var _oInput = oEvent.getSource();
        var val = _oInput.getValue();
        val = val.replace(/[^\d]/g, '');

        var qty = this.getView().getModel('specimenCreationModel').getProperty('/value');
        // {specimenCreationModel>/value}

        var result = parseInt(val) + qty - 1;

        var padded = result.toString().padStart(7, '0');
        this.byId('label-tag').setText('Last Tag ID : #' + padded);
      },

      onLinkPress(oEvent) {
        this.getView().setBusy(true);
        // var oList = oEvent.getSource().getParent().getParent().getParent().getParent();
        // oList.removeSelections();
        var oItem = oEvent.getSource().getParent().getParent().getParent().getBindingContext().getObject();
        

        this.getRouter().navTo("specimen", {
          objectId: oItem.ID
        });

      },

      onSearchTag(oEvent) {
        // debugger;
        var oList = this.getView().byId('list');
        var oBinding = oList.getBinding('items');

        var aFilters = this.getView().getModel('filtersModel').getProperty('/filters').filter(function(filter) {
          return filter.sPath !== 'tagID';  
       });

       aFilters.push(new Filter("tagID", FilterOperator.Contains, oEvent.getSource().getValue()));

       this.getView().getModel('filtersModel').setProperty('/filters',aFilters)
       oBinding.filter(aFilters);
       
      },

      handleSelectionChange(oEvent) {

        var oList = this.getView().byId('list')
        var oBinding = oList.getBinding('items');
        var aSelectedStates = oEvent.getSource().getSelectedKeys();

        var aFilters = this.getView().getModel('filtersModel').getProperty('/filters').filter(function(filter) {
          return filter.sPath !== 'state_ID';  
       });

        aSelectedStates.forEach(element => {
          aFilters.push(new Filter("state_ID", FilterOperator.EQ, element))
        });

        this.getView().getModel('filtersModel').setProperty('/filters',aFilters)
        oBinding.filter(aFilters);

      },

      onRadioBuSelect(oEvent){
        var oList = this.getView().byId('list');
        var oBinding = oList.getBinding('items');
        var filterValue =  oEvent.getSource().getSelectedButton().getId().slice(-3) === 'all' ? null : true 

        var aFilters = this.getView().getModel('filtersModel').getProperty('/filters').filter(function(filter) {
          return filter.sPath !== 'favorite';  
        });

        if (filterValue === true) {
          aFilters.push(new Filter("favorite", FilterOperator.EQ, filterValue));
        }

        this.getView().getModel('filtersModel').setProperty('/filters',aFilters)
        oBinding.filter(aFilters);
      },

      onChangeTag() {
        var selected = this.getView().byId('list').getSelectedItems()[0].getBindingContext().getObject();
        this.getView().getModel('collectionModel').setProperty('/newTagID', '');
        this.getView().getModel('collectionModel').setProperty('/selectedSpecimen', selected);

        if (!this._editDialog) {
          this._editDialog = sap.ui.core.Fragment.load({
            id: this.getView().getId(),
            name: "blackseeds.ratings.view.fragments.EditSpecimen",
            controller: this
          }).then(function name(oFragment) {
            this.getView().addDependent(oFragment);
            return oFragment;
          }.bind(this));
        }
        this._editDialog.then(function (oFragment) {
          oFragment.open();
        });

      },

      onChangeTagConfirmPress: function (oEvent) {
        oEvent.getSource().setVisible(false);
        this.getOwnerComponent().getModel("view").setProperty("/busyDialog", true)
        var newTag = this.getView().getModel('collectionModel').getProperty('/newTagID');

        var aData = $.extend(true, {
        }, this.getView().getModel("collectionModel").getProperty("/selectedSpecimen"));

        var that = this;

        // Validations
        if (!aData.tagID || !/^\d{7,}$/.test(aData.tagID)) {
          sap.m.MessageToast.show('TAG ID must be a number with at least 7 digits');
          oEvent.getSource().setVisible(true);
          return;
        }

        aData.tagID = newTag;
        this._updateSpecimenTag(aData)
          .then(data => {
            sap.m.MessageToast.show('Specimens updated')
            oEvent.getSource().setVisible(true);  
            // that.byId('list').removeSelections();     
            // that.byId('list').getBinding("items").refresh(true);    
            that.onChangeTagCancelPress() 
            })
          .catch(error => {
            const parsedResponse = JSON.parse(error.responseText);
            const errorMessage = parsedResponse.error.message.value;
            sap.m.MessageToast.show(errorMessage)
            oEvent.getSource().setVisible(true);
            that.byId('list').getBinding("items").refresh(true);
          });;

      },

      onChangeTagCancelPress: function () {

        this.getView().getModel("collectionModel").setProperty("/", models.initialCollection);
        this.getOwnerComponent().getModel("view").setProperty("/busy", false)
        this.getOwnerComponent().getModel("view").setProperty("/busyDialog", false)

        this._editDialog.then(function (oFragment) {
          oFragment.close();
        });
      },

      onFavChange() {

        var specimens = this.getView().byId('list').getSelectedItems();
        var aPromises = [];
        var statusModel = this.getView().getModel("statusModel").getProperty("/");
        var that = this;

        // return new Promise((resolve, reject) => {
        specimens.forEach(specimen => {

          var oSpecimen = specimen.getBindingContext().getObject();
          oSpecimen.favorite = oSpecimen.favorite === false || oSpecimen.favorite === null ? true : false
          aPromises.push(
            this._updateSpecimenFav(oSpecimen)
          );
          //   })
        })


        // Promise.all(aPromises)
        //   .then(()=>{
        //     debugger;
        //     that.byId('list').getBinding("items").refresh(true);
        //   })
        //   .catch(error => {
        //    debugger;
        //   });

      },


      onMultiplePhotos() {

        var aSelected = this.getView().byId('list').getSelectedItems();
        var newArray = [];

        aSelected.forEach(specimen => {
          var oSpecimen = specimen.getBindingContext().getObject()

          newArray.push({
            photo: false,
            ...oSpecimen
          })

        });

        this.getView().getModel('multiplePhotoModel').setProperty('/photos', newArray);

        if (!this._pPhotosDialog) {
          this._pPhotosDialog = sap.ui.core.Fragment.load({
            id: this.getView().getId(),
            name: "blackseeds.ratings.view.fragments.PhotosDialog",
            controller: this
          }).then(function name(oFragment) {
            this.getView().addDependent(oFragment);
            return oFragment;
          }.bind(this));
        }
        this._pPhotosDialog.then(function (oFragment) {
          oFragment.open();
        });

      },

      onMultiplePhotosCancelPress: function () {

        this._pPhotosDialog.then(function (oFragment) {
          oFragment.close();
        });
      },

      onTakePhoto: async function (oEvent) {
        oEvent.getSource().setVisible(false);
        var that = this;
        // var path = this.getView().getObjectBinding().getPath();

        // const regex = /guid'([0-9a-fA-F-]{36})'/;
        // const specimen = path.match(regex)[1];

        // debugger;

        var oSpecimen = oEvent.getSource().getParent().getBindingContext('multiplePhotoModel').getObject()

        var selectedSpecimens = this.getView().getModel('multiplePhotoModel').getProperty('/photos');

        var folder = oSpecimen.strainAlias + ' ' + oSpecimen.seqNumber + ' ' + oSpecimen.tagID;

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
            var p1 = that._createCare(oSpecimen.ID, 'PH')
            var p2 = that._createPhoto(oSpecimen.ID, result.info.secure_url)

            Promise.all([p1, p2])
              .then(results => {
                sap.m.MessageToast.show('Photo uploaded correctly   #' + oSpecimen.tagID)

                var aSelectedSpecimens = selectedSpecimens.filter(function (specimen) {
                  return specimen.ID !== oSpecimen.ID;
                });

                // debugger;
                that.getView().getModel('multiplePhotoModel').setProperty('/photos', aSelectedSpecimens);

              })

          }

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
                // num += 1;
                // Convert the number back to a string and pad with leading zeros
                var nextSeq = num.toString().padStart(3, '0');

                map[item.ID] = {
                  ID: item.ID,
                  name: item.name,
                  strainAlias: item.strainAlias + ' ' + item.seqNumber + ' -  #' + item.tagID,
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


            const aSpecimens = specimens.results.sort((a, b) => a.tagID - b.tagID);
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

      getName: function (oContext) {

        // return oContext.getProperty('strainName') + ' ( ' +  oContext.getProperty('plantedDate').toLocaleDateString() + ' ' + oContext.getProperty('plantedDate').toLocaleTimeString() + ' ) ';
        return oContext.getProperty('strainName');//+ ' ( ' +  oContext.getProperty('plantedDate').toLocaleDateString() + ' ' + oContext.getProperty('plantedDate').toLocaleTimeString() + ' ) ';
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

      onStatusConfirmPress: function (oEvent) {
        oEvent.getSource().setVisible(false);
        var aItems = this.getView().getModel('collectionModel').getProperty("/selectedSpecimens");
        var that = this;
        this.getOwnerComponent().getModel("view").setProperty("/busyDialog", true)
        this.changeSpecimenStatus(aItems).then((result) => {

          that.byId('company-status').getBinding("items").refresh(true);
          sap.m.MessageToast.show('Specimens updated');
          oEvent.getSource().setVisible(true);
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


            if (statusModel.sexUpdate) {
              aPromises.push(
                this._createCare(specimen.getBindingContext().getObject(), 'SX')
              );
            }

            if (statusModel.stateUpdate) {
              aPromises.push(
                this._createCare(specimen.getBindingContext().getObject(), 'ST')
              );
            }

            // Check the condition outside the switch for the default case
            if (!statusModel.sexUpdate && !statusModel.stateUpdate && statusModel.comments !== '') {
              // Add your logic here for when sexUpdate and stateUpdate are false, and comments is not 'initial'
              aPromises.push(this._createCare(specimen.getBindingContext().getObject(), 'JN'));
            }

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

            this._createCare(specimen, careTypeName).then((care) => {

              aPromises.push(
                this._createWater(specimen, care)
              );

              addedProducts.forEach((product) => {
                aPromises.push(
                  this._createApplication(specimen, product, care)
                );
              })
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

      processSpecimen: async function (specimens) {

        var aPromises = [];

        var addedProducts = this.getView().getModel("careModel").getProperty("/water").onlyWater === true ? [] :
          this.getView().getModel("careModel").getProperty("/application").products.filter((a) => a.selected === true)

        var careTypeName = addedProducts.length > 0 ? 'WP' : 'OW'; // Water product or Only Water


        try {

          for (const specimenModel of specimens) {
            const specimen = specimenModel.getBindingContext().getObject();
            const care = await this._createCare(specimen, careTypeName);

            const aPromises = [
              this._createWater(specimen, care)
            ];

            addedProducts.forEach(product => {
              aPromises.push(this._createApplication(specimen, product, care));
            });

            // Wait for all the promises related to the current specimen
            await Promise.all(aPromises);
          }

          // All specimens processed successfully
          console.log('All specimens processed successfully');
        } catch (error) {
          console.error('ERROR', error);
        }
      },

      onApplicationConfirmPress(oEvent) {
        oEvent.getSource().setVisible(false);
        var aItems = this.getView().getModel('collectionModel').getProperty("/selectedSpecimens");
        this.getOwnerComponent().getModel("view").setProperty("/busyDialog", true)
        var that = this;
        // this.applicateToSpecimens(aItems).then((result) => {
        this.processSpecimen(aItems).then((result) => {
          sap.m.MessageToast.show('Specimens have ate');
          that.byId('list').getBinding("items").refresh(true);
          oEvent.getSource().setVisible(true);
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
              name: "blackseeds.ratings.view.fragments.ApplicationCreateDialog",
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

      onCreateConfirmPress: function (oEvent) {
        oEvent.getSource().setVisible(false);

        // return;
        this.getOwnerComponent().getModel("view").setProperty("/busyDialog", true)

        // debugger;

        var aData = $.extend(true, {
        }, this.getView().getModel("specimenCreationModel").getProperty("/"));

        var that = this;

        if (!aData.plantedDate) {
          sap.m.MessageToast.show('Specify a date');
          oEvent.getSource().setVisible(true);
          return;
        }

        // Validations
        if (!aData.tagID || !/^\d{7,}$/.test(aData.tagID)) {
          sap.m.MessageToast.show('TAG ID must be a number with at least 7 digits');
          oEvent.getSource().setVisible(true);
          return;
        }

        if (aData.status === 'new') {

          if (!aData.strainName) {
            sap.m.MessageToast.show('Specify a name for the Strain');
            oEvent.getSource().setVisible(true);
            return;
          }

          delete aData.parentID;
          delete aData.strainID;

          this._createStrain(aData).then((result) => {

            aData.strainID = result.ID;
            this._saveSpecimens(aData).then((result) => {
              this._setUserResults();
              sap.m.MessageToast.show('Strain and specimens created');
              oEvent.getSource().setVisible(true);
              that.onCreateCancelPress();
            })
          })
        } else {

          // Validations
          if (!aData.strainID) {
            sap.m.MessageToast.show('Select a Strain');
            oEvent.getSource().setVisible(true);
            return;
          }



          this._saveSpecimens(aData).then((result) => {
            if (result) {
              this._setUserResults();
              sap.m.MessageToast.show('Specimens created');
              that.onCreateCancelPress();
            } else {
              that.byId('list').getBinding("items").refresh(true);
            }
            oEvent.getSource().setVisible(true);
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
              text: "{strainAlias} {seqNumber} - #{tagID}"
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

              sap.m.MessageToast.show('Specimens created')
              resolve(results);
            })
            .catch(error => {
              const parsedResponse = JSON.parse(error.responseText);
              const errorMessage = parsedResponse.error.message.value;
              sap.m.MessageToast.show(errorMessage)
              resolve()
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

      _updateSpecimenFav(data) {
        const functionUrl = '/changeFavorite'
        return new Promise((resolve, reject) => {
          this.getView().getModel().callFunction(functionUrl, {
            method: "POST",
            urlParameters: { ID: data.ID },
            sucess: resolve,
            error: reject
          });
        });

      },

      _updateSpecimenTag(data) {
        const functionUrl = '/changeTag'
        return new Promise((resolve, reject) => {
          this.getView().getModel().callFunction(functionUrl, {
            method: "POST",
            urlParameters: { ID: data.ID, tagID: data.tagID },
            success: resolve,
            error: reject
          });
        });

      },

      _createWater(specimen, care) {
        var water = this.getView().getModel("careModel").getProperty("/water");
        var oData = this._formatWatering(specimen, water, care);
        return new Promise((resolve, reject) => {
          this.getView().getModel().create('/Waterings', oData, {
            success: resolve,
            error: reject
          });
        });
      },

      _formatWatering(specimen, water, care) {
        var selected = this.getView().getModel('collectionModel').getProperty('/selectedSpecimens').length;
        return {
          specimen: { ID: specimen.ID },
          // product: {ID: product.ID},
          date: this.getView().getModel("careModel").getProperty("/date"),
          liters: parseFloat((water.liters / selected), 2).toFixed(2),
          // liters: water.liters,
          ec: water.ec,
          temp: water.temp,
          ph: water.ph,
          method: water.method,
          care: { ID: care.ID },
          // ...water,
        }
      },

      _formatSpecimen(data) {

        var dialogSelect = this.byId('select.specimens');
        var selectedItem = dialogSelect.getSelectedItem();
        var seqNumber = 1;

        if (selectedItem) {
          var context = selectedItem.getBindingContext();
          var object = context.getObject();
          seqNumber = object.seqNumber;
        }

        delete data.status
        delete data.multiple
        delete data.value
        delete data.strainAlias
        delete data.strainName
        delete data.strainTagID
        delete data.comments

        data.tagID = data.tagID.padStart(7, '0');



        data.strain = { ID: data.strainID };
        if (!data.parentID) {
          data.seqNumber = 0;
          data.state = { ID: 'e8c8bfd3-95de-498e-b4b1-aa591480db28' } // Alive
          delete data.parentID;
        } else {
          data.seqNumber = seqNumber + 1;
          data.state = { ID: 'cc155edf-ac5b-41da-8c1b-1144f84568b1' } // Clone 
        }
        // debugger ;
        return data;
      },

      _createApplication(specimen, product, care) {
        var oData = this._formatApplication(specimen, product, care);
        return new Promise((resolve, reject) => {
          this.getView().getModel().create('/Applications', oData, {
            success: resolve,
            error: reject
          });
        });
      },

      _formatApplication(specimen, product, care) {
        var selected = this.getView().getModel('collectionModel').getProperty('/selectedSpecimens').length;

        return {
          specimen: { ID: specimen.ID },
          product: { ID: product.ID },
          date: this.getView().getModel("careModel").getProperty("/date"),
          amount: parseFloat((product.amount / selected), 2).toFixed(2),
          method: 'Water',
          care: { ID: care.ID }
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
          date: new Date(),
          publicId: publicId,
          // description: this.getView().getModel("careModel").getProperty("/description")
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
