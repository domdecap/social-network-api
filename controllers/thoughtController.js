const { Thought, User } = require('../models')
const { Types } = require('mongoose')

module.exports = {
    async getThoughts(req, res) {
        try {
            const thoughts = await Thought.find()
            res.json(thoughts);
        } catch (err) {
            res.status(500).json(err);
        }
    },

    async getSingleThought(req, res) {
        try {
            const thought = await Thought.findOne({ _id: req.params.thoughtId })

            if (!thought) {
                return res.status(404).json({ message: 'No thought with that ID' });
            }

            res.json(thought);
        } catch (err) {
            res.status(500).json(err);
        }
    },
    async createThought(req, res) {
        try {
            const createThought = await Thought.create(req.body);
            const updatedUser = await User.findByIdAndUpdate(
                req.body.userId,
                { $push: { thoughts: createThought._id } },
                { runValidators: true, new: true }
            );
            res.json(createThought);
        } catch (err) {
            console.log(err);
            return res.status(500).json(err);
        }
    },

    async updateThought(req, res) {
        try {
            const updateThought = await Thought.findOneAndUpdate(
                { _id: req.params.thoughtId },
                { $set: req.body },
                { runValidators: true, new: true }
            );

            if (!updateThought) {
                res.status(404).json({ message: 'No thought with this id!' });
            }

            res.json(updateThought);
        } catch (err) {
            res.status(500).json(err);
        }
    },

    async deleteThought(req, res) {
        try {
            const deleteThought = await Thought.findOneAndDelete({ _id: req.params.thoughtId });

            if (!deleteThought) {
                res.status(404).json({ message: 'No user with that ID' });
            }

            res.json({ message: 'Thought deleted', user: deleteThought });
        } catch (err) {
            res.status(500).json(err);
        }
    },

    async addReaction(req, res) {
        try {
            const thoughtId = req.params.thoughtId
            const reaction = {
                reactionId: new Types.ObjectId(),
                reactionBody: req.body.reactionBody,
                username: req.body.username,
                createdAt: new Date(),
            }
            const updatedThought = await Thought.findByIdAndUpdate(
                thoughtId,
                { $push: { reactions: reaction } },
                { runValidators: true, new: true }
            );

            if (!updatedThought) {
                return res.status(404).json({ message: 'Thought not found' });
            }

            res.json({ message: 'Reaction added successfully', thought: updatedThought })
        } catch (err) {
            console.log(err)
            res.status(500).json(err)
        }
    },

    async deleteReaction(req, res) {
        try {
            const thoughtId = req.params.thoughtId
            const reactionId = req.params.reactionId

            const updatedThought = await Thought.findByIdAndUpdate(
                thoughtId,
                { $pull: { reactions: { _id: reactionId } } },
                { runValidators: true, new: true }
            );

            if (!updatedThought) {
                return res.status(404).json({ message: 'Thought not found' });
            }

            res.json({ message: 'Reaction deleted', thought: updatedThought });

        } catch (err) {
            console.log(err)
            res.status(500).json(err)
        }
    },

}