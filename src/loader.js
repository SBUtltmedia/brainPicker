import $ from "jquery";

export function getPreviousScores() {
    return $.getJSON("read.json");
}

export function getStructures() {
    return $.getJSON("structuressep9.json");
}

export function getQuestions() {
    return $.getJSON("questionBank1.json");
}
