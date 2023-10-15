const { createLogger, transports, format } = require("winston");
const { format: dateFnsFormat } = require("date-fns");

const logger = createLogger({
	level: "debug",
	format: format.combine(
		format.json(),
		format.printf((info) => {
			if (info.message instanceof Object) {
				console.log("OOOUUUIII");
				info.message = JSON.stringify(info.message, null, 2);
			}
			return `${info.timestamp} ${info.level}: ${info.message}`;
		})
	),
	transports: [
		//new transports:
		new transports.File({
			filename: getLogFileName(),
		}),
	],
});

function getLogFileName() {
	const currentDate = new Date();
	const formattedDate = dateFnsFormat(currentDate, "yyyy-MM-dd");
	return `logs/${formattedDate}.log`;
}

module.exports = logger;
