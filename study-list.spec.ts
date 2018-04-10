import { HttpClientModule } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/mergeMap';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed, async, inject } from '@angular/core/testing';
import { COMMON, DISPATCH_URL } from '../../../so-common-app/src/app/services/service-constant';
import {
    StudyListService, FilterDataService, ServerStatusService,
    PayloadCommandService, BaseConnectionService,
    BasePayloadCommandService, DataService, BaseTermsService,
    ErrorTermsService, LocaleAppResourcesService, LoginTermsService,
    UserDataService,AppDataService
} from '../../../so-common-app/src/app/index';

const MockFilterData: any = require('../../assets/data/getFilterData.json');
/* TODO replace with StudyList JSON response*/
const MockData: any = require('../../assets/data/getStudyList.json');

/* Test Specification - Study List Servie*/
describe('StudyListService', () => {

    /*Declaration of Service and HttpTestingController*/
    let studyListService: StudyListService;
    let httpMock: HttpTestingController;

    /*Test Initial Setup */
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [StudyListService, PayloadCommandService, BaseConnectionService,
                BasePayloadCommandService, DataService, AppDataService, FilterDataService]
        });

        studyListService = TestBed.get(StudyListService);
        httpMock = TestBed.get(HttpTestingController);

    })

    /* Test Should return study list information */
    it('should return study list information', (done) => {


        let filterData = MockFilterData;
        let arrFilterData= filterData.serviceResponse.filterCriteriaMetadata.
        criterionMetadataList.filter(r=>r.filterType==='HSTDY');
        let arrFilterCriteriaByName = arrFilterData[0].criterion.map(name=>name.id);

        studyListService.GetStudyList(arrFilterCriteriaByName).subscribe(res => {
            if (Array.isArray(res)) {
                expect(res.length).toBeGreaterThan(-1);
            }else{
                expect(res).toEqual('OK');
            }
            done();
        });

        const studyListRequest = httpMock.expectOne(DISPATCH_URL);
        studyListRequest.flush(MockData);
        expect(studyListRequest).toBeDefined();
        expect(studyListRequest.request.method).toEqual('POST');

        httpMock.verify();
    });

    /* Test last event*/
    afterEach(() => {
        httpMock.verify();
    });

});