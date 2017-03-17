# turbo-enigma
Rolling bot updates. Always stay ahead of npm!

## How it works

For each repository on disk, it will do a git pull. If it finds updates, it will restart all the bots. It then exits. Run this from cron, not pm2.


## Config format

```
{
    "repositories": [
        {
            "folder": "/path/to/clone",
            "bots": {
                "botName",
                "botName"
            }
        },
        {
            "folder": "/path/to/clone",
            "bots": {
                "botName"
            }
        }
    ]
}
```