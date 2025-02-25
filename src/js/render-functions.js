import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

let lightbox;

export function renderGallery(images) {
  const gallery = document.querySelector('.gallery');
  const markup = images
    .map(
      img => `
      <li class='gallery-item'>
  <a href="${img.largeImageURL}" class='gallery-link'>
    <img class='gallery-img' src="${img.webformatURL}" alt="${img.tags}" />
    <div class="image-info">
      <div class="info-block">
        <p>Likes</p>
        <span>${img.likes}</span>
      </div>
      <div class="info-block">
        <p>Views</p>
        <span>${img.views}</span>
      </div>
      <div class="info-block">
        <p>Comments</p>
        <span>${img.comments}</span>
      </div>
      <div class="info-block">
        <p>Downloads</p>
        <span>${img.downloads}</span>
      </div>
    </div>
  </a>
</li>
`
    )
    .join('');

  gallery.insertAdjacentHTML('beforeend', markup);

  if (!lightbox) {
    lightbox = new SimpleLightbox('.gallery a');
  } else {
    lightbox.refresh();
  }
}
