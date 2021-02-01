import translations from './translation.js';

const initHTML = () => {
    let frenchLanguages = ['fr', 'fr-FR'];
    let lang;

    if (frenchLanguages.indexOf(navigator.language) !== -1) {
        lang = 'fr';
    } else {
        lang = 'en';
    }
    document.querySelector('.connection-placeholder').innerHTML = translations[lang].loginSection.connectionPlaceholder;
    document.querySelector('#email').setAttribute('placeholder', translations[lang].loginSection.emailPlaceholder);
    document.querySelector('#password').setAttribute('placeholder', translations[lang].loginSection.passwordPlaceholder);
    document.querySelector('.no-account-placeholder').innerHTML = translations[lang].loginSection.noAccountPlaceholder + ' <span class="signup-redirection"></span>';
    document.querySelector('.signup-redirection').innerHTML = translations[lang].loginSection.signupPlaceholder;
    document.querySelector('.signup-redirection').addEventListener('click', () => {
        chrome.tabs.create({ url: 'https://shopmyinfluens.fr/register'});
    });
    // document.querySelector('.forgotten-password-redirection').innerHTML = translations[lang].loginSection.forgottenPasswordPlaceholder;
    document.querySelector('#step-one').innerHTML = translations[lang].wishlistSection.stepOnePlaceholder;
    document.querySelector('.wishlist-selector-placeholder').innerHTML = translations[lang].wishlistSection.wishlistSelectorPlaceholder;
    document.querySelector('#wishlist-creation-label').innerHTML = translations[lang].wishlistSection.wishlistCreationLabel;
    document.querySelector('#wishlist-creation-placeholder').innerHTML = translations[lang].wishlistSection.wishlistCreationPlaceholder;
    document.querySelector('#step-two').innerHTML = translations[lang].wishlistSection.stepTwoPlaceholder;
    document.querySelector('.show-brand-list-button').innerHTML = translations[lang].wishlistSection.brandListPlaceholder;
    document.querySelector('.wishlist-name-placeholder').innerHTML = translations[lang].wishlistSection.wishlistNameLabel;
    document.querySelector('#wishlist').setAttribute('placeholder', translations[lang].wishlistSection.wishlistNameInputPlaceholder);
    document.querySelector('.wishlist-save-button').innerHTML = translations[lang].wishlistSection.wishlistButtonPlaceholder;
    document.querySelector('#step-two-prime').innerHTML = translations[lang].wishlistSection.stepTwoPrimePlaceholder;
    document.querySelector('.categories-selector-placeholder').innerHTML = translations[lang].wishlistSection.categoriesSelectorPlaceholder;
    document.querySelector('.instruction-placeholder').innerHTML = translations[lang].instructionsSection.stepThreePlaceholder;
}

const login = async () => {
    setLoading();
    let email = document.querySelector('#email').value;
    let password = document.querySelector('#password').value;
    port.postMessage({ request: 'login', data: { email, password } });
};

const logout = async () => {
    setLoading();
    port.postMessage({ request: 'logout' });
};

const getUserInfos = async () => {
    setLoading();
    port.postMessage({ request: 'fetchInfluencerInfos' });
};

const getUserWishlists = async () => {
    setLoading();
    port.postMessage({ request: 'fetchInfluencerWishlists' });
};

const getBrands = async () => {
    port.postMessage({ request: 'fetchBrands' });
}

const getCategories = async () => {
    port.postMessage({ request: 'fetchCategories' });
}

const addWishlist = async () => {
    setLoading();
    let inputData = document.querySelector('#wishlist').value;
    if (inputData.length !== 0) {
        port.postMessage({ request: 'saveWishlist', data: { wishlistName: inputData } });
    }
};

const setActiveWislist = async () => {
    const wishlistId = document.querySelector('.wishlist-selector').value;
    if (wishlistId !== '') {
        port.postMessage({ request: 'setActiveWishlist', data: { wishlistId: wishlistId } });
    }
};

