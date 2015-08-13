<?php
$dir = getcwd() . '/rawdata/';
$files = scandir($dir);
$highScores = JSON_decode(file_get_contents(getcwd() ."/highScores.json"));

//$highScores -> {$key}[0] is Username
//$highScores -> {$key}[1] is score
//$files[$i] is username for $theTrials

for($i=0; $i<count($files); $i++) {
	if ($files[$i] != "." & $files[$i] != "..") {
	
    $theTrials = JSON_decode(file_get_contents("rawdata/".$files[$i]));
    //$j=0;
    foreach($highScores as $key => $value){
    
    if ($theTrials->{$key} > $highScores -> {$key}[1] ) 
    {
    $highScores -> {$key}[1] =$theTrials->{$key};
    $highScores -> {$key}[0]= $files[$i];
  
    } 
     
    }
    
    
    }

}

//print_r($highScores);
file_put_contents(getcwd() ."/highScores.json",json_encode($highScores));


?>