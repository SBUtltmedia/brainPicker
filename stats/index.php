<?
include("../getScores.php");
header("Content-type: text/csv");
header("Content-Disposition: attachment; filename=file.csv");
header("Pragma: no-cache");
header("Expires: 0");
$row = array();
$rowCount=1;
$row[0]=array();
$row[0][0]="Name";
$scores = json_decode(getScores(".."));
 foreach($scores as $key => $value) {
$row[$rowCount][0]=$key;
foreach ($value as $vkey => $vval){
if(!in_array($vkey,$row[0])) $row[0][count($row[0])]=$vkey;

$row[$rowCount][array_search($vkey,$row[0])]=$vval;
}
$rowCount++;
}



for($i=1;$i<count($row);$i++)
{
$row[$i]=$row[$i]+array_fill(0,count($row[0]),0);
ksort($row[$i]);
}




#print_r($row);
$out = fopen('php://output', 'w');
foreach ($row as $fields) {
fputcsv($out, $fields);
}
fclose($out);




?>

