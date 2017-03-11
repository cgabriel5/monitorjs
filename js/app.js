// define the vars outsude to access via console
var Monitor, user, settings;

document.onreadystatechange = function() {

    "use strict";

    /* [functions.utils] */

    // get the libs

    var libs = app.libs;
    Monitor = libs.Monitor;

    // all resources have loaded (document + subresources)
    if (document.readyState == "complete") {

        // ------------------------------------
        // Example 1

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
        var controller = function(path, type, newValue, oldValue, time) {

            console.log("controller[user]-->", path, type, newValue, oldValue, time);

            // do something when the name.* path gets altered
            if (/^name/.test(path)) {
                if (type !== "delete") { // add/update/trigger
                    // get the name object to get the first/last name
                    var name = this.get("name").val,
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
        user = new Monitor(controller, obj);

        // start listening to the "/^name.*/" path
        user.on(/^name\.*/g, function(path, type, newValue, oldValue, time) {
            console.log("objectOn[user]---->", path, type, newValue, oldValue, time);
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

        // stop listening to the "/^name.*/" path
        setTimeout(function() {
            user.off(/^name\.*/g);
        }, 4000);

        // will only trigger the controller
        setTimeout(function() {
            user.set("age", 20);
        }, 5000);

        // ------------------------------------
        //  Example 2

        // controller function to handle object changes
        var controller = function(path, type, newValue, oldValue, time) {
            console.log("controller[settings]-->", path, type, newValue, oldValue, time);
        };

        // create the object to monitor
        settings = new Monitor(controller, {
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
            settings.set("appearance.theme.dark", false);
            settings.set("appearance.theme.light", true);
            // add a random prop
            settings.set("appearance.colors.main", "purple");
            settings.set("appearance.colors.rgb", [120, 0, 128]);
        }, 7000);

        // update the an rgb value
        setTimeout(function() {
            settings.set("appearance.colors.rgb[0]", 128);
        }, 8000);

    }

};

// http://stackoverflow.com/questions/6906108/in-javascript-how-can-i-dynamically-get-a-nested-property-of-an-object
// https://lodash.com/docs/4.17.4#set
