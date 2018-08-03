<?


//$temp=json_decode('{"area_medial_and_caudal_to_the_green_point":"99"}');
//reset($temp);
include("saveHighScores.php");
include("getUserJSON.php");
$user = $_SERVER["cn"];
$question = $_POST["question"];
$score = (int)$_POST["score"];
$afterburner = (int)$_POST["afterburner"];
$brain = $_POST["brain"];
$paddedScore=$score+$afterburner;
$allTrials=json_decode(getUserJSON($user));
if (!property_exists($allTrials, $brain)) {
  $allTrials->$brain->$question= array("Total" => $paddedScore , "score" => $score, "ab" => $afterburner);
  $firstTime = true;
  print("did not find brain");
}
$brainTrials = $allTrials -> $brain;
if(!property_exists($brainTrials,$question)) {
$brainTrials->$question = array("Total" => $paddedScore , "score" => $score, "ab" => $afterburner);
$firstTime = true;
print ("have not had this question before");
}
#print_r($allTrials);
// print("Old Score: ".$brainTrials->$question. "
// New Score: ".$paddedScore);
$oldScore = $brainTrials->$question->Total;
print_r($oldScore);
if (($oldScore < $paddedScore) || ($firstTime))
{
 $brainTrials->$question= array("Total" => $paddedScore , "score" => $score, "ab" => $afterburner);
 $allTrials -> $brain = $brainTrials;
 file_put_contents("rawdata/".$user,json_encode($allTrials));
 print("
 User Score Updated
 ");
 saveHighScores($user, $brain, $question);
}


//$allTrials = str_replace('_', ' ', $allTrials);



?>
