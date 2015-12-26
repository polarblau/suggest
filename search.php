<?php
$ingredients = [
	'Apple',
	'Appricot',
	'Almond',
	'Asparagus',
	'Banana',
	'Black Berry',
	'Beer',
	'Bastard Sugar',
	'Beef',
	'Cider',
	'Cinamon',
	'Chili',
	'Curry',
    'Chicken',
	'Durian',
	'Date',
	'Egg',
	'Eggplant',
	'Fig'
];

$searchString = $_GET['q'];
$input = preg_quote($searchString, '/'); // don't forget to quote input string!

$result = preg_grep('/^' . $input . '/i', $ingredients);
echo json_encode(array_values($result));
