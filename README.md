Slack archivebot
================

## Install

This project is setup to use Yarn but NPM also works.
yarn:
```
yarn global add git@bitbucket.org:wearefine/slack-archivebot.git
```
npm:
```
npm install -g git@bitbucket.org:wearefine/slack-archivebot.git
```

## Usage

```
Usage: index [options]

  Options:

    -V, --version               output the version number
    -t, --token <string>        Slack API bot token.
    -d, --days [n]              Number of days of inactivity. Default: 30
    -m, --memebers [n]          Maximum number of members in the channnel. Default: 1
    -n, --never-archive [list]  List of channnels to never archive.
    -h, --help                  output usage information
```
You can provide the values as arguments or env vars (listed below). The cli arguments take precedence. It is highly recommended that you put the token into an environment variable. It is setup to run anytime with a recommended run of once a day or more. 

*_NOTE:_* Don't run more than once every hour to avoid rate limits. 

## Environment Variables
ARCHIVEBOT_SLACK_TOKEN=The super secret bot [OAuth token](https://api.slack.com/apps)

ARCHIVEBOT_MEMBERS=The minimum number of members a channel can have to archive

ARCHIVEBOT_DAYS=The number of days of inactivity

ARCHIVEBOT_NEVER_ARCHIVE=Comma delimited list of channels to never archive
