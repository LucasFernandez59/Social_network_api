const { Thought, User } = require('../models');

module.exports = {
    async getThoughts(req, res) {
        try {
            const thoughts = await Thought.find();
            res.json(thoughts);
        } catch (err) {
            res.status(500).json(err);
        }
    },
    async getSingleThought(req, res) {
        try {
            const thought = await Thought.findOne({ _id: req.params.thoughtId })
                .select('-__v');
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
            const {thoughtText, username} = req.body;

            let user = await User.findOne({username});
            if (!user) {
                return res.status(404)
                .json({ message: 'No user with that ID'})
            }

            const thought = new Thought({
                thoughtText,
                username: user.username,
                createdAt: new Date()
            })

            await thought.save();

            user.thoughts.push(thought._id)
            
            await user.save()
            res.status(200).json(thought);
        
        } catch (err) {
            res.status(500).json(err);
        }
    },
    async updateThought(req, res) {
        try {
            const updatedThought = await Thought.findByIdAndUpdate(
                {_id: req.params.thoughtId},
                {thoughtText: req.body.thoughtText},
                {new: true}
            );
        if (!updatedThought) {
            return res.status(404).json({ message: 'No thought with that ID' })
        }
        res.json({updatedThought});
        } catch (err) {
            console.log(err);
            return res.status(500).json(err);
        }
    },
    async deleteThought(req, res) {
        try {
            const thought = await Thought.findOneAndDelete({ _id: req.params.thoughtId});
        if (!thought) {
            return res.status(404).json({ message: 'No thought with that ID' })
        }
        res.json({ message: 'Thought deleted' })
        } catch (err) {
            res.status(500).json(err);
        }
    },
    async createReaction(req, res) {
        try {
            console.log(req.body);
            const thought = await Thought.findOneAndUpdate(
                {_id: req.params.thoughtId},
                { $addToSet: { reactions: req.body }},
                { runValidators: true, new: true }
            )
            console.log(thought);
        if (!thought) {
            return res.status(404).json({ message: 'No thought with that ID' })
        }
        res.json(thought);
        } catch (err) {
            console.log(err);
            return res.status(500).json(err);
        }
    },
    async removeReaction(req, res) {
        try {
            const thought = await Thought.findOneAndUpdate(
                {_id: req.params.thoughtId},
                { $pull: { reactions: {reactionId: req.params.reactionId} }},
                { runValidators: true, new: true }
            )
        if (!thought) {
            return res.status(404).json({ message: 'No thought with that ID' })
        }
        res.json(thought);
        } catch (err) {
            console.log(err);
            return res.status(500).json(err);
        }
    }
}