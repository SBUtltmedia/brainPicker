<?
function getUserJSON($id)

{

$retVal=file_get_contents("rawdata/$id");
return $retVal;
}
?>
