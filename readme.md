# UoL CM3050 Mobile Development

This mobile application made using React Native was made for the University of London Mobile Web Development Module, January - March 2022

## Installation

This is an expo application using React Native
All the required libraries have been included in the package.json file and can therefore be install using:

```bash
npm install
```

## Usage

Tthe expo engine can be started with the following commands

```bash
expo start
```

Once the server is started, scan the barcode to load the app on your device.

Tap the "Sign in with Google" button to start (you will not be asked or a username and password)

## Notes to marker

Global Settings for the application can be found in the globalsetting.js file located under the CustomLogic Folder.

```javascript
export const forceDevCreditionals = false
export const force_settings_reload_at_restart = false
```
The following settings will force the development credentials for the application.

There is a flag in the “globalSettings.js” file that forces the system to work without any authentication.
I have activated this on the snack and in my code, please leave it set to true to be able to use the
application.

I have removed some dependencies from the package.json file when deployed to the snack as they
are not relevant and cannot be resolved by expo (jest for example)
As mentioned, my application WILL NOT work on the web version of React Native. Despite some
work to try and get this working which is documented in this report, I didn’t manage to complete this
development.

Feel free to play with it as much as you want, it is using a DEV DB and the data will be wiped. I have
left an “assigned” request in the system so that you can test closing a request, once you have closed
it you will not be able to see any other “assigned request”

Whilst testing I have seen that the Android Appetize sometimes need the application to be reloaded
before it shows (it also reacts a lot slower). I didn’t experience this problem with my iOS Device or the
iOS simulator.

When the application starts tap the “Sign in with Google” button to start (you will not be prompted to type any username or password)


## Authors and acknowledgment

This application was written for the final project of my Mobile Development module for the University of London Computer Science BSc. The module team are to be credited for their teaching to get me to this point.

## License
[MIT](https://choosealicense.com/licenses/mit/)