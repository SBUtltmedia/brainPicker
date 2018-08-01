<?php
function saveHighScores($user, $brain, $question)
{
$dir = getcwd() . '/rawdata/';
$files = scandir($dir);
$highScores = JSON_decode(file_get_contents($brain ."/highScores.json"));

//$highScores -> {$key}[0] is Username
//$highScores -> {$key}[1] is score
//$files[$i] is username for $theTrials


    $theTrials = JSON_decode(getUserJSON($user));
    $userValues = $theTrials->$brain->$question;
    print_r($userValues->Total);
    $foundQuestion = false;
    foreach($highScores as $key => $value){
      if ($key!=$question) continue;
      $foundQuestion = true;
      print("
      Found match
      ");
    if ($userValues->Total > $highScores -> {$key}[1] )
    {
      print ("Beat!
      ");
    $highScores -> {$key}[1] =$userValues->Total;
    $highScores -> {$key}[2] =$userValues->score;
    $highScores -> {$key}[3] =$userValues->ab;
    $highScores -> {$key}[0]= $user;
    file_put_contents($brain ."/highScores.json",json_encode($highScores));
    break;
    }
    }
    if ($foundQuestion == false) {
        print("
        Question not found");
        $highScoreValues = array();
        $highScoreValues[0] = $user;
        $highScoreValues[1] = $userValues->Total;
        $highScoreValues[2] = $userValues->score;
        $highScoreValues[3] = $userValues->ab;
        $highScores-> $question = $highScoreValues;
        file_put_contents($brain ."/highScores.json",json_encode($highScores));
    }


}

//print_r($highScores);



?>
