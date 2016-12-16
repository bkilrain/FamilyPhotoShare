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

  function uploadToS3(file, signedRequest, callback) {
    $.ajax({
      method: 'PUT',
      url: signedRequest, 
      contentType: file.type, 
      processData: false,
      data: file,
      success: (data) => {
        console.log('the file has been uploaded');
        callback(true);
      },
      error: (err) => {
        console.log('there was an error uploading:', err);
        callback(false);
      }
    });
  }

  function getSignedRequest(files, batchName) {
    let count = 0;
    const batchFolder = `${batchName}/`;
    for (let i = 0; i < files.length; i++) {
      $.get( `/sign-s3?file-name=${batchFolder}${files[i].name}&file-type=${files[i].type}`, (data) => {
        if (data) {
          uploadToS3(files[i], data.signedRequest, (success) => {
            if (!success) {
              alert('There was a problem uploading. Please check and try again');
              return;
            }
            count++;
            $('#to-upload').text(files.length - count);
            if (count === files.length) {
              location.reload();
              $('.loading').addClass('hidden');
              alert('your photos have been uploaded');
            }
          });
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
    if (files.length === 0) {
      alert('Uh oh~ No files were selected!');
      return;
    }
    getSignedRequest(files, batchName);
    $('.loading').removeClass('hidden');
  });


  updateBatchList();
});