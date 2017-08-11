#!/usr/bin/env node

const slack = require('slack');
const _ = require('underscore');
const moment = require('moment');
const chalk = require('chalk');
const program = require('commander');

// Color output
const error = chalk.bold.red;
const ok = chalk.green;
const nothing = chalk.yellow;

// Get current unix time
const now = moment().unix();

// Slack API extra params
const exclude_members = true;
const exclude_archived = true;
const count = 1;

// Init some arrays
let oneOrLess = [];
let inactive = [];
let archive = [];

// Split the string
function list(val) {
  return val.split(',');
}

program
  .version('0.2.3')
  .option('-t, --token <string>', 'Slack API bot token. You should probably use ARCHIVEBOT_SLACK_TOKEN as an ENV VAR.')
  .option('-d, --days [n]', 'Number of days of inactivity. Default: 30', parseInt)
  .option('-m, --members [n]', 'Maximum number of members in the channel. Default: 1', parseInt)
  .option('-n, --never-archive [list]', 'List of channels to never archive.', list)
  .parse(process.argv);

// Sane defaults
const token = program.token || process.env.ARCHIVEBOT_SLACK_TOKEN;
const memeberCount = program.members || process.env.ARCHIVEBOT_MEMBERS || 1;
const neverArchive = program['never-archive'] || process.env.ARCHIVEBOT_NEVER_ARCHIVE || [];
const inactiveDays = program.days || process.env.ARCHIVEBOT_DAYS || 30;

// Check the token is available
if (!token) {
  console.error((error('You must provide a Slack app token. This can be done on the command line with -t, --token or set the ARCHIVEBOT_SLACK_TOKEN environment variable')));
}

function archiveChannel() {
  if (_.size(archive) > 0) {
    _.each(archive, (v) => {
      const channel = v.id;
      slack.channels.archive({ token, channel }, (err) => {
        if (err) {
          console.error((error(`Error archiving channel ${v.name} with error: ${err}`)));
        }
        console.log((ok(`Channel ${v.name} has been archived. \n`)));
      });
    });
  } else {
    console.log((nothing('No channels met the archive criteria. \n')));
  }
}

function filterChannels() {
  archive = _.filter(oneOrLess.concat(inactive), (v) => {
    if (!_.contains(neverArchive, v.name)) {
      return v;
    }
  });
  archiveChannel();
}

function getHistory(channels) {
  inactive = _.filter(channels, (v) => {
    const channel = v.id;
    slack.channels.history({ token, channel, count }, (err, data) => {
      if (err) {
        console.error((error(`Error fetching channel ${v.name} with error: ${err}`)));
      }
      if (moment.duration(now - data.messages[0].ts, 's').asDays() > inactiveDays) {
        return v;
      }
    });
  });
  filterChannels();
}

slack.channels.list({ token, exclude_archived, exclude_members }, (err, data) => {
  if (err) {
    console.error((error(`Error fetching channel list with error: ${err}`)));
  }
  oneOrLess = _.filter(data.channels, (v) => {
    if (v.num_members <= memeberCount) {
      return v;
    } else if (v.is_archived !== false) {
      return v;
    }
  });
  getHistory(data.channels);
});
