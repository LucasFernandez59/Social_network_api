const { User} = require('../models');

module.exports = {
    async getUsers(req, res) {
        try {
            const users = await User.find();
            res.json(users);
        } catch (err) {
            console.log(err);
            return res.status(500).json(err);
        }
    },
    async getSingleUser(req, res) {
        try {
            const user = await User.findOne({ _id: req.params.userId })
            .select('-__v')
            .populate('thoughts');

        if (!user) {
            return res.status(404).json({ message: 'No user with that ID' })
        }
        res.json({user});
        } catch (err) {
            console.log(err);
            return res.status(500).json(err);
        }
    },
    async createUser(req, res) {
        try {
            const user = await User.create(req.body);
            res.json(user);
        } catch (err) {
            res.status(500).json(err);
        }
    },
    async updateUser(req, res) {
        try {
            const updatedUser = await User.findByIdAndUpdate(
                req.params.userId,
                { username: req.body.username},
                { new: true}
            );
        if (!updatedUser) {
            return res.status(404).json({ message: 'No user with that ID' })
        }
        res.json({updatedUser});
        } catch (err) {
            console.log(err);
            return res.status(500).json(err);
        }
    },
    async deleteUser(req, res) {
        try {
            const user = await User.findOneAndDelete({ _id: req.params.userId });
        if (!user) {
            return res.status(404).json({ message: 'No user with that ID' });
        }
        res.json({ message: 'User deleted'})
        } catch (err) {
            console.log(err);
            res.status(500).json(err);
        }
    
    },
    async addFriend(req, res) {
        try {
            const {userId, friendId} = req.params;
            const user = await User.findByIdAndUpdate(
                userId,
                { $addToSet: { friends: friendId }},
                { new: true }
            );
        if (!user) {
            return res.status(404).json({ message: 'No user with that ID' });
        }
        res.json(user);
        } catch (err) {
            console.log(err);
            res.status(500).json(err);
        }
    },
    async removeFriend(req, res) {
        try {
            const user = await User.findByIdAndUpdate(
                userId,
                { $pull: { friends: friendId }},
                { new: true }
            );
        if (!user) {
            return res.status(404).json({ message: 'No user with that ID' });
        }
        res.json(user);
        } catch (err) {
            console.log(err);
            res.status(500).json(err);
        }
    }
}