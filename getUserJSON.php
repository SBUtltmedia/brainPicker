<?
function getUserJSON($id)

{

$file = "rawdata/$id";

$retVal=file_get_contents($file);
if($retVal == false) {$retVal = "{}";
file_put_contents($file, $retVal);
}
return $retVal;
}
?>
