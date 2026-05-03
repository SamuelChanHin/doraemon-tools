import Doraemon from './api/doraemonApi.js';
import Element from './element.js';
import LocalStorage from './utils/localStorage.js';

const localStorageKey = {
  DORAEMON_TOOLS: 'DORAEMON_TOOLS',
  DORAEMON_TOOL_COUNT: 'DORAEMON_TOOL_COUNT',
  DORAEMON_MOVIES: 'DORAEMON_MOVIES',
  DORAEMON_MOVIE_COUNT: 'DORAEMON_MOVIE_COUNT',
};

const PAGE = {
  TOOL: 'TOOL',
  MOVIE: 'MOVIE',
};

const DISPLAY_MODE = {
  SINGLE_MODE: 'SINGLE_MODE',
  MULTIPLE_MODE: 'MULTIPLE_MODE',
};

export default class Main {
  currentPage = PAGE.TOOL;
  currentDisplayMode = DISPLAY_MODE.SINGLE_MODE;
  elements;
  doraemonToolCount;
  page = 1;
  pageSize = 5;
  inifinityScrollReachBottomThreshold = 10;
  inifinityScrollToTopButtonDisplayThreshold = 2000;
  isJustReset = false;
  stopFetching = false;

  constructor() {
    this.init();
  }

  async init() {
    this.elements = new Element();
    this.refetchButtonEvent();
    this.modeSwitchEvent();
    this.inifinityScrollEvent();
    this.scrollToTopEvent();
    this.navigationButtonEvent();

    this.run();
    // this.displayModeToggle();
  }

  run() {
    console.log('start running...');
    this.reset();
    this.updateToolCount();
    this.modeSwitchAction();
  }

  modeSwitchAction() {
    if (this.currentDisplayMode === DISPLAY_MODE.SINGLE_MODE) {
      if (this.isJustReset) {
        this.createRandomCard();
        this.isJustReset = false;
      }
    } else if (this.currentDisplayMode === DISPLAY_MODE.MULTIPLE_MODE) {
      this.scrollBottomAction(this.elements.multipleMode);
    }
  }

  navigationButtonEvent() {
    this.elements.navigationItems.forEach((navigationItem) => {
      navigationItem.addEventListener('click', () => {
        this.elements.navigationItems.forEach((e) =>
          e.classList.remove('activeItem'),
        );
        this.currentPage = navigationItem.name;
        navigationItem.classList.add('activeItem');
        this.run();
      });
    });
  }

  refetchButtonEvent() {
    this.elements.refetchButton.addEventListener('click', () =>
      this.createRandomCard(),
    );
  }

  modeSwitchEvent() {
    this.elements.displayModeToggle.addEventListener('click', () => {
      this.displayModeToggle(), this.modeSwitchAction();
    });
  }

  inifinityScrollEvent() {
    this.elements.multipleMode.addEventListener('scroll', (e) => {
      if (
        e.target.scrollTop > this.inifinityScrollToTopButtonDisplayThreshold
      ) {
        this.elements.backToTopButton.classList.remove('opacity');
      } else {
        this.elements.backToTopButton.classList.add('opacity');
      }
      this.scrollBottomAction(e.target);
    });
  }

