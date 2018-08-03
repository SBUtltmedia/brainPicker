<?php

//Tester below
//saveHighScores(json_decode("{\"score\":50,\"ab\": 50}"), "human", "area medial and caudal to the green point");



//Function to compare new high score to previous ones of a certain question.
function saveHighScores($newScore, $brain, $question)
{
$user = $_SERVER["cn"];
$allHighScores = JSON_decode(file_get_contents($brain ."/highScores.json"));
print("All high scores: ");
if (!$allHighScores) $allHighScores = json_decode("{}");
print_r($allHighScores);
if (!property_exists($allHighScores, $question)) $newHighScores = array($newScore);

$questionHighScores = $allHighScores->$question;
$checkedQuestionHighScores = changeUserOldScore($questionHighScores, $user, $newScore);
if($checkedQuestionHighScores!=false) {$questionHighScores = $checkedQuestionHighScores; print("Found old user score");}
else $questionHighScores[] = $newScore;
print_r(sizeOf($questionHighScores)+"
");
$newHighScores = sortScores($questionHighScores);
print("New high scores: ");
print_r($newHighScores);
$allHighScores->$question = $newHighScores;
file_put_contents($brain ."/highScores.json",json_encode($allHighScores));
}


//Helper function that iterates and sorts the values, then only returns the first 10.
function sortScores($scores){
 usort($scores, function($a, $b)
{
    return strcmp( $a->score+$a->ab,$b->score+$b->ab);
});
return array_slice($scores,0,10);
}

//Searches, replaces, and returns previous user score in high score list (you can only have one high score). Returns false if student not found.
function changeUserOldScore($arrayOfScores, $userName, $newScoreObject) {
    foreach ( $arrayOfScores as $element ) {
        if ( $userName == $element->user ) {
            $element->score = $newScoreObject->score;
            $element->ab = $newScoreObject->ab;
            return $arrayOfScores;
        }
    }

    return false;
}
?>
