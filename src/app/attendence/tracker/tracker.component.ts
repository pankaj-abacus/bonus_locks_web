import { Component, OnInit, Input,ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrManager } from 'ng6-toastr-notifications';
import { DatabaseService } from 'src/_services/DatabaseService';
import * as Highcharts from 'highcharts/highmaps';
import { MatSliderChange } from '@angular/material/slider';
import * as moment from 'moment';
declare var google;

@Component({
  selector: 'app-tracker',
  templateUrl: './tracker.component.html'
})
export class TrackerComponent implements OnInit {
  @ViewChild('mapElement') mapElement: ElementRef;
  tabType: any = 'Live';
  payload: any = {};
  filter: any = {};
  selectedDate: any;
  empData: any = {};
  checkin_data: any = [];
  skLoading: boolean = false
  battery: any = [];
  batteryTime: any = [];
  marker1: any;
  map: any;
  route: any;
  batteryChart: any;
  pathCoords: any = [];
  latestLocation: any = {}
  btnValue: boolean = true
  sliderValue = 0;
  animationInterval: any;
  mapVisible: boolean = true;
  today_date: any = new Date();
  waypoints = [];
  location: any = [];
  origin: any;
  destination: any;
  lat: any;
  lng: any;
  padding0: any;
  @Input() dataToReceive: any;
  // marker: google.maps.Marker;
  marker:any;
  location_timeanddate:any;
  Locationtype:any;
  distance:any;
  Totaldistance:any;
  Trackerlat:any;
  Trackerlng:any;
//   locations = [
//       { lat: 28.75838819223334, lng: 77.19474652522977, timestamp: '2023-09-24 08:00:00' },
//     { lat: 28.76193138775358, lng: 77.18673513124632, timestamp: '2023-09-24 08:15:00' },
//     { lat: 28.766550015628624,  lng: 77.18262117217373, timestamp: '2023-09-24 08:30:00' },
//     { lat: 28.783504321702427, lng: 77.17995070756805, timestamp: '2023-09-24 08:45:00' },
//     { lat: 28.78635085660346, lng: 77.18760122794866, timestamp: '2023-09-24 09:00:00' },
//     { lat: 28.78616109002733, lng: 77.19474652528527, timestamp: '2023-09-24 09:15:00' },
//     { lat: 28.780605217652525, lng:  77.20100103344859, timestamp: '2023-09-24 09:30:00' },
//     { lat: 28.775617610369807,  lng: 77.2045224646185, timestamp: '2023-09-24 09:45:00' },
//     { lat: 28.769623219537,  lng: 77.2072273318041, timestamp: '2023-09-24 10:00:00' },
//     { lat: 28.76125733751143,  lng:77.21136118578536, timestamp: '2023-09-24 10:15:00' },
// ];

  constructor(public router: ActivatedRoute, public service: DatabaseService, public toast: ToastrManager,public rout:Router) {

  }
  // ngAfterViewInit() {
  //   this.getSlidertracker()
  //   }

  ngOnInit(): void {
    if (this.dataToReceive != undefined) {
      this.padding0 = this.dataToReceive.padding0;
      this.payload = { 'start_date': this.dataToReceive.start_date, 'user_id': this.dataToReceive.user_id };
      this.getDetails();
    } else {
      this.router.params.subscribe(params => {
        this.payload = this.router.queryParams['_value'];
        if (this.payload) {
          this.selectedDate = this.filter.date = this.payload.start_date;
          console.log('selected date',this.selectedDate)
          this.getDetails();
        }
      });
    }
  
    setTimeout(() => {
      this.initializeMap();
    }, 2000);
  }




  defaultCoordinates: any = {}
  getDetails() {
    this.skLoading = true;
    let header
    if (this.filter.date) {
      header = { 'start_date': this.filter.date, 'user_id': this.payload.user_id }
    }
    else {
      header = this.payload;
    }
    this.service.post_rqst(header, "Location/getLatestGeoLocation")
      .subscribe((result => {
        if (result['statusCode'] == 200) {
          this.empData = result['user_data'];
          this.latestLocation = result['latest_location'];

          this.defaultCoordinates = { lat: result['latest_location']['lat'], lng: result['latest_location']['lng'] };
          this.pathCoords = result['data'];
          setTimeout(() => {
            this.initializeMap();
          }, 100);
          this.location = result['data'];
          this.skLoading = false;
        } else {
          this.toast.errorToastr(result['statusMsg'])
          this.skLoading = false;
        }
      }))
  }
  locationMarkers: any = [];


