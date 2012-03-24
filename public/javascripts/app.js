/* Foundation v2.1.2 http://foundation.zurb.com */
$(document).ready(function () {

	/* Use this js doc for all application specific JS */

	/* TABS --------------------------------- */
	/* Remove if you don't need :) */

	function activateTab($tab) {
		var $activeTab = $tab.closest('dl').find('a.active'),
		contentLocation = $tab.attr("href") + 'Tab';

		//Make Tab Active
		$activeTab.removeClass('active');
		$tab.addClass('active');

		//Show Tab Content
		$(contentLocation).closest('.tabs-content').find('li').hide();
		$(contentLocation).show();
	}

	$('dl.tabs').each(function () {
		//Get all tabs
		var tabs = $(this).children('dd').children('a');
		tabs.click(function (e) {
			activateTab($(this));
		});
	});

	if (window.location.hash) {
		activateTab($('a[href="' + window.location.hash + '"]'));
	}


	/* PLACEHOLDER FOR FORMS ------------- */
	/* Remove this and jquery.placeholder.min.js if you don't need :) */

	$('input, textarea').placeholder();

	/* DROPDOWN NAV ------------- */
	$('.nav-bar li a, .nav-bar li a:after').each(function() {
		$(this).data('clicks', 0);
	});
	$('.nav-bar li a, .nav-bar li a:after').bind('touchend click', function(e) {
		e.stopPropagation();
		e.preventDefault();
		var f = $(this).siblings('.flyout');
		$(this).data('clicks', ($(this).data('clicks') + 1));
		if (!f.is(':visible') && f.length > 0) {
			$('.nav-bar li .flyout').hide();
			f.show();
		}
	});
	$('.nav-bar li a, .nav-bar li a:after').bind(' touchend click', function(e) {
		e.stopPropagation();
		e.preventDefault();
		if ($(this).data('clicks') > 1) {
			window.location = $(this).attr('href');
		}
	});
	$('.nav-bar').bind('touchend click', function(e) {
		e.stopPropagation();
		if (!$(e.target).parents('.nav-bar li .flyout') || $(e.target) != $('.nav-bar li .flyout')) {
			e.preventDefault();
		}
	});
	$('body').bind('touchend', function(e) {
		if (!$(e.target).parents('.nav-bar lidocument .flyout') || $(e.target) != $('.nav-bar li .flyout')) {
			$('.nav-bar li .flyout').hide();
		}
	});

	var socket = io.connect('http://localhost:8888');
	var index = 0;

	socket.on('response', function (data) {
		var res = $.linkify(data.toString());
		$('#terminal').append($('<li class="response">').html(res));
	});

	var selected = null;
	$(document).on('keyup', function(e) {
		if (e.keyCode == 13) {
			var command = $.trim($('#command').val());
			if (command.length > 1) {
				$('#command').val('');
				$('#terminal').append($('<li class="command">').html(command));
				index = $('#terminal li.command').length;
				$('#terminal li.command').removeClass('active');
				socket.emit('message', { command: command });
			}
		}
		else if (e.keyCode == 38) {
			if (index === 0) {
				index = $('#terminal li.command').length;
			}
			else {
				index--;
			}
			selected = $('#terminal li.command:eq('+index+')');
			$(selected).addClass('active').siblings().removeClass('active');
			$('#command').val($(selected).html());
		}
		else if (e.keyCode == 40) {
			if (index === null || index == $('#terminal li.command').length) {
				index = 0;
			}
			else {
				index++;
			}
			selected = $('#terminal li.command:eq('+index+')');
			$(selected).addClass('active').siblings().removeClass('active');
			$('#command').val($(selected).html());
		}
	});
});