const getActiveWishlist = async () => {
    port.postMessage({ request: 'getActiveWishlist' });
};

const setLoading = async () => {
    document.querySelector('.wishlist-section').style.display = 'none';
    document.querySelector('.login-section').style.display = 'none';
    document.querySelector('.loading').style.display = 'flex';
};

document.querySelector('.login-button').addEventListener('click', () => {
    login();
});

document.querySelector('.logout-icon').addEventListener('click', () => {
    const selectNode = document.querySelector('.wishlist-selector');
    while (selectNode.firstChild) {
        selectNode.removeChild(selectNode.firstChild);
    }
    logout();
});

document.querySelector('.wishlist-save-button').addEventListener('click', () => {
    document.querySelector('.back-button').style.display = 'none';
    addWishlist();
});

document.querySelector('.create-wishlist-button').addEventListener('click', () => {
    // document.querySelector('.create-wishlist-button').style.display = 'none';
    // document.querySelector('.cancel-wishlist-button').style.display = 'flex';
    chrome.storage.local.set({ step: 1 });
    document.querySelector('.wishlist-placeholders').style.display = 'none';
    document.querySelector('.wishlist-add-section').style.display = 'flex';
    document.querySelector('.back-button').style.display = 'flex';
    document.querySelector('.logout-icon').style.display = 'none';
});

document.querySelector('.show-brand-list-button').addEventListener('click', () => {
    chrome.storage.local.set({ step: 2 });
    document.querySelector('.wishlist-placeholders').style.display = 'none';
    document.querySelector('.choose-brand-section').style.display = 'flex';
    document.querySelector('.back-button').style.display = 'flex';
    document.querySelector('.logout-icon').style.display = 'none';
});

document.querySelector('.wishlist-selector').addEventListener('change', () => {
    getActiveWishlist();
    setActiveWislist();
});

document.querySelector('.categories-selector').addEventListener('change', (e) => {
    const selectedCategorie = e.target.value;
    chrome.storage.local.get(['brands'], result => {
        let filteredBrands = result.brands.filter(brand => {
            if (brand.categorie !== undefined && brand.categorie !== null) {
                if (Object.keys(brand.categorie).indexOf(selectedCategorie) === -1) {
                    return false;
                } else {
                    return true;
                }
            }
        });
        const brandsNode = document.querySelector('.brands-container');
        while (brandsNode.firstChild) {
            brandsNode.removeChild(brandsNode.firstChild);
        }
        if (filteredBrands.length === 0) {
            let frenchLanguages = ['fr', 'fr-FR'];
            let lang;
            if (frenchLanguages.indexOf(navigator.language) !== -1) {
                lang = 'fr';
            } else {
                lang = 'en';
            }
            let noBrandsPlaceholder = document.createElement('p');
            noBrandsPlaceholder.innerHTML = translations[lang].wishlistSection.noBrandPlaceholder;
            noBrandsPlaceholder.setAttribute('class', 'no-brand-placeholder');
            document.querySelector('.brands-container').appendChild(noBrandsPlaceholder);
        } else {
            filteredBrands.forEach(brand => {
                let brandItem = document.createElement('img');
                brandItem.setAttribute('class', 'brand-image');
                brandItem.setAttribute('src', brand.pic);
                brandItem.setAttribute('id', brand.offerId);
                brandItem.setAttribute('urlPath', brand.href);
                brandItem.addEventListener('click', e => {
                    chrome.storage.local.set({ step: 3 });
                    document.querySelector('.wishlist-section').style.display = 'none';
                    document.querySelector('.instructions-section').style.display = 'flex';
                    const newUrl = e.target.getAttribute('urlPath');
                    chrome.tabs.update({ url: newUrl });
                })
                document.querySelector('.brands-container').appendChild(brandItem);
            })
        }
    });
})

