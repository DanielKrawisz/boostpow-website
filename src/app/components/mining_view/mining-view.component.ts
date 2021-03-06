import { Component, Input, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { Alert } from '@alerts/models/alert.interface';
import * as fromStore from '../../reducers';
import { Store } from '@ngrx/store';
import { NgForm } from '@angular/forms';
import * as boost from '@matterpool/boostpow-js';
import { BoostPowJobModel } from '@matterpool/boostpow-js/dist/boost-pow-job-model';
declare var twetchPay;

@Component({
  selector: 'app-mining-view',
  templateUrl: './mining-view.component.html',
  styleUrls: ['./mining-view.component.sass']
})
export class MiningViewComponent {
  @Input() alerts: Alert[]
  @Input() sessionKey: string;
  @Input() boostJob: BoostPowJobModel;
  @Input() boostJobUtxos: any[];

  fileUploads = [];
  isDocsOpen = false;
  inputContent: string;
  inputReward;
  inputDiff: number;

  show_category = true;
  show_tag = true;
  show_metadata = true;
  show_unique = true;
  addedFilesNow = [];
  hashesDone = 0;
  cancelNextTick = false;
  isStarted = false;

  constructor(private router: Router, private store: Store<fromStore.State>) {
  }

  get boostReward(): string {
    return (this.jobValue / 100000000) + '';
  }

  get jobValue(): number {
    return this.boostJob && this.boostJob ? this.boostJob.getValue() : 0;
  }

  gotoAddMoreBoost() {
    this.router.navigate(['create'])
    return false;
  }

  get jobLink(): string {
    return `/job/${this.jobTxid}`
  }

  gotoJobLink() {
    this.router.navigate(['job', this.jobTxid]);
    return false;
  }

  get transactionUrl(): string {
    if (!this.boostJob) {
      return '';
    }
    return `https://www.bitcoinfiles.org/tx/` + this.boostJob.getTxid();
  }

  get stylesLogScaleDiff(): string {
    return (this.logScaleDiff40) * 2.5 + '%';
  }
  get logScaleDiff40(): number {
    if (!this.boostJob) {
      return 0;
    }
    const diff = Math.log(this.boostJob.getDiff());
    return diff < 1 ? 1 : Math.round(diff);
  }

  toggleField(field) {
    this['show_' + field] = !this['show_' + field];
    return false;
  }

  isFieldVisible(field) {
    return this['show_' + field];
  }

  get jobTxid(): string {
    return this.boostJob && this.boostJob ? this.boostJob.getTxid() : '';
  }

  get boostJobContent(): string {
    return this.boostJob && this.boostJob ? this.boostJob.getContentString() : '';
  }

  get boostJobContentHex(): string {
    return this.boostJob && this.boostJob ? this.boostJob.getContentHex() : '';
  }

  get boostJobTag(): string {
    return this.boostJob && this.boostJob ? this.boostJob.getTagString() : '';
  }
  get boostJobTagHex(): string {
    return this.boostJob && this.boostJob ? this.boostJob.getTagHex() : '';
  }

  get boostJobMetadata(): string {
    return this.boostJob && this.boostJob ? this.boostJob.getAdditionalDataString() : '';
  }
  get boostJobMetadataHex(): string {
    return this.boostJob && this.boostJob ? this.boostJob.getAdditionalDataHex() : '';
  }

  get boostJobCategory(): string {
    return this.boostJob && this.boostJob ? this.boostJob.getCategoryString() : '';
  }
  get boostJobCategoryHex(): string {
    return this.boostJob && this.boostJob ? this.boostJob.getCategoryHex() : '';
  }

  get boostJobDiff(): number {
    return this.boostJob && this.boostJob ? this.boostJob.getDiff() : undefined;
  }
  get boostJobUnique(): number {
    return this.boostJob && this.boostJob ? this.boostJob.getUserNonce() : undefined;
  }
  get boostJobUniqueHex(): string {
    return this.boostJob && this.boostJob ? this.boostJob.getUserNonceHex() : '';
  }

  ngOnInit() {
    this.inputContent = 'Hello Boost';
    this.inputReward = 0.01;
    this.inputDiff = 1;

  }

  get payOutputs(): any[] {
    const outputs = [];

    const boostJob = boost.BoostPowJob.fromObject({
      content: this.inputContent,
      diff: this.inputDiff,
      category: '00',
      additionalData: '00',
      userNonce: '00',
      tag: '00',
    });
    
    outputs.push({
      script: boostJob.toASM(),
      amount: this.inputReward,
      currency: "USD"
    })
    console.log('outputs', outputs);
    return outputs;
  }

  async payForBoost() {
    await twetchPay.pay({
      label: 'Purchase',
      outputs: this.payOutputs,
      onPayment: (e) => {
        console.log('payment', e);
        //this.router.navigate(['share', this.sessionKey]);
      }
    });
  }

  onSubmit(f: NgForm) {
    console.log(f.value);  // { first: '', last: '' }
    console.log(f.valid);  // false
  }

  get validForm(): boolean {
    return this.inputContent && this.inputContent.length <= 32 && this.inputDiff >= 1 && this.inputReward >= 0.01;
  }

}
