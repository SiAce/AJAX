
function loadData() {
  /*
  The $ that shows up in variable names, like $body for example, is just a character like any other. In this case, it refers to the fact that the variable referenced by $body is a jQuery collection, not a DOM node.
  */
  const $body = $('body');
  const $wikiElem = $('#wikipedia-links');
  const $nytHeaderElem = $('#nytimes-header');
  const $nytElem = $('#nytimes-articles');
  const $greeting = $('#greeting');

  // clear out old data before new request
  $wikiElem.text('');
  $nytElem.text('');

  const streetStr = $('#street').val();
  const cityStr = $('#city').val();
  const address = `${streetStr}, ${cityStr}`;

  $greeting.text(`So, you want to live at ${address}?`);

  // load streetview
  const streetviewUrl = 'https://cdn.pixabay.com/photo/2019/08/02/11/08/japan-4379452_1280.jpg';
  $body.append(`<img class="bgimg" src="${streetviewUrl}">`);

  // load nytimes
  const nytimesUrl = `http://api.nytimes.com/svc/search/v2/articlesearch.json?q=${cityStr}&sort=newest&api-key=7vzH5AwW66mGFFZrXo68um2QcC02ywTA`;
  $.getJSON(nytimesUrl, (data) => {
    $nytHeaderElem.text(`New York Times Articles About ${cityStr}`);

    const articles = data.response.docs;
    for (let i = 0; i < articles.length; i++) {
      const article = articles[i];
      $nytElem.append(`<li class="article">
        <a href="${article.web_url}">${article.headline.main}</a>
        <p>${article.snippet}</p>
        </li>`);
    }
  }).error(() => {
    $nytHeaderElem.text('New York Times Articles Could Not Be Loaded');
  });


  // load wikipedia data
  const wikiUrl = `http://en.wikipedia.org/w/api.php?action=opensearch&search=${cityStr}&format=json&callback=wikiCallback`;
  const wikiRequestTimeout = setTimeout(() => {
    $wikiElem.text('failed to get wikipedia resources');
  }, 8000);

  $.ajax({
    url: wikiUrl,
    dataType: 'jsonp',
    jsonp: 'callback',
    success(response) {
      const articleList = response[1];

      for (let i = 0; i < articleList.length; i++) {
        const articleStr = articleList[i];
        const url = `http://en.wikipedia.org/wiki/${articleStr}`;
        $wikiElem.append(`<li><a href="${url}">${articleStr}</a></li>`);
      }

      clearTimeout(wikiRequestTimeout);
    },
  });
  // YOUR CODE GOES HERE!

  return false;
}

$('#form-container').submit(loadData);

// loadData();
