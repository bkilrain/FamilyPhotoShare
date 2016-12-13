$('document').ready(() => {
  console.log('ready')

  function uploadToS3(file, signedRequest, url) {
    $.post(url, signedRequest, (data) => {
      console.log('the file has been uploaded', data);
    })
  }

  function getSignedRequest(files) {
    for (let file of files) {
      $.get( `/sign-s3?file-name=${encodeURIComponent(file.name)}&file-type=${file.type}`, (data) => {
        if (data) {
          uploadToS3(file, data.signedRequest, data.url);
        } else {
          console.log('could not get signed url')
        }
      })
      
    }
  }

  $('#file-input').on('submit', (event) => {
    event.preventDefault();
    const files = $('#files').prop('files');
    console.log('files:', files)
    if (files.length === 0) {
      alert('Uh oh~ No files were selected!');
      return;
    }
    getSignedRequest(files);
  })
});