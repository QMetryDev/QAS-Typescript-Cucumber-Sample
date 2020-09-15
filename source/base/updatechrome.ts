import * as os from 'os';
import * as child from 'child_process';




if (os.type().includes('Windows')) {
	const cmd = 'dir /B/AD "C:\\Program Files (x86)\\Google\\Chrome\\Application\\"|findstr /R /C:"^[0-9].*\..*[0-9]$"';
	child.exec(cmd, function (error, stdout, stderr) {
		const googleChromeVersion = stdout;
		if (error) {
			console.log(error);
		}
		if (stderr) {
			console.log(stderr);
		}
		let folderDir = process.cwd();
		let folderDirArray = folderDir.split('\\');
		const hasWhitespaceRegEx = /\s/;
		folderDirArray.forEach((rec, index) => {
			if (hasWhitespaceRegEx.test(rec)) {
				folderDirArray[index] = '"' + rec + '"';
			}
		});
		folderDir = folderDirArray.join('\\\\');

		let nodeCmd = 'node ' + folderDir + '\\node_modules\\protractor\\bin\\webdriver-manager update --versions.chrome=' + googleChromeVersion;
		child.exec(nodeCmd, function (nodeError, nodeStdout, nodeStderr) {
			console.log(nodeStdout);
			if (nodeError) {
				console.log(nodeError);
			}
			if (stderr) {
				console.log(nodeStderr);
			}
		});
	});
} else if (os.type().includes('Darwin')) {

	const cmd = '/Applications/Google\\ Chrome.app/Contents/MacOS/Google\\ Chrome --version';
	child.exec(cmd, function (error, stdout, stderr) {
		if (error) {
			console.log(error);
		}
		if (stderr) {
			console.log(stderr);
		}
		let googleChromeVersion = stdout;
		googleChromeVersion = googleChromeVersion.replace('Google Chrome ', '');
		let folderDir =  process.cwd();
		let folderDirArray = folderDir.split('/');
		const hasWhitespaceRegEx = /\s/;
		folderDirArray.forEach((rec, index) => {
			if (hasWhitespaceRegEx.test(rec)) {
				folderDirArray[index] = '"' + rec + '"';
			}
		});
		folderDir = folderDirArray.join('/');
		const nodeCmd = 'node ' + folderDir + '/node_modules/protractor/bin/webdriver-manager update --versions.chrome=' + googleChromeVersion;
		child.exec(nodeCmd, function (nodeError, nodeStdout, nodeStderr) {
			console.log(nodeStdout);
			if (nodeError) {
				console.log(nodeError);
			}
			if (stderr) {
				console.log(nodeStderr);
			}
		});
	});
} else if (os.type().includes('Linux')) {

	const cmd = 'google-chrome --version';
	child.exec(cmd, function (error, stdout, stderr) {
		if (error) {
			console.log(error);
		}
		if (stderr) {
			console.log(stderr);
		}
		let googleChromeVersion = stdout;
		googleChromeVersion = googleChromeVersion.replace('Google Chrome ', '');
		let folderDir =  process.cwd();
		let folderDirArray = folderDir.split('/');
		const hasWhitespaceRegEx = /\s/;
		folderDirArray.forEach((rec, index) => {
			if (hasWhitespaceRegEx.test(rec)) {
				folderDirArray[index] = '"' + rec + '"';
			}
		});
		folderDir = folderDirArray.join('/');
		const nodeCmd = 'node ' + folderDir + '/node_modules/protractor/bin/webdriver-manager update --versions.chrome=' + googleChromeVersion;
		child.exec(nodeCmd, function (nodeError, nodeStdout, nodeStderr) {
			console.log(nodeStdout);
			if (nodeError) {
				console.log(nodeError);
			}
			if (stderr) {
				console.log(nodeStderr);
			}
		});
	});
}

