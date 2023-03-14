const fs = require('fs-extra');
const path = require('path');
const archiver = require('archiver');

/**
 * Hard coded sample for now.
 * 
 * @returns object
 */
const loadConfig = async () => {
  try {
    const json = await fs.readJSON(path.resolve(__dirname, '..', 'config.json'));
    return json;
  }
  catch {
    return false;
  }
};

const copyProject = async (src, dest) => {
  await fs.copy(src, dest);
};

const createFolder = async (dest) => {
  await fs.mkdirp(dest);
}

const loadJson = async (file) => {
  return await fs.readJSON(file);
};

const writeJson = async (file, content) => {
  await fs.writeJSON(file, content, {
    spaces: 4,
  });
};

const cleanup = async () => {
  await fs.emptyDir('vendor');
};

const archive = (dest) => {
  return new Promise((resolve, reject) => {
    const output = fs.createWriteStream(path.resolve(__dirname, '../', `output/${dest}.zip`));
    const archive = archiver('zip', {
      zlib: { level: 9 } // Sets the compression level.
    });

    output.on('open', () => {
      archive.pipe(output);

      archive
        .directory(path.resolve(__dirname, '../build'), dest)
        .finalize();
    });

    archive.on('error', (err) => reject(err));
    output.on('close', () => resolve());
  });
};


module.exports = {
  loadConfig,
  copyProject,
  loadJson,
  writeJson,
  createFolder,
  cleanup,
  archive,
};