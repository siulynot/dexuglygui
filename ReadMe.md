# DEX Ugly GUI

Before starting make sure you have `iguana` daemon compiled and running on your machine.

You can find instructions to install `iguana` here:

https://github.com/SuperNETorg/komodo/wiki/Setting-up-Liquidity-Provider-(LP)-Node#installing-liquidity-provider-lp-node-on-ubuntudebian-system

Just follow the above guide ONLY to the point it starts `iguana`.

Once running, follow these steps:
```shell
git clone https://github.com/SuperNETorg/dexuglygui.git
```

Or click on this link to download a copy of this repo as a zip file:

https://github.com/SuperNETorg/dexuglygui/archive/master.zip

It will download "dexuglygui". Open "dexuglygui", and from there open "index.html" file in your web browser.



## Quick Explanation of Steps:

### Step 01

- Activate Bitcoin
- Activate Komodo.

Then check if both BTC and KMD are showing under 'basilisk' in JSON output like following:

```JSON
{
  "native": [],
  "basilisk": [
    "BTC",
    "KMD"
  ],
  "full": [],
  "tag": "18225885340050776559"
}
```

### Step 02

It includes instructions to get Blocktrail API key which you'll need to intput there and then acitvate it. Here are those instructions again:

- You need Blocktrail.com API. Please sign-up by going to [this link](https://www.blocktrail.com/dev/signup).
- After login in your account go to **Settings**, then go to **API Keys** tab there and get new keys from there.
- Make sure to save the newly generated `API Key` and `API Secret`. You'll only see this `API Secret` first time and never again.

- Input this Blocktrail API Key in Step 02, and press _Activate Blocktrail API_ button.
- Then click _I'm not LP' button.


### Step 03