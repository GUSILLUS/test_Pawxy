const BASE_URL = 'https://customsearch.googleapis.com/customsearch/v1';
const API_KEY = 'AIzaSyBE_jTwDqs6FJ88eDAOMDhQvxnNYuRpoq8';
const SEARCH_ENGINE_KEY = '944da4e9b7efe4287';

const searchIn = document.querySelector('#searchInput')
const searchIcon = document.querySelector('.search-bar__img')
const videoContainer = document.querySelector('.video-list__container');
const buttonNext = document.querySelector('#buttonNext');
const buttonPrev = document.querySelector('#buttonPrev');

const googleLinkB = document.querySelector('#navigation__google-link-b');
const googleLink = document.querySelector('.navigation__google-link');

let start = 1;
let page = 1;

const pageNumber = document.querySelector('.navigation__page-number');

const searchFunction = function (searchTer, start = 1) {
  fetch(`${BASE_URL}?key=${API_KEY}&cx=${SEARCH_ENGINE_KEY}&q=${searchTer}+more:pagemap:videoobject:genre-music&start=${start}&num=5`)
    .then(res => res.json())
    .then(res => render(res.items))
}

function render(datas) {
  videoContainer.innerHTML = '';

  if (datas) {
    buttonNext.classList.add('show');
    googleLink.classList.add('#navigation__google-link--active');
  } else {
    buttonNext.classList.remove('show');
    googleLink.classList.remove('#navigation__google-link--active');
  }

  if (start > 1) {
    buttonPrev.classList.add('show');
    pageNumber.textContent = page;
  } else {
    buttonPrev.classList.remove('show');
    pageNumber.textContent = '';
  }

  googleLinkB.textContent = searchIn.value;
  googleLink.setAttribute('href', `https://www.google.com/search?q=${searchIn.value}`);

  datas.forEach(data => {
    const { pagemap } = data;
    const { videoobject } = pagemap;

    const { views, link, youtubeImg, linkDiv,
      videoDetails, personName, itemTitle, infoContainer,
      image, imageText, dataItem, littleDot } = create()

    dataItem.classList.add('video-list__item');

    image.classList.add('video-list__image');
    image.setAttribute('src', videoobject[0].thumbnailurl);


    imageText.classList.add('video-list__time-duration');
    imageText.textContent = timeDuration(videoobject[0].duration, imageText)

    infoContainer.classList.add('video-list__info-container');

    itemTitle.classList.add('video-list__title');
    itemTitle.textContent = videoobject[0].name;

    personName.classList.add('video-list__person-name');
    personName.textContent = pagemap.person[0].name;
    personName.setAttribute('href', pagemap.person[0].url);
    personName.setAttribute('target', '_blank');

    videoDetails.classList.add('video-list__videoDetails');

    linkDiv.classList.add('video-list__linkDiv');


    youtubeImg.classList.add('video-list__videoDetails-img');
    youtubeImg.setAttribute('src', './assets/svg/yt.svg');

    link.classList.add('video-list__videoDetails-link');
    link.textContent = data.displayLink.split('.').slice(1).join('.');
    link.setAttribute('href', data.link);
    link.setAttribute('target', '_blank');

    views.classList.add('video-list__videoDetails-views');
    views.textContent = `${videoobject[0].interactioncount.viewsTransform()} views`;

    append({
      views,
      link,
      youtubeImg,
      linkDiv,
      videoDetails,
      personName,
      itemTitle,
      infoContainer,
      image,
      imageText,
      dataItem,
    });

    image.addEventListener('click', () => {
      embedOpen(videoobject[0], youtubeImg, views, personName, littleDot);
    })
    itemTitle.addEventListener('click', () => {
      embedOpen(videoobject[0], youtubeImg, views, personName, littleDot);
    })
  })
}

function create() {
  const views = document.createElement('p');
  const link = document.createElement('a');
  const youtubeImg = document.createElement('IMG');
  const linkDiv = document.createElement('div');
  const videoDetails = document.createElement('div');
  const personName = document.createElement('a');
  const itemTitle = document.createElement('h2');
  const infoContainer = document.createElement('div');
  const imageText = document.createElement('p');
  const image = document.createElement('IMG');
  const dataItem = document.createElement('div');
  const littleDot = document.createElement('IMG')

  return {
    views,
    link,
    youtubeImg,
    linkDiv,
    videoDetails,
    personName,
    itemTitle,
    infoContainer,
    image,
    imageText,
    dataItem,
    littleDot,
  }
}

