$('document').ready(() => {
  console.log('batch.js ready');
  $('#download-all').on('click', () => {
    console.log('hi')
    $('a.download-link > img').trigger('click');
    return false;
  })
});