# slack-tail
Tail all slack channel log

# Prepare

Install dependencies

```
npm install
```

Get slack token by below url

* https://api.slack.com/custom-integrations/legacy-tokens

Export env

```
export SLACK_API_TOKEN=<TOKEN>
```

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
