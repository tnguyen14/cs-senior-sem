jQuery('document').ready(function($) {
  // date picker
  $('.input-group.date').datepicker({
    format: "d MM, yyyy",
    todayBtn: "linked",
    todayHighlight: true
  });

  $('.add-theater .btn, .add-movie .btn').on('click', function(e) {
    e.preventDefault();
    var $form = $(e.target).siblings('.form');
    $form.toggle();
  });
  $('.theater-map').locationpicker({
    enableAutocomplete: true,
    radius: 300,
    location: {latitude: 41.967269, longitude: -71.184954},
    inputBinding: {
      locationNameInput: $('.theater-address'),
      longitudeInput: $('.theater-long'),
      latitudeInput: $('.theater-lat')
    }
  });

  var rottenTomatoesApi = '5egt22fx3f6phsqdujwch8js';
  var movies = new Bloodhound({
    datumTokenizer: Bloodhound.tokenizers.obj.whitespace('value'),
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    remote: {
      url: 'http://api.rottentomatoes.com/api/public/v1.0/movies.json?apikey=' + rottenTomatoesApi + '&page_limit=50&q=%QUERY',
      ajax: {
        dataType: 'jsonp'
      },
      filter: function(data) {
        console.log(data);
        return _.map(data.movies, function(m) {
          return {
            value: m.title,
            date: moment(m.release_dates.theater).format('YYYY'),
            thumb: m.posters.thumbnail
          };
        });
      }
    }
  });

  movies.initialize();

  $('.movie-name').typeahead(null,
  {
    name: 'movies',
    displayKey: 'value',
    source: movies.ttAdapter(),
    templates: {
      empty: Handlebars.compile('<div class="tt-suggestion no-suggestion">No movie found for query "{{query}}"</div>'),
      suggestion: Handlebars.compile('<p><img src="{{thumb}}"/>{{value}} ({{date}})</p>')
    }
  });
});