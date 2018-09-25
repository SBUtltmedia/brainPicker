<?
$brain = $_POST["brain"];
print json_encode(file_get_contents($brain ."/highScores.json")));
?>
