'use strict'

const test = require('tap').test
const Logger = require('../')
const path = require('path')
const fixtures = path.join(__dirname, 'fixtures')
const fs = require('fs')

test('Logger', (t) => {
  t.throws(() => {
    new Logger()
  }, /options must contain a path/)

  const l = new Logger({
    path: fixtures
  })

  l.write('line1')

  t.equal(l._buffer.length, 1, 'line1 gets buffered')

  l.open((err) => {
    t.error(err, 'err should not exist')
    t.equal(l._buffer.length, 0, 'buffer got cleared')
    l.write('line2')
    const fp1 = l.fp
    const orig = l.getFilePath
    l.getFilePath = function() {
      l.getFilePath = orig
      return path.join(fixtures, 'BLAH.txt')
    }

    l.stream.on('close', () => {
      t.pass('original stream closed')
    })

    l.write('line3')
    l.write('line4')
    setTimeout(() => {
      l.close(() => {
        process.nextTick(() => {
          t.equal(read(fp1), 'line1\nline2', 'first file is correct')
          t.equal(read(l.fp), 'line3\nline4', 'second file is correct')
          t.end()
        })
      })
    }, 1000)
  })
})

test('cleanup', (t) => {
  fs.readdirSync(fixtures).forEach((item) => {
    if (path.extname(item) === '.txt') {
      fs.unlinkSync(path.join(fixtures, item))
    }
  })

  t.end()
})

function read(fp) {
  return fs.readFileSync(fp, 'utf8').trim()
}
