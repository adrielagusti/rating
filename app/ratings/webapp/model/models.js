/* eslint-disable no-undef */
// @ts-nocheck
sap.ui.define([
    "sap/ui/model/json/JSONModel",
    "sap/ui/Device"
],
    /**
     * provide app-view type models (as in the first "V" in MVVC)
     * 
     * @param {typeof sap.ui.model.json.JSONModel} JSONModel
     * @param {typeof sap.ui.Device} Device
     * 
     * @returns {Function} createDeviceModel() for providing runtime info for the device the UI5 app is running on
     */
    function (JSONModel, Device) {
        "use strict";

        return {

            initialSpecimen: {
                name: '',
                strainID: '',
                parentID: '',
                tagID: '',
                comments: '',
                status: 'existing',
                breedType: 'C',
                value: 1,
                multiple: false,
                strainName: '',
                strainAlias: '',
                strainTagID: '',
                plantedDate: new Date()
            },

            initialStatus: {
                sexUpdate: false,
                stateUpdate: false,
                date: new Date(),
                sex: 'F',
                state: 'A'
            },

            initialCollection: {
                mode: "grid",
                createDialogBusy: false,
                selected: 0,
                selectedSpecimens: [],
                newTagID: ''
            },

            initialApplication: {
                products: [{
                    selected: false
                }],
                // date: '',
                amount: '',
                method: 'Manual'
            },


            multiplePhotos: [{}],

            initialWater: {
                date: '',
                liters: 2,
                temp: 14,
                ec: 500,
                ph: 12,

                method: '',
                onlyWater: false
            },

            createDeviceModel: function () {
                var oModel = new JSONModel(Device);
                oModel.setDefaultBindingMode("OneWay");
                return oModel;
            },

            createViewModel: function () {
                var oModel = new JSONModel({
                    details: "MORE",
                    busy: false,
                    busyDialog: false
                });
                return oModel;
            },

            // initialSpecimen: function(){
            //     return new JSONModel({)
            // },

            createRawTree: function () {

                const additionalSpecimensForS1E1S1 = [
                    {
                        ID: 'd3b3c7e4-6c1b-4b7a-8a5e-8d9b8e6d7f2e',
                        parentID: 'b9c2fc56-4465-4b7f-ae39-76c8d925e18f',
                        breedType: 'S',
                        sequenceNumber: 1,
                        nameAlias: 'SP-S1-E1-S1-S1',
                        strainAlias: 'SP',
                        name: 'Snowy Peaks'
                    },
                    {
                        ID: 'e5b7a8d3-4f5c-4b8a-9d8b-7d6a5b8c9d3f',
                        parentID: 'b9c2fc56-4465-4b7f-ae39-76c8d925e18f',
                        breedType: 'C',
                        sequenceNumber: 1,
                        nameAlias: 'SP-S1-E1-S1-E1',
                        strainAlias: 'SP',
                        name: 'Snowy Peaks'
                    },
                    {
                        ID: 'f6d7b8a3-4e6a-4b8c-8d9a-6d5b4a9c8b7d',
                        parentID: 'b9c2fc56-4465-4b7f-ae39-76c8d925e18f',
                        breedType: 'S',
                        sequenceNumber: 2,
                        nameAlias: 'SP-S1-E1-S1-S2',
                        strainAlias: 'SP',
                        name: 'Snowy Peaks'
                    },
                    {
                        ID: 'd8e9b6a4-5a7e-4c9a-9d8b-6c5d4b8e7a6f',
                        parentID: 'b9c2fc56-4465-4b7f-ae39-76c8d925e18f',
                        breedType: 'C',
                        sequenceNumber: 2,
                        nameAlias: 'SP-S1-E1-S1-E2',
                        strainAlias: 'SP',
                        name: 'Snowy Peaks'
                    }
                ];

                const additionalSpecimens = [
                    {
                        ID: 'e4b1f7cb-6e4b-4f50-a4c5-7e5e2c42b4f7',
                        parentID: '1a8ecb79-b3bc-40ec-82db-61bea5c3ccf1',
                        breedType: 'S',
                        sequenceNumber: 5,
                        nameAlias: 'SP-S5',
                        strainAlias: 'SP',
                        name: 'Snowy Peaks'
                    },
                    {
                        ID: 'c69b6c91-5b94-4b3f-9fdf-775c58249d8e',
                        parentID: '11cd66a1-7c57-4cc1-9272-c85c78ffb16a',
                        breedType: 'C',
                        sequenceNumber: 2,
                        nameAlias: 'SP-S1-E2',
                        strainAlias: 'SP',
                        name: 'Snowy Peaks'
                    },
                    {
                        ID: 'fa7a4a29-7a7e-4513-9f1e-807e56d6d5cb',
                        parentID: '1a8ecb79-b3bc-40ec-82db-61bea5c3ccf1',
                        breedType: 'C',
                        sequenceNumber: 2,
                        nameAlias: 'SP-E2',
                        strainAlias: 'SP',
                        name: 'Snowy Peaks'
                    },
                    {
                        ID: 'b9c2fc56-4465-4b7f-ae39-76c8d925e18f',
                        parentID: '047c6ddb-9513-451a-9674-859df2bed49b',
                        breedType: 'S',
                        sequenceNumber: 1,
                        nameAlias: 'SP-S1-E1-S1',
                        strainAlias: 'SP',
                        name: 'Snowy Peaks'
                    },
                    {
                        ID: 'e8c97c0e-95b9-437d-9858-8c5d0ae6dbe7',
                        parentID: '1a8ecb79-b3bc-40ec-82db-61bea5c3ccf1',
                        breedType: 'S',
                        sequenceNumber: 6,
                        nameAlias: 'SP-S6',
                        strainAlias: 'SP',
                        name: 'Snowy Peaks'
                    },
                    {
                        ID: 'd6d37e73-69a8-4b3a-98d7-9f6e7c9ebc72',
                        parentID: '1a8ecb79-b3bc-40ec-82db-61bea5c3ccf1',
                        breedType: 'C',
                        sequenceNumber: 3,
                        nameAlias: 'SP-E3',
                        strainAlias: 'SP',
                        name: 'Snowy Peaks'
                    },
                    {
                        ID: 'f0b2c3a9-6c7a-41b3-9538-c8d0a2b9d5e8',
                        parentID: '11cd66a1-7c57-4cc1-9272-c85c78ffb16a',
                        breedType: 'S',
                        sequenceNumber: 2,
                        nameAlias: 'SP-S1-S2',
                        strainAlias: 'SP',
                        name: 'Snowy Peaks'
                    },
                    {
                        ID: 'b6a2bc74-4c1d-4e4b-96d3-7a6b9c7c8b45',
                        parentID: '871ac6d7-167f-4e9f-80b8-8221f2940acb',
                        breedType: 'C',
                        sequenceNumber: 1,
                        nameAlias: 'SP-S2-E1',
                        strainAlias: 'SP',
                        name: 'Snowy Peaks'
                    },
                    {
                        ID: 'c8b8f1e4-5a7d-4b3a-92d7-8f4c7b2c8d5a',
                        parentID: 'ca5dd799-5a4f-4e3a-9bf1-a43b37c8ebfe',
                        breedType: 'S',
                        sequenceNumber: 1,
                        nameAlias: 'SP-S3-S1',
                        strainAlias: 'SP',
                        name: 'Snowy Peaks'
                    }
                ];

                const pureMichiganSpecimens = [
                    {
                        ID: '2b7fdc20-11bc-4fc3-9d1b-74c5d8a9f77c',
                        parentID: '0a7c9e1f-7bde-4d8f-937b-2b5d4e3e9b1c',
                        breedType: 'C',
                        sequenceNumber: 0,
                        nameAlias: 'PM (5)',
                        strainAlias: 'PM',
                        name: 'Pure Michigan'
                    },
                    {
                        ID: '5d4f7b3b-0f0e-40c7-938d-2b5f7d8e7b1d',
                        parentID: '2b7fdc20-11bc-4fc3-9d1b-74c5d8a9f77c',
                        breedType: 'S',
                        sequenceNumber: 1,
                        nameAlias: 'PM-S1 (2)',
                        strainAlias: 'PM',
                        name: 'Pure Michigan'
                    },
                    {
                        ID: '7a8f7e6a-7c9f-47d8-91e1-0a5f9e1b9d6a',
                        parentID: '5d4f7b3b-0f0e-40c7-938d-2b5f7d8e7b1d',
                        breedType: 'C',
                        sequenceNumber: 1,
                        nameAlias: 'PM-S1-E1',
                        strainAlias: 'PM',
                        name: 'Pure Michigan'
                    },
                    {
                        ID: '8e7f6a9d-1f0c-4d9a-8c6f-1a2f3e9b8e7d',
                        parentID: '5d4f7b3b-0f0e-40c7-938d-2b5f7d8e7b1d',
                        breedType: 'S',
                        sequenceNumber: 2,
                        nameAlias: 'PM-S1-S2',
                        strainAlias: 'PM',
                        name: 'Pure Michigan'
                    },
                    {
                        ID: '9c8d6f1b-7e8a-47c9-91d2-0b5f8e1d7c9e',
                        parentID: '2b7fdc20-11bc-4fc3-9d1b-74c5d8a9f77c',
                        breedType: 'S',
                        sequenceNumber: 2,
                        nameAlias: 'PM-S2',
                        strainAlias: 'PM',
                        name: 'Pure Michigan'
                    },
                    {
                        ID: '0b8e7f6a-1f2c-4d9a-8c7f-1b2f3e9b9e8d',
                        parentID: '2b7fdc20-11bc-4fc3-9d1b-74c5d8a9f77c',
                        breedType: 'S',
                        sequenceNumber: 3,
                        nameAlias: 'PM-S3 (1)',
                        strainAlias: 'PM',
                        name: 'Pure Michigan'
                    },
                    {
                        ID: '1e9f8a7b-2c1d-4e9a-8d8f-2c3f4e9b8f9e',
                        parentID: '0b8e7f6a-1f2c-4d9a-8c7f-1b2f3e9b9e8d',
                        breedType: 'C',
                        sequenceNumber: 1,
                        nameAlias: 'PM-S3-E1',
                        strainAlias: 'PM',
                        name: 'Pure Michigan'
                    },
                    {
                        ID: '3c8d7e9a-8f2e-4e9a-8d9f-3c4f5e8b9d7f',
                        parentID: '2b7fdc20-11bc-4fc3-9d1b-74c5d8a9f77c',
                        breedType: 'C',
                        sequenceNumber: 1,
                        nameAlias: 'PM-E1 (1)',
                        strainAlias: 'PM',
                        name: 'Pure Michigan'
                    },
                    {
                        ID: '4d9e8b7a-9f3e-4e8a-8c8f-4d5f6e9b8d8f',
                        parentID: '3c8d7e9a-8f2e-4e9a-8d9f-3c4f5e8b9d7f',
                        breedType: 'S',
                        sequenceNumber: 1,
                        nameAlias: 'PM-E1-S1',
                        strainAlias: 'PM',
                        name: 'Pure Michigan'
                    }
                ];


                const allSpecimens = [
                    {
                        ID: '1a8ecb79-b3bc-40ec-82db-61bea5c3ccf1',
                        parentID: 'f1ab063d-0836-4eb3-bc8d-77cb21be2ed8',
                        breedType: 'C',
                        sequenceNumber: 0,
                        nameAlias: 'SP',
                        strainAlias: 'SP',
                        name: 'Snowy Peaks'
                    },
                    {
                        ID: '11cd66a1-7c57-4cc1-9272-c85c78ffb16a',
                        parentID: '1a8ecb79-b3bc-40ec-82db-61bea5c3ccf1',
                        breedType: 'S',
                        sequenceNumber: 1,
                        nameAlias: 'SP-S1',
                        strainAlias: 'SP',
                        name: 'Snowy Peaks'
                    },
                    {
                        ID: '047c6ddb-9513-451a-9674-859df2bed49b',
                        parentID: '11cd66a1-7c57-4cc1-9272-c85c78ffb16a',
                        breedType: 'C',
                        sequenceNumber: 1,
                        nameAlias: 'SP-S1-E1',
                        strainAlias: 'SP',
                        name: 'Snowy Peaks'
                    },
                    {
                        ID: '871ac6d7-167f-4e9f-80b8-8221f2940acb',
                        parentID: '1a8ecb79-b3bc-40ec-82db-61bea5c3ccf1',
                        breedType: 'S',
                        sequenceNumber: 2,
                        nameAlias: 'SP-S2',
                        strainAlias: 'SP',
                        name: 'Snowy Peaks'
                    },
                    {
                        ID: 'ca5dd799-5a4f-4e3a-9bf1-a43b37c8ebfe',
                        parentID: '1a8ecb79-b3bc-40ec-82db-61bea5c3ccf1',
                        breedType: 'S',
                        sequenceNumber: 3,
                        nameAlias: 'SP-S3',
                        strainAlias: 'SP',
                        name: 'Snowy Peaks'
                    },
                    {
                        ID: '656e8445-3478-4a30-9457-d3f9b9e39b68',
                        parentID: '1a8ecb79-b3bc-40ec-82db-61bea5c3ccf1',
                        breedType: 'S',
                        sequenceNumber: 4,
                        nameAlias: 'SP-S4',
                        strainAlias: 'SP',
                        name: 'Snowy Peaks'
                    },
                    {
                        ID: 'fd47fce9-95ce-43cf-a8aa-496ed419e460',
                        parentID: '1a8ecb79-b3bc-40ec-82db-61bea5c3ccf1',
                        breedType: 'C',
                        sequenceNumber: 1,
                        nameAlias: 'SP-E1',
                        strainAlias: 'SP',
                        name: 'Snowy Peaks'
                    },
                    ...additionalSpecimens,
                    ...additionalSpecimensForS1E1S1,
                    ...pureMichiganSpecimens
                ];

                return allSpecimens;

            },

            getDifferenceOfDays: function (olderDate, newestDate) {
                const diffTime = Math.abs(newestDate - olderDate);
                const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
                return (diffDays);
            },

            createSpecimenPhotosModel: function () {

                return new JSONModel({
                    ID: '1a8ecb79-b3bc-40ec-82db-61bea5c3ccf1',
                    tagID: '0000000001',
                    name: 'Snowie Peaks',
                    bornDateD: (new Date(2024, 5, 10)).toDateString(),
                    bornDate: (new Date(2024, 5, 10)),
                    deadDate: (new Date(2024, 12, 12)),
                    daysAlive: this.getDifferenceOfDays(new Date(2024, 5, 10), new Date()),
                    weeksAlive: Math.round(this.getDifferenceOfDays(new Date(2024, 5, 10), new Date()) / 7),
                    photos: [{
                        date: new Date(2024, 5, 11),
                        daysAlive: this.getDifferenceOfDays(new Date(2024, 5, 10), new Date(2024, 5, 11)),
                        url: "https://www.johnlennon.com/wp-content/uploads/2024/05/250xNxJYMG-B-800a.jpg.pagespeed.ic.E9NGOhL7K3.webp"
                    }, {
                        date: new Date(2024, 5, 28),
                        daysAlive: this.getDifferenceOfDays(new Date(2024, 5, 10), new Date(2024, 5, 20)),
                        url: "https://www.johnlennon.com/wp-content/uploads/2024/05/250xNxJYMG-B-800a.jpg.pagespeed.ic.E9NGOhL7K3.webp"
                    }, {
                        date: new Date(2024, 6, 5),
                        daysAlive: this.getDifferenceOfDays(new Date(2024, 5, 10), new Date(2024, 6, 5)),
                        url: "https://www.johnlennon.com/wp-content/uploads/2024/05/250xNxJYMG-B-800a.jpg.pagespeed.ic.E9NGOhL7K3.webp"
                    }]
                });
            },


            createTreeModel: function () {
                return [{
                    ID: '1a8ecb79-b3bc-40ec-82db-61bea5c3ccf1',
                    parentID: 'f1ab063d-0836-4eb3-bc8d-77cb21be2ed8',
                    name: 'Snowy Peaks - SP',
                    refs: [{
                        ID: '11cd66a1-7c57-4cc1-9272-c85c78ffb16a',
                        parentID: '1a8ecb79-b3bc-40ec-82db-61bea5c3ccf1',
                        name: 'SP-S1 (Semilla)',
                        refs: [
                            {
                                ID: '11cd66a1-7c57-4cc1-9272-c85c78ffb16a',
                                parentID: '1a8ecb79-b3bc-40ec-82db-61bea5c3ccf1',
                                name: 'SP-S1-E1 (Esqueje)'
                            },
                            {
                                ID: 'ee8a4d77-e53f-4f4b-8baa-c7ab49952e84',
                                parentID: '11cd66a1-7c57-4cc1-9272-c85c78ffb16a',
                                name: 'SP-S1-E2 (Esqueje)',
                            },
                            {
                                ID: 'ee8a4d77-e53f-4f4b-8baa-c7ab49952e84',
                                parentID: '11cd66a1-7c57-4cc1-9272-c85c78ffb16a',
                                name: 'SP-S1-E3 (Esqueje)',
                                refs: [{
                                    ID: '871ac6d7-167f-4e9f-80b8-8221f2940acb',
                                    parentID: '1a8ecb79-b3bc-40ec-82db-61bea5c3ccf1',
                                    name: 'SP-S1-E3-S1 (Semilla)',
                                }, {
                                    ID: 'ca5dd799-5a4f-4e3a-9bf1-a43b37c8ebfe',
                                    parentID: '1a8ecb79-b3bc-40ec-82db-61bea5c3ccf1',
                                    name: 'SP-S1-E3-S2 (Semilla)',
                                }, {
                                    ID: '11cd66a1-7c57-4cc1-9272-c85c78ffb16a',
                                    parentID: '1a8ecb79-b3bc-40ec-82db-61bea5c3ccf1',
                                    name: 'SP-S1-E3-S3 (Semilla)',
                                    refs: [{
                                        ID: 'ee8a4d77-e53f-4f4b-8baa-c7ab49952e84',
                                        parentID: '11cd66a1-7c57-4cc1-9272-c85c78ffb16a',
                                        name: 'SP-S1-E3-S3-E1 (Esqueje)',
                                    }, {
                                        ID: 'ee8a4d77-e53f-4f4b-8baa-c7ab49952e84',
                                        parentID: '11cd66a1-7c57-4cc1-9272-c85c78ffb16a',
                                        name: 'SP-S1-E3-S3-S1 (Semilla)',
                                    }
                                    ]
                                }]
                            }]
                    }, {
                        ID: '871ac6d7-167f-4e9f-80b8-8221f2940acb',
                        parentID: '1a8ecb79-b3bc-40ec-82db-61bea5c3ccf1',
                        name: 'SP-S2 (Semilla)',
                    }, {
                        ID: 'ca5dd799-5a4f-4e3a-9bf1-a43b37c8ebfe',
                        parentID: '1a8ecb79-b3bc-40ec-82db-61bea5c3ccf1',
                        name: 'SP-S3 (Semilla)',
                    }]
                }];
            }
        };
    });