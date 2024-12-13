(function () {
    // Define global variables and utility functions for the script
    var E, g = window, n = document;

    // Function to check if Google Analytics opt-out is enabled
    var p = function (a) {
        var b = g._gaUserPrefs;
        if (b && b.ioo && b.ioo() || (a && g["ga-disable-" + a])) return true;
        try {
            var c = g.external;
            if (c && c._gaUserPrefs && c._gaUserPrefs === "oo") return true;
        } catch (f) { }
        var a = [];
        var b = n.cookie.split(";");
        var c = /^\s*AMP_TOKEN=\s*(.*?)\s*$/;
        for (var d = 0; d < b.length; d++) {
            var e = b[d].match(c);
            if (e) a.push(e[1]);
        }
        for (var b = 0; b < a.length; b++) if (decodeURIComponent(a[b]) === "$OPT_OUT") return true;
        return false;
    };

    // Function to encode a string to URI format, handling parentheses
    var q = function (a) {
        return encodeURIComponent ? encodeURIComponent(a).replace(/\(/g, "%28").replace(/\)/g, "%29") : a;
    };

    // Regular expressions to check domains for Google and DoubleClick
    var r = /^(www\.)?google(\.com?)?(\.[a-z]{2})?$/,
        u = /(^|\.)doubleclick\.net$/i;

    // Utility function to generate a random number
    function randomNum() {
        return Math.round(2147483647 * Math.random());
    }

    // Utility function to check if a value is a function
    function isFunction(a) {
        return typeof a === "function";
    }

    // Utility function to check if a value is a string
    function isString(a) {
        return typeof a !== "undefined" && a.constructor.toString().includes("String");
    }

    // Check if a value is undefined or empty, with an optional condition
    function isUndefinedOrEmpty(a, b) {
        return typeof a === "undefined" || (a === "-" && !b) || a === "";
    }

    // Object to manage key-value pairs with a prefix
    var nf = function () {
        this.prefix = "ga.";
        this.values = {};
    };

    nf.prototype.set = function (a, b) {
        this.values[this.prefix + a] = b; // Set a value with the prefix
    };

    nf.prototype.get = function (a) {
        return this.values[this.prefix + a]; // Retrieve a value by key
    };

    nf.prototype.contains = function (a) {
        return typeof this.get(a) !== "undefined"; // Check if a key exists
    };

    // Parse a URL into a structured object
    function parseUrl(a, includeAnchor) {
        var urlObject = {
            url: a,
            protocol: "http",
            host: "",
            path: "",
            R: new nf(),
            anchor: ""
        };

        if (!a) return urlObject; // Return default object if no URL provided

        var protocolIndex = a.indexOf("://");
        if (protocolIndex >= 0) {
            urlObject.protocol = a.substring(0, protocolIndex);
            a = a.substring(protocolIndex + 3);
        }

        var pathStartIndex = a.search("/|\\?|#");
        if (pathStartIndex >= 0) {
            urlObject.host = a.substring(0, pathStartIndex).toLowerCase();
            a = a.substring(pathStartIndex);
        } else {
            urlObject.host = a.toLowerCase();
            return urlObject;
        }

        var anchorIndex = a.indexOf("#");
        if (anchorIndex >= 0) {
            urlObject.anchor = a.substring(anchorIndex + 1);
            a = a.substring(0, anchorIndex);
        }

        var queryIndex = a.indexOf("?");
        if (queryIndex >= 0) {
            urlObject.R = new nf();
            a = a.substring(0, queryIndex);
        }

        if (urlObject.anchor && includeAnchor) urlObject.R = new nf(urlObject.anchor);

        if (a.charAt(0) === "/") a = a.substring(1);

        urlObject.path = a;
        return urlObject;
    }

    // Function to check if a URL is allowed based on its structure
    function isAllowed(a, b) {
        function c(a) {
            var b = (a.hostname || "").split(":")[0].toLowerCase(),
                c = (a.protocol || "").toLowerCase();
            var d = c === "http:" ? 80 : c === "https:" ? 443 : "";
            var e = a.pathname || "";
            if (e.charAt(0) !== "/") e = "/" + e;
            return [b, "" + d, e];
        }

        b = b || n.createElement("a");
        b.href = n.location.href;

        var d = c(b),
            e = b.search || "",
            f = d[0] + (d[1] ? ":" + d[1] : "");

        if (a.startsWith("//")) a = d[2];
        else if (a.startsWith("/")) a = f + a;
        else a = a.split("/")[0].indexOf(":") < 0 ? f + "/" + a : a;

        b.href = a;
        d = c(b);

        return {
            protocol: b.protocol || "",
            host: d[0],
            port: d[1],
            path: d[2],
            query: b.search || "",
            url: a || ""
        };
    }

    // Main script executed on DOM content loaded
    document.addEventListener('DOMContentLoaded', () => {
        // Array of images to display in the gallery
        const images = [
            { category: 'Food', src: '3meal.jpg', alt: 'An assortment of burgers with toppings, fries, and dipping sauces' },
            { category: 'Food', src: 'meal-1.jpg', alt: 'A cheeseburger with lettuce and onion served with crispy fries on a green plate' },
            { category: 'Food', src: 'meal-2.jpg', alt: 'A bacon cheeseburger topped with an egg, paired with sweet potato fries and a drink' },
            { category: 'Food', src: 'meal-3.jpg', alt: 'A loaded fries dish with cheese, beans, corn, and sauce' },
            { category: 'Restaurant', src: 'bar_area.jpg', alt: 'A cozy bar area with a menu board and decorative items' },
            { category: 'Restaurant', src: 'behind the bar.jpg', alt: 'Restaurant staff standing behind the counter, smiling' },
            { category: 'Restaurant', src: 'bones_foodtruck.jpg', alt: 'A food truck serving burgers in a busy parking lot' },
            { category: 'Restaurant', src: 'bones_storefront.jpg', alt: 'Exterior view of the Bones Burgers storefront' },
            { category: 'Restaurant', src: 'crowded_inside.jpg', alt: 'A bustling restaurant interior with patrons and decor' },
            { category: 'Food', src: 'fries.jpg', alt: 'A bowl of golden, seasoned fries with a burger in the background' },
            { category: 'Restaurant', src: 'front_door_image.jpg', alt: 'The front door of Bones Burgers showing the restaurant hours and logo' },
            { category: 'Restaurant', src: 'storefront.jpg', alt: 'Front view of Bones Burgers with the restaurant logo and entrance' },
            { category: 'Food', src: 'table_of_food.jpg', alt: 'A table filled with burgers, fries, and dipping sauces' },
            { category: 'Restaurant', src: 'outside.jpg', alt: 'Bones Burgers signage displayed on the building exterior' },
            { category: 'Restaurant', src: 'group_ribbon_opening.jpg', alt: 'Ribbon cutting ceremony in front of Bones Burgers with staff and officials' },
            { category: 'Patrons', src: 'in_store_image.png', alt: 'A staff member interacting with a young customer inside the restaurant' },
            { category: 'Patrons', src: 'two-patrons.jpg', alt: 'Two smiling patrons inside Bones Burgers' },
            { category: 'Patrons', src: 'packed_restaurant.jpg', alt: 'A crowded restaurant with diners enjoying their meals' }
        ];

        const categories = ['Restaurant', 'Patrons', 'Food'];
        const galleryContainer = document.getElementById('gallery-container'); // Get gallery container

        // Loop through categories and create sections for each
        categories.forEach(category => {
            const categorySection = document.createElement('div');
            categorySection.classList.add('category-section');

            const categoryTitle = document.createElement('h2');
            categoryTitle.textContent = category;
            categorySection.appendChild(categoryTitle);

            const carouselContainer = document.createElement('div');
            carouselContainer.classList.add('carousel-container');

            const track = document.createElement('div');
            track.classList.add('carousel-track');

            // Filter and add images belonging to the current category
            images
                .filter(image => image.category === category)
                .forEach(image => {
                    const slide = document.createElement('div');
                    slide.classList.add('carousel-slide');

                    const img = document.createElement('img');
                    img.src = `images/${image.src}`;
                    img.alt = image.alt;
                    slide.appendChild(img);

                    track.appendChild(slide);
                });

            carouselContainer.appendChild(track);

            // Add carousel buttons
            const prevButton = document.createElement('button');
            prevButton.classList.add('carousel-button', 'carousel-button-left');
            prevButton.textContent = '<';

            const nextButton = document.createElement('button');
            nextButton.classList.add('carousel-button', 'carousel-button-right');
            nextButton.textContent = '>';

            carouselContainer.appendChild(prevButton);
            carouselContainer.appendChild(nextButton);

            categorySection.appendChild(carouselContainer);
            galleryContainer.appendChild(categorySection);

            // Track current index for carousel navigation
            let currentIndex = 0;

            // Function to update carousel position
            const updateCarousel = () => {
                const slideWidth = track.children[0].getBoundingClientRect().width;
                track.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
            };

            // Navigate to previous slide
            prevButton.addEventListener('click', () => {
                if (currentIndex > 0) {
                    currentIndex--;
                    track.setAttribute('aria-live', 'polite'); // Accessibility update
                    updateCarousel();
                }
            });

            // Navigate to next slide
            nextButton.addEventListener('click', () => {
                if (currentIndex < track.children.length - 1) {
                    currentIndex++;
                    track.setAttribute('aria-live', 'polite'); // Accessibility update
                    updateCarousel();
                }
            });

            window.addEventListener('resize', updateCarousel); // Adjust carousel on resize
            updateCarousel(); // Initial update
        });
    });
})();