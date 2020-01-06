// JavaScript Document
//this file requires jquery.dateFormat-1.0.js
$(document).ready(function(){

  function getTimeStamp(ts){
    if(ts.length != 26) return null;
    return ts.substring(5,24);
  }
  
  function setDayandDate(tsStart,eventTime,box){
    var theDay = getDayShort(tsStart,3),
    theDate = $.format.date(tsStart, "MMM d"),
    eventBox = $('.event-box',box),
    eventDay = $('.event-day',eventBox),
    eventDate = $('.event-date',eventBox);
    $('p',eventDay).html(theDay);
    $('p',eventDate).html(theDate);
    $('.event-headline .event-time',box).html(eventTime);
  }
  
  function getDayShort(ts,theLength){return $.format.date(ts, "ddd").substring(0,theLength)}
  
  function getEventTime(tsStart,tsEnd,timeFormatShort){
    var startTime=$.format.date(tsStart, "h:mm a"),endTime=$.format.date(tsEnd, "h:mm a"),startDate = $.format.date(tsStart, "yyMMdd"),
    endDate = $.format.date(tsEnd, "yyMMdd"),
    eventTime = '';        
    if((startDate==endDate && startTime == endTime)){
		eventTime = $.format.date(tsStart, timeFormatShort);;
		}
		else if((startDate==endDate)){
		eventTime = $.format.date(tsStart, timeFormatShort) + ' to ' + $.format.date(tsEnd, timeFormatShort);;
		}
		else if($.format.date(tsStart, "H")==1){
			eventTime = 'All Day';
			//console.log('Else #1');
		}else{
			  var 
			  //startDay = getDayShort(tsStart,2) + ' ';
			  //endDay = getDayShort(tsEnd,2) + ' ',
			  timeFormatLong = 'M/d h:mm a';
			  startTime = $.format.date(tsStart, timeFormatLong),
			  endTime = $.format.date(tsEnd, timeFormatLong);
			  //eventTime = startDay + startTime + ' - ' + endDay + endTime;
			  eventTime = startTime + ' - ' + endTime;
			  //console.log('Else #2');
			}
    return eventTime;
  }

  //{ts '2013-06-16 15:00:00'} <--sampe of xml string
  var eventBoxes = $('.luc-event');
  $(eventBoxes).each(function(){
    var tsStart = $('span.calendar-ts-start',this).html(),
    tsEnd = $('span.calendar-ts-end',this).html(),
    noEndDate = false,
    eventTime = '',
    timeFormatShort = 'h:mm a';
    if(typeof tsStart == 'undefined')return;
    tsStart = getTimeStamp(tsStart);
	//console.log(tsStart.substring(10,13));
    if(tsStart == null)return;
    if(typeof tsEnd == 'undefined')noEndDate == true;
    else {
      tsEnd = getTimeStamp(tsEnd);
      if(tsEnd == null)noEndDate == true;
    }
    if(noEndDate || ((tsStart.substring(10,13)) == 01)){
      eventTime = 'All Day';/*$.format.date(tsStart, timeFormatShort);*/
    }
    else {
      eventTime = getEventTime(tsStart,tsEnd,timeFormatShort);
    }
    setDayandDate(tsStart,eventTime,this);
  });
});