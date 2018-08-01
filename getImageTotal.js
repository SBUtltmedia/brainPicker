function getImageTotal(path,i, dfd) {
  $.get(path+ i + ".jpg").done(function(){getImageTotal(path,i+1,dfd)}).fail(function() {dfd.resolve(i-1); return dfd;})
  return dfd;
}
