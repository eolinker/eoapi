import { Component, Input, OnInit, OnChanges } from '@angular/core';
import { getBlobUrl } from 'eo/workbench/browser/src/app/utils';
import { ApiTestHistoryResponse } from '../../../../shared/services/storage/index.model';
import { ApiTestUtilService } from '../api-test-util.service';
@Component({
  selector: 'eo-api-test-result-response',
  templateUrl: './api-test-result-response.component.html',
  styleUrls: ['./api-test-result-response.component.scss'],
})
export class ApiTestResultResponseComponent implements OnInit, OnChanges {
  @Input() model: any | ApiTestHistoryResponse;
  codeStatus: { status: string; cap: number; class: string };
  size: string;
  blobUrl:string='';
  responseIsImg = false;
  constructor(private apiTest: ApiTestUtilService) {}
  ngOnChanges(changes) {
    if (changes.model) {
      this.codeStatus = this.apiTest.getHTTPStatus(this.model.statusCode);
      //show response
      // this.responseIsImg =/\.((jpg)|(jpeg)|(png)|(gif)|(bmg))/i.test(this.model.blobFileName) || /image/.test(this.model.contentType);
    }
  }
  ngOnInit(): void {}
  downloadResponseText() {
    this.blobUrl=getBlobUrl(this.model.body, this.model.contentType);
    const blobFileName = decodeURI(this.model.blobFileName);
    const tmpAElem = document.createElement('a');
    if ('download' in tmpAElem) {
      tmpAElem.style.visibility = 'hidden';
      tmpAElem.href = this.blobUrl;
      tmpAElem.download = blobFileName;
      document.body.appendChild(tmpAElem);
      const evt = document.createEvent('MouseEvents');
      evt.initEvent('click', true, true);
      tmpAElem.dispatchEvent(evt);
      document.body.removeChild(tmpAElem);
    } else {
      location.href = this.blobUrl;
    }
  }
  newTabResponseText() {}
}
