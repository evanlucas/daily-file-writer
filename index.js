'use strict'

const fs = require('fs')
const path = require('path')
const mkdirp = require('mkdirp')

module.exports = class Logger {
  constructor(opts) {
    this.base = opts.path
    this.fp = this.getFilePath()
    this.stream = null
    this._buffer = []
    this.isRenaming = false
  }

  open(cb) {
    mkdirp(path.dirname(this.fp), (err) => {
      if (err) return cb && cb(err)
      const fp = this.fp
      this.stream = fs.createWriteStream(fp, {
        flags: 'a'
      })

      if (this._buffer.length) {
        let item
        while (item = this._buffer.shift()) {
          this.stream.write(item + '\n')
        }
      }
      cb && cb()
    })
  }

  getFilePath() {
    const d = new Date()
    const year = d.getFullYear()
    const month = pad(d.getMonth() + 1)
    const date = pad(d.getDate())
    const filename = `${year}-${month}-${date}.txt`
    return path.join(this.base, filename)
  }

  write(data) {
    if (this.isRenaming || !this.stream) {
      this._buffer.push(data)
      return
    }

    const fp = this.getFilePath()
    if (fp === this.fp) {
      this.stream.write(data + '\n')
    } else {
      this._buffer.push(data)
      this.isRenaming = true
      this.close(() => {
        this.fp = fp
        this.open(() => {
          this.isRenaming = false
        })
      })
    }
  }

  close(cb) {
    if (!this.stream) {
      return setImmediate(() => {
        cb && cb()
      })
    }

    this.stream.end(cb)
  }
}

function pad(n) {
  if (n < 10) return `0${n}`
  return `${n}`
}
