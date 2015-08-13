<?

//$temp=json_decode('{"area_medil_and_caudal_to_the_green_point":"99"}');
//reset($temp);
$first_key =array_keys($_POST);
$first_key=$first_key[0];
$no_underscore = str_replace('_', ' ', $first_key);
include("getUserJSON.php");
 
$allTrials=json_decode( getUserJSON($_SERVER["cn"]));
if(!property_exists($allTrials,$no_underscore)) $allTrials->{$no_underscore}=$_POST[$first_key];
print_r($allTrials);
if ($allTrials->{$no_underscore} < $_POST[$first_key]) $allTrials->{$no_underscore}=$_POST[$first_key];

//$allTrials = str_replace('_', ' ', $allTrials);

file_put_contents("rawdata/".$_SERVER["cn"],json_encode($allTrials));

?>

