<?php
function getScores($path)
{
$dir =  $path.'/rawdata/';
$files = scandir($dir);

$giveMeEverything = '{';

foreach($files as $file) {
	if ($file != "." & $file != "..") {
    $line1 = rtrim((file_get_contents("$path/rawdata/".$file)), ",");
    $line2 = '"'.$file.'"';
    $giveMeEverything .= "$line2 : $line1," ; 
    }
}

$fin = rtrim($giveMeEverything, ",");

$fin .= "}";

return $fin;
}
if(basename(__FILE__) == basename($_SERVER["SCRIPT_FILENAME"]) ) { print getScores("."); }





?>
