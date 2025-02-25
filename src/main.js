import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

import { fetchImages } from './js/pixabay-api.js';
import { renderGallery } from './js/render-functions.js';

import iconPath from './img/bi_x-octagon.svg';

const form = document.querySelector('.search-form');
const loader = document.querySelector('.loader');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');

let query = '';
let page = 1;
let totalHits = 0;
const perPage = 40;

form.addEventListener('submit', async event => {
  event.preventDefault();
  query = event.target.elements.searchQuery.value.trim();

  if (!query) {
    iziToast.show({
      messageColor: '#fff',
      iconColor: '#fff',
      iconUrl: iconPath,
      title: '',
      message: 'Please enter a search query!',
      position: 'topRight',
    });
    return;
  }

  loader.style.display = 'block';
  gallery.innerHTML = '';
  page = 1;
  totalHits = 0;
  loadMoreBtn.classList.add('hidden');

  try {
    const data = await fetchImages(query, page, perPage);
    totalHits = data.totalHits;
    renderGallery(data.hits);

    if (totalHits === 0) {
      iziToast.show({
        backgroundColor: 'rgba(239, 64, 64, 1)',
        messageColor: '#ffffff',
        iconColor: '#fff',
        iconUrl: iconPath,
        messageSize: '16px',
        transitionIn: 'bounceInLeft',
        position: 'topRight',
        displayMode: 'replace',
        closeOnClick: true,
        message:
          'Sorry, there are no images matching your search query. Please try again!',
      });
      loadMoreBtn.classList.add('hidden');
      return;
    }

    if (data.hits.length === perPage) {
      loadMoreBtn.classList.remove('hidden');
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    loader.style.display = 'none';
  }

  event.target.reset();
});

loadMoreBtn.addEventListener('click', async () => {
  page += 1;
  loader.style.display = 'block';

  try {
    const data = await fetchImages(query, page, perPage);
    renderGallery(data.hits);
    scrollPage();

    if (data.hits.length < perPage || page * perPage >= totalHits) {
      loadMoreBtn.classList.add('hidden');
      iziToast.info({
        messageColor: '#fff',
        iconColor: '#fff',
        backgroundColor: '#AFEEEE',
        message: "We're sorry, but you've reached the end of search results.",
        position: 'topRight',
      });
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    loader.style.display = 'none';
  }
});

function scrollPage() {
  const card = document.querySelector('.gallery-item');
  if (card) {
    const cardHeight = card.getBoundingClientRect().height;
    window.scrollBy({
      top: cardHeight * 2,
      behavior: 'smooth',
    });
  }
}
