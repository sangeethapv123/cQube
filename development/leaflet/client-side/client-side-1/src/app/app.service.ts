import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class AppServiceComponent {
    baseUrl = environment.apiEndpoint;

    constructor(public http: HttpClient) { };

    login(data) {
        return this.http.post(`${this.baseUrl}/login`, data);
    }

    dist_wise_data() {
        return this.http.get(`${this.baseUrl}/dist_wise_data`, { 'headers': { 'token': "Bearer " + localStorage.getItem('token') } });
    }

    block_wise_data() {
        return this.http.get(`${this.baseUrl}/block_wise_data`, { 'headers': { 'token': "Bearer " + localStorage.getItem('token') } });
    }

    cluster_wise_data() {
        return this.http.get(`${this.baseUrl}/cluster_wise_data`, { 'headers': { 'token': "Bearer " + localStorage.getItem('token') } });
    }

    school_wise_data() {
        return this.http.get(`${this.baseUrl}/school_wise_data`, { 'headers': { 'token': "Bearer " + localStorage.getItem('token') } });
    }

    getSchoolData() {
        return this.http.get(`${this.baseUrl}/getSchoolData`, { 'headers': { 'token': "Bearer " + localStorage.getItem('token') } });
    }

    blockPerDist(distId, distName) {
        return this.http.post(`${this.baseUrl}/blcokPerDist`, { distId: distId, distName: distName, baseUrl: this.baseUrl }, { 'headers': { 'token': "Bearer " + localStorage.getItem('token') } });
    }

    clusterPerBlock(blockId, blockName) {
        return this.http.post(`${this.baseUrl}/clustePerBlock`, { blockId: blockId, blockName: blockName, baseUrl: this.baseUrl }, { 'headers': { 'token': "Bearer " + localStorage.getItem('token') } });
    }

    schoolsPerCluster(clusterId, clusterName) {
        return this.http.post(`${this.baseUrl}/schoolPerCluster`, { clusterId: clusterId, clusterName: clusterName, baseUrl: this.baseUrl }, { 'headers': { 'token': "Bearer " + localStorage.getItem('token') } });
    }


}