function authPattern(callback, config)
{
	// Setup
	var canvas = document.getElementById("authPatternCanvas");
	var authPattern = {canvas:canvas, context:canvas.getContext("2d"), submit:false, path:[], hover:null};

	// Configuration Logic
	var configuration = function(config)
	{
		// Background Colour
		if(!config.hasOwnProperty("bkg-color")) {config["bkg-color"] = "000000";}

		// Circle and Line Style
		if(!config.hasOwnProperty("circle-border")) {config["circle-border"] = 2;}
		if(!config.hasOwnProperty("circle-color")) {config["circle-color"] = "00CC00";}
		if(!config.hasOwnProperty("circle-radius")) {config["circle-radius"] = 10;}

		// Submit Button
		if(!config.hasOwnProperty("submit-font")) {config["submit-font"] = "normal 26pt Calibri";}
		if(!config.hasOwnProperty("submit-text")) {config["submit-text"] = "SUBMIT";}

		// Return Config
		return config;
	};

	// Configuration Setup
	authPattern.config = configuration((typeof config === "undefined") ? {} : config);

	// Position Logic
	var boundsLogic = function()
	{
		var bounds = canvas.getBoundingClientRect();
		if(!bounds.hasOwnProperty("x"))
		{
			bounds.x = bounds.left;
			bounds.y = bounds.top;
		}
		return bounds;
	}

	// Position Attach
	var bounds = boundsLogic();
	authPattern.position = function(eventX, eventY) {return {x:eventX - bounds.x, y:eventY - bounds.y};};

	// Map Context
	var c = authPattern.context;	

	// Submit Render
	var submitRender = function()
	{
		// Render Border
		c.strokeStyle = "#" + authPattern.config["circle-color"];
		c.lineWidth = authPattern.config["circle-border"];
		c.rect(50, 290, 200, 40);
		c.stroke();

		// Render Text
		c.font = authPattern.config["submit-font"];
		c.textAlign = "center";
		c.fillText(authPattern.config["submit-text"], 150, 322);
	};

	// Submit Intersect
	var submitIntersect = function(eventX, eventY)
	{
		return (eventX >= 50 && eventX <= 250 && eventY >= 290 && eventY <= 330);
	};

	// Path Logic
	var pathContains = function(id)
	{
		for(var c = 0; c < authPattern.path.length; c ++)
		{
			if(authPattern.path[c].id == id) {return true;}
		}
		return false;
	};

	// Listener Logic
	var listenerClick = function(event)
	{
		// Detect Circle
		var pos = authPattern.position(event.clientX, event.clientY);
		var intersect = authPattern.circle.intersect(pos.x, pos.y);
		if(intersect !== null)
		{
			// First Circle
			if(!authPattern.path.length)
			{
				intersect.fill();
				authPattern.path = [intersect];
				return;
			}

			// Additional Circle
			else
			{
				if(!pathContains(intersect.id))
				{
					intersect.fill();
					intersect.connect(authPattern.path[authPattern.path.length - 1]);
					authPattern.path.push(intersect);
					if(!authPattern.submit)
					{
						submitRender();
						authPattern.submit = true;
					}
					return;
				}
			}
		}

		// Submit Click
		else if(authPattern.submit && submitIntersect(pos.x, pos.y))
		{
			// Define Response
			var response = [];

			// Iterate Path
			for(var c = 0; c < authPattern.path.length; c ++) {response.push(authPattern.path[c].id);}

			// Execute Callback
			callback(response);
			return;
		}
	};
	var listenerHover = function(event)
	{
		// Detect Circle
		var pos = authPattern.position(event.clientX, event.clientY);
		var intersect = authPattern.circle.intersect(pos.x, pos.y);
		if(intersect !== null && !pathContains(intersect.id))
		{
			// Circle Grow
			intersect.grow();
			authPattern.hover = intersect;
		}

		// None Detected
		else if(authPattern.hover !== null && !pathContains(authPattern.hover.id))
		{
			// Circle Shrink
			authPattern.hover.shrink();
			authPattern.hover = null;
		}
	};

	// Listener Attach
	canvas.addEventListener("mousedown", listenerClick, false);
	canvas.addEventListener("mousemove", listenerHover, false);

	// Build Logic
	var build = function()
	{
		// Background Logic
		var renderBackground = function()
		{
			c.fillStyle = "#" + authPattern.config["bkg-color"];
			c.fillRect(0, 0, 300, 350);
		};

		// Circle Logic
		var renderCircleUnit = function(id, posX, posY)
		{
			// Map Radius
			var r = authPattern.config["circle-radius"];

			// Render Circle
			c.strokeStyle = "#" + authPattern.config["circle-color"];
			c.lineWidth = authPattern.config["circle-border"];
			c.beginPath();
			c.arc(posX, posY, r / 2, 0, 2 * Math.PI);
			c.stroke();

			// Intersect Logic
			var intersect = function(eventX, eventY)
			{
				return (eventX >= posX - r && eventX <= posX + r && eventY >= posY - r && eventY <= posY + r);
			};

			// Fill Logic
			var fillCircle = function()
			{
				c.fillStyle = "#" + authPattern.config["circle-color"];
				c.beginPath();
				c.arc(posX, posY, r, 0, 2 * Math.PI);
				c.fill();
			};

			// Connect Logic
			var connectCircle = function(target)
			{
				c.strokeStyle = "#" + authPattern.config["circle-color"];
				c.lineWidth = authPattern.config["circle-border"];
				c.beginPath();
				c.moveTo(posX, posY);
				c.lineTo(target.x, target.y);
				c.stroke();
			};

			// Hover Logic
			var hoverBackground = function()
			{
				c.fillStyle = "#" + authPattern.config["bkg-color"];
				c.beginPath();
				c.arc(posX, posY, r * 1.3, 0, 2 * Math.PI);
				c.arc(posX, posY, r * 1.0, 0, 2 * Math.PI);
				c.fill();
			};
			var hoverGrow = function()
			{
				hoverBackground();
				c.strokeStyle = "#" + authPattern.config["circle-color"];
				c.lineWidth = authPattern.config["circle-border"];
				c.beginPath();
				c.arc(posX, posY, r, 0, 2 * Math.PI);
				c.stroke();
			};
			var hoverShrink = function()
			{
				hoverBackground();
				c.strokeStyle = "#" + authPattern.config["circle-color"];
				c.lineWidth = authPattern.config["circle-border"];
				c.beginPath();
				c.arc(posX, posY, r / 2, 0, 2 * Math.PI);
				c.stroke();
			};

			// Return Circle
			return {id:id, x:posX, y:posY, grow:hoverGrow, shrink:hoverShrink, intersect:intersect, fill:fillCircle, connect:connectCircle};
		};
		var renderCircle = function()
		{
			// Define Circle Array
			var circleUnit = [];

			// Create Circles
			var circleID = 0;
			for(var y = 0; y < 3; y ++)
			{
				for(var x = 0; x < 3; x ++)
				{
					circleID ++;
					circleUnit.push(renderCircleUnit(circleID, ((x + 1) * 100) - 50, ((y + 1) * 100) - 50));
				}
			}

			// Multiple Intersect Logic
			var intersectCircle = function(eventX, eventY)
			{
				for(var c = 0; c < circleUnit.length; c ++)
				{
					if(circleUnit[c].intersect(eventX, eventY)) {return circleUnit[c];}
				}
				return null;
			};

			// Return Circles
			return {unit:circleUnit, intersect:intersectCircle};
		};

		// Background Render
		renderBackground();

		// Circle Render
		authPattern.circle = renderCircle();
	}

	// Build Execution
	build();
}