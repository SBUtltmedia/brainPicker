<?php
$dir = getcwd() . '/rawdata/';
$files = scandir($dir);

$giveMeEverything = '{';

foreach($files as $file) {
	if ($file != "." & $file != "..") {
    $line1 = rtrim((file_get_contents("rawdata/".$file)), ",");
    $line2 = '"'.$file.'"';
    $giveMeEverything .= "$line2 :[ $line1]," ; 
    }
}

$fin = rtrim($giveMeEverything, ",");

$fin .= "}";

print $fin;

?>