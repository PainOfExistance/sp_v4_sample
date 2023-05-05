var PhotoModel = require('../models/photoModel.js');

/**
 * photoController.js
 *
 * @description :: Server-side logic for managing photos.
 */
module.exports = {

    /**
     * photoController.list()
     */
    list: function (req, res) {
        PhotoModel.find()
            .exec(function (err, photos) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when getting photo.',
                        error: err
                    });
                }
                photos.reverse();
                var data = [];

                //return res.render('photo/list', data);
                return res.json(photos);
            });
    },

    /**
     * photoController.show()
     */
    show: function (req, res) {
        var id = req.params.id;
        PhotoModel.findOne({ _id: id }, function (err, photo) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting photo.',
                    error: err
                });
            }

            if (!photo) {
                return res.status(404).json({
                    message: 'No such photo'
                });
            }

            return res.json(photo);
        });
    },

    /**
     * photoController.create()
     */
    create: function (req, res) {
        var today = Date.now();
        var photo = new PhotoModel({
            name: req.body.name,
            path: "/images/" + req.file.filename,
            postedBy: req.session.user.username,
            likes: 0,
            date: today.toString(),
            reports: 0
        });

        photo.save(function (err, photo) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when creating photo',
                    error: err
                });
            }

            return res.status(201).json(photo);
            //return res.redirect('/photos');
        });
    },

    /**
     * photoController.update()
     */
    update: function (req, res) {
        var id = req.body.id;
        var username = req.body.username;

        PhotoModel.findOne({ _id: id }, function (err, photo) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting photo',
                    error: err
                });
            }

            if (!photo) {
                return res.status(404).json({
                    message: 'No such photo'
                });
            }

            photo.peopleWhoLiked = photo.peopleWhoLiked + username + "||";
            photo.likes = photo.likes + 1;

            photo.save(function (err, photo) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating photo.',
                        error: err
                    });
                }

                return res.json(photo);
            });
        });
    },

    /**
     * photoController.remove()
     */
    remove: function (req, res) {
        var id = req.params.id;

        PhotoModel.findByIdAndRemove(id, function (err, photo) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when deleting the photo.',
                    error: err
                });
            }

            return res.status(204).json();
        });
    },

    publish: function (req, res) {
        return res.render('photo/publish');
    },


    report: function (req, res) {
        var id = req.body.id;
        var username = req.body.username;
        
        PhotoModel.findOne({ _id: id }, function (err, photo) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting photo',
                    error: err
                });
            }

            if (!photo) {
                return res.status(404).json({
                    message: 'No such photo'
                });
            }

            photo.peopleWhoLiked = photo.peopleWhoLiked + username + "||";
            photo.reports = photo.reports + 1;

            if (photo.reports == 10) {
                PhotoModel.findByIdAndRemove(id, function (err, photo) {
                    if (err) {
                        return res.status(500).json({
                            message: 'Error when deleting the photo.',
                            error: err
                        });
                    }

                    return res.status(204).json();
                });
            }
            else {
                photo.save(function (err, photo) {
                    if (err) {
                        console.log(err);
                        return res.status(500).json({
                            message: 'Error when updating photo.',
                            error: err
                        });
                    }

                    return res.json(photo);
                }
                );
            }
        });
    }
};
