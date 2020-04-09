import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { latLng, tileLayer, icon, marker, Marker } from 'leaflet';
import { google } from "google-maps";
import { AppServiceComponent } from '../app.service';
import { Router } from '@angular/router';
declare let L;

var globalMap;

@Component({
  selector: 'app-map-view',
  templateUrl: './map-view.component.html',
  styleUrls: ['./map-view.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MapViewComponent implements OnInit {
  public title: string = '';
  public titleName: string = '';
  public districts: any = [];
  public blocks: any = [];
  public cluster: any = [];
  public schools: any = [];
  public districtsIds: any = [];
  public blocksIds: any = [];
  public clusterIds: any = [];
  public schoolsIds: any = [];
  public districtsNames: any = [];
  public blocksNames: any = [];
  public clusterNames: any = [];
  public schoolsNames: any = [];
  public stylesFile = "../assets/mapStyles.json";
  public id: any = '';
  public blockHidden: boolean = true;
  public clusterHidden: boolean = true;
  public myDistrict: any;
  public myBlock: any;
  public myCluster: any;
  public colors: any;
  public studentCount: any;
  public schoolCount: any;
  public dateRange: any = '';
  public dist: boolean = false;
  public blok: boolean = false;
  public clust: boolean = false;
  public skul: boolean = false;

  public styles: any = [];

  // google maps zoom level
  public zoom: number = 7;

  public labelOptions: any = {};

  // initial center position for the map
  public lat: any;
  public lng: any;

  public markers: any = [];

  public mylatlngData: any = [];

  constructor(public http: HttpClient, public service: AppServiceComponent, public router: Router, private changeDetection: ChangeDetectorRef) { }

  async ngOnInit() {
    this.initMap();
    this.districtWise();
  }

  //Initialisation of Map  
  initMap() {
    const lat = 22.790988462301428;
    const lng = 72.02733294142871;
    var options = {
      center: [lat, lng],
      zoom: 7
    };
    globalMap = L.tileLayer('https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}?access_token={token}', {
attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
token: 'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw',
id: 'mapbox.streets',
subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
minZoom: 4,
maxZoom: 18,

}).addTo(globalMap);
  }

  public markersList = new L.FeatureGroup();
  public markersList1 = new L.FeatureGroup();
  public markersList2 = new L.FeatureGroup();
  public markersList3 = new L.FeatureGroup();
  public markersList4 = new L.FeatureGroup();
  public markersList5 = new L.FeatureGroup();
  public markersList6 = new L.FeatureGroup();
  public markersList7 = new L.FeatureGroup();
  public markersList8 = new L.FeatureGroup();


  loaderAndErr() {
    if (this.markers.length !== 0) {
      document.getElementById('spinner').style.display = 'none';
    } else {
      document.getElementById('spinner').style.display = 'none';
      document.getElementById('errMsg').style.color = 'red';
      document.getElementById('errMsg').style.display = 'block';
      document.getElementById('errMsg').innerHTML = 'No data found';
    }
  }

  errMsg() {
    document.getElementById('errMsg').style.display = 'none';
    document.getElementById('spinner').style.display = 'block';
    document.getElementById('spinner').style.marginTop = '3%';
  }

  districtWise() {
    globalMap.removeLayer(this.markersList);
    globalMap.removeLayer(this.markersList1);
    globalMap.removeLayer(this.markersList2);
    globalMap.removeLayer(this.markersList3);
    globalMap.removeLayer(this.markersList4);
    globalMap.removeLayer(this.markersList5);
    globalMap.removeLayer(this.markersList6);
    globalMap.removeLayer(this.markersList7);
    globalMap.removeLayer(this.markersList8);
    console.log(this.markersList);
    this.blockHidden = true;
    this.clusterHidden = true;

    this.errMsg();
    this.title = "State";
    this.titleName = "Gujarat"
    this.districtsNames = [];
    this.service.dist_wise_data().subscribe(res => {
      this.mylatlngData = res;

      this.lat = 22.790988462301428;
      this.lng = 72.02733294142871;


      this.dist = true;
      this.blok = false;
      this.clust = false;
      this.skul = false;

      var sorted = this.mylatlngData.sort((a, b) => (a.x_value > b.x_value) ? 1 : -1)
      let colors = this.color().generateGradient('#FF0000', '#7FFF00', sorted.length, 'rgb');
      this.colors = colors;
      this.studentCount = 0;
      this.schoolCount = 0;
      this.dateRange = sorted[0]['data_from_date'] + " to " + sorted[0]['data_upto_date'];
      for (var i = 0; i < sorted.length; i++) {
        this.districtsIds.push(sorted[i]['x_axis']);
        this.districtsNames.push({ id: sorted[i]['x_axis'], name: sorted[i]['district_name'] });
        this.studentCount = this.studentCount + Number(sorted[i]['students_count']);
        this.schoolCount = this.schoolCount + Number(sorted[i]['total_schools']);
        this.markers.push(
          {
            id: sorted[i]['x_axis'],
            name: sorted[i]['district_name'],
            label: sorted[i]['x_value'],
            lat: sorted[i]['y_value'],
            lng: sorted[i]['z_value'],
            stdCount: sorted[i]['students_count'],
            schCount: sorted[i]['total_schools'],

          });
        if (this.dist === true) {
          var marker = L.circleMarker([this.markers[i].lat, this.markers[i].lng, this.markers[i].id], {
            radius: 5,
            color: this.colors[i],
            fillColor: this.colors[i],
            fillOpacity: 1,
            strokeWeight: 0.01
          });
          globalMap.setZoom(7);
          marker.addTo(globalMap).bindPopup(
            "<b>Attendance: </b>" + "&nbsp;" + this.markers[i].label + " %" +
            "<br><b>District: </b>" + "&nbsp;" + this.markers[i].name +
            "<br><b>Number of schools:</b>" + "&nbsp;" + this.markers[i].schCount +
            "<br><b>Number of students:</b>" + "&nbsp;" + this.markers[i].stdCount
          );
          this.markersList.addLayer(marker);
          marker.on('mouseover', function (e) {
            this.openPopup();
          });
          marker.on('mouseout', function (e) {
            this.closePopup();
          });
          marker.on('click', function (e) {
            console.log(e.latlng.alt);
          });

        }

      };
      globalMap.addLayer(this.markersList);
      console.log(this.markersList);
      this.loaderAndErr();
      this.changeDetection.markForCheck();
    });

    var element1: any = document.getElementsByClassName('btn-secondary');
    element1[0].style.display = 'none';
    this.districts = [];
    this.studentCount = 0;
    this.schoolCount = 0;
    this.service.schoolCount().subscribe(res => {
      this.schoolCount = res[0]['total_schools'];
    });

  }

  blockWise() {
    globalMap.removeLayer(this.markersList);
    globalMap.removeLayer(this.markersList2);
    globalMap.removeLayer(this.markersList3);
    globalMap.removeLayer(this.markersList4);
    globalMap.removeLayer(this.markersList5);
    globalMap.removeLayer(this.markersList6);
    globalMap.removeLayer(this.markersList7);
    this.blockHidden = true;
    this.clusterHidden = true;
    this.myDistrict = {};
    this.errMsg();
    this.title = "State";
    this.titleName = "Gujarat"
    this.service.block_wise_data().subscribe(res => {
      this.mylatlngData = res;
      this.lat = 22.790988462301428;
      this.lng = 72.02733294142871;

      this.dist = false;
      this.blok = true;
      this.clust = false;
      this.skul = false;
      this.blocksNames = [];
      this.studentCount = 0;
      this.schoolCount = 0;
      var sorted = this.mylatlngData.sort((a, b) => (a.x_value > b.x_value) ? 1 : -1)
      let colors = this.color().generateGradient('#FF0000', '#7FFF00', sorted.length, 'rgb');
      this.colors = colors;
      for (var i = 0; i < sorted.length; i++) {
        // this.blocksIds.push(sorted[i]['x_axis']);
        this.studentCount = this.studentCount + Number(sorted[i]['students_count']);
        this.schoolCount = this.schoolCount + Number(sorted[i]['total_schools']);
        this.markers.push(
          {
            id: sorted[i]['x_axis'],
            dist: sorted[i]['district_name'],
            name: sorted[i]['block_name'],
            label: sorted[i]['x_value'],
            lat: sorted[i]['y_value'],
            lng: sorted[i]['z_value'],
            stdCount: sorted[i]['students_count'],
            schCount: sorted[i]['total_schools'],
            blok: this.blok,

          });
        if (this.blok === true) {
          var marker = L.circleMarker([this.markers[i].lat, this.markers[i].lng], {
            radius: 5,
            color: this.colors[i],
            fillColor: this.colors[i],
            fillOpacity: 1,
            strokeWeight: 0.01
          });

          globalMap.setZoom(7);
          marker.addTo(globalMap).bindPopup(
            "<b>Attendance: </b>" + "&nbsp;" + this.markers[i].label + " %" +
            "<br><b>District: </b>" + "&nbsp;" + this.markers[i].dist +
            "<br><b>Block: </b>" + "&nbsp;" + this.markers[i].name +
            "<br><b>Number of schools:</b>" + "&nbsp;" + this.markers[i].schCount +
            "<br><b>Number of students:</b>" + "&nbsp;" + this.markers[i].stdCount
          );

          marker.on('mouseover', function (e) {
            this.openPopup();
          });
          marker.on('mouseout', function (e) {
            this.closePopup();
          });
          marker.on('click', function (e) {
            console.log(e);
          });
          this.markersList1.addLayer(marker);
        }
      };
      globalMap.addLayer(this.markersList1);
      this.loaderAndErr();
      this.changeDetection.markForCheck();
    });
    var element1: any = document.getElementsByClassName('btn-secondary');
    element1[0].style.display = 'Block';
    this.blocks = [];
  }

  schoolWise() {
    globalMap.removeLayer(this.markersList1);
    globalMap.removeLayer(this.markersList);
    globalMap.removeLayer(this.markersList3);
    globalMap.removeLayer(this.markersList4);
    globalMap.removeLayer(this.markersList5);
    globalMap.removeLayer(this.markersList6);
    globalMap.removeLayer(this.markersList7);
    globalMap.removeLayer(this.markersList8);
    this.markers = [];
    this.blockHidden = true;
    this.clusterHidden = true;
    this.myDistrict = {};
    this.errMsg();
    this.title = "State";
    this.titleName = "Gujarat"
    this.service.school_wise_data().subscribe(res => {
      this.mylatlngData = res;

      this.lat = 22.790988462301428;
      this.lng = 72.02733294142871;


      this.dist = false;
      this.blok = false;
      this.clust = false;
      this.skul = true;

      var sorted = this.mylatlngData.sort((a, b) => (a.x_value > b.x_value) ? 1 : -1)
      let colors = this.color().generateGradient('#FF0000', '#7FFF00', sorted.length, 'rgb');
      this.colors = colors;
      for (var i = 0; i < sorted.length; i++) {
        // this.districtsIds.push(sorted[i]['x_axis']);
        this.markers.push(
          {
            id: sorted[i]['x_axis'],
            cluster: sorted[i]['cluster_name'],
            dist: sorted[i]['district_name'],
            block: sorted[i]['block_name'],
            name: sorted[i]['school_name'],
            label: sorted[i]['x_value'],
            lat: sorted[i]['y_value'],
            lng: sorted[i]['z_value'],
            stdCount: sorted[i]['students_count'],
            schCount: sorted[i]['total_schools'],

          });
        var marker = L.circleMarker([this.markers[i].lat, this.markers[i].lng], {
          radius: 5,
          color: this.colors[i],
          fillColor: this.colors[i],
          fillOpacity: 1,
          strokeWeight: 0.01
        })
        globalMap.setZoom(7);
        marker.addTo(globalMap).bindPopup(
          "<b>Attendance: </b>" + "&nbsp;" + this.markers[i].label + " %" +
          "<br><b>District: </b>" + "&nbsp;" + this.markers[i].dist +
          "<br><b>Block: </b>" + "&nbsp;" + this.markers[i].block +
          "<br><b>Cluster (CRC): </b>" + "&nbsp;" + this.markers[i].cluster +
          "<br><b>School: </b>" + "&nbsp;" + this.markers[i].name +
          "<br><b>Number of students:</b>" + "&nbsp;" + this.markers[i].stdCount
        );

        marker.on('mouseover', function (e) {
          this.openPopup();
        });
        marker.on('mouseout', function (e) {
          this.closePopup();
        });
        marker.on('click', function (e) {
          console.log(e);
        });
        this.markersList2.addLayer(marker);
      };
      globalMap.addLayer(this.markersList2);
      this.loaderAndErr();
      this.changeDetection.markForCheck();
    });
    var element1: any = document.getElementsByClassName('btn-secondary');
    element1[0].style.display = 'block';
    this.schools = [];
  }

  clusterWise() {
    globalMap.removeLayer(this.markersList1);
    globalMap.removeLayer(this.markersList2);
    globalMap.removeLayer(this.markersList);
    globalMap.removeLayer(this.markersList4);
    globalMap.removeLayer(this.markersList5);
    globalMap.removeLayer(this.markersList6);
    globalMap.removeLayer(this.markersList7);
    globalMap.removeLayer(this.markersList8);
    this.markers = [];
    this.blockHidden = true;
    this.clusterHidden = true;
    this.myDistrict = {};
    this.errMsg();
    this.title = "State";
    this.titleName = "Gujarat"
    this.service.cluster_wise_data().subscribe(res => {
      this.mylatlngData = res;
      this.lat = 22.790988462301428;
      this.lng = 72.02733294142871;

      this.dist = false;
      this.blok = false;
      this.clust = true;
      this.skul = false;
      this.studentCount = 0;
      this.schoolCount = 0;

      var sorted = this.mylatlngData.sort((a, b) => (a.x_value > b.x_value) ? 1 : -1)
      let colors = this.color().generateGradient('#FF0000', '#7FFF00', sorted.length, 'rgb');
      this.colors = colors;
      for (var i = 0; i < sorted.length; i++) {
        this.schoolCount = this.schoolCount + Number(sorted[i]['total_schools']);
        this.studentCount = this.studentCount + Number(sorted[i]['students_count']);
        // this.clusterIds.push(sorted[i]['x_axis']);
        this.markers.push(
          {
            id: sorted[i]['x_axis'],
            name: sorted[i]['crc_name'],
            dist: sorted[i]['district_name'],
            block: sorted[i]['block_name'],
            label: sorted[i]['x_value'],
            lat: sorted[i]['y_value'],
            lng: sorted[i]['z_value'],
            stdCount: sorted[i]['students_count'],
            schCount: sorted[i]['total_schools'],
            clust: this.clust,

          });
        var marker = L.circleMarker([this.markers[i].lat, this.markers[i].lng], {
          radius: 5,
          color: this.colors[i],
          fillColor: this.colors[i],
          fillOpacity: 1,
          strokeWeight: 0.01
        })
        globalMap.setZoom(7);
        marker.addTo(globalMap).bindPopup(
          "<b>Attendance: </b>" + "&nbsp;" + this.markers[i].label + " %" +
          "<br><b>District: </b>" + "&nbsp;" + this.markers[i].dist +
          "<br><b>Block: </b>" + "&nbsp;" + this.markers[i].block +
          "<br><b>Cluster (CRC): </b>" + "&nbsp;" + this.markers[i].name +
          "<br><b>Number of schools:</b>" + "&nbsp;" + this.markers[i].schCount +
          "<br><b>Number of students:</b>" + "&nbsp;" + this.markers[i].stdCount
        );

        marker.on('mouseover', function (e) {
          this.openPopup();
        });
        marker.on('mouseout', function (e) {
          this.closePopup();
        });
        marker.on('click', function (e) {
          console.log(e);
        });
        this.markersList3.addLayer(marker);
      };
      globalMap.addLayer(this.markersList3);
      this.loaderAndErr();
      this.changeDetection.markForCheck();
    });
    var element1: any = document.getElementsByClassName('btn-secondary');
    element1[0].style.display = 'Block';
    this.cluster = [];
  }


  clickedMarker(label) {

    if (this.districtsIds.includes(label[2])) {
      globalMap.removeLayer(this.markersList1);
      globalMap.removeLayer(this.markersList2);
      globalMap.removeLayer(this.markersList3);
      globalMap.removeLayer(this.markersList);
      globalMap.removeLayer(this.markersList5);
      globalMap.removeLayer(this.markersList6);
      globalMap.removeLayer(this.markersList7);
      globalMap.removeLayer(this.markersList8);
      this.markers = [];
      this.blockHidden = true;
      this.clusterHidden = true;

      this.studentCount = 0;
      this.schoolCount = 0;


      this.errMsg();

      this.title = "District";
      this.titleName = label[1];

      localStorage.setItem('dist', label[1]);
      this.service.blockPerDist(label[2]).subscribe(res => {
        this.dist = false;
        this.blok = true;
        this.clust = false;
        this.skul = false;

        this.mylatlngData = res;

        this.lat = Number(label[3]);
        this.lng = Number(label[4]);
        this.blocksNames = [];

        var sorted = this.mylatlngData.sort((a, b) => (a.x_value > b.x_value) ? 1 : -1)
        let colors = this.color().generateGradient('#FF0000', '#7FFF00', sorted.length, 'rgb');
        this.colors = colors;

        for (var i = 0; i < sorted.length; i++) {
          this.studentCount = this.studentCount + Number(sorted[i]['students_count']);
          this.schoolCount = this.schoolCount + Number(sorted[i]['total_schools']);
          this.blocksIds.push(sorted[i]['x_axis']);
          this.blocksNames.push({ id: sorted[i]['x_axis'], name: sorted[i]['block_name'] });

          this.markers.push(
            {
              id: sorted[i]['x_axis'],
              name: sorted[i]['block_name'],
              dist: sorted[i]['distName'],
              label: sorted[i]['x_value'],
              lat: sorted[i]['y_value'],
              lng: sorted[i]['z_value'],
              stdCount: sorted[i]['students_count'],
              schCount: sorted[i]['total_schools'],
              blok: this.blok,

            });
          var marker = L.circleMarker([this.markers[i].lat, this.markers[i].lng], {
            radius: 5,
            color: this.colors[i],
            fillColor: this.colors[i],
            fillOpacity: 1,
            strokeWeight: 0.01
          })
          globalMap.setZoom(8);
          marker.addTo(globalMap).bindPopup(
            "<b>Attendance: </b>" + "&nbsp;" + this.markers[i].label + " %" +
            "<br><b>District: </b>" + "&nbsp;" + this.markers[i].dist +
            "<br><b>Block: </b>" + "&nbsp;" + this.markers[i].name +
            "<br><b>Number of schools:</b>" + "&nbsp;" + this.markers[i].schCount +
            "<br><b>Number of students:</b>" + "&nbsp;" + this.markers[i].stdCount
          );

          marker.on('mouseover', function (e) {
            this.openPopup();
          });
          marker.on('mouseout', function (e) {
            this.closePopup();
          });
          marker.on('click', function (e) {
            console.log(e);
          });
          this.markersList4.addLayer(marker);
        };
        globalMap.addLayer(this.markersList4);
        this.loaderAndErr();
        this.changeDetection.markForCheck();
      });
      var element1: any = document.getElementsByClassName('btn-secondary');
      element1[0].style.display = 'block';
      this.blocks = [];
    }

    if (this.blocksIds.includes(label[2])) {
      globalMap.removeLayer(this.markersList1);
      globalMap.removeLayer(this.markersList2);
      globalMap.removeLayer(this.markersList3);
      globalMap.removeLayer(this.markersList4);
      globalMap.removeLayer(this.markersList);
      globalMap.removeLayer(this.markersList6);
      globalMap.removeLayer(this.markersList7);
      globalMap.removeLayer(this.markersList8);
      this.blockHidden = true;
      this.clusterHidden = true;

      this.markers = [];
      this.errMsg();

      this.studentCount = 0;
      this.schoolCount = 0;
      this.title = "Block";
      this.titleName = label[1];
      this.service.clusterPerBlock(label[2]).subscribe(res => {

        this.dist = false;
        this.blok = false;
        this.clust = true;
        this.skul = false;

        this.mylatlngData = res;
        ;
        this.lat = Number(label[3]);
        this.lng = Number(label[4]);

        this.clusterIds = [];
        var sorted = this.mylatlngData.sort((a, b) => (a.x_value > b.x_value) ? 1 : -1)
        let colors = this.color().generateGradient('#FF0000', '#7FFF00', sorted.length, 'rgb');
        this.colors = colors;
        for (var i = 0; i < sorted.length; i++) {
          this.studentCount = this.studentCount + Number(sorted[i]['students_count']);
          this.schoolCount = this.schoolCount + Number(sorted[i]['total_schools']);
          this.clusterIds.push(sorted[i]['x_axis']);
          this.clusterNames.push({ id: sorted[i]['x_axis'], name: sorted[i]['crc_name'] });

          this.markers.push(
            {
              id: sorted[i]['x_axis'],
              name: sorted[i]['crc_name'],
              // name: sorted[i][''],
              dist: sorted[i]['distName'],
              block: sorted[i]['blockName'],
              label: sorted[i]['x_value'],
              lat: sorted[i]['y_value'],
              lng: sorted[i]['z_value'],
              stdCount: sorted[i]['students_count'],
              schCount: sorted[i]['total_schools'],
              clust: this.clust,
              blok: this.blok,

            });
          var marker = L.circleMarker([this.markers[i].lat, this.markers[i].lng], {
            radius: 5,
            color: this.colors[i],
            fillColor: this.colors[i],
            fillOpacity: 1,
            strokeWeight: 0.01
          })
          globalMap.setZoom(9);
          marker.addTo(globalMap).bindPopup(
            "<b>Attendance: </b>" + "&nbsp;" + this.markers[i].label + " %" +
            "<br><b>District: </b>" + "&nbsp;" + this.markers[i].dist +
            "<br><b>Block: </b>" + "&nbsp;" + this.markers[i].block +
            "<br><b>Cluster (CRC): </b>" + "&nbsp;" + this.markers[i].name +
            "<br><b>Number of schools:</b>" + "&nbsp;" + this.markers[i].schCount +
            "<br><b>Number of students:</b>" + "&nbsp;" + this.markers[i].stdCount
          );

          marker.on('mouseover', function (e) {
            this.openPopup();
          });
          marker.on('mouseout', function (e) {
            this.closePopup();
          });
          marker.on('click', function (e) {
            console.log(e);
          });
          this.markersList5.addLayer(marker);
        };
        globalMap.addLayer(this.markersList5);
        this.loaderAndErr();
        this.changeDetection.markForCheck();
        this.clust = false;
        this.blok = true;
      });
      var element1: any = document.getElementsByClassName('btn-secondary');
      element1[0].style.display = 'block';
    }

    if (this.clusterIds.includes(label[2])) {
      globalMap.removeLayer(this.markersList1);
      globalMap.removeLayer(this.markersList2);
      globalMap.removeLayer(this.markersList3);
      globalMap.removeLayer(this.markersList4);
      globalMap.removeLayer(this.markersList5);
      globalMap.removeLayer(this.markersList);
      globalMap.removeLayer(this.markersList7);
      globalMap.removeLayer(this.markersList8);
      this.blockHidden = true;
      this.clusterHidden = true;


      this.markers = [];
      this.errMsg();
      this.studentCount = 0;
      this.schoolCount = 0;
      this.title = "Cluster";
      this.titleName = label[1] + "(crc)";
      this.service.schoolsPerCluster(label[2]).subscribe(res => {

        this.dist = false;
        this.blok = false;
        this.clust = false;
        this.skul = true;
        this.mylatlngData = res;
        ;
        this.lat = Number(label[3]);
        this.lng = Number(label[4]);

        var sorted = this.mylatlngData.sort((a, b) => (a.x_value > b.x_value) ? 1 : -1)
        let colors = this.color().generateGradient('#FF0000', '#7FFF00', sorted.length, 'rgb');
        this.colors = colors;

        for (var i = 0; i < sorted.length; i++) {
          this.studentCount = this.studentCount + Number(sorted[i]['students_count']);
          this.markers.push(
            {
              id: sorted[i]['x_axis'],
              name: sorted[i]['schoolName'],
              block: sorted[i]['blockName'],
              dist: sorted[i]['distName'],
              cluster: sorted[i]['crc'].toUpperCase(),
              label: sorted[i]['x_value'],
              lat: sorted[i]['y_value'],
              lng: sorted[i]['z_value'],
              stdCount: sorted[i]['students_count'],
              schCount: sorted[i]['total_schools'],
              skul: this.skul,
              blok: this.blok,

            });
          var marker = L.circleMarker([this.markers[i].lat, this.markers[i].lng], {
            radius: 5,
            color: this.colors[i],
            fillColor: this.colors[i],
            fillOpacity: 1,
            strokeWeight: 0.01
          })
          globalMap.setZoom(9.5);
          marker.addTo(globalMap).bindPopup(
            "<b>Attendance: </b>" + "&nbsp;" + this.markers[i].label + " %" +
            "<br><b>District: </b>" + "&nbsp;" + this.markers[i].dist +
            "<br><b>Block: </b>" + "&nbsp;" + this.markers[i].block +
            "<br><b>Cluster (CRC): </b>" + "&nbsp;" + this.markers[i].cluster +
            "<br><b>School: </b>" + "&nbsp;" + this.markers[i].name +
            "<br><b>Number of students:</b>" + "&nbsp;" + this.markers[i].stdCount
          );

          marker.on('mouseover', function (e) {
            this.openPopup();
          });
          marker.on('mouseout', function (e) {
            this.closePopup();
          });
          marker.on('click', function (e) {
            console.log(e);
          });
          this.markersList6.addLayer(marker);
        };
        globalMap.addLayer(this.markersList6);
        this.schoolCount = this.markers.length;
        this.loaderAndErr();
        this.changeDetection.markForCheck();
        this.skul = false;
        this.blok = true;
      });
      var element1: any = document.getElementsByClassName('btn-secondary');
      element1[0].style.display = 'block';
    }
  };

  //Showing tooltips on markers on mouse hover...
  onMouseOver(m, infowindow) {
    m.lastOpen = infowindow;
    m.lastOpen.open();
  }

  //Hide tooltips on markers on mouse hover...
  hideInfo(m) {
    if (m.lastOpen != null) {
      m.lastOpen.close();
    }
  }


  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('dist');
    this.router.navigate(['/']);
  }

  myDistData(data) {
    if (this.clust === true) {
      globalMap.removeLayer(this.markersList1);
      globalMap.removeLayer(this.markersList2);
      globalMap.removeLayer(this.markersList3);
      globalMap.removeLayer(this.markersList4);
      globalMap.removeLayer(this.markersList5);
      globalMap.removeLayer(this.markersList6);
      globalMap.removeLayer(this.markersList);
      globalMap.removeLayer(this.markersList8);
      this.markers = [];
      this.errMsg();

      this.title = "Dist";
      this.titleName = data.name;

      localStorage.setItem('dist', data.name);
      this.service.clusterPerDist(data.id).subscribe(res => {
        this.clusterHidden = true;
        this.blockHidden = false;
        this.dist = false;
        this.blok = false;
        this.clust = true;
        this.skul = false;

        this.mylatlngData = res;
        this.blocksNames = [];

        this.lat = Number(this.mylatlngData[5]['y_value']);
        this.lng = Number(this.mylatlngData[5]['z_value']);
        this.studentCount = 0;
        this.schoolCount = 0;

        var sorted = this.mylatlngData.sort((a, b) => (a.x_value > b.x_value) ? 1 : -1)
        let colors = this.color().generateGradient('#FF0000', '#7FFF00', sorted.length, 'rgb');
        this.colors = colors;

        for (var i = 0; i < sorted.length; i++) {
          this.studentCount = this.studentCount + Number(sorted[i]['students_count']);
          this.schoolCount = this.schoolCount + Number(sorted[i]['total_schools']);
          this.clusterIds.push(sorted['x_axis']);
          this.blocksNames.push({ id: sorted[i]['x_axis'], name: sorted[i]['blockName'] });
          this.markers.push(
            {
              id: sorted[i]['x_axis'],
              name: sorted[i]['crc_name'],
              // name: sorted[i][''],
              dist: sorted[i]['distName'],
              block: sorted[i]['blockName'],
              label: sorted[i]['x_value'],
              lat: sorted[i]['y_value'],
              lng: sorted[i]['z_value'],
              stdCount: sorted[i]['students_count'],
              schCount: sorted[i]['total_schools'],
              clust: this.clust,

            });
          var marker = L.circleMarker([this.markers[i].lat, this.markers[i].lng], {
            radius: 5,
            color: this.colors[i],
            fillColor: this.colors[i],
            fillOpacity: 1,
            strokeWeight: 0.01
          })
          globalMap.setZoom(8.5);
          marker.addTo(globalMap).bindPopup(
            "<b>Attendance: </b>" + "&nbsp;" + this.markers[i].label + " %" +
            "<br><b>District: </b>" + "&nbsp;" + this.markers[i].dist +
            "<br><b>Block: </b>" + "&nbsp;" + this.markers[i].block +
            "<br><b>Cluster (CRC): </b>" + "&nbsp;" + this.markers[i].name +
            "<br><b>Number of schools:</b>" + "&nbsp;" + this.markers[i].schCount +
            "<br><b>Number of students:</b>" + "&nbsp;" + this.markers[i].stdCount
          );

          marker.on('mouseover', function (e) {
            this.openPopup();
          });
          marker.on('mouseout', function (e) {
            this.closePopup();
          });
          marker.on('click', function (e) {
            console.log(e);
          });
          this.markersList7.addLayer(marker);

        };
        globalMap.addLayer(this.markersList7);
        this.loaderAndErr();
        this.changeDetection.markForCheck();
      });
      var element1: any = document.getElementsByClassName('btn-secondary');
      element1[0].style.display = 'block';
      this.cluster = [];
      this.clust = false;

    } else if (this.skul === true) {
      globalMap.removeLayer(this.markersList1);
      globalMap.removeLayer(this.markersList2);
      globalMap.removeLayer(this.markersList3);
      globalMap.removeLayer(this.markersList4);
      globalMap.removeLayer(this.markersList5);
      globalMap.removeLayer(this.markersList6);
      globalMap.removeLayer(this.markersList7);
      globalMap.removeLayer(this.markersList);
      this.markers = [];
      this.clusterHidden = true;
      this.blockHidden = false;
      this.errMsg();

      this.title = "Cluster";
      this.titleName = data.name;
      localStorage.setItem('dist', data.name);
      this.service.schoolPerDist(data.id).subscribe(res => {
        this.dist = false;
        this.blok = false;
        this.clust = false;
        this.skul = true;
        this.blocksNames = [];

        this.mylatlngData = res;


        this.studentCount = 0;
        this.schoolCount = 0;
        var sorted = this.mylatlngData.sort((a, b) => (a.x_value > b.x_value) ? 1 : -1)
        let colors = this.color().generateGradient('#FF0000', '#7FFF00', sorted.length, 'rgb');
        this.colors = colors;

        for (var i = 0; i < sorted.length; i++) {
          this.studentCount = this.studentCount + Number(sorted[i]['students_count']);
          this.schoolCount = this.schoolCount + Number(sorted[i]['total_schools']);
          this.schoolsIds.push(sorted[i]['x_axis']);
          this.blocksNames.push({ id: sorted[i]['x_axis'], name: sorted[i]['block_name'] });
          this.markers.push(
            {
              id: sorted[i]['x_axis'],
              name: sorted[i]['schoolName'],
              blockId: sorted[i]['blockName'],
              dist: sorted[i]['distName'],
              clusterId: sorted[i]['crc'].toUpperCase(),
              label: sorted[i]['x_value'],
              lat: sorted[i]['y_value'],
              lng: sorted[i]['z_value'],
              stdCount: sorted[i]['students_count'],
              schCount: sorted[i]['total_schools'],
              skul: this.skul,

            });
          var marker = L.circleMarker([this.markers[i].lat, this.markers[i].lng], {
            radius: 5,
            color: this.colors[i],
            fillColor: this.colors[i],
            fillOpacity: 1,
            strokeWeight: 0.01
          })
          globalMap.setZoom(9.5);
          marker.addTo(globalMap).bindPopup(
            "<b>Attendance: </b>" + "&nbsp;" + this.markers[i].label + " %" +
            "<br><b>District: </b>" + "&nbsp;" + this.markers[i].name +
            "<br><b>Number of schools:</b>" + "&nbsp;" + this.markers[i].schCount +
            "<br><b>Number of students:</b>" + "&nbsp;" + this.markers[i].stdCount
          );

          marker.on('mouseover', function (e) {
            this.openPopup();
          });
          marker.on('mouseout', function (e) {
            this.closePopup();
          });
          marker.on('click', function (e) {
            console.log(e);
          });
          this.markersList8.addLayer(marker);
        };
        globalMap.addLayer(this.markersList8);
        this.loaderAndErr();
        this.changeDetection.markForCheck();
        this.skul = false;
      });
      var element1: any = document.getElementsByClassName('btn-secondary');
      element1[0].style.display = 'block';

    } else {
      globalMap.removeLayer(this.markersList1);
      globalMap.removeLayer(this.markersList2);
      globalMap.removeLayer(this.markersList3);
      globalMap.removeLayer(this.markersList4);
      globalMap.removeLayer(this.markersList);
      globalMap.removeLayer(this.markersList5);
      globalMap.removeLayer(this.markersList6);
      globalMap.removeLayer(this.markersList7);
      globalMap.removeLayer(this.markersList8);
      this.markers = [];
      this.errMsg();
      console.log("blok");
      this.studentCount = 0;
      this.schoolCount = 0;
      this.title = "District";
      this.titleName = data.name;
      localStorage.setItem('dist', data.name);
      this.service.blockPerDist(data.id).subscribe(res => {
        this.blockHidden = false;
        this.clusterHidden = true;
        this.dist = false;
        this.blok = true;
        this.clust = false;
        this.skul = false;

        this.mylatlngData = res;

        this.lat = Number(this.mylatlngData[0]['y_value']);
        this.lng = Number(this.mylatlngData[0]['z_value']);
        this.blocksNames = [];

        var sorted = this.mylatlngData.sort((a, b) => (a.x_value > b.x_value) ? 1 : -1)
        let colors = this.color().generateGradient('#FF0000', '#7FFF00', sorted.length, 'rgb');
        this.colors = colors;

        for (var i = 0; i < sorted.length; i++) {
          this.studentCount = this.studentCount + Number(sorted[i]['students_count']);
          this.schoolCount = this.schoolCount + Number(sorted[i]['total_schools']);
          this.blocksIds.push(sorted[i]['x_axis']);
          this.blocksNames.push({ id: sorted[i]['x_axis'], name: sorted[i]['block_name'] });
          this.markers.push(
            {
              id: sorted[i]['x_axis'],
              name: sorted[i]['block_name'],
              dist: sorted[i]['distName'],
              label: sorted[i]['x_value'],
              lat: sorted[i]['y_value'],
              lng: sorted[i]['z_value'],
              stdCount: sorted[i]['students_count'],
              schCount: sorted[i]['total_schools'],
              blok: this.blok,

            });
          var marker = L.circleMarker([this.markers[i].lat, this.markers[i].lng], {
            radius: 5,
            color: this.colors[i],
            fillColor: this.colors[i],
            fillOpacity: 1,
            strokeWeight: 0.01
          })
          globalMap.setZoom(8);
          marker.addTo(globalMap).bindPopup(
            "<b>Attendance: </b>" + "&nbsp;" + this.markers[i].label + " %" +
            "<br><b>District: </b>" + "&nbsp;" + this.markers[i].dist +
            "<br><b>Block: </b>" + "&nbsp;" + this.markers[i].name +
            "<br><b>Number of schools:</b>" + "&nbsp;" + this.markers[i].schCount +
            "<br><b>Number of students:</b>" + "&nbsp;" + this.markers[i].stdCount
          );

          marker.on('mouseover', function (e) {
            this.openPopup();
          });
          marker.on('mouseout', function (e) {
            this.closePopup();
          });
          marker.on('click', function (e) {
            console.log(e);
          });
          this.markersList4.addLayer(marker);

        };
        globalMap.addLayer(this.markersList4);
        this.loaderAndErr();
        this.changeDetection.markForCheck();
      });
      var element1: any = document.getElementsByClassName('btn-secondary');
      element1[0].style.display = 'block';
      this.blok = false;
    }
  }

  myBlockData(data) {
    globalMap.removeLayer(this.markersList1);
    globalMap.removeLayer(this.markersList2);
    globalMap.removeLayer(this.markersList3);
    globalMap.removeLayer(this.markersList4);
    globalMap.removeLayer(this.markersList5);
    globalMap.removeLayer(this.markersList6);
    globalMap.removeLayer(this.markersList7);
    globalMap.removeLayer(this.markersList8);
    this.markers = [];
    this.errMsg();

    this.studentCount = 0;
    this.schoolCount = 0;
    this.title = "Block";
    this.titleName = data.name;
    localStorage.setItem('dist', data.name);
    this.service.clusterPerBlock(data.id).subscribe(res => {
      this.clusterHidden = false;
      this.blockHidden = false;
      this.dist = false;
      this.blok = false;
      this.clust = true;
      this.skul = false;

      this.mylatlngData = res;
      ;
      this.lat = Number(this.mylatlngData[5]['y_value']);
      this.lng = Number(this.mylatlngData[5]['z_value']);
      this.clusterNames = [];

      var sorted = this.mylatlngData.sort((a, b) => (a.x_value > b.x_value) ? 1 : -1)
      let colors = this.color().generateGradient('#FF0000', '#7FFF00', sorted.length, 'rgb');
      this.colors = colors;

      for (var i = 0; i < sorted.length; i++) {
        this.studentCount = this.studentCount + Number(sorted[i]['students_count']);
        this.schoolCount = this.schoolCount + Number(sorted[i]['total_schools']);
        console.log({ name: sorted[i]['crc_name'] });
        this.clusterIds.push(sorted[i]['x_axis']);
        this.clusterNames.push({ id: sorted[i]['x_axis'], name: sorted[i]['crc_name'] });
        this.markers.push(
          {
            id: sorted[i]['x_axis'],
            name: sorted[i]['crc_name'],
            // name: sorted[i][''],
            dist: sorted[i]['distName'],
            block: sorted[i]['blockName'],
            label: sorted[i]['x_value'],
            lat: sorted[i]['y_value'],
            lng: sorted[i]['z_value'],
            stdCount: sorted[i]['students_count'],
            schCount: sorted[i]['total_schools'],
            clust: this.clust,
            blok: this.blok,

          });
        var marker = L.circleMarker([this.markers[i].lat, this.markers[i].lng], {
          radius: 5,
          color: this.colors[i],
          fillColor: this.colors[i],
          fillOpacity: 1,
          strokeWeight: 0.01
        })
        globalMap.setZoom(8.5);
        marker.addTo(globalMap).bindPopup(
          "<b>Attendance: </b>" + "&nbsp;" + this.markers[i].label + " %" +
          "<br><b>District: </b>" + "&nbsp;" + this.markers[i].dist +
          "<br><b>Block: </b>" + "&nbsp;" + this.markers[i].block +
          "<br><b>Cluster (CRC): </b>" + "&nbsp;" + this.markers[i].name +
          "<br><b>Number of schools:</b>" + "&nbsp;" + this.markers[i].schCount +
          "<br><b>Number of students:</b>" + "&nbsp;" + this.markers[i].stdCount
        );

        marker.on('mouseover', function (e) {
          this.openPopup();
        });
        marker.on('mouseout', function (e) {
          this.closePopup();
        });
        marker.on('click', function (e) {
          console.log(e);
        });
        this.markersList5.addLayer(marker);
      };
      globalMap.addLayer(this.markersList5);
      this.loaderAndErr();
      this.changeDetection.markForCheck();
      this.clust = false;
      this.blok = true;
    });
    var element1: any = document.getElementsByClassName('btn-secondary');
    element1[0].style.display = 'block';
  }

  myClusterData(data) {
    globalMap.removeLayer(this.markersList1);
    globalMap.removeLayer(this.markersList2);
    globalMap.removeLayer(this.markersList3);
    globalMap.removeLayer(this.markersList4);
    globalMap.removeLayer(this.markersList5);
    globalMap.removeLayer(this.markersList6);
    globalMap.removeLayer(this.markersList7);
    globalMap.removeLayer(this.markersList8);
    this.markers = [];
    this.errMsg();
    var distId = localStorage.getItem('dist');

    this.studentCount = 0;
    this.schoolCount = 0;
    this.title = "Cluster";
    this.titleName = data.name;
    localStorage.setItem('dist', data.name);
    this.service.schoolsPerCluster(data.id).subscribe(res => {
      this.dist = false;
      this.blok = false;
      this.clust = false;
      this.skul = true;

      this.mylatlngData = res;
      ;
      this.lat = Number(this.mylatlngData[0]['y_value']);
      this.lng = Number(this.mylatlngData[0]['z_value']);

      this.clusterIds = [];

      var sorted = this.mylatlngData.sort((a, b) => (a.x_value > b.x_value) ? 1 : -1)
      let colors = this.color().generateGradient('#FF0000', '#7FFF00', sorted.length, 'rgb');
      this.colors = colors;

      for (var i = 0; i < sorted.length; i++) {
        this.studentCount = this.studentCount + Number(sorted[i]['students_count']);
        this.schoolCount = this.schoolCount + Number(sorted[i]['total_schools']);

        // this.schoolsNames.push({ id: sorted[i]['x_axis'], name: sorted[i]['block_name'] });
        this.markers.push(
          {
            id: sorted[i]['x_axis'],
            name: sorted[i]['schoolName'],
            block: sorted[i]['blockName'],
            dist: sorted[i]['distName'],
            cluster: sorted[i]['crc'].toUpperCase(),
            label: sorted[i]['x_value'],
            lat: sorted[i]['y_value'],
            lng: sorted[i]['z_value'],
            stdCount: sorted[i]['students_count'],
            schCount: sorted[i]['total_schools'],
            skul: this.skul,
            blok: this.blok,

          });
        var marker = L.circleMarker([this.markers[i].lat, this.markers[i].lng], {
          radius: 5,
          color: this.colors[i],
          fillColor: this.colors[i],
          fillOpacity: 1,
          strokeWeight: 0.01
        })
        globalMap.setZoom(9.5);
        marker.addTo(globalMap).bindPopup(
          "<b>Attendance: </b>" + "&nbsp;" + this.markers[i].label + " %" +
          "<br><b>District: </b>" + "&nbsp;" + this.markers[i].dist +
          "<br><b>Block: </b>" + "&nbsp;" + this.markers[i].block +
          "<br><b>Cluster (CRC): </b>" + "&nbsp;" + this.markers[i].cluster +
          "<br><b>School: </b>" + "&nbsp;" + this.markers[i].name +
          "<br><b>Number of students:</b>" + "&nbsp;" + this.markers[i].stdCount
        );

        marker.on('mouseover', function (e) {
          this.openPopup();
        });
        marker.on('mouseout', function (e) {
          this.closePopup();
        });
        marker.on('click', function (e) {
          console.log(e);
        });
        this.markersList6.addLayer(marker);
      };
      globalMap.addLayer(this.markersList6);
      this.schoolCount = this.schools.length;
      this.loaderAndErr();
      this.changeDetection.markForCheck();
      this.skul = false;
      this.blok = true;
    });
    var element1: any = document.getElementsByClassName('btn-secondary');
    element1[0].style.display = 'block';
  }

  color() {
    // Converts a #ffffff hex string into an [r,g,b] array
    function hex2rgb(hex) {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result ? [
        parseInt(result[1], 16),
        parseInt(result[2], 16),
        parseInt(result[3], 16)
      ] : null;
    }

    // Inverse of the above
    function rgb2hex(rgb) {
      return '#' + ((1 << 24) + (rgb[0] << 16) + (rgb[1] << 8) + rgb[2]).toString(16).slice(1);
    }

    // Interpolates two [r,g,b] colors and returns an [r,g,b] of the result
    // Taken from the awesome ROT.js roguelike dev library at
    // https://github.com/ondras/rot.js
    function _interpolateRgb(color1, color2, factor) {
      if (arguments.length < 3) { factor = 0.5; }

      let result = color1.slice();

      for (let i = 0; i < 3; i++) {
        result[i] = Math.round(result[i] + factor * (color2[i] - color1[i]));
      }

      return result;
    }



    function generateGradient(color1, color2, total, interpolation) {
      const colorStart = typeof color1 === 'string' ? hex2rgb(color1) : color1;
      const colorEnd = typeof color2 === 'string' ? hex2rgb(color2) : color2;

      // will the gradient be via RGB or HSL
      switch (interpolation) {
        case 'rgb':
          return colorsToGradientRgb(colorStart, colorEnd, total);
        // case 'hsl':
        //   return colorsToGradientHsl(colorStart, colorEnd, total);
        default:
          return false;
      }
    }

    function colorsToGradientRgb(startColor, endColor, steps) {
      // returns array of hex values for color, since rgb would be an array of arrays and not strings, easier to handle hex strings
      let arrReturnColors = [];
      let interimColorRGB;
      let interimColorHex;
      const totalColors = steps;
      const factorStep = 1 / (totalColors - 1);

      for (let idx = 0; idx < totalColors; idx++) {
        interimColorRGB = _interpolateRgb(startColor, endColor, factorStep * idx);
        interimColorHex = rgb2hex(interimColorRGB);
        arrReturnColors.push(interimColorHex);
      }

      return arrReturnColors;
    }

    return {
      generateGradient
    };
  }

}