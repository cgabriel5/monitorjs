# monitor (monitorjs)

Small library that monitors an object.

##### Table of Contents

- [Project Setup](#project-setup)
- [What It Does](#what-it-does)
- [Add To Project](#add-to-project)
- [API](#api)
    - [Instance](#instance-api)
- [Usage](#usage)
    - [Examples](#usage-examples)
- [Contributing](#contributing)
- [TODO](#todo)
- [License](#license)

<a name="project-setup"></a>
### Project Setup

Project uses [this](https://github.com/cgabriel5/snippets/tree/master/boilerplate/application) boilerplate. Its [README.md](https://github.com/cgabriel5/snippets/blob/master/boilerplate/application/README.md#-read-before-use) contains instructions for `Yarn` and `Gulp`.

<a name="what-it-does"></a>
### What It Does

- Monitors an object for changes. (additions, updates, triggers, deletions)
- Said changes can then be acted upon via path listeners, a `controller`, or both.

<a name="add-to-project"></a>
### Add To Project

**Note**: The library, both minimized and unminimized, is located in `lib/`.

```html
<script src="path/to/lib.js"></script>
<script>
document.onreadystatechange = function() {
    "use strict";
    // once all resources have loaded
    if (document.readyState == "complete") {
        // get the library
        var Monitor = window.app.libs.Monitor;
        // logic...
    }
});
</script>
```

<a name="api"></a>
## API

<a name="instance-api"></a>
### API &mdash; Instance

<a name="instance-methods-toc"></a>

- [Instance](#instance-creation)
    - [Controller](#instance-controller)
    - [Path Listeners](#path-listener)
    - [Conditions](#conditions-object)
    - [➜ instance.get()](#instance-methods-get)
    - [➜ instance.set()](#instance-methods-set)
    - [➜ instance.unset()](#instance-methods-unset)
    - [➜ instance.trigger()](#instance-methods-trigger)
    - [➜ instance.on()](#instance-methods-on)
    - [➜ instance.off()](#instance-methods-off)
    - [➜ instance.clearCache()](#instance-methods-clearcache)

<a name="instance-creation"></a>
### Instance Creation

- `controller` (`Function`, _Optional_)
    - Main function to handle all object changes.
    - Parameters:
        - `path`: The path the change occurred on.
        - `type`: The type of change (`add`, `delete`, `update`, `trigger`).
        - `newValue`: The changes new value.
        - `oldValue`: The changes old value.
        - `time`: A timestamp of when the change occurred.
        - `conditions`: The conditions object.
- `obj`        (`Function`, _Required_)
    - The object to monitor for changes.
- **Returns** instance.

**Note**: Using the `new` keyword is not necessary. The library will make sure to use it for when when you don't. 

```js
// this...
var monitor = new Monitor(controller, obj);
// is the same as this
var monitor = Monitor(controller, obj);
```

**Note**: A controller is not necessary. Using path listeners via the `instance.on` method is perfectly fine.

```js
// this...
var monitor = new Monitor(null, obj);
// is the same as this
var monitor = Monitor(null, obj);
```

<a name="instance-controller"></a>
### Controller

A `controller` is the brain of the monitor and is simply a handler that fires every time a change is made via the instance's `set`, `unset`, and/or `trigger` method. It is *optional* but when it's provided _all_ changes performed on the monitor can be acted upon from within it. When a `controller` is not used changes can be listened to by attaching path listeners via the `instance.on` method. Both `controllers` and path listeners can be used if so desired.

**Note**: `controller` parameters can be found [here](#instance-creation).

```js
// controller function to handle object changes
var controller = function(path, type, newValue, oldValue, time, conditions) {
    // logic...
};
```

<a name="path-listener"></a>
### Path Listener(s)

Listening to a specific path can be done via the `instance.on` method. Once the path listener is attached any changes the path undergoes can be acted upon within your handler (`callback`). To understand more look at the `instance.on` method.

<a name="instance-methods-long"></a>
### Instance Methods

<a name="instance-methods-get"></a>
➜ **instance.get(`path`)** &mdash; Gets the value at the provided object path.

- `path` (`String`, _Required_)
- **Returns** the path's value.

```js
monitor.get("path1.path2");
```

<a name="instance-methods-set"></a>
➜ **instance.set(`path`, `value`, `conditions`)** &mdash; Sets the provided value at the provided path.

- `path` (`String`, _Required_)
- `value` (`Any`, _Required_)
- `conditions` (`Object`, _Optional_)
- **Returns** instance.

```js
// set the "path1.path2" to 12
monitor.set("path1.path2", 12);
```

<a name="conditions-object"></a>
**Note**: A `conditions` object should be used when trying to modify the object from within the `controller` or attached path listeners using the `on` method via the `set`, `trigger`, and `unset` methods. The conditions object serves to hold flags which, depending on your codes logic, allow for certain object modifications to run. For example, when you pass in a certain flag inside the `conditions` object you can have the code return and skip the change entirely. _This is mainly done to prevent circular/loop errors_.

```js
// set the "path1.path2" to 12 + add a conditions object
monitor.set("path1.path2", 12, {"someCondition": true});
```

**Note**: Paths that lead to `Arrays` can also be modified.

```js
// example monitor object + structure
var settings = new Monitor(null, {
    "appearance": {
        "theme": {
            "dark": true,
            "light": false
        },
        "colors": {}
    },
    "search": {
        "autocomplete": true
    },
    "accountActive": true
});

// add an "rgb" property array to the "appearance.colors" object
settings.set("appearance.colors.rgb", [120, 0, 128]);
// update the "appearance.colors.rgb" arrays first item
settings.set("appearance.colors.rgb[0]", 128);
```

<a name="instance-methods-unset"></a>
➜ **instance.unset(`path`, `conditions`)** &mdash; Removes the last property of the provided path.

- `path` (`String`, _Required_)
- `conditions` (`Object`, _Optional_)
- **Returns** instance.

```js
monitor.unset("path1.path2");
```

<a name="instance-methods-trigger"></a>
➜ **instance.trigger(`path`, `value`, `conditions`)** &mdash; Triggers the provided path.

- `path` (`String`, _Required_)
- `value` (`Any`, _Optional_)
- `conditions` (`Object`, _Optional_)
- **Returns** instance.

```js
// trigger the "path1.path2"
monitor.trigger("path1.path2");

// trigger the "path1.path2" + give a value
monitor.trigger("path1.path2", 14);

// trigger the "path1.path2" + give an empty value + add a conditions object
monitor.set("path1.path2", undefined, {"someCondition": true});
```

<a name="instance-methods-on"></a>
➜ **instance.on(`path`, `handler`)** &mdash; Adds an object path listener.

- `path` (`String|RegExp`, _Required_)
- `handler` (`Function`, _Required_)
    - Parameters:
        - `filter`: The provided path's `RegExp.toString` string.
        - `path`: The path the change occurred on.
        - `type`: The type of change (`add`, `delete`, `update`, `trigger`).
        - `newValue`: The changes new value.
        - `oldValue`: The changes old value.
        - `time`: A timestamp of when the change occurred.
        - `conditions`: The conditions object.
- **Returns** instance.

```js
// example handler function
var handler = function(filter, path, type, newValue, oldValue, time, conditions) {
    // logic...
};

// listen to the path "path1.*"
monitor.on(/^path1.\.*/g, handler);
```

**Note**: `String` paths internally get escaped and converted to an `RegExp` object.

```js
// use a string to listen to the "path1.path2" path
monitor.on("path1.path2", handler2);

// listen to the paths "path1.*" except "path1.path4"
monitor.on(/^path1(?!.path4).*/, handler3);
```

<a name="instance-methods-off"></a>
➜ **instance.off(`path`, `callback`)** &mdash; Removes the object path listener.

- `path` (`String|RegExp`, _Required_)
- `callback` (`Function`, _Optional_)
    - Parameters:
        - `path`: The path the change occurred on.
- **Returns** instance.

**Note**: When removing a listener the provide path must be the same path that was provided with the `instance.on` method.

```js
monitor.off("path1.path2");

// callback can be provided
monitor.off("path1.path2", function(path) {
    // logic...
});
```

<a name="instance-methods-clearcache"></a>
➜ **instance.clearCache** &mdash; Clears the *entire* monitor's cache.

- **No Parameters**
- **Returns** Nothing.

**Note**: An internal cache is used to store and retrieve the previous path values. Sometimes, however, it might be useful or even necessary to programmatically clear it.

```js
monitor.clearCache();
```

<a name="usage"></a>
### Usage

**Note**: For a better understanding and to see the following examples in action, check out `index.html` and `js/source/test.js`. `js/source/test.js` contains the following examples.

<a name="usage-examples-toc"></a>
- [Examples](#usage-examples)
    - [Example 1](#usage-example-1)
    - [Example 2](#usage-example-2)

<a name="usage-examples"></a>
### Examples

<a name="usage-example-1"></a>
**Example 1** &mdash; Monitor an object with controller logic.

```js
// element where the name will get updated
var $name = document.getElementById("name");

// create the object to monitor
var obj = {
    "id": 961739264,
    "name": {
        "first": "John",
        "last": "Doe",
    },
    "dbay": {
        "day": 3,
        "month": 10,
        "year": 92
    }
};

// controller function to handle object changes
var controller = function(path, type, newValue, oldValue, time, conditions) {
    console.log("controller[user]-->", path, type, newValue, oldValue, time, conditions);
    // do something when the name.* path gets altered
    if (/^name/.test(path)) {
        if (type !== "delete") { // add/update/trigger
            // get the name object to get the first/last name
            var name = this.get("name")
                .val,
                first_name = name.first,
                last_name = name.last;
            // update the full name on the user's screen
            $name.textContent = (first_name + " " + last_name);
            // set the message
        } else if (type === "delete") {
            // when the name.* gets unset (deleted/removed/plucked)
            $name.textContent = "";
        }
    }
};

// create new monitor
var user = new Monitor(controller, obj);

// start listening to the "name.*" path
user.on(/^name\.*$/, function(filter, path, type, newValue, oldValue, time, conditions) {
    console.log("objectOn[user]---->", filter, path, type, newValue, oldValue, time, conditions);
});

// trigger the name path. this will run the controller with the provided
// path and value provided
setTimeout(function() {
    user.trigger("name");
}, 1000);

// update the first name...
setTimeout(function() {
    user.set("name.first", "Jane");
}, 2000);

// remove the name path from the object
setTimeout(function() {
    user.unset("name");
}, 3000);

// stop listening to the "name.*" path
setTimeout(function() {
    user.off(/^name\.*$/, function(path) {
        console.log("No longer listening to", path);
    });
    // will only activate the controller but the the monitor.on
    // as it was removed in the previous line
    user.set("name.first", "Jenny");
}, 4000);

// will only trigger the controller
setTimeout(function() {
    user.set("age", 20);
}, 5000);
```

<a name="usage-example-2"></a>
**Example 2** &mdash; Monitor object with array modification.

```js
// controller function to handle object changes
var controller = function(path, type, newValue, oldValue, time, conditions) {
    console.log("controller[settings]-->", path, type, newValue, oldValue, time, conditions);
};

// create the object to monitor
var settings = new Monitor(controller, {
    "appearance": {
        "theme": {
            "dark": true,
            "light": false
        },
        "colors": {}
    },
    "search": {
        "autocomplete": true
    },
    "accountActive": true
});

// update the first name...
setTimeout(function() {
    // update props
    settings.set("appearance.theme.dark", false, {
        "someCondition": true
    });
    settings.set("appearance.theme.light", true);
    // add a random prop
    settings.set("appearance.colors.main", "purple");
    settings.set("appearance.colors.rgb", [120, 0, 128]);
}, 7000);

// update the an rgb value
setTimeout(function() {
    settings.set("appearance.colors.rgb[0]", 128);
}, 8000);
```

<a name="contributing"></a>
### Contributing

Contributions are welcome! Found a bug, feel like documentation is lacking/confusing and needs an update, have performance/feature suggestions or simply found a typo? Let me know! :)

See how to contribute [here](https://github.com/cgabriel5/monitorjs/blob/master/CONTRIBUTING.md).

### TODO

- [ ] Clean/re-work code for better performance.
- [ ] Implement listener namespaces for `instance.on` method.
- [ ] Expand cache clearing functionality. (i.e. clear only specific path caches)
- [ ] Add a way to filter the change types ([`add`, `delete`, `update`, `trigger`]) to act on.
- [ ] Add `observe`, `pause`, and `disconnect` instance methods for better functionality and usability.
- [ ] Add a way to run multiple sets, unsets, and triggers via their respective `set`, `unset`, and `trigger` method. (i.e. use an `Object` or an `Array` to account for order)

<a name="license"></a>
### License

This project uses the [MIT License](https://github.com/cgabriel5/monitorjs/blob/master/LICENSE.txt).