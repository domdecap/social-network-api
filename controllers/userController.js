const { Thought, User } = requires('../models')

module.exports = {
    async getUsers(req, res) {
        try {
            const users = await User.find()
                .select('-__v')
                .populate('thoughts');
            res.json(users);
        } catch (err) {
            console.log(err)
            res.status(500).json(err);
        }
    },

    async getSingleUser(req, res) {
        try {
            const user = await User.findOne({ _id: req.params.userId })
                .select('-__v')
                .populate('thoughts');

            if (!user) {
                return res.status(404).json({ message: 'No user with this ID' });
            }

            res.json(user);
        } catch (err) {
            console.log(err)
            res.status(500).json(err);
        }
    },

    async createUser(req, res) {
        try {
            const createUser = await User.create(req.body);
            res.json(createUser);
        } catch (err) {
            res.status(500).json(err);
        }
    },

    async updateUser(res, res) {
        try {
            const updateUser = await User.findOneAndUpdate(
                { _id: req.params.userId },
                { $set: req.body },
                { runValidators: true, new: true }
            );

            if (!updateUser) {
                res.status(404).json({ message: 'User not found' });
            }

            res.json(updateUser);
        } catch (err) {
            res.status(500).json(err);
        }
    },
    async deleteUser(req, res) {
        try {
            const deleteUser = await User.findOneAndDelete({ _id: req.params.userId });

            if (!deleteUser) {
                return res.status(404).json({ message: 'User not found' });
            }
            res.json({ message: 'User deleted', user: deleteUser });
        } catch (err) {
            res.status(500).json(err);
        }
    },

    async addFriend(req, res) {
        try {
            const { userId, friendId } = req.params;

            if (!friendId) {
                return res.status(400).json({ message: 'Invalid friend ID'});
            }

            const updatedUser = await User.findByIdAndUpdate(
                userId,
                { $addToSet: { friends: friendId } },
                { runValidators: true, new: true }
            );

            if (!updatedUser) {
                return res.status(404).json({ message: 'User not found' });
            }

            res.json({ message: 'Friend added successfully', user: updatedUser});
        } catch (err) {
            res.status(500).json({ message: 'Friend cannot be added', error: err });
        }
    },

    async deleteFriend(req, res) {
        try {
            const { userId, friendId } = req.params;

            if (!friendId) {
                return res.status(400).json({ message: 'Invalid friend ID'});
            }

            const updatedUser = await User.findByIdAndUpdate(
                userId,
                { $pull: {friends: friendId } },
                { runValidators: true, new: true }
            );

            if (!updatedUser) {
                return res.status(404).json({ message: 'User not found' });
            }

            res.json({ message: 'Friend deleted', user: updatedUser });
        } catch (err) {
            res.status(500).json({ message: 'Friend cannot be deleted', error: err});
        }
    },

};