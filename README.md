Slack archive bot
================

## Summary

This is a Nodejs cli to archive Slack channels that meet certain criteria.

## Install

This project is setup to use Yarn but NPM also works.

yarn:
```
yarn global add slack-archivebot@bitbucket.org:wearefine/slack-archivebot.git#<latest realease>
```
npm:
```
npm install -g slack-archivebot@bitbucket.org:wearefine/slack-archivebot.git#<latest realease>
```

## Usage

```
Usage: slack-archivebot [options]

  Options:

    -V, --version               output the version number
    -t, --token <string>        Slack API bot token. You should probably use ARCHIVEBOT_SLACK_TOKEN as an ENV VAR.
    -d, --days [n]              Number of days of inactivity. Default: 30
    -m, --members [n]          Maximum number of members in the channel. Default: 1
    -n, --never-archive [list]  List of channels to never archive.
    -h, --help                  output usage information
```
You can provide the values as arguments or env vars (listed below). The cli arguments take precedence. It is highly recommended that you put the token into an environment variable. It is setup to run anytime with a recommended run of once a day or less. 

## Environment Variables
ARCHIVEBOT_SLACK_TOKEN=The super secret bot [OAuth token](https://api.slack.com/apps)

ARCHIVEBOT_MEMBERS=The minimum number of members a channel can have to archive

ARCHIVEBOT_DAYS=The number of days of inactivity

ARCHIVEBOT_NEVER_ARCHIVE=Comma delimited list of channels to never archive

## Rate limits

Due to Slack's strict rate limit and given that a several requests need to be made per channel. The script will run each request at a rate of 1 req/2s. This will help avoid the rate limit that Slack imposes of roughly 1 req/s. Don’t run the cli more than once every hour to avoid rate limits.
