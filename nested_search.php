<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

$ingredients = [
	[
		'id'=> 1,
		'name' => 'Apple',
	], [
		'id'=> 2,
		'name' => 'Appricot',
	], [
		'id'=> 3,
		'name' => 'Almond',
	], [
		'id'=> 4,
		'name' => 'Asparagus',
	], [
		'id'=> 5,
		'name' => 'Banana',
	], [
		'id'=> 6,
		'name' => 'Black Berry',
	], [
		'id'=> 7,
		'name' => 'Beer',
	], [
		'id'=> 8,
		'name' => 'Bastard Sugar',
	], [
		'id'=> 9,
		'name' => 'Beef',
	], [
		'id'=> 10,
		'name' => 'Cider',
	], [
		'id'=> 11,
		'name' => 'Cinamon',
	], [
		'id'=> 12,
		'name' => 'Chili',
	], [
		'id'=> 13,
		'name' => 'Curry',
	], [
		'id'=> 14,
		'name' => 'Chicken',
	], [
		'id'=> 15,
		'name' => 'Durian',
	], [
		'id'=> 16,
		'name' => 'Date',
	], [
		'id'=> 17,
		'name' => 'Egg',
	], [
		'id'=> 18,
		'name' => 'Eggplant',
	], [
		'id'=> 19,
		'name' => 'Fig'
	]
];

$searchString = $_GET['q'];
$input = preg_quote($searchString, '/'); // don't forget to quote input string!

$result = array_filter($ingredients, function ($value) use ($input) { 
	if (preg_match('/^' . $input . '/i', $value['name'])) {
		return true;
	}
	return false; 
});

echo json_encode(array_values($result));
