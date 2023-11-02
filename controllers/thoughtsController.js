const { Thought } = require('../models');

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
                .select('__v');
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
            const thought = await Thought.create(req.body);
            res.json(thought);
        } catch (err) {
            res.status(500).json(err);
        }
    },
    async updateThought(req, res) {
        try {
            const updatedThought = await Thought.findByIdAndUpdate(
                req.params.thoughtId,
                {thought: req.body.thought},
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
            const thoughtId = req.params.thoughtId;
            const {reaction} = req.body;
            const thought = await Thought.findByIdAndUpdate(
                thoughtId,
                { $push: { reactions: reaction }},
                { new: true }
            )
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
            const thoughtId = req.params.thoughtId;
            const reactionId = req.params.reactionId;
            const thought = await Thought.findByIdAndUpdate(
                thoughtId,
                { $pull: { reactions: { _id: reactionId } }},
                { new: true }
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