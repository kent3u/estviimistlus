const setHeaderStyle = () => {
  const header = document.querySelector("header");
  if (window.scrollY > 150) {
    header.classList.remove("header-thick");
    header.classList.add("header-slim");
  } else {
    header.classList.add("header-thick");
    header.classList.remove("header-slim");
  }
};

window.addEventListener("scroll", () => setHeaderStyle());

const toggleNavHidden = () => {
  document.querySelector('nav').classList.toggle('hidden');
};

document.addEventListener('DOMContentLoaded', () => {
  setHeaderStyle();
  if (window.innerWidth > 991) {
    toggleNavHidden();
  }
  let hamburger = document.querySelector('.hamburger');
  let navLinks = document.querySelectorAll('nav li');
  [hamburger, ...navLinks].forEach(function (element) {
    element.addEventListener('click', () => {
      if (window.innerWidth < 991) {
        toggleNavHidden();
      }
      hamburger.classList.toggle('is-active');
    });
  })
});

function showNextButton(boolean) {
  if (boolean) {
    document.querySelector('.next-image').classList.remove('hidden');
  } else {
    document.querySelector('.next-image').classList.add('hidden');
  }
}

function showPrevButton(boolean) {
  if (boolean) {
    document.querySelector('.previous-image').classList.remove('hidden');
  } else {
    document.querySelector('.previous-image').classList.add('hidden');
  }
}

function setNextButtonImageIndex(newIndex) {
  document.querySelector('.next-image').setAttribute('image-index', newIndex);
}

function setPreviousButtonImageIndex(newIndex) {
  document.querySelector('.previous-image').setAttribute('image-index', newIndex);
}

function setIndexIndicator(imageIndex) {
  const indicators = document.querySelectorAll('.image-index-indicator-item');
  for (let i = 0; i < indicators.length; i++) {
    if (i === imageIndex) {
      indicators[i].classList.add('is-active');
    } else {
      indicators[i].classList.remove('is-active');
    }
  }
}

function lightboxShowNextIndex(imageIndex, galleryName) {
  const galleryImages = document.querySelectorAll(`img[data-lightbox=${galleryName}]`);
  if (imageIndex === galleryImages.length - 1) {
    showNextButton(false);
    setNextButtonImageIndex(null)
  } else {
    setNextButtonImageIndex(imageIndex+1)
  }
  showPrevButton(true)
  setPreviousButtonImageIndex(imageIndex-1)

  setLightboxMainImage(galleryImages[imageIndex].src)
  setIndexIndicator(imageIndex);
}

function setLightboxMainImage(src) {
  document.querySelector('.lightbox-main-image').setAttribute('src', src);
}

function lightboxShowPreviousIndex(imageIndex, galleryName) {
  const galleryImages = document.querySelectorAll(`img[data-lightbox=${galleryName}]`);
  if (imageIndex === 0) {
    showPrevButton(false);
    setPreviousButtonImageIndex(null)
  } else {
    setPreviousButtonImageIndex(imageIndex-1)
  }
  showNextButton(true)
  setNextButtonImageIndex(imageIndex+1)

  setLightboxMainImage(galleryImages[imageIndex].src)
  setIndexIndicator(imageIndex);
}

document.body.addEventListener('click', (event) => {
  if (event.target.className === 'lightbox' || event.target.id === 'close-icon') {
    document.querySelector('.lightbox').remove();
    toggleDisableScroll();
  } else if (event.target.className === 'next-image') {
    lightboxShowNextIndex(Number(event.target.getAttribute('image-index')), event.target.getAttribute('data-lightbox'));
  } else if (event.target.className === 'previous-image') {
    lightboxShowPreviousIndex(Number(event.target.getAttribute('image-index')), event.target.getAttribute('data-lightbox'))
  }
})

function getLightboxAdditionalButtons(data) {
  return `
    <button aria-label="Previous" class="previous-image hidden" data-lightbox="${data[0].getAttribute('data-lightbox')}">
        <div></div>
    </button>
    ${(() => {
      if (data[1]) {
        return `
          <button aria-label="Next" class="next-image" image-index="1" data-lightbox="${data[0].getAttribute('data-lightbox')}">
            <div></div>
          </button>
        `
      } else {
        return ''
      }
    })()}
    <div class="image-index-indicator-wrapper">
        ${(() => {
    return '<div class="image-index-indicator-item is-active"></div>' + '<div class="image-index-indicator-item"></div>'.repeat(data.length - 1);
  })()}
    </div>
  `;
}

function liqhtboxTemplate(data) {
  // todo move logic down
  return `
    <div class="lightbox">
        <div id="close-icon">
            <svg aria-label="Close gallery" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#000000" stroke-width="0.00024000000000000003"><path fill-rule="evenodd" clip-rule="evenodd" d="M19.207 6.207a1 1 0 0 0-1.414-1.414L12 10.586 6.207 4.793a1 1 0 0 0-1.414 1.414L10.586 12l-5.793 5.793a1 1 0 1 0 1.414 1.414L12 13.414l5.793 5.793a1 1 0 0 0 1.414-1.414L13.414 12l5.793-5.793z" fill="#f2f2f2"></path></svg>
        </div>
        <div class="lightbox-content-wrapper">
          <img class="lightbox-main-image" src="${data[0].src}" alt="lightbox main image">
            ${(() => {
              if (data[1]) {
                return getLightboxAdditionalButtons(data);
              } else {
                return '';
              }
            })()}
        </div>
    </div>
  `
}

function toggleDisableScroll() {
  document.body.classList.toggle('disable-scroll');
}

function startLightBox(galleryName) {
  const images = document.querySelectorAll(`[data-lightbox=${galleryName}]`)

  document.querySelector('body').insertAdjacentHTML("afterbegin", liqhtboxTemplate(images));
  toggleDisableScroll();
}

document.querySelectorAll('[data-lightbox]:not(.hidden)').forEach((element) => {
  const galleryName = element.getAttribute('data-lightbox');
  element.addEventListener('click', () => {
    startLightBox(galleryName);
  })
});

document.querySelector('#load-more').addEventListener('click', () => {
  const hiddenImages = document.querySelectorAll('.gallery-item.hidden');
  const showImagesAmount = hiddenImages.length >= 4 ? 4 : hiddenImages.length;

  for (let i = 0; i < showImagesAmount; i++) {
    hiddenImages[i].classList.remove('hidden');
  }

  if (hiddenImages.length - showImagesAmount === 0) {
    document.querySelector('#load-more').parentElement.classList.add('hidden');
  }
});
