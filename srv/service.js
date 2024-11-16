module.exports = function () {
    this.before('CREATE', 'Specimens', async (req) => {
        await SELECT.one.from("blackseeds.Specimens").where`tagID = ${req.data.tagID}`.then((data) => {
            if (data) {
                throw req.reject(400, 'Tag ID already exists')
            }
        })
    }),

        // this.before('UPDATE', 'Specimens', async (req) => {
        //     await SELECT.one.from("blackseeds.Specimens").where`tagID = ${req.data.tagID}`.then((data) => {

        //         if (req.data.favorite === data.favorite) {
        //             if (data) {
        //                 throw req.reject(400, 'Tag ID already exists')
        //             }
        //         }

        //     })
        // }),

        this.on('changeTag', async req => {
            await SELECT.one.from("blackseeds.Specimens").where`tagID = ${req.data.tagID}`.then( async (data) => {
                if (data) {
                    throw req.reject(400, 'Tag ID already exists')
                } else {
                   await UPDATE("blackseeds.Specimens", req.data.ID).with({ tagID: req.data.tagID }).where`ID = ${req.data.ID}`.then(() => {
                        return data;
                    })
                }

            })
        })

    this.on('changeFavorite', async req => {
        await SELECT.one.from("blackseeds.Specimens").where`ID = ${req.data.ID}`.then((data) => {
            UPDATE("blackseeds.Specimens", req.data.ID).with({ favorite: data.favorite === true ? false : true }).where`ID = ${req.data.ID}`.then(() => {
                return data;
            }
            )
        })
    })

    this.after('READ', 'Specimens', async (req) => {
        await SELECT.from("blackseeds.Photos").where`specimen_ID = ${req.ID}`.then((data) => {
            // console.log(data.length)
            req.photosNumber = data.length
        })
    })
}
