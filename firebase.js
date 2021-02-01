const firebaseConfig = {
    apiKey: "",
    authDomain: "",
    databaseURL: "",
    projectId: "",
    storageBucket: "",
    messagingSenderId: "",
};

firebase.initializeApp(firebaseConfig);

fetch('https://extreme-ip-lookup.com/json/').then(res => res.json()).then(response => {
    chrome.storage.local.set({ countryCode: response.countryCode });
}).catch((data, status) => {
    console.log('REQUEST FAILED')
})

let brandsToSet = [];
let domains = [];

// SET ALL CATEGORIES
firebase.database().ref('Translations/fr/Categories').once('value').then((snap) => {
    let data = snap.val();
    const categories = Object.keys(data);
    chrome.storage.local.set({ categories: categories });
});

// SET ALL BRANDS HREFS
firebase.database().ref('brands').once('value').then((snap) => {
    const data = snap.val();
    if (data) {
        chrome.storage.local.get(['countryCode'], result => {
            if (result.countryCode) {
                Object.values(data).forEach((item) => {
                    if (item.localisation) {
                        const brandCountryCodes = item.localisation.split(' ');
                        if (brandCountryCodes.indexOf(result.countryCode) !== -1 || brandCountryCodes.indexOf("worldwide") !== -1) {
                            if (item.href) {
                                let domainItem = item.href.split('/')[2]
                                if (domainItem && domainItem !== undefined) {
                                    if (domainItem.split('.').length > 3) {
                                        domains.push('*://' + domainItem.slice(domainItem.indexOf('.') + 1, domainItem.length) + '/*');
                                    } else {
                                        domains.push('*://' + domainItem + '/*');
                                    }
                                }
                                brandsToSet.push({
                                    href: item.href,
                                    name: item.name,
                                    pic: item.pic,
                                    offerId: item.offerId,
                                    localisation: item.localisation,
                                    categorie: item.categories
                                })
                            }
                        }
                    }
                });
                chrome.storage.local.set({ domains });
                let contextMenuItem = {
                    "id": "shopMyInfluens",
                    "title": "ShopMyInfluens - Add Article",
                    "contexts": ["image"],
                    "documentUrlPatterns": domains
                }
                chrome.contextMenus.create(contextMenuItem);
                chrome.storage.local.set({ brands: brandsToSet });
            }
        });
    }
});

chrome.tabs.onActivated.addListener((info) => {
    let tab = chrome.tabs.get(info.tabId, (tab) => {
        if (tab.active) {
            chrome.storage.local.get(['domains'], result => {
                let inDomain = false;
                result.domains.forEach(domain => {
                    baseDomain = domain.split('/')[2];
                    if (tab.url.includes(baseDomain)) {
                        chrome.browserAction.setIcon({
                            path: './images/green-logo/smi32.png'
                        })
                        inDomain = true;
                    } else {
                        if (!inDomain) {
                            chrome.browserAction.setIcon({
                                path: './images/red-logo/smi32.png'
                            })
                        }
                    }
                });
            })
        }
    });
});

chrome.tabs.onUpdated.addListener((tabId, change, tab) => {
    if (tab.active) {
        chrome.storage.local.get(['domains'], result => {
            let inDomain = false;
            result.domains.forEach(domain => {
                baseDomain = domain.split('/')[2];
                if (tab.url.includes(baseDomain)) {
                    chrome.browserAction.setIcon({
                        path: './images/green-logo/smi32.png'
                    })
                    inDomain = true;
                } else {
                    if (!inDomain) {
                        chrome.browserAction.setIcon({
                            path: './images/red-logo/smi32.png'
                        })
                    }
                }
            });
        })
    }
});

chrome.contextMenus.onClicked.addListener((clickedData) => {
    if (clickedData.menuItemId === 'shopMyInfluens') {
        if (clickedData.srcUrl && clickedData.pageUrl) {
            let user = firebase.auth().currentUser;
            if (user) {
                chrome.storage.local.get(['wishlistId', 'brands'], result => {
                    let brands = result.brands;
                    let wishlistId = result.wishlistId
                    let baseUrlSplitArray;
                    let baseUrlBrandName;
                    if (wishlistId) {
                        chrome.tabs.query({
                            active: true,
                            currentWindow: true
                        }, (tabs) => {
                            baseUrlSplitArray = tabs[0].url.split('/')[2].split('.');
                            if (baseUrlSplitArray.length === 2) {
                                baseUrlBrandName = baseUrlSplitArray[0];
                            } else if (baseUrlSplitArray.length === 3) {
                                baseUrlBrandName = baseUrlSplitArray[1];
                            }
                            let brand;
                            brands.forEach(item => {
                                if (baseUrlBrandName && item.href.includes(baseUrlBrandName))
                                    brand = item;
                            });
                            if (brand) {
                                const xhr = new XMLHttpRequest();
                                xhr.open('post', 'https://us-central1-shopmyinfluens.cloudfunctions.net/globalApi/influencer/article', true);
                                xhr.setRequestHeader('Content-Type', 'application/json');
                                let imageLink = (clickedData.linkUrl) ? clickedData.linkUrl : clickedData.srcUrl;
                                const jsonBody = {
                                    "uid": user.uid,
                                    "imageUrl": imageLink,
                                    "path": clickedData.pageUrl,
                                    "offerId": brand.offerId,
                                    "wishlistId": wishlistId
                                }
                                xhr.send(JSON.stringify(jsonBody));
                                xhr.onload = () => {
                                    if (xhr.status >= 200 && xhr.status < 300) {
                                        let notifOptions = {
                                            type: 'basic',
                                            iconUrl: 'images/green-logo/smi48.png',
                                            title: 'Product Added !',
                                            message: 'Product added to current wishlist successfully !'
                                        }
                                        chrome.notifications.create('successAddProductNotif', notifOptions);
                                    }
                                }
                            }
                        });
                    } else {
                        let notifOptions = {
                            type: 'basic',
                            iconUrl: 'images/red-logo/smi48.png',
                            title: 'No wishlist selected !',
                            message: 'Please select/create a wishlist !'
                        }
                        chrome.notifications.create('successAddProductNotif', notifOptions);
                    }
                })
            } else {
                let notifOptions = {
                    type: 'basic',
                    iconUrl: 'images/red-logo/smi48.png',
                    title: 'You are not logged in !',
                    message: 'Please login with your personnal account !'
                }
                chrome.notifications.create('successAddProductNotif', notifOptions);
            }
        }
    }
});

