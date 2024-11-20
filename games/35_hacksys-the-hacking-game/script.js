$(document).ready(function() {
  var divx = document.getElementById('terminal');
  /* Welcome screen */
  $('#welcome-login').animate({'opacity': '1', 'top': $(window).height()/2 - $('#welcome-login').height()/2 }, 3000);

  setTimeout(function() {
      $('#login-input').animate({'opacity': '1'}, 3000);
  }, 4000);

  /* player login */
  var player_name = "Anonymous";
  var logged = 0;

  $('#login-input').keypress(function(e) {
    if(e.which === 13 && $(this).val() != '') {
      player_name = $(this).val();
      logged = 1;
      $('#welcome-login').animate({'opacity': '0'}, 1000);
      /* objectives */
      var help = 0;
      var list = 0;
      var connect = 0;
      var trojan = 0;
      var disconnect = 0;

      var won = 0;
      var able = 0;

      window.setInterval(function() {
        if (won === 0) {
          if (help === 1) {
            $('#objectives #help').css({'color': 'red'});
            $('#objectives #list').animate({'opacity': '1'}, 1000);
            if (list === 1) {
              $('#objectives #list').css({'color': 'red'});
              $('#objectives #connect').animate({'opacity': '1'}, 1000);
              if (connect === 1) {
                $('#objectives #connect').css({'color': 'red'});
                $('#objectives #trojan').animate({'opacity': '1'}, 1000);
                if (trojan === 1) {
                  $('#objectives #trojan').css({'color': 'red'});
                  $('#objectives #disconnect').animate({'opacity': '1'}, 1000);
                }
              }
            }
          }
        }

        if (disconnect === 1) {
          $('#objectives #disconnect').css({'color': 'red'});
        }

        if (minutes <= 1 && help === 1 && list === 1 && connect === 0 && trojan === 1 && disconnect === 1) {
          won++;
        }

        if (won === 1) {
          $('#objectives li').animate({'opacity': '0'}, 3000);
          $('#objectives #won').show(3000).animate({'opacity': '1'}, 3000);
        } else if (won > 1) {
          won = 2;
        }
      }, 1000);

      /* timer */
      var seconds = 0;
      var minutes = 0;
      var danger = 0;
      var lost = 0;

      window.setInterval(function() {
        if (connect === 1) {
          if (seconds < 10) {
            $('#time').text('Being traced: ' + minutes + ':0' +seconds);
          } else {
            $('#time').text('Being traced: ' + minutes + ':' +seconds);
          }
          if (seconds < 59) {
            seconds++;
          } else {
            seconds = 0;
            minutes++;
          }
          if (minutes >= 0 && seconds > 45) {
            $('#time').css({'color': 'red'});
            danger++;
          }
          if (danger === 1) {
            $('span').remove();
            $('#terminal').append('<div>You have 15 seconds left...<span id="blinking">_</span></div><br>');
            divx.scrollTop = divx.scrollHeight;
          } else if (danger > 1) {
            danger = 2;
          }
          if (minutes >= 1 && seconds > 0) {
            $('#time').text('You\'ve been traced down!');
            lost++;
            able = 0;
          }
          if (lost === 1) {
            $('span').remove();
            $('#terminal').append('<div>You\'ve been traced...<br>Formatting HDD...<br>Goodbye...<span id="blinking">_</span></div><br>');
            $('#objectives li').animate({'opacity': '0'}, 3000);
            $('#objectives #lost').show(3000).animate({'opacity': '1'}, 3000);
            divx.scrollTop = divx.scrollHeight;
            $('#objectives li').css({'color': 'green'}).animate({'opacity': '1'}, 3000);
            setTimeout(function() {
              $('#terminal').animate({'opacity': '0'}, 1000);
              $('#root').animate({'opacity': '0'}, 1000);
              $('input').animate({'opacity': '0'}, 1000).hide(3000);
              $('#objectives').animate({'opacity': '0'}, 1000);
              $('#time').animate({'opacity': '0'}, 1000);
              help = 0;
              list = 0;
              connect = 0;
              trojan = 0;
              disconnect = 0;
              won = 0;
              $('#objectives li').css({'color': 'green'});
            }, 20000);
          } else if (lost > 1) {
            lost = 2;
          }
        }
      }, 1000);

      setTimeout(function(){
        $('#terminal').animate({'opacity': '1'}, 1000);
      }, 1000);

      setTimeout(function(){
        $('#root').animate({'opacity': '1'}, 1000);
        $('input').animate({'opacity': '1'}, 1000).show();
      }, 5000);

      setTimeout(function(){
        $('span').remove();
        $('#terminal').append('<br><div>Welcome to _hackSYS [v3.6.333].<br>47corporation<br><br>' + player_name + ' authenticated.<br>_hackSYS ready for use<br>Use the help command for a list of commands<br><br><span id="initial-root">___</span>&nbsp;&nbsp;&nbsp;<span id="blinking">_</span></div>');
      }, 6500);

      setTimeout(function() {
        $('#time').animate({'opacity': '1'}, 3000);
        $('#objectives').animate({'opacity': '1'}, 3000);
      }, 7000);

      setTimeout(function() {
        $('#objectives #help').animate({'opacity': '1'}, 500);
        able = 1;
      }, 10000);

      $('#input').keypress(function(e) {
          if(e.which === 13 && $(this).val() != '' && able === 1) {
            $('div span').remove();
            $('initial-root').remove();

            /* 
             * List of commands available in the game:
             * 
             * help
             * list
             * connect nearest-phone-relay
             * send trojan
             * send adware
             * disconnect
             * exit
             * 
             */

            switch( $(this).val() ) {
              case 'help':
                $('#terminal').append('<div>$&nbsp;&nbsp;&nbsp;' + $(this).val() + '<br>List of commands:<br>help - Show this message [command list]<br>connect [DNS name] - Connects host computer with the targeted DNS name<br>disconnect - Disconnects host computer from the connected DNS name<br>exit - Shuts down host computer<br>list - Shows the list of the currently available applications<br>send [application type] - Sends given application name to the connected DNS name<span id="blinking">_</span></div>');
                help = 1;
                break;
              case 'connect nearest.phone.relay':
                if (connect === 0) {
                  $('#terminal').append('<div>$&nbsp;&nbsp;&nbsp;' + $(this).val() + '<br>Connecting...<br>Connected.<br>You have 1 minute before your location is exposed<span id="blinking">_</span></div>');
                  connect = 1;
                } else {
                  $('#terminal').append('<div>$&nbsp;&nbsp;&nbsp;' + $(this).val() + '<br>You are already connected to nearest.phone.relay.<span id="blinking">_</span></div>');
                }
                break;
              case 'list':
                $('#terminal').append('<div>$&nbsp;&nbsp;&nbsp;' + $(this).val() + '<br>List of currently available applications:<br>AdBreak - bombard targeted computer with advertisement pop-ups [type: adware]<br>Trojan.NightShade.666 - steals vital information from the targeted computer [type: trojan]<span id="blinking">_</span>');
                list = 1;
                break;
              case 'send trojan':
                if (connect === 1) {
                  $('#terminal').append('<div>$&nbsp;&nbsp;&nbsp;' + $(this).val() + '<br>Sending Trojan.NightShade.666...<br>Trojan.NightShade.666 sent<span id="blinking">_</span></div>');
                  trojan = 1;
                } else {
                  $('#terminal').append('<div>$&nbsp;&nbsp;&nbsp;' + $(this).val() + '<br>You are not connected to any DNS name<span id="blinking">_</span></div>');
                }
                break;
              case 'send adware':
                if (connect === 1) {
                  $('#terminal').append('<div>$&nbsp;&nbsp;&nbsp;' + $(this).val() + '<br>Sending AdBreak...<br>Unable to send AdBreak.<span id="blinking">_</span></div>');
                } else {
                  $('#terminal').append('<div>$&nbsp;&nbsp;&nbsp;' + $(this).val() + '<br>You are not connected to any DNS name<span id="blinking">_</span></div>');
                }
                break;
              case 'disconnect':
                if (connect === 1) {
                  $('#terminal').append('<div>$&nbsp;&nbsp;&nbsp;' + $(this).val() + '<br>Disconnecting...<br>Disconnected<span id="blinking">_</span></div>');
                  disconnect = 1;
                  connect = 0;
                  minutes = 0;
                  seconds = 0;
                } else {
                  $('#terminal').append('<div>$&nbsp;&nbsp;&nbsp;' + $(this).val() + '<br>You are not connected to any DNS name<span id="blinking">_</span></div>');
                }
                break;
              case 'exit':
                $('#terminal').animate({'opacity': '0'}, 1000);
                $('#root').animate({'opacity': '0'}, 1000);
                $('input').animate({'opacity': '0'}, 1000).hide(3000);
                $('#objectives').animate({'opacity': '0'}, 1000);
                $('#time').animate({'opacity': '0'}, 1000);
                help = 0;
                list = 0;
                connect = 0;
                trojan = 0;
                disconnect = 0;
                won = 0;
                $('#objectives li').css({'color': 'green'});
                break;
              default:
                $('#terminal').append('<div>$&nbsp;&nbsp;&nbsp;' + $(this).val() + '<br>Command not recognized<span id="blinking">_</span></div>');
            }
            $('#terminal').append('<br>');

            divx.scrollTop = divx.scrollHeight;
            $(this).val('');
          }
      });
    }
  });
});