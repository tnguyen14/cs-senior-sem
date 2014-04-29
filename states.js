var states = [
  {
    fips: "36",
    name: "New York",
    code: "NY"
  },
  {
    fips: "06",
    name: "California",
    code: "CA"
  },
  {
    fips: "39",
    name: "Ohio",
    code: "OH"
  },
  {
    fips: "48",
    name: "Texas",
    code: "TX"
  }
];

var movies = {
  "CA": {
    numTheaters: 39
  },
  "NY": {
    numTheaters: 46
  },
  "OH": {
    numTheaters: 20
  },
  "TX": {
    numTheaters: 28
  }
};

var stateMap = new Landline.Stateline('#states-map', 'states');

var tooltipTmpl = _.template($('#state-tooltip-tmpl').html());

// Add tooltips, and cache the existing style
// to put it back in place on mouseout
stateMap.on('mouseover', function(e, path, data) {
  data.existingStyle = (data.existingStyle || {});
  data.existingStyle["fill"]        = path.attr("fill");
  data.existingStyle["strokeWidth"] = path.attr("stroke-width");
  path.attr("fill", "#999").attr("stroke-width", 1);
});

stateMap.on('mousemove', function(e, path, data) {
  var state = _(states).findWhere({fips: data.fips});
  if (state) {
    $("#state-tooltip").html(tooltipTmpl({
      name: state.name,
      numTheaters: movies[state.code].numTheaters
    })).css("left", e.pageX + 20).css("top", e.pageY + 20).show();
  }
});

stateMap.on('mouseout', function(e, path, data) {
  $("#state-tooltip").hide();
  _(data.existingStyle).each(function(value, attribute) {
    path.attr(attribute, value);
  });
});

_(movies).each(function(value, stateName) {
  var state = _(states).findWhere({code: stateName});
  stateMap.style(state.fips, 'fill', 'rgb(0,109,50)');
});

stateMap.createMap();

console.log(stateMap);