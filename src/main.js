import { getPreviousScores, getStructures, getQuestions } from './loader';
import { showQuestionButtons } from './buttons';
require("./resize");
require("./infoToggle")

getQuestions()
  .done(data => {
      showQuestionButtons(data);
  })
  .fail(error => console.error(error));
