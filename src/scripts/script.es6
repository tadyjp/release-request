import Github from './github.es6';
import Storage from './storage.es6';

(() => {

  console.log('github init.')

  const github = new Github(Storage.accessToken);

  if (!Storage.accessToken) {
    github.promptToken();
  }

  github.checkToken().then(() => {
    if (!github.repoName) {
      console.log('github.repoName not found.');
      return false;
    }

    console.log(github.isPRPage);

    // if (github.isPRPage) {
    //   github.getPRText().then((list) => {
    //     const body = list.join('\n');
    //     document.getElementsByName('pull_request[body]')[0].value = body;
    //   });
    // } else {
    //   github.changePageToPR();
    // }

    if (github.isPRPage) {
      github.getPRText().then((list) => {
        const body = list.join('\n');
        document.getElementsByName('pull_request[title]')[0].value = github.PRTitle;
        document.getElementsByName('pull_request[body]')[0].value = body;
      });
    }
  })
  .catch((xhr) => {
    console.error(xhr);
    github.promptToken();
  });

  return true;
})();
