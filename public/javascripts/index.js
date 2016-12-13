$('document').ready(() => {
  console.log('index.js ready')
  function updateBatchList() {
    $.get('/batchList', (data) => {
      for (let batchName of data.CommonPrefixes) {
        let $batch = $('<a />');
        $batch.attr('href', `/batch/${batchName.Prefix}`).text(batchName.Prefix.slice(0, -1)).addClass('batch-link');
        $('#batch-list').append($batch);
      }
    });
  }

  function uploadToS3(file, signedRequest) {
    $.ajax({
      method: 'PUT',
      url: signedRequest, 
      contentType: file.type, 
      processData: false,
      data: file,
      success: (data) => {
        console.log('the file has been uploaded', data);
      },
      error: (err) => {
        console.log('there was an error uploading:', data);
      }
    });
  }

  function getSignedRequest(files, batchName) {
    let urls = [];
    const batchFolder = `${batchName}/`;
    for (let file of files) {
      $.get( `/sign-s3?file-name=${batchFolder}${file.name}&file-type=${file.type}`, (data) => {
        if (data) {
          uploadToS3(file, data.signedRequest);
          urls.push(data.url);
        } else {
          console.log('could not get signed url')
        }
      });
    }
  }

  $('#file-input').on('submit', (event) => {
    event.preventDefault();
    const files = $('#files').prop('files');
    const batchName = $('#batch-name').val();
    console.log('files:', files, 'batch-name:', batchName)
    if (files.length === 0) {
      alert('Uh oh~ No files were selected!');
      return;
    }
    getSignedRequest(files, batchName);
  });

  updateBatchList();
});