  initializeMap(): void {
    this.locationMarkers = this.location;
    let latLng = new google.maps.LatLng(this.location[0].lat, this.location[0].lng);
    let mapOptions = {
      center: latLng,
      zoom: 17,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
    };

    this.map = new google.maps.Map(document.getElementById('map'), {
      center: { lat: this.latestLocation.lat, lng: this.latestLocation.lng },
      zoom: 18,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    });

    const currentLocationMarker = new google.maps.Marker({
      position: latLng,
      map: this.map,
      title: 'Current Location',
    });

    if (this.tabType == 'Live') {
      var marker = new google.maps.Marker({
        position: this.defaultCoordinates,
        map: this.map
      });
    }

    if (this.tabType == 'Tracker') {
      const directionsService = new google.maps.DirectionsService();
      const polylinePath = this.locationMarkers.map(point => ({
        lat: point.lat,
        lng: point.lng,
        type: point.type,
      }));



      polylinePath.forEach((point, index) => {
        let customMarkerIcon
        if (point.type == 'Checkin') {
          customMarkerIcon = {
            url: './assets/location/checkin.png',
            scaledSize: new google.maps.Size(30, 30),
          }
        }
        else if (point.type == 'Attendence Start' || point.type == 'Attendence Stop') {
          customMarkerIcon = {
            url: './assets/location/start_point.png',
            scaledSize: new google.maps.Size(30, 30),
          }
        }
        else {
          customMarkerIcon = {
            url: './assets/location/location.png',
            scaledSize: new google.maps.Size(30, 30),
          }
        }

        new google.maps.Marker({
          position: point,
          map: this.map,
          title: `Waypoint ${index + 1}`,
          icon: customMarkerIcon,
        });
      });

      const waypoints = polylinePath.slice(); // Make a copy of all waypoints
      const chunkSize = 23; // Max waypoints per request

      const processChunk = () => {
        if (waypoints.length > 1) {
          const chunk = waypoints.splice(0, chunkSize);
          const origin = chunk[0];
          const destination = chunk[chunk.length - 1];

          directionsService.route(
            {
              origin,
              destination,
              waypoints: chunk.slice(1, -1).map(coord => ({
                location: coord,
                stopover: true,
              })),
              travelMode: google.maps.TravelMode.WALKING,
              provideRouteAlternatives: false,
            },
            (response, status) => {
              if (status === google.maps.DirectionsStatus.OK) {
                const directionsRenderer = new google.maps.DirectionsRenderer({
                  map: this.map,
                  suppressMarkers: true,
                  hideRouteList: true,
                  preserveViewport: false,
                  suppressPolylines: false,
                  polylineOptions: {
                    strokeColor: '#081099',
                    strokeOpacity: 1,
                    strokeWeight: 5,
                    icons: [{
                      repeat: '30px',
                      icon: {
                        path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
                        scale: 1,
                        fillOpacity: 0,
                        strokeColor: '#ffffff',
                        strokeWeight: 1,
                        strokeOpacity: 1
                      }
                    }]
                  },
                });

                directionsRenderer.setDirections(response);
                processChunk(); // Continue with the next chunk
              } else {
                // Handle error if needed
              }
            }
          );
        } else {
          // All waypoints processed
          // this.animateMarkerAlongPath(currentLocationMarker, polylinePath);
        }
      };


      processChunk();
    }
  }






  animateMarkerAlongPath(marker, path) {
    let i = 0;
    const animationSpeed = 2000; 

    function animate() {
      if (i < path.length - 1) {
        const startPosition = path[i];
        const endPosition = path[i + 1];
        const fraction = i / (path.length - 1);

        const lat = startPosition.lat + fraction * (endPosition.lat - startPosition.lat);
        const lng = startPosition.lng + fraction * (endPosition.lng - startPosition.lng);

        const newPosition = new google.maps.LatLng(lat, lng);
        marker.setPosition(newPosition);
        marker.setIcon('./assets/location/mover.png');
        i++;
        setTimeout(animate, animationSpeed);
      }
    }

    animate();
  }

