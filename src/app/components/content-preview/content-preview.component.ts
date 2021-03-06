import { Component, Input, OnInit } from '@angular/core';

import { Router } from '@angular/router';
import * as moment from 'moment';
import { BoostSignalSummarySerialize } from '@main/models/boost-signal-summary-serialize.interface';
import Axios from 'axios';
import { RedirectAction } from '@main/actions/main.actions';
import * as fromStore from '../../reducers';
import { Store } from '@ngrx/store';

declare var boostPublish;
const linkifyHtml = require('linkifyjs/html');
const snarkdown = require('snarkdown').default;


@Component({
  selector: 'app-content-preview',
  templateUrl: './content-preview.component.html',
  styleUrls: ['./content-preview.component.sass']
})
export class ContentPreviewComponent implements OnInit {
  @Input() boostSignalSummary: BoostSignalSummarySerialize;
  @Input() showTimeframeSelect: boolean;
  @Input() overallRank: number;
  @Input() timeframe: string;
  @Input() useInternalLink: boolean;

  previewText = '';
  contentType = null;
  contentSnippet = '';

  constructor(private router: Router, private store: Store<fromStore.State>) {
  }

  updateTimeframe (evt) {
    if (!this.boostSignalSummary){
      return '';
    }
    this.router.navigate(['content', this.boostSignalSummary.entity.contenthex], { queryParams: { timeframe: evt.target.value } });
    return false;
  }

  get tag(): string {
    if (!this.boostSignalSummary) {
      return '';
    }
    return this.boostSignalSummary.entity.tag;
  }

  get energy(): number | null {
    if (!this.boostSignalSummary) {
      return null;
    }
    return this.boostSignalSummary.totalDifficulty;
  }

  async addBoost() {
    await boostPublish.open({
      label: 'Boost Content',
      content: this.boostSignalSummary.entity.contenthex,
      outputs: [],
      onPayment: async (e) => {
        console.log('onPayment', e);
        setTimeout(() => {
          console.log('timeout fired', e);
          //this.router.navigate(['search']);
          // this.router.navigate(['job', e.boostJobStatus.boostJobId]);
          this.store.dispatch(new RedirectAction('https://boostpow.com/jobs/' + e.txid));
        }, 4000);
      }
    });
    // this.router.navigate(['create']);
    return false;
  }

  get fileUrl(): string {
    if (!this.boostSignalSummary) {
      return '';
    }

    return 'https://media.bitcoinfiles.org/' + this.boostSignalSummary.entity.contenthex;
  }

  get openLinkUrl(): string {
    if (!this.boostSignalSummary) {
      return '';
    }

    return '/c/' + this.boostSignalSummary.entity.contenthex;
  }

  get isImage(): boolean {
    if (/(image\/jpe?g)|(gif)|(png)|(svg)/.test(this.contentType)) {
      return true;
    }
    return false;
  }

  isNonImageFileDocument(str?: string): boolean {
    if (this.isImage) {
      return false;
    }
    if (/(text\/plain)|(html)|(markdown)/.test(str || this.contentType)) {
      return true;
    }
    return false;
  }

  get isMarkdown(): boolean {
    return /(markdown)/.test(this.contentType);
  }

  get isMiscFile(): boolean {
    if (this.isImage || this.isNonImageFileDocument()) {
      return false;
    }
    return true;
  }

  async ngOnInit() {
    if (!this.boostSignalSummary) {
      return;
    }
    // Get the HEAD to inspect the document
    Axios.head(this.fileUrl)
    .then((result) => {
      this.contentType = result.headers['content-type'];
      if (this.isNonImageFileDocument(this.contentType)) {
        // If it's a non-image, and a document, then fetch a preview
        Axios.get(this.fileUrl)
        .then((result) => {
          this.contentSnippet = result.data;
        }).catch((ex) => {
          console.log('ex', ex);
        });
      }
    }).catch((ex) => {
    });
  }

  truncate(input, len = 350) {
    if (input.length > len) {
      return input.substring(0, len) + '...';
    }
    else {
      return input;
    }
  };

  getFileContent(): string {
    return this.contentSnippet;
  }

  get isFile(): boolean {
    if (this.boostSignalSummary.entity.categoryhex === '00000042') {
      return true;
    }
    return false;
  }


  get contentHex(): string {
    if (!this.boostSignalSummary){
      return '';
    }

    return this.boostSignalSummary.entity.contenthex;
  }


  get contentSummary(): string {
    if (!this.boostSignalSummary){
      return '';
    }

    if (this.isMarkdown) {
      return snarkdown(this.getFileContent());
    }
    if (this.isFile) {
      return linkifyHtml(this.getFileContent(), {
        defaultProtocol: 'https',
        target: "_blank"
      });
    }

    return this.boostSignalSummary.entity.contenthex;
  }

  get contentLink() {
    if (!this.boostSignalSummary){
      return '';
    }
    return '/content/' + this.boostSignalSummary.entity.contenthex;
  }

  gotoContentLink() {
    if (!this.boostSignalSummary){
      return '';
    }
    this.router.navigate(['content', this.boostSignalSummary.entity.contenthex]);
    return false;
  }

  tagLink(tag) {
    let t = tag.replace(/^\0*/g, '');
    return '/search?tag=' + t.trim(); // { queryParams: { tag: tag } });
  }
  categoryLink(category) {
    let t = category.replace(/^\0*/g, '');
    return '/search?category=' + t.trim(); // { queryParams: { tag: tag } });
  }

  formatAgo(): string {
    if (!this.boostSignalSummary){
      return '';
    }
    const unixtime = this.boostSignalSummary.recentSignalTime;
    return moment(unixtime * 1000).format('MMM DD, YYYY hh:mm')
  }

}
