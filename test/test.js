const assert = require('assert');
const chai = require('chai');
const expect = chai.expect;
const EmptyLinesRemover = require('../emptyLinesRemover');

describe('emptyLinesRemover testing', function() {

    describe('Main test', () => {
        it('should write string to file without empty lines.', (done) => {

            const fs = require('fs');

            let standart = `London is a capital\nof Great Britain.\n`;

            fs.createReadStream('./test/file1.txt')
                .pipe(new EmptyLinesRemover())
                .pipe(fs.createWriteStream('./test/file2.txt'));

            fs.readFile('./test/file2.txt', 'utf8',(err, data) => {
                try {
                    expect(data).to.equal(standart);
                    done();
                } catch(err) {
                    done(err);
                }
            });
        });
    });
    describe('_isEmptyLine', () => {
        it('should return false for not empty string.', () => {

            const str = 'London';
            const elr = new EmptyLinesRemover();

            let status = elr.forTestIsEmptyLine(str);
            expect(status).to.be.false;
        });

        it('should return true for empty string.', () => {

            const str = '';
            const elr = new EmptyLinesRemover();

            let status = elr.forTestIsEmptyLine(str);
            expect(status).to.be.true;
        });

        it('should return true for string with only spaces.', () => {

            const str = '            ';
            const elr = new EmptyLinesRemover();

            let status = elr.forTestIsEmptyLine(str);
            expect(status).to.be.true;
        });
    });
});
