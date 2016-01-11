import mongoose from 'mongoose';

var BrainStructureSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
        index: true,
        required: true
    },
    regions: [{
        _id: {
            type: Number,
            index: true,
            required: true,
            unique: true
        },
        points: {
            type: mongoose.Schema.Types.Mixed
        }
    }]
});

var BrainStructure = mongoose.model('BrainStructure', BrainStructureSchema);

export default BrainStructure;
