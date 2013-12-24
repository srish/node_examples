//Node FS module example 

var fs = require('fs');

fs.readdir(process.cwd(), function(err, files) {
	console.log('');

	if(!files.length) {
		return console.log("No files to show");
	}

	console.log("Which files or directory do you want to see?\n");

	var stats = [];

	function file(i) {
		var filename = files[i];

		fs.stat(__dirname + '/' + filename, function(err, stat) {
			stats[i] = stat;
			if(stat.isDirectory()) {
				console.log(' ' + i + ' ' + filename);
			} else {
				console.log(' ' +i+ ' ' + filename);
			}

			i++;

			if(i == files.length) {
				console.log('');
				process.stdout.write('Enter your choice : ');
				process.stdin.resume();
				process.stdin.setEncoding('utf8');
				process.stdin.on('data', option);
			} else {
				file(i);
			}
		});
	}

	function option(data) {

		var filename = files[Number(data)];

		if(!filename) {
			process.stdout.write('Enter your choice: ?');
		} else {
			process.stdin.pause();

			if(stats[Number(data)].isDirectory()) {
				fs.readdir(__dirname + '/' + filename, function(err, files) {
					files.forEach(function(file) {
						console.log(' - ' + file);
					});
				});
			} else {
				fs.readFile(__dirname + '/' + filename, 'utf8', function(err, data) {
					console.log(data);
				});
			}
		}
	}

	file(0);
});

