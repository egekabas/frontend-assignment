<template></template>
<style>

@import url('https://fonts.googleapis.com/css2?family=Noticia+Text&family=Roboto&family=UnifrakturMaguntia&display=swap');

*{
    font-family: 'Roboto', sans-serif;
}
:root {
    --turqoise:#95F5EE;
    --green:#95F5CE;
    --blue:#95DDF5;
    --bright:#09d306;
}

button.default {
    box-shadow: 0px 10px 14px -7px #276873;

    background-color: var(--bright);

    border-radius:8px;
    border-color: black;
	display:inline-block;
	cursor:pointer;

    font-size:30px;
	padding:13px 32px;
	text-decoration:none;
	text-shadow:0px 1px 0px #3d768a;

    margin-bottom: 1em;
}


button.default:hover {
	background:linear-gradient(to bottom, #408c99 5%, #599bb3 100%);
	background-color:#408c99;
}

</style>