function append(obj) {
  const { views, link, youtubeImg, linkDiv,
    videoDetails, personName, itemTitle, infoContainer,
    image, imageText, dataItem } = obj;

  videoContainer.append(dataItem);
  dataItem.append(image);
  dataItem.append(imageText)
  dataItem.append(infoContainer);
  infoContainer.append(itemTitle);
  infoContainer.append(personName);
  infoContainer.append(videoDetails);
  videoDetails.append(linkDiv);
  linkDiv.append(youtubeImg);
  linkDiv.append(link);
  videoDetails.append(views);
}

function embedOpen(data, youtubeImg, views, personName, littleDot) {
  const container = document.querySelector('.embed-player__container');
  const iframe = document.querySelector('#iframe');
  const title = document.querySelector('.embed-player__video-title');
  const infoDiv = document.querySelector('.embed-player__video-info');
  const closeIcon = document.querySelector('.embed-player__video-close');
  const visitButton = document.querySelector('#visitButton');
  const closeButton = document.querySelector('#closeButton');

  const cloneImg = youtubeImg.cloneNode(true);
  const cloneViews = views.cloneNode(true);
  const clonePersonName = personName.cloneNode(true);
  const cloneDot = littleDot.cloneNode(true);

  closeIcon.addEventListener('click', embedClose);
  closeButton.addEventListener('click', embedClose);

  visitButton.setAttribute('href', data.url);

  littleDot.setAttribute('src', './assets/svg/Ellipse.svg')
  littleDot.classList.add('embed-player__dotImg');

  container.classList.add('.embed-player__container--active');
  iframe.setAttribute('src', data.embedurl)
  title.textContent = data.name;

  if (!infoDiv.children.length) {
    infoDiv.append(cloneImg);
    infoDiv.append(clonePersonName);
    infoDiv.append(cloneDot);
    infoDiv.append(cloneViews);
  }
}

function embedClose() {
  const container = document.querySelector('.embed-player__container');
  container.classList.remove('.embed-player__container--active');

  const iframe = document.querySelector('#iframe');
  iframe.setAttribute('src', '')
}

function viewsTransform(min) {
  min = min || 1e3;
  // Alter numbers larger than 1k
  if (this >= min) {
    const units = ["k", "M", "B", "T"];

    const order = Math.floor(Math.log(this) / Math.log(1000));

    const unitname = units[(order - 1)];
    const num = Math.round(this / 1000 ** order);

    // output number remainder + unitname
    return num + unitname
  }

  // return formatted original number
  return this.toLocaleString()
}

function timeDuration(string, el) {
  const minIndex = string.indexOf('M')
  let minutes = +string.slice(2, minIndex);
  let hours;
  const seconds = +string.slice(minIndex + 1, -1) > 9
    ? string.slice(minIndex + 1, -1)
    : 0 + string.slice(minIndex + 1, -1);

  if (minutes > 59) {
    minutes = Math.round((minutes / 60) % 60);
    hours = Math.round((+string.slice(2, minIndex) / 60));

    el.style.transform = 'translateX(-50%)';

    return `${hours}:${minutes}:${seconds}`
  } else {
    return `${minutes}:${seconds}`;
  }
}

Number.prototype.viewsTransform = viewsTransform
String.prototype.viewsTransform = viewsTransform

buttonNext.addEventListener('click', () => {
  start += 5;
  page += 1;

  searchFunction(searchIn.value, start);
});

buttonPrev.addEventListener('click', () => {
  if (page < 1) { return }
  start -= 5;
  page -= 1;

  searchFunction(searchIn.value, start);
});

searchIcon.addEventListener('click', () => {
  searchFunction(searchIn.value)
})

searchIn.addEventListener('keyup', (e) => {
  if (e.keyCode === 13) {
    searchFunction(searchIn.value)
  }
});




// Add method to prototype. this allows you to use this function on numbers and strings directly