chrome.runtime.onConnect.addListener((port) => {
    console.assert(port.name == "firebase");
    port.onMessage.addListener((message) => {
        if (message.request === 'login') {
            let email = message.data.email;
            let password = message.data.password;
            firebase.auth().signInWithEmailAndPassword(email, password).catch(error => {
                let errorCode = error.code;
                let errorMessage = error.message;
                port.postMessage({
                    type: 'login',
                    status: 'error',
                    data: {
                        errorCode: errorCode,
                        errorMessage: errorMessage
                    }
                });
            });
            firebase.auth().onAuthStateChanged((user) => {
                if (user) {
                    port.postMessage({
                        type: 'login',
                        status: 'success',
                        data: user
                    });
                }
            });
        } else if (message.request === 'logout') {
            firebase.auth().signOut().then(() => {
                port.postMessage({
                    type: 'logout',
                    status: 'success'
                });
            }).catch(error => {
                port.postMessage({
                    type: 'logout',
                    status: 'error',
                    error: error
                });
            });
        } else if (message.request === 'checkLogin') {
            let user = firebase.auth().currentUser;
            if (user) {
                port.postMessage({
                    type: 'checkLogin',
                    status: 'success',
                    message: user
                });
            } else {
                port.postMessage({
                    type: 'checkLogin',
                    status: 'no-login',
                    message: false
                })
            }
        } else if (message.request === 'fetchInfluencerInfos') {
            let user = firebase.auth().currentUser;
            if (user) {
                firebase.database().ref('influencers/' + user.uid).once('value').then((snap) => {
                    let data = snap.val();
                    if (data) {
                        port.postMessage({
                            type: 'influencerInfo',
                            status: 'success',
                            data: { ...data, key: user.uid }
                        });
                    } else {
                        port.postMessage({
                            type: 'influencerInfo',
                            status: 'success',
                            data: null
                        })
                    };
                }).catch(error => {
                    port.postMessage({
                        type: 'influencerInfo',
                        status: 'error',
                        error: error
                    });
                });
            } else {
                port.postMessage({
                    type: 'login',
                    status: 'no-login',
                    message: false
                });
            }
        } else if (message.request === 'fetchInfluencerWishlists') {
            let user = firebase.auth().currentUser;
            if (user) {
                firebase.database().ref('wishlists').orderByChild('uid').equalTo(user.uid).once('value').then((snap) => {
                    const data = snap.val();
                    let wishlists = [];
                    if (data) {
                        Object.values(data).forEach((d, i) => {
                            wishlists.push({
                                ...d,
                                key: Object.keys(data)[i]
                            });
                        });
                        port.postMessage({
                            type: 'wishlistsFetch',
                            status: 'success',
                            data: {
                                wishlists: wishlists
                            }
                        });
                    } else {
                        port.postMessage({
                            type: 'wishlistsFetch',
                            status: 'success',
                            data: { wishlists: [] }
                        });
                    }
                }).catch(error => {
                    port.postMessage({
                        type: 'wishlistsFetch',
                        status: 'error',
                        error: error
                    });
                });
            } else {
                port.postMessage({
                    type: 'login',
                    status: 'no-login',
                    message: false
                });
            }
        } else if (message.request === 'saveWishlist') {
            let user = firebase.auth().currentUser;
            if (user) {
                let newRef = firebase.database().ref('wishlists').push();
                newRef.set({
                    id: newRef.key,
                    createdAt: Math.round(Date.now() / 1000).toString(),
                    name: message.data.wishlistName.toUpperCase(),
                    uid: user.uid
                }).then((result) => {
                    chrome.storage.local.set({ wishlistId: newRef.key }, () => {
                    });
                    port.postMessage({
                        type: 'saveWishlist',
                        status: 'success'
                    })
                }).catch((error) => {
                    port.postMessage({
                        type: 'saveWishlist',
                        status: 'error',
                        message: error
                    });
                });
            } else {
                port.postMessage({
                    type: 'login',
                    status: 'no-login',
                    message: false
                });
            }
        } else if (message.request === 'setActiveWishlist') {
            chrome.storage.local.set({ wishlistId: message.data.wishlistId }, () => {
            });
        } else if (message.request === 'getActiveWishlist') {
            chrome.storage.local.get(['wishlistId'], result => {
            })
        } else if (message.request === 'fetchBrands') {
            chrome.storage.local.get(['brands'], result => {
                port.postMessage({
                    type: 'brandsFetch',
                    status: 'success',
                    data: result
                });
            });
        } else if (message.request === 'fetchCategories') {
            chrome.storage.local.get(['categories'], result => {
                port.postMessage({
                    type: 'categoriesFetch',
                    status: 'success',
                    data: result
                });
            });
        };
    });
});