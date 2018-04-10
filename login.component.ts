import { Component, OnInit, NgZone, ViewEncapsulation, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { LoginModel } from './login.model';
import { Router, ActivatedRoute } from '@angular/router';
import { LoginService } from './login-service';
import { LoginTermsService } from '../../../so-common-app/src/app/services/login-terms.service';
import { ServerStatusService } from '../../../so-common-app/src/app/services/server-status.service';
import { StringUtil } from '../../../so-common-app/src/app/services/string-util';
import { COMMON } from '../../../so-common-app/src/app/services/service-constant';
import { APP_URL } from '../../../src/app/app.constant';
import { ErrorMessageService } from '../error-message.service';
import { ApplicationError } from '../../../so-common-app/src/app/services/ApplicationError';
import { Observable } from 'rxjs/Rx';
import { Subscription } from 'rxjs/Subscription';

@Component({
    selector: 'login-app',
    templateUrl: './login.component.html',
    styleUrls: ['./header.css', './login.component.css'],
    encapsulation: ViewEncapsulation.None
})

export class LoginComponent implements OnInit {

    loginForm: FormGroup;
    loginInfo: LoginModel;
    LoginIntro: string;
    LoginPanelLoginButton: string;
    LoginDetails: string;
    LoginWelcome: string;
    LoginPanelUsername: string;
    LoginPanelPassword: string;
    LoginPanelForgotPasswordButton: string;
    LoginDetailsMore: string;
    LoginDetailsClickHere: string;
    FooterText: string;
    LoginDetailsURL: string;
    LoginDetaisURLTarget: string;
    ForgotPasswordURL: string;
    ErrorMessage: string;
    loginSubscription: Subscription;

    constructor(private fb: FormBuilder,
        private router: Router,
        private route: ActivatedRoute,
        private ngZone: NgZone,
        private loginService: LoginService,
        private loginTermsService: LoginTermsService,
        private serverStatusService: ServerStatusService,
        private errorMessageService: ErrorMessageService,
        private changeDetectorRef: ChangeDetectorRef
    ) {
        this.createForm();
        this.ErrorMessage = '';
    }
    ngOnInit() {
        const that = this;
        that.loginSubscription = that.loginService.getLoginTerminologies()
            .map(result => result)
            .switchMap((response: any) => {
                if (response) {
                    that.LoginIntro = that.loginTermsService.getTerm('LoginIntro');
                    that.LoginDetails = that.loginTermsService.getTerm('LoginDetails');
                    that.LoginWelcome = that.loginTermsService.getTerm('LoginWelcome');
                    that.LoginPanelUsername = that.loginTermsService.getTerm('LoginPanelUsername');
                    that.LoginPanelPassword = that.loginTermsService.getTerm('LoginPanelPassword');
                    that.LoginPanelLoginButton = that.loginTermsService.getTerm('LoginPanelLoginButton');
                    that.LoginPanelForgotPasswordButton = that.loginTermsService.getTerm('LoginPanelForgotPasswordButton');
                    that.LoginDetailsMore = that.loginTermsService.getTerm('LoginDetailsMore');
                    that.LoginDetailsClickHere = that.loginTermsService.getTerm('LoginDetailsClickHere');
                    that.ForgotPasswordURL = '/dv/StudyOptimizer/resetPasswdServlet?command=inputResetPassword';
                    that.LoginDetailsURL = that.loginTermsService.getTerm('LoginDetailsURL');
                    that.LoginDetaisURLTarget = that.loginTermsService.getTerm('LoginDetaisURLTarget');
                    return this.loginService.serverStatus()
                } else {
                    return Observable.empty();
                }

            })
            .subscribe(finalResult => {
                const footerTextTerm = that.loginTermsService.getTerm('footerText');
                const serverVersion = that.serverStatusService.serverStatus.serverVersion.content;
                const serverBuildId = that.serverStatusService.serverStatus.serverBuildID;
                that.FooterText = StringUtil.substitute(footerTextTerm, [serverVersion, serverBuildId]);

            });
        const subscriber = that.errorMessageService.GetErrorMessage();
        subscriber.subscribe(
            (message: string) => {
                that.ErrorMessage = message;
                that.changeDetectorRef.detectChanges();
            }
        );
    }

    private createForm() {
        this.loginForm = this.fb.group({
            username: ['', Validators.required],
            password: ['', Validators.required]
        });
    }

    prepareLoginSave(): LoginModel {
        const formModel = this.loginForm.value;
        const loginSave = {
            userId: formModel.username,
            password: formModel.password
        };
        return loginSave;
    }

    onSubmit() {
        this.loginInfo = this.prepareLoginSave();
        if (this.loginInfo.userId && this.loginInfo.password) {
            this.loginService.login(this.loginInfo).subscribe((data) => {
                if (data.result.toUpperCase() === COMMON.RESULT_OK) {
                    this.router.config.push({ path: 'app' });
                    this.router.navigate(['app']).then(result => { window.location.href = APP_URL; });
                } else if (data.result.toUpperCase() === COMMON.RESULT_ERROR) {
                    throw new ApplicationError(data.error.message, data.error.errorCode);
                }
            });
        } else {
            this.errorMessageService.ShowErrorMessage(this.loginTermsService.getTerm('LoginEmptyFieldMessage'));
        }
    }
    ngOnDestroy() {
        this.loginSubscription.unsubscribe();
    }
}
