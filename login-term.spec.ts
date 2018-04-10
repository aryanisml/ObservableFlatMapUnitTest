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


const MockData: any = require('../../assets/data/GetTerms.json');

/* Test Specification - Login Term Servie*/
describe('LoginTermService', () => {

    /*Declaration of Service and HttpTestingController*/
    let loginTermService: LoginTermsService;
    let httpMock: HttpTestingController;

    /*Test Initial Setup */
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [LoginTermsService, PayloadCommandService, BaseConnectionService,
                BasePayloadCommandService, DataService, AppDataService, BaseTermsService]
        });

        loginTermService = TestBed.get(LoginTermsService);
        httpMock = TestBed.get(HttpTestingController);

    })

    /* Test should return login terminology information */
    it('should return login terminology information', (done) => {


        let termData = MockData.hasOwnProperty('terms') ?  MockData.terms : Observable.empty();
        let loginTermData = MockData.hasOwnProperty('login') ?  MockData.login : Observable.empty();

        loginTermService.getLoginTerminologies().subscribe(res => {
            if (Array.isArray(res.term)) {
                expect(res.term.length).toBeGreaterThan(-1);
            }else{
                expect(res).toEqual('OK');
            }
            done();
        });

        const termRequest = httpMock.expectOne(DISPATCH_URL);
        termRequest.flush(termData);

        const loginTermRequest = httpMock.expectOne(DISPATCH_URL);
        loginTermRequest.flush(loginTermData);

        expect(termRequest).toBeDefined();
        expect(termRequest.request.method).toEqual('POST');

        expect(loginTermRequest).toBeDefined();
        expect(loginTermRequest.request.method).toEqual('POST');

        httpMock.verify();
    });

    /* Test last event*/
    afterEach(() => {
        httpMock.verify();
    });

});