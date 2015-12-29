import $ from 'jquery';
import _ from 'lodash';
const TOTAL_LAYERS = 34;
const brainImages = _.map(_.range(1, TOTAL_LAYERS + 1), i => require(`../images/${i}.png`));

function showBrainPic(index) {
    $('#brainPic').attr('src', brainImages[index]);
}

$(() => {
    showBrainPic(29);
});
