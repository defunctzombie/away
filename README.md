# away

detect idle users on webpages

[![browser support](http://ci.testling.com/shtylman/away.png)](http://ci.testling.com/shtylman/away)

```js
var away = require('away');

// detect users who are idle for 10 seconds
var timer = away(10000);
timer.on('idle', function() {
    console.log('user is idle');
});
timer.on('active', function() {
    console.log('user is active');
});
```

## api

```away()``` returns a Timer object which exposes the following methods.

### .on('idle', fn)
Call ```fn``` when user becomes idle.

### .on('active', fn)
Call ```fn``` when user becomes active after having been idle.

### .stop()
Stop the idle timer from detecting user activity

### .start()
Start the idle timer. (By default the idle timer is started automatically)

## options

```idle()``` accepts a second argument with additional options.

### element
The dom element to monitor for activity. (default ```document```)

### timeout
Milliseconds before user is considered idle. (default ```30000```)

### events
String of DOM events that will trigger activity. (see index.js for default)

### start
Whether to start idle timer upon creation. (default ```true```)

## install

```
npm isnstall away
```

## credits

Inspired by the [jquery-idletimer](https://github.com/mikesherov/jquery-idletimer) plugin.
