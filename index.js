#!/usr/bin/env node

const slack = require('slack');
const _ = require('underscore');
const moment = require('moment');
const chalk = require('chalk');
const program = require('commander');
const elegantStatus = require('elegant-status');

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
let archivedChannelNames = [];

// Split the string
function list(val) {
  return val.split(',');
}

program
  .version('0.3.0')
  .option('-t, --token <string>', 'Slack API bot token. You should probably use ARCHIVEBOT_SLACK_TOKEN as an ENV VAR.')
  .option('-d, --days [n]', 'Number of days of inactivity. Default: 30', parseInt)
  .option('-m, --members [n]', 'Maximum number of members in the channel. Default: 1', parseInt)
  .option('-n, --never-archive [list]', 'List of channels to never archive.', list)
  .option('-b, --basic', 'Only prints basic log messages. For use the cron or ci systems.')
  .parse(process.argv);

// Sane defaults
const token = program.token || process.env.ARCHIVEBOT_SLACK_TOKEN;
const memeberCount = program.members || process.env.ARCHIVEBOT_MEMBERS || 1;
const neverArchive = program['never-archive'] || process.env.ARCHIVEBOT_NEVER_ARCHIVE || [];
const inactiveDays = program.days || process.env.ARCHIVEBOT_DAYS || 30;
const basic = program.basic || process.env.ARCHIVEBOT_BASIC || false;

// Check the token is available
if (!token) {
  console.error((error('You must provide a Slack app token. This can be done on the command line with -t, --token or set the ARCHIVEBOT_SLACK_TOKEN environment variable')));
}

function logChannels () {
  _.each(archivedChannelNames, (v) => {
    console.log((ok(`Channel ${v} has been archived. \n`)));
  })
}

function archiveChannel() {
  const done
  if (!basic) {
    done = elegantStatus(`Archiving channels -- ${archive.length}`);
  }
  if (_.size(archive) > 0) {
    let archiveIndex = -1;
    let timeout = setInterval(function () {
      ++archiveIndex
      if (archiveIndex === archive.length) {
        if (!basic) {
          done(true);
        }
        clearInterval(timeout);
      } else {
        done.updateText(`Archiving channels -- ${archiveIndex+1}/${archive.length}`)
        console.log(archive[archiveIndex].id);
        let channel = archive[archiveIndex].id
        slack.channels.archive({ token, channel }, (err) => {
          if (err) {
            if (!basic) {
              done.updateText(error(`Error archiving channel ${channel.name} with error: ${err}`));
              done(false);
            } else {
              console.error(error(`Error archiving channel ${channel.name} with error: ${err}`));
            }
          }
          archivedChannelNames.push(archive[archiveIndex].name)
        });
      }
    }, 2000)
    logChannels();
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
  const done
  if (!basic) {
    done = elegantStatus(`Fetching channel history -- ${channels.length}`);
  }
  let channelIndex = -1;
  let timeout = setInterval(function () {
    ++channelIndex
    if (channelIndex === channels.length) {
      if (!basic) {
        done(true);
      }
      filterChannels();
      clearInterval(timeout)
    } else {
      done.updateText(`Fetching channel history -- ${channelIndex+1}/${channels.length}`)
      let channel = channels[channelIndex].id
      slack.channels.history({ token, channel, count }, (err, data) => {
        if (err) {
          if (!basic) {
            done.updateText(error(`Error fetching channel ${channel.name} with error: ${err}`));
            done(false);
          } else {
            console.log(error(`Error fetching channel ${channel.name} with error: ${err}`));
          }
        }
        if (moment.duration(now - data.messages[0].ts, 's').asDays() > inactiveDays) {
          data.id = channels[channelIndex].id
          data.name = channels[channelIndex].name
          inactive.push(data)
        }
      })
    }
  }, 2000);
}

slack.channels.list({ token, exclude_archived, exclude_members }, (err, data) => {
  const done
  if (!basic) {
    done = elegantStatus('Fetching Slack channels');
  }
  if (err) {
    if (!basic) {
      done.updateText(error(`Error fetching channel list with error: ${err}`));
      done(false)
    } else {
      console.error(error(`Error fetching channel list with error: ${err}`));
    }
  }
  oneOrLess = _.filter(data.channels, (v) => {
    if (v.num_members <= memeberCount) {
      return v;
    } else if (v.is_archived !== false) {
      return v;
    }
  });
  if (!basic) {
    done(true)
  }
  getHistory(data.channels);
});
