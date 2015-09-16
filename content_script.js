/**
 * Add Arbiter Schedule to Google Calendar.
 */

function addToCalendar(index, className) {
  var row = $('.dataGrids tr.' + className).eq(index);
  var title = 'Game #';
  title += row.children().eq(0).text().trim();
  title += ' (';
  title += row.children().eq(2).text().trim();
  title += ')';
  var d = row.children().eq(4).text().trim();
  var year = d.split(' ')[0].split('/')[2];
  var month = d.split(' ')[0].split('/')[0];
  if (month.length < 2) { month = '0' + month; }
  var day = d.split(' ')[0].split('/')[1];
  if (day.length < 2) { day = '0' + day; }
  var hour = d.split(' ')[2].split(':')[0];
  if (d.split(' ')[3] == "PM") { hour = '' + (parseInt(hour) + 12); }
  if (hour.length < 2) { hour = '0' + hour; }
  var minute = d.split(' ')[2].split(':')[1];
  if (minute.length < 2) { minute = '0' + minute; }
  var dateTime = year + month + day + 'T' + hour + minute + '00';
  dateTime += '/';
  dateTime += year + month + day + 'T' + (parseInt(hour) + 1) + minute + '00';
  var description = '';
  description += row.children().eq(5).text().trim();
  description += '\n\n';
  description += row.children().eq(7).text().trim();
  description += ' vs ';
  description += row.children().eq(8).text().trim();
  description += '\n\n';
  description += 'Site: ';
  description += row.children().eq(6).text().trim();
  description += '\n\n';
  description += 'Fee: ';
  description += row.children().eq(9).text().trim();
  description += '\n\n';
  // request to get site address.
  var siteUrl = row.children().eq(6).children('a').eq(0).attr('href');
  $.get(siteUrl, function(data) {
    var dom = $.parseHTML(data);
    var addresses = $(dom).find("[title='Locate']");
    var siteAddress = '';
    for (var i = 0; i < addresses.children().length; ++i) {
      var toAppend = addresses.children().eq(i).text().trim();
      siteAddress += toAppend;
      if (toAppend != '' && i != addresses.children().length - 1) {
        siteAddress += ' ';
      }
    }
    // request to get other officials' details.
    var gameUrl = row.children().eq(0).children('a').eq(0).attr('href');
    $.get(gameUrl, function(data) {
      var dom = $.parseHTML(data);
      var rows = $(dom).find('.dataGrids').eq(1).find('tr');
      var officials = 'Officials:\n';
      for (var j = 1; j < rows.length; ++j) {
        var row = rows.eq(j);
        officials += row.children().eq(2).text().trim();
        officials += ' - ';
        officials += row.children().eq(0).text().trim();
        officials += ' - ';
        var phone = row.children().eq(5).find('option').eq(0).text().trim();
        if (phone == '') {
          phone = 'N/A';
        }
        officials += phone;
        officials += '\n';
      }
      description += officials;
      var url = 'https://www.google.com/calendar/render?action=TEMPLATE';
      url += '&text=';
      url += encodeURIComponent(title);
      url += '&dates=';
      url += encodeURIComponent(dateTime);
      url += '&location='
      url += encodeURIComponent(siteAddress);
      url += '&details=';
      url += encodeURIComponent(description);
      var newTab = window.open(url, '_blank');
      newTab.focus();
    });
  });
}

function addLink(index, tr) {
  var id = 'a' + Math.round(Math.random() * 100000000);
  var wstr = '';
  wstr += '<td>';
  wstr += '<a href="javascript:void(0);" id="' + id + '">';
  wstr += '[GCal]';
  wstr += '</a>';
  wstr += '</td>';
  $(tr).append(wstr);
  document.getElementById(id).addEventListener("click", function() {
    addToCalendar(index, $(tr).attr('class'));
  });
}

if (window.location.href.indexOf('GameScheduleEdit.aspx') >= 0) {
  $('.dataGrids tr.items').each(addLink);
  $('.dataGrids tr.alternatingItems').each(addLink);
}
