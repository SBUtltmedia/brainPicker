<?php

function saveHighScores($user){
$dir = getcwd() . '/rawdata/';
$files = scandir($dir);
$highScores = JSON_decode(file_get_contents(getcwd() ."/highScores.json"));

//$highScores -> {$key}[0] is Username
//$highScores -> {$key}[1] is score
//$files[$i] is username for $theTrials

	
    $theTrials = JSON_decode(file_get_contents("rawdata/".$user));
    //$j=0;
    foreach($highScores as $key => $value){

    
    
    if (!property_exists($theTrials,$keys) && $theTrials->{$key} > $highScores -> {$key}[1] ) 
    {
    $highScores -> {$key}[1] =$theTrials->{$key};
    $highScores -> {$key}[0]= $files[$i];
  
    } 
     
    }
file_put_contents(getcwd() ."/highScores.json",json_encode($highScores));

}

//print_r($highScores);

 saveHighScores("jkremenhallo");

?>