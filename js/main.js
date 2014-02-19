var source   = $("#event-template").html();
var template = Handlebars.compile(source);

var parseList = function(meetups) {
  var charLimit = 180;

  meetups = _.chain(meetups)
    .filter(function(meetup) {
      return meetup.name.indexOf("Volunteer") === -1;
    }).forEach(function(meetup) {
      var description = meetup.description.replace(/(<([^>]+)>)/ig,'');

      if (description.split('').length > charLimit) {
        description = description.substring(0, charLimit).trim() + '...';
      }

      meetup.display_description = description;
      meetup.display_date = moment(meetup.time).format('MMMM Do');
      meetup.display_time = moment(meetup.time).format('h:mma');
      meetup.data_time = moment(meetup.time).format();
    }).value();

  $(".events-list").html(template({meetups: meetups}));
};

$.ajax({
  url: "http://api.meetup.com/2/events?status=upcoming&order=time&limited_events=False&group_urlname=seattlejs&desc=false&offset=0&format=json&page=20&fields=&sig_id=40626962&sig=3b829c9a900131ba6fa73ac8da85b2beae33ded2&callback=?",
  dataType: "json",
  success: function(data) {
    parseList(data.results);
  }
});
