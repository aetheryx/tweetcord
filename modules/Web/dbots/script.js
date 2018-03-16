/* global $ */

$(document).ready(function () {
  $('.titleandvote').prepend(`<img class="nicememeken" src="https://i.imgur.com/GvAQ2Xe.png" />`);
  $('.titleandvote').children('p').css('display', 'none');
  $(window).on('mousemove', function (e) {
    var X = e.pageX;
    var Y = e.pageY;
    $('.cool_thingy').css({
      'left': `-${X / 500}%`,
      'top': `-${(Y / 500)}%`,
      'transform': `scale(2.6) rotate(${(X - Y) / 200}deg)`
    });
  });
});
