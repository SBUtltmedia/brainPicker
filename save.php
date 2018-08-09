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
$totalScore=$score+$afterburner;
$allTrials=json_decode(getUserJSON($user));
$scoreObject= json_decode("{\"score\":$score,\"ab\": $afterburner}");
if (!property_exists($allTrials, $brain)) {
  $allTrials->$brain=json_decode("{}");
}
$brainTrials = $allTrials -> $brain;
if(!property_exists($brainTrials,$question)) {
$brainTrials->$question =$scoreObject;
}
#print_r($allTrials);
// print("Old Score: ".$brainTrials->$question. "
// New Score: ".$paddedScore);

$oldScore = $brainTrials->$question;

$oldTotalScore = $oldScore->score+$oldScore->ab;
if ($oldTotalScore <= $totalScore)
{

 $brainTrials->$question=$scoreObject;
 $allTrials -> $brain = $brainTrials;
 $highScoreObject = json_decode("{\"user\":\"$user\",\"score\":$score,\"ab\": $afterburner}");
 file_put_contents("rawdata/".$user,json_encode($allTrials));
 print("
 User Score Updated
 ");
 print("User high score object: ");
 print_r($highScoreObject);
 saveHighScores($highScoreObject, $brain, $question);
 return "{}";
}
return "{}";




//$allTrials = str_replace('_', ' ', $allTrials);



?>
