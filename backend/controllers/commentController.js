var CommentModel = require('../models/commentModel.js');
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
        var id = req.params.id;
        CommentModel.find({ parrentPost: id })
            .exec(function (err, photos) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when getting photo.',
                        error: err
                    });
                }
                photos.reverse();
                return res.json(photos);
            });
    },

    /**
     * photoController.show()
     */
    show: function (req, res) {
        var id = req.params.id;

        CommentModel.findOne({ _id: id }, function (err, photo) {
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

            var data = []
            data.data = photo;
            return res.render('photo/post', data);
        });
    },

    /**
     * photoController.create()
     */
    create: function (req, res) {
        var today = new Date();
        var date = today.getDate() + '.' + (today.getMonth() + 1) + '.' + today.getFullYear();
        var time = today.getHours() + ":" + String(today.getMinutes()).padStart(2, '0');
        var comment = new CommentModel({
            postedBy: req.body.postedBy,
            parrentPost: req.body.parrentPost,
            comment: req.body.comment,
            time: time + " " + date
        });

        comment.save(function (err, photo) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when creating photo',
                    error: err
                });
            }

            CommentModel.find({ parrentPost: req.body.parrentPost })
                .exec(function (err, photos) {
                    if (err) {
                        return res.status(500).json({
                            message: 'Error when getting photo.',
                            error: err
                        });
                    }

                    return res.json(photos);
                });
        });
    },

    /**
     * photoController.update()
     */
    update: function (req, res) {
        CommentModel.findOneAndUpdate(
            { _id: req.body.id },
            { $set: { selected: "yes" } },
            { new: true, upsert: false },
            function (err, updatedComment) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating photo.',
                        error: err
                    });
                }

                if (!updatedComment) {
                    return res.status(404).json({
                        message: 'No such photo'
                    });
                }

                return res.json(updatedComment);
            }
        );
    },

    /**
     * photoController.remove()
     */
    remove: function (req, res) {
        var id = req.params.id;

        CommentModel.findByIdAndRemove(id, function (err, photo) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when deleting the photo.',
                    error: err
                });
            }

            PhotoModel.find()
                .exec(function (err, photos) {
                    if (err) {
                        return res.status(500).json({
                            message: 'Error when getting photo.',
                            error: err
                        });
                    }

                    var ph = photos.map(user => user.toObject());
                    if (typeof req.session?.user?.username != 'undefined') {
                        const data = {
                            data: ph,
                            session: req.session.user.username
                        };

                        return res.render('photo/list', { data: data });
                    } else {
                        const data = {
                            data: ph,
                            session: "e"
                        };

                        return res.render('photo/list', { data: data });
                    }

                });
        });
    },

    publish: function (req, res) {
        return res.render('photo/publish');
    }
};
