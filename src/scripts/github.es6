import reqwest from 'reqwest';
import Storage from './storage.es6';

export default class Github {
  constructor(accessToken) {
    this.accessToken = accessToken;
  }

  checkToken() {
    const cfg = {
      url: 'https://api.github.com/',
      headers: { Authorization: 'token ' + this.accessToken },
    };
    return reqwest(cfg);
  }

  promptToken() {
    const result = window.prompt('Enter Github Access Token');
    if (result) {
      Storage.setAccessToken(result);
    } else {
      return false;
    }
  }

  get repoName() {
    const m = document.location.href.match(/github\.com\/([^\/]+\/[^\/]+)/);
    if (m) {
      return m[1];
    }
    return null;
  }

  get baseBranch() {
    return 'release';
  }

  get compareBranch() {
    return 'master';
  }

  get PRTitle() {
    const date = new Date();
    return `Release to production. [${date.toISOString()}]`;
  }

  get isPRPage() {
    return !!(/\/compare\//.test(document.location.href));
  }

  changePageToPR() {
    document.location.href = `https://github.com/${this.repoName}/compare/${this.baseBranch}...${this.compareBranch}?expand=1&title=${this.title}`;
  }

  getIssueUser(issueNumber) {
    const cfg = {
      url: 'https://api.github.com/repos/' + this.repoName + '/pulls/' + issueNumber,
      headers: { Authorization: 'token ' + this.accessToken },
    };
    return reqwest(cfg)
    .then((res) => {
      const text = ['- [ ]', res.title, '#' + res.number, '@' + res.user.login].join(' ');
      return text;
    })
    .fail((jqXHR) => {
      console.error(jqXHR);
    });
  }

  // @return [issueNumber, ...]
  getMergedIssueNumbers() {
    const mergedIssueNumbers = [];

    Array.prototype.forEach.call(document.querySelectorAll('.timeline-commits .commit-message'), (el) => {
      const message = el.querySelector('.message').innerText;
      if (message.indexOf('Merge pull request') === -1) {
        return true;
      }
      // const issueID = el.querySelector('.issue-link').getAttribute('data-id');
      const issueNumber = el.querySelector('.issue-link').innerText.replace('#', '');

      mergedIssueNumbers.push(issueNumber);
    });

    return mergedIssueNumbers;
  }

  // @return [Promise]
  getPRText() {
    const promises = [];
    for (const issueNumber of this.getMergedIssueNumbers()) {
      console.log(issueNumber);
      promises.push(this.getIssueUser(issueNumber));
    }

    return Promise.all(promises);
  }
}
