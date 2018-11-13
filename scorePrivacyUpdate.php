<?php
include("getUserJSON.php");
updateScores();
//Tester below
//saveHighScores("hi", "human", "area medial and caudal to the green point");



//Function to compare new high score to previous ones of a certain question.
function updateScores()
{
$brains = array("human");
$users = scandir("rawdata");
$userdata = JSON_decode("{}");
$privateUsers = file("scoreBlacklist", FILE_IGNORE_NEW_LINES);
$privateUsersNames = array();
foreach ($users as $user) {
  if (!in_array($user, $privateUsers) && ctype_alpha($user[0])) { //ctype alpha ensures the file starts with a letter, essentially removing all . files
    $userdata->$user = JSON_decode(getUserJSON($user));
  }
}
foreach ($brains as $brain) {
  $allHighScores = JSON_decode(file_get_contents($brain ."/highScores.json"));
  if (!$allHighScores) $allHighScores = json_decode("{}");
  $questions = JSON_decode(file_get_contents($brain ."/questionBank.json"));
  foreach ($questions as $question) {
    $questionScores = array();
    if (property_exists($question,'text')) {
      $questionName = $question->text;
    }
    else {
      $questionName = $question->region;
    }
    foreach ($userdata as $userScores) {
      $user = $userScores->user;
      // print_r($userScores);
        if (property_exists($userScores, $brain)) {
          $brainScore = $userScores->$brain;
          // print_r($brainScore);
          if (property_exists($brainScore, $questionName)) {
            $questionScore = $brainScore->$questionName;
            $newScoreObject = json_decode("{\"user\":\"$user\",\"score\":$questionScore->score,\"ab\": $questionScore->ab}");
            $questionScores[] = $newScoreObject;
        }
      }
    }

    $allHighScores->$questionName = sortScores($questionScores);
    //print_r($allHighScores);
  }
  file_put_contents($brain ."/highScores.json",json_encode($allHighScores));
 }
}



//Helper function that iterates and sorts the values, then only returns the first 10.
function sortScores($scores){
// print_r($scores);
 $x = usort($scores, function($a, $b)
{
    return intCompare( $b->score+$b->ab,$a->score+$a->ab);
});
print_r($scores);
return array_slice($scores,0,10);
}
//Comparison function for usort sorting. Read usort php documentation for further explaination (strcmp function is only for strings).
function intCompare($a, $b) {
  if ($a==$b) return 0;
  if ($a>$b) return 1;
  if ($b>$a) return -1;
}

?>
