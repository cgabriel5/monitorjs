// =============================== Library Class
var Library = class__({
    // class constructor
    "constructor__": function(controller, object) {
        // if user does not invoke query with new keyword we use it for them by
        // returning a new instance of the selector with the new keyword.
        if (!(this instanceof Library)) return new Library(controller, object);
        // set properties
        this.controller = (controller || undefined);
        this.object = (object || {});
        this.cache = {};
        this.callbacks = {
            strings: [],
            regexps: [],
        };
    },
    // class methods
    "methods__": {
        /**
         * @description [Check whether the object has the provided path.]
         * @param  {String} path        [The path to check.]
         * @return {Boolean|Object}     [False if path does not exist. Otherwise, an object containing the value at the
         *                               at the provided object path.]
         */
        "get": function(path) {
            // cache the object
            var _ = this,
                object = _.object;
            // 1) remove start/ending slashes
            path = path.replace(/^\.|\.$/g, "");
            // 2) break apart the path
            var parts = path.split(".");
            // 4) parse each path
            for (var i = 0, l = parts.length; i < l; i++) {
                // cache the part
                var part = parts[i];
                // get the prop name and possible array indices
                var prop = (part.match(/^[^\[]+/g) || [""])[0],
                    indices = (part.match(/\[\d+\]/g) || []);
                // reset the part
                parts[i] = [part, prop, indices];
            }
            // 5) check the path existence
            var old = object,
                obj = object;
            for (var i = 0, l = parts.length; i < l; i++) {
                // cache the part
                var part = parts[i];
                // get the prop name and possible array indices
                var prop = part[1],
                    indices = part[2];
                if (!obj[prop] && !obj.hasOwnProperty(prop)) {
                    return false;
                } else {
                    // reset the ref, as the object was found
                    old = obj;
                    obj = obj[prop];
                }
                // check for indices
                if (indices.length) {
                    for (var j = 0, ll = indices.length; j < ll; j++) {
                        var index = indices[j].replace(/^\[|\]$/g, "");
                        // get the new object
                        old = obj;
                        obj = obj[index];
                        if (dtype.isnot(obj, "Object|Array")) {
                            return false;
                        }
                    }
                }
            }
            // return the object with the updated/new path
            return {
                val: obj
            };
        },
        /**
         * @description [Sets the provided value at the provided path.]
         * @param  {String} path        [The path to set.]
         * @param  {Any} value        [The value to set.]
         * @return {Object}     [The Monitor object.]
         */
        "set": function(path, value) {
            // cache the object
            var _ = this,
                object = _.object,
                cache = _.cache,
                date = Date.now(),
                entry, type = "update";
            // 1) first check cache for path
            entry = cache[path.trim()];
            // if no cache entry run the get method
            // i.e. this path might have been added before
            // the library started to monitor the object
            if (!entry) {
                // the path check
                var result = _.get(path);
                // the result must be of type object
                var check = (dtype.is(result, "Object"));
                // get the value of the get check, else default to undefined
                // checks are done separately as the value undefined is an
                // actual value that the path by result in
                var val = (check ? result.val : undefined);
                // create the "fake" entry, only needs the value
                entry = [, , val];
                // determine the type
                type = (check ? "update" : "add");
            }
            // determine the old value
            var old_value = (entry ? entry[2] : undefined);
            // update the cache
            cache[path] = [date, type, value];
            // ------------------------------------
            // 1) remove start/ending slashes
            path = path.replace(/^\.|\.$/g, "");
            // 2) break apart the path
            var parts = path.split(".");
            // 4) parse each path
            for (var i = 0, l = parts.length; i < l; i++) {
                // cache the part
                var part = parts[i];
                // get the prop name and possible array indices
                var prop = (part.match(/^[^\[]+/g) || [""])[0],
                    indices = (part.match(/\[\d+\]/g) || []);
                // reset the part
                parts[i] = [part, prop, indices];
            }
            // 5) build the path
            var old = object,
                obj = object;
            for (var i = 0, l = parts.length; i < l; i++) {
                // cache the part
                var part = parts[i];
                // get the prop name and possible array indices
                var prop = part[1],
                    indices = part[2];
                // set the value if the last prop
                if (i === (l - 1) && !indices.length) {
                    // get the last obj ref
                    obj[prop] = value;
                } else {
                    // check if the object exists (set the object path)
                    // check if the property exists else add a new object
                    var crumb = (obj[prop] ? obj[prop] : (indices.length ? [] : {}));
                    obj[prop] = crumb;
                    // reset the obj refs
                    old = obj;
                    obj = obj[prop];
                }
                // ------------------------------------
                // check for indices
                if (indices.length) {
                    for (var j = 0, ll = indices.length; j < ll; j++) {
                        var index = indices[j].replace(/^\[|\]$/g, "");
                        if (j === (ll - 1)) { // only run on the last index iteration
                            if (i === (l - 1)) { // if the last-last set the final value
                                obj[index] = value;
                            } else { //
                                // more props to loop over
                                // check if the property exists else add a new object
                                var crumb = (obj[index] ? obj[index] : {});
                                obj[index] = crumb;
                                // reset the obj refs
                                old = obj;
                                obj = obj[index];
                            }
                        } else {
                            // set the object path
                            // check if the property exists else add a new object
                            var crumb = (obj[index] ? obj[index] : []);
                            obj[index] = crumb;
                            // reset the obj refs
                            old = obj;
                            obj = obj[index];
                        }
                    }
                }
            }
            // ------------------------------------
            // the callback args
            var args = [path, type, value, old_value, date];
            // run the callback (controller) if provided
            if (_.controller) _.controller.apply(_, args);
            // run any callbacks that match the path (either string or regexp)
            var callbacks = this.callbacks;
            // loop over strings array
            var strings = callbacks.strings;
            for (var i = 0, l = strings.length; i < l; i++) {
                // cache the needed info
                var callback = strings[i],
                    cb_path = callback[0],
                    cb_cb = callback[1];
                // check if the paths match
                if (cb_path === path) {
                    // console.log("strings::SET", path, cb_path);
                    // run the callback
                    cb_cb.apply(_, args);
                }
            }
            // loop over regexps array
            var regexps = callbacks.regexps;
            for (var i = 0, l = regexps.length; i < l; i++) {
                // cache the needed info
                var callback = regexps[i],
                    cb_path = callback[0],
                    cb_cb = callback[1];
                // reusing regexp needs resetting of the lastIndex prop [https://siderite.blogspot.com/2011/11/careful-when-reusing-javascript-regexp.html#at3060321440]
                cb_path.lastIndex = 0;
                // check if the paths match
                if (cb_path.test(path)) {
                    // console.log("regexps::SET", path, cb_path);
                    // run the callback
                    cb_cb.apply(_, args);
                }
            }
            // return the object with the updated/new path
            return object;
        },
        /**
         * @description [Unsets the last object of the provided path.]
         * @param  {String} path         [The path to unset from.]
         * @return {Undefined}           [Nothing is returned.]
         */
        "unset": function(path) {
            // cache the object
            var _ = this,
                object = _.object,
                cache = _.cache,
                date = Date.now();
            // 1) remove start/ending slashes
            path = path.replace(/^\.|\.$/g, "");
            // 2) break apart the path
            var parts = path.split(".");
            // 4) parse each path
            for (var i = 0, l = parts.length; i < l; i++) {
                // cache the part
                var part = parts[i];
                // get the prop name and possible array indices
                var prop = (part.match(/^[^\[]+/g) || [""])[0],
                    indices = (part.match(/\[\d+\]/g) || []);
                // reset the part
                parts[i] = [part, prop, indices];
            }
            // 5) check the path existence
            var old = object,
                obj = object;
            for (var i = 0, l = parts.length; i < l; i++) {
                // cache the part
                var part = parts[i];
                // get the prop name and possible array indices
                var prop = part[1],
                    indices = part[2];
                if (!obj[prop] && !obj.hasOwnProperty(prop)) {
                    return false;
                } else {
                    // reset the ref, as the object was found
                    old = obj;
                    obj = obj[prop];
                }
                // check for indices
                if (indices.length) {
                    for (var j = 0, ll = indices.length; j < ll; j++) {
                        var index = indices[j].replace(/^\[|\]$/g, "");
                        // get the new object
                        old = obj;
                        obj = obj[index];
                        if (dtype.isnot(obj, "Object|Array")) {
                            return false;
                        }
                    }
                }
            }
            // ------------------------------------
            // remove the last property from the path
            delete old[prop];
            // the callback args
            var args = [path, "delete", undefined, obj, date];
            // run the callback (controller) if provided
            if (_.controller) _.controller.apply(_, args);
            // run any callbacks that match the path (either string or regexp)
            var callbacks = this.callbacks;
            // loop over strings array
            var strings = callbacks.strings;
            for (var i = 0, l = strings.length; i < l; i++) {
                // cache the needed info
                var callback = strings[i],
                    cb_path = callback[0],
                    cb_cb = callback[1];
                // check if the paths match
                if (cb_path === path) {
                    // console.log("strings::UNSET", path, cb_path);
                    // run the callback
                    cb_cb.apply(_, args);
                }
            }
            // loop over regexps array
            var regexps = callbacks.regexps;
            for (var i = 0, l = regexps.length; i < l; i++) {
                // cache the needed info
                var callback = regexps[i],
                    cb_path = callback[0],
                    cb_cb = callback[1];
                // reusing regexp needs resetting of the lastIndex prop [https://siderite.blogspot.com/2011/11/careful-when-reusing-javascript-regexp.html#at3060321440]
                cb_path.lastIndex = 0;
                // check if the paths match
                if (cb_path.test(path)) {
                    // console.log("regexps::UNSET", path, cb_path);
                    // run the callback
                    cb_cb.apply(_, args);
                }
            }
        },
        /**
         * @description [Triggers the controller. Using the provided path and value.]
         * @param  {String} path         [The path to check.]
         * @param  {Any} value           [The value to use.]
         * @return {Undefined}           [Nothing is returned.]
         */
        "trigger": function(path, value) {
            // cache the object
            var _ = this,
                object = _.object,
                cache = _.cache,
                date = Date.now(),
                entry, type = "trigger";
            // 1) first check cache for path
            entry = cache[path.trim()];
            // if no cache entry run the get method
            // i.e. this path might have been added before
            // the library started to monitor the object
            if (!entry) {
                // the path check
                var result = _.get(path);
                // the result must be of type object
                var check = (dtype.is(result, "Object"));
                // get the value of the get check, else default to undefined
                // checks are done separately as the value undefined is an
                // actual value that the path by result in
                var val = (check ? result.val : undefined);
                // create the "fake" entry, only needs the value
                entry = [, , val];
            }
            // determine the old value
            var old_value = (entry ? entry[2] : undefined);
            // update the cache
            cache[path] = [date, type, value];
            // ------------------------------------
            // the callback args
            var args = [path, type, (value || undefined), old_value, date];
            // run the callback (controller) if provided
            if (_.controller) _.controller.apply(_, args);
            // run any callbacks that match the path (either string or regexp)
            var callbacks = this.callbacks;
            // loop over strings array
            var strings = callbacks.strings;
            for (var i = 0, l = strings.length; i < l; i++) {
                // cache the needed info
                var callback = strings[i],
                    cb_path = callback[0],
                    cb_cb = callback[1];
                // check if the paths match
                if (cb_path === path) {
                    // console.log("strings::TRIGGER", path, cb_path);
                    // run the callback
                    cb_cb.apply(_, args);
                }
            }
            // loop over regexps array
            var regexps = callbacks.regexps;
            for (var i = 0, l = regexps.length; i < l; i++) {
                // cache the needed info
                var callback = regexps[i],
                    cb_path = callback[0],
                    cb_cb = callback[1];
                // reusing regexp needs resetting of the lastIndex prop [https://siderite.blogspot.com/2011/11/careful-when-reusing-javascript-regexp.html#at3060321440]
                cb_path.lastIndex = 0;
                // check if the paths match
                if (cb_path.test(path)) {
                    // console.log("regexps::TRIGGER", path, cb_path);
                    // run the callback
                    cb_cb.apply(_, args);
                }
            }
        },
        "on": function(path, callback) {
            // add the callback to the callback registry
            // existing callbacks with the same path will overwrite existing callback
            // add to the appropriate array
            this.callbacks[(dtype(path) === "string" ? "strings" : "regexps")].push([path, callback]);
        },
        "off": function(path) {
            // run any callbacks that match the path (either string or regexp)
            var callbacks = this.callbacks;
            // loop over strings array
            var strings = callbacks.strings;
            for (var i = 0, l = strings.length; i < l; i++) {
                // cache the needed info
                var callback = strings[i],
                    cb_path = callback[0],
                    cb_cb = callback[1];
                // check if the paths match
                if (cb_path === path) {
                    // console.log("strings::OFF", path, cb_path);
                    // remove the listener from the array
                    strings.splice(i, 1);
                }
            }
            // loop over regexps array
            var regexps = callbacks.regexps;
            for (var i = 0, l = regexps.length; i < l; i++) {
                // cache the needed info
                var callback = regexps[i],
                    cb_path = callback[0],
                    cb_cb = callback[1];
                // check if the paths match
                if (cb_path.toString() === path.toString()) {
                    // console.log("regexps::OFF", path, cb_path);
                    // remove the listener from the array
                    regexps.splice(i, 1);
                }
            }
        },
        /**
         * @description [Clears the Monitor's cache.]
         * @return {Undefined} [Nothing is returned.]
         */
        "clearCache": function() {
            // clear the cache
            this.cache = {};
        },
        // "disable": function() {}
    },
    // class to extend
    "extend__": false
});
