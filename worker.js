
onmessage = function (e) {
	var msg = e.data;
	var dist = 	calc(msg.lat1,msg.lon1,msg.lat2,msg.lon2);
	postMessage({ distance: dist , lat2: msg.lat2, lon2: msg.lon2});
}


function calc(lat1,lon1,lat2,lon2){
	var la1 = toRads(lat1);
	var la2 = toRads(lat2);

	var dl = toRads(lat2-lat1);
	var dln = toRads(lon2-lon1);

	var a = Math.sin(dl/2)*Math.sin(dl/2)+Math.cos(la1)*Math.cos(la2)*Math.sin(dln/2)*Math.sin(dln/2);
	var c = 2*Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
	var d = 6371*c;

return Math.round(d*100)/100;
}
function toRads(x) {
	return x*Math.PI/180;
}