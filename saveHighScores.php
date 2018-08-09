<?php


//Tester below
//saveHighScores("hi", "human", "area medial and caudal to the green point");



//Function to compare new high score to previous ones of a certain question.
function saveHighScores($newScore, $brain, $question)
{
$user = $_SERVER["cn"];
//Test lines below from 13-17. Must also uncomment line 5 to test.
   // $user = "treezle";
   // $score = 100;
   // $afterburner = 5;
   // $newScore = json_decode("{\"user\":\"$user\",\"score\":$score,\"ab\": $afterburner}");

$allHighScores = JSON_decode(file_get_contents($brain ."/highScores.json"));
// print("All high scores: ");
if (!$allHighScores) $allHighScores = json_decode("{}");
if (!property_exists($allHighScores, $question)) $newHighScores = array($newScore);

$questionHighScores = $allHighScores->$question;
$checkedQuestionHighScores = changeUserOldScore($questionHighScores, $user, $newScore);
if($checkedQuestionHighScores!=false) {
  $newHighScores = sortScores($checkedQuestionHighScores);
  print("Found old user score");
}
else {
  $questionHighScores[] = $newScore;
  $newHighScores = sortScores($questionHighScores);
}
// print("New high scores: ");
$allHighScores->$question = $newHighScores;
file_put_contents($brain ."/highScores.json",json_encode($allHighScores));
}


//Helper function that iterates and sorts the values, then only returns the first 10.
function sortScores($scores){
print_r($scores);
 $x = usort($scores, function($a, $b)
{
    return intCompare( $b->score+$b->ab,$a->score+$a->ab);
});
print_r($scores);
print_r($x);
return array_slice($scores,0,10);
}
//Comparison function for usort sorting. Read usort php documentation for further explaination (strcmp function is only for strings).
function intCompare($a, $b) {
  if ($a==$b) return 0;
  if ($a>$b) return 1;
  if ($b>$a) return -1;
}

//Searches, replaces, and returns previous user score in high score list (you can only have one high score). Returns false if student not found.
function changeUserOldScore($arrayOfScores, $userName, $newScoreObject) {
  print_r("changing old score");
    foreach ( $arrayOfScores as $element ) {
        if ( $userName == $element->user ) {
            $element->score = $newScoreObject->score;
            $element->ab = $newScoreObject->ab;
            print_r($arrayOfScores);
            return $arrayOfScores;
        }
    }

    return false;
}
?>
