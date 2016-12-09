AuthPattern
===========
Provide a selection of dots to join together by clicking to draw a pattern and submit.

![Screenshot](https://raw.githubusercontent.com/CraicOverflow89/AuthPattern/blob/master/screenshot/screenshot1.png "Screenshot")

#### Demo
https://jsfiddle.net/CraicOverflow89/mp757nm6/

#### Setup
To get this working you literally just need to include the `authPattern.js` and include this in your page;
```
<script>
	authPattern(function(data)
	{
		alert("PATTERN SUBMITTED\n" + JSON.stringify(data));
		// NOTE: you will likely want to perform a backend request to validate the submitted pattern on the serverside
	});
</script>
<canvas id = "authPatternCanvas" width = "300" height = "350"></canvas>
```

#### Customisation
You can alter the styles by adding an object name/value settings like this;
```
	authPattern(function(data)
	{
		alert("PATTERN SUBMITTED\n" + JSON.stringify(data));
	}, {
		"bkg-color":"000000",
		"circle-border":2,
		"circle-color":"CC0000",
		"circle-radius":10,
		"submit-font":"bold 24pt monospace",
		"submit-text":"LOGIN"
	});
```

#### Feedback
Feel free to share questions/comments.
