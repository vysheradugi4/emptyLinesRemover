# emptyLinesRemover

Streaming Empty Lines Remover that aims for high speed of remove as well as
compatibility with the all streaming modules in Node.js.
```
npm install emptyLinesRemover
```

`emptyLinesRemover` can transform javascript streams (work with buffer)
and if data is strings (text, csv or other) (utf8) will be remove all empty
lines or empty lines contains spaces. Support text, csv and other formats,
created in Linux, Window and Mac systemes.


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
var EmptyLinesRemover = require('emptyLinesRemover');
var fs = require('fs');

fs.createReadStream('file1.txt')
  .pipe(new EmptyLinesRemover())
  .pipe(fs.createWriteStream('file2.txt'));
```

In file2.txt you have this content without empty lines:

```
London is a capital
of Great Britain
```

The emptyLinesRemover constructor accepts the following options as well, but
all options resends to the constructor stream.Transform (Look at Node.js
documentation).

``` options <Object>

highWaterMark <number> Buffer level when stream.write() starts returning false.
Defaults to 16384 (16kb), or 16 for objectMode streams.

decodeStrings <boolean> Whether or not to decode strings into Buffers before
passing them to stream._write(). Defaults to true

objectMode <boolean> Whether or not the stream.write(anyObj) is a valid
operation. When set, it becomes possible to write JavaScript values other than
string, Buffer or Uint8Array if supported by the stream implementation.
Defaults to false

write <Function> Implementation for the stream._write() method.

writev <Function> Implementation for the stream._writev() method.

destroy <Function> Implementation for the stream._destroy() method.

final <Function> Implementation for the stream._final() method.
```

## License

MIT
