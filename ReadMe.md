# BarterDEX-Simple App

Before starting make sure you have `marketmaker` daemon compiled and running on your machine.

You can find instructions to install `marketmaker` here:

https://github.com/SuperNETorg/komodo/wiki/Setting-up-Liquidity-Provider-(LP)-Node#installing-liquidity-provider-lp-node-on-ubuntudebian-system

### Setup
Once running, follow these steps:
```shell
git clone https://github.com/SuperNETorg/BarterDEX-Simple.git
cd BarterDEX-Simple
git checkout v0.6
npm install
npm start
```

It will download "BarterDEX-Simple". Open "BarterDEX-Simple", and from there open "index.html" file in your web browser.

### Update
To update, follow these steps:
```shell
cd BarterDEX-Simple
git checkout v0.6
git pull
```

#### For end users

To build the production ready app, install `electron-packager` and `electron-prebuilt` packages from npm
```shell
sudo npm install electron-packager -g
sudo npm install electron-prebuilt -g
```

#### **Build the App**
Refer to the original [electron-packager](https://github.com/electron-userland/electron-packager) repository for more detailed information.

##### Linux
Change directory to BarterDEX-Simple and execute the following command to build the Linux app
```shell
cd BarterDEX-Simple
electron-packager . --platform=linux --arch=x64 --icon=assets/icons/barterdex/128x128.png --out=build/ --buildVersion=VERSION_NUMBER_HERE --ignore=assets/bin/win64 --ignore=assets/bin/osx --overwrite
```
change architecture build parameter to ```--arch=x32``` for 32 bit build

##### OSX
Change directory to BarterDEX-Simple and execute the following command to build the OSX app
```shell
cd BarterDEX-Simple
electron-packager . --platform=darwin --arch=x64 --icon=assets/icons/barterdex/barterdex.icns --out=build/ --buildVersion=VERSION_NUMBER_HERE --ignore=assets/bin/win64 --ignore=assets/bin/linux64 --overwrite
```

##### Windows
Change directory to iguana and execute the following command to build the Windows app
```shell
dir iguana
electron-packager . --platform=win32 --arch=x64 --icon=assets/icons/barterdex/barterdex.ico --out=build/ --buildVersion=VERSION_NUMBER_HERE --ignore=assets/bin/osx --ignore=assets/bin/linux64 --overwrite

# If generating 32bit desktop package
electron-packager . --platform=win32 --arch=ia32 --icon=assets/icons/barterdex/barterdex.ico --out=build/ --buildVersion=VERSION_NUMBER_HERE --ignore=assets/bin/osx --ignore=assets/bin/linux64 --overwrite

# To build both x64 and x86 desktop package
electron-packager . --platform=win32 --arch=all --icon=assets/icons/barterdex/barterdex.ico --out=build/ --buildVersion=VERSION_NUMBER_HERE --ignore=assets/bin/osx --ignore=assets/bin/linux64 --overwrite
```
change architecture build parameter to ```--arch=x64``` for 64 bit build