  refresh() {
    this.getDetails();
  }

  refreshData() {  
    this.filter.date = moment(this.today_date).format('YYYY-MM-DD');
    this.getDetails();
    this.selectedDate = this.today_date;
  }


  dateFormat(): void {
    this.filter.date = moment(this.selectedDate).format('YYYY-MM-DD');
    this.getDetails();
  }



  getBatteryInfo() {
    this.skLoading = true;
    let payLoad = { 'date': this.payload.start_date, 'user_id': this.payload.user_id }

    this.service.post_rqst(payLoad, "Location/dateWiseBatteryConsumption")
      .subscribe((result => {
        if (result['statusCode'] == 200) {
          for (let i = 0; i < result['data'].length; i++) {
            const batteryValue = parseFloat(result['data'][i]['battery']) * 100;
            const roundedBatteryValue = parseFloat(batteryValue.toFixed(2));
            const formattedTime = moment(result['data'][i]['date']).format('h:mm a');
            this.battery.push(roundedBatteryValue);
            this.batteryTime.push(formattedTime);

          }
          this.skLoading = false;
          this.batteryChart = {
            type: "line",
            scaleX: {
              labels: this.batteryTime,
              "step": "86400000",
              // "transform": {
              //   "type": "date",
              //   "all": "%d<br/>Date & Time"
              // },
              "item": {
                "font-size": 9
              },
            },
            "tooltip": {
              "visible": false
            },
            plot: {
              aspect: "spline",
              "tooltip-text": "%t views: %v<br>%k",
              "shadow": 0,
              "line-width": "2px",
              "marker": {
                "type": "circle",
                "size": 3
              }
            },
            plotarea: {
              backgroundColor: 'transparent',
              marginTop: '20px',
            },
            "crosshair-x": {
              "line-color": "#efefef",
              "plot-label": {
                "border-radius": "5px",
                "border-width": "1px",
                "border-color": "#f6f7f8",
                "padding": "10px",
                "font-weight": "bold"
              },
              "scale-label": {
                "font-color": "#000",
                "background-color": "#f6f7f8",
                "border-radius": "5px"
              }
            },
            series: [{
              values: this.battery,
              monotone: true,
              text: "Battey Percent",
              lineColor: '#0071bd',
              "marker": {
                "background-color": "#0071bd",
              },

            },
            ]
          }

        } else {
          this.toast.errorToastr(result['statusMsg'])
          this.skLoading = false;
        }
      }))
  }

  startAnimation() {
    this.stopAnimation();
    this.animationInterval = setInterval(() => {
      if (this.sliderValue < this.pathCoords.length - 1) {
        this.sliderValue++;
        const latLng = new google.maps.LatLng(
          this.pathCoords[this.sliderValue].lat,
          this.pathCoords[this.sliderValue].lng
        );
        this.moveMarker(this.map, this.marker1, latLng);
        this.map.panTo(latLng);
      } else {
        this.stopAnimation();
      }
    }, 1500); // Adjust animation interval as needed
  }


  moveMarker(map, marker1, latlng) {
    marker1.setPosition(latlng);
    map.panTo(latlng);
  }


  autoRefresh() {
    let i;
    this.route = new google.maps.Polyline({
      path: [],
      geodesic: true,
      strokeColor: '#0B0080',
      strokeOpacity: 1.0,
      strokeWeight: 3,
      editable: false,
      map: this.map
    });

    this.marker1 = new google.maps.Marker({ map: this.map, icon: './assets/location/location.png' });

    for (i = 0; i < this.pathCoords.length; i++) {
      setTimeout((coords: any) => {
        const latlng = new google.maps.LatLng(coords.lat, coords.lng);
        this.route.getPath().push(latlng);
        this.moveMarker(this.map, this.marker1, latlng);
      }, 3000 * i, this.pathCoords[i]);
    }
    this.startAnimation();
  }

  stop(): void {
    this.route.setMap(null);
    this.marker1.setMap(null);
    this.marker1 = null;
  }


  stopAnimation() {
    clearInterval(this.animationInterval);
  }

