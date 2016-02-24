var firebaseRepoURL, firebaseConnection;

function d_timer(){
  // set k_time
  d = new Date();
  utc = d.getTime() + (d.getTimezoneOffset() * 60000);
  now = new Date(utc + (3600000*9));

  //set d_day
  d_day = new Date("Mar 10 2016 23:59:59"); // set march 10 2016

  //days = (d_day - now) / 1000 / 60 / 60 / 24;
  //d_interval = Math.floor(days);
  hours = (d_day - now) / 1000 / 60 / 60 ; 
  h_interval = Math.floor(hours);
  minutes = (d_day - now) / 1000 /60 - (60 * h_interval);
  m_interval = Math.floor(minutes);
  seconds = (d_day - now) / 1000 - (60 * 60 * h_interval) -
  (60 * m_interval); 
  secondsRound = Math.round(seconds);

  // variable for display
  sec = "초"
  min = "분 "
  hr = "시간 "
  dy = " 일"

  var d_value = h_interval + hr + m_interval + min + secondsRound + sec;
  $('.due-timer').text(d_value);
  newtime = window.setTimeout("d_timer();", 1000);
}

// Prevent CSRF token problem before sending reqeust with ajax
function setCSRFToken() {
  $.ajaxSetup({
    headers: {
      'X-CSRFToken': $.cookie('csrftoken')
    }
  });
}

function getCaptcha() {
  $.ajax({
    url: '/captcha/refresh/',
    type: 'GET'
  }).done(function(data) {
    $('#captcha-image').attr('src', data.image_url);
    $('#captcha-key').val(data.key);
  }); 
}

function getComments(firstCommentID, lastCommentID, position) {
  $('#loading-icon').removeClass('hidden');

  $.ajax({
    url: '/api/comments/list/',
    type: 'GET',
    data: {
      'first_comment_id': firstCommentID,
      'last_comment_id': lastCommentID
    }
  }).done(function(data) {
    var comments = data.comments;
    
    if (position == 'prepend') comments = _.orderBy(comments, 'id', 'asc');
    else comments = _.orderBy(comments, 'id', 'desc');
    
    comments.forEach(function(comment, index) {
      var $comment = $('#comment-virtual-dom').clone().removeClass('hidden').removeAttr('id');
      $comment.attr('data-comment-id', comment.id);
      $comment.find('.comment-nickname').text(comment.id + '번째 주자 - ' + comment.nickname + ' 님');
      $comment.find('.comment-content').text(comment.content);
      $comment.find('.comment-speaker').text(comment.speaker);
      $comment.find('.comment-created-at').text(comment.created_at);
      $comment.find('.comment-updated-at').text(comment.updated_at);
      
      if (position == 'prepend') $('#comment-list').prepend($comment);
      else $('#comment-list').append($comment); 
    });
    
    // Update new comment ID
    if (position == 'prepend') $('#new-comment-id').text(lastCommentID + 1);
  }).always(function() {
    $('#loading-icon').addClass('hidden');
  });
}

$(document).on('click', '#refresh-captcha', getCaptcha);

$(document).on('submit', '#create-comment-form', function(event) {
  event.preventDefault();

  $('#loading-icon').removeClass('hidden');
  $('#captcha-group').removeClass('has-error');
  $('#success-message, #fail-message').addClass('hidden');

  setCSRFToken();

  $.ajax({
    url: '/api/comments/create/',
    type: 'POST',
    data: {
      'captcha_key': $('#captcha-key').val(),
      'captcha_value': $('#captcha-value').val().replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, ''),
      'nickname': $('#nickname').val().replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, ''),
      'content': $('#content').val().replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, '')
    }
  }).done(function(data) {
    if (data.state == 'success') {
      $('#nickname, #content').val('');
      $('#success-message').removeClass('hidden');
      getCaptcha();
    } else {
      $('#captcha-group').addClass('has-error');
      $('#fail-message').removeClass('hidden');
    }
  }).always(function() {
    $('#loading-icon').addClass('hidden');
  });
});

$('#realtime-switch').change(function() {
  if ($(this).prop('checked') == false) {
    Firebase.goOffline();
  } else {
    Firebase.goOnline();
  }
});

$(window).scroll(function() {
   if($(window).scrollTop() + $(window).height() == $(document).height()) {
      var lastCommentID = parseInt($('#comment-list .comment').last().attr('data-comment-id')) - 1;
      if (lastCommentID > 0) getComments(Math.max(lastCommentID - 9, 1), lastCommentID, 'append');
   }
});

$(window).load(function() {
  firebaseRepoURL = $('#firebase-repo-url').val();
  firebaseConnection = new Firebase(firebaseRepoURL + 'comment/');

  getCaptcha();

  $('#loading-icon').addClass('hidden');

  // Ease effect when body DOM loads
  $("body").animate({ opacity: 1 }, 700);

  firebaseConnection.child('last_comment_id/').once('value', function(snapshot) {
    var lastCommentID = parseInt(snapshot.val());
    getComments(Math.max(lastCommentID - 9, 1), lastCommentID, 'prepend');
  });

  firebaseConnection.on('child_changed', function(snapshot) {
    var originalLastCommentID = parseInt($('#comment-list .comment').first().attr('data-comment-id'));
    if (snapshot.key() == 'last_comment_id') getComments(originalLastCommentID, parseInt(snapshot.val()), 'prepend');
  });

  // Attach fast-click to boost up touch reaction
  FastClick.attach(document.body);

  // Due timer
  d_timer(); 
});
