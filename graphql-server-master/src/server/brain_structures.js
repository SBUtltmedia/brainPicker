import mongoose from 'mongoose';

var RegionSchema = new mongoose.Schema({
    _id: {
        type: Number,
        index: true,
        required: true,
        unique: true
    },
    points: {
        type: [[Number]]
    }
});

var Regions = mongoose.model('Region', RegionSchema);

var BrainStructureSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
        index: true,
        required: true
    },
    regions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Regions'
    }]
});

var BrainStructure = mongoose.model('BrainStructure', BrainStructureSchema);

export default BrainStructure;