  scrollToTopEvent() {
    this.elements.backToTopButton.addEventListener('click', () => {
      this.elements.multipleMode.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  async updateToolCount() {
    try {
      let count;
      if (this.currentPage === PAGE.TOOL) {
        count = LocalStorage.get(localStorageKey.DORAEMON_TOOL_COUNT);
      } else if (this.currentPage === PAGE.MOVIE) {
        count = LocalStorage.get(localStorageKey.DORAEMON_MOVIE_COUNT);
      }

      if (count === null) {
        if (this.currentPage === PAGE.TOOL) {
          const result = await Doraemon.getDoraemonToolCount();
          count = result.data.data;
          LocalStorage.set(localStorageKey.DORAEMON_TOOL_COUNT, count);
        } else if (this.currentPage === PAGE.MOVIE) {
          const result = await Doraemon.getDoraemonMovieCount();
          count = result.data.data;
          LocalStorage.set(localStorageKey.DORAEMON_MOVIE_COUNT, count);
        }
      }

      this.doraemonToolCount = count;

      this.elements.toolCount.innerText = count;
    } catch (error) {
      console.error(error);
      this.stopFetching = true;
      Swal.fire('Something went wrong', error.message, 'error');
    }
  }

  async createRandomCard() {
    this.loaderToggle();
    try {
      let result;

      if (this.currentPage === PAGE.TOOL) {
        result = await Doraemon.getDoraemonToolByRandom();
      } else if (this.currentPage === PAGE.MOVIE) {
        result = await Doraemon.getDoraemonMovieByRandom();
      }

      const tool = result.data?.data;

      if (tool) {
        const card = this.createSingleCardLayout(tool);

        if (this.elements.toolContainer.childNodes?.[0]) {
          this.elements.toolContainer.replaceChild(
            card,
            this.elements.toolContainer.childNodes[0],
          );
        } else {
          this.elements.toolContainer.appendChild(card);
        }
      }
    } catch (error) {
      console.error(error);
      this.stopFetching = true;
      Swal.fire('Something went wrong', error.message, 'error');
    }
    this.loaderToggle();
  }

  createSingleCardLayout(tool) {
    // console.log(tool);
    const card = document.createElement('div');
    const title = document.createElement('div');
    const description = document.createElement('div');
    const imageContainer = document.createElement('div');
    const image = document.createElement('img');

    card.classList.add('card');
    title.classList.add('cardTitle');
    description.classList.add('cardDescription');
    imageContainer.classList.add('cardImageContainer');
    image.classList.add('cardImage');

    image.src = tool.imageUrl;
    title.innerText = tool.nameTc || tool.nameJp;
    description.innerText = tool.descriptionTc || tool.descriptionJp;

    imageContainer.appendChild(image);
    card.appendChild(imageContainer);
    card.appendChild(title);
    card.appendChild(description);

    return card;
  }

  async createCardListing() {
    try {
      let result;
      if (this.currentPage === PAGE.TOOL) {
        result = await Doraemon.getDoraemonTools({
          pageSize: this.pageSize,
          page: this.page,
        });
      } else if (this.currentPage === PAGE.MOVIE) {
        result = await Doraemon.getDoraemonMovies({
          pageSize: this.pageSize,
          page: this.page,
        });
      }

      const tools = result.data?.data;
      // console.log(tools);
      if (tools) {
        this.createMultipleLayout(tools);
      }
    } catch (error) {
      console.error(error);
      this.stopFetching = true;
      Swal.fire('Something went wrong', error.message, 'error');
    }
  }

  createMultipleLayout(tools) {
    for (let tool of tools) {
      const card = this.createSingleCardLayout(tool);
      this.elements.toolsContainer.append(card);
    }
  }

  async scrollBottomAction(target) {
    if (this.stopFetching) {
      this.stopFetching = false;
      return;
    }

    const { scrollHeight, scrollTop, clientHeight } = target;
    // console.log(scrollHeight, scrollTop, clientHeight);

    if (
      scrollHeight - scrollTop - clientHeight <
      this.inifinityScrollReachBottomThreshold
    ) {
      this.page += 1;
      await this.createCardListing();

      // for those already at bottom initially, top = bottom
      if (scrollTop === 0 && scrollHeight === clientHeight) {
        await this.sleep(500);
        await this.scrollBottomAction(target);
      }
    }
  }

  reset() {
    this.elements.toolContainer.innerHTML = '';
    this.elements.toolsContainer.innerHTML = '';
    this.page = 1;
    this.isJustReset = true;
  }

  displayModeToggle() {
    if (this.elements.multipleMode.classList.contains('off')) {
      this.elements.multipleMode.classList.remove('off');
      this.elements.singleMode.classList.add('off');
      this.currentDisplayMode = DISPLAY_MODE.MULTIPLE_MODE;
    } else {
      this.elements.singleMode.classList.remove('off');
      this.elements.multipleMode.classList.add('off');
      this.currentDisplayMode = DISPLAY_MODE.SINGLE_MODE;
    }
  }

  loaderToggle() {
    this.elements.loaderContainer.style.display =
      this.elements.loaderContainer.style.display === '' ? 'flex' : '';
  }

  sleep = (t) => {
    return new Promise((res, rej) => {
      setTimeout(() => {
        res(true);
      }, t);
    });
  };
}
