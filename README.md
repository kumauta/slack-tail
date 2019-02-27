# slack-tail
Tail all slack channel log

# Prepare

Install dependencies

```
npm install
```

# Environment Variable

|Environment Variable|Required/Optional|Description|
|:---:|:---:|:---|
|SLACK_API_TOKEN|Required|Get slack token by [Legacy tokens](https://api.slack.com/custom-integrations/legacy-tokens).|
|CHANNEL_KEYWORDS|Optional|Keywords used for patrial match condition. All messages are output if no keyword is specified.<br>Multiple keywords can be specified with a comma separated value.<br>(ex. foo,bar,baz )|
|TARAGET_CHANNEL|Optional|Channel Name which gathering all public channel log|
|MESSAGE_ONLY|Optional|If set `true`. Output message only |

# Run

```
node slack-tail.js
```

# Sample

```
[kumauta/slack-tail]$ node slack-tail.js
Connected to nogami as kumauta
06/03 01:48:15 - #kumauta-private  @kumauta         : hoge
                                                      fuga
                                                      @kumauta
06/03 01:48:26 - @kumauta          @kumauta         : this is DM
```
