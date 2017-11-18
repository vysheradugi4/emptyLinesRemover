# emptyLinesRemover

Streaming Empty Lines Remover that aims for high speed of remove as well as
compatibility with the all streaming modules in Node.js.
```
npm install emptyLinesRemover
```

`emptyLinesRemover` can transform javascript streams (work with buffer)
and if data is strings (utf8) will be remove all empty lines. Support text,
csv and other formats, created in Linux, Window and Mac systemes.

## Usage

Simply instantiate `txt` and pump a text file to it and get the new file without
unnecessary empty lines.

Let's say that you have a text file ``file1.txt`` like this:

```
London is a capital

of Great Britain
```

You can parse it like this:

``` js
var csv = require('csv-parser')
var fs = require('fs')

fs.createReadStream('some-csv-file.csv')
  .pipe(csv())
  .on('data', function (data) {
    console.log('Name: %s Age: %s', data.NAME, data.AGE)
  })
```

The data emitted is a normalized JSON object. Each header is used as the property name of the object.

The csv constructor accepts the following options as well

``` js
var stream = csv({
  raw: false,     // do not decode to utf-8 strings
  separator: ',', // specify optional cell separator
  quote: '"',     // specify optional quote character
  escape: '"',    // specify optional escape character (defaults to quote value)
  newline: '\n',  // specify a newline character
  strict: true    // require column length match headers length
})
```
It accepts too an array, that specifies the headers for the object returned:

``` js
var stream = csv(['index', 'message'])

// Source from somewere with format 12312,Hello World
origin.pipe(stream)
  .on('data', function (data) {
    console.log(data) // Should output { "index": 12312, "message": "Hello World" }
  })
```

or in the option object as well

``` js
var stream = csv({
  raw: false,     // do not decode to utf-8 strings
  separator: ',', // specify optional cell separator
  quote: '"',     // specify optional quote character
  escape: '"',    // specify optional escape character (defaults to quote value)
  newline: '\n',  // specify a newline character
  headers: ['index', 'message'] // Specifing the headers
})
```

If you do not specify the headers, csv-parser will take the first line of the csv and treat it like the headers.

Another issue might be the encoding of the source file. Transcoding the source stream can be done neatly with something like [`iconv-lite`](https://www.npmjs.com/package/iconv-lite), Node bindings to [`iconv`](https://www.npmjs.com/package/iconv) or native [`iconv`](http://man7.org/linux/man-pages/man1/iconv.1.html) if part of a pipeline.

## Events

The following events are emitted during parsing.

### data

For each row parsed (except the header), this event is emitted. This is already discussed above.

### headers

After the header row is parsed this event is emitted. An array of header names is supplied as the payload.

```
fs.createReadStream('some-csv-file.csv')
  .pipe(csv())
  .on('headers', function (headerList) {
    console.log('First header: %s', headerList[0])
  })
```

### Other Readable Stream Events
The usual [Readable stream](https://nodejs.org/api/stream.html#stream_class_stream_readable) events are also emitted. Use the ``close`` event to detect the end of parsing.

```
fs.createReadStream('some-csv-file.csv')
  .pipe(csv())
  .on('data', function (data) {
    // Process row
  })
  .on('end', function () {
    // We are done
})
```

## Command line tool

There is also a command line tool available. It will convert csv to line delimited JSON.

```
npm install -g csv-parser
```

Open a shell and run

```
$ csv-parser --help # prints all options
$ printf "a,b\nc,d\n" | csv-parser # parses input
```

### Options

You can specify these CLI flags to control how the input is parsed:

```
Usage: csv-parser [filename?] [options]

  --headers,-h        Explicitly specify csv headers as a comma separated list
  --output,-o         Set output file. Defaults to stdout
  --separator,-s      Set the separator character ("," by default)
  --quote,-q          Set the quote character ('"' by default)
  --escape,-e         Set the escape character (defaults to quote value)
  --strict            Require column length match headers length
  --version,-v        Print out the installed version
  --help              Show this help
```

For example, to parse a TSV file:

```
cat data.tsv | csv-parser -s $'\t'
```

## Related

- [neat-csv](https://github.com/sindresorhus/neat-csv) - Promise convenience wrapper

## License

MIT
