import colors from './colors.js';

function choose(arr) {
	return arr[Math.floor(Math.random() * arr.length)];
}

export default function generateSample() {
	const background = choose(colors);

	let foreground;
	do {
		foreground = choose(colors);
	} while (background === foreground);

	const shape = Math.random() > 0.5 ? 'circle' : 'rect';

	const useCircle = shape === 'circle';

	const randomFrequency = Math.floor(Math.random() * 8 + 6);

	////-------|---------|---------|---------|---------|---------|---------|---------|
	const code = `
		ctx.fillStyle = '${background}';
		ctx.fillRect(0, 0, width, height);

		ctx.fillStyle = '${foreground}';
		const size = width / 4 + audioData[${randomFrequency}] / 255 * width / 4;

		ctx.translate(width / 2, height / 2);
		ctx.beginPath();

		${
			useCircle
				? 'ctx.ellipse(0, 0, size * 0.5, size * 0.5, 0, 0, Math.PI * 2)'
				: 'ctx.rect(-size / 2, -size / 2, size, size)'
		};

		ctx.fill();
	`
		.split(/\n/)
		.map((l) => l.trim())
		.join('\n')
		.trim();

	const title = `${foreground} ${shape}`;

	return {
		code,
		title,
		createdAt: Date.now(),
	};
}
