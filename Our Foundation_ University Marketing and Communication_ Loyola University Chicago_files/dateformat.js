// JavaScript Document
function formatLength(value,start,end,trailing) {
    value = value.slice(start,end);
    if(trailing!='') {
        value = value+trailing;
    } else {
        value = value.split(' ');
        value = value[1]+' '+value[0]+', '+value[2];
    }
    document.write(value);
}

function formatDate (input) {
  var datePart = input.match(/\d+/g),
  year = datePart[0],
  month = datePart[2], day = datePart[1];

var monthNames = [ "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sept", "Oct", "Nov", "Dec" ];

var d = new Date(input);

var weekday=new Array(7);
weekday[0]="Sun.";
weekday[1]="Mon.";
weekday[2]="Tues.";
weekday[3]="Wed.";
weekday[4]="Thurs.";
weekday[5]="Fri.";
weekday[6]="Sat.";

document.write(month+'/'+day+'/'+year);
}