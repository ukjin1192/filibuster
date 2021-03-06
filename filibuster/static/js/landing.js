$(document).on('click', '.landing-page__footer', function() {
  $.fn.fullpage.moveSectionDown();
});

$(window).load(function() {
	var showNavigationMessage;

	$('#fullpage-container').fullpage({
		anchors: ['1', '2', '3', '4', '5', '6'],
		animateAnchor: true,
		controlArrows: true,
    fixedElements: '.header, .footer--fixed',
		recordHistory: true,
    
    afterRender: function() {
      // Show info message about navigation to next section
      showNavigationMessage = setTimeout(function() {
        $('.landing-page__footer').animate({opacity: 1}, 700);
      }, 2500);
    },
		
		afterLoad: function(anchorLink, index){
			var loadedSection = $(this);
		
			if (anchorLink == '2') {
				setTimeout(function() {
					$('#speaker-list').typed({
						strings: ['김광진의', '문병호의', '은수미의', '박원석의', '유승희의', '최민희의', '김제남의', '신경민의', '강기정의', '김경협의', '서기호의', '김현의', '김용익의', '배재정의', '전순옥의', '추미애의', '정청래의', '진선미의', '최규성의', '오제세의', '박혜자의', '권은희의', '이학영의', '홍종학의', '서영교의', '최원식의', '홍익표의', '이언주의', '전정희의', '임수경의', '안민석의', '김기준의', '김관영의', '박영선의', '주승용의', '정진후의', '심상정의', '이종걸의', '38명의'],
						typeSpeed: 100
					});
				}, 1000);
			}
			else if (anchorLink == '3') {
				$('#total-comments').typed({
					strings: ['38,268명'],
					typeSpeed: 100
				});
			}
			else if (anchorLink == '4') {
				$('#nickname-list').typed({
					strings: ['나의', '반대하면나와서얘기해 님의', '윤동주 님의', 'Kate 님의', '8ㅁ8 님의', '55살아줌마 님의', '고3 님의', '시윤아빠 님의', '보경엄마 님의', '익명77 님의', '내귀에도청장치 님의', '몽테스키에 님의'],
					typeSpeed: 100
				});
			}
			else if (anchorLink == '6') {
        window.location.href = '/menu/#main';
        return false;
      }
		},
		
		onLeave: function(index, nextIndex, direction){
			var leavingSection = $(this);
      
      if (nextIndex == 6) {
        window.location.href = '/menu/#main';
        return false;
      }
    
			clearTimeout(showNavigationMessage);
			$('.landing-page__footer').animate({opacity: 0}, 700);
      
      // Show info message about navigation to next section
      showNavigationMessage = setTimeout(function() {
        $('.landing-page__footer').animate({opacity: 1}, 700);
      }, 2500);
		},
	});
});
