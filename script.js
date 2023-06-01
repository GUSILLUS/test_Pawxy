const BASE_URL = 'https://customsearch.googleapis.com/customsearch/v1';
const API_KEY = 'AIzaSyBE_jTwDqs6FJ88eDAOMDhQvxnNYuRpoq8';
const SEARCH_ENGINE_KEY = '944da4e9b7efe4287';

const searchIn = document.querySelector('#searchInput')
const searchIcon = document.querySelector('.svse__search-bar-img')
console.log(searchIn.value);
const videoContainer = document.querySelector('.svse__video-container');
const buttonNext = document.querySelector('#buttonNext');
const buttonPrev = document.querySelector('#buttonPrev');

const googleLinkB = document.querySelector('#svse__google-link-b');
const googleLink =  document.querySelector('.svse__google-link');

let start = 1;
let page = 1;

const pageNumber = document.querySelector('.svse__page-number');

const searchFunction = function(searchTer, start=1) {
  fetch(`https://www.googleapis.com/customsearch/v1?key=${API_KEY}&cx=${SEARCH_ENGINE_KEY}&q=${searchTer}+more:pagemap:videoobject:genre-music&start=${start}&num=5`)
  .then(res => res.json())
  .then(res => render(res.items))
}

function render(datas) {
  videoContainer.innerHTML = '';
  console.log(datas)

  if (datas) {
    buttonNext.classList.add('show');
    googleLink.classList.add('svse__google-link--active');
  } else {
    buttonNext.classList.remove('show');
    googleLink.classList.remove('svse__google-link--active');
  }

  if(start > 1 && datas) {
    buttonPrev.classList.add('show');
    pageNumber.textContent = page;
  } else {
    buttonPrev.classList.remove('show');
    pageNumber.textContent = '';
  }

  googleLinkB.textContent = searchIn.value;
  googleLink.setAttribute('href',`https://www.google.com/search?q=${searchIn.value}`);

  datas.forEach(data => {
    const { pagemap } = data;
    const { videoobject } = pagemap;

    const [ views, link, youtubeImg, linkDiv,
      linkDetails, personName, itemTitle, infoContainer,
      image, imageText, dataItem, littleDot ] = create()

    dataItem.classList.add('svse__video-item');

    image.classList.add('svse__video-image');
    image.setAttribute('src', videoobject[0].thumbnailurl);
    

    imageText.classList.add('svse__image-text');
    imageText.textContent =
      `${videoobject[0].duration.slice(2,3)}:${+videoobject[0].duration.slice(4,-1) > 9 
          ? videoobject[0].duration.slice(4,-1) 
          : '0'+videoobject[0].duration.slice(4,-1)}`

    infoContainer.classList.add('svse__video-info-con');

    itemTitle.classList.add('svse__video-title');
    itemTitle.textContent = videoobject[0].name;

    personName.classList.add('svse__video-person-name');
    personName.textContent = pagemap.person[0].name;
    personName.setAttribute('href', pagemap.person[0].url);
    personName.setAttribute('target', '_blank');

    linkDetails.classList.add('svse__linkDetails');

    linkDiv.classList.add('svse__linkDiv');


    youtubeImg.classList.add('svse__linkDetails-img');
    youtubeImg.setAttribute('src', './assets/svg/yt.svg');

    link.classList.add('svse__linkDetails-link');
    link.textContent = data.displayLink.split('.').slice(1).join('.');
    link.setAttribute('href', data.link);
    link.setAttribute('target', '_blank');

    views.classList.add('svse__linkDetails-views');
    views.textContent = `${videoobject[0].interactioncount.commarize()} views`;
    
    append(
      views, link, youtubeImg, linkDiv,
      linkDetails, personName, itemTitle, infoContainer,
      image, imageText, dataItem
    );
    
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
  const linkDetails = document.createElement('div');
  const personName = document.createElement('a');
  const itemTitle = document.createElement('h2');
  const infoContainer = document.createElement('div');
  const imageText = document.createElement('p');
  const image = document.createElement('IMG');
  const dataItem = document.createElement('div');
  const littleDot = document.createElement('IMG')

  const arr = [views, link, youtubeImg, linkDiv,
    linkDetails, personName, itemTitle, infoContainer,
    image, imageText, dataItem, littleDot]

  return arr;
}

function append(...arr) {
  const [ views, link, youtubeImg, linkDiv,
    linkDetails, personName, itemTitle, infoContainer,
    image, imageText, dataItem ] = [...arr];

  videoContainer.append(dataItem);
  dataItem.append(image);
  dataItem.append(imageText)
  dataItem.append(infoContainer);
  infoContainer.append(itemTitle);
  infoContainer.append(personName);
  infoContainer.append(linkDetails);
  linkDetails.append(linkDiv);
  linkDiv.append(youtubeImg);
  linkDiv.append(link);
  linkDetails.append(views);
}

function embedOpen(data, youtubeImg, views, personName, littleDot) {
  const container = document.querySelector('.svse__embed-container');
  const iframe = document.querySelector('#iframe');
  const title = document.querySelector('.svse__embed-video-title');
  const infoDiv = document.querySelector('.svse__embed-video-info');
  const closeIcon = document.querySelector('.svse__embed-video-close');
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
  littleDot.classList.add('svse__dotImg');

  container.classList.add('svse__embed-container--active');
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
  const container = document.querySelector('.svse__embed-container');
  container.classList.remove('svse__embed-container--active');

  const iframe = document.querySelector('#iframe');
  iframe.setAttribute('src', '')
}

function commarize(min) {
  min = min || 1e3;
  // Alter numbers larger than 1k
  if (this >= min) {
    var units = ["k", "M", "B", "T"];
    
    var order = Math.floor(Math.log(this) / Math.log(1000));

    var unitname = units[(order - 1)];
    var num = Math.round(this / 1000 ** order);
    
    // output number remainder + unitname
    return num + unitname
  }
  
  // return formatted original number
  return this.toLocaleString()
}

Number.prototype.commarize = commarize
String.prototype.commarize = commarize

buttonNext.addEventListener('click', () => {
  start += 5;
  page += 1;

  searchFunction(searchIn.value, start);
});

buttonPrev.addEventListener('click', () => {
  if (page < 1) {return}
  start -= 5;
  page -= 1;

  searchFunction(searchIn.value, start);
});

searchIcon.addEventListener('click', () => {
  searchFunction(searchIn.value)
})

searchIn.addEventListener('keyup', (e) => {
  if (e.keyCode !== 13) {
    return;
  } else {
    searchFunction(searchIn.value)
  }
});




// Add method to prototype. this allows you to use this function on numbers and strings directly


   