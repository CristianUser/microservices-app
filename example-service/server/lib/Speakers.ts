const fs = require('fs');
const util = require('util');

const readFile = util.promisify(fs.readFile);

class SpeakersService {
  private datafile: string;
  constructor(datafile: string) {
    this.datafile = datafile;
  }

  async getList() {
    const data = await this.getData();
    return data.map((speaker: any) => ({
      name: speaker.name,
      shortname: speaker.shortname,
      title: speaker.title,
      summary: speaker.summary,
    }));
  }
  async getData() {
    const data = await readFile(this.datafile, 'utf8');
    if (!data) return [];
    return JSON.parse(data).speakers;
  }
}

module.exports = SpeakersService;
