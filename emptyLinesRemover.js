/**
 * Emtpy lines remover module.
 * @module emptyLinesRemover
 */

const {	Transform } = require('stream');

/**
 * Class representing a remover empty lines in stream.
 * @extends Transform
 */
class Remover extends Transform {

	/**
	 * Create a remover
	 * @param  {Object} [options] Look at options of Transform constructor in
	 * Node.js documentation.
	 */
	constructor(options = {}) {

		// Union options
		options = Object.assign({}, options, {
			decodeStrings: true,
		});

		super(options);

		//  Carriage return, next line and space characters.
		this._CR = new Buffer('\r')[0];
		this._NL = new Buffer('\n')[0];
		this._SP = new Buffer(' ')[0];
		this._newLine = null; // for current newLine

		// For residue from prev chunk.
		this._residue = null;
	}

	/**
	 * Get the stream and tranformation it. Remove all empty lines or lines
	 * contains only spaces.
	 * @param  {Buffer}   chunk    Current chunk of stream. Will always be a
	 * buffer unless the decodeStrings option was set to false or the stream
	 * is operating in object mode.
	 * @param  {String}   encoding If the chunk is a string, then encoding is
	 * the character encoding of that string. If chunk is a Buffer, or if the
	 * stream is operating in object mode, encoding may be ignored.
	 * @param  {Function} callback Call this function (optionally with an error
	 * argument) when processing is complete for the supplied chunk.
	 */
	_transform(chunk, encoding, callback) {

		// Convert string to buffer.
		if (typeof chunk === 'string') {
			chunk = new Buffer(chunk);
		}

		let start = 0; // start point
		let buffer = chunk;
		let bufferLength = buffer.length;
		let startLine = 0;
		let endLine = 0;
		let out = new Buffer('');

		// Concat new chunk with residue.
		if (this._residue) {
			start = this._residue.length; // start point for new chunk
			buffer = Buffer.concat([this._residue, chunk]);
			this._residue = null;
		}


		for (let i = start; i < bufferLength; i++) {
			let char = buffer[i];
			let nextChar = i + 1 < bufferLength ? buffer[i + 1] : false;

			if (!this.newLine && char === this._NL) {
				this._newLine = this._NL; // Windows and *nix new line
			} else if (!this.newLine && char === this._CR && nextChar !== this._NL){
				this._newLine = this._CR; // Mac new line
			}

			if (char == this._newLine) {
				endLine = i; // position, when end the line

				let currentLine = buffer.slice(startLine, endLine + 1);

				// Goto check line
				let status = this._isEmptyLine(currentLine);
				if (!status) {

					if (out != null) {

						// Get length of current line and out.
						let totalLength = out.length + currentLine.length;

						// Concat out with current line.
						out = Buffer.concat([out, currentLine], totalLength);
					} else {
						out = currentLine;
					}
				}

				// Reinit start line.
				startLine = i + 1;
			}
		}

		// Save residue.
		this._residue = buffer.slice(endLine);

		this.push(out);
		callback();
	}

	/**
	 * The function searches the string for characters other than spaces.
	 * If it finds, then the string is not considered empty.
	 * @param  {Buffer}  buffer Line in buffer
	 * @return {Boolean}        True if only spaces, and false if it contains
	 * other characters.
	 */
	_isEmptyLine(buffer) {

		// Just in case convert to buffer not buffer.
		if (!Buffer.isBuffer(buffer)) {
			buffer = new Buffer(buffer);
		}

		// Remove next line at end of buffer.
		let end = buffer.length - 1;

		// Check contains line characters.
		for (let i = 0; i < end; i++) {

			// Second condition for Windows new line
			if (buffer[i] != this._SP && buffer[i] != this._CR) {

				// Line have one or more characters.
				return false;
			}
		}

		// Only spaces or empty.
		return true;
	}

	/**
	 * This method only for test private method _isEmptyLine.
	 * @param  {Buffer} buffer Line in buffer.
	 * @return {Boolean}       True if only spaces, and false if it contains.
	 */
	forTestIsEmptyLine(buffer) {
		return this._isEmptyLine(buffer);
	}
}

/**
 * Get stream and transform it. Remove empty lines.
 * @type {Class}
 */
module.exports = Remover;
