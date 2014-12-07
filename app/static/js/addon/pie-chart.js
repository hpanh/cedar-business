var PieChart = {
	process: function(id, percent, option) {
		var config = {
			background: Grey200,
			foreground: Grey400,
			rOuter: 50,
			rInner: 42,
			duration: 0
		};

		fetch(config, option);

		var background = id.find('.background'),
			foreground = id.find('.foreground'),
			text = id.find('.span');

		if (config.duration > 0) {
			animate(foreground, percent, text, {
				color: config.background, 
				rOuter: config.rOuter, 
				rInner: config.rInner,
				duration: config.duration
			});
		} else {
			draw(background, 100, {
				fill: config.background, 
				rOuter: config.rOuter, 
				rInner: config.rInner
			});

			draw(foreground, percent, {
				fill: config.foreground, 
				rOuter: config.rOuter, 
				rInner: config.rInner
			});
			text.html(Math.ceil(percent) + '%');
		}
	}
}

function animate(id, percent, text, option) {
	var config = {
		backgroud: Grey200,
		foreground: Grey400,
		duration: 5000
	};
	
	fetch(config, option);

	var time = 0;
	var currentPercent;
	var animationTiming = setInterval(function() {
		time = time + 20;
		currentPercent = percent*(1 - (1 - time/config.duration)*(1 - time/config.duration));
		if (time >= config.duration) {
			clearInterval(animationTiming);
			return;
		}
		draw(id, currentPercent, config);
		text.html(Math.ceil(currentPercent) + '%');
	}, 10);
}

function fetch(config, option) {
	if ('undefined' !== typeof option) {
		for(var i in option){
			if('undefined' !== typeof option[i]){
				config[i] = option[i];
			}
		}
	}
}

function draw(id, percent, option) {
	var config = {
		fill: Grey200,
		rOuter: 50,
		rInner: 42,
	};

	fetch(config, option);

	var angle = (percent - 0.001)/100 * Math.PI * 2;
	var xOuter = (1 + Math.sin(angle)) * config.rOuter;
	var yOuter = (1 - Math.cos(angle)) * config.rOuter;

	var xInner = (1 + Math.sin(angle)) * config.rInner + (config.rOuter - config.rInner);
	var yInner = (1 - Math.cos(angle)) * config.rInner + (config.rOuter - config.rInner);

	var largeArcFlag = (percent < 50) ? 0 : 1;

	var pathStr = 'M' + config.rOuter + ',' + (config.rOuter - config.rInner) + ' ' +
				  'L' + config.rOuter + ', 0 ' +
				  'A' + config.rOuter + ' ' + config.rOuter + ' 0 ' + largeArcFlag + ' ,1 ' + xOuter + ', ' + yOuter + 
				  'L' + xInner + ' ' + yInner +
				  'A' + config.rInner + ' ' + config.rInner + ' 0 ' + largeArcFlag + ' ,0 ' + config.rOuter + ',' + (config.rOuter - config.rInner) + 'z';

	id.attr('d', pathStr);
	id.attr('fill', config.fill);
}