  sliderChanged(event: MatSliderChange) {
    this.sliderValue = event.value;
    const latLng = new google.maps.LatLng(
      this.pathCoords[this.sliderValue].lat,
      this.pathCoords[this.sliderValue].lng
    );
    this.moveMarker(this.map, this.marker1, latLng);
    this.map.panTo(latLng);
  }
  // gotoPlayback(){
  //   this.rout.navigate(['playback']);
    
  // }


  // Slider Tracker start

  getSlidertracker(){
    setTimeout(() => {
      this.getSlidertrackermain()
    }, 300);
  }
  getSlidertrackermain(){
    const mapProperties = {
      center: new google.maps.LatLng(this.pathCoords[0].lat, this.pathCoords[0].lng),
      zoom: 13, // Adjust the zoom level as needed
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      travelMode: google.maps.TravelMode.TWO_WHEELER,
      provideRouteAlternatives: false,
    };
    this.map = new google.maps.Map(this.mapElement.nativeElement, mapProperties);
  
  
    const pathCoordinates = this.pathCoords.map(location => new google.maps.LatLng(location.lat, location.lng));
  
    const path = new google.maps.Polyline({ 
      path: pathCoordinates,
      geodesic: true,
      strokeColor: '#1a067a',
      strokeOpacity: 5,
      strokeWeight: 5
     
    });
  
    path.setMap(this.map);
  
   
    this.marker = new google.maps.Marker({
      position: this.pathCoords[0],
      map: this.map,
      animation: google.maps.Animation.DROP // Marker drop animation
    });
    this.marker.setIcon('./assets/location/mover.png');
    this.location_timeanddate=this.pathCoords[0].timestamp
    this.Locationtype=this.pathCoords[0].type
    // this.distance=this.pathCoords[0].distance_from_last
    this.Totaldistance=this.pathCoords[0].total_distance_from_start
    this.Trackerlat=this.pathCoords[0].lat
    this.Trackerlng=this.pathCoords[0].lng
    const startMarker = new google.maps.Marker({
      position: this.pathCoords[0],
      map: this.map
    });
    startMarker.setIcon('./assets/location/start_point.png'); 
    
    this.pathCoords.forEach(point => {
      if (point.type == 'Checkin') {
          const checkinMarker = new google.maps.Marker({
              position: { lat: point.lat, lng: point.lng },
              map: this.map,
              icon: './assets/location/checkin.png' 
          });
      }
  });
    const endMarker = new google.maps.Marker({
      position: this.pathCoords[this.pathCoords.length - 1],
      map: this.map
    });
    endMarker.setIcon('./assets/location/end_point.png'); 
  }

  onSliderChange(event: any) {
    const locationIndex = event.target.value;
    
    this.moveMarkerSmoothly(locationIndex);
    this.location_timeanddate=this.pathCoords[locationIndex].timestamp
    this.Locationtype=this.pathCoords[locationIndex].type
    // this.distance=this.pathCoords[locationIndex].distance_from_last
    this.Totaldistance=this.pathCoords[locationIndex].total_distance_from_start
    this.Trackerlat=this.pathCoords[locationIndex].lat
    this.Trackerlng=this.pathCoords[locationIndex].lng



  }
  
  moveMarkerSmoothly(locationIndex: number) {
    // Clear the previous animation interval
    clearInterval(this.animationInterval);
  
    const startTime = performance.now();
    const startLocation = this.marker.getPosition();
    const endLocation = new google.maps.LatLng(
      this.pathCoords[locationIndex].lat,
      this.pathCoords[locationIndex].lng
    );
  
    const duration = 90; // Adjust the animation duration (in milliseconds) as needed
  
    this.animationInterval = setInterval(() => {
      const elapsedTime = performance.now() - startTime;
      const progress = Math.min(elapsedTime / duration, 1);
      const newPosition = google.maps.geometry.spherical.interpolate(
        startLocation,
        endLocation,
        progress
      );
      this.marker.setPosition(newPosition);
   
      if (progress === 1) {
        clearInterval(this.animationInterval);
      }
    }, 10); // Adjust the animation frame rate (in milliseconds) as needed
  }
  // Slider Tracker end

}