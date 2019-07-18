function initSearch(callback) {
    var search = new Search();
    search.token = "zCINhXzJMBcNqW9wAoNsakxIeLHucRlhUMQIYccu";
    search.setToken();
    search.page_size = 100;
    search.sounds = [];

    $.getJSON( "./data/instruments_by_origin.json", function(data) {
        search.countryData = data;
        callback();
    });
    return search;
}


function Search() {
    var token = null;
    var query = null;
    var page_size = null;
    var num_pages = null;
}

Search.prototype.setToken = function () {
    freesound.setToken(this.token);
};

Search.prototype.firstQuery = function (query, callback) {
    // get the number of sounds for this query
    // TODO: add filters (duration, descriptors, ...)
    var self = this;
    self.query = query;
    var page_size = 1;
    freesound.textSearch("", {
            page_size: 1,
            fields: 'id,name',
            filter: query
        },
        function (sounds) {
            console.log(sounds);
            self.num_pages = Math.ceil(sounds.count / self.page_size);
            callback();
        })
};

Search.prototype.mainQuery = function (country, keywords, index, callback) {
    // query freesound with given keywords and country as tag filter
    var self = this;

    // create filter string
    if (keywords.length > 0) {
        var filter_str = 'tag: (';
        for (var i=0; i<keywords.length; i++) {
	       filter_str += keywords[i].replace(/\s/g, " OR ");
	       filter_str += " OR ";
        }
        filter_str += country + ")";
    } else {
        var filter_str = "tag: " + country;
    }

    filter_str += " duration: [0 TO 20]"
    console.log(filter_str);

    // queries
    self.firstQuery(filter_str, function () {
        // random params
        // TODO: add some params
        var page = Math.floor(Math.random() * self.num_pages) + 1;
        console.log(self.num_pages)

        freesound.textSearch("", {
                page_size: 1,
                fields: 'id,name,previews,duration',
                page_size: self.page_size,
                page: page,
                filter: filter_str,
                sort: 'downloads_desc'
            },
            function (results) {
                var numSoundCurrentPage = results.results.length;
                var sounds = [];
                for (var i = 0; i < numSoundCurrentPage; i++) {
                    sounds.push(results.results[i]);
                }
                self.sounds[index] = sounds;
                console.log(sounds);

                self.count_countries += 1

                if (self.count_countries == self.num_countries) {
                    // Call audio callback
                    console.log(self.sounds);
                    callback(self.sounds);
                }

                // create embbeds
                // TODO: call audio callback load sounds
//                var msg = ""
//                var numSoundCurrentPage = results.results.length;
//                for (var i = 0; i < numSoundCurrentPage/2; i++) {
//                    var snd = results.getSound(i);
//                    msg += "<div>" + self.freesoundIframe(snd.id) + "<div class='drag-me' draggable='true' ondragstart='drag(event)' sound-url='" + snd.previews["preview-lq-ogg"] + "'></div></div>";
//                  }
//                msg += "</ul>"
//                document.getElementById("search-result-container").innerHTML = msg;
            });
    });
};

Search.prototype.querySoundsFromCountry = function (country, index, callback) {
    // retrieve typical sounds from the given country
    // TODO: perform queries for several country (or other concepts)
    instruments = this.country2instruments(country);
        console.log([country, instruments, index])
    this.mainQuery(country, instruments, index, callback);
};

Search.prototype.querySoundsFromCountries = function (countries, callback) {
    this.num_countries = countries.length;
    this.count_countries = 0;
    this.sounds = new Array(this.num_countries).fill(null);
    Promise.all(countries.map((country,index) =>
        this.querySoundsFromCountry(country, index, callback)
    ))
    .then(data => {
      // before recieving response from freesound
    })
};

Search.prototype.country2instruments = function (country) {
    console.log(this.countryData[country])
    var instruments = this.countryData[country];
    if (!instruments)
        instruments = [];
    return instruments;
};

Search.prototype.freesoundIframe = function (soundId) {
  return '<iframe frameborder="0" scrolling="no" src="https://freesound.org/embed/sound/iframe/' + soundId + '/simple/small/" width="375" height="30"></iframe>';
};
