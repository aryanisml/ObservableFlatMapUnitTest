import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/mergeMap';
import { BaseConnectionService } from '../services/base-connection.service';
import { PayloadCommandService } from "../services/payload-command.service";
import { Observable } from 'rxjs/Rx';

@Injectable()
export class BaseTermsService {
    constructor(private baseConnectionService: BaseConnectionService, private payloadCommandService: PayloadCommandService) { }

    private _commonTerms = null;

    load(resourceType:string):Observable<any>{
        let that = this;
        let termsPayload = this.payloadCommandService.getTermsCommand('terms');
        return that.baseConnectionService.sendRequest(termsPayload)
            .map((res:any) => res)
            .flatMap((data:any)=>{
                if (data.terminologies.term) {
                    that._commonTerms = [];
                    Object.assign(that._commonTerms, data.terminologies);
                    termsPayload = that.payloadCommandService.getTermsCommand(resourceType);
            return that.baseConnectionService.sendRequest(termsPayload)
                    .map((response:any) => {
                        if (response.terminologies) {
                            let rTerms = response.terminologies;
                            return rTerms;
                        }
                    }
                
                    );
                }
            })
    }








    resolveValue(str: string) {
    let terms = this._commonTerms.term;
        str = str.replace(/!(.*?)!/g, function (match, token) {

            let term = terms.find(function (term) {
                return term.name === token;
            });
            return term ? term.value : match;
        });
        return str;
    }
}