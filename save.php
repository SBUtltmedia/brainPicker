<?

//$temp=json_decode('{"area_medil_and_caudal_to_the_green_point":"99"}');
//reset($temp);
include("saveHighScores.php");
include("getUserJSON.php");
$user = $_SERVER["cn"]; 
$first_key =array_keys($_REQUEST);
$first_key=$first_key[0];
$no_underscore = str_replace('_', ' ', $first_key);
$paddedScore=$first_key[0] + $first_key[1]/100;
 

 
$allTrials=json_decode( getUserJSON($user));
if(!property_exists($allTrials,$no_underscore)) {
$allTrials->{$no_underscore}=$paddedScore;
$firstTime = true;
}
#print_r($allTrials);
if (($allTrials->{$no_underscore} < $_REQUEST[$first_key]) || ($firstTime))
{
 $allTrials->{$no_underscore}=$paddedScore;
 saveHighScores($user);
 file_put_contents("rawdata/".$user,json_encode($allTrials));
 
}

//$allTrials = str_replace('_', ' ', $allTrials);



?>

