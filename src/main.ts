import * as fs from 'fs';
import * as path from 'path';

import yargs = require('yargs');
import * as gm from 'gm';
const im = gm.subClass({ imageMagick: true });
// import sharp from 'sharp';

const argv = yargs.options({
  f: { type: 'string', demand: true }
}).argv;

async function gmStreamResize(readStream: NodeJS.ReadableStream, writeStream: fs.WriteStream) {
  return await new Promise((resolve) => {
    const gmStream = im(readStream);

    writeStream.on('finish', () => {
      resolve(gmStream)
    });

    gmStream.resize(256, 256).stream().pipe(writeStream);
  })
}

async function gmFilepathResize(originPath: string, thumbNailPath: string) {
  return await new Promise((resolve) => {
    im(originPath).resize(256, 256).write(thumbNailPath, (err) => {
      if (!err) { resolve(); }
    })
  });
}

export async function resize() {

  const input = argv.f;
  const parsedInput = path.parse(argv.f);

  const originPath = input;
  const originStream = fs.createReadStream(input);

  const resizedPath = path.join(parsedInput.dir, `${parsedInput.name}_path_256${parsedInput.ext}`);
  const resizedStream = fs.createWriteStream(path.join(parsedInput.dir, `${parsedInput.name}_stream_256${parsedInput.ext}`));

  const promises = [];

  promises.push(
    gmStreamResize(originStream, resizedStream)
  )
  promises.push(
    gmFilepathResize(originPath, resizedPath)
  )

  Promise.all(promises)
    .then(() => {
      console.log('Resize done!');
    }).catch((err) => {
      console.error(err);
    })
}

resize();