document.querySelector('.icon-container').addEventListener('click', () => {
    const passwordElement = document.querySelector('.password-icon');
    const iconElement = document.querySelector('#icon');
    const passwordInputElement = document.querySelector('#password');
    if (iconElement.getAttribute('class') === 'fas fa-eye') {
        while (passwordElement.firstChild) {
            passwordElement.removeChild(passwordElement.firstChild);
        };
        let iconElement = document.createElement('i');
        iconElement.setAttribute('class', 'fas fa-eye-slash');
        iconElement.setAttribute('id', 'icon');
        passwordInputElement.setAttribute('type', 'text');
        passwordElement.appendChild(iconElement)
    } else {
        while (passwordElement.firstChild) {
            passwordElement.removeChild(passwordElement.firstChild);
        };
        let iconElement = document.createElement('i');
        iconElement.setAttribute('class', 'fas fa-eye');
        iconElement.setAttribute('id', 'icon');
        passwordInputElement.setAttribute('type', 'password')
        passwordElement.appendChild(iconElement)
    }

});

document.querySelector('.back-button').addEventListener('click', () => {
    chrome.storage.local.get(['step'], result => {
        switch (result.step) {
            case 1:
                {
                    document.querySelector('.wishlist-add-section').style.display = 'none';
                    document.querySelector('.wishlist-placeholders').style.display = 'flex';
                    document.querySelector('.back-button').style.display = 'none';
                    document.querySelector('.logout-icon').style.display = 'flex';
                }
            case 2:
                {
                    document.querySelector('.wishlist-placeholders').style.display = 'flex';
                    document.querySelector('.choose-brand-section').style.display = 'none';
                    document.querySelector('.back-button').style.display = 'none';
                    document.querySelector('.logout-icon').style.display = 'flex';
                }
            case 3:
                {
                    chrome.storage.local.set({ step: 2 })
                    document.querySelector('.wishlist-section').style.display = 'flex';
                    document.querySelector('.instructions-section').style.display = 'none';
                }
            default: {

            }
        }
    });
});

var port = chrome.runtime.connect({ name: "firebase" });


