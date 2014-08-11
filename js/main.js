$("html").removeClass("no-js");

var template = App.templates['events'];
var pageWidth = $(window).outerWidth();
var $carousel = $('.bxslider');
var carouselThreshold = 400;
var miniCarouselOpts = {
  auto: true,
  minSlides: 1,
  maxSlides: 1,
  touchEnabled: false
};
var largeCarouselOpts = {
  auto: true,
  minSlides: 1,
  maxSlides: 5,
  slideWidth: null
};

var parseList = function(meetups) {
  var charLimit = 180;

  meetups = _.chain(meetups)
    .reject(function(meetup) {
      if (meetup.name.indexOf("Volunteer") !== -1) {
        return meetup;
      }

      if (moment().diff(moment(meetup.time), "months") < -1) {
        return meetup;
      }
    }).forEach(function(meetup) {
      var description = meetup.description.replace(/(<([^>]+)>)/ig,'');

      if (description.split('').length > charLimit) {
        description = description.substring(0, charLimit).trim() + '...';
      }

      meetup.display_description = description;
      meetup.display_day = moment(meetup.time).format('dddd');
      meetup.display_date = moment(meetup.time).format('MMMM Do');
      meetup.display_time = moment(meetup.time).format('h:mma');
      meetup.data_time = moment(meetup.time).format();
    }).value();

  $(".events-list").html(Handlebars.template(template)({meetups: meetups}));

  $(".js-meetup-btn").html("More Events");
};

var carouselInit = _.debounce(function(e) {
  var currentWidth = $(window).outerWidth();

  if (currentWidth <= carouselThreshold && pageWidth > carouselThreshold) {
    $carousel.reloadSlider(miniCarouselOpts);
  } else if (currentWidth > carouselThreshold && pageWidth < carouselThreshold) {
    $carousel.reloadSlider(largeCarouselOpts);
  }

  pageWidth = currentWidth;
}, 600);

$.ajax({
  url: 'http://api.meetup.com/2/events?status=upcoming&order=time&limited_events=False&group_urlname=seattlejs&desc=false&offset=0&format=json&page=20&fields=&sig_id=40626962&sig=3b829c9a900131ba6fa73ac8da85b2beae33ded2&callback=?',
  dataType: 'json',
  success: function(data) {
    parseList(data.results);
  }
});

if (pageWidth > carouselThreshold) {
  $carousel.bxSlider(largeCarouselOpts);
} else {
  $carousel.bxSlider(miniCarouselOpts);
}

$(window).on('resize', carouselInit);
