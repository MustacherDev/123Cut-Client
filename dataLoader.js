// Loading Sounds
var soundsArr = [];
var soundsState = [];


var snd_hit        = new Audio("audio/Hit.mp3");
snd_hit.volume = 0.5;
soundsArr.push(snd_hit);

var snd_explosion        = new Audio("audio/explosion.flac");
snd_explosion.volume = 0.5;
soundsArr.push(snd_explosion);

var snd_fireExtinguished        = new Audio("audio/fireExtinguished.mp3");
snd_fireExtinguished.volume = 1;
soundsArr.push(snd_fireExtinguished);

var snd_freeze        = new Audio("audio/freeze.mp3");
snd_freeze.volume = 0.5;
soundsArr.push(snd_freeze);