port.onMessage.addListener((message) => {
    if (message.type === 'login') {
        if (message.status === 'success') {
            document.querySelector('.login-section').style.display = 'none';
            getUserInfos();
            getBrands();
            getCategories();
        }
        if (message.status === 'error') {
            let frenchLanguages = ['fr', 'fr-FR'];
            let lang;
            if (frenchLanguages.indexOf(navigator.language) !== -1) {
                lang = 'fr';
            } else {
                lang = 'en';
            }
            document.querySelector('.login-section').style.display = 'flex';
            document.querySelector('.loading').style.display = 'none';
            document.querySelector('.error-placeholder').style.display = 'block'
            if (message.data.errorCode === 'auth/wrong-password') {
                document.querySelector('.error-placeholder').innerHTML = translations[lang].loginSection.errors.wrongPassword;
            } else if (message.data.errorCode === 'auth/invalid-email') {
                document.querySelector('.error-placeholder').innerHTML = translations[lang].loginSection.errors.invalidEmail;
            } else if (message.data.errorCode === 'auth/user-not-found') {
                document.querySelector('.error-placeholder').innerHTML = translations[lang].loginSection.errors.userNotFound;
            } else if (message.data.errorCode === 'auth/too-many-requests') {
                document.querySelector('.error-placeholder').innerHTML = translations[lang].loginSection.errors.tooManyRequests;
            }
        }
    } else if (message.type === 'checkLogin') {
        if (message.status === 'success') {
            getBrands();
            getCategories();
            document.querySelector('.loading').style.display = 'none';
            document.querySelector('.wishlist-section').style.display = 'flex';
            document.querySelector('.logout-container').style.display = 'flex';
            getUserInfos();
        } else if (message.status === 'no-login') {
            document.querySelector('.login-section').style.display = 'flex';
            document.querySelector('.error-placeholder').style.display = 'none';
            document.querySelector('.loading').style.display = 'none';
        }
    } else if (message.type === 'logout') {
        if (message.status === 'success') {
            document.querySelector('.login-section').style.display = 'flex';
            document.querySelector('.loading').style.display = 'none';
            document.querySelector('.error-placeholder').style.display = 'none';
            document.querySelector('.logout-icon').style.display = 'none';
        } else if (message.status === 'error') {
            document.querySelector('.wishlist-section').style.display = 'flex';
        }
    } else if (message.type === 'influencerInfo') {
        if (message.status === 'success') {
            document.querySelector('.user-name').innerHTML = message.data.name;
            document.querySelector('.user-image-container').innerHTML = `<img src=${message.data.banner} width="100%" class="userImage" />`;
            getUserWishlists();
        } else if (message.status === 'error') {

        }
    } else if (message.type === 'wishlistsFetch') {
        if (message.status === 'success') {
            if (message.data.wishlists.length === 0) {
                let frenchLanguages = ['fr', 'fr-FR'];
                let lang;
                if (frenchLanguages.indexOf(navigator.language) !== -1) {
                    lang = 'fr';
                } else {
                    lang = 'en';
                }
                document.querySelector('.wishlist-selector-placeholder').innerHTML = translations[lang].wishlistSection.noWishlistsPlaceholder;
            }
            message.data.wishlists.forEach(wishlist => {
                let wishlistItem = document.createElement('option');
                wishlistItem.setAttribute('value', wishlist.id)
                wishlistItem.innerHTML = wishlist.name
                document.querySelector('.wishlist-selector').appendChild(wishlistItem);
            })
            chrome.storage.local.get(['wishlistId'], (result) => {
                if (result.wishlistId) {
                    document.querySelector('.wishlist-selector').value = result.wishlistId
                }
            });
            document.querySelector('.loading').style.display = 'none';
            document.querySelector('.wishlist-section').style.display = 'flex';
            document.querySelector('.back-button').style.display = 'none';
            document.querySelector('.logout-icon').style.display = 'flex';
        } else if (message.status === 'error') {

        }
    } else if (message.type === 'saveWishlist') {
        if (message.status === 'success') {
            const selectNode = document.querySelector('.wishlist-selector');
            while (selectNode.firstChild) {
                selectNode.removeChild(selectNode.firstChild);
            }
            getUserWishlists();
            document.querySelector('.create-wishlist-button').style.display = 'flex';
            document.querySelector('.wishlist-add-section').style.display = 'none';
            document.querySelector('.wishlist-placeholders').style.display = 'flex';
        }
    } else if (message.type === 'brandsFetch') {
        if (message.status === 'success') {
            message.data.brands.forEach(brand => {
                let brandItem = document.createElement('img');
                brandItem.setAttribute('class', 'brand-image');
                brandItem.setAttribute('src', brand.pic);
                brandItem.setAttribute('id', brand.offerId);
                brandItem.setAttribute('urlPath', brand.href);
                brandItem.addEventListener('click', e => {
                    chrome.storage.local.set({ step: 3 });
                    document.querySelector('.wishlist-section').style.display = 'none';
                    document.querySelector('.instructions-section').style.display = 'flex';
                    const newUrl = e.target.getAttribute('urlPath');
                    chrome.tabs.update({ url: newUrl });
                })
                document.querySelector('.brands-container').appendChild(brandItem);
            });
        }
    } else if (message.type === 'categoriesFetch') {
        if (message.status === 'success') {
            message.data.categories.forEach(categorie => {
                let categorieItem = document.createElement('option');
                categorieItem.innerHTML = categorie;
                categorieItem.setAttribute('value', categorie);
                document.querySelector('.categories-selector').appendChild(categorieItem);
            })
        }
    }
});

initHTML();
setLoading();

port.postMessage({ request: 'checkLogin' });