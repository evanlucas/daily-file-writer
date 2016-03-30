# daily-file-writer

[![Build Status](https://travis-ci.org/evanlucas/daily-file-writer.svg)](https://travis-ci.org/evanlucas/daily-file-writer)
[![Coverage Status](https://coveralls.io/repos/evanlucas/daily-file-writer/badge.svg?branch=master&service=github)](https://coveralls.io/github/evanlucas/daily-file-writer?branch=master)

Write data to a log file using the date as the filename. Handles date rollover too!

## Install

```bash
$ npm install [--save] daily-file-writer
```

## Test

```bash
$ npm test
```

## Usage

```js
'use strict'

const Writer = require('daily-file-writer')
const writer = new Writer({
  path: '/tmp/logs'
})

writer.write('blah blah')

// the log file will be something like:
// /tmp/logs/2016-01-02.txt

// when a write comes in and the date has changed,
// the previous file will be closed and the data will be written to a new file
// /tmp/logs/2016-01-03.txt
```

## Author

Evan Lucas

## License

MIT (See `LICENSE` for more info)
