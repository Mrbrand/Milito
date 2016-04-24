 var counter = 0;
    var Latitude; 
    var Longitude;
    var player_id = 1;
    var map = L.map('map').setView([59.09837, 17.57529], 16);
    var obj=[];
    var playerArray = [];
    var itemArray = [];
    var playerGroup = L.featureGroup(itemArray).addTo(map);
    var itemGroup = L.featureGroup(itemArray).addTo(map);
    
    var iconImages = ["soldier1", "soldier2", "soldier3", "soldier4", "bomb", "coins"];
    var icon = [];
    L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
        id: 'examples.map-i875mjb7'
    }).addTo(map);
    
    /*var polygon = L.polygon([
        [59.083, 17.534],
        [59.105, 17.534],
        [59.105, 17.585],
        [59.083, 17.585],
    ]).addTo(map);*/
    
    iconImages.forEach(function(iconImage) {
        icon[iconImage] = L.icon({
            iconUrl: 'img/'+iconImage+'.png',
            iconSize:     [48, 48], // size of the icon
            iconAnchor:   [24,24], // point of the icon which will correspond to marker's location
        });
    
    });
    
   /* var soldier2 = L.icon({
        iconUrl: 'img/soldier2.png',
        iconSize:     [48, 48], // size of the icon
        iconAnchor:   [24,24], // point of the icon which will correspond to marker's location
    });
    
    var soldier3 = L.icon({
        iconUrl: 'img/soldier3.png',
        iconSize:     [48, 48], // size of the icon
        iconAnchor:   [24,24], // point of the icon which will correspond to marker's location
    });
    
    var soldier4 = L.icon({
        iconUrl: 'img/soldier4.png',
        iconSize:     [48, 48], // size of the icon
        iconAnchor:   [24,24], // point of the icon which will correspond to marker's location
    });
    
    var coins = L.icon({
        iconUrl: 'img/Bag_Of_Coins.png',
        iconSize:     [24, 24], // size of the icon
        iconAnchor:   [12,12], // point of the icon which will correspond to marker's location
    });
    
    var bomb = L.icon({
        iconUrl: 'img/grey_bomb.png',
        iconSize:     [24, 24], // size of the icon
        iconAnchor:   [12,12], // point of the icon which will correspond to marker's location
    });
  */
  
  
  
    setInterval(function(){
    
        $.post("http://betarabbit.com/milito/handler.php?player", {lat: Latitude, lon: Longitude, id: player_id}, function(result){
            var obj;
           
            obj = JSON.parse(result);
            console.log(Longitude);
            itemArray = [];
            playerArray = [];
            $("#playerlist").html("");
            
            obj.forEach(function(item) {  
                if(item.type == "player"){
                    itemArray.push(L.marker([item.lat, item.lon], {icon: icon[item['icon']]}));
                    $("#playerlist").append("<img src='img/"+item.icon+".png' style='height:24px;'/>");
                    $("#playerlist").append("<span style='font-weight:bold;'>" +item.name+"("+item.id+")</span>"); 
                    $("#playerlist").append(" dist:"+(getDistanceFromLatLonInKm(Latitude,Longitude,item.lat,item.lon)*1000).toFixed(0)+" m");
                    $("#playerlist").append(" time:"+item.time.substring(10)+"<br/>");
                }
                
                else if(item.type == "coins"){
                    itemArray.push(L.marker([item.lat, item.lon], {icon: icon[item.icon]}));
                }
                
                else if(item.type == "bomb"){
                    itemArray.push(L.marker([item.lat, item.lon], {icon: icon[item.icon]}));
                }
                

                /*if(item.type == "player"){
                    if (item.text=="soldier1") playerArray.push(L.marker([item.lat, item.lon], {icon: icon[item.icon]}).bindPopup("Player: "+item.name));
                    else if (item.text=="soldier2") playerArray.push(L.marker([item.lat, item.lon], {icon: soldier2}));
                    else if (item.text=="soldier3") playerArray.push(L.marker([item.lat, item.lon], {icon: soldier3}));
                    else if (item.text=="soldier4") playerArray.push(L.marker([item.lat, item.lon], {icon: soldier4}));
                   
                }
               
                
                else if(item.type == "bomb"){
                    itemArray.push(L.marker([item.lat, item.lon], {icon: icon[item.icon]}));
                }*/
            });
            
            map.removeLayer(itemGroup); 
            itemGroup = L.featureGroup(itemArray).addTo(map);
            map.removeLayer(playerGroup); 
            playerGroup = L.featureGroup(playerArray).addTo(map);
            
        });
            
    }, 1000);
    
    
    
    navigator.geolocation.watchPosition(function(position){
    
        // These variables update every time the location changes
        Latitude = position.coords.latitude;
        Longitude = position.coords.longitude;
        console.log(Longitude);
        $("#counter").html(counter++);
        
    }, function(error){
        // You can detect the reason and alert it; I chose not to.   
        alert('We could not get your location');
    },{
        // It'll stop looking after an hour. Enabling high accuracy tells it to use GPS if it's available  
        timeout: 1000,
        maximumAge: 600000,
        enableHighAccuracy: true
    });
    
    
    
    function place_item(type){

        $.post("handler.php?create_item",{lat: Latitude, lon: Longitude, type: type, id: player_id, icon: type});
        var snd = new Audio("audio/Ahoohoo.wav"); // buffers automatically when created
        snd.play();
    
    }
    
    
    
    function getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2) {
      var R = 6371; // Radius of the earth in km
      var dLat = deg2rad(lat2-lat1);  // deg2rad below
      var dLon = deg2rad(lon2-lon1); 
      var a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
        Math.sin(dLon/2) * Math.sin(dLon/2)
        ; 
      var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
      var d = R * c; // Distance in km
      return d;
    }
    
    function deg2rad(deg) {
        return deg * (Math.PI/180)
    }
    
